import React from 'react';
import { ArrowUpDown, Clock, DollarSign, TrendingUp, Eye, Star } from 'lucide-react';

interface ListingSortProps {
  currentSort: string;
  onSortChange: (sortBy: string) => void;
}

const ListingSort: React.FC<ListingSortProps> = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    {
      value: 'newest',
      label: 'الأحدث',
      icon: Clock,
      description: 'الإعلانات الأحدث أولاً'
    },
    {
      value: 'oldest',
      label: 'الأقدم',
      icon: Clock,
      description: 'الإعلانات الأقدم أولاً'
    },
    {
      value: 'price-low-high',
      label: 'السعر: من الأقل للأعلى',
      icon: DollarSign,
      description: 'السعر من الأقل إلى الأعلى'
    },
    {
      value: 'price-high-low',
      label: 'السعر: من الأعلى للأقل',
      icon: DollarSign,
      description: 'السعر من الأعلى إلى الأقل'
    },
    {
      value: 'most-viewed',
      label: 'الأكثر مشاهدة',
      icon: Eye,
      description: 'الإعلانات الأكثر مشاهدة'
    },
    {
      value: 'featured',
      label: 'المميزة',
      icon: Star,
      description: 'الإعلانات المميزة أولاً'
    },
    {
      value: 'trending',
      label: 'الرائجة',
      icon: TrendingUp,
      description: 'الإعلانات الرائجة'
    }
  ];

  const currentSortOption = sortOptions.find(option => option.value === currentSort);
  
  return (
    <div className="relative group" dir="rtl">
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
        <ArrowUpDown className="w-4 h-4 text-gray-600" />
        <span className="text-gray-700">
          {currentSortOption ? currentSortOption.label : 'ترتيب حسب'}
        </span>
        <svg className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
            ترتيب النتائج حسب
          </div>
          
          {sortOptions.map((option) => {
            const IconComponent = option.icon;
            const isActive = currentSort === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-right transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`p-1.5 rounded-md ${
                  isActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <IconComponent className={`w-4 h-4 ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1 text-right">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </div>
                </div>
                
                {isActive && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListingSort;