import React, { useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { analyticsService } from '../services/analyticsService';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import CommentChart from '../components/Dashboard/CommentChart';
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const PERIOD_OPTIONS = {
  '24h': { label: 'Last 24 hours', days: 1 },
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  '90d': { label: 'Last 90 days', days: 90 }
};

const SENTIMENT_COLORS = {
  positive: 'text-green-600',
  negative: 'text-red-600',
  neutral: 'text-gray-600',
  mixed: 'text-yellow-600'
};

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedSentiment, setSelectedSentiment] = useState('all');

  const selectedDays = PERIOD_OPTIONS[selectedPeriod]?.days || 7;

  const {
    data: summaryResponse,
    loading: summaryLoading,
    execute: fetchSummary
  } = useApi(() => analyticsService.getSummary(selectedDays), [selectedPeriod]);

  const {
    data: trendResponse,
    loading: trendLoading,
    execute: fetchTrend
  } = useApi(() => analyticsService.getSentimentTrend(selectedDays), [selectedPeriod]);

  const {
    data: keywordsResponse,
    loading: keywordsLoading,
    execute: fetchKeywords
  } = useApi(
    () => analyticsService.getTopKeywords({
      sentiment: selectedSentiment === 'all' ? undefined : selectedSentiment,
      limit: 12
    }),
    [selectedSentiment]
  );

  const summary = summaryResponse?.data || {};
  const trend = trendResponse?.data || [];
  const keywords = keywordsResponse?.data || [];
  const totalComments = summary.total_comments || 0;
  const avgSentiment = Number(summary.avg_sentiment_score || 0).toFixed(2);
  const avgConfidence = Number(summary.avg_confidence || 0).toFixed(2);

  const commentVolumeData = useMemo(() => {
    if (!trend.length) return [];
    const map = trend.reduce((acc, item) => {
      const date = item.date;
      acc[date] = acc[date] || 0;
      acc[date] += Number(item.count) || 0;
      return acc;
    }, {});

    return Object.entries(map)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, count]) => ({ date, count }));
  }, [trend]);

  const sentimentScoreData = useMemo(() => {
    if (!trend.length) return [];
    const map = trend.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = { total: 0, entries: 0 };
      }
      acc[date].total += Number(item.avg_score) || 0;
      acc[date].entries += 1;
      return acc;
    }, {});

    return Object.entries(map)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, value]) => ({
        date,
        score: Number((value.total / value.entries).toFixed(2))
      }));
  }, [trend]);

  const sentimentBreakdown = useMemo(() => ([
    { key: 'positive_count', label: 'Positive', color: 'bg-green-50 text-green-700', value: summary.positive_count || 0 },
    { key: 'neutral_count', label: 'Neutral', color: 'bg-gray-50 text-gray-700', value: summary.neutral_count || 0 },
    { key: 'negative_count', label: 'Negative', color: 'bg-red-50 text-red-700', value: summary.negative_count || 0 },
    { key: 'mixed_count', label: 'Mixed', color: 'bg-yellow-50 text-yellow-700', value: summary.mixed_count || 0 }
  ]), [summary]);

  const trendHighlights = useMemo(() => {
    const map = trend.reduce((acc, item) => {
      const sentiment = item.sentiment || 'unknown';
      if (!acc[sentiment]) {
        acc[sentiment] = { count: 0, totalScore: 0, entries: 0 };
      }
      acc[sentiment].count += Number(item.count) || 0;
      acc[sentiment].totalScore += Number(item.avg_score) || 0;
      acc[sentiment].entries += 1;
      return acc;
    }, {});

    return Object.entries(map).map(([sentiment, stats]) => ({
      sentiment,
      count: stats.count,
      avgScore: stats.entries ? Number((stats.totalScore / stats.entries).toFixed(2)) : 0
    }));
  }, [trend]);

  const isLoading = summaryLoading || trendLoading || keywordsLoading;

  const handleRefresh = async () => {
    await Promise.all([fetchSummary(), fetchTrend(), fetchKeywords()]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Real-time insights from stored sentiment analysis data
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            className="input"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {Object.entries(PERIOD_OPTIONS).map(([value, option]) => (
              <option key={value} value={value}>{option.label}</option>
            ))}
          </select>

          <button
            onClick={handleRefresh}
            className="btn-primary px-4 py-2"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900">{totalComments}</p>
              <p className="text-xs text-gray-500 mt-1">{PERIOD_OPTIONS[selectedPeriod]?.label}</p>
            </div>
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive Comments</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.positive_count || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {totalComments ? Math.round((summary.positive_count || 0) / totalComments * 100) : 0}% of total
              </p>
            </div>
            <SparklesIcon className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Negative Comments</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.negative_count || 0}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {totalComments ? Math.round((summary.negative_count || 0) / totalComments * 100) : 0}% of total
              </p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Sentiment Score</p>
              <p className="text-2xl font-bold text-gray-900">{avgSentiment}</p>
              <p className="text-xs text-gray-500 mt-1">Avg confidence {avgConfidence}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Comment Volume" subtitle="Total comments per day">
          {trendLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <CommentChart
              data={commentVolumeData}
              type="line"
              valueKey="count"
              valueLabel="Comments"
            />
          )}
        </Card>

        <Card title="Sentiment Momentum" subtitle="Average sentiment score by day">
          {trendLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <CommentChart
              data={sentimentScoreData}
              type="bar"
              valueKey="score"
              valueLabel="Avg sentiment"
            />
          )}
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Sentiment Breakdown" subtitle="Distribution across analyzed comments">
          {summaryLoading ? (
            <div className="flex items-center justify-center h-48">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="space-y-3">
              {sentimentBreakdown.map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 ${item.color}`}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="text-right">
                    <p className="text-sm font-bold">{item.value}</p>
                    <p className="text-xs text-gray-600">
                      {totalComments ? ((item.value / totalComments) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Trend Highlights" subtitle="Total comments and avg score by sentiment">
          {trendLoading ? (
            <div className="flex items-center justify-center h-48">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="space-y-3">
              {trendHighlights.map((highlight) => (
                <div key={highlight.sentiment} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-medium capitalize ${SENTIMENT_COLORS[highlight.sentiment] || 'text-gray-600'}`}
                    >
                      {highlight.sentiment}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{highlight.count} comments</p>
                    <p className="text-xs text-gray-500">Avg score {highlight.avgScore}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card
          title="Top Keywords"
          subtitle="Most frequent keywords in recent comments"
          actions={
            <select
              className="input text-sm"
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
            >
              <option value="all">All sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
              <option value="mixed">Mixed</option>
            </select>
          }
        >
          {keywordsLoading ? (
            <div className="flex items-center justify-center h-48">
              <LoadingSpinner size="md" />
            </div>
          ) : keywords.length === 0 ? (
            <p className="text-sm text-gray-500">No keywords recorded for the selected filter.</p>
          ) : (
            <div className="space-y-3">
              {keywords.map((keyword) => (
                <div key={keyword.keyword} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{keyword.keyword}</p>
                    <p className="text-xs text-gray-500">
                      {Object.entries(keyword.sentiments || {})
                        .map(([sentiment, count]) => `${sentiment}: ${count}`)
                        .join(' · ')}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{keyword.frequency}×</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
