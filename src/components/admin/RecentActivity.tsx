import React from 'react';
import { 
  User, 
  FileText, 
  AlertTriangle, 
  MessageSquare, 
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

export interface Activity {
  id: string;
  type: 'user_registered' | 'listing_created' | 'listing_updated' | 'report_created' | 'message_sent' | 'category_created' | 'user_blocked' | 'listing_approved' | 'listing_rejected';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: {
    listingId?: string;
    categoryId?: string;
    reportId?: string;
    [key: string]: any;
  };
}

interface RecentActivityProps {
  activities: Activity[];
  limit?: number;
}

const activityIcons = {
  user_registered: User,
  listing_created: FileText,
  listing_updated: FileText,
  report_created: AlertTriangle,
  message_sent: MessageSquare,
  category_created: ShoppingBag,
  user_blocked: XCircle,
  listing_approved: CheckCircle,
  listing_rejected: XCircle,
};

const activityColors = {
  user_registered: 'text-green-600 bg-green-100',
  listing_created: 'text-blue-600 bg-blue-100',
  listing_updated: 'text-yellow-600 bg-yellow-100',
  report_created: 'text-red-600 bg-red-100',
  message_sent: 'text-purple-600 bg-purple-100',
  category_created: 'text-indigo-600 bg-indigo-100',
  user_blocked: 'text-red-600 bg-red-100',
  listing_approved: 'text-green-600 bg-green-100',
  listing_rejected: 'text-red-600 bg-red-100',
};

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'user_registered',
    title: 'مستخدم جديد',
    description: 'انضم أحمد محمد للمنصة',
    timestamp: '2024-01-15T10:30:00Z',
    user: { id: '1', name: 'أحمد محمد' }
  },
  {
    id: '2',
    type: 'listing_created',
    title: 'إعلان جديد',
    description: 'تم نشر إعلان "سيارة BMW 2020" في قسم السيارات',
    timestamp: '2024-01-15T10:15:00Z',
    user: { id: '2', name: 'سارة أحمد' },
    metadata: { listingId: 'listing_123' }
  },
  {
    id: '3',
    type: 'report_created',
    title: 'بلاغ جديد',
    description: 'تم الإبلاغ عن إعلان مخالف من قبل فاطمة علي',
    timestamp: '2024-01-15T09:45:00Z',
    user: { id: '3', name: 'فاطمة علي' },
    metadata: { reportId: 'report_456', listingId: 'listing_789' }
  },
  {
    id: '4',
    type: 'listing_approved',
    title: 'موافقة على إعلان',
    description: 'تمت الموافقة على إعلان "جهاز كمبيوتر محمول"',
    timestamp: '2024-01-15T09:30:00Z',
    metadata: { listingId: 'listing_321' }
  },
  {
    id: '5',
    type: 'message_sent',
    title: 'رسالة جديدة',
    description: 'تم إرسال رسالة بين عبدالله وليلى حول إعلان الهاتف',
    timestamp: '2024-01-15T09:00:00Z',
    user: { id: '4', name: 'عبدالله حسن' }
  },
  {
    id: '6',
    type: 'category_created',
    title: 'قسم جديد',
    description: 'تم إنشاء قسم "معدات رياضية"',
    timestamp: '2024-01-15T08:45:00Z'
  },
  {
    id: '7',
    type: 'listing_updated',
    title: 'تحديث إعلان',
    description: 'قام محمد خالد بتحديث إعلان "شقة للبيع"',
    timestamp: '2024-01-15T08:30:00Z',
    user: { id: '5', name: 'محمد خالد' },
    metadata: { listingId: 'listing_654' }
  },
  {
    id: '8',
    type: 'user_blocked',
    title: 'حظر مستخدم',
    description: 'تم حظر المستخدم "مستخدم مخالف" لانتهاك القوانين',
    timestamp: '2024-01-15T08:15:00Z',
    user: { id: '6', name: 'مستخدم مخالف' }
  }
];

export function RecentActivity({ activities = mockActivities, limit = 8 }: RecentActivityProps) {
  const displayedActivities = activities.slice(0, limit);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'الآن';
    } else if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `منذ ${hours} ساعة`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `منذ ${days} يوم`;
    }
  };

  const getActionButton = (activity: Activity) => {
    switch (activity.type) {
      case 'listing_created':
      case 'listing_updated':
        return (
          <button className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
            <Eye className="w-3 h-3" />
            عرض
          </button>
        );
      case 'report_created':
        return (
          <button className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            مراجعة
          </button>
        );
      case 'user_registered':
        return (
          <button className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center gap-1">
            <User className="w-3 h-3" />
            عرض الملف
          </button>
        );
      default:
        return null;
    }
  };

  if (displayedActivities.length === 0) {
    return (
      <div className="p-8 text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">لا توجد أنشطة حديثة</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {displayedActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        const colorClass = activityColors[activity.type];

        return (
          <div
            key={activity.id}
            className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${index === 0 ? 'bg-blue-50/30' : ''}`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {activity.title}
                      </h4>
                      {index === 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          جديد
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(activity.timestamp)}</span>
                        </div>
                        
                        {activity.user && (
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {activity.user.name.charAt(0)}
                              </span>
                            </div>
                            <span>{activity.user.name}</span>
                          </div>
                        )}
                      </div>
                      
                      {getActionButton(activity)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {activities.length > limit && (
        <div className="p-4 text-center border-t border-gray-200">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            عرض المزيد من الأنشطة ({activities.length - limit} أخرى)
          </button>
        </div>
      )}
    </div>
  );
}