import React, { useState, useEffect } from 'react';
import { ImagePlus, MapPin, Tag, DollarSign, FileText, Phone } from 'lucide-react';
import ImageUploader from './ImageUploader';
import CategorySelector from './CategorySelector';
import LocationSelector from './LocationSelector';
import { CreateListingData } from '../types';
import { CITIES, CONDITIONS } from '../utils/constants';

interface ListingFormProps {
  initialData?: Partial<CreateListingData>;
  onSubmit: (data: CreateListingData) => void;
  onCancel: () => void;
  loading?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  isEdit?: boolean;
}

const ListingForm: React.FC<ListingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitButtonText = 'نشر الإعلان',
  cancelButtonText = 'إلغاء',
  isEdit = false
}) => {
  const [formData, setFormData] = useState<CreateListingData>({
    title: '',
    description: '',
    price: 0,
    categoryId: '',
    city: '',
    condition: 'used',
    phone: '',
    images: [],
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'عنوان الإعلان مطلوب';
      } else if (formData.title.length < 5) {
        newErrors.title = 'عنوان الإعلان يجب أن يكون 5 أحرف على الأقل';
      }

      if (!formData.description.trim()) {
        newErrors.description = 'وصف المنتج مطلوب';
      } else if (formData.description.length < 20) {
        newErrors.description = 'الوصف يجب أن يكون 20 حرف على الأقل';
      }

      if (!formData.categoryId) {
        newErrors.categoryId = 'يرجى اختيار القسم';
      }
    }

    if (step === 2) {
      if (!formData.price || formData.price <= 0) {
        newErrors.price = 'يرجى إدخال سعر صحيح';
      }

      if (!formData.city) {
        newErrors.city = 'يرجى اختيار المدينة';
      }

      if (!formData.condition) {
        newErrors.condition = 'يرجى اختيار حالة المنتج';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'رقم الهاتف مطلوب';
      } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone)) {
        newErrors.phone = 'رقم الهاتف غير صحيح';
      }
    }

    if (step === 3) {
      if (!formData.images || formData.images.length === 0) {
        newErrors.images = 'يرجى إضافة صورة واحدة على الأقل';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps
    let isValid = true;
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        isValid = false;
        setCurrentStep(step);
        break;
      }
    }

    if (isValid) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof CreateListingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
              ${currentStep >= step 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {step}
            </div>
            {step < 3 && (
              <div className={`
                w-12 h-1 mx-2
                ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">المعلومات الأساسية</h2>
        <p className="text-gray-600">أدخل تفاصيل منتجك الأساسية</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline ml-2" />
          عنوان الإعلان *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="مثال: آيفون 13 برو ماكس 256 جيجا"
          className={`
            w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.title ? 'border-red-300' : 'border-gray-300'}
          `}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Tag className="w-4 h-4 inline ml-2" />
          القسم *
        </label>
        <CategorySelector
          value={formData.categoryId}
          onChange={(value) => updateField('categoryId', value)}
          error={errors.categoryId}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف المنتج *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="اكتب وصفاً مفصلاً عن المنتج، حالته، مميزاته، وأي تفاصيل مهمة أخرى"
          rows={5}
          className={`
            w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
            ${errors.description ? 'border-red-300' : 'border-gray-300'}
          `}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          <p className="text-gray-400 text-sm">
            {formData.description.length}/500 حرف
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">تفاصيل إضافية</h2>
        <p className="text-gray-600">أضف المعلومات المالية والتقنية</p>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="w-4 h-4 inline ml-2" />
          السعر (ريال سعودي) *
        </label>
        <input
          type="number"
          value={formData.price || ''}
          onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
          placeholder="0"
          min="0"
          step="0.01"
          className={`
            w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.price ? 'border-red-300' : 'border-gray-300'}
          `}
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline ml-2" />
          المدينة *
        </label>
        <LocationSelector
          value={formData.city}
          onChange={(value) => updateField('city', value)}
          error={errors.city}
        />
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          حالة المنتج *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CONDITIONS.map((condition) => (
            <button
              key={condition.value}
              type="button"
              onClick={() => updateField('condition', condition.value)}
              className={`
                p-3 rounded-xl border text-center transition-all
                ${formData.condition === condition.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-2xl mb-1">{condition.icon}</div>
              <div className="font-medium text-sm">{condition.label}</div>
            </button>
          ))}
        </div>
        {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline ml-2" />
          رقم الهاتف *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="05XXXXXXXX"
          className={`
            w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.phone ? 'border-red-300' : 'border-gray-300'}
          `}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">صور المنتج</h2>
        <p className="text-gray-600">أضف صوراً واضحة لجذب المشترين</p>
      </div>

      <ImageUploader
        images={formData.images}
        onChange={(images) => updateField('images', images)}
        error={errors.images}
        maxImages={10}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {renderStepIndicator()}
      
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              السابق
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelButtonText}
          </button>
        </div>

        <div>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              التالي
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 min-w-[120px]"
            >
              {loading ? 'جاري النشر...' : submitButtonText}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ListingForm;