import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, ChevronLeft, Loader2, Phone, ShieldCheck, User } from "lucide-react";

import { MonthYearCalendar } from "@/components/MonthYearCalendar";

import { useAuth } from "@/contexts/AuthContext";
import authAPI from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type StepId = "phone" | "profile";

const STEPS: { id: StepId; label: string; icon: typeof Phone }[] = [
  { id: "phone", label: "Phone", icon: Phone },
  { id: "profile", label: "Profile", icon: User },
];

const AuthOnboarding = () => {
  const navigate = useNavigate();
  const { user, onboardingRequired, syncCurrentUser } = useAuth();

  const hasPhoneVerified = useMemo(() => !!user?.phoneVerifiedAt, [user?.phoneVerifiedAt]);

  const [step, setStep] = useState<StepId>(hasPhoneVerified ? "profile" : "phone");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [gender, setGender] = useState<"male" | "female" | "">(
    (user?.gender as "male" | "female" | undefined) || ""
  );
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined
  );
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  useEffect(() => {
    if (hasPhoneVerified) {
      setStep("profile");
    }
  }, [hasPhoneVerified]);

  const sendPhoneOtp = async () => {
    if (!/^[0-9]{11}$/.test(phoneNumber)) {
      toast.error("Enter a valid 11-digit Nigerian phone number.");
      return;
    }
    try {
      setIsSendingOtp(true);
      const response = await authAPI.startOnboardingPhoneVerification(phoneNumber);
      setPhoneOtpSent(true);
      toast.success(response.message || "Verification code sent.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send verification code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyPhone = async () => {
    if (phoneOtp.length !== 6) {
      toast.error("Enter a valid 6-digit code.");
      return;
    }

    try {
      setIsVerifyingPhone(true);
      const response = await authAPI.verifyOnboardingPhone(phoneOtp);
      toast.success(response.message || "Phone verified.");
      await syncCurrentUser();
      setStep("profile");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify phone.");
    } finally {
      setIsVerifyingPhone(false);
    }
  };

  const saveProfile = async () => {
    try {
      setIsSavingProfile(true);
      const response = await authAPI.completeOnboarding({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth.getTime() - dateOfBirth.getTimezoneOffset() * 60000)
              .toISOString()
              .split("T")[0]
          : undefined,
      });
      toast.success(response.message || "Profile updated.");
      await syncCurrentUser();
      navigate(response.data.onboardingRequired ? "/auth/onboarding" : "/", { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update onboarding profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!onboardingRequired) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <ShieldCheck className="h-7 w-7 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold">Onboarding complete</h1>
        <p className="text-sm text-muted-foreground">You're all set to book and host on Staylats.</p>
        <Button onClick={() => navigate("/", { replace: true })}>Go to home</Button>
      </div>
    );
  }

  const activeIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="max-w-lg mx-auto py-10 px-4 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Complete your onboarding</h1>
        <p className="text-sm text-muted-foreground">
          Just two quick steps before you can book or host on Staylats.
        </p>
      </div>

      <Stepper activeIndex={activeIndex} phoneVerified={hasPhoneVerified} />

      <Card className="border-muted">
        <CardContent className="p-6">
          {step === "phone" ? (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Verify your phone number</h2>
                <p className="text-sm text-muted-foreground">
                  We'll text you a 6-digit code to confirm it's really you.
                </p>
              </div>

              {hasPhoneVerified ? (
                <div className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <span>Your phone number is verified.</span>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone number</Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(event) =>
                        setPhoneNumber(event.target.value.replace(/\D/g, "").slice(0, 11))
                      }
                      placeholder="08012345678"
                      disabled={phoneOtpSent}
                    />
                  </div>

                  {!phoneOtpSent ? (
                    <Button onClick={sendPhoneOtp} disabled={isSendingOtp} className="w-full">
                      {isSendingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSendingOtp ? "Sending..." : "Send verification code"}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Enter the 6-digit code</Label>
                        <p className="text-xs text-muted-foreground">
                          Sent to {phoneNumber}.{" "}
                          <button
                            type="button"
                            onClick={sendPhoneOtp}
                            disabled={isSendingOtp}
                            className="font-medium text-primary underline-offset-2 hover:underline disabled:opacity-50"
                          >
                            Resend
                          </button>
                        </p>
                        <InputOTP
                          maxLength={6}
                          value={phoneOtp}
                          onChange={(value) => setPhoneOtp(value.replace(/\D/g, ""))}
                          containerClassName="w-full"
                        >
                          {Array.from({ length: 6 }).map((_, index) => (
                            <Fragment key={index}>
                              <InputOTPGroup className="flex-1">
                                <InputOTPSlot
                                  index={index}
                                  className="h-12 w-full rounded-md border-l text-base"
                                />
                              </InputOTPGroup>
                              {index < 5 && <InputOTPSeparator />}
                            </Fragment>
                          ))}
                        </InputOTP>
                      </div>
                      <Button
                        onClick={verifyPhone}
                        disabled={isVerifyingPhone || phoneOtp.length !== 6}
                        className="w-full"
                      >
                        {isVerifyingPhone && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isVerifyingPhone ? "Verifying..." : "Verify & continue"}
                      </Button>
                    </div>
                  )}
                </>
              )}

              {hasPhoneVerified && (
                <Button onClick={() => setStep("profile")} className="w-full">
                  Continue
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Profile details</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us a little about yourself to finish setting up your account.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={(value) => setGender(value as "male" | "female")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date of birth</Label>
                <MonthYearCalendar
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  placeholder="Select date of birth"
                  maxDate={new Date()}
                  minDate={new Date("1900-01-01")}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                {!hasPhoneVerified && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("phone")}
                    className="flex-1"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button onClick={saveProfile} disabled={isSavingProfile} className="flex-1">
                  {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSavingProfile ? "Saving..." : "Save and continue"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Stepper = ({
  activeIndex,
  phoneVerified,
}: {
  activeIndex: number;
  phoneVerified: boolean;
}) => {
  return (
    <div className="flex items-center">
      {STEPS.map((stepItem, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex || (index === 0 && phoneVerified);
        const Icon = stepItem.icon;

        return (
          <div key={stepItem.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isActive && !isComplete && "border-primary text-primary",
                  !isActive && !isComplete && "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isActive || isComplete ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {stepItem.label}
                </span>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-3 h-0.5 flex-1 rounded-full transition-colors",
                  isComplete ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AuthOnboarding;
