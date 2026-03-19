import React from 'react';
import { User } from '../../types';
import { UserActions } from './UserActions';
import { Mail, Phone, Calendar, Shield, ShieldOff, User as UserIcon } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onBan: (user: User) => void;
  onUnban: (userId: string) => void;
}

export function UserTable({ users, onEdit, onBan, onUnban }: UserTableProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isBlocked: boolean) => {
    return isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg border">
        <div className="p-12 text-center">
          <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد مستخدمين</h3>
          <p className="text-gray-600">لم يتم العثور على أي مستخدمين يطابقون معايير البحث</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">المستخدم</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">التواصل</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">الدور</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">الحالة</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">تاريخ التسجيل</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role === 'admin' && <Shield className="w-3 h-3" />}
                    {user.role === 'admin' ? 'مدير' : user.role === 'moderator' ? 'مشرف' : 'مستخدم'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isBlocked)}`}>
                    {user.isBlocked ? (
                      <>
                        <ShieldOff className="w-3 h-3" />
                        محظور
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3" />
                        نشط
                      </>
                    )}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <UserActions
                    user={user}
                    onEdit={() => onEdit(user)}
                    onBan={() => onBan(user)}
                    onUnban={() => onUnban(user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {users.map((user) => (
          <div key={user.id} className="p-6 border-b last:border-b-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">{user.name}</div>
                  <div className="text-sm text-gray-600 mb-2">ID: {user.id}</div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role === 'admin' && <Shield className="w-3 h-3" />}
                      {user.role === 'admin' ? 'مدير' : user.role === 'moderator' ? 'مشرف' : 'مستخدم'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isBlocked)}`}>
                      {user.isBlocked ? 'محظور' : 'نشط'}
                    </span>
                  </div>
                </div>
              </div>
              <UserActions
                user={user}
                onEdit={() => onEdit(user)}
                onBan={() => onBan(user)}
                onUnban={() => onUnban(user.id)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {user.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                انضم في {formatDate(user.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}