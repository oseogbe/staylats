import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield, ArrowLeft } from 'lucide-react';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function OtpVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || '';

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      console.log('Verifying OTP:', data.otp, 'for phone:', phoneNumber);
      setIsLoading(false);
      // Navigate to host details registration
      navigate('/host/register-details', { state: { phoneNumber } });
    }, 1500);
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    
    // Mock resend API call
    setTimeout(() => {
      console.log('Resending OTP to:', phoneNumber);
      setIsResending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-4"
            onClick={() => navigate('/host/phone-registration')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify Your Phone</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {phoneNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field} disabled={isLoading}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the verification code sent to your phone
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>
                
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">Didn't receive the code? </span>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    onClick={handleResendOtp}
                    disabled={isResending}
                  >
                    {isResending ? 'Resending...' : 'Resend'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}