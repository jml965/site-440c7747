import React from 'react';
import { Star, MapPin, Calendar, Phone, Mail, MessageCircle, Shield, Eye, Package, Heart } from 'lucide-react';
import { User } from '../types';
import { formatDate } from '../utils/helpers';

interface ProfileCardProps {
  user: User;
  stats?: {
    totalListings: number;
    activeListings: number;
    soldItems: number;
    rating: number;
    reviewCount: number;
    responseRate: number;
    responseTime: string;
    profileViews: number;
  };
  isOwner?: boolean;
  onMessage?: () => void;
  onEdit?: () => void;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  stats,
  isOwner = false,
  onMessage,
  onEdit,
  className = ''
}) => {
  const defaultStats = {
    totalListings: 0,
    activeListings: 0,
    soldItems: 0,
    rating: 5.0,
    reviewCount: 0,
    responseRate: 95,
    responseTime: 'خلال ساعة',
    profileViews: 0,
    ...stats
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`} dir="rtl">
      {/* Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=200&fit=crop"
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
            loading="lazy"
          />
        </div>
        
        {/* Profile Picture */}
        <div className="absolute -bottom-12 right-6">
          <div className="relative">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              loading="lazy"
            />
            {user.isVerified && (
              <div className="absolute -bottom-1 -left-1 bg-green-500 text-white p-1 rounded-full">
                <Shield className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 p-6">
        {/* Basic Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            {user.isVerified && (
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <Star className="h-3 w-3 fill-current" />
                موثق
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{user.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>انضم في {formatDate(user.createdAt)}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(defaultStats.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-gray-900">{defaultStats.rating}</span>
            <span className="text-gray-600 text-sm">({defaultStats.reviewCount} تقييم)</span>
          </div>

          {user.bio && (
            <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{defaultStats.activeListings}</span>
            </div>
            <p className="text-xs text-gray-600">إعلان نشط</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{defaultStats.soldItems}</span>
            </div>
            <p className="text-xs text-gray-600">مبيعة مكتملة</p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MessageCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-600">{defaultStats.responseRate}%</span>
            </div>
            <p className="text-xs text-gray-600">معدل الرد</p>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-600">{defaultStats.responseTime}</span>
            </div>
            <p className="text-xs text-gray-600">وقت الرد</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          {user.phone && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">{user.phone}</span>
            </div>
          )}
          
          {user.email && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">{user.email}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isOwner && onMessage && (
            <button
              onClick={onMessage}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              إرسال رسالة
            </button>
          )}
          
          {isOwner && onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="h-4 w-4" />
              تحرير الملف الشخصي
            </button>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">مؤشرات الثقة</h4>
          <div className="flex flex-wrap gap-2">
            {user.isVerified && (
              <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                <Shield className="h-3 w-3" />
                حساب موثق
              </div>
            )}
            
            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              <Phone className="h-3 w-3" />
              رقم مؤكد
            </div>
            
            <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              <Mail className="h-3 w-3" />
              إيميل مؤكد
            </div>
            
            {defaultStats.profileViews > 100 && (
              <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                <Eye className="h-3 w-3" />
                ملف شائع
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;