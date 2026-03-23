import { useMemo } from "react";
import { useUserListings, useHostDashboardMetrics } from "@/hooks/use-listings";
import type { DashboardPeriod } from "@/hooks/use-listings";
import type { UserListing } from "@/services/listings";

export type { DashboardPeriod };

const OVERVIEW_TOP_N = 5;

export interface OverviewListingItem {
  id: string;
  title: string;
  type: string;
  location: string;
  status: string;
  bookings: number;
  currentEarnings: number;
}

export interface DashboardTotals {
  totalProperties: number;
  rentals: number;
  shortlets: number;
  totalEarnings: number;
  totalBookings: number;
  earningShortlets: number;
  earningRentals: number;
  bookedShortlets: number;
  bookedRentals: number;
  topPerformingListing: string | null;
}

export interface UseOverviewListingsResult {
  items: OverviewListingItem[];
  totals: DashboardTotals;
  period: DashboardPeriod;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Provides data for the host dashboard Overview section and metric cards.
 *
 * Property counts come from the user's listings cache (always "all-time").
 * Earnings / bookings / top-performing come from the dedicated metrics
 * endpoint, which respects the selected period filter.
 */
export function useOverviewListings(
  period: DashboardPeriod = "all-time",
  topN: number = OVERVIEW_TOP_N,
  userId: string | undefined
): UseOverviewListingsResult {
  const {
    data: publishedListings = [],
    isLoading: listingsLoading,
    isError: listingsError,
  } = useUserListings(userId);

  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsError,
  } = useHostDashboardMetrics(period, userId);

  const { items, totals } = useMemo(() => {
    const allPublished = publishedListings as UserListing[];

    const overviewItems: OverviewListingItem[] = allPublished
      .slice(0, topN)
      .map((listing) => ({
        id: listing.id,
        title: listing.title || "Untitled",
        type: listing.type,
        location: [listing.city, listing.state].filter(Boolean).join(", ") || "—",
        status: listing.status,
        bookings: 0,
        currentEarnings: 0,
      }));

    const rentals = allPublished.filter((l) => l.type === "rental").length;
    const shortlets = allPublished.filter((l) => l.type === "shortlet").length;

    return {
      items: overviewItems,
      totals: {
        totalProperties: allPublished.length,
        rentals,
        shortlets,
        totalEarnings: metrics?.totalEarnings ?? 0,
        totalBookings: metrics?.totalBookings ?? 0,
        earningShortlets: metrics?.earningShortlets ?? 0,
        earningRentals: metrics?.earningRentals ?? 0,
        bookedShortlets: metrics?.bookedShortlets ?? 0,
        bookedRentals: metrics?.bookedRentals ?? 0,
        topPerformingListing: metrics?.topPerformingListing ?? null,
      },
    };
  }, [publishedListings, topN, metrics]);

  return {
    items,
    totals,
    period,
    isLoading: listingsLoading || metricsLoading,
    isError: listingsError || metricsError,
  };
}
