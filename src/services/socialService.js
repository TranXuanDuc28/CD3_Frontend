import api from './api';

export const socialService = {
  // Post to Facebook
  postToFacebook: async (postData) => {
    const response = await api.post('/post-to-facebook', postData);
    return response.data;
  },

  // Post to Instagram
  postToInstagram: async (postData) => {
    const response = await api.post('/post-to-instagram', postData);
    return response.data;
  },

  // Get engagement data
  getEngagement: async (engagementData) => {
    const response = await api.post('/get-engagement', engagementData);
    return response.data;
  }
};
