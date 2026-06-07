import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import authAPI from '@/services/auth';
import profileAPI from '@/services/profile';
import { unsubscribeFromPush } from '@/lib/pushNotifications';
import { queryClient } from '@/lib/queryClient';
import { clearNotificationModuleState } from '@/hooks/use-notifications';

// Define user types
type UserRole = 'visitor' | 'tenant' | 'host' | 'admin' | 'superadmin';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: 'male' | 'female' | string;
  dateOfBirth?: string;
  image?: string;
  role: UserRole;
  hostType?: 'landlord' | 'facility_manager' | 'company';
  companyInfo?: {
    companyName: string;
    companyEmail?: string;
    companyPhoneNumbers?: string[];
    companyAddress?: string;
  };
  phoneVerifiedAt?: string | null;
  authMethod?: 'phone' | 'google' | 'facebook';
  onboardingRequired?: boolean;
}

type LoginResult =
  | {
      isAuthenticated: true;
      user: User;
    }
  | {
      isAuthenticated: false;
      userId: string;
    };

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onboardingRequired: boolean;
  phoneVerified: boolean;
  authMethod: 'phone' | 'google' | 'facebook';
  login: (phoneNumber: string, otp: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  isAuthorized: (allowedRoles: UserRole[]) => boolean;
  setUser: (user: User | null) => void;
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string>;
  finalizeOAuthLogin: (
    accessToken: string,
    metadata?: {
      onboardingRequired?: boolean;
      phoneVerified?: boolean;
      authMethod?: 'phone' | 'google' | 'facebook';
    }
  ) => Promise<void>;
  syncCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingRequired, setOnboardingRequired] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [authMethod, setAuthMethod] = useState<'phone' | 'google' | 'facebook'>('phone');
  const navigate = useNavigate();

  const applyUserAuthState = (nextUser: User | null) => {
    if (!nextUser) {
      setOnboardingRequired(false);
      setPhoneVerified(false);
      setAuthMethod('phone');
      return;
    }

    const derivedPhoneVerified = !!nextUser.phoneVerifiedAt;
    const derivedOnboardingRequired = !!nextUser.onboardingRequired;
    setPhoneVerified(derivedPhoneVerified);
    setOnboardingRequired(derivedOnboardingRequired);
    setAuthMethod(nextUser.authMethod || 'phone');
  };

  const updateUser = (nextUser: User | null) => {
    setUser(nextUser);
    applyUserAuthState(nextUser);
  };

  const syncCurrentUser = async () => {
    const response = await profileAPI.getCurrentUser();
    const { user: currentUser } = response.data;
    updateUser(currentUser);
  };

  // Check if user is authenticated on mount and validate token
  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const hadPreviousSession = localStorage.getItem('hadSession') === 'true';
      
      try {
        if (token) {
          // Get user profile if we have a token
          const response = await profileAPI.getCurrentUser();
          const { user } = response.data;
          localStorage.setItem('hadSession', 'true');
          updateUser(user);
        } else if (hadPreviousSession) {
          // Only try to refresh if there was a previous session
          try {
            const refreshResponse = await authAPI.refreshToken();
            const { accessToken } = refreshResponse.data;
            
            // Store new access token and preserve session marker
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('hadSession', 'true');
            
            // Get user profile with new token
            const response = await profileAPI.getCurrentUser();
            const { user } = response.data;
            updateUser(user);
          } catch (refreshError: any) {
            // Only clear hadSession if refresh token is invalid/expired
            if (refreshError.response?.status === 401) {
              localStorage.removeItem('hadSession');
            }
            localStorage.removeItem('accessToken');
            queryClient.clear();
            clearNotificationModuleState();
            updateUser(null);
          }
        } else {
          // No token and no previous session
          updateUser(null);
        }
      } catch (error: any) {
        // Only clear hadSession on auth errors
        if (error.response?.status === 401) {
          localStorage.removeItem('hadSession');
        }
        localStorage.removeItem('accessToken');
        queryClient.clear();
        clearNotificationModuleState();
        updateUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, []);

  const login = async (phoneNumber: string, otp: string) => {
    try {
      const response = await authAPI.verifyPhoneOTP(phoneNumber, otp);
      const { accessToken, user: verifiedUser, userId } = response.data;

      // Existing user login
      if (accessToken && verifiedUser) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('hadSession', 'true');

        queryClient.clear();
        clearNotificationModuleState();

        updateUser(verifiedUser);
        return {
          isAuthenticated: true as const,
          user: verifiedUser
        };
      }

      // New user registration flow
      if (userId) {
        return {
          isAuthenticated: false as const,
          userId
        };
      }

      throw new Error('Unexpected authentication response');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('hadSession');
      unsubscribeFromPush().catch(() => {});
      queryClient.clear();
      clearNotificationModuleState();
      updateUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const isAuthorized = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  const refreshAccessToken = async () => {
    try {
      const refreshResponse = await authAPI.refreshToken();
      const { accessToken } = refreshResponse.data;
      
      // Store new access token and preserve session marker
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('hadSession', 'true');
      
      // Get user profile with new token
      const response = await profileAPI.getCurrentUser();
      const { user: newUser } = response.data;
      updateUser(newUser);

      return accessToken;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('hadSession');
      queryClient.clear();
      clearNotificationModuleState();
      updateUser(null);
      throw error;
    }
  };

  const finalizeOAuthLogin: AuthContextType['finalizeOAuthLogin'] = async (accessToken, metadata) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('hadSession', 'true');

    if (metadata?.authMethod) {
      setAuthMethod(metadata.authMethod);
    }
    if (typeof metadata?.phoneVerified === 'boolean') {
      setPhoneVerified(metadata.phoneVerified);
    }
    if (typeof metadata?.onboardingRequired === 'boolean') {
      setOnboardingRequired(metadata.onboardingRequired);
    }

    await syncCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        onboardingRequired,
        phoneVerified,
        authMethod,
        login,
        logout,
        isAuthorized,
        setUser: updateUser,
        getAccessToken,
        refreshAccessToken,
        finalizeOAuthLogin,
        syncCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};