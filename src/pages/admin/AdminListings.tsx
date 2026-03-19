import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import ListingTable from '../../components/admin/ListingTable';
import ReviewModal from '../../components/admin/ReviewModal';
import DeleteConfirm from '../../components/admin/DeleteConfirm';
import { useAdminListings } from '../../hooks/useAdminListings';
import { Listing } from '../../types';

export default function AdminListings() {
  const {
    listings,
    loading,
    totalCount,
    currentPage,
    totalPages,
    filters,
    searchTerm,
    setSearchTerm,
    setFilters,
    setCurrentPage,
    approveListing,
    rejectListing,
    deleteListing,
    toggleFeatured
  } = useAdminListings();

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingListingId, setDeletingListingId] = useState<string | null>(null);

  const handleReview = (listing: Listing) => {
    setSelectedListing(listing);
    setShowReviewModal(true);
  };

  const handleDelete = (listingId: string) => {
    setDeletingListingId(listingId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deletingListingId) {
      await deleteListing(deletingListingId);
      setDeletingListingId(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleReviewAction = async (action: 'approve' | 'reject', reason?: string) => {
    if (selectedListing) {
      if (action === 'approve') {
        await approveListing(selectedListing.id);
      } else {
        await rejectListing(selectedListing.id, reason || '');
      }
      setShowReviewModal(false);
      setSelectedListing(null);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'في انتظار المراجعة' },
    { value: 'approved', label: 'موافق عليها' },
    { value: 'rejected', label: 'مرفوضة' },
    { value: 'expired', label: 'منتهية الصلاحية' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'جميع الأقسام' },
    { value: 'cars', label: 'سيارات' },
    { value: 'real-estate', label: 'عقارات' },
    { value: 'electronics', label: 'إلكترونيات' },
    { value: 'furniture', label: 'أثاث' },
    { value: 'phones', label: 'جوالات' },
    { value: 'home-appliances', label: 'أجهزة منزلية' },
    { value: 'clothing', label: 'ملابس' },
    { value: 'sports', label: 'رياضة' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة الإعلانات</h1>
              <p className="text-gray-600">
                إجمالي الإعلانات: <span className="font-semibold text-blue-600">{totalCount}</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث في الإعلانات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حالة الإعلان
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                القسم
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة
              </label>
              <input
                type="text"
                placeholder="اختر المدينة"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="mr-3 text-gray-600">جاري تحميل الإعلانات...</span>
            </div>
          ) : (
            <ListingTable
              listings={listings}
              onReview={handleReview}
              onDelete={handleDelete}
              onToggleFeatured={toggleFeatured}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  عرض {((currentPage - 1) * 10) + 1} إلى {Math.min(currentPage * 10, totalCount)} من {totalCount} إعلان
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] < page - 1 && (
                          <span className="px-2 py-1 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm rounded ${
                            page === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))
                  }
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedListing && (
        <ReviewModal
          listing={selectedListing}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedListing(null);
          }}
          onAction={handleReviewAction}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteConfirm
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeletingListingId(null);
          }}
        />
      )}
    </div>
  );
}