import { useEffect, useRef, useCallback } from 'react';

import notificationsAPI from '@/services/notifications';
import {
  isPushSupported,
  isPushSubscribed,
  markPushSubscribed,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
} from '@/lib/pushNotifications';

export function usePushNotifications(userId: string | undefined) {
  const subscribing = useRef(false);

  const subscribe = useCallback(async () => {
    if (!userId || !isPushSupported() || isPushSubscribed() || subscribing.current) return;
    subscribing.current = true;

    try {
      const permission = await requestNotificationPermission();
      if (permission !== 'granted') {
        subscribing.current = false;
        return;
      }

      const vapidPublicKey = await notificationsAPI.getVapidPublicKey();
      if (!vapidPublicKey) {
        subscribing.current = false;
        return;
      }

      const subscription = await subscribeToPush(vapidPublicKey);
      if (!subscription) {
        subscribing.current = false;
        return;
      }

      await notificationsAPI.savePushSubscription(subscription);
      markPushSubscribed();
    } catch (error) {
      console.error('Push notification subscription failed:', error);
    } finally {
      subscribing.current = false;
    }
  }, [userId]);

  const unsubscribe = useCallback(async () => {
    if (!isPushSupported()) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await notificationsAPI.removePushSubscription(subscription.endpoint).catch(() => {});
      }
      await unsubscribeFromPush();
    } catch (error) {
      console.error('Push notification unsubscribe failed:', error);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      subscribe();
    }
  }, [userId, subscribe]);

  return { subscribe, unsubscribe };
}
