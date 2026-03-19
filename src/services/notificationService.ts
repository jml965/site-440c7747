import { Notification } from '../types/index';
import { api } from './api';

class NotificationService {
  private baseUrl = '/api/notifications';

  // Get notifications for a user
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return mock data for development
      return this.getMockNotifications(userId);
    }
  }

  // Get user notification preferences
  async getPreferences(userId: string): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/preferences`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return this.getMockPreferences();
    }
  }

  // Update notification preferences
  async updatePreferences(userId: string, preferences: any): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/${userId}/preferences`, preferences);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      // Simulate success in development
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/${userId}/read-all`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  // Create a new notification
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
    try {
      const response = await api.post(this.baseUrl, notification);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      // Return mock notification for development
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...notification,
        read: false,
        createdAt: new Date().toISOString()
      };
      return newNotification;
    }
  }

  // Send bulk notifications
  async sendBulkNotifications(notifications: Array<Omit<Notification, 'id' | 'createdAt' | 'read'>>): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/bulk`, { notifications });
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
    }
  }

  // Get notification statistics
  async getStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/${userId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      return {
        total: 0,
        unread: 0,
        byType: {}
      };
    }
  }

  // Private method to generate mock data for development
  private getMockNotifications(userId: string): Notification[] {
    return [
      {
        id: '1',
        userId: userId,
        title: 'رسالة جديدة',
        message: 'لديك رسالة جديدة من أحمد محمد بخصوص إعلان "سيارة تويوتا كامري 2020"',
        type: 'message',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        data: {
          listingId: 'listing-1',
          userId: 'user-2',
          conversationId: 'conv-1'
        }
      },
      {
        id: '2',
        userId: userId,
        title: 'إضافة للمفضلة',
        message: 'تم إضافة إعلان "جهاز آيفون 14 برو" إلى قائمة المفضلة',
        type: 'favorite',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        data: {
          listingId: 'listing-2'
        }
      },
      {
        id: '3',
        userId: userId,
        title: 'تم نشر إعلانك',
        message: 'تم نشر إعلانك "شقة للبيع في الرياض" بنجاح ويمكن للمستخدمين الآن مشاهدته',
        type: 'listing',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        data: {
          listingId: 'listing-3'
        }
      },
      {
        id: '4',
        userId: userId,
        title: 'تحديث الملف الشخصي',
        message: 'تم تحديث معلومات ملفك الشخصي بنجاح',
        type: 'user',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
        data: {
          userId: userId
        }
      },
      {
        id: '5',
        userId: userId,
        title: 'تنبيه أمني',
        message: 'تم تسجيل دخول جديد لحسابك من جهاز غير معروف. إذا لم تكن أنت، يرجى تغيير كلمة المرور',
        type: 'alert',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        data: {
          ip: '192.168.1.1',
          device: 'Mobile Device'
        }
      },
      {
        id: '6',
        userId: userId,
        title: 'رسالة جديدة',
        message: 'لديك رسالة جديدة من فاطمة أحمد بخصوص إعلان "طاولة طعام خشبية"',
        type: 'message',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
        data: {
          listingId: 'listing-4',
          userId: 'user-3',
          conversationId: 'conv-2'
        }
      },
      {
        id: '7',
        userId: userId,
        title: 'عرض جديد',
        message: 'تلقيت عرضاً جديداً على إعلان "دراجة هوائية" بقيمة 800 ريال',
        type: 'listing',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        data: {
          listingId: 'listing-5',
          offerId: 'offer-1',
          amount: 800
        }
      },
      {
        id: '8',
        userId: userId,
        title: 'إشعار النظام',
        message: 'سيتم إجراء صيانة مجدولة على النظام غداً من الساعة 2:00 صباحاً إلى 4:00 صباحاً',
        type: 'alert',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        data: {
          maintenanceStart: '2024-01-15T02:00:00Z',
          maintenanceEnd: '2024-01-15T04:00:00Z'
        }
      }
    ];
  }

  private getMockPreferences() {
    return {
      messages: true,
      favorites: true,
      listings: true,
      users: false,
      alerts: true,
      email: true,
      push: true,
      sound: false
    };
  }
}

export const notificationService = new NotificationService();