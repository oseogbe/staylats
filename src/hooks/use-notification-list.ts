import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import notificationsAPI from "@/services/notifications";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

/**
 * One key for the notification list.
 *
 * The bell and the communications page each had their own
 * ("persistedNotification" and "userNotifications"), so the same rows were
 * fetched twice and marking them read in one place left the other showing a
 * stale unread badge until its cache expired.
 */
export const notificationsKey = (userId: string | undefined) =>
  ["notifications", userId] as const;

export const useNotificationList = (userId: string | undefined) =>
  useQuery({
    queryKey: notificationsKey(userId),
    queryFn: () => notificationsAPI.getUserNotifications({ limit: 50 }),
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });

/**
 * Marks every notification read - the explicit "mark all as read" action.
 *
 * Optimistic: the badge clears on click rather than after a round trip, and
 * rolls back if the request fails.
 */
export const useMarkNotificationsRead = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const key = notificationsKey(userId);

  return useMutation({
    mutationFn: () => notificationsAPI.markAllNotificationsAsRead(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Notification[]>(key);

      queryClient.setQueryData<Notification[]>(key, (old) =>
        old?.map((notification) => ({ ...notification, read: true })) ?? []
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};

/**
 * Marks one notification read, on open.
 *
 * The bell used to mark everything read the moment it was opened, so the count
 * measured "has the user glanced at the bell" rather than what they had
 * actually read.
 */
export const useMarkNotificationRead = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const key = notificationsKey(userId);

  return useMutation({
    mutationFn: (id: string) => notificationsAPI.markNotificationAsRead(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Notification[]>(key);

      queryClient.setQueryData<Notification[]>(key, (old) =>
        old?.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        ) ?? []
      );

      return { previous };
    },

    onError: (_error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
