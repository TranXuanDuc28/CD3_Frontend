import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  ShareIcon,
  PhotoIcon,
  ClipboardDocumentListIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Comments', href: '/comments', icon: ChatBubbleLeftRightIcon },
  // { name: 'Posts', href: '/posts', icon: DocumentTextIcon },
  { name: 'Post Management', href: '/post-management', icon: PencilSquareIcon },
  { name: 'Social Media', href: '/social-media', icon: ShareIcon },
  { name: 'Visual Content', href: '/visual-content', icon: PhotoIcon },
  { name: 'ChatAI', href: '/chatai', icon: CpuChipIcon },
  // { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={classNames(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-white">n8n Comments</h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={classNames(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
              <button className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
