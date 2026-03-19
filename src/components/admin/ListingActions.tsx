import React, { useState } from 'react';
import { Eye, Edit, Trash2, Star, StarOff, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { Listing } from '../../types';

interface ListingActionsProps {
  listing: Listing;
  onReview: () => void;
  onDelete: () => void;
  onToggleFeatured: () => Promise<void>;
}

export default function ListingActions({ listing, onReview, onDelete, onToggleFeatured }: ListingActionsProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleFeatured = async () => {
    setIsUpdating(true);
    try {
      await onToggleFeatured();
    } finally {
      setIsUpdating(false);
      setShowDropdown(false);
    }
  };

  const viewListing = () => {
    window.open(`/listing/${listing.id}`, '_blank');
  };

  return (
    <div className="relative" dir="rtl">
      <div className="flex items-center gap-2">
        {/* Quick Actions */}
        <button
          onClick={viewListing}
          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
          title="عرض الإعلان"
        >
          <Eye className="w-4 h-4" />
        </button>

        {listing.status === 'pending' && (
          <button
            onClick={onReview}
            className="p-1 text-gray-600 hover:text-green-600 transition-colors"
            title="مراجعة الإعلان"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}

        {/* More Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
            title="المزيد من الخيارات"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={viewListing}
                  className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <Eye className="w-4 h-4" />
                  عرض التفاصيل
                </button>

                {listing.status === 'pending' && (
                  <button
                    onClick={() => {
                      onReview();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <CheckCircle className="w-4 h-4" />
                    مراجعة الإعلان
                  </button>
                )}

                <button
                  onClick={handleToggleFeatured}
                  disabled={isUpdating}
                  className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {listing.featured ? (
                    <>
                      <StarOff className="w-4 h-4" />
                      إلغاء التمييز
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      جعل مميز
                    </>
                  )}
                  {isUpdating && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600 mr-2" />
                  )}
                </button>

                <hr className="my-1" />

                <button
                  onClick={() => {
                    onDelete();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف الإعلان
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-1">
        {listing.status === 'approved' && (
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600">موافق عليه</span>
          </div>
        )}
        {listing.status === 'rejected' && (
          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" />
            <span className="text-xs text-red-600">مرفوض</span>
          </div>
        )}
        {listing.status === 'pending' && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-xs text-yellow-600">قيد المراجعة</span>
          </div>
        )}
      </div>
    </div>
  );
}