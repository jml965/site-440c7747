import React from 'react';
import { Eye, Trash2, Star, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import ListingActions from './ListingActions';
import { Listing } from '../../types';
import { formatCurrency, formatDate, getCityNameInArabic, getCategoryNameInArabic } from '../../utils/helpers';

interface ListingTableProps {
  listings: Listing[];
  onReview: (listing: Listing) => void;
  onDelete: (listingId: string) => void;
  onToggleFeatured: (listingId: string) => Promise<void>;
}

export default function ListingTable({ listings, onReview, onDelete, onToggleFeatured }: ListingTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'موافق عليه';
      case 'rejected':
        return 'مرفوض';
      case 'pending':
        return 'في انتظار المراجعة';
      case 'expired':
        return 'منتهي الصلاحية';
      default:
        return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">لا توجد إعلانات</div>
        <p className="text-gray-400">لم يتم العثور على إعلانات مطابقة للفلاتر المحددة</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" dir="rtl">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإعلان
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              البائع
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              القسم
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              السعر
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المدينة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الحالة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              تاريخ النشر
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img
                      className="h-12 w-12 rounded-lg object-cover"
                      src={listing.images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'}
                      alt={listing.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="mr-4">
                    <div className="text-sm font-medium text-gray-900 max-w-48 truncate">
                      {listing.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {listing.featured && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs">مميز</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500">ID: {listing.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {listing.user?.name || 'غير معروف'}
                </div>
                <div className="text-sm text-gray-500">
                  {listing.user?.email || 'لا يوجد إيميل'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">
                  {getCategoryNameInArabic(listing.category)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(listing.price)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">
                  {getCityNameInArabic(listing.city)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {getStatusIcon(listing.status)}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStatusColor(listing.status)
                  }`}>
                    {getStatusText(listing.status)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(listing.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <ListingActions
                  listing={listing}
                  onReview={() => onReview(listing)}
                  onDelete={() => onDelete(listing.id)}
                  onToggleFeatured={() => onToggleFeatured(listing.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}