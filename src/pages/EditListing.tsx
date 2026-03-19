import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import ListingForm from '../components/ListingForm';
import { useCreateListing } from '../hooks/useCreateListing';
import { CreateListingData, Listing } from '../types';
import { api } from '../services/api';

const EditListing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateListing, loading, error } = useCreateListing();
  const [listing, setListing] = useState<Listing | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        navigate('/profile');
        return;
      }

      try {
        setFetchLoading(true);
        const response = await api.get(`/listings/${id}`);
        
        // Check if user owns this listing
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (response.data.userId !== currentUser.id) {
          navigate('/profile');
          return;
        }
        
        setListing(response.data);
      } catch (err: any) {
        setFetchError(err.response?.data?.message || 'حدث خطأ في تحميل الإعلان');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  const handleSubmit = async (data: CreateListingData) => {
    if (!id) return;
    
    try {
      const updatedListing = await updateListing(id, data);
      if (updatedListing) {
        navigate(`/listing/${id}`);
      }
    } catch (err) {
      console.error('Error updating listing:', err);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setDeleteLoading(true);
      await api.delete(`/listings/${id}`);
      navigate('/profile?tab=listings');
    } catch (err: any) {
      console.error('Error deleting listing:', err);
      alert(err.response?.data?.message || 'حدث خطأ في حذف الإعلان');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    navigate(`/listing/${id}`);
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الإعلان...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">خطأ في التحميل</h2>
          <p className="text-gray-600 mb-4">{fetchError}</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للملف الشخصي
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Edit className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  تعديل الإعلان
                </h1>
                <p className="text-gray-600">
                  {listing.title}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              حذف الإعلان
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ListingForm
            initialData={{
              title: listing.title,
              description: listing.description,
              price: listing.price,
              categoryId: listing.categoryId,
              city: listing.city,
              condition: listing.condition as 'new' | 'used' | 'excellent' | 'good' | 'fair',
              phone: listing.phone,
              images: listing.images?.map(img => img.url) || []
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            submitButtonText="حفظ التغييرات"
            cancelButtonText="إلغاء"
            isEdit={true}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                تأكيد حذف الإعلان
              </h3>
              <p className="text-gray-600">
                هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'جاري الحذف...' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditListing;