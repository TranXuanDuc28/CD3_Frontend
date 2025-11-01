import React from 'react';
import { Bars3Icon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../contexts/AppContext';
import NotificationCenter from '../Notifications/NotificationCenter';

export default function Header({ toggleSidebar }) {
  const { theme, toggleTheme, notifications } = useApp();

  return (
    // Header container
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-md">
      {/* Left section: Sidebar toggle button */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
      {/* Right section: Theme toggle and notifications */}
      <div className="flex items-center space-x-4">
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"   
        >
          {theme === 'light' ? (
            <MoonIcon className="h-6 w-6" />
          ) : (
            <SunIcon className="h-6 w-6" />
          )}
        </button>
        {/* Notification center */}
        <NotificationCenter notifications={notifications} />
      </div>
    </header>
  );
}
