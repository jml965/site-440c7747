import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Tag, Grid3X3, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  error,
  placeholder = 'اختر القسم',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find selected category
  useEffect(() => {
    const category = CATEGORIES.find(cat => cat.id === value);
    setSelectedCategory(category?.name || '');
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter categories based on search term
  const filteredCategories = CATEGORIES.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.keywords?.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCategorySelect = (categoryId: string) => {
    onChange(categoryId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-right border rounded-xl flex items-center justify-between
          transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error 
            ? 'border-red-300 bg-red-50' 
            : isOpen 
            ? 'border-blue-300 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-3">
          {value ? (
            <>
              <span className="text-2xl">
                {CATEGORIES.find(cat => cat.id === value)?.icon}
              </span>
              <span className="font-medium text-gray-900">
                {selectedCategory}
              </span>
            </>
          ) : (
            <>
              <Tag className={`w-5 h-5 ${error ? 'text-red-500' : 'text-gray-400'}`} />
              <span className={`${error ? 'text-red-500' : 'text-gray-500'}`}>
                {placeholder}
              </span>
            </>
          )}
        </div>
        
        <ChevronDown className={`
          w-5 h-5 transition-transform duration-200
          ${isOpen ? 'rotate-180' : ''}
          ${error ? 'text-red-500' : 'text-gray-400'}
        `} />
      </button>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="ابحث في الأقسام..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Grid3X3 className="w-4 h-4" />
                {filteredCategories.length} قسم
              </span>
              {searchTerm && (
                <span>
                  نتائج البحث عن "{searchTerm}"
                </span>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              <div className="p-2">
                {filteredCategories.map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`
                      w-full p-3 rounded-lg text-right flex items-center gap-3
                      transition-all duration-150 group
                      ${value === category.id 
                        ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {category.icon}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="text-xs text-gray-500 mt-0.5 truncate">
                          {category.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Item Count Badge */}
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${value === category.id 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }
                    `}>
                      {category.itemCount || 0}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="p-8 text-center text-gray-500">
                <Grid3X3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium mb-1">لا توجد أقسام مطابقة</p>
                <p className="text-sm">
                  جرب البحث بكلمة أخرى أو تصفح جميع الأقسام
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  مسح البحث
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              لا تجد القسم المناسب؟ 
              <button className="text-blue-600 hover:text-blue-800 font-medium mr-1">
                اقترح قسماً جديداً
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;