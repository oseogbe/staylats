import { useQuery } from "@tanstack/react-query";

import listingsService from "@/services/listings";

/**
 * Hook to fetch user's published listings with React Query caching
 * Cache is fresh for 5 minutes, persists for 10 minutes
 */
export const useUserListings = () => {
  return useQuery({
    queryKey: ['userListings'],
    queryFn: () => listingsService.getUserListings(),
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 min
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 min
    retry: 1,
    select: (data) => data.listings || [], // Transform to return just the array
  });
};

/**
 * Hook to fetch user's draft listings with React Query caching
 * Cache is fresh for 5 minutes, persists for 10 minutes (drafts change more frequently)
 */
export const useUserDrafts = () => {
  return useQuery({
    queryKey: ['userDrafts'],
    queryFn: () => listingsService.getDrafts(),
    staleTime: 5 * 60 * 1000, // 5 minutes - drafts change more frequently
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 min
    retry: 1,
    select: (data) => data.drafts || [], // Transform to return just the array
  });
};

