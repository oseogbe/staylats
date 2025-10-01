import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Bell, 
  MessageSquare, 
  Plus, 
  Filter, 
  RefreshCw,
  Trash2,
  X 
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

import { useAuth } from '@/contexts/AuthContext';
import notificationsAPI from '@/services/notifications';
import { Notification } from '@/components/notifications/NotificationBell';

const messageSchema = z.object({
  title: z.string().min(1, 'Message title is required').max(100, 'Title must be under 100 characters'),
  type: z.enum(['support', 'complaint', 'inquiry', 'feedback']),
  priority: z.enum(['low', 'medium', 'high']),
  details: z.string().min(10, 'Please provide more details').max(5000, 'Details must be under 5000 characters'),
});

type MessageFormData = z.infer<typeof messageSchema>;

const CommunicationsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState("notifications");
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [messageTypeFilter, setMessageTypeFilter] = useState('all');
  const [messageStatusFilter, setMessageStatusFilter] = useState('all');
  const [isCreateMessageOpen, setIsCreateMessageOpen] = useState(false);

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      type: 'support',
      priority: 'medium',
    },
  });

  const { 
    data: notifications = [], 
    isLoading: notificationsLoading,
    refetch: refetchNotifications 
  } = useQuery({
    queryKey: ["userNotifications", user?.id],
    queryFn: () => notificationsAPI.getUserNotifications(),
    enabled: !!user?.id && activeSubTab === 'notifications',
  });

  // Mock messages data - in real app this would come from API
  const messages = [
    // Empty for now, will be populated when backend is connected
  ];

  const filteredNotifications = notifications.filter((notification: Notification) => {
    if (notificationFilter === 'unread') return !notification.read;
    if (notificationFilter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markNotificationAsRead();
      queryClient.setQueryData(
        ["userNotifications", user?.id],
        (old: Notification[] | undefined) => 
          old?.map(n => ({ ...n, read: true })) || []
      );
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const onSubmitMessage = async (data: MessageFormData) => {
    try {
      // In real implementation, this would call an API
      console.log('Submitting message:', data);
      setIsCreateMessageOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to send message:', error);
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
    <Card>
      <CardHeader>
        <CardTitle>Communications</CardTitle>
        <CardDescription>
          Manage your notifications and customer support messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="customer-support" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Customer Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Stay updated with your latest notifications and activity
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchNotifications()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={notificationFilter === 'unread' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setNotificationFilter('unread')}
                  className="rounded-none border-0"
                >
                  Unread
                </Button>
                <Button
                  variant={notificationFilter === 'read' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setNotificationFilter('read')}
                  className="rounded-none border-0 border-l"
                >
                  Read
                </Button>
              </div>
              
              {unreadCount > 0 && notificationFilter !== 'read' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="ml-auto"
                >
                  Mark all as read
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {notificationsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading notifications...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-medium mb-2">
                    {notificationFilter === 'unread' ? 'You have no unread notifications' : 'No notifications found!'}
                  </h4>
                  <p className="text-muted-foreground">
                    {notificationFilter === 'unread' 
                      ? 'All caught up! New notifications will appear here.' 
                      : 'You have not sent any messages yet'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification: Notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      !notification.read ? 'bg-muted/50 border-primary/20' : 'bg-background'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        !notification.read ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Bell className={`h-4 w-4 ${
                          !notification.read ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="customer-support" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Messages</h3>
                <p className="text-sm text-muted-foreground">
                  Send messages to our team and track responses
                </p>
              </div>
              <Dialog open={isCreateMessageOpen} onOpenChange={setIsCreateMessageOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Message
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create a New Message</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitMessage)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief title for your message" {...field} />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Keep it clear and concise (max 100 characters)
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select message type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="support">Support Request</SelectItem>
                                <SelectItem value="complaint">Complaint</SelectItem>
                                <SelectItem value="inquiry">Inquiry</SelectItem>
                                <SelectItem value="feedback">Feedback</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              This helps us route your message to the right team
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              How urgent is your message? Default: Medium
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide all relevant details about your message here..."
                                className="min-h-24"
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Include all relevant information to help us address your message effectively (max 5000 characters)
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateMessageOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                          Send Message
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={messageTypeFilter} onValueChange={setMessageTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Message Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Type</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="inquiry">Inquiry</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={messageStatusFilter} onValueChange={setMessageStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Status</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMessageTypeFilter('all');
                  setMessageStatusFilter('all');
                }}
                className="ml-auto"
              >
                Clear
              </Button>
            </div>

            <Separator />

            <div className="text-center py-12">
              <Trash2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">No Messages found!</h4>
              <p className="text-muted-foreground mb-4">
                You have not sent any messages yet
              </p>
              <Button 
                onClick={() => setIsCreateMessageOpen(true)}
                className="inline-flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Message Customer Service
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommunicationsPage;
