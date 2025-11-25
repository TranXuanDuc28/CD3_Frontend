import api from './api';

export const postsService = {
  // Get all posts
  getAllPosts: async () => {
    const response = await api.get('/get-all-posts');
    // Normalize to array for FE components expecting a list
    return Array.isArray(response.data) ? response.data : (response.data?.posts || []);
  },

  // Get post by ID
  getPostById: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // Get posts to check
  getPostsToCheck: async (checkTime = null) => {
    const response = await api.post('/list-to-check', { checkTime });
    return response.data;
  },

  // Get unpublished posts
  getUnpublishedPosts: async () => {
    const response = await api.get('/unpublished-post');
    return response.data;
  },

  // Schedule a new post
  schedulePost: async (postData) => {
    const response = await api.post('/schedule-post', postData);
    return response.data;
  },

  // Update post status
  updatePostStatus: async (postId, post_id, status) => {
    const response = await api.post('/posts/update-status', {
      postId,
      post_id,
      status
    });
    return response.data;
  },

  // Generate content with AI
  generateContentWithGemini: async (prompt) => {
    const response = await api.post('/generate-content-gemini', { prompt });
    return response.data;
  },

  // Create embeddings
  createEmbeddings: async (text) => {
    const response = await api.post('/embed', { text });
    return response.data;
  },
  
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
  },

  // Get low engagement posts
  getLowEngagement: async (limit = 5) => {
    try {
      const response = await api.post('/get-engagement', {
        limit,
        threshold: 'low'
      });
      // Return array with data structure supporting various response formats
      return {
        data: Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.posts || [])
      };
    } catch (error) {
      console.warn('getLowEngagement error:', error);
      return { data: [] };
    }
  },

  // Get engagement details for a specific post
  getEngagementForPost: async (postId) => {
    try {
      const response = await api.post('/get-engagement', {
        postId
      });
      return {
        data: Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.engagements || [])
      };
    } catch (error) {
      console.warn('getEngagementForPost error:', error);
      return { data: [] };
    }
  },

  // Get media list
  getMediaList: async () => {
    try {
      const response = await api.get('/media-list');
      return Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.media || []);
    } catch (error) {
      console.warn('getMediaList error:', error);
      return [];
    }
  },

  // Delete a post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  }
};
