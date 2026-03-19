import React from 'react';
import { User, Star, Shield, Calendar, MapPin, Phone } from 'lucide-react';
import type { User as UserType } from '../types';
import { formatDate } from '../utils/helpers';

interface SellerInfoProps {
  seller: UserType;
  listingsCount?: number;
}

export default function SellerInfo({ seller, listingsCount = 0 }: SellerInfoProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4) return 'text-yellow-600';
    if (rating >= 3) return 'text-orange-600';
    return 'text-red-600';
  };

  const getVerificationBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <Shield size={16} />
          <span className="text-sm font-medium">موثق</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Shield size={16} />
        <span className="text-sm">غير موثق</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        معلومات البائع
      </h3>

      {/* Seller Avatar and Basic Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          {seller.avatar ? (
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={24} className="text-gray-400" />
            </div>
          )}
          {seller.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-lg">
            {seller.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {getVerificationBadge(seller.isVerified || false)}
          </div>
          {seller.isOnline && (
            <span className="text-sm text-green-600 mt-1 block">
              متصل الآن
            </span>
          )}
        </div>
      </div>

      {/* Rating */}
      {seller.rating && seller.rating > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(seller.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className={`font-semibold ${getRatingColor(seller.rating)}`}>
              {seller.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({seller.reviewsCount || 0} تقييم)
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-gray-900">{listingsCount}</div>
          <div className="text-sm text-gray-600">إعلان نشط</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-gray-900">{seller.totalSales || 0}</div>
          <div className="text-sm text-gray-600">عملية بيع</div>
        </div>
      </div>

      {/* Seller Details */}
      <div className="space-y-3 mb-6">
        {seller.city && (
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin size={16} className="text-gray-400" />
            <span>المدينة: {seller.city.name}</span>
          </div>
        )}
        
        <div className="flex items-center gap-3 text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span>انضم في {formatDate(seller.createdAt)}</span>
        </div>
        
        {seller.phone && (
          <div className="flex items-center gap-3 text-gray-600">
            <Phone size={16} className="text-gray-400" />
            <span>رقم الهاتف متوفر</span>
          </div>
        )}
      </div>

      {/* Response Time */}
      {seller.averageResponseTime && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              متوسط وقت الرد
            </span>
            <span className="text-sm text-blue-700">
              {seller.averageResponseTime}
            </span>
          </div>
        </div>
      )}

      {/* Bio */}
      {seller.bio && (
        <div className="mb-6">
          <h5 className="font-medium text-gray-900 mb-2">نبذة عن البائع</h5>
          <p className="text-gray-600 text-sm leading-relaxed">
            {seller.bio}
          </p>
        </div>
      )}

      {/* Seller Badges */}
      <div className="flex flex-wrap gap-2">
        {seller.isVerified && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ موثق
          </span>
        )}
        {seller.isPremium && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            ⭐ عضو مميز
          </span>
        )}
        {(seller.totalSales || 0) > 10 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            🏆 بائع محترف
          </span>
        )}
        {seller.isOnline && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            🟢 متصل
          </span>
        )}
      </div>
    </div>
  );
}