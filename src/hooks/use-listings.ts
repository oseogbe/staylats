import { useQuery } from "@tanstack/react-query";

import listingsService from "@/services/listings";
import type {
  ActiveListingFilters,
  HostDashboardMetrics,
} from "@/services/listings";

export type DashboardPeriod = "all-time" | "yearly" | "monthly" | "daily";

export const userListingsKey = (userId: string | undefined) =>
  ['userListings', userId] as const;

/**
 * Hook to fetch user's published listings with React Query caching
 * Cache is fresh for 5 minutes, persists for 10 minutes
 */
export const useUserListings = (userId: string | undefined) => {
  return useQuery({
    queryKey: userListingsKey(userId),
    queryFn: () => listingsService.getUserListings(),
    enabled: Boolean(userId),
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
export const useUserDrafts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userDrafts', userId],
    queryFn: () => listingsService.getDrafts(),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes - drafts change more frequently
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 min
    retry: 1,
    select: (data) => data.drafts || [], // Transform to return just the array
  });
};

/**
 * Hook to fetch a single listing by slug (public, no auth).
 */
export const useListingBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['listing', slug],
    queryFn: () => listingsService.getListingBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    select: (data) => data.listing,
  });
};

/**
 * Hook to fetch publicly available active listings.
 * No auth required — suitable for homepage, search pages, etc.
 */
export const useActiveListings = (filters: ActiveListingFilters = {}) => {
  const { limit, type, city, checkInDate, checkOutDate, guests } = filters;

  return useQuery({
    // Every filter is part of the key so changing a date or city refetches
    // rather than serving the previous search from cache.
    queryKey: ['activeListings', limit, type, city, checkInDate, checkOutDate, guests],
    queryFn: () => listingsService.getActiveListings(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    select: (data) => data.listings || [],
  });
};

export const useHostDashboardMetrics = (
  period: DashboardPeriod,
  userId: string | undefined
) => {
  return useQuery<HostDashboardMetrics>({
    queryKey: ['hostDashboardMetrics', userId, period],
    queryFn: () => listingsService.getHostDashboardMetrics(period),
    enabled: Boolean(userId),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

