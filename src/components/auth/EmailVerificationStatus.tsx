import { useState } from 'react';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import authAPI from '@/services/auth';

interface EmailVerificationStatusProps {
  isVerified: boolean;
  email: string;
  className?: string;
  onVerificationSent?: () => void;
}

const EmailVerificationStatus = ({ 
  isVerified, 
  email, 
  className,
  onVerificationSent 
}: EmailVerificationStatusProps) => {
  const [isResending, setIsResending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);

  const canResend = () => {
    if (!lastSentTime) return true;
    const timeDifference = Date.now() - lastSentTime.getTime();
    return timeDifference > 60000; // 1 minute cooldown
  };

  const getRemainingCooldown = () => {
    if (!lastSentTime) return 0;
    const timeDifference = Date.now() - lastSentTime.getTime();
    const remaining = Math.max(0, 60000 - timeDifference);
    return Math.ceil(remaining / 1000);
  };

  const handleResendVerification = async () => {
    if (!canResend()) {
      toast.error(`Please wait ${getRemainingCooldown()} seconds before resending`);
      return;
    }

    try {
      setIsResending(true);
      await authAPI.resendEmailVerification(email);
      
      setLastSentTime(new Date());
      toast.success('Verification email sent! Please check your inbox.');
      
      if (onVerificationSent) {
        onVerificationSent();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send verification email';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className={`flex items-center gap-2 ${className || ''}`}>
        <CheckCircle className="h-4 w-4 text-green-500" />
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
          Email Verified
        </Badge>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <div className="flex items-center gap-2">
        <XCircle className="h-4 w-4 text-orange-500" />
        <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
          Email Not Verified
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleResendVerification}
          disabled={isResending || !canResend()}
          className="text-xs"
        >
          {isResending ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="h-3 w-3 mr-1" />
              {canResend() ? 'Resend Verification' : `Resend in ${getRemainingCooldown()}s`}
            </>
          )}
        </Button>
      </div>
      
      <p className="text-xs text-gray-500">
        Please check your inbox and spam folder for the verification email.
      </p>
    </div>
  );
};

export default EmailVerificationStatus;
