import React, { useState, useEffect } from 'react';
import { chatAIService } from '../../services/chatAIService';
import Card from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';
import {
  ArrowPathIcon,
  DocumentTextIcon,
  ChartBarIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function DynamicContentAnalysis() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [limit, setLimit] = useState(20);
  const [days, setDays] = useState(30);

  const fetchPostsAnalysis = async () => {
    setLoading(true);
    try {
      const response = await chatAIService.getPostsAnalysis(limit, days);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshDynamicContent = async () => {
    setRefreshing(true);
    try {
      await chatAIService.refreshDynamicContent();
      await fetchPostsAnalysis();
    } catch (error) {
      console.error('Error refreshing dynamic content:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPostsAnalysis();
  }, [limit, days]);

  const totalDynamicResponses = posts.reduce((sum, post) => sum + post.dynamic_responses_count, 0);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">Dynamic Content Analysis</h3>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Last</label>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value={7}>7 days</option>
                <option value={15}>15 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Limit</label>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value={10}>10 posts</option>
                <option value={20}>20 posts</option>
                <option value={50}>50 posts</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleRefreshDynamicContent}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Content'}</span>
          </button>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Posts Analyzed</p>
              <p className="text-2xl font-semibold text-gray-900">{posts.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <SparklesIcon className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Dynamic Responses</p>
              <p className="text-2xl font-semibold text-gray-900">{totalDynamicResponses}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <TagIcon className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Topics/Post</p>
              <p className="text-2xl font-semibold text-gray-900">
                {posts.length > 0 ? Math.round(totalDynamicResponses / posts.length * 10) / 10 : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
              <p className="text-2xl font-semibold text-gray-900">
                {posts.length > 0 ? Math.round(posts.reduce((sum, post) => sum + post.engagement_score, 0) / posts.length) : 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Posts Analysis */}
      <Card>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Posts Analysis</h4>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 mb-2">{post.title}</h5>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Published: {new Date(post.published_at).toLocaleDateString()}</span>
                      <span>Platforms: {post.platform_posts_count}</span>
                      <span>Engagements: {post.engagements_count}</span>
                      <span>Score: {post.engagement_score}</span>
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {post.dynamic_responses_count} responses
                    </div>
                  </div>
                </div>

                {/* Extracted Topics */}
                {post.extracted_topics && post.extracted_topics.length > 0 && (
                  <div className="mt-3">
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Extracted Topics:</h6>
                    <div className="flex flex-wrap gap-2">
                      {post.extracted_topics.map((topic, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                        >
                          {topic.keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campaign Responses */}
                {post.campaign_responses && post.campaign_responses.length > 0 && (
                  <div className="mt-3">
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Campaign Responses:</h6>
                    <div className="flex flex-wrap gap-2">
                      {post.campaign_responses.map((response, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                        >
                          {response.category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {posts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No published posts found in the selected time range.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
