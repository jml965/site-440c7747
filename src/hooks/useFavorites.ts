import { useState, useEffect, useCallback } from 'react';
import { Listing } from '../types';
import { favoriteService } from '../services/favoriteService';
import { useFavorites as useFavoritesContext } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AppContext';

export interface UseFavoritesReturn {
  favorites: Listing[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (listingId: string) => Promise<void>;
  removeFavorite: (listingId: string) => Promise<void>;
  toggleFavorite: (listingId: string) => Promise<void>;
  isFavorite: (listingId: string) => boolean;
  clearFavorites: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'newest' | 'oldest' | 'price_high' | 'price_low' | 'title';
  setSortBy: (sort: 'newest' | 'oldest' | 'price_high' | 'price_low' | 'title') => void;
  filteredFavorites: Listing[];
}

export const useFavorites = (): UseFavoritesReturn => {
  const { isAuthenticated, user } = useAuth();
  const {
    favorites,
    isLoading,
    error,
    addFavorite: contextAddFavorite,
    removeFavorite: contextRemoveFavorite,
    loadFavorites,
    clearFavorites: contextClearFavorites
  } = useFavoritesContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_high' | 'price_low' | 'title'>('newest');

  // Load favorites on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadFavorites();
    }
  }, [isAuthenticated, user?.id, loadFavorites]);

  // Add favorite
  const addFavorite = useCallback(async (listingId: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    try {
      await favoriteService.addFavorite(listingId);
      await contextAddFavorite(listingId);
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw new Error('فشل في إضافة الإعلان إلى المفضلة');
    }
  }, [isAuthenticated, contextAddFavorite]);

  // Remove favorite
  const removeFavorite = useCallback(async (listingId: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    try {
      await favoriteService.removeFavorite(listingId);
      await contextRemoveFavorite(listingId);
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw new Error('فشل في إزالة الإعلان من المفضلة');
    }
  }, [isAuthenticated, contextRemoveFavorite]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (listingId: string): Promise<void> => {
    const isFav = isFavorite(listingId);
    
    if (isFav) {
      await removeFavorite(listingId);
    } else {
      await addFavorite(listingId);
    }
  }, [addFavorite, removeFavorite]);

  // Check if listing is favorite
  const isFavorite = useCallback((listingId: string): boolean => {
    return favorites.some(favorite => favorite.id === listingId);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    try {
      await favoriteService.clearFavorites();
      await contextClearFavorites();
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw new Error('فشل في مسح المفضلة');
    }
  }, [isAuthenticated, contextClearFavorites]);

  // Refresh favorites
  const refreshFavorites = useCallback(async (): Promise<void> => {
    if (isAuthenticated) {
      await loadFavorites();
    }
  }, [isAuthenticated, loadFavorites]);

  // Filter and sort favorites
  const filteredFavorites = useCallback(() => {
    let filtered = [...favorites];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(query) ||
        listing.description?.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query) ||
        listing.category?.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price_high':
          return b.price - a.price;
        case 'price_low':
          return a.price - b.price;
        case 'title':
          return a.title.localeCompare(b.title, 'ar');
        default:
          return 0;
      }
    });

    return filtered;
  }, [favorites, searchQuery, sortBy])();

  return {
    favorites: filteredFavorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    refreshFavorites,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredFavorites
  };
};