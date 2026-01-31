import { useState, useEffect } from 'react';
import { Bell, AlertCircle, Wifi, WifiOff, ArrowRight } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useAuth } from '@/contexts/AuthContext';
import notificationsAPI from '@/services/notifications';
import { useNotifications } from '@/hooks/use-notifications';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { 
    notifications: realtimeNotifications, 
    isConnected,
    error: socketError,
  } = useNotifications(user?.id);

  const { 
    data: persistedNotifications, 
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["persistedNotification", user?.id],
    queryFn: () => notificationsAPI.getUserNotifications(),
    enabled: !!user?.id,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Merge notifications, removing duplicates
  const allNotifications = [
    ...(realtimeNotifications || []),
    ...(persistedNotifications || [])
  ].reduce((unique, notification) => {
    const exists = unique.some(n => n.id === notification.id);
    if (!exists) unique.push(notification);
    return unique;
  }, [] as Notification[]);

  const unreadCount = allNotifications?.filter(n => !n.read).length || 0;

  useEffect(() => {
    if (socketError) setError(socketError);
    else if (queryError) setError('Failed to fetch notifications');
    else setError(null);
  }, [socketError, queryError]);

  const handleOpenChange = async () => {
    try {
      setIsOpen(!isOpen);
      if (!isOpen && unreadCount > 0) {
        await notificationsAPI.markNotificationAsRead();
        // Optimistically update UI
        queryClient.setQueryData(
          ["persistedNotification", user?.id],
          (old: Notification[] | undefined) => 
            old?.map(n => ({ ...n, read: true })) || []
        );
      }
    } catch (err) {
      setError('Failed to mark notifications as read');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
        -Math.round(diffInHours),
        'hour'
      );
    }
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-neutral-100"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-primary text-[11px] text-white items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </Button>
          
          {/* Connection status indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute -bottom-1 -right-1">
                {isConnected ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-500" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isConnected ? 'Connected' : 'Disconnected'}
            </TooltipContent>
          </Tooltip>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        className="w-80 mt-2 bg-background border border-neutral-200 shadow-lg rounded-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
        sideOffset={8}
      >
        {error && (
          <>
            <div className="p-4 text-center text-red-500 bg-red-50">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {isLoading ? (
          <div className="p-4 text-center text-neutral-500">
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : allNotifications?.length === 0 ? (
          <div className="p-4 text-center text-neutral-500">
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          allNotifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`p-4 hover:bg-neutral-50 cursor-pointer ${
                !notification.read ? 'bg-neutral-50' : ''
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{notification.title}</span>
                  <span className="text-xs text-neutral-500">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-2">
                  {notification.message}
                </p>
                {!notification.read && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
        
        {allNotifications?.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-between text-sm hover:bg-neutral-50"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/my-account/communications');
                }}
              >
                View all notifications
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
