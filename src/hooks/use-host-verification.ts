import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from './use-user-profile';

interface HostVerificationStatus {
  needsVerification: boolean;
  hasHostProfile: boolean;
  isVerified: boolean;
  isRejected: boolean;
  rejectionReason: string | null;
  isLoading: boolean;
}

/**
 * Custom hook to check host verification status using React Query
 * Uses the shared useUserProfile hook for consistent caching
 * Returns whether the user needs to complete host verification
 */
export const useHostVerification = (): HostVerificationStatus => {
  const { user: authUser } = useAuth();
  const { data: user, isLoading } = useUserProfile(authUser?.id);
        
  const hasHostProfile = !!user?.hostProfile;
  const hostProfile = user?.hostProfile;
  const isVerified = hostProfile?.status === 'approved' || hostProfile?.verified === true;
  const isRejected = hostProfile?.status === 'rejected';
  const rejectionReason = hostProfile?.rejectionReason || null;
  const needsVerification = !hasHostProfile || (!isVerified && !isRejected);
        
  return {
    needsVerification,
    hasHostProfile,
    isVerified,
    isRejected,
    rejectionReason,
    isLoading
  };
};

