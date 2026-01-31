import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface UseNotificationsOptions {
  onNotification?: (notification: Notification) => void;
}

let socket: Socket | null = null;
let sharedNotifications: Notification[] = [];
let notificationListeners: Set<(notifications: Notification[]) => void> = new Set();
let notificationCallbacks: Set<(notification: Notification) => void> = new Set();
let connectionStateCallbacks: Set<(connected: boolean) => void> = new Set();
let errorStateCallbacks: Set<(error: string | null) => void> = new Set();

export function useNotifications(userId: string, options?: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<Notification[]>(sharedNotifications);
  const [isConnected, setIsConnected] = useState(socket?.connected || false);
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken, refreshAccessToken } = useAuth();
  const callbackRef = useRef(options?.onNotification);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = options?.onNotification;
  }, [options?.onNotification]);

  const initializeSocket = useCallback(() => {
    if (!userId) return;

    try {
      // Only create socket if it doesn't exist or is disconnected
      if (socket && socket.connected) {
        // Socket already exists and is connected, just update state
        connectionStateCallbacks.forEach(cb => cb(true));
        return;
      }
      
      // Clean up existing socket if disconnected
      if (socket) {
        socket.disconnect();
        socket = null;
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
        // Notify all instances
        connectionStateCallbacks.forEach(cb => cb(true));
        errorStateCallbacks.forEach(cb => cb(null));
        socket?.emit('join', userId);
      });

      socket.on('connect_error', async (err) => {
        connectionStateCallbacks.forEach(cb => cb(false));
        
        if (err.message === 'Token expired') {
          // Token expired, attempt to refresh
          try {
            await refreshAccessToken();
            // Reinitialize socket with new token
            initializeSocket();
            return;
          } catch (refreshError) {
            errorStateCallbacks.forEach(cb => cb('Session expired. Please log in again.'));
            return;
          }
        }
        
        errorStateCallbacks.forEach(cb => cb(`Connection error: ${err.message}`));
      });

      socket.on('disconnect', () => {
        connectionStateCallbacks.forEach(cb => cb(false));
      });

      socket.on('new_notification', (notification: Notification) => {
        // Prevent duplicate notifications
        const exists = sharedNotifications.some(n => n.id === notification.id);
        if (!exists) {
          sharedNotifications = [notification, ...sharedNotifications];
          // Notify all hook instances
          notificationListeners.forEach(listener => listener(sharedNotifications));
        }
        
        // Call all registered callbacks
        notificationCallbacks.forEach(callback => callback(notification));
      });

      // Handle read status updates
      socket.on('notification_read', ({ userId: readUserId }) => {
        if (readUserId === userId) {
          sharedNotifications = sharedNotifications.map(n => ({ ...n, read: true }));
          // Notify all hook instances
          notificationListeners.forEach(listener => listener(sharedNotifications));
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize socket connection');
    }
  }, [userId, getAccessToken, refreshAccessToken]);

  useEffect(() => {
    // Register listener for shared notification updates
    const listener = (newNotifications: Notification[]) => {
      setNotifications(newNotifications);
    };
    notificationListeners.add(listener);
    
    return () => {
      notificationListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    // Register state update callbacks
    const connectionCallback = (connected: boolean) => setIsConnected(connected);
    const errorCallback = (err: string | null) => setError(err);
    
    connectionStateCallbacks.add(connectionCallback);
    errorStateCallbacks.add(errorCallback);
    
    initializeSocket();
    
    // Register notification callback
    if (callbackRef.current) {
      notificationCallbacks.add(callbackRef.current);
    }

    return () => {
      // Unregister callbacks on unmount
      connectionStateCallbacks.delete(connectionCallback);
      errorStateCallbacks.delete(errorCallback);
      
      if (callbackRef.current) {
        notificationCallbacks.delete(callbackRef.current);
      }
      
      // Only disconnect socket if no more instances are using it
      if (connectionStateCallbacks.size === 0 && socket) {
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

  const updateSharedNotifications = useCallback((newNotifications: Notification[]) => {
    sharedNotifications = newNotifications;
    notificationListeners.forEach(listener => listener(sharedNotifications));
  }, []);

  return { 
    notifications, 
    setNotifications: updateSharedNotifications, 
    isConnected, 
    error,
    clearError
  };
}
