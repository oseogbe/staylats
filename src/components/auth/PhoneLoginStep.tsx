import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{11}$/, "Please enter a valid 11-digit Nigerian phone number")
});

type PhoneFormData = z.infer<typeof phoneSchema>;

interface PhoneLoginStepProps {
  onPhoneSubmit: (phoneNumber: string) => void;
  onSocialLogin: (provider: "google" | "facebook") => void;
  onClose: () => void;
}

const PhoneLoginStep = ({ onPhoneSubmit, onSocialLogin, onClose }: PhoneLoginStepProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: ""
    }
  });

  const onSubmit = async (data: PhoneFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay
      onPhoneSubmit(data.phoneNumber);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    onSocialLogin(provider);
  };

  return (
    <>
      <DialogHeader className="relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <DialogTitle className="text-xl font-semibold text-center">
          Log in or sign up
        </DialogTitle>
        <DialogDescription className="text-center">
          Welcome to Staylats
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Phone number</div>
                      <Input
                        {...field}
                        placeholder="08012345678"
                        maxLength={11}
                        className="text-base"
                      />
                      <div className="text-xs text-muted-foreground">
                        We'll call or text you to confirm your number. Standard message and data rates apply.{" "}
                        <button type="button" className="underline">
                          Privacy Policy
                        </button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#E31C5F] hover:bg-[#D70A4F] text-white font-medium py-3"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Continue"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          or
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full py-3 font-medium border-2 hover:bg-gray-50"
            onClick={() => handleSocialLogin("google")}
          >
            <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full py-3 font-medium border-2 hover:bg-gray-50"
            onClick={() => handleSocialLogin("facebook")}
          >
            <svg className="w-4 h-4 mr-3" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
          </Button>
        </div>
      </div>
    </>
  );
};

export default PhoneLoginStep;