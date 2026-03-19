import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import type { Category } from '../../types';

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (categoryData: Partial<Category>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CategoryForm({ category, onSubmit, onCancel, loading = false }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    image: '',
    icon: '',
    color: '#3B82F6',
    sortOrder: 0,
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form with category data if editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        nameEn: category.nameEn || '',
        description: category.description || '',
        descriptionEn: category.descriptionEn || '',
        image: category.image || '',
        icon: category.icon || '',
        color: category.color || '#3B82F6',
        sortOrder: category.sortOrder || 0,
        isActive: category.isActive ?? true,
        seoTitle: category.seoTitle || '',
        seoDescription: category.seoDescription || '',
        seoKeywords: category.seoKeywords || ''
      });
      setImagePreview(category.image || '');
    }
  }, [category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم القسم باللغة العربية مطلوب';
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = 'اسم القسم باللغة الإنجليزية مطلوب';
    }

    if (formData.sortOrder < 0) {
      newErrors.sortOrder = 'ترتيب القسم يجب أن يكون رقم موجب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const predefinedColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280'  // Gray
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          المعلومات الأساسية
        </h3>

        {/* Arabic Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            اسم القسم (عربي) *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-right ${
              errors.name ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="مثال: السيارات"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* English Name */}
        <div>
          <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-2">
            اسم القسم (إنجليزي) *
          </label>
          <input
            type="text"
            id="nameEn"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left ${
              errors.nameEn ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Example: Cars"
            dir="ltr"
          />
          {errors.nameEn && <p className="mt-1 text-sm text-red-600">{errors.nameEn}</p>}
        </div>

        {/* Arabic Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            الوصف (عربي)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-right"
            placeholder="وصف مختصر للقسم..."
          />
        </div>

        {/* English Description */}
        <div>
          <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-2">
            الوصف (إنجليزي)
          </label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            value={formData.descriptionEn}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-left"
            placeholder="Brief description of the category..."
            dir="ltr"
          />
        </div>
      </div>

      {/* Visual Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          الإعدادات المرئية
        </h3>

        {/* Category Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صورة القسم
          </label>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                رفع صورة
              </label>
            </div>
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            لون القسم
          </label>
          <div className="flex flex-wrap gap-3">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color }))}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={formData.color}
            onChange={handleInputChange}
            name="color"
            className="mt-2 w-16 h-10 rounded-lg border border-gray-200"
          />
        </div>

        {/* Icon */}
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
            رمز القسم (اختياري)
          </label>
          <input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left"
            placeholder="lucide icon name (e.g. car, home, phone)"
            dir="ltr"
          />
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          الإعدادات
        </h3>

        {/* Sort Order */}
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
            ترتيب العرض
          </label>
          <input
            type="number"
            id="sortOrder"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleInputChange}
            min="0"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-right ${
              errors.sortOrder ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="0"
          />
          {errors.sortOrder && <p className="mt-1 text-sm text-red-600">{errors.sortOrder}</p>}
          <p className="mt-1 text-sm text-gray-600">الأقسام ذات الترتيب الأقل تظهر أولاً</p>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex items-center gap-2">
              {formData.isActive ? (
                <>
                  <Eye className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">القسم نشط</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">القسم غير نشط</span>
                </>
              )}
            </div>
          </label>
          <p className="mt-1 mr-8 text-sm text-gray-600">
            الأقسام غير النشطة لن تظهر للمستخدمين
          </p>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          إعدادات SEO
        </h3>

        {/* SEO Title */}
        <div>
          <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
            عنوان SEO
          </label>
          <input
            type="text"
            id="seoTitle"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleInputChange}
            maxLength={60}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-right"
            placeholder="عنوان صفحة القسم في محركات البحث"
          />
          <p className="mt-1 text-sm text-gray-600">{formData.seoTitle.length}/60 حرف</p>
        </div>

        {/* SEO Description */}
        <div>
          <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
            وصف SEO
          </label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            value={formData.seoDescription}
            onChange={handleInputChange}
            maxLength={160}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-right"
            placeholder="وصف صفحة القسم في محركات البحث"
          />
          <p className="mt-1 text-sm text-gray-600">{formData.seoDescription.length}/160 حرف</p>
        </div>

        {/* SEO Keywords */}
        <div>
          <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-2">
            الكلمات المفتاحية
          </label>
          <input
            type="text"
            id="seoKeywords"
            name="seoKeywords"
            value={formData.seoKeywords}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-right"
            placeholder="كلمات مفتاحية مفصولة بفواصل"
          />
          <p className="mt-1 text-sm text-gray-600">افصل الكلمات بفواصل (،)</p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              جاري الحفظ...
            </div>
          ) : (
            category ? 'تحديث القسم' : 'إضافة القسم'
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}