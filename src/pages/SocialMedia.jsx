import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useApi } from '../hooks/useApi';
import { socialService } from '../services/socialService';
import { postsService } from '../services/postsService';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import {
  ShareIcon,
  PhotoIcon,
  VideoCameraIcon,
  LinkIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  CalendarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function SocialMedia() {
  const { addNotification } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [postType, setPostType] = useState('text');
  const [postData, setPostData] = useState({
    content: '',
    image_url: '',
    hashtags: [],
    post_type: 'text',
    priority: 'normal'
  });

  // Fetch posts data
  const { data: posts, loading, execute: fetchPosts } = useApi(postsService.getAllPosts);

  const handlePostToSocial = async () => {
    try {
      const payload = {
        ...postData,
        post_type: postType,
        original_post_id: null
      };

      let response;
      if (selectedPlatform === 'facebook') {
        response = await socialService.postToFacebook(payload);
      } else if (selectedPlatform === 'instagram') {
        response = await socialService.postToInstagram(payload);
      }

      if (response.success) {
        addNotification({
          type: 'success',
          message: `Posted successfully to ${selectedPlatform}!`
        });
        setPostData({
          content: '',
          image_url: '',
          hashtags: [],
          post_type: 'text',
          priority: 'normal'
        });
      } else {
        addNotification({
          type: 'error',
          message: `Failed to post to ${selectedPlatform}`
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to post to social media'
      });
    }
  };

  const getPlatformStats = () => {
    const facebookPosts = posts?.filter(p => p.platform?.includes('facebook')) || [];
    const instagramPosts = posts?.filter(p => p.platform?.includes('instagram')) || [];
    
    return {
      facebook: facebookPosts.length,
      instagram: instagramPosts.length,
      total: posts?.length || 0
    };
  };
 

  const stats = getPlatformStats();
  console.log("stats",stats);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Media Management</h1>
        <p className="text-gray-600 mt-1">
          Post content directly to Facebook and Instagram
        </p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Facebook Posts</p>
              <p className="text-2xl font-bold text-blue-600">{stats.facebook}</p>
            </div>
            <GlobeAltIcon className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Instagram Posts</p>
              <p className="text-2xl font-bold text-pink-600">{stats.instagram}</p>
            </div>
            <PhotoIcon className="w-8 h-8 text-pink-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ShareIcon className="w-8 h-8 text-gray-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Post */}
        <Card
          title="Quick Post"
          subtitle="Post content directly to social media"
        >
          <div className="space-y-4">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="facebook"
                    checked={selectedPlatform === 'facebook'}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="mr-2"
                  />
                  Facebook
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="instagram"
                    checked={selectedPlatform === 'instagram'}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="mr-2"
                  />
                  Instagram
                </label>
              </div>
            </div>

            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="text"
                    checked={postType === 'text'}
                    onChange={(e) => setPostType(e.target.value)}
                    className="mr-2"
                  />
                  Text
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="image"
                    checked={postType === 'image'}
                    onChange={(e) => setPostType(e.target.value)}
                    className="mr-2"
                  />
                  Image
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="video"
                    checked={postType === 'video'}
                    onChange={(e) => setPostType(e.target.value)}
                    className="mr-2"
                  />
                  Video
                </label>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                rows={4}
                className="input"
                value={postData.content}
                onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your post content..."
                required
              />
            </div>

            {/* Image URL */}
            {postType === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  className="input"
                  value={postData.image_url}
                  onChange={(e) => setPostData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {/* Hashtags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hashtags (comma separated)
              </label>
              <input
                type="text"
                className="input"
                value={postData.hashtags.join(', ')}
                onChange={(e) => setPostData(prev => ({ 
                  ...prev, 
                  hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                }))}
                placeholder="#hashtag1, #hashtag2, #hashtag3"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                className="input"
                value={postData.priority}
                onChange={(e) => setPostData(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Post Button */}
            <button
              onClick={handlePostToSocial}
              disabled={!postData.content}
              className="btn-primary w-full py-2 disabled:opacity-50"
            >
              Post to {selectedPlatform === 'facebook' ? 'Facebook' : 'Instagram'}
            </button>
          </div>
        </Card>

        {/* Recent Posts */}
        <Card
          title="Recent Posts"
          subtitle="Latest posts across all platforms"
        >
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-8">
              <ShareIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No posts found</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {posts?.slice(0, 10).map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{post.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          post.platform?.includes('facebook') ? 'bg-blue-100 text-blue-800' :
                          post.platform?.includes('instagram') ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.platform}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' :
                          post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
