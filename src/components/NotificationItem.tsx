import React from 'react';
import { Notification } from '../types/index';
import { 
  Bell, 
  MessageCircle, 
  Heart, 
  AlertTriangle, 
  ShoppingBag,
  User,
  X,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from '../utils/helpers';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'message':
      return <MessageCircle className="w-5 h-5" />;
    case 'favorite':
      return <Heart className="w-5 h-5" />;
    case 'listing':
      return <ShoppingBag className="w-5 h-5" />;
    case 'user':
      return <User className="w-5 h-5" />;
    case 'alert':
      return <AlertTriangle className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'message':
      return 'bg-blue-500 text-white';
    case 'favorite':
      return 'bg-red-500 text-white';
    case 'listing':
      return 'bg-green-500 text-white';
    case 'user':
      return 'bg-purple-500 text-white';
    case 'alert':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMarkAsRead = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <div
      className={`group relative p-4 border border-gray-100 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
        notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-5">
                {notification.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {notification.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!notification.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-green-600 hover:text-green-700"
                  title="تعيين كمقروء"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-600 hover:text-red-700"
                title="حذف الإشعار"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(notification.createdAt)}
            </span>
            
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </div>
        </div>
      </div>

      {/* Data */}
      {notification.data && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {notification.data.listingId && (
            <div className="text-xs text-gray-500">
              رقم الإعلان: {notification.data.listingId}
            </div>
          )}
          {notification.data.userId && (
            <div className="text-xs text-gray-500">
              معرف المستخدم: {notification.data.userId}
            </div>
          )}
        </div>
      )}
    </div>
  );
}