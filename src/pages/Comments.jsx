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
  FunnelIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export default function Comments() {
  const { addNotification } = useApp();
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1
  });

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              Status Filter
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
              <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {comment.from?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {comment.from?.name || 'Unknown User'}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(comment.created_time)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
                        <span className="font-mono text-gray-600">#{comment.comment_id}</span>
                        <span className="font-mono text-gray-500">Post: {comment.post_id || 'N/A'}</span>
                        {comment.sentiment && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full border ${sentimentStyles[comment.sentiment] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
                          >
                            Sentiment: {comment.sentiment}
                          </span>
                        )}
                      </div>

                      {comment.post?.content && (
                        <p className="text-xs text-gray-500 italic mb-2">
                          Post context: {comment.post.content.slice(0, 160)}
                          {comment.post.content.length > 160 && '...'}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-700 mb-3">
                        {comment.message}
                      </p>
                      
                      {/* AI Response */}
                      {comment.ai_response && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs font-medium text-blue-800">AI Response</span>
                          </div>
                          <p className="text-sm text-blue-700">
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
                        
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          View Details
                        </button>
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
