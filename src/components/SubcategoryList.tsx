import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Subcategory } from '../types';

interface SubcategoryListProps {
  subcategories: Subcategory[];
  selectedSubcategory?: string;
  onSubcategorySelect: (slug: string) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  subcategories,
  selectedSubcategory,
  onSubcategorySelect
}) => {
  const [showAll, setShowAll] = useState(false);
  
  const visibleSubcategories = showAll ? subcategories : subcategories.slice(0, 8);
  const hasMore = subcategories.length > 8;

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" dir="rtl">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        الأقسام الفرعية
      </h3>
      
      {/* All Categories Button */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => onSubcategorySelect('')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            !selectedSubcategory
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          جميع الأقسام
        </button>
        
        {visibleSubcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            onClick={() => onSubcategorySelect(subcategory.slug)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 space-x-reverse ${
              selectedSubcategory === subcategory.slug
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
            }`}
          >
            <span>{subcategory.name}</span>
            {subcategory.listingsCount && (
              <span className="text-xs opacity-80">
                ({subcategory.listingsCount.toLocaleString('ar-SA')})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center space-x-2 space-x-reverse text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            <span>{showAll ? 'إظهار أقل' : 'إظهار المزيد'}</span>
            {showAll ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubcategoryList;