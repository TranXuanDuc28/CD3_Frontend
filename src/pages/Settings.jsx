import React, { useState } from 'react';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useApp } from '../contexts/AppContext';
import {
  CogIcon,
  KeyIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    // General Settings
    facebookPageId: '',
    facebookAccessToken: '',
    geminiApiKey: '',
    maxChatHistory: 20,
    defaultPostsLimit: 10,
    
    // AI Settings
    aiResponseEnabled: true,
    aiResponseDelay: 5,
    aiPersonality: 'friendly',
    aiLanguage: 'vi',
    
    // Notification Settings
    emailNotifications: true,
    slackNotifications: false,
    webhookUrl: '',
    
    // Security Settings
    enableRateLimit: true,
    maxRequestsPerMinute: 60,
    enableLogging: true,
    logLevel: 'info'
  });

  const handleSave = async (section) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addNotification({
        type: 'success',
        message: `${section} settings saved successfully`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to save settings'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'ai', name: 'AI Settings', icon: InformationCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your Facebook Comment Auto-Reply System
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card
              title="General Settings"
              subtitle="Basic configuration for your system"
              actions={
                <button
                  onClick={() => handleSave('General')}
                  className="btn-primary px-4 py-2"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Save'}
                </button>
              }
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Page ID
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={settings.facebookPageId}
                      onChange={(e) => handleInputChange('facebookPageId', e.target.value)}
                      placeholder="Enter your Facebook Page ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Chat History
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={settings.maxChatHistory}
                      onChange={(e) => handleInputChange('maxChatHistory', parseInt(e.target.value))}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook Access Token
                  </label>
                  <input
                    type="password"
                    className="input"
                    value={settings.facebookAccessToken}
                    onChange={(e) => handleInputChange('facebookAccessToken', e.target.value)}
                    placeholder="Enter your Facebook Access Token"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Keep this secure and never share it publicly
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    className="input"
                    value={settings.geminiApiKey}
                    onChange={(e) => handleInputChange('geminiApiKey', e.target.value)}
                    placeholder="Enter your Gemini API Key"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for AI-powered responses
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'ai' && (
            <Card
              title="AI Settings"
              subtitle="Configure AI response behavior"
              actions={
                <button
                  onClick={() => handleSave('AI')}
                  className="btn-primary px-4 py-2"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Save'}
                </button>
              }
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Enable AI Responses</h3>
                    <p className="text-sm text-gray-500">Allow AI to automatically respond to comments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.aiResponseEnabled}
                      onChange={(e) => handleInputChange('aiResponseEnabled', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Delay (seconds)
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={settings.aiResponseDelay}
                      onChange={(e) => handleInputChange('aiResponseDelay', parseInt(e.target.value))}
                      min="1"
                      max="60"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AI Personality
                    </label>
                    <select
                      className="input"
                      value={settings.aiPersonality}
                      onChange={(e) => handleInputChange('aiPersonality', e.target.value)}
                    >
                      <option value="friendly">Friendly</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="helpful">Helpful</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Language
                  </label>
                  <select
                    className="input"
                    value={settings.aiLanguage}
                    onChange={(e) => handleInputChange('aiLanguage', e.target.value)}
                  >
                    <option value="vi">Vietnamese</option>
                    <option value="en">English</option>
                    <option value="auto">Auto-detect</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card
              title="Notification Settings"
              subtitle="Configure how you receive alerts"
              actions={
                <button
                  onClick={() => handleSave('Notifications')}
                  className="btn-primary px-4 py-2"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Save'}
                </button>
              }
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Slack Notifications</h3>
                    <p className="text-sm text-gray-500">Send notifications to Slack</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.slackNotifications}
                      onChange={(e) => handleInputChange('slackNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={settings.webhookUrl}
                    onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Custom webhook URL for notifications
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card
              title="Security Settings"
              subtitle="Configure security and rate limiting"
              actions={
                <button
                  onClick={() => handleSave('Security')}
                  className="btn-primary px-4 py-2"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Save'}
                </button>
              }
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Enable Rate Limiting</h3>
                    <p className="text-sm text-gray-500">Limit the number of requests per minute</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.enableRateLimit}
                      onChange={(e) => handleInputChange('enableRateLimit', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Requests per Minute
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={settings.maxRequestsPerMinute}
                      onChange={(e) => handleInputChange('maxRequestsPerMinute', parseInt(e.target.value))}
                      min="1"
                      max="1000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Log Level
                    </label>
                    <select
                      className="input"
                      value={settings.logLevel}
                      onChange={(e) => handleInputChange('logLevel', e.target.value)}
                    >
                      <option value="error">Error</option>
                      <option value="warn">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Enable Logging</h3>
                    <p className="text-sm text-gray-500">Log all system activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.enableLogging}
                      onChange={(e) => handleInputChange('enableLogging', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
