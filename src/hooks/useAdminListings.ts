import { useState, useEffect, useCallback } from 'react';
import { Listing } from '../types';
import { api } from '../services/api';

interface Filters {
  status: string;
  category: string;
  city: string;
  featured?: boolean;
}

interface UseAdminListingsResult {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: Filters;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Filters) => void;
  setCurrentPage: (page: number) => void;
  approveListing: (listingId: string) => Promise<void>;
  rejectListing: (listingId: string, reason: string) => Promise<void>;
  deleteListing: (listingId: string) => Promise<void>;
  toggleFeatured: (listingId: string) => Promise<void>;
  refreshListings: () => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

// Mock data for development
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'سيارة تويوتا كامري 2020',
    description: 'سيارة تويوتا كامري موديل 2020 في حالة ممتازة، قطعت 45000 كيلو متر فقط. تم الصيانة الدورية في الوكالة.',
    price: 85000,
    category: 'cars',
    city: 'riyadh',
    condition: 'excellent',
    images: [
      'https://images.unsplash.com/photo-1549927681-6a17b4e4cd66?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ],
    phone: '0501234567',
    status: 'pending',
    featured: false,
    userId: 'user1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    user: {
      id: 'user1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '0501234567'
    }
  },
  {
    id: '2',
    title: 'شقة للبيع في الرياض',
    description: 'شقة 3 غرف وصالة في حي الملقا، الدور الثالث، مساحة 150 متر مربع، مطبخ مجهز ومكيفات.',
    price: 450000,
    category: 'real-estate',
    city: 'riyadh',
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
    ],
    phone: '0509876543',
    status: 'approved',
    featured: true,
    userId: 'user2',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    user: {
      id: 'user2',
      name: 'فاطمة أحمد',
      email: 'fatima@example.com',
      phone: '0509876543'
    }
  },
  {
    id: '3',
    title: 'آيفون 14 برو ماكس',
    description: 'آيفون 14 برو ماكس 256 جيجا، لون أسود، مع الكفالة والعلبة الأصلية. استعمال خفيف جداً.',
    price: 4200,
    category: 'phones',
    city: 'jeddah',
    condition: 'excellent',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop'
    ],
    phone: '0551234567',
    status: 'rejected',
    featured: false,
    userId: 'user3',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    user: {
      id: 'user3',
      name: 'محمد علي',
      email: 'mohammed@example.com',
      phone: '0551234567'
    }
  },
  {
    id: '4',
    title: 'طقم غرفة نوم كامل',
    description: 'طقم غرفة نوم كامل يشمل السرير والكومود والخزانة، خشب زان طبيعي، حالة ممتازة.',
    price: 3500,
    category: 'furniture',
    city: 'dammam',
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
    ],
    phone: '0501357924',
    status: 'pending',
    featured: false,
    userId: 'user4',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    user: {
      id: 'user4',
      name: 'سارة خالد',
      email: 'sara@example.com',
      phone: '0501357924'
    }
  },
  {
    id: '5',
    title: 'لابتوب ديل XPS 13',
    description: 'لابتوب ديل XPS 13 معالج i7 الجيل العاشر، 16 جيجا رام، 512 جيجا SSD، شاشة 4K.',
    price: 6500,
    category: 'electronics',
    city: 'riyadh',
    condition: 'excellent',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop'
    ],
    phone: '0562468135',
    status: 'approved',
    featured: true,
    userId: 'user5',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    user: {
      id: 'user5',
      name: 'عبدالله سعد',
      email: 'abdullah@example.com',
      phone: '0562468135'
    }
  },
  {
    id: '6',
    title: 'دراجة هوائية رياضية',
    description: 'دراجة هوائية جبلية للبيع، ماركة Trek، استعمال قليل، مع جميع الإكسسوارات.',
    price: 1800,
    category: 'sports',
    city: 'mecca',
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1544191696-15693bf6409d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop'
    ],
    phone: '0558642097',
    status: 'expired',
    featured: false,
    userId: 'user6',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    user: {
      id: 'user6',
      name: 'خالد عمر',
      email: 'khalid@example.com',
      phone: '0558642097'
    }
  }
];

export function useAdminListings(): UseAdminListingsResult {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    category: 'all',
    city: ''
  });

  const filterListings = useCallback((allListings: Listing[]) => {
    return allListings.filter(listing => {
      const matchesSearch = !searchTerm || 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.user?.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'all' || listing.status === filters.status;
      const matchesCategory = filters.category === 'all' || listing.category === filters.category;
      const matchesCity = !filters.city || listing.city.toLowerCase().includes(filters.city.toLowerCase());

      return matchesSearch && matchesStatus && matchesCategory && matchesCity;
    });
  }, [searchTerm, filters]);

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // In production, this would be an API call
      // const response = await api.get('/admin/listings', {
      //   params: { page: currentPage, limit: ITEMS_PER_PAGE, search: searchTerm, ...filters }
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filteredListings = filterListings(mockListings);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedListings = filteredListings.slice(startIndex, endIndex);
      
      setListings(paginatedListings);
      setTotalCount(filteredListings.length);
    } catch (err) {
      setError('حدث خطأ في تحميل الإعلانات');
      console.error('Error loading listings:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterListings]);

  const refreshListings = useCallback(async () => {
    await loadListings();
  }, [loadListings]);

  const approveListing = useCallback(async (listingId: string) => {
    try {
      // In production: await api.put(`/admin/listings/${listingId}/approve`);
      
      // Update local state
      const updatedMockListings = mockListings.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: 'approved' as const, updatedAt: new Date() }
          : listing
      );
      
      // Update the main mock data
      mockListings.splice(0, mockListings.length, ...updatedMockListings);
      
      await refreshListings();
    } catch (err) {
      setError('حدث خطأ في الموافقة على الإعلان');
      console.error('Error approving listing:', err);
    }
  }, [refreshListings]);

  const rejectListing = useCallback(async (listingId: string, reason: string) => {
    try {
      // In production: await api.put(`/admin/listings/${listingId}/reject`, { reason });
      
      // Update local state
      const updatedMockListings = mockListings.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: 'rejected' as const, updatedAt: new Date() }
          : listing
      );
      
      // Update the main mock data
      mockListings.splice(0, mockListings.length, ...updatedMockListings);
      
      await refreshListings();
    } catch (err) {
      setError('حدث خطأ في رفض الإعلان');
      console.error('Error rejecting listing:', err);
    }
  }, [refreshListings]);

  const deleteListing = useCallback(async (listingId: string) => {
    try {
      // In production: await api.delete(`/admin/listings/${listingId}`);
      
      // Remove from local state
      const updatedMockListings = mockListings.filter(listing => listing.id !== listingId);
      mockListings.splice(0, mockListings.length, ...updatedMockListings);
      
      await refreshListings();
    } catch (err) {
      setError('حدث خطأ في حذف الإعلان');
      console.error('Error deleting listing:', err);
    }
  }, [refreshListings]);

  const toggleFeatured = useCallback(async (listingId: string) => {
    try {
      // In production: await api.put(`/admin/listings/${listingId}/toggle-featured`);
      
      // Update local state
      const updatedMockListings = mockListings.map(listing => 
        listing.id === listingId 
          ? { ...listing, featured: !listing.featured, updatedAt: new Date() }
          : listing
      );
      
      // Update the main mock data
      mockListings.splice(0, mockListings.length, ...updatedMockListings);
      
      await refreshListings();
    } catch (err) {
      setError('حدث خطأ في تغيير حالة التمييز');
      console.error('Error toggling featured:', err);
    }
  }, [refreshListings]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Load listings when page or filters change
  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  return {
    listings,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    filters,
    searchTerm,
    setSearchTerm,
    setFilters,
    setCurrentPage,
    approveListing,
    rejectListing,
    deleteListing,
    toggleFeatured,
    refreshListings
  };
}