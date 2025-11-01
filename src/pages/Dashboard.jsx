import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

export default function Dashboard() {
  const { theme } = useApp();
  const [data, setData] = useState(null); 
  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white min-h-screen p-6' : 'bg-gray-100 text-gray-900 min-h-screen p-6'}>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to the Dashboard! Here you can find an overview of your application's status and recent activity.</p>
      {/* Additional dashboard content can be added here */}
    </div>
  );
}