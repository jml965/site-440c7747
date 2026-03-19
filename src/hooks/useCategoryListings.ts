import { useState, useEffect, useCallback } from 'react';
import { Listing } from '../types';
import { CategoryFilterState } from '../components/CategoryFilter';
import { listingsData } from '../data/listingsData';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

interface UseCategoryListingsResult {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  filters: CategoryFilterState;
  setFilters: (filters: CategoryFilterState) => void;
  pagination: PaginationState;
  loadMore: () => void;
  refresh: () => void;
}

export const useCategoryListings = (
  categorySlug?: string,
  subcategorySlug?: string
): UseCategoryListingsResult => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 12,
    total: 0,
    hasMore: false
  });

  const [filters, setFilters] = useState<CategoryFilterState>({
    priceRange: { min: 0, max: 0 },
    city: '',
    condition: '',
    sortBy: 'newest',
    dateRange: ''
  });

  // Simulate API call with filtering and pagination
  const fetchListings = useCallback(async (page: number = 1, resetListings: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter listings based on category, subcategory, and filters
      let filteredListings = [...listingsData];

      // Category filter
      if (categorySlug) {
        filteredListings = filteredListings.filter(listing => 
          listing.category?.slug === categorySlug
        );
      }

      // Subcategory filter
      if (subcategorySlug) {
        filteredListings = filteredListings.filter(listing => 
          listing.subcategory?.slug === subcategorySlug
        );
      }

      // Price range filter
      if (filters.priceRange.min > 0) {
        filteredListings = filteredListings.filter(listing => 
          listing.price >= filters.priceRange.min
        );
      }
      if (filters.priceRange.max > 0) {
        filteredListings = filteredListings.filter(listing => 
          listing.price <= filters.priceRange.max
        );
      }

      // City filter
      if (filters.city) {
        filteredListings = filteredListings.filter(listing => 
          listing.city === filters.city
        );
      }

      // Condition filter
      if (filters.condition) {
        filteredListings = filteredListings.filter(listing => 
          listing.condition === filters.condition
        );
      }

      // Date range filter
      if (filters.dateRange) {
        const now = new Date();
        const filterDate = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
          case '3months':
            filterDate.setMonth(now.getMonth() - 3);
            break;
        }
        
        filteredListings = filteredListings.filter(listing => 
          new Date(listing.createdAt) >= filterDate
        );
      }

      // Sorting
      switch (filters.sortBy) {
        case 'newest':
          filteredListings.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'oldest':
          filteredListings.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case 'price_low':
          filteredListings.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          filteredListings.sort((a, b) => b.price - a.price);
          break;
        case 'popular':
          filteredListings.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        default:
          break;
      }

      // Pagination
      const startIndex = (page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedListings = filteredListings.slice(startIndex, endIndex);

      const newPagination: PaginationState = {
        page,
        limit: pagination.limit,
        total: filteredListings.length,
        hasMore: endIndex < filteredListings.length
      };

      setPagination(newPagination);

      if (resetListings) {
        setListings(paginatedListings);
      } else {
        setListings(prev => [...prev, ...paginatedListings]);
      }

    } catch (err) {
      console.error('خطأ في تحميل الإعلانات:', err);
      setError('فشل في تحميل الإعلانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }, [categorySlug, subcategorySlug, filters, pagination.limit]);

  // Initial load and when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchListings(1, true);
  }, [categorySlug, subcategorySlug, filters]);

  const loadMore = useCallback(() => {
    if (!loading && pagination.hasMore) {
      fetchListings(pagination.page + 1, false);
    }
  }, [loading, pagination.hasMore, pagination.page, fetchListings]);

  const refresh = useCallback(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchListings(1, true);
  }, [fetchListings]);

  const updateFilters = useCallback((newFilters: CategoryFilterState) => {
    setFilters(newFilters);
  }, []);

  return {
    listings,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    pagination,
    loadMore,
    refresh
  };
};

// Mock listings data - this would normally come from a separate data file
const listingsData: Listing[] = [
  {
    id: '1',
    title: 'آيفون 14 برو ماكس 256 جيجا',
    description: 'آيفون 14 برو ماكس بحالة ممتازة، استخدام شخصي، مع جميع الملحقات الأصلية والكفالة سارية',
    price: 3500,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=800&h=600&fit=crop'
    ],
    category: {
      id: '2',
      name: 'جوالات',
      slug: 'phones',
      icon: '📱'
    },
    subcategory: {
      id: '21',
      name: 'آيفون',
      slug: 'iphone',
      categoryId: '2'
    },
    condition: 'مستعمل - ممتاز',
    city: 'الرياض',
    sellerId: 'seller1',
    status: 'active',
    featured: true,
    views: 245,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'سيارة كامري 2020',
    description: 'تويوتا كامري 2020 فل كامل، ماشية 45 ألف كيلو، صيانة منتظمة في الوكالة',
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&h=600&fit=crop'
    ],
    category: {
      id: '1',
      name: 'سيارات',
      slug: 'cars',
      icon: '🚗'
    },
    subcategory: {
      id: '11',
      name: 'تويوتا',
      slug: 'toyota',
      categoryId: '1'
    },
    condition: 'مستعمل - جيد جداً',
    city: 'جدة',
    sellerId: 'seller2',
    status: 'active',
    featured: false,
    views: 180,
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    title: 'شقة للإيجار 3 غرف',
    description: 'شقة مفروشة 3 غرف نوم وصالة، مطبخ مجهز، موقع ممتاز قريب من الخدمات',
    price: 2800,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop'
    ],
    category: {
      id: '3',
      name: 'عقارات',
      slug: 'real-estate',
      icon: '🏠'
    },
    subcategory: {
      id: '31',
      name: 'شقق للإيجار',
      slug: 'apartments-rent',
      categoryId: '3'
    },
    condition: 'جديد',
    city: 'الدمام',
    sellerId: 'seller3',
    status: 'active',
    featured: true,
    views: 320,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  }
  // Add more mock listings as needed
];