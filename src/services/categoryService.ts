import { Category, Subcategory } from '../types';
import { categoriesData } from '../data/categoriesData';
import { api } from './api';

class CategoryService {
  async getAll(): Promise<Category[]> {
    try {
      // In a real app, this would be an API call
      // const response = await api.get('/categories');
      // return response.data;
      
      // For now, return mock data with a slight delay to simulate API
      await new Promise(resolve => setTimeout(resolve, 300));
      return categoriesData;
    } catch (error) {
      console.error('خطأ في تحميل الأقسام:', error);
      throw new Error('فشل في تحميل الأقسام');
    }
  }

  async getBySlug(slug: string): Promise<Category | null> {
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/categories/${slug}`);
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 200));
      const category = categoriesData.find(cat => cat.slug === slug);
      return category || null;
    } catch (error) {
      console.error('خطأ في تحميل القسم:', error);
      throw new Error('فشل في تحميل القسم');
    }
  }

  async getById(id: string): Promise<Category | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const category = categoriesData.find(cat => cat.id === id);
      return category || null;
    } catch (error) {
      console.error('خطأ في تحميل القسم:', error);
      throw new Error('فشل في تحميل القسم');
    }
  }

  async getSubcategories(categoryId: string): Promise<Subcategory[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const category = categoriesData.find(cat => cat.id === categoryId);
      return category?.subcategories || [];
    } catch (error) {
      console.error('خطأ في تحميل الأقسام الفرعية:', error);
      throw new Error('فشل في تحميل الأقسام الفرعية');
    }
  }

  async getPopular(limit: number = 8): Promise<Category[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return categoriesData
        .sort((a, b) => b.listingsCount - a.listingsCount)
        .slice(0, limit);
    } catch (error) {
      console.error('خطأ في تحميل الأقسام الشعبية:', error);
      throw new Error('فشل في تحميل الأقسام الشعبية');
    }
  }

  async search(query: string): Promise<Category[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const searchTerm = query.toLowerCase();
      return categoriesData.filter(category => 
        category.name.toLowerCase().includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm) ||
        category.subcategories?.some(sub => 
          sub.name.toLowerCase().includes(searchTerm)
        )
      );
    } catch (error) {
      console.error('خطأ في البحث عن الأقسام:', error);
      throw new Error('فشل في البحث عن الأقسام');
    }
  }

  async getCategoryStats(): Promise<{
    totalCategories: number;
    totalSubcategories: number;
    totalListings: number;
    mostPopular: Category;
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const totalCategories = categoriesData.length;
      const totalSubcategories = categoriesData.reduce(
        (acc, cat) => acc + (cat.subcategories?.length || 0), 
        0
      );
      const totalListings = categoriesData.reduce(
        (acc, cat) => acc + cat.listingsCount, 
        0
      );
      const mostPopular = categoriesData.reduce((prev, current) => 
        prev.listingsCount > current.listingsCount ? prev : current
      );

      return {
        totalCategories,
        totalSubcategories,
        totalListings,
        mostPopular
      };
    } catch (error) {
      console.error('خطأ في تحميل إحصائيات الأقسام:', error);
      throw new Error('فشل في تحميل إحصائيات الأقسام');
    }
  }

  // Admin methods
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    try {
      // In a real app, this would be an API call
      // const response = await api.post('/categories', categoryData);
      // return response.data;
      
      const newCategory: Category = {
        ...categoryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, this would update the backend
      categoriesData.push(newCategory);
      return newCategory;
    } catch (error) {
      console.error('خطأ في إنشاء القسم:', error);
      throw new Error('فشل في إنشاء القسم');
    }
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      // In a real app, this would be an API call
      // const response = await api.put(`/categories/${id}`, updates);
      // return response.data;
      
      const categoryIndex = categoriesData.findIndex(cat => cat.id === id);
      if (categoryIndex === -1) {
        throw new Error('القسم غير موجود');
      }
      
      const updatedCategory = {
        ...categoriesData[categoryIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      categoriesData[categoryIndex] = updatedCategory;
      return updatedCategory;
    } catch (error) {
      console.error('خطأ في تحديث القسم:', error);
      throw new Error('فشل في تحديث القسم');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      // In a real app, this would be an API call
      // await api.delete(`/categories/${id}`);
      
      const categoryIndex = categoriesData.findIndex(cat => cat.id === id);
      if (categoryIndex === -1) {
        throw new Error('القسم غير موجود');
      }
      
      categoriesData.splice(categoryIndex, 1);
    } catch (error) {
      console.error('خطأ في حذف القسم:', error);
      throw new Error('فشل في حذف القسم');
    }
  }

  async createSubcategory(
    categoryId: string, 
    subcategoryData: Omit<Subcategory, 'id' | 'categoryId' | 'createdAt' | 'updatedAt'>
  ): Promise<Subcategory> {
    try {
      const category = categoriesData.find(cat => cat.id === categoryId);
      if (!category) {
        throw new Error('القسم الرئيسي غير موجود');
      }
      
      const newSubcategory: Subcategory = {
        ...subcategoryData,
        id: Date.now().toString(),
        categoryId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (!category.subcategories) {
        category.subcategories = [];
      }
      category.subcategories.push(newSubcategory);
      
      return newSubcategory;
    } catch (error) {
      console.error('خطأ في إنشاء القسم الفرعي:', error);
      throw new Error('فشل في إنشاء القسم الفرعي');
    }
  }

  async updateSubcategory(id: string, updates: Partial<Subcategory>): Promise<Subcategory> {
    try {
      for (const category of categoriesData) {
        if (category.subcategories) {
          const subcategoryIndex = category.subcategories.findIndex(sub => sub.id === id);
          if (subcategoryIndex !== -1) {
            const updatedSubcategory = {
              ...category.subcategories[subcategoryIndex],
              ...updates,
              updatedAt: new Date().toISOString()
            };
            category.subcategories[subcategoryIndex] = updatedSubcategory;
            return updatedSubcategory;
          }
        }
      }
      throw new Error('القسم الفرعي غير موجود');
    } catch (error) {
      console.error('خطأ في تحديث القسم الفرعي:', error);
      throw new Error('فشل في تحديث القسم الفرعي');
    }
  }

  async deleteSubcategory(id: string): Promise<void> {
    try {
      for (const category of categoriesData) {
        if (category.subcategories) {
          const subcategoryIndex = category.subcategories.findIndex(sub => sub.id === id);
          if (subcategoryIndex !== -1) {
            category.subcategories.splice(subcategoryIndex, 1);
            return;
          }
        }
      }
      throw new Error('القسم الفرعي غير موجود');
    } catch (error) {
      console.error('خطأ في حذف القسم الفرعي:', error);
      throw new Error('فشل في حذف القسم الفرعي');
    }
  }
}

export const categoriesService = new CategoryService();