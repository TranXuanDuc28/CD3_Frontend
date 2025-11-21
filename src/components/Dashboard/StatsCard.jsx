import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  total: ChatBubbleLeftRightIcon,
  processed: CheckCircleIcon,
  pending: ClockIcon,
  aiResponses: SparklesIcon
};

const colorMap = {
  total: 'blue',
  processed: 'green',
  pending: 'yellow',
  aiResponses: 'purple'
};

export default function StatsCard({ title, value, change, type, icon: CustomIcon }) {
  const IconComponent = CustomIcon || iconMap[type] || ChatBubbleLeftRightIcon;
  const color = colorMap[type] || 'blue';
  
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      border: 'border-green-200'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      border: 'border-yellow-200'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-200'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colors.bg} ${colors.border} border`}>
          <IconComponent className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}
