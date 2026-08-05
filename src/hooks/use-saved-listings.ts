import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import savedListingsService from "@/services/saved-listings";
import { useAuth } from "@/contexts/AuthContext";

const savedListingsKey = (userId: string | undefined) =>
  ["savedListings", userId] as const;
const savedListingIdsKey = (userId: string | undefined) =>
  ["savedListingIds", userId] as const;

/** The listings the signed-in user has saved, ready for the saved page. */
export const useSavedListings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: savedListingsKey(user?.id),
    queryFn: () => savedListingsService.getSavedListings(),
    enabled: Boolean(user?.id),
    staleTime: 60 * 1000,
    retry: 1,
    select: (data) => data.listings || [],
  });
};

/**
 * The set of saved listing ids, for the heart on a listing card.
 *
 * Kept separate from the full list so a card can show its state without every
 * page pulling down each saved listing's payload.
 */
export const useSavedListingIds = () => {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: savedListingIdsKey(user?.id),
    queryFn: () => savedListingsService.getSavedListingIds(),
    enabled: Boolean(user?.id),
    staleTime: 60 * 1000,
    retry: 1,
    select: (result) => result.listingIds || [],
  });

  return useMemo(() => new Set(data ?? []), [data]);
};

/**
 * Save or unsave a listing, flipping the heart immediately and rolling back if
 * the request fails.
 */
export const useToggleSavedListing = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const idsKey = savedListingIdsKey(user?.id);

  return useMutation({
    mutationFn: ({ listingId, saved }: { listingId: string; saved: boolean }) =>
      saved
        ? savedListingsService.unsaveListing(listingId)
        : savedListingsService.saveListing(listingId),

    onMutate: async ({ listingId, saved }) => {
      // Stop an in-flight refetch from landing on top of the optimistic value
      await queryClient.cancelQueries({ queryKey: idsKey });
      const previous = queryClient.getQueryData<{ listingIds: string[] }>(idsKey);

      queryClient.setQueryData(
        idsKey,
        (old: { listingIds?: string[] } | undefined) => {
          const ids = old?.listingIds ?? [];
          return {
            ...old,
            listingIds: saved
              ? ids.filter((id) => id !== listingId)
              : [...ids, listingId],
          };
        }
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(idsKey, context.previous);
      }
      toast.error("Could not update your favourites. Please try again.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: idsKey });
      queryClient.invalidateQueries({ queryKey: savedListingsKey(user?.id) });
    },
  });
};
