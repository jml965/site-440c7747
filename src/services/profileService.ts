import { User, Listing } from '../types';

class ProfileService {
  private baseUrl = '/api/profile';

  // Get current user profile
  async getCurrentProfile(): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل الملف الشخصي');
      }

      return await response.json();
    } catch (error) {
      console.error('Get current profile error:', error);
      throw error;
    }
  }

  // Get another user's profile
  async getUserProfile(userId: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل الملف الشخصي');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  // Update current user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      // Validate required fields
      if (data.email && !this.validateEmail(data.email)) {
        throw new Error('تنسيق البريد الإلكتروني غير صحيح');
      }
      
      if (data.phone && !this.validatePhone(data.phone)) {
        throw new Error('تنسيق رقم الهاتف غير صحيح');
      }
      
      if (data.name && data.name.trim().length < 2) {
        throw new Error('يجب أن يكون الاسم أطول من حرفين');
      }

      const response = await fetch(`${this.baseUrl}/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في تحديث الملف الشخصي');
      }

      return await response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<string> {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('يجب أن يكون الملف صورة');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${this.baseUrl}/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('فشل في رفع الصورة');
      }

      const data = await response.json();
      return data.avatarUrl;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(userId?: string): Promise<any> {
    try {
      const url = userId ? `${this.baseUrl}/${userId}/stats` : `${this.baseUrl}/me/stats`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل الإحصائيات');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }

  // Get user listings
  async getUserListings(userId?: string, params?: {
    status?: 'active' | 'inactive' | 'sold';
    limit?: number;
    offset?: number;
  }): Promise<Listing[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      
      const url = userId 
        ? `${this.baseUrl}/${userId}/listings?${queryParams}`
        : `${this.baseUrl}/me/listings?${queryParams}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل الإعلانات');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user listings error:', error);
      throw error;
    }
  }

  // Update listing
  async updateListing(listingId: string, data: Partial<Listing>): Promise<Listing> {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث الإعلان');
      }

      return await response.json();
    } catch (error) {
      console.error('Update listing error:', error);
      throw error;
    }
  }

  // Delete listing
  async deleteListing(listingId: string): Promise<void> {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('فشل في حذف الإعلان');
      }
    } catch (error) {
      console.error('Delete listing error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    try {
      if (data.newPassword.length < 8) {
        throw new Error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      }

      const response = await fetch(`${this.baseUrl}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في تغيير كلمة المرور');
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Delete account
  async deleteAccount(password: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في حذف الحساب');
      }

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  // Get user favorites
  async getUserFavorites(): Promise<Listing[]> {
    try {
      const response = await fetch(`${this.baseUrl}/me/favorites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('فشل في تحميل المفضلة');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user favorites error:', error);
      throw error;
    }
  }

  // Update privacy settings
  async updatePrivacySettings(settings: {
    showPhone?: boolean;
    showLastSeen?: boolean;
    allowIndexing?: boolean;
  }): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/privacy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث إعدادات الخصوصية');
      }
    } catch (error) {
      console.error('Update privacy settings error:', error);
      throw error;
    }
  }

  // Update notification preferences
  async updateNotificationPreferences(preferences: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    messageNotifications?: boolean;
    listingNotifications?: boolean;
  }): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث إعدادات الإشعارات');
      }
    } catch (error) {
      console.error('Update notification preferences error:', error);
      throw error;
    }
  }

  // Helper methods
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^(\+966|0)?5\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Request data export
  async requestDataExport(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/export-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('فشل في طلب تصدير البيانات');
      }
    } catch (error) {
      console.error('Request data export error:', error);
      throw error;
    }
  }

  // Verify two-factor authentication
  async setupTwoFactor(): Promise<{ qrCode: string; secret: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/2fa/setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('فشل في إعداد المصادقة الثنائية');
      }

      return await response.json();
    } catch (error) {
      console.error('Setup 2FA error:', error);
      throw error;
    }
  }

  // Verify two-factor setup
  async verifyTwoFactor(token: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('رمز المصادقة غير صحيح');
      }
    } catch (error) {
      console.error('Verify 2FA error:', error);
      throw error;
    }
  }

  // Disable two-factor authentication
  async disableTwoFactor(token: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/2fa/disable`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('فشل في إلغاء المصادقة الثنائية');
      }
    } catch (error) {
      console.error('Disable 2FA error:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();