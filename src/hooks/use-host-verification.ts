import { useUserProfile } from './use-user-profile';

interface HostVerificationStatus {
  needsVerification: boolean;
  hasHostProfile: boolean;
  isVerified: boolean;
  isLoading: boolean;
}

/**
 * Custom hook to check host verification status using React Query
 * Uses the shared useUserProfile hook for consistent caching
 * Returns whether the user needs to complete host verification
 */
export const useHostVerification = (): HostVerificationStatus => {
  const { data: user, isLoading } = useUserProfile();

  const hasHostProfile = !!user?.hostProfile;
  const isVerified = user?.hostProfile?.verified === true;
  const needsVerification = !hasHostProfile || !isVerified;

  return {
    needsVerification,
    hasHostProfile,
    isVerified,
    isLoading
  };
};

