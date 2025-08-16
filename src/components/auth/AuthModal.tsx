import { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import PhoneLoginStep from "./PhoneLoginStep";
import OtpVerificationStep from "./OtpVerificationStep";
import UserRegistrationStep from "./UserRegistrationStep";

import { authAPI } from "@/services/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type AuthStep = "phone" | "otp" | "registration" | "complete";

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async (phone: string) => {
    try {
      setIsLoading(true);
      setPhoneNumber(phone);
      const response = await authAPI.initiatePhoneAuth(phone);
      setCurrentStep("otp");
      toast({
        description: response.message,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to send OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (otp: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.verifyPhoneOTP(phoneNumber, otp);
      const { user, accessToken } = response.data;

      if (user) {
        // Existing user - complete login
        localStorage.setItem('accessToken', accessToken);
        handleAuthComplete();
        toast({
          description: "Login successful!",
        });
      } else {
        // New user - show registration
        setIsNewUser(true);
        setCurrentStep("registration");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to verify OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationComplete = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender?: "male" | "female" | "other";
  }) => {
    try {
      setIsLoading(true);
      await authAPI.completeRegistration({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender || "other",
      });
      handleAuthComplete();
      toast({
        description: "Registration successful!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to complete registration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthComplete = () => {
    setCurrentStep("complete");
    setTimeout(() => {
      onClose();
      // Reset state
      setCurrentStep("phone");
      setPhoneNumber("");
      setIsNewUser(false);
    }, 1000);
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    // Mock social login
    console.log(`Logging in with ${provider}`);
    handleAuthComplete();
  };

  const handleBack = () => {
    if (currentStep === "otp") {
      setCurrentStep("phone");
    } else if (currentStep === "registration") {
      setCurrentStep("otp");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {currentStep === "phone" && (
          <PhoneLoginStep
            onPhoneSubmit={handlePhoneSubmit}
            onSocialLogin={handleSocialLogin}
            onClose={onClose}
            isLoading={isLoading}
          />
        )}
        
        {currentStep === "otp" && (
          <OtpVerificationStep
            phoneNumber={phoneNumber}
            onOtpVerification={handleOtpVerification}
            onBack={handleBack}
            onResendOtp={() => handlePhoneSubmit(phoneNumber)}
            isLoading={isLoading}
          />
        )}
        
        {currentStep === "registration" && (
          <UserRegistrationStep
            onRegistrationComplete={handleRegistrationComplete}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )}
        
        {currentStep === "complete" && (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">✅</div>
            <h3 className="text-lg font-semibold mb-2">Welcome to Staylats!</h3>
            <p className="text-sm text-muted-foreground">
              You're all set. Redirecting...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
