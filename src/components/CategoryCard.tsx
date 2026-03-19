import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onClick, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'p-3 min-h-[100px]',
    md: 'p-4 min-h-[120px]',
    lg: 'p-6 min-h-[140px]'
  };

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 
        cursor-pointer group border border-gray-100 hover:border-blue-200
        hover:-translate-y-1 hover:scale-105
        ${sizeClasses[size]}
      `}
    >
      <div className="h-full flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className={`${iconSizes[size]} mb-2 group-hover:scale-110 transition-transform duration-200`}>
          {category.icon}
        </div>
        
        {/* Category Name */}
        <h3 className={`font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors ${textSizes[size]}`}>
          {category.name}
        </h3>
        
        {/* Listings Count */}
        <div className="flex items-center justify-center space-x-1 space-x-reverse">
          <span className="text-xs text-blue-600 font-medium">
            {category.listingsCount.toLocaleString('ar-SA')}
          </span>
          <span className="text-xs text-gray-500">
            إعلان
          </span>
        </div>
        
        {/* Description (only for larger sizes) */}
        {size === 'lg' && category.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            {category.description}
          </p>
        )}
        
        {/* Subcategories indicator */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mt-1">
            <span className="text-xs text-gray-400">
              {category.subcategories.length} قسم فرعي
            </span>
          </div>
        )}
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </div>
  );
};

export default CategoryCard;