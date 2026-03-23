import { QueryClient } from "@tanstack/react-query";

/**
 * Shared QueryClient instance so auth logout can clear cached user-specific data.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});
