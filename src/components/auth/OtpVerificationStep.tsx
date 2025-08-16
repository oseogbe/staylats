import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";

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

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ""
    }
  });

  const onSubmit = async (data: OtpFormData) => {
    onOtpVerification(data.otp);
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay
      onResendOtp();
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
              disabled={isLoading || form.watch("otp").length !== 6}
            >
              {isLoading ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Didn't get a code?{" "}
          </span>
          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-sm font-medium underline hover:no-underline disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Send again"}
          </button>
        </div>
      </div>
    </>
  );
};

export default OtpVerificationStep;