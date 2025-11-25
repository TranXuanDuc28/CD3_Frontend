import React, { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { useApi } from "../hooks/useApi";
import { visualService } from "../services/visualService";
import Card from "../components/UI/Card";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import TimeSelector from "../components/UI/TimeSelector";
import {
  toVietnamISOString,
  fromVietnamISOString,
  formatVietnamTime,
} from "../utils/timezone";
import {
  PhotoIcon,
  SparklesIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  BeakerIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

export default function VisualContent() {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState("generate");
  const [imagePrompt, setImagePrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [checkTime, setCheckTime] = useState("");
  const [abTestData, setAbTestData] = useState({
    type: "banner",
    brand: "VKU",
    message: "",
    style: "refreshing",
    dimensions: "1200x630",
    projectId: "proj200",
    variantCount: 2,
    scheduledAt: "",
    slides: [],
  });

  // Fetch A/B test data with dynamic APIs
  const { data: abTestByTime, execute: fetchAbTestByTime } = useApi(
    visualService.getAbTestByCurrentTime
  );
  const {
    data: listToCheck,
    execute: fetchListToCheck,
    loading: listToCheckLoading,
  } = useApi(() => visualService.listToCheck(checkTime));
  const {
    data: activeTests,
    execute: fetchActiveTests,
    loading: activeTestsLoading,
  } = useApi(visualService.getActiveAbTests);
  const {
    data: runningTests,
    execute: fetchRunningTests,
    loading: runningTestsLoading,
  } = useApi(visualService.getRunningTests);
  const {
    data: testResults,
    execute: fetchTestResults,
    loading: testResultsLoading,
  } = useApi(visualService.getAbTestResults);
  const {
    data: analytics,
    execute: fetchAnalytics,
    loading: analyticsLoading,
  } = useApi(visualService.getPerformanceAnalytics);

  // Load data on component mount
  useEffect(() => {
    fetchActiveTests();
    fetchRunningTests();
    fetchTestResults();
    fetchAnalytics();
  }, []);

  // Refresh data when checkTime changes
  useEffect(() => {
    if (checkTime) {
      fetchListToCheck();
    }
  }, [checkTime]);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      addNotification({
        type: "error",
        message: "Please enter a prompt for image generation",
      });
      return;
    }

    setGenerating(true);
    try {
      const result = await visualService.generateImage({
        prompt: imagePrompt,
        type: "banner",
      });

      setGeneratedImage(result);
      addNotification({
        type: "success",
        message: "Image generated successfully!",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to generate image",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleStartAbTest = async () => {
    try {
      // Build payload exactly as required by backend
      let webhookData;
      if (abTestData.type === "carousel") {
        webhookData = {
          category: "visual_creation",
          type: "carousel",
          projectId: abTestData.projectId,
          variantCount: abTestData.variantCount,
          slides: Array.isArray(abTestData.slides) ? abTestData.slides : [],
          scheduledAt: abTestData.scheduledAt || "",
        };
      } else {
        webhookData = {
          category: "visual_creation",
          type: "banner",
          brand: abTestData.brand,
          message: abTestData.message,
          style: abTestData.style,
          dimensions: abTestData.dimensions,
          projectId: abTestData.projectId,
          variantCount: abTestData.variantCount,
          scheduledAt: abTestData.scheduledAt || "",
        };
      }

      const result = await visualService.forwardToWebhook(webhookData);

      addNotification({
        type: "success",
        message: "A/B test started successfully!",
      });

      setAbTestData({
        type: "banner",
        brand: "VKU",
        message: "",
        style: "refreshing",
        dimensions: "1200x630",
        projectId: "proj200",
        variantCount: 2,
        scheduledAt: "",
        slides: [],
      });
    } catch (error) {
      console.error(error);
      addNotification({
        type: "error",
        message: "Failed to start A/B test",
      });
    }
  };

  const handleGenerateCarousel = async () => {
    try {
      const result = await visualService.generateCarouselImages({
        prompt: imagePrompt,
        variantCount: 3,
      });
      addNotification({
        type: "success",
        message: "Carousel images generated successfully!",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to generate carousel images",
      });
    }
  };

  const tabs = [
    { id: "generate", name: "Generate Images", icon: PhotoIcon },
    { id: "abtest", name: "A/B Testing", icon: BeakerIcon },
    { id: "carousel", name: "Carousel", icon: ShareIcon },
    { id: "results", name: "Results", icon: ChartBarIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Visual Content & A/B Testing
        </h1>
        <p className="text-gray-600 mt-1">
          Generate images, create A/B tests, and analyze performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Generated Images
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {analytics?.data?.overview?.totalTests || 0}
              </p>
            </div>
            <PhotoIcon className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active A/B Tests
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {analytics?.data?.overview?.runningTests || 0}
              </p>
            </div>
            <BeakerIcon className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completed Tests
              </p>
              <p className="text-2xl font-bold text-green-600">
                {analytics?.data?.overview?.completedTests || 0}
              </p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg Engagement
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {analytics?.data?.overview?.averageEngagement || "0"}%
              </p>
            </div>
            <SparklesIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === "generate" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="Generate Images"
            subtitle="Create images using AI prompts"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Prompt
                </label>
                <textarea
                  rows={4}
                  className="input"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Type
                </label>
                <select className="input">
                  <option value="banner">Banner</option>
                  <option value="post">Post</option>
                  <option value="story">Story</option>
                  <option value="ad">Advertisement</option>
                </select>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={generating || !imagePrompt.trim()}
                className="btn-primary w-full py-2 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {generating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <SparklesIcon className="w-4 h-4" />
                )}
                <span>{generating ? "Generating..." : "Generate Image"}</span>
              </button>
            </div>
          </Card>

          <Card title="Generated Image" subtitle="Your AI-generated content">
            {generatedImage ? (
              <div className="space-y-4">
                <img
                  src={generatedImage.url || generatedImage.image_url}
                  alt="Generated"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="flex space-x-2">
                  <button className="btn-secondary flex-1 py-2">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                  <button className="btn-primary flex-1 py-2">
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Use
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No image generated yet</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === "abtest" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Start A/B Test" subtitle="Create and manage A/B tests">
            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type
                </label>
                <select
                  className="input"
                  value={abTestData.type}
                  onChange={(e) =>
                    setAbTestData((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option value="banner">Banner</option>
                  <option value="carousel">Carousel</option>
                  <option value="video">Video</option>
                </select>
              </div>

              {/* Brand (banner only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  className="input"
                  value={abTestData.brand || ""}
                  onChange={(e) =>
                    setAbTestData((prev) => ({
                      ...prev,
                      brand: e.target.value,
                    }))
                  }
                  placeholder="VD: VKU, WinterJoy..."
                />
              </div>

              {/* Message (banner only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={3}
                  className="input"
                  value={abTestData.message || ""}
                  onChange={(e) =>
                    setAbTestData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="VD: 🏖️ Khám phá bãi biển Nha Trang tuyệt đẹp..."
                />
              </div>

              {/* Style (banner only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style
                </label>
                <select
                  className="input"
                  value={abTestData.style || "refreshing"}
                  onChange={(e) =>
                    setAbTestData((prev) => ({
                      ...prev,
                      style: e.target.value,
                    }))
                  }
                >
                  <option value="refreshing">Refreshing</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              {/* Dimensions (banner only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  className="input"
                  value={abTestData.dimensions || ""}
                  onChange={(e) =>
                    setAbTestData((prev) => ({
                      ...prev,
                      dimensions: e.target.value,
                    }))
                  }
                  placeholder="VD: 1200x630"
                />
              </div>

              {/* Slides JSON (carousel only) */}
              {abTestData.type === "carousel" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slides (JSON array)
                  </label>
                  <textarea
                    rows={6}
                    className="input"
                    value={JSON.stringify(abTestData.slides || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        if (Array.isArray(parsed)) {
                          setAbTestData((prev) => ({
                            ...prev,
                            slides: parsed,
                          }));
                        }
                      } catch (err) {
                        // ignore parse errors while typing
                      }
                    }}
                    placeholder='[
  { "brand": "WinterJoy", "message": "Merry Christmas Sale 50% Off!", "style": "festive", "dimensions": "1200x630" },
  { "brand": "WinterJoy", "message": "Buy 1 Get 1 Free!", "style": "festive", "dimensions": "1200x630" },
  { "brand": "WinterJoy", "message": "Limited Time Offer!", "style": "festive", "dimensions": "1200x630" }
]'
                  />
                </div>
              )}

              {/* Project ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project ID
                </label>
                <input
                  type="text"
                  className="input"
                  value={abTestData.projectId}
                  onChange={(e) =>
                    setAbTestData((prev) => ({
                      ...prev,
                      projectId: e.target.value,
                    }))
                  }
                  placeholder="Enter project identifier"
                />
              </div>

              {/* Variant Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variant Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="input"
                  value={abTestData.variantCount}
                  onChange={(e) =>
                    setAbTestData((prev) => ({
                      ...prev,
                      variantCount: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              {/* scheduledAt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  className="input"
                  value={
                    abTestData.scheduledAt
                      ? fromVietnamISOString(abTestData.scheduledAt)
                      : ""
                  }
                  onChange={(e) =>
                    setAbTestData((prev) => ({
                      ...prev,
                      scheduledAt: e.target.value
                        ? toVietnamISOString(e.target.value)
                        : "",
                    }))
                  }
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleStartAbTest}
                className="btn-primary w-full py-2 flex items-center justify-center space-x-2"
              >
                <BeakerIcon className="w-4 h-4" />
                <span>Start A/B Test</span>
              </button>
            </div>
          </Card>

          {/* Bảng hiển thị các test */}
          <Card title="Active A/B Tests" subtitle="Currently running tests">
            <div className="space-y-4">
              {activeTestsLoading ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="sm" />
                </div>
              ) : activeTests?.data?.length > 0 ? (
                activeTests.data.map((test) => (
                  <div
                    key={test.id}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900">
                        {test.type} Test #{test.id}
                      </h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {test.status}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      Testing {test.variantCount} {test.type} variants
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-blue-600">
                      <span>
                        Started:{" "}
                        {formatVietnamTime(test.createdAt, "YYYY-MM-DD")}
                      </span>
                      <span>Project: {test.projectId}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BeakerIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No active A/B tests found</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "carousel" && (
        <Card
          title="Carousel Generation"
          subtitle="Create multiple related images"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carousel Prompt
              </label>
              <textarea
                rows={3}
                className="input"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the carousel theme..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Images
              </label>
              <input
                type="number"
                min="2"
                max="10"
                defaultValue="3"
                className="input w-20"
              />
            </div>

            <button
              onClick={handleGenerateCarousel}
              className="btn-primary py-2 px-4 flex items-center space-x-2"
            >
              <ShareIcon className="w-4 h-4" />
              <span>Generate Carousel</span>
            </button>
          </div>
        </Card>
      )}

      {activeTab === "results" && (
        <div className="space-y-6">
          <Card
            title="A/B Test Results"
            subtitle="Performance analytics and insights"
          >
            <div className="space-y-6">
              {/* Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">
                    Total Engagement
                  </h4>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics?.data?.metrics?.totalEngagement || "0"}
                  </p>
                  <p className="text-sm text-green-700">All completed tests</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Total Reach
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics?.data?.metrics?.totalReach || "0"}
                  </p>
                  <p className="text-sm text-blue-700">Combined reach</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">
                    Total Likes
                  </h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {analytics?.data?.metrics?.totalLikes || "0"}
                  </p>
                  <p className="text-sm text-purple-700">
                    All variants combined
                  </p>
                </div>
              </div>

              {/* Top Performers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Top Performers</h4>
                  <button
                    onClick={fetchAnalytics}
                    disabled={analyticsLoading}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    {/* <RefreshIcon className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} /> */}
                    <h2>Refresh</h2>
                    <span>Refresh</span>
                  </button>
                </div>

                {analyticsLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : analytics?.data?.topPerformers?.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.data.topPerformers.map((test, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {test.type} Test #{test.id}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Project: {test.projectId}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            {test.maxEngagement} engagement
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatVietnamTime(test.completedAt, "YYYY-MM-DD")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ChartBarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No test results available yet</p>
                  </div>
                )}
              </div>

              {/* Recent Test Results */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  Recent Test Results
                </h4>
                {testResultsLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : testResults?.data?.length > 0 ? (
                  <div className="space-y-3">
                    {testResults.data.slice(0, 5).map((test) => (
                      <div
                        key={test.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {test.type} Test #{test.id}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {test.variantCount} variants tested
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            Completed
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatVietnamTime(test.completedAt, "YYYY-MM-DD")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No completed tests yet</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Check Time Selector */}
          <Card
            title="Check Tests by Time"
            subtitle="Select a specific time to check for tests"
          >
            <div className="space-y-4">
              <TimeSelector
                label="Check Time for A/B Tests"
                value={checkTime}
                onChange={setCheckTime}
                placeholder="Select time to check tests"
              />

              {checkTime && (
                <div className="mt-4">
                  <button
                    onClick={fetchListToCheck}
                    disabled={listToCheckLoading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {listToCheckLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      //<RefreshIcon className="w-4 h-4" />
                      ""
                    )}
                    <span>Check Tests</span>
                  </button>
                </div>
              )}

              {listToCheck?.result && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Tests Found
                  </h4>
                  <div className="space-y-2">
                    {listToCheck.result.map((test, index) => (
                      <div
                        key={index}
                        className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-yellow-900">
                            Test ID: {test.id}
                          </span>
                          {test.notifyEmail && (
                            <span className="text-xs text-yellow-700">
                              Notify: {test.notifyEmail}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
