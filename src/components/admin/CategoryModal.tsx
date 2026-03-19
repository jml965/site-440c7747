import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import CategoryForm from './CategoryForm';
import type { Category } from '../../types';

interface CategoryModalProps {
  isOpen: boolean;
  category?: Category | null;
  onClose: () => void;
  onSubmit: (categoryData: Partial<Category>) => void;
  loading?: boolean;
}

export default function CategoryModal({ isOpen, category, onClose, onSubmit, loading = false }: CategoryModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="fixed inset-0" 
        onClick={handleBackdropClick}
        aria-label="إغلاق النافذة"
      />
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {category ? 'تعديل القسم' : 'إضافة قسم جديد'}
          </h2>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-xl transition-colors group"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            <CategoryForm
              category={category}
              onSubmit={onSubmit}
              onCancel={onClose}
              loading={loading}
            />
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">
                {category ? 'جاري تحديث القسم...' : 'جاري إضافة القسم...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}