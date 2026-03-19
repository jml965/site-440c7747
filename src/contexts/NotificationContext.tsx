import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Notification } from '../types/index';
import { notificationService } from '../services/notificationService';
import { useAppContext } from './AppContext';
import { useBrowserNotifications } from '../hooks/useNotifications';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  preferences: any;
}

interface NotificationContextType extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updatePreferences: (preferences: any) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

type NotificationAction =
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PREFERENCES'; payload: any }
  | { type: 'UPDATE_UNREAD_COUNT' };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  preferences: {
    messages: true,
    favorites: true,
    listings: true,
    users: false,
    alerts: true,
    email: true,
    push: true,
    sound: false
  }
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: action.payload.read ? state.unreadCount : state.unreadCount + 1
      };
    
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      };
    
    case 'DELETE_NOTIFICATION':
      const deletedNotification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: deletedNotification && !deletedNotification.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: action.payload
      };
    
    case 'UPDATE_UNREAD_COUNT':
      return {
        ...state,
        unreadCount: state.notifications.filter(n => !n.read).length
      };
    
    default:
      return state;
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAppContext();
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { showNotification, permission, requestPermission } = useBrowserNotifications();

  // Load notifications when user changes
  useEffect(() => {
    if (user) {
      loadNotifications();
      loadPreferences();
    } else {
      dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
    }
  }, [user]);

  // Request notification permission on first load
  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const loadNotifications = async () => {
    if (!user) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const notifications = await notificationService.getNotifications(user.id);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadPreferences = async () => {
    if (!user) return;
    
    try {
      const preferences = await notificationService.getPreferences(user.id);
      dispatch({ type: 'SET_PREFERENCES', payload: preferences });
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const addNotification = React.useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
      const newNotification = await notificationService.createNotification(notification);
      dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
      
      // Show browser notification if enabled and permission granted
      if (state.preferences[notification.type] && state.preferences.push && permission === 'granted') {
        showNotification(notification.title, {
          body: notification.message,
          tag: newNotification.id,
          icon: '/favicon.ico'
        });
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  }, [state.preferences, permission, showNotification]);

  const markAsRead = React.useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      dispatch({ type: 'MARK_AS_READ', payload: id });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, []);

  const markAllAsRead = React.useCallback(async () => {
    if (!user) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [user]);

  const deleteNotification = React.useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  const updatePreferences = React.useCallback(async (preferences: any) => {
    if (!user) return;
    
    try {
      await notificationService.updatePreferences(user.id, preferences);
      dispatch({ type: 'SET_PREFERENCES', payload: preferences });
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }, [user]);

  const refreshNotifications = React.useCallback(async () => {
    await loadNotifications();
  }, [user]);

  // Set up real-time updates (polling)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const contextValue: NotificationContextType = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}

// Helper hook for creating notifications easily
export function useCreateNotification() {
  const { addNotification } = useNotificationContext();
  const { user } = useAppContext();

  const createMessageNotification = React.useCallback((fromUser: string, listingTitle: string, conversationId: string, listingId: string) => {
    if (!user) return;
    
    addNotification({
      userId: user.id,
      title: 'رسالة جديدة',
      message: `لديك رسالة جديدة من ${fromUser} بخصوص إعلان "${listingTitle}"`,
      type: 'message',
      data: {
        conversationId,
        listingId,
        fromUserId: fromUser
      }
    });
  }, [addNotification, user]);

  const createFavoriteNotification = React.useCallback((listingTitle: string, listingId: string) => {
    if (!user) return;
    
    addNotification({
      userId: user.id,
      title: 'إضافة للمفضلة',
      message: `تم إضافة إعلان "${listingTitle}" إلى قائمة المفضلة`,
      type: 'favorite',
      data: {
        listingId
      }
    });
  }, [addNotification, user]);

  const createListingNotification = React.useCallback((title: string, message: string, listingId: string, data?: any) => {
    if (!user) return;
    
    addNotification({
      userId: user.id,
      title,
      message,
      type: 'listing',
      data: {
        listingId,
        ...data
      }
    });
  }, [addNotification, user]);

  const createAlertNotification = React.useCallback((title: string, message: string, data?: any) => {
    if (!user) return;
    
    addNotification({
      userId: user.id,
      title,
      message,
      type: 'alert',
      data
    });
  }, [addNotification, user]);

  return {
    createMessageNotification,
    createFavoriteNotification,
    createListingNotification,
    createAlertNotification
  };
}