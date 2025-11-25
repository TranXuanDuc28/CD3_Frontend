import React from 'react';
import { ChatBubbleLeftRightIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export default function RecentComments({ comments = [], loading = false }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No recent comments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {comment.from?.name?.charAt(0) || '?'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {comment.from?.name || 'Unknown User'}
              </p>
              <div className="flex items-center space-x-2">
                {comment.status === 'processed' ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ClockIcon className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_time), { addSuffix: true })}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {comment.message}
            </p>
            
            {comment.ai_response && (
              <div className="mt-2 p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                <p className="text-xs text-blue-800 font-medium mb-1">AI Response:</p>
                <p className="text-xs text-blue-700 line-clamp-1">
                  {comment.ai_response}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
