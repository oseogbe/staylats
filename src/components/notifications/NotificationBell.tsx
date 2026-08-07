import { useState, useEffect } from 'react';
import { Bell, AlertCircle, Wifi, WifiOff, ArrowRight } from 'lucide-react';
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
import { useNotifications } from '@/hooks/use-notifications';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import {
  useNotificationList,
  useMarkNotificationRead,
  useMarkNotificationsRead,
  type Notification,
} from '@/hooks/use-notification-list';
import { formatRelativeTime } from '@/lib/relativeTime';

export type { Notification };

/** The dropdown is a preview; the full history lives on the communications page. */
const PREVIEW_LIMIT = 10;

/** Merge two notification rows with the same id; prefer defined snapshot fields so socket payloads cannot wipe DB-backed dates. */
function mergeDuplicateNotifications(existing: Notification, incoming: Notification): Notification {
  return {
    ...existing,
    ...incoming,
    createdAt: incoming.createdAt ?? existing.createdAt,
    title: incoming.title ?? existing.title,
    message: incoming.message ?? existing.message,
    type: incoming.type ?? existing.type,
    read: incoming.read ?? existing.read,
  };
}

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    notifications: realtimeNotifications, 
    setNotifications: setRealtimeNotifications,
    isConnected,
    error: socketError,
  } = useNotifications(user?.id);

  usePushNotifications(user?.id);

  const {
    data: persistedNotifications,
    isLoading,
    error: queryError,
  } = useNotificationList(user?.id);

  const { mutateAsync: markAllRead } = useMarkNotificationsRead(user?.id);
  const { mutate: markRead } = useMarkNotificationRead(user?.id);

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Persisted first so realtime overlays read/status without dropping fields missing on the wire.
  // Merge duplicates by id so an incomplete socket payload cannot beat the REST row for createdAt.
  const allNotifications = [
    ...(persistedNotifications || []),
    ...(realtimeNotifications || []),
  ]
    .filter((notification) => notification?.id)
    .reduce((unique, notification) => {
      const idx = unique.findIndex((n) => n.id === notification.id);
      if (idx === -1) {
        unique.push(notification);
        return unique;
      }
      unique[idx] = mergeDuplicateNotifications(unique[idx], notification);
      return unique;
    }, [] as Notification[])
    .sort((a, b) => {
      const tb = new Date(b.createdAt).getTime();
      const ta = new Date(a.createdAt).getTime();
      const nb = Number.isNaN(tb) ? -Infinity : tb;
      const na = Number.isNaN(ta) ? -Infinity : ta;
      return nb - na;
    });

  // Counted before the preview is trimmed - the badge was reading only the
  // first ten, so an eleventh unread notification never showed on it.
  const unreadCount = allNotifications.filter((n) => !n.read).length;
  const previewNotifications = allNotifications.slice(0, PREVIEW_LIMIT);

  useEffect(() => {
    if (socketError) setError(socketError);
    else if (queryError) setError('Failed to fetch notifications');
    else setError(null);
  }, [socketError, queryError]);

  /**
   * Opening the bell no longer marks anything read - that measured whether the
   * user had glanced at the bell, not what they had read. A notification is
   * read when it is opened, or when they say so explicitly.
   */
  const markOneRead = (notification: Notification) => {
    if (notification.read) return;

    markRead(notification.id);
    // The socket-held copies are this hook's own state, kept in step by hand
    setRealtimeNotifications(
      realtimeNotifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setRealtimeNotifications(
        realtimeNotifications.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      setError('Failed to mark notifications as read');
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
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

        {/* Opening no longer clears the badge, so the bulk action is offered here */}
        {unreadCount > 0 && (
          <>
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-medium text-neutral-500">
                {unreadCount} unread
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-primary hover:bg-transparent hover:underline"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </Button>
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
          <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
            {previewNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={() => markOneRead(notification)}
                className={`p-4 hover:bg-neutral-50 cursor-pointer ${
                  !notification.read ? 'bg-neutral-50' : ''
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{notification.title}</span>
                    <span className="text-xs text-neutral-500">
                      {formatRelativeTime(notification.createdAt)}
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
            ))}
          </div>
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
