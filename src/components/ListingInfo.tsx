import React from 'react';
import { Calendar, MapPin, Tag, Eye, Heart, Share2 } from 'lucide-react';
import type { Listing } from '../types';
import { formatPrice, formatDate, getConditionText } from '../utils/helpers';

interface ListingInfoProps {
  listing: Listing;
  onToggleFavorite: () => void;
  onShare: () => void;
  isFavorite: boolean;
}

export default function ListingInfo({ listing, onToggleFavorite, onShare, isFavorite }: ListingInfoProps) {
  const conditionColors = {
    new: 'bg-green-100 text-green-800',
    'like-new': 'bg-blue-100 text-blue-800',
    good: 'bg-yellow-100 text-yellow-800',
    fair: 'bg-orange-100 text-orange-800',
    poor: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header with Price and Actions */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {listing.title}
          </h1>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatPrice(listing.price)}
          </div>
          {listing.isNegotiable && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              قابل للتفاوض
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onToggleFavorite}
            className={`p-3 rounded-full border transition-all ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={onShare}
            className="p-3 rounded-full border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 transition-all"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">الحالة</div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            conditionColors[listing.condition as keyof typeof conditionColors] || 'bg-gray-100 text-gray-700'
          }`}>
            {getConditionText(listing.condition)}
          </span>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">المدينة</div>
          <div className="flex items-center justify-center gap-1 text-sm font-medium">
            <MapPin size={14} className="text-gray-400" />
            {listing.city?.name || 'غير محدد'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">تاريخ النشر</div>
          <div className="flex items-center justify-center gap-1 text-sm font-medium">
            <Calendar size={14} className="text-gray-400" />
            {formatDate(listing.createdAt)}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">المشاهدات</div>
          <div className="flex items-center justify-center gap-1 text-sm font-medium">
            <Eye size={14} className="text-gray-400" />
            {listing.viewsCount || 0}
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Tag size={16} />
          <span>القسم:</span>
          <span className="font-medium text-blue-600">
            {listing.category?.name || 'غير محدد'}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          الوصف
        </h3>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {listing.description || 'لم يتم إضافة وصف لهذا الإعلان.'}
          </p>
        </div>
      </div>

      {/* Additional Details */}
      {listing.specifications && Object.keys(listing.specifications).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            تفاصيل إضافية
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(listing.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-gray-600 font-medium">{key}:</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Badge */}
      {listing.status !== 'active' && (
        <div className="mt-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            listing.status === 'sold'
              ? 'bg-red-100 text-red-800'
              : listing.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {listing.status === 'sold' && '🔒 تم البيع'}
            {listing.status === 'pending' && '⏳ قيد المراجعة'}
            {listing.status === 'inactive' && '❌ غير نشط'}
          </span>
        </div>
      )}

      {/* Featured Badge */}
      {listing.isFeatured && (
        <div className="mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            ⭐ إعلان مميز
          </span>
        </div>
      )}
    </div>
  );
}