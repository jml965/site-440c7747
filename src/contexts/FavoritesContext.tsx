import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Listing } from '../types';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from './AppContext';

// Types
interface FavoritesState {
  favorites: Listing[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

type FavoritesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FAVORITES'; payload: Listing[] }
  | { type: 'ADD_FAVORITE'; payload: Listing }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'UPDATE_FAVORITE'; payload: Listing };

interface FavoritesContextType extends FavoritesState {
  loadFavorites: () => Promise<void>;
  addFavorite: (listingId: string) => Promise<void>;
  removeFavorite: (listingId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  isFavorite: (listingId: string) => boolean;
  refreshFavorites: () => Promise<void>;
  getFavoriteIds: () => string[];
  updateFavorite: (listing: Listing) => void;
}

// Initial state
const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null,
  lastUpdated: null
};

// Reducer
const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString()
      };

    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
        lastUpdated: new Date().toISOString()
      };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload),
        lastUpdated: new Date().toISOString()
      };

    case 'UPDATE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.map(fav => 
          fav.id === action.payload.id ? action.payload : fav
        ),
        lastUpdated: new Date().toISOString()
      };

    case 'CLEAR_FAVORITES':
      return {
        ...state,
        favorites: [],
        lastUpdated: new Date().toISOString()
      };

    default:
      return state;
  }
};

// Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Provider component
interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load favorites
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      dispatch({ type: 'CLEAR_FAVORITES' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const favorites = await favoriteService.getFavorites();
      dispatch({ type: 'SET_FAVORITES', payload: favorites });
    } catch (error: any) {
      console.error('Error loading favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'فشل في تحميل المفضلة' });
    }
  }, [isAuthenticated, user?.id]);

  // Add favorite
  const addFavorite = useCallback(async (listingId: string) => {
    if (!isAuthenticated) {
      dispatch({ type: 'SET_ERROR', payload: 'يجب تسجيل الدخول أولاً' });
      return;
    }

    try {
      const favoriteResponse = await favoriteService.addFavorite(listingId);
      dispatch({ type: 'ADD_FAVORITE', payload: favoriteResponse.listing });
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'فشل في إضافة الإعلان إلى المفضلة' });
      throw error;
    }
  }, [isAuthenticated]);

  // Remove favorite
  const removeFavorite = useCallback(async (listingId: string) => {
    if (!isAuthenticated) {
      dispatch({ type: 'SET_ERROR', payload: 'يجب تسجيل الدخول أولاً' });
      return;
    }

    try {
      await favoriteService.removeFavorite(listingId);
      dispatch({ type: 'REMOVE_FAVORITE', payload: listingId });
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'فشل في إزالة الإعلان من المفضلة' });
      throw error;
    }
  }, [isAuthenticated]);

  // Clear all favorites
  const clearFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'SET_ERROR', payload: 'يجب تسجيل الدخول أولاً' });
      return;
    }

    try {
      await favoriteService.clearFavorites();
      dispatch({ type: 'CLEAR_FAVORITES' });
    } catch (error: any) {
      console.error('Error clearing favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'فشل في مسح المفضلة' });
      throw error;
    }
  }, [isAuthenticated]);

  // Check if listing is favorite
  const isFavorite = useCallback((listingId: string): boolean => {
    return state.favorites.some(fav => fav.id === listingId);
  }, [state.favorites]);

  // Refresh favorites
  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, [loadFavorites]);

  // Get favorite IDs
  const getFavoriteIds = useCallback((): string[] => {
    return state.favorites.map(fav => fav.id);
  }, [state.favorites]);

  // Update favorite
  const updateFavorite = useCallback((listing: Listing) => {
    dispatch({ type: 'UPDATE_FAVORITE', payload: listing });
  }, []);

  const value: FavoritesContextType = {
    ...state,
    loadFavorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    refreshFavorites,
    getFavoriteIds,
    updateFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook to use favorites context
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;