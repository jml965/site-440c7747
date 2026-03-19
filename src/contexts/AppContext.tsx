import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, Listing, Category, Conversation, Notification, AppState } from '../types';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface AppContextType {
  state: AppState;
  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  
  // Listing Actions
  fetchListings: (filters?: ListingFilters) => Promise<void>;
  createListing: (listingData: CreateListingData) => Promise<boolean>;
  updateListing: (id: string, listingData: Partial<CreateListingData>) => Promise<boolean>;
  deleteListing: (id: string) => Promise<boolean>;
  
  // Category Actions
  fetchCategories: () => Promise<void>;
  
  // Favorite Actions
  toggleFavorite: (listingId: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  
  // Message Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<boolean>;
  
  // Notification Actions
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  
  // Search Actions
  searchListings: (query: string, filters?: ListingFilters) => Promise<void>;
  
  // Report Actions
  reportListing: (listingId: string, reason: string, description: string) => Promise<boolean>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
}

interface CreateListingData {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  city: string;
  condition: 'جديد' | 'مستعمل' | 'ممتاز' | 'جيد' | 'يحتاج إصلاح';
  images: File[];
  phone: string;
}

interface ListingFilters {
  categoryId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high';
  page?: number;
  limit?: number;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LISTINGS'; payload: Listing[] }
  | { type: 'ADD_LISTING'; payload: Listing }
  | { type: 'UPDATE_LISTING'; payload: { id: string; listing: Partial<Listing> } }
  | { type: 'DELETE_LISTING'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; notification: Partial<Notification> } }
  | { type: 'SET_SEARCH_RESULTS'; payload: Listing[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'CLEAR_SEARCH'; payload: null };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  listings: [],
  categories: [],
  favorites: [],
  conversations: [],
  notifications: [],
  searchResults: [],
  searchQuery: '',
  currentConversation: null,
  unreadNotifications: 0
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        isLoading: false 
      };
      
    case 'SET_LISTINGS':
      return { ...state, listings: action.payload, isLoading: false };
      
    case 'ADD_LISTING':
      return { ...state, listings: [action.payload, ...state.listings] };
      
    case 'UPDATE_LISTING':
      return {
        ...state,
        listings: state.listings.map(listing =>
          listing.id === action.payload.id
            ? { ...listing, ...action.payload.listing }
            : listing
        )
      };
      
    case 'DELETE_LISTING':
      return {
        ...state,
        listings: state.listings.filter(listing => listing.id !== action.payload)
      };
      
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
      
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
      
    case 'TOGGLE_FAVORITE':
      const listingId = action.payload;
      const isFavorite = state.favorites.includes(listingId);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== listingId)
          : [...state.favorites, listingId]
      };
      
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
      
    case 'SET_NOTIFICATIONS':
      const unreadCount = action.payload.filter(n => !n.isRead).length;
      return { 
        ...state, 
        notifications: action.payload,
        unreadNotifications: unreadCount
      };
      
    case 'UPDATE_NOTIFICATION':
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload.id
          ? { ...notification, ...action.payload.notification }
          : notification
      );
      const newUnreadCount = updatedNotifications.filter(n => !n.isRead).length;
      return {
        ...state,
        notifications: updatedNotifications,
        unreadNotifications: newUnreadCount
      };
      
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
      
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
      
    case 'CLEAR_SEARCH':
      return { ...state, searchResults: [], searchQuery: '' };
      
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      apiService.setAuthToken(token);
      // Validate token and get user data
      fetchUserProfile();
    }
  }, []);

  // Auth Functions
  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.post('/auth/login', { email, password });
      if (response.success) {
        localStorage.setItem('authToken', response.data.token);
        apiService.setAuthToken(response.data.token);
        dispatch({ type: 'SET_USER', payload: response.data.user });
        toast.success('تم تسجيل الدخول بنجاح');
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        toast.error(response.error || 'فشل في تسجيل الدخول');
        return false;
      }
    } catch (error) {
      const errorMessage = 'حدث خطأ في تسجيل الدخول';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.post('/auth/register', userData);
      if (response.success) {
        localStorage.setItem('authToken', response.data.token);
        apiService.setAuthToken(response.data.token);
        dispatch({ type: 'SET_USER', payload: response.data.user });
        toast.success('تم إنشاء الحساب بنجاح');
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        toast.error(response.error || 'فشل في إنشاء الحساب');
        return false;
      }
    } catch (error) {
      const errorMessage = 'حدث خطأ في إنشاء الحساب';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    apiService.setAuthToken(null);
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_FAVORITES', payload: [] });
    dispatch({ type: 'SET_CONVERSATIONS', payload: [] });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const response = await apiService.get('/auth/profile');
      if (response.success) {
        dispatch({ type: 'SET_USER', payload: response.data });
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await apiService.put('/auth/profile', userData);
      if (response.success) {
        dispatch({ type: 'SET_USER', payload: response.data });
        toast.success('تم تحديث الملف الشخصي بنجاح');
        return true;
      } else {
        toast.error(response.error || 'فشل في تحديث الملف الشخصي');
        return false;
      }
    } catch (error) {
      toast.error('حدث خطأ في تحديث الملف الشخصي');
      return false;
    }
  };

  // Listing Functions
  const fetchListings = async (filters?: ListingFilters): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await apiService.get(`/listings?${queryParams.toString()}`);
      if (response.success) {
        dispatch({ type: 'SET_LISTINGS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'فشل في جلب الإعلانات' });
    }
  };

  const createListing = async (listingData: CreateListingData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const formData = new FormData();
      Object.entries(listingData).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach(file => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, value.toString());
        }
      });

      const response = await apiService.post('/listings', formData, {
        'Content-Type': 'multipart/form-data'
      });
      
      if (response.success) {
        dispatch({ type: 'ADD_LISTING', payload: response.data });
        toast.success('تم نشر الإعلان بنجاح');
        return true;
      } else {
        toast.error(response.error || 'فشل في نشر الإعلان');
        return false;
      }
    } catch (error) {
      toast.error('حدث خطأ في نشر الإعلان');
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateListing = async (id: string, listingData: Partial<CreateListingData>): Promise<boolean> => {
    try {
      const response = await apiService.put(`/listings/${id}`, listingData);
      if (response.success) {
        dispatch({ type: 'UPDATE_LISTING', payload: { id, listing: response.data } });
        toast.success('تم تحديث الإعلان بنجاح');
        return true;
      } else {
        toast.error(response.error || 'فشل في تحديث الإعلان');
        return false;
      }
    } catch (error) {
      toast.error('حدث خطأ في تحديث الإعلان');
      return false;
    }
  };

  const deleteListing = async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.delete(`/listings/${id}`);
      if (response.success) {
        dispatch({ type: 'DELETE_LISTING', payload: id });
        toast.success('تم حذف الإعلان بنجاح');
        return true;
      } else {
        toast.error(response.error || 'فشل في حذف الإعلان');
        return false;
      }
    } catch (error) {
      toast.error('حدث خطأ في حذف الإعلان');
      return false;
    }
  };

  // Category Functions
  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await apiService.get('/categories');
      if (response.success) {
        dispatch({ type: 'SET_CATEGORIES', payload: response.data });
      }
    } catch (error) {
      console.error('فشل في جلب التصنيفات:', error);
    }
  };

  // Favorite Functions
  const toggleFavorite = async (listingId: string): Promise<void> => {
    try {
      const response = await apiService.post(`/favorites/${listingId}`);
      if (response.success) {
        dispatch({ type: 'TOGGLE_FAVORITE', payload: listingId });
        const isFavorite = state.favorites.includes(listingId);
        toast.success(isFavorite ? 'تم حذف الإعلان من المفضلة' : 'تم إضافة الإعلان للمفضلة');
      }
    } catch (error) {
      toast.error('حدث خطأ في تحديث المفضلة');
    }
  };

  const fetchFavorites = async (): Promise<void> => {
    try {
      const response = await apiService.get('/favorites');
      if (response.success) {
        dispatch({ type: 'SET_FAVORITES', payload: response.data });
      }
    } catch (error) {
      console.error('فشل في جلب المفضلة:', error);
    }
  };

  // Message Functions
  const fetchConversations = async (): Promise<void> => {
    try {
      const response = await apiService.get('/conversations');
      if (response.success) {
        dispatch({ type: 'SET_CONVERSATIONS', payload: response.data });
      }
    } catch (error) {
      console.error('فشل في جلب المحادثات:', error);
    }
  };

  const fetchMessages = async (conversationId: string): Promise<void> => {
    try {
      const response = await apiService.get(`/conversations/${conversationId}/messages`);
      if (response.success) {
        // Handle messages in conversation context
        console.log('Messages fetched:', response.data);
      }
    } catch (error) {
      console.error('فشل في جلب الرسائل:', error);
    }
  };

  const sendMessage = async (conversationId: string, content: string): Promise<boolean> => {
    try {
      const response = await apiService.post(`/conversations/${conversationId}/messages`, { content });
      if (response.success) {
        toast.success('تم إرسال الرسالة بنجاح');
        return true;
      } else {
        toast.error('فشل في إرسال الرسالة');
        return false;
      }
    } catch (error) {
      toast.error('حدث خطأ في إرسال الرسالة');
      return false;
    }
  };

  // Notification Functions
  const fetchNotifications = async (): Promise<void> => {
    try {
      const response = await apiService.get('/notifications');
      if (response.success) {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: response.data });
      }
    } catch (error) {
      console.error('فشل في جلب الإشعارات:', error);
    }
  };

  const markNotificationAsRead = async (id: string): Promise<void> => {
    try {
      const response = await apiService.put(`/notifications/${id}/read`);
      if (response.success) {
        dispatch({ 
          type: 'UPDATE_NOTIFICATION', 
          payload: { id, notification: { isRead: true } } 
        });
      }
    } catch (error) {
      console.error('فشل في تحديث الإشعار:', error);
    }
  };

  const markAllNotificationsAsRead = async (): Promise<void> => {
    try {
      const response = await apiService.put('/notifications/read-all');
      if (response.success) {
        const updatedNotifications = state.notifications.map(n => ({ ...n, isRead: true }));
        dispatch({ type: 'SET_NOTIFICATIONS', payload: updatedNotifications });
        toast.success('تم تحديد جميع الإشعارات كمقروءة');
      }
    } catch (error) {
      toast.error('حدث خطأ في تحديث الإشعارات');
    }
  };

  // Search Functions
  const searchListings = async (query: string, filters?: ListingFilters): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    try {
      const queryParams = new URLSearchParams({ q: query });
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await apiService.get(`/listings/search?${queryParams.toString()}`);
      if (response.success) {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'فشل في البحث' });
    }
  };

  // Report Functions
  const reportListing = async (listingId: string, reason: string, description: string): Promise<boolean> => {
    try {
      const response = await apiService.post('/reports', {
        listingId,
        reason,
        description
      });
      
      if (response.success) {
        toast.success('تم إرسال البلاغ بنجاح');
        return true;
      } else {
        toast.error(response.error || 'فشل في إرسال البلاغ');
        return false;
      }
    } catch (error) {
      toast.error('حدث خطأ في إرسال البلاغ');
      return false;
    }
  };

  const value: AppContextType = {
    state,
    login,
    register,
    logout,
    updateUser,
    fetchListings,
    createListing,
    updateListing,
    deleteListing,
    fetchCategories,
    toggleFavorite,
    fetchFavorites,
    fetchConversations,
    fetchMessages,
    sendMessage,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    searchListings,
    reportListing
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}