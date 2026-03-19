import React, { useState } from 'react';
import { User } from '../../types';
import { MoreVertical, Edit, Ban, Shield, Eye, MessageSquare, Activity } from 'lucide-react';

interface UserActionsProps {
  user: User;
  onEdit: () => void;
  onBan: () => void;
  onUnban: () => void;
}

export function UserActions({ user, onEdit, onBan, onUnban }: UserActionsProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setShowDropdown(false);
  };

  const handleViewProfile = () => {
    // Navigate to user profile page
    window.open(`/profile/${user.id}`, '_blank');
  };

  const handleViewActivity = () => {
    // Navigate to user activity page
    console.log('View user activity:', user.id);
  };

  const handleSendMessage = () => {
    // Navigate to messaging
    console.log('Send message to user:', user.id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {/* View Profile */}
              <button
                onClick={() => handleAction(handleViewProfile)}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                عرض الملف الشخصي
              </button>

              {/* View Activity */}
              <button
                onClick={() => handleAction(handleViewActivity)}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Activity className="w-4 h-4" />
                عرض النشاط
              </button>

              {/* Send Message */}
              <button
                onClick={() => handleAction(handleSendMessage)}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                إرسال رسالة
              </button>

              <div className="border-t border-gray-100 my-1" />

              {/* Edit */}
              <button
                onClick={() => handleAction(onEdit)}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                تعديل البيانات
              </button>

              {/* Ban/Unban */}
              {user.isBlocked ? (
                <button
                  onClick={() => handleAction(onUnban)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  إلغاء الحظر
                </button>
              ) : (
                <button
                  onClick={() => handleAction(onBan)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  حظر المستخدم
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}