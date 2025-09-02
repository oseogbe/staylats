import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import authAPI from '@/services/auth';
import profileAPI from '@/services/profile';

// Define user types
type UserRole = 'visitor' | 'tenant' | 'host' | 'admin' | 'superadmin';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  role: UserRole;
  hostType?: 'landlord' | 'facility_manager' | 'company';
  companyInfo?: {
    companyName: string;
    companyEmail?: string;
    companyPhoneNumbers?: string[];
    companyAddress?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthorized: (allowedRoles: UserRole[]) => boolean;
  setUser: (user: User | null) => void;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
          setUser(user);
        } else if (hadPreviousSession) {
          // Only try to refresh if there was a previous session
          try {
            const refreshResponse = await authAPI.refreshToken();
            const { accessToken } = refreshResponse.data;
            
            // Store new access token
            localStorage.setItem('accessToken', accessToken);
            
            // Get user profile with new token
            const response = await profileAPI.getCurrentUser();
            const { user } = response.data;
            setUser(user);
          } catch (refreshError: any) {
            // Only clear hadSession if refresh token is invalid/expired
            if (refreshError.response?.status === 401) {
              localStorage.removeItem('hadSession');
            }
            localStorage.removeItem('accessToken');
            setUser(null);
          }
        } else {
          // No token and no previous session
          setUser(null);
        }
      } catch (error: any) {
        // Only clear hadSession on auth errors
        if (error.response?.status === 401) {
          localStorage.removeItem('hadSession');
        }
        localStorage.removeItem('accessToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, []);

  const login = async (phoneNumber: string, otp: string) => {
    try {
      const response = await authAPI.verifyPhoneOTP(phoneNumber, otp);
      const { accessToken } = response.data;

      // Store access token and mark session
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('hadSession', 'true');

      // Get user profile
      const profileResponse = await profileAPI.getCurrentUser();
      const { user } = profileResponse.data;
      setUser(user);
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
      setUser(null);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        isAuthorized,
        setUser,
        getAccessToken,
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