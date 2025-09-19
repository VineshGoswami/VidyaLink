import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'session':
        return 'Video';
      case 'assignment':
        return 'FileText';
      case 'announcement':
        return 'Megaphone';
      case 'reminder':
        return 'Bell';
      case 'download':
        return 'Download';
      default:
        return 'Info';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    switch (type) {
      case 'session':
        return 'text-primary';
      case 'assignment':
        return 'text-warning';
      case 'announcement':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationTime?.toLocaleDateString('en-IN');
  };

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'unread') return !notification?.read;
    if (filter === 'important') return notification?.priority === 'high';
    return true;
  });

  return (
    <div className="bg-card border border-border rounded-lg">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Icon name="Bell" size={20} className="text-foreground" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
        </div>
        
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-muted-foreground transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>
      {isExpanded && (
        <div className="border-t border-border animate-fade-in">
          {/* Filter Tabs */}
          <div className="flex border-b border-border">
            {[
              { key: 'all', label: 'All', count: notifications?.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'important', label: 'Important', count: notifications?.filter(n => n?.priority === 'high')?.length }
            ]?.map(tab => (
              <button
                key={tab?.key}
                onClick={() => setFilter(tab?.key)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === tab?.key
                    ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab?.label} {tab?.count > 0 && `(${tab?.count})`}
              </button>
            ))}
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-3 border-b border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllAsRead}
                iconName="CheckCheck"
                iconPosition="left"
              >
                Mark all as read
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredNotifications?.length === 0 ? (
              <div className="p-6 text-center">
                <Icon name="Inbox" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredNotifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                      !notification?.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => onMarkAsRead(notification?.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notification?.priority === 'high' ? 'bg-error/10' : 'bg-muted'
                      }`}>
                        <Icon 
                          name={getNotificationIcon(notification?.type)} 
                          size={16} 
                          className={getNotificationColor(notification?.type, notification?.priority)}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium ${
                            !notification?.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification?.title}
                          </h4>
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification?.timestamp)}
                            </span>
                            {!notification?.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification?.message}
                        </p>
                        
                        {notification?.actionLabel && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto mt-2 text-primary"
                          >
                            {notification?.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;