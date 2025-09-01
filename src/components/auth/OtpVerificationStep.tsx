import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import { ArrowLeft, AlertCircle } from "lucide-react";

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter the 6-digit code").max(6)
});

type OtpFormData = z.infer<typeof otpSchema>;

interface OtpVerificationStepProps {
  phoneNumber: string;
  onOtpVerification: (otp: string) => void;
  onBack: () => void;
  onResendOtp: () => void;
  isLoading: boolean;
}

const OtpVerificationStep = ({ phoneNumber, onOtpVerification, onBack, onResendOtp, isLoading }: OtpVerificationStepProps) => {
  const [isResending, setIsResending] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [lastResendTime, setLastResendTime] = useState<Date | null>(null);
  const [resendCooldownTime, setResendCooldownTime] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<Date | null>(null);

  // Rate limiting configuration
  const MAX_VERIFICATION_ATTEMPTS = 5;
  const RESEND_COOLDOWN_SECONDS = 60; // 1 minute
  const BLOCK_DURATION_MINUTES = 15; // 15 minutes block after max attempts
  const PROGRESSIVE_DELAYS = [0, 30, 60, 120, 300]; // Progressive delays in seconds

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ""
    }
  });

  // Check if user is currently blocked
  const checkBlockStatus = useCallback(() => {
    if (blockEndTime && new Date() < blockEndTime) {
      setIsBlocked(true);
      return true;
    } else if (blockEndTime && new Date() >= blockEndTime) {
      setIsBlocked(false);
      setBlockEndTime(null);
      setVerificationAttempts(0);
      return false;
    }
    return false;
  }, [blockEndTime]);

  // Update cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (lastResendTime) {
      interval = setInterval(() => {
        const timePassed = Math.floor((Date.now() - lastResendTime.getTime()) / 1000);
        const currentDelay = PROGRESSIVE_DELAYS[Math.min(verificationAttempts, PROGRESSIVE_DELAYS.length - 1)];
        const totalCooldown = RESEND_COOLDOWN_SECONDS + currentDelay;
        const remaining = Math.max(0, totalCooldown - timePassed);
        
        setResendCooldownTime(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lastResendTime, verificationAttempts]);

  // Update block timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBlocked && blockEndTime) {
      interval = setInterval(() => {
        checkBlockStatus();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBlocked, blockEndTime, checkBlockStatus]);

  const canResendOtp = () => {
    if (isBlocked) return false;
    if (!lastResendTime) return true;
    
    const timePassed = Math.floor((Date.now() - lastResendTime.getTime()) / 1000);
    const currentDelay = PROGRESSIVE_DELAYS[Math.min(verificationAttempts, PROGRESSIVE_DELAYS.length - 1)];
    const totalCooldown = RESEND_COOLDOWN_SECONDS + currentDelay;
    
    return timePassed >= totalCooldown;
  };

  const getRemainingBlockTime = () => {
    if (!blockEndTime) return 0;
    return Math.max(0, Math.ceil((blockEndTime.getTime() - Date.now()) / 1000 / 60));
  };

  const onSubmit = async (data: OtpFormData) => {
    // Check if user is blocked
    if (checkBlockStatus()) {
      toast.error(`Too many failed attempts. Please wait ${getRemainingBlockTime()} ${getRemainingBlockTime() === 1 ? 'minute' : 'minutes'} before trying again.`);
      return;
    }

    // Check rate limiting
    if (verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
      const blockUntil = new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000);
      setBlockEndTime(blockUntil);
      setIsBlocked(true);
      toast.error(`Maximum verification attempts exceeded. Please wait ${BLOCK_DURATION_MINUTES} minutes before trying again.`);
      return;
    }

    try {
      await onOtpVerification(data.otp);
      // Reset attempts on successful verification
      setVerificationAttempts(0);
      setLastResendTime(null);
      setIsBlocked(false);
      setBlockEndTime(null);
    } catch (error: any) {
      // Increment attempts on failed verification
      const newAttempts = verificationAttempts + 1;
      setVerificationAttempts(newAttempts);
      
      const remainingAttempts = MAX_VERIFICATION_ATTEMPTS - newAttempts;
      if (remainingAttempts > 0) {
        // Show more specific error message from the server if available
        const serverMessage = error?.response?.data?.message;
        if (serverMessage && serverMessage.toLowerCase().includes('invalid') || serverMessage && serverMessage.toLowerCase().includes('expired')) {
          toast.error(`${serverMessage}. ${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining.`);
        } else {
          toast.error(`Invalid code. ${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining.`);
        }
      }
      
      // Clear the form on failed attempt
      form.reset({ otp: "" });
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp()) {
      const remaining = Math.ceil(resendCooldownTime);
      toast.error(`Please wait ${remaining} ${remaining === 1 ? 'second' : 'seconds'} before requesting another code.`);
      return;
    }

    if (checkBlockStatus()) {
      toast.error(`Too many failed attempts. Please wait ${getRemainingBlockTime()} ${getRemainingBlockTime() === 1 ? 'minute' : 'minutes'} before trying again.`);
      return;
    }

    setIsResending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay
      await onResendOtp();
      setLastResendTime(new Date());
      
      const currentDelay = PROGRESSIVE_DELAYS[Math.min(verificationAttempts, PROGRESSIVE_DELAYS.length - 1)];
      const totalCooldown = RESEND_COOLDOWN_SECONDS + currentDelay;
      setResendCooldownTime(totalCooldown);
      
      toast.success("Verification code sent successfully!");
    } catch (error: any) {
      // Show a more specific error message based on the error response
      const errorMessage = error?.response?.data?.message || "Failed to resend verification code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const maskPhoneNumber = (phone: string) => {
    if (phone.length !== 11) return phone;
    return `${phone.slice(0, 4)}****${phone.slice(-3)}`;
  };

  return (
    <>
      <DialogHeader>
        <button
          onClick={onBack}
          className="absolute left-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={isBlocked}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <DialogTitle className="text-xl font-semibold text-center">
          Confirm your number
        </DialogTitle>
        <DialogDescription className="text-center">
          Enter the code we sent over SMS to {maskPhoneNumber(phoneNumber)}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Rate limiting warning */}
        {isBlocked && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Account temporarily locked</p>
              <p>Too many failed attempts. Please wait {getRemainingBlockTime()} {getRemainingBlockTime() === 1 ? 'minute' : 'minutes'} before trying again.</p>
            </div>
          </div>
        )}

        {/* Attempts warning */}
        {verificationAttempts > 0 && verificationAttempts < MAX_VERIFICATION_ATTEMPTS && !isBlocked && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p>{MAX_VERIFICATION_ATTEMPTS - verificationAttempts} {MAX_VERIFICATION_ATTEMPTS - verificationAttempts === 1 ? 'attempt' : 'attempts'} remaining before temporary lock.</p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isBlocked}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isBlocked || form.watch("otp").length !== 6}
            >
              {isBlocked 
                ? `Locked for ${getRemainingBlockTime()} ${getRemainingBlockTime() === 1 ? 'minute' : 'minutes'}` 
                : isLoading 
                ? "Verifying..." 
                : "Continue"
              }
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Didn't get a code?{" "}
          </span>
          <button
            onClick={handleResendOtp}
            disabled={isResending || !canResendOtp() || isBlocked}
            className="text-sm font-medium underline hover:no-underline disabled:opacity-50"
          >
            {isBlocked 
              ? `Locked for ${getRemainingBlockTime()} ${getRemainingBlockTime() === 1 ? 'minute' : 'minutes'}`
              : isResending 
              ? "Sending..." 
              : resendCooldownTime > 0
              ? `Send again (${resendCooldownTime} ${resendCooldownTime === 1 ? 'second' : 'seconds'})`
              : "Send again"
            }
          </button>
        </div>

        {/* Rate limiting info */}
        {verificationAttempts >= 3 && !isBlocked && (
          <div className="text-xs text-center text-muted-foreground bg-gray-50 p-2 rounded">
            Security notice: Multiple failed attempts will result in a temporary {BLOCK_DURATION_MINUTES}-minute lockout.
          </div>
        )}
      </div>
    </>
  );
};

export default OtpVerificationStep;