# Facebook Comment Auto-Reply System - Frontend

Modern React.js frontend for the Facebook Comment Auto-Reply System built with n8n and Node.js backend.

## 🚀 Features

- **Modern Dashboard**: Real-time monitoring of comment processing
- **Comment Management**: View, filter, and manage Facebook comments
- **Analytics**: Detailed insights into system performance
- **Post Monitoring**: Track Facebook posts and engagement
- **Settings**: Comprehensive configuration options
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live data updates and notifications

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Beautiful charts and graphs
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client for API calls

## 📦 Installation

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Environment
VITE_NODE_ENV=development
```

### API Integration

The frontend communicates with the backend API through:

- **Comment Service**: Manage Facebook comments
- **Analytics Service**: Fetch performance metrics
- **Post Service**: Monitor Facebook posts
- **Settings Service**: Configure system settings

## 📱 Pages & Features

### Dashboard
- Real-time statistics
- Comment trends chart
- Recent comments feed
- System status indicators

### Comments
- Comment listing with pagination
- Search and filter functionality
- Status management
- AI response preview

### Posts
- Facebook posts monitoring
- Engagement metrics
- Trending posts sidebar
- Post details and statistics

### Analytics
- Performance metrics
- Sentiment analysis
- AI response analytics
- Engagement trends

### Settings
- General configuration
- AI behavior settings
- Notification preferences
- Security options

## 🎨 UI Components

### Layout Components
- `Layout`: Main application layout
- `Sidebar`: Navigation sidebar
- `Header`: Top navigation bar

### UI Components
- `Card`: Reusable card component
- `LoadingSpinner`: Loading indicators
- `StatsCard`: Statistics display cards

### Dashboard Components
- `CommentChart`: Interactive charts
- `RecentComments`: Recent comments feed
- `StatsCard`: Key metrics display

## 🔄 State Management

Uses React Context API for global state management:

- **AppContext**: Main application state
- **Notifications**: Toast notifications
- **Theme**: Dark/light mode toggle
- **Sidebar**: Navigation state
- **Data**: Comments, analytics, settings

## 📊 Real-time Features

- **Polling**: Automatic data refresh
- **Live Updates**: Real-time comment monitoring
- **Notifications**: Toast notifications for actions
- **Status Indicators**: Live system status

## 🎯 Performance

- **Code Splitting**: Lazy loading of components
- **Optimized Bundle**: Vite for fast builds
- **Responsive Images**: Optimized image loading
- **Efficient Rendering**: React optimization techniques

## 🔒 Security

- **API Authentication**: Token-based auth
- **Input Validation**: Form validation
- **XSS Protection**: Sanitized inputs
- **HTTPS**: Secure communication

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive breakpoints
- **Desktop Enhanced**: Full desktop experience
- **Touch Friendly**: Mobile interaction support

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Static Hosting

The built files can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use GitHub Actions
- **AWS S3**: Upload to S3 bucket

### Environment Configuration

Make sure to set the correct `VITE_API_URL` for your production backend.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the backend API documentation

## 🔄 Updates

Keep your frontend updated with the latest features:

```bash
npm update
npm run build
```

---

Built with ❤️ for the Facebook Comment Auto-Reply System