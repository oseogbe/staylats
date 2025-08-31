import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import authAPI from '@/services/auth';

type VerificationState = 'loading' | 'success' | 'error' | 'invalid-token';

interface VerificationError {
  message: string;
  code?: string;
}

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationState, setVerificationState] = useState<VerificationState>('loading');
  const [error, setError] = useState<VerificationError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const token = searchParams.get('token');

  const verifyEmailToken = async (verificationToken: string, isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
      } else {
        setVerificationState('loading');
      }

      setError(null);

      const response = await authAPI.verifyEmail(verificationToken);
      
      setVerificationState('success');
      toast.success(response.message || 'Email verified successfully!');
      
      // Navigate to login/home after a short delay to show success state
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to verify email';
      const errorCode = err.response?.data?.code;
      
      setError({
        message: errorMessage,
        code: errorCode
      });

      // Determine error state based on response
      if (err.response?.status === 400 && errorMessage.toLowerCase().includes('token')) {
        setVerificationState('invalid-token');
      } else {
        setVerificationState('error');
      }

      toast.error(errorMessage);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setVerificationState('invalid-token');
      setError({
        message: 'No verification token provided',
        code: 'MISSING_TOKEN'
      });
      return;
    }

    // Validate token format (basic check)
    if (token.length < 10) {
      setVerificationState('invalid-token');
      setError({
        message: 'Invalid verification token format',
        code: 'INVALID_TOKEN_FORMAT'
      });
      return;
    }

    verifyEmailToken(token);
  }, [token]);

  const handleRetry = () => {
    if (token && verificationState === 'error') {
      verifyEmailToken(token, true);
    }
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Verifying your email...
              </h2>
              <p className="text-gray-600 mt-2">
                Please wait while we verify your email address.
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Email verified successfully!
              </h2>
              <p className="text-gray-600 mt-2">
                Your email has been verified. You'll be redirected to the homepage shortly.
              </p>
            </div>
            <Button onClick={handleGoHome} className="mt-4">
              Go to Homepage
            </Button>
          </div>
        );

      case 'invalid-token':
        return (
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Invalid verification link
              </h2>
              <p className="text-gray-600 mt-2">
                {error?.message || 'The verification link is invalid or has expired.'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Please request a new verification email or contact support if the problem persists.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <Button asChild>
                <Link to="/resend-verification">
                  <Mail className="h-4 w-4 mr-2" />
                  Request New Verification Email
                </Link>
              </Button>
              <Button onClick={handleGoHome} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Verification failed
              </h2>
              <p className="text-gray-600 mt-2">
                {error?.message || 'Something went wrong while verifying your email.'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Contact support if the problem persists or request a new verification email.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="min-w-[100px]"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  'Try Again'
                )}
              </Button>
              <Button asChild variant="outline">
                <Link to="/resend-verification">
                  <Mail className="h-4 w-4 mr-2" />
                  Request New Verification Email
                </Link>
              </Button>
              <Button onClick={handleGoHome} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Staylats
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
