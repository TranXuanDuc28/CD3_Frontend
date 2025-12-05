import api from './api';

export const notificationService = {
    // Get notification statistics
    getStats: async () => {
        const response = await api.get('/notifications/stats');
        return response.data;
    },

    // Get recent notification campaigns
    getCampaigns: async (limit = 20) => {
        const response = await api.get('/notifications/campaigns', {
            params: { limit }
        });
        return response.data;
    },

    // Get notification logs for a specific post
    getPostLogs: async (postId, postType) => {
        const response = await api.get(`/notifications/logs/${postId}/${postType}`);
        return response.data;
    },

    // Trigger manual notification
    triggerNotification: async (data) => {
        const response = await api.post('/notifications/trigger', data);
        return response.data;
    }
};
