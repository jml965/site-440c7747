import { useState, useEffect, useCallback } from 'react';
import type { Category } from '../types';
import { api } from '../services/api';

interface UseAdminCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  createCategory: (categoryData: Partial<Category>) => Promise<Category>;
  updateCategory: (id: string, categoryData: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  toggleCategoryStatus: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesStats: () => {
    total: number;
    active: number;
    inactive: number;
    totalListings: number;
  };
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'السيارات',
    nameEn: 'Cars',
    slug: 'cars',
    description: 'جميع أنواع السيارات المستعملة',
    descriptionEn: 'All types of used cars',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop',
    icon: 'car',
    color: '#3B82F6',
    sortOrder: 1,
    isActive: true,
    listingCount: 245,
    seoTitle: 'سيارات مستعملة للبيع',
    seoDescription: 'اكتشف مجموعة واسعة من السيارات المستعملة بأفضل الأسعار',
    seoKeywords: 'سيارات، سيارات مستعملة، بيع سيارات',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'العقارات',
    nameEn: 'Real Estate',
    slug: 'real-estate',
    description: 'شقق وفيلل ومكاتب للبيع والإيجار',
    descriptionEn: 'Apartments, villas and offices for sale and rent',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    icon: 'home',
    color: '#10B981',
    sortOrder: 2,
    isActive: true,
    listingCount: 189,
    seoTitle: 'عقارات للبيع والإيجار',
    seoDescription: 'أفضل العروض العقارية من شقق وفيلل ومكاتب',
    seoKeywords: 'عقارات، شقق، فيلل، بيع، إيجار',
    createdAt: '2024-01-15T10:05:00Z',
    updatedAt: '2024-01-15T10:05:00Z'
  },
  {
    id: '3',
    name: 'الجوالات',
    nameEn: 'Mobile Phones',
    slug: 'mobile-phones',
    description: 'هواتف ذكية وأجهزة لوحية',
    descriptionEn: 'Smartphones and tablets',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    icon: 'smartphone',
    color: '#8B5CF6',
    sortOrder: 3,
    isActive: true,
    listingCount: 312,
    seoTitle: 'جوالات مستعملة للبيع',
    seoDescription: 'أفضل الهواتف الذكية المستعملة بأسعار مناسبة',
    seoKeywords: 'جوالات، هواتف ذكية، آيفون، سامسونج',
    createdAt: '2024-01-15T10:10:00Z',
    updatedAt: '2024-01-15T10:10:00Z'
  },
  {
    id: '4',
    name: 'الإلكترونيات',
    nameEn: 'Electronics',
    slug: 'electronics',
    description: 'أجهزة إلكترونية متنوعة',
    descriptionEn: 'Various electronic devices',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    icon: 'monitor',
    color: '#F59E0B',
    sortOrder: 4,
    isActive: true,
    listingCount: 156,
    seoTitle: 'إلكترونيات مستعملة للبيع',
    seoDescription: 'أجهزة إلكترونية مستعملة بحالة ممتازة',
    seoKeywords: 'إلكترونيات، أجهزة، تلفزيون، كمبيوتر',
    createdAt: '2024-01-15T10:15:00Z',
    updatedAt: '2024-01-15T10:15:00Z'
  },
  {
    id: '5',
    name: 'الأثاث',
    nameEn: 'Furniture',
    slug: 'furniture',
    description: 'أثاث منزلي ومكتبي',
    descriptionEn: 'Home and office furniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    icon: 'armchair',
    color: '#EF4444',
    sortOrder: 5,
    isActive: true,
    listingCount: 98,
    seoTitle: 'أثاث مستعمل للبيع',
    seoDescription: 'أثاث منزلي ومكتبي مستعمل بجودة عالية',
    seoKeywords: 'أثاث، أثاث منزلي، كراسي، طاولات',
    createdAt: '2024-01-15T10:20:00Z',
    updatedAt: '2024-01-15T10:20:00Z'
  },
  {
    id: '6',
    name: 'الأجهزة المنزلية',
    nameEn: 'Home Appliances',
    slug: 'home-appliances',
    description: 'أجهزة كهربائية منزلية',
    descriptionEn: 'Home electrical appliances',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    icon: 'refrigerator',
    color: '#06B6D4',
    sortOrder: 6,
    isActive: false,
    listingCount: 67,
    seoTitle: 'أجهزة منزلية مستعملة',
    seoDescription: 'أجهزة منزلية مستعملة بحالة ممتازة وأسعار مناسبة',
    seoKeywords: 'أجهزة منزلية، ثلاجة، غسالة، مكنسة',
    createdAt: '2024-01-15T10:25:00Z',
    updatedAt: '2024-01-15T10:25:00Z'
  },
  {
    id: '7',
    name: 'الملابس',
    nameEn: 'Clothing',
    slug: 'clothing',
    description: 'ملابس رجالية ونسائية وأطفال',
    descriptionEn: 'Men, women and children clothing',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    icon: 'shirt',
    color: '#EC4899',
    sortOrder: 7,
    isActive: true,
    listingCount: 134,
    seoTitle: 'ملابس مستعملة للبيع',
    seoDescription: 'ملابس مستعملة بحالة جيدة وأسعار مخفضة',
    seoKeywords: 'ملابس، أزياء، ملابس رجالي، ملابس نسائي',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '8',
    name: 'الساعات والإكسسوارات',
    nameEn: 'Watches & Accessories',
    slug: 'watches-accessories',
    description: 'ساعات وإكسسوارات أنيقة',
    descriptionEn: 'Elegant watches and accessories',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
    icon: 'watch',
    color: '#84CC16',
    sortOrder: 8,
    isActive: true,
    listingCount: 89,
    seoTitle: 'ساعات وإكسسوارات مستعملة',
    seoDescription: 'ساعات فاخرة وإكسسوارات أنيقة بأسعار مميزة',
    seoKeywords: 'ساعات، إكسسوارات، مجوهرات، ساعات فاخرة',
    createdAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T10:35:00Z'
  }
];

export function useAdminCategories(): UseAdminCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be:
      // const response = await api.get('/admin/categories');
      // setCategories(response.data);
      
      setCategories(MOCK_CATEGORIES);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('فشل في تحميل الأقسام');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create category
  const createCategory = useCallback(async (categoryData: Partial<Category>): Promise<Category> => {
    try {
      setLoading(true);
      
      // Generate new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryData.name || '',
        nameEn: categoryData.nameEn || '',
        slug: (categoryData.nameEn || '').toLowerCase().replace(/\s+/g, '-'),
        description: categoryData.description || '',
        descriptionEn: categoryData.descriptionEn || '',
        image: categoryData.image || '',
        icon: categoryData.icon || 'folder',
        color: categoryData.color || '#3B82F6',
        sortOrder: categoryData.sortOrder || 0,
        isActive: categoryData.isActive ?? true,
        listingCount: 0,
        seoTitle: categoryData.seoTitle || '',
        seoDescription: categoryData.seoDescription || '',
        seoKeywords: categoryData.seoKeywords || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be:
      // const response = await api.post('/admin/categories', newCategory);
      // const createdCategory = response.data;
      
      setCategories(prev => [newCategory, ...prev]);
      return newCategory;
    } catch (err) {
      console.error('Error creating category:', err);
      throw new Error('فشل في إنشاء القسم');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update category
  const updateCategory = useCallback(async (id: string, categoryData: Partial<Category>): Promise<Category> => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCategories(prev => 
        prev.map(category => 
          category.id === id 
            ? { 
                ...category, 
                ...categoryData,
                slug: categoryData.nameEn ? categoryData.nameEn.toLowerCase().replace(/\s+/g, '-') : category.slug,
                updatedAt: new Date().toISOString() 
              }
            : category
        )
      );
      
      const updatedCategory = categories.find(c => c.id === id);
      if (!updatedCategory) {
        throw new Error('Category not found');
      }
      
      return { ...updatedCategory, ...categoryData };
    } catch (err) {
      console.error('Error updating category:', err);
      throw new Error('فشل في تحديث القسم');
    } finally {
      setLoading(false);
    }
  }, [categories]);

  // Delete category
  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be:
      // await api.delete(`/admin/categories/${id}`);
      
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      throw new Error('فشل في حذف القسم');
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle category status
  const toggleCategoryStatus = useCallback(async (id: string): Promise<void> => {
    try {
      const category = categories.find(c => c.id === id);
      if (!category) {
        throw new Error('Category not found');
      }

      await updateCategory(id, { isActive: !category.isActive });
    } catch (err) {
      console.error('Error toggling category status:', err);
      throw new Error('فشل في تغيير حالة القسم');
    }
  }, [categories, updateCategory]);

  // Refresh categories
  const refreshCategories = useCallback(async (): Promise<void> => {
    await fetchCategories();
  }, [fetchCategories]);

  // Get category by ID
  const getCategoryById = useCallback((id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  }, [categories]);

  // Get categories statistics
  const getCategoriesStats = useCallback(() => {
    return {
      total: categories.length,
      active: categories.filter(c => c.isActive).length,
      inactive: categories.filter(c => !c.isActive).length,
      totalListings: categories.reduce((sum, c) => sum + (c.listingCount || 0), 0)
    };
  }, [categories]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    refreshCategories,
    getCategoryById,
    getCategoriesStats
  };
}