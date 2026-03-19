import { Listing, FilterOptions } from '../types';

interface GetAllOptions {
  filters?: FilterOptions;
  sortBy?: 'newest' | 'oldest' | 'price-low-high' | 'price-high-low' | 'most-viewed' | 'featured' | 'trending';
  page?: number;
  limit?: number;
}

interface GetAllResponse {
  data: Listing[];
  totalPages: number;
  totalCount: number;
  page: number;
  limit: number;
}

// Mock data for demonstration - in a real app, this would come from an API
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'آيفون 14 برو ماكس 256 جيجا - حالة ممتازة',
    description: 'آيفون 14 برو ماكس باللون البنفسجي العميق، بذاكرة 256 جيجا، مستعمل بحالة ممتازة، بدون خدوش أو عيوب. يشمل العلبة الأصلية وجميع الملحقات. بطارية ممتازة، لم يتم إصلاحه من قبل.',
    price: 4200,
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=400&fit=crop'
    ],
    category: 'جوالات',
    categoryId: '3',
    condition: 'مستعمل بحالة ممتازة',
    city: 'الرياض',
    sellerName: 'أحمد محمد',
    phoneNumber: '+966501234567',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    views: 245,
    featured: true,
    userId: 'user1'
  },
  {
    id: '2',
    title: 'لابتوب MacBook Air M2 - 2022',
    description: 'ماك بوك إير M2 موديل 2022، باللون الفضي، رام 8 جيجا، تخزين 256 SSD، مستعمل لفترة قصيرة، بحالة ممتازة. يشمل الشاحن الأصلي والعلبة.',
    price: 5800,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop'
    ],
    category: 'إلكترونيات',
    categoryId: '4',
    condition: 'مستعمل بحالة ممتازة',
    city: 'جدة',
    sellerName: 'سارة أحمد',
    phoneNumber: '+966507654321',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    views: 189,
    featured: false,
    userId: 'user2'
  },
  {
    id: '3',
    title: 'سيارة تويوتا كامري 2020 - قليلة الاستعمال',
    description: 'تويوتا كامري موديل 2020، لون أبيض لؤلؤي، ممشى 45,000 كيلو فقط، سيرفس منتظم في الوكالة، بحالة ممتازة، بدون حوادث أو أضرار.',
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop'
    ],
    category: 'سيارات',
    categoryId: '1',
    condition: 'مستعمل بحالة ممتازة',
    city: 'الدمام',
    sellerName: 'محمد العلي',
    phoneNumber: '+966551234567',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    views: 432,
    featured: true,
    userId: 'user3'
  },
  {
    id: '4',
    title: 'شقة للبيع - حي النرجس، الرياض',
    description: 'شقة مفروشة بالكامل في حي النرجس، 3 غرف نوم، صالة كبيرة، مطبخ مجهز، 2 حمام، مساحة 150 متر مربع، الدور الثالث، مع موقف سيارة.',
    price: 420000,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop'
    ],
    category: 'عقارات',
    categoryId: '2',
    condition: 'مستعمل بحالة جيدة',
    city: 'الرياض',
    sellerName: 'عبدالله السعد',
    phoneNumber: '+966503456789',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    views: 156,
    featured: false,
    userId: 'user4'
  },
  {
    id: '5',
    title: 'طقم صالة مودرن - 7 قطع',
    description: 'طقم صالة مودرن مكون من كنبة 3 مقاعد + كنبتين فردي + طاولة وسط + 2 طاولة جانبية + بوفيه. اللون بني فاتح، حالة ممتازة، استعمال خفيف.',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=400&fit=crop'
    ],
    category: 'أثاث',
    categoryId: '5',
    condition: 'مستعمل بحالة ممتازة',
    city: 'جدة',
    sellerName: 'فاطمة أحمد',
    phoneNumber: '+966559876543',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T11:30:00Z',
    views: 98,
    featured: false,
    userId: 'user5'
  },
  {
    id: '6',
    title: 'غسالة سامسونج أتوماتيك 9 كيلو',
    description: 'غسالة سامسونج أتوماتيك سعة 9 كيلو، موديل حديث، عمر الجهاز سنتين، تعمل بكفاءة عالية، بدون أعطال، مع ضمان 6 أشهر من المحل.',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    ],
    category: 'أجهزة منزلية',
    categoryId: '6',
    condition: 'مستعمل بحالة جيدة',
    city: 'مكة المكرمة',
    sellerName: 'خالد محمد',
    phoneNumber: '+966504567890',
    createdAt: '2024-01-10T08:20:00Z',
    updatedAt: '2024-01-10T08:20:00Z',
    views: 67,
    featured: false,
    userId: 'user6'
  },
  {
    id: '7',
    title: 'ساعة أبل سيريز 8 - 45mm',
    description: 'ساعة أبل سيريز 8 مقاس 45mm باللون الأزرق، مع سوار رياضي أصلي، بحالة ممتازة، تشمل الشاحن الأصلي والعلبة.',
    price: 1800,
    images: [
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop'
    ],
    category: 'ساعات وإكسسوارات',
    categoryId: '8',
    condition: 'مستعمل بحالة ممتازة',
    city: 'الرياض',
    sellerName: 'نورا علي',
    phoneNumber: '+966512345678',
    createdAt: '2024-01-09T13:10:00Z',
    updatedAt: '2024-01-09T13:10:00Z',
    views: 123,
    featured: true,
    userId: 'user7'
  },
  {
    id: '8',
    title: 'دراجة هوائية جبلية - Trek',
    description: 'دراجة هوائية جبلية من Trek، موديل حديث، مقاس L، مناسبة للطول من 175-185 سم، بحالة ممتازة، تم تنظيفها وصيانتها حديثاً.',
    price: 1500,
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544191696-15693072c5ec?w=600&h=400&fit=crop'
    ],
    category: 'رياضة',
    categoryId: '11',
    condition: 'مستعمل بحالة ممتازة',
    city: 'جدة',
    sellerName: 'عمر سالم',
    phoneNumber: '+966598765432',
    createdAt: '2024-01-08T15:25:00Z',
    updatedAt: '2024-01-08T15:25:00Z',
    views: 89,
    featured: false,
    userId: 'user8'
  },
  {
    id: '9',
    title: 'عربة أطفال من شيكو - حالة جيدة',
    description: 'عربة أطفال من ماركة شيكو، لون أزرق، قابلة للطي، خفيفة الوزن، مناسبة من الولادة حتى 3 سنوات، تشمل حقيبة حفاضات.',
    price: 450,
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop'
    ],
    category: 'مستلزمات أطفال',
    categoryId: '10',
    condition: 'مستعمل بحالة جيدة',
    city: 'الدمام',
    sellerName: 'هند محمد',
    phoneNumber: '+966556789012',
    createdAt: '2024-01-07T12:40:00Z',
    updatedAt: '2024-01-07T12:40:00Z',
    views: 76,
    featured: false,
    userId: 'user9'
  },
  {
    id: '10',
    title: 'آلة صنع القهوة ديلونجي',
    description: 'آلة صنع القهوة من ديلونجي، موديل EC155، تصنع قهوة إسبريسو وكابتشينو، بحالة ممتازة، نظيفة ومعتنى بها، تشمل جميع الملحقات.',
    price: 380,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop'
    ],
    category: 'أجهزة منزلية',
    categoryId: '6',
    condition: 'مستعمل بحالة ممتازة',
    city: 'الرياض',
    sellerName: 'ياسر أحمد',
    phoneNumber: '+966523456789',
    createdAt: '2024-01-06T09:55:00Z',
    updatedAt: '2024-01-06T09:55:00Z',
    views: 54,
    featured: false,
    userId: 'user10'
  }
];

class ListingService {
  private readonly STORAGE_KEY = 'marketplace_listings';
  private readonly VIEWS_KEY = 'listing_views';

  // Get stored listings or return mock data
  private getStoredListings(): Listing[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : mockListings;
    } catch {
      return mockListings;
    }
  }

  // Save listings to localStorage
  private saveListings(listings: Listing[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(listings));
    } catch (error) {
      console.error('Error saving listings:', error);
    }
  }

  // Apply filters to listings
  private applyFilters(listings: Listing[], filters: FilterOptions): Listing[] {
    let filtered = [...listings];

    if (filters.categoryId) {
      filtered = filtered.filter(listing => listing.categoryId === filters.categoryId);
    }

    if (filters.city) {
      filtered = filtered.filter(listing => listing.city === filters.city);
    }

    if (filters.condition) {
      filtered = filtered.filter(listing => listing.condition === filters.condition);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(listing => listing.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(listing => listing.price <= filters.maxPrice!);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm) ||
        listing.category.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  // Apply sorting to listings
  private applySorting(
    listings: Listing[], 
    sortBy: 'newest' | 'oldest' | 'price-low-high' | 'price-high-low' | 'most-viewed' | 'featured' | 'trending'
  ): Listing[] {
    const sorted = [...listings];

    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      
      case 'most-viewed':
        return sorted.sort((a, b) => b.views - a.views);
      
      case 'featured':
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      
      case 'trending':
        // For trending, we can use a combination of views and recency
        return sorted.sort((a, b) => {
          const aScore = a.views * 0.7 + (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24) * 0.3;
          const bScore = b.views * 0.7 + (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24) * 0.3;
          return bScore - aScore;
        });
      
      default:
        return sorted;
    }
  }

  // Simulate API delay
  private async delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all listings with filters, sorting, and pagination
  async getAll(options: GetAllOptions = {}): Promise<GetAllResponse> {
    await this.delay();
    
    const {
      filters = {},
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = options;

    let listings = this.getStoredListings();
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      listings = this.applyFilters(listings, filters);
    }
    
    // Apply sorting
    listings = this.applySorting(listings, sortBy);
    
    // Calculate pagination
    const totalCount = listings.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedListings = listings.slice(startIndex, endIndex);

    return {
      data: paginatedListings,
      totalPages,
      totalCount,
      page,
      limit
    };
  }

  // Get listing by ID
  async getById(id: string): Promise<Listing> {
    await this.delay();
    
    const listings = this.getStoredListings();
    const listing = listings.find(l => l.id === id);
    
    if (!listing) {
      throw new Error('لم يتم العثور على الإعلان');
    }
    
    return listing;
  }

  // Get related listings (same category, excluding current)
  async getRelated(listingId: string, categoryId: string, limit: number = 4): Promise<Listing[]> {
    await this.delay();
    
    const listings = this.getStoredListings();
    const related = listings
      .filter(l => l.categoryId === categoryId && l.id !== listingId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    return related;
  }

  // Get featured listings
  async getFeatured(limit: number = 6): Promise<Listing[]> {
    await this.delay();
    
    const listings = this.getStoredListings();
    return listings
      .filter(l => l.featured)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Get latest listings
  async getLatest(limit: number = 8): Promise<Listing[]> {
    await this.delay();
    
    const listings = this.getStoredListings();
    return listings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Search listings
  async search(query: string, limit: number = 10): Promise<Listing[]> {
    await this.delay();
    
    if (!query.trim()) return [];
    
    const listings = this.getStoredListings();
    const searchTerm = query.toLowerCase();
    
    return listings
      .filter(listing => 
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm) ||
        listing.category.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => {
        // Prioritize title matches
        const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
        const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
        
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        
        // Then by recency
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, limit);
  }

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    try {
      const listings = this.getStoredListings();
      const listingIndex = listings.findIndex(l => l.id === id);
      
      if (listingIndex !== -1) {
        // Check if we've already counted a view for this listing in this session
        const viewedKey = `${this.VIEWS_KEY}_${id}`;
        const hasViewed = sessionStorage.getItem(viewedKey);
        
        if (!hasViewed) {
          listings[listingIndex].views += 1;
          this.saveListings(listings);
          sessionStorage.setItem(viewedKey, 'true');
        }
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }

  // Get listings by user ID
  async getByUserId(userId: string): Promise<Listing[]> {
    await this.delay();
    
    const listings = this.getStoredListings();
    return listings
      .filter(l => l.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Get listings by category
  async getByCategory(categoryId: string, limit?: number): Promise<Listing[]> {
    await this.delay();
    
    const listings = this.getStoredListings();
    let categoryListings = listings
      .filter(l => l.categoryId === categoryId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (limit) {
      categoryListings = categoryListings.slice(0, limit);
    }
    
    return categoryListings;
  }

  // Get popular listings (most viewed)
  async getPopular(limit: number = 6): Promise<Listing[]> {
    await this.delay();
    
    const listings = this.getStoredListings();
    return listings
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }
}

export const listingService = new ListingService();