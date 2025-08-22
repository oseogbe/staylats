import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';

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
      const userData = localStorage.getItem('userData');
      
      try {
        if (!token && userData) {
          // Only try to refresh if we had a previous session (userData exists)
          const refreshResponse = await authAPI.refreshToken();
          const { accessToken } = refreshResponse.data.data;
          
          // Store new access token
          localStorage.setItem('accessToken', accessToken);
          
          // Validate the new token
          const response = await authAPI.validateToken();
          const { user: userData } = response.data;
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
        } else if (token) {
          // Validate existing token
          const response = await authAPI.validateToken();
          const { user: userData } = response.data;
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
        } else {
          // No token and no previous session, just set loading to false
          setUser(null);
        }
      } catch (error) {
        // Clear stored data on failure
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
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
      const { user: userData, accessToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
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