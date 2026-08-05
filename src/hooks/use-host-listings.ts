import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useUserDrafts, useUserListings, userListingsKey } from "@/hooks/use-listings";
import { useNotifications } from "@/hooks/use-notifications";
import { toPropertyCardData } from "@/lib/listingHelpers";
import type { DraftSummary, UserListing } from "@/services/listings";
import type { PropertyListing } from "@/components/host/types";

export type ListingStatus = UserListing['status'];

/** The tabs the host's listings are split across. */
export type HostListingTab = 'live' | 'pending' | 'drafts' | 'rejected';

/**
 * Status a tab holds. Drafts are their own query, so they have no entry here.
 *
 * The cards no longer carry a status pill: which tab a listing sits in *is* its
 * status. That makes the realtime sync below load-bearing rather than a nicety -
 * a stale cache now reads as a listing being in the wrong place entirely.
 */
const TAB_BY_STATUS: Record<Exclude<ListingStatus, 'draft'>, HostListingTab> = {
  active: 'live',
  pending: 'pending',
  declined: 'rejected',
};

/** Status each approval notification puts a listing into. */
const STATUS_BY_NOTIFICATION_TYPE: Record<string, ListingStatus> = {
  listing_approved: 'active',
  listing_declined: 'declined',
};

export const tabForStatus = (status: ListingStatus): HostListingTab =>
  status === 'draft' ? 'drafts' : TAB_BY_STATUS[status];

const toCardListing = (listing: UserListing): PropertyListing => ({
  // Location, price and occupancy come from the same mapper the public cards use
  ...toPropertyCardData(listing),
  status: listing.status,
  description: listing.description,
  address: listing.address,
  propertyType: listing.propertyType,
  images: listing.images,
  lastUpdated: new Date(listing.updatedAt).toLocaleString(),
});

const toCardDraft = (draft: DraftSummary): PropertyListing => ({
  id: draft.id,
  title: draft.title,
  type: draft.type,
  status: 'draft',
  images: draft.images,
  stepsRemaining: draft.stepsRemaining,
  lastUpdated: new Date(draft.lastUpdated).toLocaleString(),
});

/**
 * The host's listings, mapped to cards and grouped by the tab they belong in.
 */
export const useHostListings = (userId: string | undefined) => {
  const { data: listings = [], isLoading: listingsLoading } = useUserListings(userId);
  const { data: drafts = [], isLoading: draftsLoading } = useUserDrafts(userId);

  const groups = useMemo<Record<HostListingTab, PropertyListing[]>>(() => {
    const grouped: Record<HostListingTab, PropertyListing[]> = {
      live: [],
      pending: [],
      drafts: drafts.map(toCardDraft),
      rejected: [],
    };

    for (const listing of listings) {
      // A listing with an unrecognised status would otherwise vanish silently
      const tab = tabForStatus(listing.status);
      if (grouped[tab]) grouped[tab].push(toCardListing(listing));
    }

    return grouped;
  }, [listings, drafts]);

  return { groups, isLoading: listingsLoading || draftsLoading };
};

/**
 * Keeps the cached listings in step with approval decisions as they arrive over
 * the socket, so a listing moves to its new tab without waiting for a refetch.
 *
 * Mount this once per host session (the host dashboard layout does) rather than
 * per page: the decision can land while the host is on any screen, and the
 * listings query stays fresh for 5 minutes afterwards.
 */
export const useHostListingsRealtimeSync = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const handleNotification = useCallback(
    (notification: { type?: string; metadata?: Record<string, any> }) => {
      const status = STATUS_BY_NOTIFICATION_TYPE[notification?.type ?? ''];
      const listingId = notification?.metadata?.listingId;
      if (!status || !listingId) return;

      // The cache holds the raw `{ listings }` response - `select` only shapes
      // what the hook hands back - so the patch has to go inside the envelope.
      queryClient.setQueryData(
        userListingsKey(userId),
        (old: { listings?: UserListing[] } | undefined) => {
          if (!old?.listings) return old;
          return {
            ...old,
            listings: old.listings.map((listing) =>
              listing.id === listingId ? { ...listing, status } : listing
            ),
          };
        }
      );

      // An approval also moves the dashboard counts and the public feed
      queryClient.invalidateQueries({ queryKey: userListingsKey(userId) });
      queryClient.invalidateQueries({ queryKey: ['hostDashboardMetrics', userId] });
      queryClient.invalidateQueries({ queryKey: ['activeListings'] });
    },
    [queryClient, userId]
  );

  useNotifications(userId || '', { onNotification: handleNotification });
};

/**
 * Reports approval decisions to the view, for anything the cache can't express -
 * following a listing to the tab it just moved to, say.
 *
 * The handler is held in a ref because `useNotifications` registers a callback
 * once and never re-registers it; passing an inline closure straight through
 * would freeze whatever state it captured on first render.
 */
export const useListingStatusChanges = (
  userId: string | undefined,
  onChange: (change: { listingId: string; status: ListingStatus }) => void
) => {
  const handlerRef = useRef(onChange);
  useEffect(() => {
    handlerRef.current = onChange;
  });

  const handleNotification = useCallback(
    (notification: { type?: string; metadata?: Record<string, any> }) => {
      const status = STATUS_BY_NOTIFICATION_TYPE[notification?.type ?? ''];
      const listingId = notification?.metadata?.listingId;
      if (!status || !listingId) return;

      handlerRef.current({ listingId, status });
    },
    []
  );

  useNotifications(userId || '', { onNotification: handleNotification });
};
