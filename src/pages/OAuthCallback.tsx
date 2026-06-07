import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { finalizeOAuthLogin } = useAuth();
  const hasHandled = useRef(false);

  useEffect(() => {
    // finalizeOAuthLogin triggers AuthProvider re-renders (new function ref) and
    // StrictMode double-invokes effects, so guard the one-time callback handling.
    if (hasHandled.current) return;
    hasHandled.current = true;

    const handleCallback = async () => {
      const status = searchParams.get("status");

      if (status === "link_required") {
        const linkToken = searchParams.get("linkToken");
        if (!linkToken) {
          toast.error("Missing account linking token.");
          navigate("/", { replace: true });
          return;
        }

        const params = new URLSearchParams({
          linkToken,
          email: searchParams.get("email") || "",
          maskedPhone: searchParams.get("maskedPhone") || "",
        });
        navigate(`/auth/link-account?${params.toString()}`, { replace: true });
        return;
      }

      if (status === "success") {
        const accessToken = searchParams.get("accessToken");
        if (!accessToken) {
          toast.error("Missing access token from OAuth callback.");
          navigate("/", { replace: true });
          return;
        }

        await finalizeOAuthLogin(accessToken, {
          onboardingRequired: searchParams.get("onboardingRequired") === "true",
          phoneVerified: searchParams.get("phoneVerified") === "true",
          authMethod: (searchParams.get("authMethod") as "phone" | "google" | "facebook" | null) || "google",
        });

        const needsOnboarding = searchParams.get("onboardingRequired") === "true";
        toast.success("Login successful!");
        navigate(needsOnboarding ? "/auth/onboarding" : "/", { replace: true });
        return;
      }

      const message = searchParams.get("message") || "Google authentication failed";
      toast.error(message);
      navigate("/", { replace: true });
    };

    handleCallback().catch((error) => {
      console.error("OAuth callback failed:", error);
      toast.error("Could not complete Google authentication.");
      navigate("/", { replace: true });
    });
  }, [finalizeOAuthLogin, navigate, searchParams]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
      Completing Google login...
    </div>
  );
};

export default OAuthCallback;
