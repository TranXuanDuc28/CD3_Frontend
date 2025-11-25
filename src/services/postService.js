import api from './api';

export const postService = {
  // Get all posts with pagination
  getPosts: async (page = 1, limit = 10, filters = {}) => {
    const response = await api.get('/posts', {
      params: { page, limit, ...filters }
    });
    return response.data;
  },

  // Get post by ID
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Get posts from Facebook
  getFacebookPosts: async (pageId, limit = 10) => {
    const response = await api.get('/posts/facebook', {
      params: { page_id: pageId, limit }
    });
    return response.data;
  },

  // Get post statistics
  getPostStats: async (postId) => {
    const response = await api.get(`/posts/${postId}/stats`);
    return response.data;
  },

  // Update post settings
  updatePostSettings: async (postId, settings) => {
    const response = await api.patch(`/posts/${postId}/settings`, settings);
    return response.data;
  },

  // Get trending posts
  getTrendingPosts: async (limit = 5) => {
    const response = await api.get('/posts/trending', {
      params: { limit }
    });
    return response.data;
  }
};
