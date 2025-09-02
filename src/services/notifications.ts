import api from "./index";

export default {
    getUserNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data.data.notifications;
    },

    markNotificationAsRead: async () => {
        const response = await api.put('/notifications/mark-as-read');
        return response.data.data;
    },
}