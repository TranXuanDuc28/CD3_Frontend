import { useWebSocket } from '../hooks/useWebSocket';

// If backend doesn't support WebSocket or you want to disable WS in dev,
// set VITE_ENABLE_WS=false in frontend/.env (default: enabled)
const WS_ENABLED = import.meta.env.VITE_ENABLE_WS !== 'false';

function noopWebSocket() {
  // Return an object shape similar to useWebSocket return so callers can safely call it
  return {
    socket: null,
    isConnected: false,
    lastMessage: null,
    error: null,
    connect: () => {},
    disconnect: () => {},
    sendMessage: () => {}
  };
}

export const useCommentWebSocket = (onNewComment, onCommentUpdate) => {
  if (!WS_ENABLED) {
    return noopWebSocket();
  }

  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws/comments';
  
  return useWebSocket(wsUrl, {
    onMessage: (data) => {
      switch (data.type) {
        case 'new_comment':
          if (onNewComment) onNewComment(data.comment);
          break;
        case 'comment_update':
          if (onCommentUpdate) onCommentUpdate(data.comment);
          break;
        case 'comment_processed':
          if (onCommentUpdate) onCommentUpdate(data.comment);
          break;
        default:
          console.log('Unknown WebSocket message type:', data.type);
      }
    },
    onError: (error) => {
      console.error('Comment WebSocket error:', error);
    },
    onClose: () => {
      console.log('Comment WebSocket closed');
    },
    onOpen: () => {
      console.log('Comment WebSocket opened');
    }
  });
};

export const useAnalyticsWebSocket = (onAnalyticsUpdate) => {
  if (!WS_ENABLED) {
    return noopWebSocket();
  }

  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws/analytics';
  
  return useWebSocket(wsUrl, {
    onMessage: (data) => {
      if (data.type === 'analytics_update' && onAnalyticsUpdate) {
        onAnalyticsUpdate(data.analytics);
      }
    },
    onError: (error) => {
      console.error('Analytics WebSocket error:', error);
    },
    onClose: () => {
      console.log('Analytics WebSocket closed');
    },
    onOpen: () => {
      console.log('Analytics WebSocket opened');
    }
  });
};

export const useSystemStatusWebSocket = (onStatusUpdate) => {
  if (!WS_ENABLED) {
    return noopWebSocket();
  }

  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws/status';
  
  return useWebSocket(wsUrl, {
    onMessage: (data) => {
      if (data.type === 'status_update' && onStatusUpdate) {
        onStatusUpdate(data.status);
      }
    },
    onError: (error) => {
      console.error('System Status WebSocket error:', error);
    },
    onClose: () => {
      console.log('System Status WebSocket closed');
    },
    onOpen: () => {
      console.log('System Status WebSocket opened');
    }
  });
};
