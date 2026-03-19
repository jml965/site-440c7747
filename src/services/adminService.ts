import { Activity } from '../components/admin/RecentActivity';

export interface AdminStats {
  // Main stats
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  pendingReports: number;
  
  // Changes (percentages)
  usersChange: number;
  listingsChange: number;
  activeListingsChange: number;
  reportsChange: number;
  
  // Secondary stats
  totalMessages: number;
  todayMessages: number;
  totalCategories: number;
  activeCategories: number;
  growthRate: number;
  activeUsers: number;
  
  // Recent activities
  recentActivities: Activity[];
  
  // Time-based data
  userGrowth: {
    labels: string[];
    data: number[];
  };
  
  listingGrowth: {
    labels: string[];
    data: number[];
  };
  
  categoryDistribution: {
    labels: string[];
    data: number[];
  };
}

export interface UserManagement {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'blocked';
  joinDate: string;
  lastActivity: string;
  listingsCount: number;
  reportsCount: number;
}

export interface ListingManagement {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  images: string[];
  viewsCount: number;
  reportsCount: number;
}

export interface ReportManagement {
  id: string;
  type: 'listing' | 'user' | 'message';
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  target: {
    id: string;
    type: 'listing' | 'user' | 'message';
    title?: string;
    name?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface CategoryManagement {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive';
  listingsCount: number;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  children?: CategoryManagement[];
}

// Mock data for development
const mockStats: AdminStats = {
  totalUsers: 1248,
  totalListings: 3456,
  activeListings: 2789,
  pendingReports: 23,
  
  usersChange: 12.5,
  listingsChange: 8.3,
  activeListingsChange: 15.2,
  reportsChange: -5.1,
  
  totalMessages: 8967,
  todayMessages: 127,
  totalCategories: 12,
  activeCategories: 11,
  growthRate: 18.7,
  activeUsers: 892,
  
  recentActivities: [],
  
  userGrowth: {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    data: [120, 145, 167, 189, 210, 248]
  },
  
  listingGrowth: {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    data: [234, 289, 345, 398, 456, 512]
  },
  
  categoryDistribution: {
    labels: ['سيارات', 'عقارات', 'إلكترونيات', 'أثاث', 'ملابس'],
    data: [856, 642, 489, 367, 234]
  }
};

const mockUsers: UserManagement[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    status: 'active',
    joinDate: '2024-01-15T10:30:00Z',
    lastActivity: '2024-01-20T14:22:00Z',
    listingsCount: 15,
    reportsCount: 0
  },
  {
    id: '2',
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    phone: '+966507654321',
    status: 'active',
    joinDate: '2024-01-10T08:15:00Z',
    lastActivity: '2024-01-20T12:45:00Z',
    listingsCount: 8,
    reportsCount: 1
  }
];

const mockListings: ListingManagement[] = [
  {
    id: '1',
    title: 'سيارة BMW 2020',
    description: 'سيارة BMW موديل 2020 بحالة ممتازة',
    price: 85000,
    category: 'سيارات',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    user: {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com'
    },
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'],
    viewsCount: 156,
    reportsCount: 0
  }
];

const mockReports: ReportManagement[] = [
  {
    id: '1',
    type: 'listing',
    reason: 'محتوى مخالف',
    description: 'الإعلان يحتوي على معلومات مضللة',
    status: 'pending',
    createdAt: '2024-01-20T10:30:00Z',
    reporter: {
      id: '2',
      name: 'فاطمة علي',
      email: 'fatima@example.com'
    },
    target: {
      id: '1',
      type: 'listing',
      title: 'سيارة BMW 2020'
    },
    priority: 'medium'
  }
];

const mockCategories: CategoryManagement[] = [
  {
    id: '1',
    name: 'سيارات',
    nameEn: 'cars',
    description: 'السيارات والمركبات',
    icon: 'car',
    color: '#3b82f6',
    status: 'active',
    listingsCount: 856,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'عقارات',
    nameEn: 'real-estate',
    description: 'العقارات والمنازل',
    icon: 'home',
    color: '#10b981',
    status: 'active',
    listingsCount: 642,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

class AdminService {
  private baseURL = '/api/admin';

  // Stats endpoints
  async getStats(): Promise<AdminStats> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be:
      // const response = await fetch(`${this.baseURL}/stats`);
      // return await response.json();
      
      return mockStats;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw new Error('فشل في تحميل إحصائيات المدير');
    }
  }

  async getStatsDateRange(startDate: string, endDate: string): Promise<AdminStats> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockStats;
    } catch (error) {
      console.error('Error fetching stats for date range:', error);
      throw new Error('فشل في تحميل الإحصائيات للفترة المحددة');
    }
  }

  // User management endpoints
  async getUsers(page = 1, limit = 10, search?: string): Promise<{ users: UserManagement[]; total: number; }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredUsers = mockUsers;
      if (search) {
        filteredUsers = mockUsers.filter(user => 
          user.name.includes(search) || user.email.includes(search)
        );
      }
      
      return {
        users: filteredUsers.slice((page - 1) * limit, page * limit),
        total: filteredUsers.length
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('فشل في تحميل المستخدمين');
    }
  }

  async getUserById(id: string): Promise<UserManagement> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }
      
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUserStatus(id: string, status: 'active' | 'inactive' | 'blocked'): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // In production: PUT /api/admin/users/:id/status
    } catch (error) {
      console.error('Error updating user status:', error);
      throw new Error('فشل في تحديث حالة المستخدم');
    }
  }

  // Listing management endpoints
  async getListings(page = 1, limit = 10, filters?: any): Promise<{ listings: ListingManagement[]; total: number; }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return {
        listings: mockListings.slice((page - 1) * limit, page * limit),
        total: mockListings.length
      };
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw new Error('فشل في تحميل الإعلانات');
    }
  }

  async updateListingStatus(id: string, status: 'active' | 'inactive' | 'pending' | 'rejected'): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      // In production: PUT /api/admin/listings/:id/status
    } catch (error) {
      console.error('Error updating listing status:', error);
      throw new Error('فشل في تحديث حالة الإعلان');
    }
  }

  async deleteListing(id: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      // In production: DELETE /api/admin/listings/:id
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw new Error('فشل في حذف الإعلان');
    }
  }

  // Report management endpoints
  async getReports(page = 1, limit = 10, filters?: any): Promise<{ reports: ReportManagement[]; total: number; }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        reports: mockReports.slice((page - 1) * limit, page * limit),
        total: mockReports.length
      };
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('فشل في تحميل البلاغات');
    }
  }

  async updateReportStatus(id: string, status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      // In production: PUT /api/admin/reports/:id/status
    } catch (error) {
      console.error('Error updating report status:', error);
      throw new Error('فشل في تحديث حالة البلاغ');
    }
  }

  // Category management endpoints
  async getCategories(): Promise<CategoryManagement[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('فشل في تحميل الأقسام');
    }
  }

  async createCategory(category: Omit<CategoryManagement, 'id' | 'createdAt' | 'updatedAt'>): Promise<CategoryManagement> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCategory: CategoryManagement = {
        ...category,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('فشل في إنشاء القسم');
    }
  }

  async updateCategory(id: string, updates: Partial<CategoryManagement>): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      // In production: PUT /api/admin/categories/:id
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('فشل في تحديث القسم');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      // In production: DELETE /api/admin/categories/:id
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('فشل في حذف القسم');
    }
  }

  // Bulk operations
  async bulkUpdateListings(ids: string[], updates: Partial<ListingManagement>): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // In production: PUT /api/admin/listings/bulk
    } catch (error) {
      console.error('Error bulk updating listings:', error);
      throw new Error('فشل في تحديث الإعلانات المتعددة');
    }
  }

  async bulkUpdateUsers(ids: string[], updates: Partial<UserManagement>): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // In production: PUT /api/admin/users/bulk
    } catch (error) {
      console.error('Error bulk updating users:', error);
      throw new Error('فشل في تحديث المستخدمين المتعددين');
    }
  }

  // System operations
  async sendNotification(userIds: string[], title: string, message: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      // In production: POST /api/admin/notifications
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('فشل في إرسال الإشعار');
    }
  }

  async broadcastNotification(title: string, message: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // In production: POST /api/admin/notifications/broadcast
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      throw new Error('فشل في بث الإشعار العام');
    }
  }

  async exportData(type: 'users' | 'listings' | 'reports', format: 'csv' | 'xlsx'): Promise<Blob> {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock CSV export
      const csvContent = 'id,name,email\n1,أحمد محمد,ahmed@example.com';
      return new Blob([csvContent], { type: 'text/csv' });
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('فشل في تصدير البيانات');
    }
  }

  // Analytics
  async getAnalytics(period: '7d' | '30d' | '90d' | '1y'): Promise<any> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return {
        userGrowth: mockStats.userGrowth,
        listingGrowth: mockStats.listingGrowth,
        categoryDistribution: mockStats.categoryDistribution,
        revenue: { total: 0, growth: 0 },
        engagement: { avgSessionTime: '5:32', bounceRate: 23.5 }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('فشل في تحميل التحليلات');
    }
  }
}

export const adminService = new AdminService();