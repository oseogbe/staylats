import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import authAPI from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LinkOAuthAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { finalizeOAuthLogin } = useAuth();
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [channel, setChannel] = useState<"phone" | "email" | null>(null);

  const linkToken = useMemo(() => searchParams.get("linkToken") || "", [searchParams]);
  const email = searchParams.get("email") || "";
  const maskedPhone = searchParams.get("maskedPhone") || "";

  const startChallenge = async () => {
    if (!linkToken) {
      toast.error("Missing link token.");
      return;
    }

    try {
      setIsSending(true);
      const response = await authAPI.startOAuthLinkChallenge(linkToken);
      setChannel(response.data.channel);
      toast.success(response.message || "Verification code sent.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send verification code.");
    } finally {
      setIsSending(false);
    }
  };

  const verifyChallenge = async () => {
    if (!linkToken) {
      toast.error("Missing link token.");
      return;
    }
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit code.");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await authAPI.verifyOAuthLinkChallenge(linkToken, otp);
      await finalizeOAuthLogin(response.data.accessToken, {
        onboardingRequired: response.data.onboardingRequired,
        phoneVerified: response.data.phoneVerified,
        authMethod: response.data.authMethod,
      });
      toast.success(response.message || "Account linked successfully!");
      navigate(response.data.onboardingRequired ? "/auth/onboarding" : "/", { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify linking code.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Link your account</h1>
        <p className="text-sm text-muted-foreground">
          We found an existing Staylats account for <strong>{email || "your email"}</strong>.
          Confirm ownership to link your Google sign-in.
        </p>
        {maskedPhone && (
          <p className="text-xs text-muted-foreground">
            Verification can be sent to: {maskedPhone}
          </p>
        )}
      </div>

      <Button onClick={startChallenge} disabled={isSending || !linkToken} className="w-full">
        {isSending ? "Sending..." : "Send verification code"}
      </Button>

      {channel && (
        <p className="text-xs text-muted-foreground">
          Code sent via {channel === "phone" ? "phone SMS" : "email"}.
        </p>
      )}

      <div className="space-y-3">
        <Input
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter 6-digit code"
        />
        <Button
          onClick={verifyChallenge}
          disabled={isVerifying || otp.length !== 6 || !linkToken}
          className="w-full"
        >
          {isVerifying ? "Verifying..." : "Verify and link account"}
        </Button>
      </div>
    </div>
  );
};

export default LinkOAuthAccount;
