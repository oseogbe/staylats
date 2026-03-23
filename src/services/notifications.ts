import api from "./index";

export interface GetNotificationsParams {
  limit?: number;
}

export default {
    getUserNotifications: async (params?: GetNotificationsParams) => {
        const response = await api.get('/notifications', {
            params: params ? { limit: params.limit } : {},
        });
        return response.data.data.notifications;
    },

    markNotificationAsRead: async () => {
        const response = await api.put('/notifications/mark-as-read');
        return response.data.data;
    },

    getVapidPublicKey: async (): Promise<string> => {
        const response = await api.get('/notifications/vapid-public-key');
        return response.data.data.vapidPublicKey;
    },

    savePushSubscription: async (subscription: PushSubscription) => {
        const json = subscription.toJSON();
        const response = await api.post('/notifications/push-subscriptions', {
            endpoint: json.endpoint,
            keys: json.keys,
        });
        return response.data;
    },

    removePushSubscription: async (endpoint: string) => {
        const response = await api.delete('/notifications/push-subscriptions', {
            data: { endpoint },
        });
        return response.data;
    },
}