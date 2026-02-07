import { useMemo } from "react";
import { useUserListings } from "@/hooks/use-listings";
import type { UserListing } from "@/services/listings";

export type DashboardPeriod = "all-time" | "yearly" | "monthly" | "daily";

const OVERVIEW_TOP_N = 5;

export interface OverviewListingItem {
  id: string;
  title: string;
  type: string;
  location: string;
  status: string;
  /** Placeholder – will come from bookings API later */
  bookings: number;
  /** Placeholder – will come from payments API later */
  currentEarnings: number;
}

export interface DashboardTotals {
  /** Published listings only (excludes drafts, includes pending approval) */
  totalProperties: number;
  rentals: number;
  shortlets: number;
  totalEarnings: number;
  totalBookings: number;
  /** Number of shortlets/rentals that have produced earnings */
  earningShortlets: number;
  earningRentals: number;
  /** Number of shortlets/rentals that have been booked */
  bookedShortlets: number;
  bookedRentals: number;
  /** Title of the top-performing listing (by bookings/earnings) */
  topPerformingListing: string | null;
}

export interface UseOverviewListingsResult {
  /** Top N published listings for the overview table */
  items: OverviewListingItem[];
  /** Aggregated totals for metric cards */
  totals: DashboardTotals;
  /** The currently active period filter (pass-through for UI) */
  period: DashboardPeriod;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Provides data for the host dashboard Overview section and metric cards.
 *
 * Accepts a `period` argument so the UI can pass the selected filter.
 * Right now bookings/earnings are always zero (not yet implemented).
 * When the booking & payments APIs are ready, this hook is the single
 * place to wire them in — no changes needed in the components.
 */
export function useOverviewListings(
  period: DashboardPeriod = "all-time",
  topN: number = OVERVIEW_TOP_N
): UseOverviewListingsResult {
  const {
    data: publishedListings = [],
    isLoading,
    isError,
  } = useUserListings();

  const { items, totals } = useMemo(() => {
    const allPublished = publishedListings as UserListing[];

    // Build overview rows (top N published listings)
    const overviewItems: OverviewListingItem[] = allPublished
      .slice(0, topN)
      .map((listing) => ({
        id: listing.id,
        title: listing.title || "Untitled",
        type: listing.type,
        location: [listing.city, listing.state].filter(Boolean).join(", ") || "—",
        status: listing.status,
        // TODO: replace with real data from bookings API, filtered by `period`
        bookings: 0,
        currentEarnings: 0,
      }));

    // Count by type (published only — excludes drafts)
    const rentals = allPublished.filter((l) => l.type === "rental").length;
    const shortlets = allPublished.filter((l) => l.type === "shortlet").length;

    // TODO: compute real totals once booking/payment APIs exist
    const totalEarnings = 0;
    const totalBookings = 0;

    // TODO: replace with real counts from booking/payment data, filtered by `period`
    const earningShortlets = overviewItems.filter(
      (i) => i.type === "shortlet" && i.currentEarnings > 0
    ).length;
    const earningRentals = overviewItems.filter(
      (i) => i.type === "rental" && i.currentEarnings > 0
    ).length;
    const bookedShortlets = overviewItems.filter(
      (i) => i.type === "shortlet" && i.bookings > 0
    ).length;
    const bookedRentals = overviewItems.filter(
      (i) => i.type === "rental" && i.bookings > 0
    ).length;

    // Top performing = listing with highest earnings (all zero for now → null)
    const topPerformingListing: string | null =
      totalEarnings > 0
        ? overviewItems.reduce((best, cur) =>
            cur.currentEarnings > best.currentEarnings ? cur : best
          ).title
        : null;

    return {
      items: overviewItems,
      totals: {
        totalProperties: allPublished.length,
        rentals,
        shortlets,
        totalEarnings,
        totalBookings,
        earningShortlets,
        earningRentals,
        bookedShortlets,
        bookedRentals,
        topPerformingListing,
      },
    };
  }, [publishedListings, topN, period]);

  return {
    items,
    totals,
    period,
    isLoading,
    isError,
  };
}
