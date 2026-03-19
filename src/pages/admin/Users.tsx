import React, { useState } from 'react';
import { UserTable } from '../../components/admin/UserTable';
import { UserModal } from '../../components/admin/UserModal';
import { BanUserModal } from '../../components/admin/BanUserModal';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { User } from '../../types';
import { Search, Plus, UserCheck, UserX, Filter } from 'lucide-react';

export default function Users() {
  const { users, loading, error, createUser, updateUser, banUser, unbanUser } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && !user.isBlocked) ||
                         (statusFilter === 'banned' && user.isBlocked);
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowUserModal(true);
  };

  const handleBanUser = (user: User) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const handleUserSave = async (userData: Partial<User>) => {
    try {
      if (isEditing && selectedUser) {
        await updateUser(selectedUser.id, userData);
      } else {
        await createUser(userData);
      }
      setShowUserModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleBanConfirm = async (reason: string, duration?: number) => {
    if (!selectedUser) return;
    
    try {
      await banUser(selectedUser.id, reason, duration);
      setShowBanModal(false);
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await unbanUser(userId);
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => !u.isBlocked).length,
    banned: users.filter(u => u.isBlocked).length,
    newThisMonth: users.filter(u => {
      const createdDate = new Date(u.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">حدث خطأ في تحميل البيانات</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
              <p className="text-gray-600">إدارة حسابات المستخدمين والصلاحيات</p>
            </div>
            <button
              onClick={handleCreateUser}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة مستخدم
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">المستخدمين النشطين</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">المستخدمين المحظورين</p>
                  <p className="text-2xl font-bold text-red-600">{stats.banned}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">جدد هذا الشهر</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.newThisMonth}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث بالاسم أو البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'banned')}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">جميع المستخدمين</option>
                  <option value="active">المستخدمين النشطين</option>
                  <option value="banned">المستخدمين المحظورين</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onBan={handleBanUser}
          onUnban={handleUnban}
        />

        {/* Modals */}
        {showUserModal && (
          <UserModal
            user={selectedUser}
            isEditing={isEditing}
            onSave={handleUserSave}
            onClose={() => setShowUserModal(false)}
          />
        )}

        {showBanModal && selectedUser && (
          <BanUserModal
            user={selectedUser}
            onConfirm={handleBanConfirm}
            onClose={() => setShowBanModal(false)}
          />
        )}
      </div>
    </div>
  );
}