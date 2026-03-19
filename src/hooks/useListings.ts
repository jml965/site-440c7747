import { useState, useEffect } from 'react';
import { Listing, FilterOptions } from '../types';
import { listingService } from '../services/listingService';

interface UseListingsOptions {
  filters?: FilterOptions;
  sortBy?: 'newest' | 'oldest' | 'price-low-high' | 'price-high-low' | 'most-viewed' | 'featured' | 'trending';
  page?: number;
  limit?: number;
}

interface UseListingsResult {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalCount: number;
  refetch: () => Promise<void>;
}

export const useListings = (options: UseListingsOptions = {}): UseListingsResult => {
  const {
    filters = {},
    sortBy = 'newest',
    page = 1,
    limit = 12
  } = options;

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await listingService.getAll({
        filters,
        sortBy,
        page,
        limit
      });
      
      setListings(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('حدث خطأ في تحميل الإعلانات');
      setListings([]);
      setTotalPages(0);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters, sortBy, page, limit]);

  const refetch = async () => {
    await fetchListings();
  };

  return {
    listings,
    loading,
    error,
    totalPages,
    totalCount,
    refetch
  };
};

// Hook for getting a single listing
export const useListing = (id: string) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await listingService.getById(id);
        setListing(data);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('حدث خطأ في تحميل الإعلان');
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  return { listing, loading, error };
};

// Hook for managing favorites
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  }, []);

  const toggleFavorite = (listingId: string) => {
    try {
      const newFavorites = favorites.includes(listingId)
        ? favorites.filter(id => id !== listingId)
        : [...favorites, listingId];
      
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      return !favorites.includes(listingId);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      return favorites.includes(listingId);
    }
  };

  const isFavorite = (listingId: string) => favorites.includes(listingId);

  const getFavoriteListings = async (): Promise<Listing[]> => {
    if (favorites.length === 0) return [];
    
    try {
      const listings = await Promise.all(
        favorites.map(id => listingService.getById(id).catch(() => null))
      );
      
      return listings.filter(Boolean) as Listing[];
    } catch (err) {
      console.error('Error fetching favorite listings:', err);
      return [];
    }
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteListings
  };
};

// Hook for search functionality
export const useListingSearch = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('searchHistory');
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading search history:', err);
    }
  }, []);

  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return;
    
    try {
      const newHistory = [query, ...searchHistory.filter(item => item !== query)]
        .slice(0, 10); // Keep only 10 recent searches
      
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (err) {
      console.error('Error saving search history:', err);
    }
  };

  const clearSearchHistory = () => {
    try {
      setSearchHistory([]);
      localStorage.removeItem('searchHistory');
    } catch (err) {
      console.error('Error clearing search history:', err);
    }
  };

  return {
    searchHistory,
    addToSearchHistory,
    clearSearchHistory
  };
};

// Hook for recently viewed listings
export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading recently viewed:', err);
    }
  }, []);

  const addToRecentlyViewed = (listingId: string) => {
    try {
      const newRecentlyViewed = [listingId, ...recentlyViewed.filter(id => id !== listingId)]
        .slice(0, 20); // Keep only 20 recent items
      
      setRecentlyViewed(newRecentlyViewed);
      localStorage.setItem('recentlyViewed', JSON.stringify(newRecentlyViewed));
    } catch (err) {
      console.error('Error saving recently viewed:', err);
    }
  };

  const getRecentlyViewedListings = async (): Promise<Listing[]> => {
    if (recentlyViewed.length === 0) return [];
    
    try {
      const listings = await Promise.all(
        recentlyViewed.slice(0, 10).map(id => 
          listingService.getById(id).catch(() => null)
        )
      );
      
      return listings.filter(Boolean) as Listing[];
    } catch (err) {
      console.error('Error fetching recently viewed listings:', err);
      return [];
    }
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    getRecentlyViewedListings
  };
};