import React, { useState } from 'react';
import { ChevronDown, MapPin, DollarSign, Calendar, Tag, X } from 'lucide-react';
import { Category } from '../types';

export interface CategoryFilterState {
  priceRange: {
    min: number;
    max: number;
  };
  city: string;
  condition: string;
  sortBy: string;
  dateRange: string;
}

interface CategoryFilterProps {
  filters: CategoryFilterState;
  onFiltersChange: (filters: CategoryFilterState) => void;
  category?: Category | null;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  filters,
  onFiltersChange,
  category
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['price', 'location', 'condition']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilters = (updates: Partial<CategoryFilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const resetFilters = () => {
    onFiltersChange({
      priceRange: { min: 0, max: 0 },
      city: '',
      condition: '',
      sortBy: 'newest',
      dateRange: ''
    });
  };

  const hasActiveFilters = 
    filters.priceRange.min > 0 || 
    filters.priceRange.max > 0 ||
    filters.city ||
    filters.condition ||
    filters.dateRange;

  const cities = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر',
    'تبوك', 'أبها', 'جازان', 'نجران', 'الطائف', 'حائل', 'القصيم', 'الجوف'
  ];

  const conditions = [
    'جديد',
    'مستعمل - ممتاز',
    'مستعمل - جيد جداً',
    'مستعمل - جيد',
    'مستعمل - مقبول'
  ];

  const sortOptions = [
    { value: 'newest', label: 'الأحدث' },
    { value: 'oldest', label: 'الأقدم' },
    { value: 'price_low', label: 'السعر: من الأقل للأعلى' },
    { value: 'price_high', label: 'السعر: من الأعلى للأقل' },
    { value: 'popular', label: 'الأكثر مشاهدة' }
  ];

  const dateRanges = [
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: '3months', label: 'آخر 3 شهور' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Tag className="h-5 w-5 ml-2" />
            الفلاتر
          </h3>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              <X className="h-4 w-4 ml-1" />
              مسح الكل
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ترتيب النتائج
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-3 hover:text-gray-900 transition-colors"
          >
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 ml-2" />
              نطاق السعر
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
              expandedSections.has('price') ? 'rotate-180' : ''
            }`} />
          </button>
          
          {expandedSections.has('price') && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">من</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.priceRange.min || ''}
                    onChange={(e) => updateFilters({ 
                      priceRange: { 
                        ...filters.priceRange, 
                        min: parseInt(e.target.value) || 0 
                      }
                    })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">إلى</label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={filters.priceRange.max || ''}
                    onChange={(e) => updateFilters({ 
                      priceRange: { 
                        ...filters.priceRange, 
                        max: parseInt(e.target.value) || 0 
                      }
                    })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              {/* Quick Price Ranges */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { min: 0, max: 100, label: 'أقل من 100' },
                  { min: 100, max: 500, label: '100 - 500' },
                  { min: 500, max: 1000, label: '500 - 1000' },
                  { min: 1000, max: 0, label: 'أكثر من 1000' }
                ].map((range) => (
                  <button
                    key={`${range.min}-${range.max}`}
                    onClick={() => updateFilters({ priceRange: { min: range.min, max: range.max } })}
                    className="text-xs p-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <button
            onClick={() => toggleSection('location')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-3 hover:text-gray-900 transition-colors"
          >
            <span className="flex items-center">
              <MapPin className="h-4 w-4 ml-2" />
              المدينة
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
              expandedSections.has('location') ? 'rotate-180' : ''
            }`} />
          </button>
          
          {expandedSections.has('location') && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {cities.map((city) => (
                  <label key={city} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="city"
                      value={city}
                      checked={filters.city === city}
                      onChange={(e) => updateFilters({ city: e.target.value })}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 ml-3"
                    />
                    <span className="text-sm text-gray-700">{city}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Condition */}
        <div>
          <button
            onClick={() => toggleSection('condition')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-3 hover:text-gray-900 transition-colors"
          >
            <span className="flex items-center">
              <Tag className="h-4 w-4 ml-2" />
              حالة المنتج
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
              expandedSections.has('condition') ? 'rotate-180' : ''
            }`} />
          </button>
          
          {expandedSections.has('condition') && (
            <div className="space-y-2">
              {conditions.map((condition) => (
                <label key={condition} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="condition"
                    value={condition}
                    checked={filters.condition === condition}
                    onChange={(e) => updateFilters({ condition: e.target.value })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 ml-3"
                  />
                  <span className="text-sm text-gray-700">{condition}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div>
          <button
            onClick={() => toggleSection('date')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-3 hover:text-gray-900 transition-colors"
          >
            <span className="flex items-center">
              <Calendar className="h-4 w-4 ml-2" />
              تاريخ النشر
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
              expandedSections.has('date') ? 'rotate-180' : ''
            }`} />
          </button>
          
          {expandedSections.has('date') && (
            <div className="space-y-2">
              {dateRanges.map((range) => (
                <label key={range.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="dateRange"
                    value={range.value}
                    checked={filters.dateRange === range.value}
                    onChange={(e) => updateFilters({ dateRange: e.target.value })}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 ml-3"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;