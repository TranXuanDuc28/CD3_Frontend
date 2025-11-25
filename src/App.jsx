import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Comments from './pages/Comments';
import Posts from './pages/Posts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import PostManagement from './pages/PostManagement';
import SocialMedia from './pages/SocialMedia';
import VisualContent from './pages/VisualContent';
import ChatAI from './pages/ChatAI';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="comments" element={<Comments />} />
            <Route path="posts" element={<Posts />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="post-management" element={<PostManagement />} />
            <Route path="social-media" element={<SocialMedia />} />
            <Route path="visual-content" element={<VisualContent />} />
            <Route path="chatai" element={<ChatAI />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;