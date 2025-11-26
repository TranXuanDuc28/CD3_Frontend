import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import StatsCard from '../components/Dashboard/StatsCard';
import {
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShareIcon,
  PhotoIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);

  // Mock data for demo
  const mockStats = {
    totalComments: 1247,
    processedComments: 1189,
    pendingComments: 58,
    aiResponses: 1156
  };

  const mockChartData = [
    { date: '2024-01-15', count: 45 },
    { date: '2024-01-16', count: 52 },
    { date: '2024-01-17', count: 38 },
    { date: '2024-01-18', count: 67 },
    { date: '2024-01-19', count: 73 },
    { date: '2024-01-20', count: 89 },
    { date: '2024-01-21', count: 95 }
  ];

  const mockRecentComments = [
    {
      id: '1',
      from: { name: 'Trần Xuân Đức' },
      message: 'Sản phẩm này có còn hàng không ạ?',
      created_time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'processed',
      ai_response: 'Chào bạn! Sản phẩm này vẫn còn hàng ạ. Bạn có thể inbox để được tư vấn chi tiết nhé!'
    },
    {
      id: '2',
      from: { name: 'Trần Thị B' },
      message: 'Giá bao nhiêu vậy shop?',
      created_time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: 'pending'
    },
    {
      id: '3',
      from: { name: 'Lê Văn C' },
      message: 'Ship về Hà Nội bao nhiêu tiền?',
      created_time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'processed',
      ai_response: 'Ship về Hà Nội là 30k bạn nhé! Đơn từ 500k sẽ được miễn phí ship.'
    }
  ];

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addNotification({
        type: 'success',
        message: 'Data refreshed successfully!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to refresh data'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDistanceToNow = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor your Facebook Comment Auto-Reply System
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="btn-primary px-4 py-2 flex items-center space-x-2"
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Comments"
          value={mockStats.totalComments}
          change={12}
          type="total"
        />
        <StatsCard
          title="Processed"
          value={mockStats.processedComments}
          change={8}
          type="processed"
        />
        <StatsCard
          title="Pending"
          value={mockStats.pendingComments}
          change={-3}
          type="pending"
        />
        <StatsCard
          title="AI Responses"
          value={mockStats.aiResponses}
          change={15}
          type="aiResponses"
        />
      </div>

      {/* Charts and Recent Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comment Trend Chart */}
        <Card
          title="Comment Trends"
          subtitle="Comments received over the last 7 days"
        >
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600">Chart will be displayed here</p>
              <p className="text-sm text-gray-500">Connect to backend for real data</p>
            </div>
          </div>
        </Card>

        {/* Recent Comments */}
        <Card
          title="Recent Comments"
          subtitle="Latest comments from Facebook"
        >
          <div className="space-y-4">
            {mockRecentComments.map((comment) => (
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
                        <div className="w-4 h-4 border-2 border-yellow-500 rounded-full"></div>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(comment.created_time)}
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
        </Card>
      </div>

      {/* System Status */}
      <Card
        title="System Status"
        subtitle="Current system health and configuration"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">n8n Workflow</h3>
            <p className="text-sm text-green-600">Active</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <SparklesIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Gemini AI</h3>
            <p className="text-sm text-green-600">Connected</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Database</h3>
            <p className="text-sm text-green-600">Connected</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card
        title="Quick Actions"
        subtitle="Common tasks and shortcuts"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Comments</h4>
            <p className="text-sm text-gray-600">View and process comments</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <DocumentTextIcon className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Post</h4>
            <p className="text-sm text-gray-600">Schedule new content</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <ShareIcon className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Social Media</h4>
            <p className="text-sm text-gray-600">Post to Facebook/Instagram</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <PhotoIcon className="w-6 h-6 text-pink-600 mb-2" />
            <h4 className="font-medium text-gray-900">Visual Content</h4>
            <p className="text-sm text-gray-600">Create images & A/B tests</p>
          </button>
        </div>
      </Card>
    </div>
  );
}