import { useState } from 'react';
import { api } from '../services/api';
import { CreateListingData, Listing } from '../types';

interface UseCreateListingReturn {
  createListing: (data: CreateListingData) => Promise<Listing | null>;
  updateListing: (id: string, data: CreateListingData) => Promise<Listing | null>;
  loading: boolean;
  error: string;
}

export const useCreateListing = (): UseCreateListingReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createListing = async (data: CreateListingData): Promise<Listing | null> => {
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      const validation = validateListingData(data);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Process images if they are base64 strings
      const processedData = {
        ...data,
        images: await processImages(data.images)
      };

      // Submit to API
      const response = await api.post('/listings', processedData);
      
      // Return the created listing
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ في إنشاء الإعلان';
      setError(errorMessage);
      console.error('Error creating listing:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateListing = async (id: string, data: CreateListingData): Promise<Listing | null> => {
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      const validation = validateListingData(data);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Process images if they are base64 strings
      const processedData = {
        ...data,
        images: await processImages(data.images)
      };

      // Submit to API
      const response = await api.put(`/listings/${id}`, processedData);
      
      // Return the updated listing
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ في تحديث الإعلان';
      setError(errorMessage);
      console.error('Error updating listing:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createListing,
    updateListing,
    loading,
    error
  };
};

// Validation function
const validateListingData = (data: CreateListingData): { valid: boolean; error?: string } => {
  // Required fields validation
  if (!data.title?.trim()) {
    return { valid: false, error: 'عنوان الإعلان مطلوب' };
  }

  if (data.title.length < 5) {
    return { valid: false, error: 'عنوان الإعلان يجب أن يكون 5 أحرف على الأقل' };
  }

  if (!data.description?.trim()) {
    return { valid: false, error: 'وصف المنتج مطلوب' };
  }

  if (data.description.length < 20) {
    return { valid: false, error: 'الوصف يجب أن يكون 20 حرف على الأقل' };
  }

  if (!data.categoryId) {
    return { valid: false, error: 'يرجى اختيار القسم' };
  }

  if (!data.price || data.price <= 0) {
    return { valid: false, error: 'يرجى إدخال سعر صحيح' };
  }

  if (!data.city) {
    return { valid: false, error: 'يرجى اختيار المدينة' };
  }

  if (!data.condition) {
    return { valid: false, error: 'يرجى اختيار حالة المنتج' };
  }

  if (!data.phone?.trim()) {
    return { valid: false, error: 'رقم الهاتف مطلوب' };
  }

  if (!/^[0-9+\-\s]{10,15}$/.test(data.phone)) {
    return { valid: false, error: 'رقم الهاتف غير صحيح' };
  }

  if (!data.images || data.images.length === 0) {
    return { valid: false, error: 'يرجى إضافة صورة واحدة على الأقل' };
  }

  if (data.images.length > 10) {
    return { valid: false, error: 'يمكنك رفع 10 صور كحد أقصى' };
  }

  return { valid: true };
};

// Process images (convert base64 to URLs or handle file uploads)
const processImages = async (images: string[]): Promise<string[]> => {
  const processedImages: string[] = [];

  for (const image of images) {
    if (image.startsWith('data:image/')) {
      // This is a base64 image, in a real app you would upload it to a server
      // For now, we'll simulate an uploaded URL
      const mockUrl = `https://images.unsplash.com/photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}?w=800&h=600&fit=crop`;
      processedImages.push(mockUrl);
    } else if (image.startsWith('http')) {
      // This is already a URL
      processedImages.push(image);
    } else {
      // Handle other formats if needed
      processedImages.push(image);
    }
  }

  return processedImages;
};

// Helper function to generate mock image URLs
export const generateMockImageUrl = (category: string = 'product'): string => {
  const imageIds = {
    cars: ['1592840743244-4e35b0bf2ba1', '1605559424843-9e4c228bf2c2', '1549317661-de0e4db5884a'],
    electronics: ['1581091870628-12c2db35e4e', '1560472354-76eb10e75ad', '1542744173-05336fcc7ad4'],
    phones: ['1511707171634-5f897ff02aa1', '1574068468668-a05a11f24497', '1592750475338-74b58d9883e'],
    furniture: ['1555041469-a586c962d7', '1586023492206-27406c201e', '1549497538-1845532e7e2'],
    clothes: ['1434389677669-e08b4cac3105', '1489987707025-afc232f7ea0f', '1445205170230-053b83016050'],
    default: ['1560472354-76eb10e75ad', '1572635196-1ab94be53cc0', '1542744173-05336fcc7ad4']
  };

  const ids = imageIds[category as keyof typeof imageIds] || imageIds.default;
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  
  return `https://images.unsplash.com/photo-${randomId}?w=800&h=600&fit=crop&auto=format`;
};