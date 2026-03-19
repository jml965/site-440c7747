import { api } from './api';
import { Listing } from '../types';

export interface FavoriteResponse {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
  listing: Listing;
}

export interface AddFavoriteRequest {
  listingId: string;
}

export interface FavoriteStats {
  total: number;
  thisMonth: number;
  categories: {
    categoryId: string;
    categoryName: string;
    count: number;
  }[];
}

class FavoriteService {
  private baseUrl = '/api/favorites';

  // Get user's favorites
  async getFavorites(): Promise<Listing[]> {
    try {
      const response = await api.get<{ favorites: FavoriteResponse[] }>(this.baseUrl);
      return response.data.favorites.map(fav => fav.listing);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw new Error('فشل في تحميل المفضلة');
    }
  }

  // Add listing to favorites
  async addFavorite(listingId: string): Promise<FavoriteResponse> {
    try {
      const response = await api.post<{ favorite: FavoriteResponse }>(this.baseUrl, {
        listingId
      });
      return response.data.favorite;
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      
      if (error.response?.status === 409) {
        throw new Error('الإعلان موجود في المفضلة بالفعل');
      }
      if (error.response?.status === 404) {
        throw new Error('الإعلان غير موجود');
      }
      
      throw new Error('فشل في إضافة الإعلان إلى المفضلة');
    }
  }

  // Remove listing from favorites
  async removeFavorite(listingId: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${listingId}`);
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      
      if (error.response?.status === 404) {
        throw new Error('الإعلان غير موجود في المفضلة');
      }
      
      throw new Error('فشل في إزالة الإعلان من المفضلة');
    }
  }

  // Check if listing is favorite
  async isFavorite(listingId: string): Promise<boolean> {
    try {
      const response = await api.get<{ isFavorite: boolean }>(`${this.baseUrl}/check/${listingId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  // Get favorites count
  async getFavoritesCount(): Promise<number> {
    try {
      const response = await api.get<{ count: number }>(`${this.baseUrl}/count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching favorites count:', error);
      return 0;
    }
  }

  // Clear all favorites
  async clearFavorites(): Promise<void> {
    try {
      await api.delete(this.baseUrl);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw new Error('فشل في مسح المفضلة');
    }
  }

  // Get favorite statistics
  async getFavoriteStats(): Promise<FavoriteStats> {
    try {
      const response = await api.get<{ stats: FavoriteStats }>(`${this.baseUrl}/stats`);
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching favorite stats:', error);
      throw new Error('فشل في تحميل إحصائيات المفضلة');
    }
  }

  // Bulk operations
  async addMultipleFavorites(listingIds: string[]): Promise<FavoriteResponse[]> {
    try {
      const response = await api.post<{ favorites: FavoriteResponse[] }>(`${this.baseUrl}/bulk`, {
        listingIds
      });
      return response.data.favorites;
    } catch (error) {
      console.error('Error adding multiple favorites:', error);
      throw new Error('فشل في إضافة الإعلانات إلى المفضلة');
    }
  }

  async removeMultipleFavorites(listingIds: string[]): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/bulk`, {
        data: { listingIds }
      });
    } catch (error) {
      console.error('Error removing multiple favorites:', error);
      throw new Error('فشل في إزالة الإعلانات من المفضلة');
    }
  }

  // Get favorites by category
  async getFavoritesByCategory(categoryId: string): Promise<Listing[]> {
    try {
      const response = await api.get<{ favorites: FavoriteResponse[] }>(
        `${this.baseUrl}/category/${categoryId}`
      );
      return response.data.favorites.map(fav => fav.listing);
    } catch (error) {
      console.error('Error fetching favorites by category:', error);
      throw new Error('فشل في تحميل المفضلة للقسم');
    }
  }

  // Search favorites
  async searchFavorites(query: string): Promise<Listing[]> {
    try {
      const response = await api.get<{ favorites: FavoriteResponse[] }>(
        `${this.baseUrl}/search?q=${encodeURIComponent(query)}`
      );
      return response.data.favorites.map(fav => fav.listing);
    } catch (error) {
      console.error('Error searching favorites:', error);
      throw new Error('فشل في البحث في المفضلة');
    }
  }

  // Export favorites
  async exportFavorites(format: 'json' | 'csv' = 'json'): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting favorites:', error);
      throw new Error('فشل في تصدير المفضلة');
    }
  }
}

export const favoriteService = new FavoriteService();