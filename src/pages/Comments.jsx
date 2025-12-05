import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useApi } from '../hooks/useApi';
import { commentService } from '../services/commentService';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export default function Comments() {
  const { addNotification } = useApp();
  const [filters, setFilters] = useState({
    status: 'all',
    sentiment: 'all',
    toxic: 'all',
    search: '',
    page: 1
  });
  const [showToxicContent, setShowToxicContent] = useState({});

  const toggleToxicContent = (commentId) => {
    setShowToxicContent(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };


  // Fetch comments with filters
  const { data: commentsData, loading, execute: fetchComments } = useApi(
    () => commentService.getComments(filters.page, 10, filters),
    [filters]
  );

  const handleStatusChange = async (commentId, newStatus) => {
    try {
      const result = await commentService.updateCommentStatus(commentId, newStatus);
      if (result.success) {
        addNotification({
          type: 'success',
          message: 'Comment status updated successfully'
        });
        fetchComments();
      } else {
        addNotification({
          type: 'error',
          message: result.error || 'Failed to update comment status'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update comment status'
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'processed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const sentimentStyles = {
    positive: 'bg-green-50 text-green-700 border-green-200',
    negative: 'bg-red-50 text-red-700 border-red-200',
    neutral: 'bg-gray-50 text-gray-600 border-gray-200',
    mixed: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  };

  const formatRelativeTime = (value) => {
    if (!value) return 'Unknown time';
    try {
      return formatDistanceToNow(new Date(value), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
        <p className="text-gray-600 mt-1">
          Manage and monitor Facebook comments
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Comments
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by message or user..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="input"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sentiment
            </label>
            <select
              className="input"
              value={filters.sentiment}
              onChange={(e) => setFilters(prev => ({ ...prev, sentiment: e.target.value, page: 1 }))}
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Toxic
            </label>
            <select
              className="input"
              value={filters.toxic}
              onChange={(e) => setFilters(prev => ({ ...prev, toxic: e.target.value, page: 1 }))}
            >
              <option value="all">All</option>
              <option value="true">Toxic Only</option>
              <option value="false">Non-Toxic</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => fetchComments()}
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Filter'}
            </button>
          </div>
        </div>
      </Card>

      {/* Comments List */}
      <Card
        title={`Comments (${commentsData?.total || 0})`}
        subtitle="All Facebook comments and their processing status"
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : commentsData?.comments?.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commentsData?.comments?.map((comment) => (
              <div
                key={comment.id}
                className={`rounded-xl p-5 transition-all duration-200 ${comment.is_toxic
                  ? 'border-2 border-red-200 bg-red-50/30'
                  : 'border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-sm hover:shadow-md hover:border-blue-200'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-blue-100">
                        <span className="text-lg font-bold text-white">
                          {comment.from?.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-base font-semibold text-gray-900">
                          {comment.from?.name || 'Unknown User'}
                        </h4>
                        <a
                          href={`https://www.facebook.com/${comment.post_id}?comment_id=${comment.comment_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {formatRelativeTime(comment.created_time)}
                        </a>
                      </div>

                      {/* Metadata & Analysis */}
                      <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                        <span className="font-mono text-gray-600">#{comment.comment_id}</span>
                        <span className="font-mono text-gray-500">Post: {comment.post_id || 'N/A'}</span>

                        {/* Sentiment Badge with Score */}
                        {comment.sentiment && (
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full border ${sentimentStyles[comment.sentiment] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
                            >
                              {comment.sentiment}
                            </span>
                            {comment.sentiment_score !== undefined && comment.sentiment_score !== null && (() => {
                              const score = parseFloat(comment.sentiment_score);
                              return !isNaN(score) && (
                                <span className="text-gray-600 font-medium">
                                  {(score * 100).toFixed(0)}%
                                </span>
                              );
                            })()}
                          </div>
                        )}

                        {/* Toxic Badge */}
                        {comment.is_toxic && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full border bg-red-100 text-red-800 border-red-200">
                            ⚠️ Toxic
                            {comment.toxic_category && (
                              <span className="ml-1 text-xs">({comment.toxic_category})</span>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Keywords */}
                      {comment.keywords && (() => {
                        // Parse keywords if it's a JSON string
                        let keywordsArray = comment.keywords;
                        if (typeof keywordsArray === 'string') {
                          try {
                            keywordsArray = JSON.parse(keywordsArray);
                          } catch (e) {
                            keywordsArray = [];
                          }
                        }
                        // Ensure it's an array
                        if (!Array.isArray(keywordsArray)) {
                          keywordsArray = [];
                        }

                        return keywordsArray.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {keywordsArray.slice(0, 5).map((keyword, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200"
                              >
                                #{keyword}
                              </span>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Sentiment Score Bar */}
                      {comment.sentiment_score !== undefined && comment.sentiment_score !== null && (() => {
                        const score = parseFloat(comment.sentiment_score);
                        if (isNaN(score)) return null;

                        return (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Sentiment Score</span>
                              <span className="font-medium">{score.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all ${comment.sentiment === 'positive' ? 'bg-green-500' :
                                  comment.sentiment === 'negative' ? 'bg-red-500' :
                                    'bg-gray-400'
                                  }`}
                                style={{ width: `${Math.abs(score) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}

                      {comment.post?.content && (
                        <p className="text-xs text-gray-500 italic mb-2">
                          Post context: {comment.post.content.slice(0, 160)}
                          {comment.post.content.length > 160 && '...'}
                        </p>
                      )}

                      {/* Comment Message with Toxic Blur */}
                      <div className="relative mb-4">
                        {comment.is_toxic && !showToxicContent[comment.id] ? (
                          <div className="relative bg-red-50/50 rounded-lg p-4 border border-red-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-red-800">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                <span className="text-sm font-medium">Toxic content hidden</span>
                              </div>
                              <button
                                onClick={() => toggleToxicContent(comment.id)}
                                className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-xs font-medium shadow-sm transition-colors"
                              >
                                Show Content
                              </button>
                            </div>
                            <div className="mt-2 filter blur-sm opacity-50 select-none h-6 overflow-hidden">
                              {comment.message}
                            </div>
                          </div>
                        ) : (
                          <div className={`relative group ${comment.is_toxic ? 'bg-red-50 border border-red-100' : 'bg-white border border-blue-100 shadow-sm'} rounded-2xl rounded-tl-none p-4`}>
                            <p className={`text-base leading-relaxed ${comment.is_toxic ? 'text-gray-800' : 'text-gray-900 font-medium'}`}>
                              {comment.message}
                            </p>
                            {comment.is_toxic && showToxicContent[comment.id] && (
                              <div className="mt-3 flex justify-end">
                                <button
                                  onClick={() => toggleToxicContent(comment.id)}
                                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 bg-white px-2 py-1 rounded border border-red-100 shadow-sm"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                  Hide Content
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* AI Response */}
                      {comment.ai_response && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-400 rounded-r-lg p-4 mb-4 shadow-sm">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                              </svg>
                            </div>
                            <span className="text-xs font-semibold text-indigo-900">AI Response</span>
                          </div>
                          <p className="text-sm text-indigo-800 leading-relaxed">
                            {comment.ai_response}
                          </p>
                        </div>
                      )}

                      {/* Comment Actions */}
                      <div className="flex items-center space-x-4">
                        <span className={getStatusBadge(comment.status)}>
                          {getStatusIcon(comment.status)}
                          <span className="ml-1 capitalize">{comment.status}</span>
                        </span>

                        {comment.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(comment.comment_id || comment.id, 'processed')}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Mark as Processed
                          </button>
                        )}

                        <a
                          href={`https://www.facebook.com/${comment.post_id}?comment_id=${comment.comment_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                        >
                          View on Facebook
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {commentsData?.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {((filters.page - 1) * 10) + 1} to {Math.min(filters.page * 10, commentsData.total)} of {commentsData.total} results
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
                Page {filters.page} of {commentsData.totalPages}
              </span>

              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={filters.page === commentsData.totalPages}
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
