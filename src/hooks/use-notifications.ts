import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

let socket: Socket | null = null;

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth();

  const initializeSocket = useCallback(() => {
    if (!userId) return;

    try {
      // Always create a new socket instance
      if (socket) {
        socket.disconnect();
      }

      // Ensure we connect to the root namespace
      // Connect to base URL (without /api/v1)
      const baseUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');
      socket = io(baseUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        path: '/socket.io',
        withCredentials: true,
        auth: {
          token: getAccessToken()
        }
      });

      socket.on('connect', () => {
        setIsConnected(true);
        setError(null);
        socket?.emit('join', userId);
      });

      socket.on('connect_error', (err) => {
        setError(`Connection error: ${err.message}`);
        setIsConnected(false);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('new_notification', (notification: Notification) => {
        setNotifications((prev) => {
          // Prevent duplicate notifications
          const exists = prev.some(n => n.id === notification.id);
          if (exists) return prev;
          return [notification, ...prev];
        });
      });

      // Handle read status updates
      socket.on('notification_read', ({ userId: readUserId }) => {
        if (readUserId === userId) {
          setNotifications(prev => 
            prev.map(n => ({ ...n, read: true }))
          );
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize socket connection');
    }
  }, [userId]);

  useEffect(() => {
    initializeSocket();

    return () => {
      if (socket) {
        socket.emit('leave', userId);
        socket.off('connect');
        socket.off('disconnect');
        socket.off('new_notification');
        socket.off('notification_read');
        socket.off('connect_error');
        socket.disconnect();
        socket = null;
      }
    };
  }, [userId, initializeSocket]);

  const clearError = useCallback(() => setError(null), []);

  return { 
    notifications, 
    setNotifications, 
    isConnected, 
    error,
    clearError
  };
}
