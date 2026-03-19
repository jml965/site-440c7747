import { useState, useEffect } from 'react';
import type { Listing, User } from '../types';
import { api } from '../services/api';

interface UseListingDetailsState {
  listing: Listing | null;
  similarListings: Listing[];
  loading: boolean;
  error: string | null;
  isFavorite: boolean;
}

interface UseListingDetailsActions {
  toggleFavorite: () => Promise<void>;
  incrementViews: () => Promise<void>;
  refreshListing: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  reportListing: (reason: string, description: string) => Promise<void>;
}

type UseListingDetailsReturn = UseListingDetailsState & UseListingDetailsActions;

export function useListingDetails(listingId: string, userId?: string): UseListingDetailsReturn {
  const [listing, setListing] = useState<Listing | null>(null);
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch listing details
  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch main listing
      const listingResponse = await api.get(`/listings/${listingId}`);
      const listingData = listingResponse.data;
      
      if (!listingData) {
        throw new Error('الإعلان غير موجود');
      }

      setListing(listingData);

      // Check if listing is in user's favorites
      if (userId) {
        try {
          const favoritesResponse = await api.get('/favorites');
          const favorites = favoritesResponse.data || [];
          setIsFavorite(favorites.some((fav: any) => fav.listingId === listingId));
        } catch (favError) {
          console.warn('Could not fetch favorites:', favError);
        }
      }

      // Fetch similar listings
      if (listingData.categoryId) {
        try {
          const similarResponse = await api.get(`/listings`, {
            params: {
              category: listingData.categoryId,
              limit: 8,
              exclude: listingId
            }
          });
          setSimilarListings(similarResponse.data?.listings || []);
        } catch (similarError) {
          console.warn('Could not fetch similar listings:', similarError);
          // Use mock data as fallback
          setSimilarListings(generateMockSimilarListings(listingData));
        }
      } else {
        // Generate mock similar listings
        setSimilarListings(generateMockSimilarListings(listingData));
      }
    } catch (err) {
      console.error('Error fetching listing:', err);
      setError(err instanceof Error ? err.message : 'خطأ في تحميل الإعلان');
      
      // If API fails, try to use mock data
      if (listingId) {
        const mockListing = generateMockListing(listingId);
        setListing(mockListing);
        setSimilarListings(generateMockSimilarListings(mockListing));
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!userId || !listing) {
      throw new Error('يجب تسجيل الدخول لإضافة المفضلة');
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${listing.id}`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites', { listingId: listing.id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('خطأ في تحديث المفضلة');
    }
  };

  // Increment view count
  const incrementViews = async () => {
    if (!listing) return;

    try {
      await api.post(`/listings/${listing.id}/view`);
      setListing(prev => prev ? {
        ...prev,
        viewsCount: (prev.viewsCount || 0) + 1
      } : null);
    } catch (error) {
      console.warn('Could not increment views:', error);
    }
  };

  // Refresh listing data
  const refreshListing = async () => {
    await fetchListing();
  };

  // Send message to seller
  const sendMessage = async (message: string) => {
    if (!userId || !listing) {
      throw new Error('يجب تسجيل الدخول لإرسال الرسائل');
    }

    try {
      await api.post('/messages', {
        recipientId: listing.userId,
        content: message,
        listingId: listing.id
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('خطأ في إرسال الرسالة');
    }
  };

  // Report listing
  const reportListing = async (reason: string, description: string) => {
    if (!listing) {
      throw new Error('لا يمكن الإبلاغ عن إعلان غير موجود');
    }

    try {
      await api.post('/reports', {
        listingId: listing.id,
        reason,
        description
      });
    } catch (error) {
      console.error('Error reporting listing:', error);
      throw new Error('خطأ في إرسال البلاغ');
    }
  };

  // Load listing on component mount or when listingId changes
  useEffect(() => {
    if (listingId) {
      fetchListing();
    }
  }, [listingId, userId]);

  // Increment views on first load (delayed to avoid affecting loading)
  useEffect(() => {
    if (listing && !loading) {
      const timer = setTimeout(() => {
        incrementViews();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [listing, loading]);

  return {
    listing,
    similarListings,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    incrementViews,
    refreshListing,
    sendMessage,
    reportListing
  };
}

// Helper function to generate mock listing data
function generateMockListing(id: string): Listing {
  const mockCategories = [
    { id: '1', name: 'سيارات', slug: 'cars' },
    { id: '2', name: 'عقارات', slug: 'real-estate' },
    { id: '3', name: 'إلكترونيات', slug: 'electronics' },
    { id: '4', name: 'أثاث', slug: 'furniture' }
  ];

  const mockCities = [
    { id: '1', name: 'الرياض' },
    { id: '2', name: 'جدة' },
    { id: '3', name: 'الدمام' },
    { id: '4', name: 'مكة' }
  ];

  const category = mockCategories[Math.floor(Math.random() * mockCategories.length)];
  const city = mockCities[Math.floor(Math.random() * mockCities.length)];

  return {
    id,
    title: 'إعلان تجريبي - ' + category.name,
    description: 'هذا إعلان تجريبي يحتوي على وصف تفصيلي للمنتج المعروض للبيع. يمكن أن يتضمن معلومات عن الحالة والمواصفات والسعر.',
    price: Math.floor(Math.random() * 10000) + 500,
    isNegotiable: Math.random() > 0.5,
    condition: ['new', 'like-new', 'good', 'fair'][Math.floor(Math.random() * 4)] as any,
    status: 'active',
    isFeatured: Math.random() > 0.8,
    viewsCount: Math.floor(Math.random() * 500) + 10,
    categoryId: category.id,
    category,
    cityId: city.id,
    city,
    userId: 'mock-user-id',
    user: {
      id: 'mock-user-id',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      isVerified: Math.random() > 0.5,
      rating: 4.2 + Math.random() * 0.8,
      reviewsCount: Math.floor(Math.random() * 50) + 5,
      totalSales: Math.floor(Math.random() * 100) + 1,
      isOnline: Math.random() > 0.5,
      phone: '+966501234567',
      city,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
        listingId: id,
        order: 0
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
        listingId: id,
        order: 1
      }
    ],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  };
}

// Helper function to generate mock similar listings
function generateMockSimilarListings(baseListing: Listing): Listing[] {
  return Array.from({ length: 6 }, (_, index) => {
    const id = `similar-${baseListing.id}-${index}`;
    const listing = generateMockListing(id);
    return {
      ...listing,
      categoryId: baseListing.categoryId,
      category: baseListing.category,
      title: `${baseListing.category?.name || 'منتج'} مشابه ${index + 1}`
    };
  });
}

export default useListingDetails;