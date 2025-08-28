import { useState } from "react";
import { UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import PhoneLoginStep from "./PhoneLoginStep";
import OtpVerificationStep from "./OtpVerificationStep";
import UserRegistrationStep from "./UserRegistrationStep";

import authAPI from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

export type AuthStep = "phone" | "otp" | "registration";

const AuthModal = ({ isOpen, onClose, redirectPath }: AuthModalProps) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
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
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
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
        setUser(user);
        handleAuthComplete();
        toast.success("Login successful!");
      } else {
        // New user - show registration
        toast.success("Verification successful! Please complete your registration");
        setIsNewUser(true);
        setCurrentStep("registration");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationComplete = async (
    userData: {
      firstName: string;
      lastName: string;
      email: string;
      dateOfBirth: Date;
      gender?: "male" | "female";
    },
    setFieldError: UseFormSetError<{
      firstName: string;
      lastName: string;
      email: string;
      dateOfBirth: Date;
      gender?: "male" | "female";
    }>
  ) => {
    try {
      setIsLoading(true);
      const response = await authAPI.completeRegistration({
        phoneNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        dateOfBirth: userData.dateOfBirth.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        gender: userData.gender,
      });

      // Store access token and update auth context
      localStorage.setItem('accessToken', response.data.accessToken);
      setUser(response.data.user);

      handleAuthComplete();
      toast.success(response.message);
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          // Map server field names to form field names
          const fieldMap: { [key: string]: keyof typeof userData } = {
            dateOfBirth: "dateOfBirth",
            email: "email",
            firstName: "firstName",
            lastName: "lastName",
            gender: "gender"
          };
          
          const field = fieldMap[err.param];
          if (field) {
            setFieldError(field, {
              type: "manual",
              message: err.msg
            });
          }
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to complete registration");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthComplete = () => {
    // Close modal immediately
    onClose();
    
    // Reset state
    setCurrentStep("phone");
    setPhoneNumber("");
    setIsNewUser(false);
    
    // Navigate to redirect path if provided
    if (redirectPath) {
      navigate(redirectPath);
    }
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
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
