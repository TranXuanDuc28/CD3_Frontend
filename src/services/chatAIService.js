import api from './api';

export const chatAIService = {
  // AI Reply endpoint
  aiReply: async (data) => {
    const response = await api.post('/chatai/ai-reply', data);
    return response.data;
  },

  // Get ChatAI users
  getUsers: async (params = {}) => {
    const response = await api.get('/chatai/users', { params });
    return response.data;
  },

  // Get user conversations
  getUserConversations: async (userId, limit = 50) => {
    const response = await api.get(`/chatai/users/${userId}/conversations`, {
      params: { limit }
    });
    return response.data;
  },

  // Get ChatAI responses
  getResponses: async () => {
    const response = await api.get('/chatai/responses');
    return response.data;
  },

  // Add new response
  addResponse: async (data) => {
    const response = await api.post('/chatai/responses', data);
    return response.data;
  },

  // Get analytics
  getAnalytics: async (params = {}) => {
    const response = await api.get('/chatai/analytics', { params });
    return response.data;
  },

  // Get service statistics
  getStats: async () => {
    const response = await api.get('/chatai/stats');
    return response.data;
  },

  // Test AI service
  testAI: async (message) => {
    const response = await api.post('/chatai/test-ai', { message });
    return response.data;
  },

  refreshDynamicContent: async () => {
    const response = await api.post('/chatai/refresh-dynamic-content');
    return response.data;
  },

  getPostsAnalysis: async (limit = 20, days = 30) => {
    const response = await api.get(`/chatai/posts-analysis?limit=${limit}&days=${days}`);
    return response.data;
  }
};
