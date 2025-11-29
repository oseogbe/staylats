import { useQuery } from '@tanstack/react-query';

import profileAPI from '@/services/profile';

/**
 * Hook to fetch user profile with React Query caching
 * User profile is cached with a long stale time (30 minutes) since it changes infrequently
 * Uses the same query key as use-host-verification for cache sharing
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => profileAPI.getCurrentUser(),
    staleTime: 30 * 60 * 1000, // 30 minutes - user profile changes infrequently
    gcTime: 60 * 60 * 1000, // 1 hour - cache persists for 1 hour
    retry: 1,
    select: (response) => response.data.user, // Transform to return just the user object
  });
};

