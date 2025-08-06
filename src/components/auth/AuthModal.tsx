import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PhoneLoginStep from "./PhoneLoginStep";
import OtpVerificationStep from "./OtpVerificationStep";
import UserRegistrationStep from "./UserRegistrationStep";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type AuthStep = "phone" | "otp" | "registration" | "complete";

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const handlePhoneSubmit = async (phone: string) => {
    setPhoneNumber(phone);
    // Mock API call - in real implementation, this would send OTP
    console.log("Sending OTP to:", phone);
    setCurrentStep("otp");
  };

  const handleOtpVerification = async (otp: string) => {
    // Mock API call - in real implementation, this would verify OTP and check if user exists
    console.log("Verifying OTP:", otp);
    
    // Mock: determine if this is a new user
    const userExists = Math.random() > 0.5; // Random for demo
    setIsNewUser(!userExists);
    
    if (userExists) {
      // Existing user - complete login
      console.log("User logged in successfully");
      handleAuthComplete();
    } else {
      // New user - show registration
      setCurrentStep("registration");
    }
  };

  const handleRegistrationComplete = async (userData: any) => {
    // Mock API call - in real implementation, this would create user account
    console.log("Creating user account:", userData);
    handleAuthComplete();
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
          />
        )}
        
        {currentStep === "otp" && (
          <OtpVerificationStep
            phoneNumber={phoneNumber}
            onOtpVerification={handleOtpVerification}
            onBack={handleBack}
            onResendOtp={() => handlePhoneSubmit(phoneNumber)}
          />
        )}
        
        {currentStep === "registration" && (
          <UserRegistrationStep
            phoneNumber={phoneNumber}
            onRegistrationComplete={handleRegistrationComplete}
            onBack={handleBack}
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
