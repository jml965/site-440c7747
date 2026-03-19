import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { User, RegisterData } from '../types';
import * as authService from '../services/authService';
import { getStoredUser, removeStoredUser, setStoredUser } from '../utils/authUtils';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = getStoredUser();
        if (storedUser && storedUser.token) {
          // Verify token is still valid
          const isValid = await authService.verifyToken(storedUser.token);
          if (isValid) {
            setUser(storedUser);
          } else {
            removeStoredUser();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        removeStoredUser();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      const userData: User = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        phone: response.user.phone,
        city: response.user.city,
        avatar: response.user.avatar,
        role: response.user.role || 'user',
        isEmailVerified: response.user.isEmailVerified || false,
        isPhoneVerified: response.user.isPhoneVerified || false,
        createdAt: response.user.createdAt,
        token: response.token
      };
      
      setUser(userData);
      setStoredUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      
      const userData: User = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        phone: response.user.phone,
        city: response.user.city,
        avatar: response.user.avatar,
        role: response.user.role || 'user',
        isEmailVerified: response.user.isEmailVerified || false,
        isPhoneVerified: response.user.isPhoneVerified || false,
        createdAt: response.user.createdAt,
        token: response.token
      };
      
      setUser(userData);
      setStoredUser(userData);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (user?.token) {
        await authService.logout(user.token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      removeStoredUser();
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user?.token) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(data, user.token);
      
      const newUserData: User = {
        ...user,
        ...updatedUser
      };
      
      setUser(newUserData);
      setStoredUser(newUserData);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    if (!user?.token) {
      throw new Error('No token to refresh');
    }

    try {
      const response = await authService.refreshToken(user.token);
      
      const updatedUser: User = {
        ...user,
        token: response.token
      };
      
      setUser(updatedUser);
      setStoredUser(updatedUser);
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};