import React, { useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { toVietnamISOString, fromVietnamISOString } from '../../utils/timezone';

const TimeSelector = ({ 
  label = "Check Time", 
  value, 
  onChange, 
  placeholder = "Select check time",
  showPresets = true 
}) => {
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  // Các preset thời gian phổ biến
  const timePresets = [
    { label: 'Last 5 minutes', value: 5 },
    { label: 'Last 15 minutes', value: 15 },
    { label: 'Last 30 minutes', value: 30 },
    { label: 'Last 1 hour', value: 60 },
    { label: 'Last 2 hours', value: 120 },
    { label: 'Last 6 hours', value: 360 },
    { label: 'Last 12 hours', value: 720 },
    { label: 'Last 24 hours', value: 1440 }
  ];

  // Chuyển đổi minutes thành ISO string với Vietnam timezone
  const getTimeFromMinutes = (minutes) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - minutes);
    return fromVietnamISOString(date.toISOString()); // Format: YYYY-MM-DDTHH:MM in Vietnam timezone
  };

  // Chuyển đổi ISO string thành minutes ago
  const getMinutesFromTime = (timeString) => {
    if (!timeString) return null;
    const selectedTime = new Date(timeString);
    const now = new Date();
    return Math.floor((now - selectedTime) / (1000 * 60));
  };

  const handlePresetSelect = (minutes) => {
    const timeString = getTimeFromMinutes(minutes);
    const vietnamISOString = toVietnamISOString(timeString);
    onChange(vietnamISOString);
    setShowPresetMenu(false);
  };

  const handleCustomTimeChange = (e) => {
    const vietnamISOString = toVietnamISOString(e.target.value);
    onChange(vietnamISOString);
  };

  const currentMinutes = getMinutesFromTime(value);
  const currentPreset = timePresets.find(preset => preset.value === currentMinutes);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="relative">
        <input
          type="datetime-local"
          value={value ? fromVietnamISOString(value) : ''}
          onChange={handleCustomTimeChange}
          className="input pr-10"
          placeholder={placeholder}
        />
        <ClockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {showPresets && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPresetMenu(!showPresetMenu)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>Quick select:</span>
            <span className="font-medium">
              {currentPreset ? currentPreset.label : 'Custom time'}
            </span>
          </button>

          {showPresetMenu && (
            <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">
                  Preset Times
                </div>
                {timePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset.value)}
                    className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${
                      currentMinutes === preset.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {value && (
        <div className="text-xs text-gray-500">
          Checking tests from: {value ? new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : ''}
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
