import React, { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Image, MoreVertical, TrendingUp } from 'lucide-react';
import type { Category } from '../../types';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onToggleStatus: (categoryId: string) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete, onToggleStatus }: CategoryTableProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'listingCount' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Sort categories
  const sortedCategories = [...categories].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'listingCount':
        aValue = a.listingCount || 0;
        bValue = b.listingCount || 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: 'name' | 'listingCount' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleDropdown = (categoryId: string) => {
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  const handleAction = (action: string, category: Category) => {
    setActiveDropdown(null);
    
    switch (action) {
      case 'edit':
        onEdit(category);
        break;
      case 'delete':
        onDelete(category.id);
        break;
      case 'toggle':
        onToggleStatus(category.id);
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Riyadh'
    });
  };

  if (categories.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Eye className="w-8 h-8" />
        </div>
        <p>لا توجد أقسام للعرض</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-right py-4 px-6 font-semibold text-gray-900">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                اسم القسم
                <div className="flex flex-col">
                  <div className={`w-2 h-1 ${sortBy === 'name' && sortOrder === 'asc' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-1 ${sortBy === 'name' && sortOrder === 'desc' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>
              </button>
            </th>
            <th className="text-center py-4 px-6 font-semibold text-gray-900">الصورة</th>
            <th className="text-center py-4 px-6 font-semibold text-gray-900">
              <button
                onClick={() => handleSort('listingCount')}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors mx-auto"
              >
                عدد الإعلانات
                <div className="flex flex-col">
                  <div className={`w-2 h-1 ${sortBy === 'listingCount' && sortOrder === 'asc' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-1 ${sortBy === 'listingCount' && sortOrder === 'desc' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>
              </button>
            </th>
            <th className="text-center py-4 px-6 font-semibold text-gray-900">الحالة</th>
            <th className="text-center py-4 px-6 font-semibold text-gray-900">
              <button
                onClick={() => handleSort('createdAt')}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors mx-auto"
              >
                تاريخ الإنشاء
                <div className="flex flex-col">
                  <div className={`w-2 h-1 ${sortBy === 'createdAt' && sortOrder === 'asc' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-1 ${sortBy === 'createdAt' && sortOrder === 'desc' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>
              </button>
            </th>
            <th className="text-center py-4 px-6 font-semibold text-gray-900">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.map((category, index) => (
            <tr 
              key={category.id} 
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}
            >
              {/* Category Name */}
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <TrendingUp className={`w-5 h-5 ${category.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.nameEn}</p>
                  </div>
                </div>
              </td>

              {/* Category Image */}
              <td className="py-4 px-6 text-center">
                <div className="flex justify-center">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                      <Image className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
              </td>

              {/* Listing Count */}
              <td className="py-4 px-6 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <TrendingUp className="w-4 h-4" />
                  {category.listingCount || 0}
                </span>
              </td>

              {/* Status */}
              <td className="py-4 px-6 text-center">
                <button
                  onClick={() => onToggleStatus(category.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    category.isActive
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {category.isActive ? (
                    <>
                      <Eye className="w-4 h-4" />
                      نشط
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      غير نشط
                    </>
                  )}
                </button>
              </td>

              {/* Created Date */}
              <td className="py-4 px-6 text-center text-sm text-gray-600">
                {formatDate(category.createdAt)}
              </td>

              {/* Actions */}
              <td className="py-4 px-6 text-center relative">
                <button
                  onClick={() => toggleDropdown(category.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {activeDropdown === category.id && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                    <div className="py-2">
                      <button
                        onClick={() => handleAction('edit', category)}
                        className="flex items-center gap-3 w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                        تعديل
                      </button>
                      
                      <button
                        onClick={() => handleAction('toggle', category)}
                        className="flex items-center gap-3 w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        {category.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            إلغاء التفعيل
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            تفعيل
                          </>
                        )}
                      </button>

                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <button
                        onClick={() => handleAction('delete', category)}
                        className="flex items-center gap-3 w-full px-4 py-2 text-right hover:bg-red-50 transition-colors text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}