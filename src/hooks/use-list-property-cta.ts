import { useCallback } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useAuthPrompt } from "@/contexts/AuthPromptContext";
import { useCreateListingPrompt } from "@/contexts/CreateListingPromptContext";

/** Where an unauthenticated host lands, and what they were trying to do. */
export const HOST_DASHBOARD_PATH = "/host/dashboard";
export const CREATE_LISTING_INTENT = { openCreateListingPrompt: true };

/**
 * The "List your property" action, shared by every CTA that offers it.
 *
 * Signed in, the listing-type modal opens in place. Signed out, the auth
 * prompt carries the destination *and the intent*, so the modal opens once
 * they arrive rather than leaving them on a dashboard wondering what happened.
 */
export const useListPropertyCta = () => {
  const { isAuthenticated } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();
  const { openPrompt: openCreateListingPrompt } = useCreateListingPrompt();

  return useCallback(() => {
    if (isAuthenticated) {
      openCreateListingPrompt();
      return;
    }

    openAuthPrompt({
      redirectPath: HOST_DASHBOARD_PATH,
      redirectState: CREATE_LISTING_INTENT,
    });
  }, [isAuthenticated, openAuthPrompt, openCreateListingPrompt]);
};
