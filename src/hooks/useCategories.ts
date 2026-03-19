import { useState, useEffect } from 'react';
import { Category } from '../types';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock categories data with Arabic names and appropriate icons/colors
        const mockCategories: Category[] = [
          {
            id: 'cars',
            name: 'سيارات',
            slug: 'cars',
            description: 'سيارات مستعملة للبيع من جميع الماركات والموديلات',
            icon: '🚗',
            color: '#DC2626',
            listingsCount: 2847,
            isPopular: true,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'real-estate',
            name: 'عقارات',
            slug: 'real-estate',
            description: 'شقق وفيلل ومحلات تجارية للبيع والإيجار',
            icon: '🏠',
            color: '#059669',
            listingsCount: 1923,
            isPopular: true,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'mobiles',
            name: 'جوالات',
            slug: 'mobiles',
            description: 'هواتف ذكية وملحقاتها من جميع الماركات',
            icon: '📱',
            color: '#7C3AED',
            listingsCount: 3156,
            isPopular: true,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'electronics',
            name: 'إلكترونيات',
            slug: 'electronics',
            description: 'أجهزة إلكترونية وكمبيوترات ولابتوبات',
            icon: '💻',
            color: '#2563EB',
            listingsCount: 1834,
            isPopular: false,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'furniture',
            name: 'أثاث',
            slug: 'furniture',
            description: 'أثاث منزلي ومكتبي بجميع أنواعه',
            icon: '🪑',
            color: '#92400E',
            listingsCount: 1456,
            isPopular: false,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'home-appliances',
            name: 'أجهزة منزلية',
            slug: 'home-appliances',
            description: 'أجهزة كهربائية منزلية ومطبخ',
            icon: '🔌',
            color: '#EA580C',
            listingsCount: 987,
            isPopular: false,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'fashion',
            name: 'أزياء وملابس',
            slug: 'fashion',
            description: 'ملابس وأحذية وإكسسوارات للرجال والنساء',
            icon: '👗',
            color: '#BE185D',
            listingsCount: 2134,
            isPopular: true,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'accessories',
            name: 'ساعات وإكسسوارات',
            slug: 'accessories',
            description: 'ساعات ومجوهرات وإكسسوارات فاخرة',
            icon: '⌚',
            color: '#7C2D12',
            listingsCount: 765,
            isPopular: false,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'sports',
            name: 'رياضة',
            slug: 'sports',
            description: 'معدات رياضية وأجهزة لياقة بدنية',
            icon: '⚽',
            color: '#16A34A',
            listingsCount: 543,
            isPopular: false,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'kids',
            name: 'مستلزمات أطفال',
            slug: 'kids',
            description: 'ألعاب وملابس ومستلزمات الأطفال والرضع',
            icon: '🧸',
            color: '#DB2777',
            listingsCount: 1287,
            isPopular: false,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'tools',
            name: 'معدات وأدوات',
            slug: 'tools',
            description: 'أدوات ومعدات حرفية وصناعية',
            icon: '🔧',
            color: '#374151',
            listingsCount: 432,
            isPopular: false,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          },
          {
            id: 'other',
            name: 'أخرى',
            slug: 'other',
            description: 'منتجات متنوعة وأشياء أخرى للبيع',
            icon: '📦',
            color: '#6B7280',
            listingsCount: 645,
            isPopular: false,
            parentId: null,
            subcategories: [],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
          }
        ];

        setCategories(mockCategories);
      } catch (err) {
        setError('حدث خطأ في تحميل الأقسام');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};