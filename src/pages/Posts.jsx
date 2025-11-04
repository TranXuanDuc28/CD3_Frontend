import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { postService } from '../services/postService';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export default function Posts() {
  const [filters, setFilters] = useState({
    search: '',
    page: 1
  });

  // Fetch posts
  const { data: postsData, loading, execute: fetchPosts } = useApi(
    () => postService.getPosts(filters.page, 10, filters),
    [filters]
  );

  const { data: trendingPosts, loading: trendingLoading } = useApi(
    () => postService.getTrendingPosts(5)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <p className="text-gray-600 mt-1">
          Monitor Facebook posts and their comment activity
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>
          </div>
          <button
            onClick={() => fetchPosts()}
            className="btn-primary px-4 py-2"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Search'}
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts List */}
        <div className="lg:col-span-2">
          <Card
            title={`Facebook Posts (${postsData?.total || 0})`}
            subtitle="All posts from your Facebook page"
          >
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="flex space-x-4">
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : postsData?.posts?.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-500">Try adjusting your search or check back later.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {postsData?.posts?.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {post.message?.substring(0, 100) || 'No message content'}
                          {post.message?.length > 100 && '...'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(post.created_time), { addSuffix: true })}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        ID: {post.id}
                      </span>
                    </div>
                    
                    {/* Post Image */}
                    {post.full_picture && (
                      <div className="mb-3">
                        <img
                          src={post.full_picture}
                          alt="Post"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    {/* Post Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span>{post.comments?.summary?.total_count || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HeartIcon className="w-4 h-4" />
                          <span>{post.likes?.summary?.total_count || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ShareIcon className="w-4 h-4" />
                          <span>{post.shares?.count || 0}</span>
                        </div>
                      </div>
                      
                      <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {postsData?.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {((filters.page - 1) * 10) + 1} to {Math.min(filters.page * 10, postsData.total)} of {postsData.total} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={filters.page === 1}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    Page {filters.page} of {postsData.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={filters.page === postsData.totalPages}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Trending Posts Sidebar */}
        <div>
          <Card
            title="Trending Posts"
            subtitle="Most commented posts this week"
          >
            {trendingLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : trendingPosts?.length === 0 ? (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No trending posts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trendingPosts?.map((post, index) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-700">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-2 mb-1">
                        {post.message?.substring(0, 80) || 'No message content'}
                        {post.message?.length > 80 && '...'}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ChatBubbleLeftRightIcon className="w-3 h-3" />
                          <span>{post.comments?.summary?.total_count || 0}</span>
                        </div>
                        <span>{formatDistanceToNow(new Date(post.created_time), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
