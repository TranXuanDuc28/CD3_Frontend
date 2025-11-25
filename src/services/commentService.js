import api from './api';

export const commentService = {
  // Get all comments with pagination
  getComments: async (page = 1, limit = 10, filters = {}) => {
    const response = await api.get('/comments', {
      params: { page, limit, ...filters }
    });
    return response.data;
  },

  // Get comment by ID
  getCommentById: async (id) => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  // Process new comments
  processComments: async (comments, sessionId) => {
    const response = await api.post('/comments/process', {
      comments,
      session_id: sessionId
    });
    return response.data;
  },

  // Get comment statistics
  getCommentStats: async () => {
    const response = await api.get('/comments/stats');
    return response.data;
  },

  // Get recent comments
  getRecentComments: async (limit = 5) => {
    const response = await api.get('/comments/recent', {
      params: { limit }
    });
    return response.data;
  },

  // Update comment status
  updateCommentStatus: async (id, status) => {
    const response = await api.patch(`/comments/${id}/status`, { status });
    return response.data;
  },

  // Get chat history for a comment
  getChatHistory: async (commentId) => {
    const response = await api.get(`/comments/${commentId}/history`);
    return response.data;
  }
};
