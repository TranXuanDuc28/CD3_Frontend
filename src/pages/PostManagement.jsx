import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useApi } from '../hooks/useApi';
import { postsService } from '../services/postsService';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { toVietnamISOString, fromVietnamISOString, formatVietnamTime } from '../utils/timezone';
import {
  DocumentTextIcon,
  PlusIcon,
  CalendarIcon,
  SparklesIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export default function PostManagement() {
  const { addNotification } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [lowEngagedPostIds, setLowEngagedPostIds] = useState(new Set());
  const [editingEngagements, setEditingEngagements] = useState([]);
  const [postEngagements, setPostEngagements] = useState({});
  const [loadingEngagements, setLoadingEngagements] = useState(false);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    topic: '',
    useAI: false,
    media: null,
    platform: ['facebook'],
    scheduledAt: null,
    isSpecialOccasion: false,
    specialOccasionType: ''
  });

  // Fetch all posts
  const { data: posts, loading, execute: fetchPosts } = useApi(postsService.getAllPosts);

  // Fetch posts to check
  const { data: postsToCheck, execute: fetchPostsToCheck } = useApi(postsService.getPostsToCheck);

  // Fetch unpublished posts
  const { data: unpublishedPosts, execute: fetchUnpublishedPosts } = useApi(postsService.getUnpublishedPosts);
  useEffect(() => {
    // fetch posts and media list on mount
    fetchPosts();
    // fetch low-engagement posts
    postsService.getLowEngagement(5).then(res => {
      try {
        const rows = res.data || [];
        const ids = new Set(rows.map(e => {
          // engagement row may include platformPost -> post -> id, or platformPost.post_id, or top-level post_id
          return (e.platformPost && e.platformPost.post && e.platformPost.post.id)
            || (e.platformPost && e.platformPost.post_id)
            || e.post_id
            || e.postId
            || null;
        }).filter(Boolean));
        setLowEngagedPostIds(ids);
      } catch (err) {
        console.warn('Failed to parse low engagement response', err);
      }
    }).catch(() => setLowEngagedPostIds(new Set()));
    if (typeof postsService.getMediaList === 'function') {
      postsService.getMediaList()
        .then((res) => setMediaList(res || []))
        .catch(() => setMediaList([]));
    }
    // optionally fetch other lists if needed
  }, []);

  // Fetch engagement data for all posts
  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const fetchAllEngagements = async () => {
      setLoadingEngagements(true);
      const engagementsMap = {};

      console.log('🔍 Fetching engagement data for', posts.length, 'posts');

      for (const post of posts) {
        try {
          console.log('📊 Fetching engagement for post:', post.id, post.title);
          const res = await postsService.getEngagementForPost(post.id);
          console.log('✅ Engagement response for', post.id, ':', res);
          engagementsMap[post.id] = res.data || [];
        } catch (err) {
          console.warn(`❌ Failed to load engagement for post ${post.id}`, err);
          engagementsMap[post.id] = [];
        }
      }

      console.log('📈 Final engagements map:', engagementsMap);
      setPostEngagements(engagementsMap);
      setLoadingEngagements(false);
    };

    fetchAllEngagements();
  }, [posts]);

  // When editingPost is set, fetch engagement rows for that post
  useEffect(() => {
    let cancelled = false;
    if (editingPost && editingPost.id) {
      postsService.getEngagementForPost(editingPost.id)
        .then(res => {
          if (cancelled) return;
          setEditingEngagements(res.data || []);
        })
        .catch(err => {
          console.warn('Failed to load engagement for post', err);
          setEditingEngagements([]);
        });
    } else {
      setEditingEngagements([]);
    }
    return () => { cancelled = true; };
  }, [editingPost]);
  useEffect(() => {
    let objectUrl;
    if (newPost?.media instanceof File) {
      objectUrl = URL.createObjectURL(newPost.media);
      setMediaPreview(objectUrl);
    } else {
      setMediaPreview(newPost?.media?.url || null);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [newPost.media]);
  const handleCreatePost = async (e) => {
    e.preventDefault();
    console.log('handleCreatePost called', { media: newPost.media, scheduledAt: newPost.scheduledAt });
    try {
      // If media is a File, upload it to Cloudinary first and get the URL
      let mediaUrl = null;
      if (newPost.media instanceof File) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        console.log('cloudName,preset', cloudName, preset);
        if (!cloudName || !preset) {
          throw new Error('Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
        }

        const fd = new FormData();
        fd.append('file', newPost.media);
        fd.append('upload_preset', preset);
        fd.append("folder", "posted_images");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: fd
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
        }

        const json = await res.json();
        mediaUrl = json.secure_url || json.url || null;
      } else if (newPost.media && newPost.media.url) {
        mediaUrl = newPost.media.url;
      }
      console.log('Uploaded media to Cloudinary, got URL:', mediaUrl);

      // Build payload to send to backend. Backend should accept mediaUrl (string) or null.
      const payload = {
        title: newPost.title,
        content: newPost.content,
        topic: newPost.topic,
        useAI: newPost.useAI,
        platform: newPost.platform,
        scheduledAt: newPost.scheduledAt || null,
        isSpecialOccasion: newPost.isSpecialOccasion,
        specialOccasionType: newPost.specialOccasionType,
        mediaUrl
      };

      const result = await postsService.schedulePost(payload);
      addNotification({ type: 'success', message: 'Post created successfully!' });
      setShowCreateModal(false);
      setNewPost({ title: '', content: '', topic: '', useAI: false, media: null, platform: ['facebook'], scheduledAt: null });
      fetchPosts();
    } catch (error) {
      console.error('Create post error', error);
      addNotification({ type: 'error', message: `Failed to create post: ${error.message || error}` });
    }
  };

  const handleUpdateStatus = async (postId, post_id, status) => {
    try {
      await postsService.updatePostStatus(postId, post_id, status);
      addNotification({
        type: 'success',
        message: `Post status updated to ${status}`
      });
      fetchPosts();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to update post status'
      });
    }
  };

  const generateAIContent = async () => {
    try {
      const result = await postsService.generateContentWithGemini(newPost.topic);
      setNewPost(prev => ({
        ...prev,
        content: result.content || result.response || result
      }));
      addNotification({
        type: 'success',
        message: 'AI content generated successfully!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to generate AI content'
      });
    }
  };

  // Helper function to get Facebook URL from post
  const getFacebookUrl = (post) => {
    if (!post.platformPosts || post.platformPosts.length === 0) {
      return null;
    }

    const fbPost = post.platformPosts.find(pp => pp.platform === 'facebook');
    if (!fbPost || !fbPost.platform_post_id) {
      return null;
    }

    // Facebook post URL format: https://www.facebook.com/{post_id}
    return `https://www.facebook.com/${fbPost.platform_post_id}`;
  };

  // Handle click on post to open Facebook
  const handlePostClick = (post, e) => {
    // Don't trigger if clicking on buttons
    if (e.target.closest('button')) {
      return;
    }

    const fbUrl = getFacebookUrl(post);
    if (fbUrl) {
      window.open(fbUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getStatusBadge = (status) => {

    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'scheduled':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post Management</h1>
          <p className="text-gray-600 mt-1">
            Create, schedule, and manage your social media posts
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-4 py-2 flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts?.length || 0}
              </p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {posts?.filter(p => p.status === 'published').length || 0}
              </p>
            </div>
            <EyeIcon className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">
                {posts?.filter(p => p.status === 'scheduled').length || 0}
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {posts?.filter(p => p.status === 'pending').length || 0}
              </p>
            </div>
            <CalendarIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Posts List */}
      <Card
        title="All Posts"
        subtitle="Manage your social media posts"
        actions={
          <button
            onClick={fetchPosts}
            className="btn-secondary px-3 py-1 text-sm"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Refresh'}
          </button>
        }
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : posts?.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500">Create your first post to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts?.map((post) => {
              const engagements = postEngagements[post.id] || [];
              const hasFacebookUrl = getFacebookUrl(post) !== null;

              return (
                <div
                  key={post.id}
                  className={`border border-gray-200 rounded-lg p-4 transition-colors ${hasFacebookUrl ? 'hover:bg-gray-50 cursor-pointer' : ''
                    }`}
                  onClick={(e) => handlePostClick(post, e)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                        <span className={getStatusBadge(post.status)}>
                          {post.status}
                        </span>
                        {lowEngagedPostIds.has(post.id) && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Low engagement
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                        <span>Topic: {post.topic}</span>
                        <span>Platform: {post.platform}</span>
                        {post.useAI && (
                          <span className="flex items-center space-x-1">
                            <SparklesIcon className="w-3 h-3" />
                            <span>AI Generated</span>
                          </span>
                        )}
                        <span>
                          Created: {formatVietnamTime(post.created_at, 'YYYY-MM-DD HH:mm:ss')}
                        </span>
                      </div>

                      {/* Engagement Metrics */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {loadingEngagements ? (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <LoadingSpinner size="sm" />
                            <span>Đang tải dữ liệu tương tác...</span>
                          </div>
                        ) : engagements.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">Lượt tương tác:</p>
                            {engagements.map((eng) => (
                              <div key={eng.id} className="flex items-center space-x-4 text-xs text-gray-600">
                                <span className="font-medium text-blue-600">{eng.platform}</span>
                                <span>👍 {eng.likes || 0}</span>
                                <span>💬 {eng.comments || 0}</span>
                                <span>🔄 {eng.shares || 0}</span>
                                <span>👁️ {eng.views || 0}</span>
                                {eng.engagement_score > 0 && (
                                  <span className="ml-auto font-medium">Score: {eng.engagement_score}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Chưa có dữ liệu tương tác
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {post.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(post.id, post.id, 'published')}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Publish
                        </button>
                      )}

                      <button
                        onClick={() => setEditingPost(post)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Post</h2>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={newPost.topic}
                  onChange={(e) => setNewPost(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="Enter topic or theme"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <div className="flex space-x-2 mb-2">
                  <textarea
                    required
                    rows={4}
                    className="input flex-1"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your post content..."
                  />
                </div>
                <button
                  type="button"
                  onClick={generateAIContent}
                  className="btn-secondary text-sm flex items-center space-x-2"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>Generate with AI</span>
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (Optional)
                </label>

                <div className="flex items-center space-x-4">
                  {mediaList?.length > 0 && (
                    <select
                      className="input max-w-xs"
                      value={newPost.media && newPost.media.id ? String(newPost.media.id) : ''}
                      onChange={(e) => {
                        const id = e.target.value;
                        if (!id) {
                          setNewPost(prev => ({ ...prev, media: null }));
                          return;
                        }
                        const selected = mediaList.find(m => String(m.id) === String(id));
                        if (selected) {
                          setNewPost(prev => ({ ...prev, media: { id: selected.id, url: selected.url || selected.path } }));
                        }
                      }}
                    >
                      <option value="">-- Chọn ảnh sẵn có --</option>
                      {mediaList.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.filename || m.name || m.id}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setNewPost(prev => ({ ...prev, media: file }));
                      }}
                    />
                  </div>
                </div>

                {mediaPreview && (
                  <div className="mt-2">
                    <img src={mediaPreview} alt="preview" className="h-24 object-contain rounded border" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPost.platform.includes('facebook')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewPost(prev => ({
                            ...prev,
                            platform: [...prev.platform, 'facebook']
                          }));
                        } else {
                          setNewPost(prev => ({
                            ...prev,
                            platform: prev.platform.filter(p => p !== 'facebook')
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    Facebook
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPost.platform.includes('instagram')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewPost(prev => ({
                            ...prev,
                            platform: [...prev.platform, 'instagram']
                          }));
                        } else {
                          setNewPost(prev => ({
                            ...prev,
                            platform: prev.platform.filter(p => p !== 'instagram')
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    Instagram
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  className="input"
                  value={newPost.scheduledAt ? fromVietnamISOString(newPost.scheduledAt) : ''}
                  onChange={(e) => setNewPost(prev => ({
                    ...prev,
                    scheduledAt: e.target.value ? toVietnamISOString(e.target.value) : null
                  }))}
                />
              </div>


              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useAI"
                  checked={newPost.useAI}
                  onChange={(e) => setNewPost(prev => ({ ...prev, useAI: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="useAI" className="text-sm text-gray-700">
                  Use AI for content optimization
                </label>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id="isSpecialOccasion"
                    checked={newPost.isSpecialOccasion}
                    onChange={(e) => setNewPost(prev => ({ ...prev, isSpecialOccasion: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isSpecialOccasion" className="text-sm font-medium text-gray-700">
                    Đây là bài đăng dịp đặc biệt (Gửi thông báo Messenger)
                  </label>
                </div>

                {newPost.isSpecialOccasion && (
                  <div className="ml-6">
                    <label className="block text-sm text-gray-600 mb-1">
                      Loại dịp đặc biệt
                    </label>
                    <select
                      className="input w-full max-w-xs"
                      value={newPost.specialOccasionType}
                      onChange={(e) => setNewPost(prev => ({ ...prev, specialOccasionType: e.target.value }))}
                    >
                      <option value="">-- Chọn dịp --</option>
                      <option value="Tết">Tết Nguyên Đán</option>
                      <option value="Noel">Giáng Sinh</option>
                      <option value="Black Friday">Black Friday</option>
                      <option value="Valentine">Valentine</option>
                      <option value="Sinh Nhật">Sinh Nhật</option>
                      <option value="8/3">Quốc Tế Phụ Nữ 8/3</option>
                      <option value="Khác">Sự kiện khác</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      * Tin nhắn sẽ được gửi tự động đến khách hàng đã tương tác trong 5 ngày qua.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2"
                >
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / View Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Post Details</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingPost(null)}
                  className="btn-secondary px-3 py-1"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Title: {editingPost.title}</h3>
                <p className="text-sm text-gray-600">Topic: {editingPost.topic}</p>
                <p className="mt-2 text-gray-800 whitespace-pre-wrap">Content: {editingPost.content}</p>
              </div>

              {editingPost.media && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Media</p>
                  <img src={editingPost.media} alt="post media" className="max-h-64 object-contain rounded border" />
                </div>
              )}

              {editingEngagements?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mt-4">Engagement details</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editingEngagements.map((e) => (
                      <div key={e.id} className="p-3 border rounded bg-gray-50">
                        <div className="text-xs text-gray-500">Platform: {e.platform}</div>
                        <div className="text-sm font-medium">Score: {e.engagement_score}</div>
                        <div className="text-xs text-gray-600">Likes: {e.likes} • Comments: {e.comments} • Shares: {e.shares}</div>
                        <div className="text-xs text-gray-600">Views: {e.views} • Clicks: {e.clicks}</div>
                        <div className="text-xs text-gray-400">Last checked: {e.last_checked_at ? new Date(e.last_checked_at).toLocaleString() : '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Created: {formatVietnamTime(editingPost.created_at, 'YYYY-MM-DD HH:mm:ss')}</div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={async () => {
                      if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
                      try {
                        await postsService.deletePost(editingPost.id);
                        addNotification({ type: 'success', message: 'Post deleted' });
                        setEditingPost(null);
                        fetchPosts();
                      } catch (err) {
                        console.error('Failed to delete post', err);
                        addNotification({ type: 'error', message: 'Failed to delete post' });
                      }
                    }}
                    className="btn-danger px-3 py-1 flex items-center space-x-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
