import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import ResendEmailVerificationForm from '@/components/auth/ResendEmailVerification';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const ResendEmailVerificationPage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const fromMyAccount = location.state?.from === '/my-account';
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        {/* Back to home link */}
        <div className="text-center">
          <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-800">
            <Link to={fromMyAccount ? "/my-account" : "/"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {fromMyAccount ? "Back to MyAccount" : "Back to Homepage"}
            </Link>
          </Button>
        </div>

        {/* Resend verification form */}
        <ResendEmailVerificationForm />

        {/* Additional help text */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>
            Having trouble? Contact our{' '}
            <a href="mailto:support@staylats.com" className="text-primary hover:underline">
              support team
            </a>
          </p>
          {!isAuthenticated && <p>
            Already verified?{' '}
            <Link to="/" className="text-primary hover:underline">
              Sign in to your account
            </Link>
          </p>}
        </div>
      </div>
    </div>
  );
};

export default ResendEmailVerificationPage;
