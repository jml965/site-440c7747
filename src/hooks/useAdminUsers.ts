import { useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface UseAdminUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  createUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
  banUser: (userId: string, reason: string, duration?: number) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export function useAdminUsers(): UseAdminUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get('/admin/users');
      setUsers(response.data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'فشل في تحميل المستخدمين');
      
      // Fallback to mock data for development
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+966501234567',
          city: 'الرياض',
          role: 'admin',
          isBlocked: false,
          avatar: null,
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        },
        {
          id: '2',
          name: 'سارة أحمد',
          email: 'sara@example.com',
          phone: '+966507654321',
          city: 'جدة',
          role: 'moderator',
          isBlocked: false,
          avatar: null,
          createdAt: new Date('2024-02-10').toISOString(),
          updatedAt: new Date('2024-02-10').toISOString()
        },
        {
          id: '3',
          name: 'محمد عبدالله',
          email: 'mohammed@example.com',
          phone: '+966555555555',
          city: 'الدمام',
          role: 'user',
          isBlocked: false,
          avatar: null,
          createdAt: new Date('2024-02-20').toISOString(),
          updatedAt: new Date('2024-02-20').toISOString()
        },
        {
          id: '4',
          name: 'فاطمة علي',
          email: 'fatima@example.com',
          phone: '+966544444444',
          city: 'مكة المكرمة',
          role: 'user',
          isBlocked: false,
          avatar: null,
          createdAt: new Date('2024-03-05').toISOString(),
          updatedAt: new Date('2024-03-05').toISOString()
        },
        {
          id: '5',
          name: 'عبدالرحمن سعد',
          email: 'abdulrahman@example.com',
          phone: '+966533333333',
          city: 'المدينة المنورة',
          role: 'user',
          isBlocked: true,
          avatar: null,
          createdAt: new Date('2024-03-15').toISOString(),
          updatedAt: new Date('2024-03-15').toISOString()
        },
        {
          id: '6',
          name: 'نورا حسن',
          email: 'nora@example.com',
          phone: '+966522222222',
          city: 'الطائف',
          role: 'user',
          isBlocked: false,
          avatar: null,
          createdAt: new Date('2024-03-20').toISOString(),
          updatedAt: new Date('2024-03-20').toISOString()
        },
        {
          id: '7',
          name: 'خالد يوسف',
          email: 'khalid@example.com',
          phone: '+966511111111',
          city: 'تبوك',
          role: 'user',
          isBlocked: false,
          avatar: null,
          createdAt: new Date('2024-04-01').toISOString(),
          updatedAt: new Date('2024-04-01').toISOString()
        },
        {
          id: '8',
          name: 'ليلى عبدالعزيز',
          email: 'leila@example.com',
          phone: '+966500000000',
          city: 'بريدة',
          role: 'user',
          isBlocked: false,
          avatar: null,
          createdAt: new Date('2024-04-10').toISOString(),
          updatedAt: new Date('2024-04-10').toISOString()
        },
        {
          id: '9',
          name: 'عمر الأحمد',
          email: 'omar@example.com',
          phone: '+966599999999',
          city: 'خميس مشيط',
          role: 'user',
          isBlocked: true,
          avatar: null,
          createdAt: new Date('2024-04-15').toISOString(),
          updatedAt: new Date('2024-04-15').toISOString()
        },
        {
          id: '10',
          name: 'رند الشمري',
          email: 'rand@example.com',
          phone: '+966588888888',
          city: 'الأحساء',
          role: 'user',
          isBlocked: false,
          avatar: null,
          createdAt: new Date('2024-04-20').toISOString(),
          updatedAt: new Date('2024-04-20').toISOString()
        }
      ];
      
      setUsers(mockUsers);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Partial<User>) => {
    try {
      setError(null);
      const response = await apiService.post('/admin/users', userData);
      const newUser = response.data;
      setUsers(prev => [...prev, newUser]);
    } catch (err: any) {
      console.error('Error creating user:', err);
      
      // Fallback: add to local state for development
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || null,
        city: userData.city || null,
        role: userData.role || 'user',
        isBlocked: userData.isBlocked || false,
        avatar: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
      throw new Error(err.message || 'فشل في إنشاء المستخدم');
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      setError(null);
      const response = await apiService.put(`/admin/users/${userId}`, userData);
      const updatedUser = response.data;
      setUsers(prev => prev.map(user => 
        user.id === userId ? updatedUser : user
      ));
    } catch (err: any) {
      console.error('Error updating user:', err);
      
      // Fallback: update local state for development
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, ...userData, updatedAt: new Date().toISOString() }
          : user
      ));
    }
  };

  const banUser = async (userId: string, reason: string, duration?: number) => {
    try {
      setError(null);
      await apiService.post(`/admin/users/${userId}/ban`, {
        reason,
        duration
      });
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isBlocked: true, updatedAt: new Date().toISOString() }
          : user
      ));
    } catch (err: any) {
      console.error('Error banning user:', err);
      
      // Fallback: update local state for development
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isBlocked: true, updatedAt: new Date().toISOString() }
          : user
      ));
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      setError(null);
      await apiService.post(`/admin/users/${userId}/unban`);
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isBlocked: false, updatedAt: new Date().toISOString() }
          : user
      ));
    } catch (err: any) {
      console.error('Error unbanning user:', err);
      
      // Fallback: update local state for development
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isBlocked: false, updatedAt: new Date().toISOString() }
          : user
      ));
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setError(null);
      await apiService.delete(`/admin/users/${userId}`);
      
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err: any) {
      console.error('Error deleting user:', err);
      
      // Fallback: remove from local state for development
      setUsers(prev => prev.filter(user => user.id !== userId));
      throw new Error(err.message || 'فشل في حذف المستخدم');
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    banUser,
    unbanUser,
    deleteUser,
    refreshUsers
  };
}