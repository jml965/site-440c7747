import React, { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Package, Tag, Search } from 'lucide-react';
import { FilterOptions } from '../types';

interface ListingFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onClose: () => void;
}

const ListingFilter: React.FC<ListingFilterProps> = ({ 
  filters, 
  onFilterChange, 
  onClose 
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const categories = [
    { id: '1', name: 'سيارات' },
    { id: '2', name: 'عقارات' },
    { id: '3', name: 'جوالات' },
    { id: '4', name: 'إلكترونيات' },
    { id: '5', name: 'أثاث' },
    { id: '6', name: 'أجهزة منزلية' },
    { id: '7', name: 'ملابس' },
    { id: '8', name: 'ساعات وإكسسوارات' },
    { id: '9', name: 'معدات وأدوات' },
    { id: '10', name: 'مستلزمات أطفال' },
    { id: '11', name: 'رياضة' },
    { id: '12', name: 'أخرى' }
  ];

  const cities = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 
    'تبوك', 'بريدة', 'خميس مشيط', 'حائل', 'نجران', 'الجبيل', 'الطائف', 
    'ينبع', 'أبها', 'عرعر', 'سكاكا', 'جيزان', 'القطيف', 'الأحساء'
  ];

  const conditions = [
    'جديد',
    'مستعمل بحالة ممتازة',
    'مستعمل بحالة جيدة',
    'مستعمل'
  ];

  const handleInputChange = (key: keyof FilterOptions, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      categoryId: undefined,
      city: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      condition: undefined,
      search: undefined
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200" dir="rtl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            تصفية النتائج
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Category Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Tag className="w-4 h-4 text-blue-600" />
              القسم
            </label>
            <select
              value={localFilters.categoryId || ''}
              onChange={(e) => handleInputChange('categoryId', e.target.value || undefined)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">جميع الأقسام</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <MapPin className="w-4 h-4 text-green-600" />
              المدينة
            </label>
            <select
              value={localFilters.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value || undefined)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">جميع المدن</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              نطاق السعر
            </label>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="من"
                value={localFilters.minPrice || ''}
                onChange={(e) => handleInputChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
              <input
                type="number"
                placeholder="إلى"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleInputChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Package className="w-4 h-4 text-purple-600" />
              الحالة
            </label>
            <select
              value={localFilters.condition || ''}
              onChange={(e) => handleInputChange('condition', e.target.value || undefined)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">جميع الحالات</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Filter */}
        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Search className="w-4 h-4 text-blue-600" />
            البحث في العنوان والوصف
          </label>
          <input
            type="text"
            placeholder="ابحث عن منتج معين..."
            value={localFilters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value || undefined)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            تطبيق الفلاتر
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              مسح جميع الفلاتر
            </button>
          )}
          
          <button
            onClick={onClose}
            className="sm:flex-none bg-white text-gray-700 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingFilter;