import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminService, AdminStats } from '../services/adminService';
import { Activity } from '../components/admin/RecentActivity';

interface AdminContextType {
  // Stats
  stats: AdminStats | null;
  statsLoading: boolean;
  statsError: string | null;
  refreshStats: () => Promise<void>;
  
  // Filters and settings
  timeRange: '7d' | '30d' | '90d' | '1y';
  setTimeRange: (range: '7d' | '30d' | '90d' | '1y') => void;
  
  // Real-time updates
  lastUpdate: Date | null;
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  
  // Quick actions
  pendingReportsCount: number;
  unreadNotificationsCount: number;
  
  // Admin user info
  adminUser: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'super_admin';
    permissions: string[];
  } | null;
  
  // Recent activities (cached)
  recentActivities: Activity[];
  
  // Quick stats (for navbar/sidebar)
  quickStats: {
    totalUsers: number;
    activeListings: number;
    pendingReports: number;
    todayMessages: number;
  } | null;
  
  // Methods
  markNotificationAsRead: (id: string) => void;
  dismissAlert: (id: string) => void;
  addActivity: (activity: Activity) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

// Mock admin user
const mockAdminUser = {
  id: 'admin_1',
  name: 'المدير العام',
  email: 'admin@marketplace.com',
  role: 'super_admin' as const,
  permissions: [
    'users.read',
    'users.write',
    'users.delete',
    'listings.read',
    'listings.write',
    'listings.delete',
    'reports.read',
    'reports.write',
    'categories.read',
    'categories.write',
    'categories.delete',
    'analytics.read',
    'settings.write'
  ]
};

export function AdminProvider({ children }: AdminProviderProps) {
  // Stats state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  
  // Settings state
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('7d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Quick stats
  const [quickStats, setQuickStats] = useState<AdminContextType['quickStats']>(null);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  
  // Activities
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  
  // Admin user
  const [adminUser] = useState(mockAdminUser);

  // Refresh stats function
  const refreshStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      
      const data = await adminService.getStats();
      setStats(data);
      
      // Update quick stats
      setQuickStats({
        totalUsers: data.totalUsers,
        activeListings: data.activeListings,
        pendingReports: data.pendingReports,
        todayMessages: data.todayMessages
      });
      
      // Update counters
      setPendingReportsCount(data.pendingReports);
      setUnreadNotificationsCount(Math.floor(Math.random() * 5) + 1); // Mock
      
      // Update activities if available
      if (data.recentActivities) {
        setRecentActivities(data.recentActivities);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ في تحميل الإحصائيات';
      setStatsError(errorMessage);
      console.error('Error refreshing admin stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && !statsLoading) {
      const interval = setInterval(() => {
        refreshStats();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoRefresh, statsLoading]);

  // Initial load
  useEffect(() => {
    refreshStats();
  }, [timeRange]);

  // Time range change effect
  useEffect(() => {
    if (stats) {
      // Refetch data when time range changes
      refreshStats();
    }
  }, [timeRange]);

  // Helper functions
  const markNotificationAsRead = (id: string) => {
    setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
  };

  const dismissAlert = (id: string) => {
    // Implementation for dismissing alerts/notifications
    console.log('Dismissing alert:', id);
  };

  const addActivity = (activity: Activity) => {
    setRecentActivities(prev => [activity, ...prev.slice(0, 9)]); // Keep only latest 10
  };

  // Mock some activities on mount
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'user_registered',
        title: 'مستخدم جديد',
        description: 'انضم أحمد محمد للمنصة',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        user: { id: '1', name: 'أحمد محمد' }
      },
      {
        id: '2',
        type: 'listing_created',
        title: 'إعلان جديد',
        description: 'تم نشر إعلان "سيارة BMW 2020" في قسم السيارات',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        user: { id: '2', name: 'سارة أحمد' },
        metadata: { listingId: 'listing_123' }
      },
      {
        id: '3',
        type: 'report_created',
        title: 'بلاغ جديد',
        description: 'تم الإبلاغ عن إعلان مخالف من قبل فاطمة علي',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        user: { id: '3', name: 'فاطمة علي' },
        metadata: { reportId: 'report_456', listingId: 'listing_789' }
      },
      {
        id: '4',
        type: 'listing_approved',
        title: 'موافقة على إعلان',
        description: 'تمت الموافقة على إعلان "جهاز كمبيوتر محمول"',
        timestamp: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
        metadata: { listingId: 'listing_321' }
      },
      {
        id: '5',
        type: 'message_sent',
        title: 'رسالة جديدة',
        description: 'تم إرسال رسالة بين عبدالله وليلى حول إعلان الهاتف',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: { id: '4', name: 'عبدالله حسن' }
      }
    ];
    
    setRecentActivities(mockActivities);
  }, []);

  const contextValue: AdminContextType = {
    // Stats
    stats,
    statsLoading,
    statsError,
    refreshStats,
    
    // Filters and settings
    timeRange,
    setTimeRange,
    
    // Real-time updates
    lastUpdate,
    autoRefresh,
    setAutoRefresh,
    
    // Quick actions
    pendingReportsCount,
    unreadNotificationsCount,
    
    // Admin user
    adminUser,
    
    // Activities and quick stats
    recentActivities,
    quickStats,
    
    // Methods
    markNotificationAsRead,
    dismissAlert,
    addActivity
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextType {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}