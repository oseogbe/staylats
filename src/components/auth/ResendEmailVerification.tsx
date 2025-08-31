import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import authAPI from '@/services/auth';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface ResendEmailVerificationProps {
  className?: string;
}

const ResendEmailVerification = ({ className }: ResendEmailVerificationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

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

  const onSubmit = async (data: EmailFormData) => {
    if (!canResend()) {
      toast.error(`Please wait ${getRemainingCooldown()} seconds before resending`);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');

      await authAPI.resendEmailVerification(data.email);
      
      setSubmitStatus('success');
      setLastSentTime(new Date());
      toast.success('Verification email sent! Please check your inbox.');
      
      // Reset form after successful submission
      reset();
    } catch (error: any) {
      setSubmitStatus('error');
      const errorMessage = error.response?.data?.message || 'Failed to send verification email';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusIcon = () => {
    switch (submitStatus) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Mail className="h-5 w-5 text-gray-400" />;
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Sending...';
    if (!canResend()) return `Resend in ${getRemainingCooldown()}s`;
    return 'Send Verification Email';
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          {renderStatusIcon()}
        </div>
        <CardTitle className="text-lg">Resend Email Verification</CardTitle>
        <CardDescription>
          Didn't receive the verification email? Enter your email address to receive a new one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...register('email')}
              disabled={isSubmitting}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !canResend()}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {getButtonText()}
          </Button>

          {submitStatus === 'success' && (
            <div className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-md">
              ✓ Verification email sent successfully! Please check your inbox and spam folder.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
              ✗ Failed to send verification email. Please try again or contact support.
            </div>
          )}

          <div className="text-center text-xs text-gray-500">
            <p>Make sure to check your spam folder if you don't see the email in your inbox.</p>
            <p className="mt-1">
              You can resend the verification email once every minute.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResendEmailVerification;
