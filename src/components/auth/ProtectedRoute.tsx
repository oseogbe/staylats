import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('visitor' | 'tenant' | 'host' | 'admin' | 'superadmin')[];
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAuthorized, isLoading } = useAuth();
  const location = useLocation();

  // Show nothing while checking authentication status
  if (isLoading) {
    return null;
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If there are allowed roles and user is not authorized
  if (allowedRoles.length > 0 && !isAuthorized(allowedRoles)) {
    // If user is not authenticated, redirect to home
    if (!isAuthenticated) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    // If user is authenticated but not authorized, redirect to their appropriate dashboard
    return <Navigate to="/my-account" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
