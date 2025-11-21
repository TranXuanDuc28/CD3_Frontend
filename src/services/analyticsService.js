import api from './api';

const cleanParams = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null);
  return Object.fromEntries(entries);
};

export const analyticsService = {
  // GET /analytics/summary
  getSummary: async (days = 7) => {
    const response = await api.get('/analytics/summary', {
      params: cleanParams({ days })
    });
    return response.data;
  },

  // GET /analytics/sentiment-trend
  getSentimentTrend: async (days = 30) => {
    const response = await api.get('/analytics/sentiment-trend', {
      params: cleanParams({ days })
    });
    return response.data;
  },

  // GET /analytics/keywords
  getTopKeywords: async ({ sentiment, limit = 10 } = {}) => {
    const response = await api.get('/analytics/keywords', {
      params: cleanParams({ sentiment, limit })
    });
    return response.data;
  },

  // GET /analytics/dashboard (optional combined payload)
  getDashboard: async (days = 7) => {
    const response = await api.get('/analytics/dashboard', {
      params: cleanParams({ days })
    });
    return response.data;
  }
};
