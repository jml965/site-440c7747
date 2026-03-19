import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ListingForm from '../components/ListingForm';
import { useCreateListing } from '../hooks/useCreateListing';
import { CreateListingData } from '../types';

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const { createListing, loading, error } = useCreateListing();

  const handleSubmit = async (data: CreateListingData) => {
    try {
      const newListing = await createListing(data);
      if (newListing) {
        navigate(`/listing/${newListing.id}`);
      }
    } catch (err) {
      console.error('Error creating listing:', err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              إضافة إعلان جديد
            </h1>
          </div>
          <p className="text-gray-600">
            أضف تفاصيل منتجك بدقة لتحصل على أفضل العروض
          </p>
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
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            submitButtonText="نشر الإعلان"
            cancelButtonText="إلغاء"
          />
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-xl p-6 mt-6">
          <h3 className="font-bold text-gray-900 mb-3">نصائح لإعلان ناجح:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              اكتب عنواناً واضحاً ومفصلاً
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              أضف صوراً عالية الجودة من زوايا مختلفة
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              اذكر جميع تفاصيل المنتج وحالته
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              حدد سعراً عادلاً ومناسباً للسوق
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              كن صادقاً في الوصف لتجنب المشاكل
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;