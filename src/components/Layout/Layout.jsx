import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../contexts/AppContext';

export default function Layout() {
  const { sidebarOpen, toggleSidebar } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
     
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div
        className={`frelative flex flex-col flex-1 overflow-y-auto overflow-x-hidden`}
      >
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 pt-20 lg:pt-16 transition-all duration-300 ease-in-out">
          <Outlet />
        </main>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
