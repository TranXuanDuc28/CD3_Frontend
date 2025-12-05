import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useApi } from '../hooks/useApi';
import { chatAIService } from '../services/chatAIService';
import { notificationService } from '../services/notificationService';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import DynamicContentAnalysis from '../components/ChatAI/DynamicContentAnalysis';
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  PlayIcon,
  UsersIcon,
  SparklesIcon,
  ChatBubbleOvalLeftIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function ChatAI() {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [testMessage, setTestMessage] = useState('Xin chào, tôi muốn tìm hiểu về tour du lịch Đà Nẵng');

  // Manual state for conversations (not using useApi to avoid stale closure issues)
  const [conversations, setConversations] = useState(null);
  const [conversationsLoading, setConversationsLoading] = useState(false);

  // Notification state
  const [campaigns, setCampaigns] = useState(null);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // API hooks
  const { data: users, execute: fetchUsers, loading: usersLoading } = useApi(chatAIService.getUsers);
  const { data: responses, execute: fetchResponses, loading: responsesLoading } = useApi(chatAIService.getResponses);
  const { data: analytics, execute: fetchAnalytics, loading: analyticsLoading } = useApi(chatAIService.getAnalytics);
  const { data: stats, execute: fetchStats, loading: statsLoading } = useApi(chatAIService.getStats);

  // Test AI
  const { data: testResult, execute: testAI, loading: testLoading } = useApi(
    () => chatAIService.testAI(testMessage)
  );

  // Fetch conversations function
  const fetchConversations = async () => {
    if (!selectedUser) {
      setConversations({ conversations: [] });
      return;
    }

    setConversationsLoading(true);
    try {
      const result = await chatAIService.getUserConversations(selectedUser.id);
      setConversations(result);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations({ conversations: [] });
    } finally {
      setConversationsLoading(false);
    }
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'responses') fetchResponses();
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'notifications') fetchCampaigns();
  }, [activeTab]);

  // Fetch notification campaigns
  const fetchCampaigns = async () => {
    setCampaignsLoading(true);
    try {
      const result = await notificationService.getCampaigns(20);
      setCampaigns(result.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setCampaignsLoading(false);
    }
  };

  // Fetch conversations when user is selected or tab changes to conversations
  useEffect(() => {
    if (activeTab === 'conversations' && selectedUser) {
      fetchConversations();
    }
  }, [activeTab, selectedUser]);

  const handleTestAI = async () => {
    if (!testMessage.trim()) {
      addNotification({
        type: 'error',
        message: 'Please enter a test message'
      });
      return;
    }

    try {
      await testAI();
      addNotification({
        type: 'success',
        message: 'AI test completed successfully!'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'AI test failed'
      });
    }
  };

  const tabs = [
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'conversations', name: 'Conversations', icon: '' },
    { id: 'responses', name: 'Responses', icon: ChatBubbleLeftRightIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'dynamic', name: 'Dynamic Content', icon: SparklesIcon },
    { id: 'test', name: 'Test AI', icon: PlayIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ChatAI Management</h1>
          <p className="text-gray-600">Manage AI chatbot conversations and responses</p>
        </div>
        <div className="flex items-center space-x-4">
          {stats && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Users</div>
              <div className="text-2xl font-bold text-blue-600">{stats.stats?.users || 0}</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-sm text-gray-500">Total Users</div>
                <div className="text-2xl font-bold">{stats.stats?.users || 0}</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <ChatBubbleOvalLeftIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-sm text-gray-500">Conversations</div>
                <div className="text-2xl font-bold">{stats.stats?.conversations || 0}</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <SparklesIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-sm text-gray-500">Dynamic Responses</div>
                <div className="text-2xl font-bold">{stats.stats?.dynamic_responses || 0}</div>
                <div className="text-xs text-gray-400">+{stats.stats?.ab_test_insights || 0} A/B insights</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-sm text-gray-500">Total Responses</div>
                <div className="text-2xl font-bold">{stats.stats?.total_responses || 0}</div>
                <div className={`text-xs ${stats.stats?.gemini_available ? 'text-green-600' : 'text-red-600'}`}>
                  Gemini: {stats.stats?.gemini_available ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.icon ? <tab.icon className="h-5 w-5 mr-2" /> : null}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">ChatAI Users</h3>
              <button
                onClick={fetchUsers}
                className="btn-secondary"
                disabled={usersLoading}
              >
                {usersLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {usersLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Facebook ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users?.users?.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.profile_pic ? (
                                <img className="h-10 w-10 rounded-full" src={user.profile_pic} alt="" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <UserGroupIcon className="h-5 w-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.facebook_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setActiveTab('conversations');
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Conversations
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'conversations' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Conversations {selectedUser && `- ${selectedUser.first_name} ${selectedUser.last_name}`}
              </h3>
              {selectedUser && (
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn-secondary"
                >
                  Back to Users
                </button>
              )}
            </div>

            {!selectedUser ? (
              <div className="text-center py-8 text-gray-500">
                Select a user to view their conversations
              </div>
            ) : conversationsLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                {conversations?.conversations?.map((conv) => (
                  <Card key={conv.id}>
                    <div className={`flex ${conv.message_type === 'received' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${conv.message_type === 'received'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-blue-600 text-white'
                        }`}>
                        <div className="text-sm">{conv.message_text}</div>
                        <div className={`text-xs mt-1 ${conv.message_type === 'received' ? 'text-gray-500' : 'text-blue-100'
                          }`}>
                          {new Date(conv.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">AI Responses Database</h3>
              <button
                onClick={fetchResponses}
                className="btn-secondary"
                disabled={responsesLoading}
              >
                {responsesLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {responsesLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keyword
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {responses?.responses?.map((response) => (
                      <tr key={response.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {response.keyword || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {response.response_text}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {response.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${response.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {response.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">ChatAI Analytics</h3>
              <button
                onClick={fetchAnalytics}
                className="btn-secondary"
                disabled={analyticsLoading}
              >
                {analyticsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {analyticsLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Analytics data will be displayed here
                <div className="mt-2 text-sm">
                  {analytics?.analytics?.length || 0} events found
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Special Occasion Notifications</h3>
              <button
                onClick={fetchCampaigns}
                className="btn-secondary"
                disabled={campaignsLoading}
              >
                {campaignsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {campaignsLoading ? (
              <LoadingSpinner />
            ) : campaigns && campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <Card key={index}>
                    <div className="space-y-3">
                      {/* Campaign Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <BellIcon className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">
                              {campaign.occasionType || 'Special Occasion'}
                            </h4>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            Post ID: {campaign.postId} ({campaign.postType})
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Last sent: {new Date(campaign.lastSentAt).toLocaleString()}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{campaign.totalSent}</div>
                            <div className="text-xs text-gray-500">Total</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{campaign.successCount}</div>
                            <div className="text-xs text-gray-500">Sent</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{campaign.failedCount}</div>
                            <div className="text-xs text-gray-500">Failed</div>
                          </div>
                        </div>
                      </div>

                      {/* Recipients List */}
                      <div className="border-t pt-3">
                        <button
                          onClick={() => setSelectedCampaign(selectedCampaign === index ? null : index)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {selectedCampaign === index ? '▼ Hide Recipients' : '▶ Show Recipients'} ({campaign.recipients?.length || 0})
                        </button>

                        {selectedCampaign === index && campaign.recipients && (
                          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                            {campaign.recipients.map((recipient, rIndex) => (
                              <div
                                key={rIndex}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    {recipient.status === 'sent' ? (
                                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <XCircleIcon className="h-5 w-5 text-red-500" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {recipient.customerName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      PSID: {recipient.psid}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-xs font-semibold ${recipient.status === 'sent' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {recipient.status === 'sent' ? 'Sent' : 'Failed'}
                                  </div>
                                  {recipient.sentAt && (
                                    <div className="text-xs text-gray-400">
                                      {new Date(recipient.sentAt).toLocaleTimeString()}
                                    </div>
                                  )}
                                  {recipient.errorMessage && (
                                    <div className="text-xs text-red-500 mt-1">
                                      {recipient.errorMessage}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No notification campaigns found
              </div>
            )}
          </div>
        )}

        {activeTab === 'dynamic' && (
          <DynamicContentAnalysis />
        )}

        {activeTab === 'test' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Test AI Service</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Message
                  </label>
                  <textarea
                    rows={3}
                    className="input"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Enter a test message for the AI..."
                  />
                </div>

                <button
                  onClick={handleTestAI}
                  className="btn-primary"
                  disabled={testLoading}
                >
                  {testLoading ? 'Testing...' : 'Test AI'}
                </button>

                {testResult && (
                  <Card>
                    <h4 className="font-medium mb-2">Test Result:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Input:</strong> {testResult.testMessage}
                      </div>
                      <div className="text-sm">
                        <strong>AI Response:</strong> {testResult.aiResponse}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
