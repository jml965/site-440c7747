import { useState, useEffect } from 'react';
import { User, Listing } from '../types';
import { profileService } from '../services/profileService';

interface ProfileStats {
  totalListings: number;
  activeListings: number;
  inactiveListings: number;
  soldItems: number;
  favorites: number;
  unreadMessages: number;
  totalSales: number;
  rating: number;
  reviewCount: number;
  responseRate: number;
  responseTime: string;
  profileViews: number;
  joinedAt: Date;
}

interface UseProfileReturn {
  profile: User | null;
  stats: ProfileStats | null;
  listings: Listing[];
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateListing: (listingId: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (listingId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useProfile = (userId?: string): UseProfileReturn => {
  const [profile, setProfile] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock current user data
  const mockProfile: User = {
    id: userId || 'current-user',
    name: 'أحمد محمد العلي',
    email: 'ahmed@example.com',
    phone: '0551234567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    city: 'الرياض',
    bio: 'بائع موثوق مع خبرة في بيع الإلكترونيات والسيارات. أقدم أفضل الأسعار وأضمن جودة المنتجات.',
    isVerified: true,
    role: 'user',
    status: 'active',
    joinedAt: new Date('2023-06-15'),
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-15')
  };

  const mockStats: ProfileStats = {
    totalListings: 15,
    activeListings: 8,
    inactiveListings: 2,
    soldItems: 5,
    favorites: 12,
    unreadMessages: 3,
    totalSales: 5,
    rating: 4.8,
    reviewCount: 24,
    responseRate: 95,
    responseTime: 'خلال ساعة',
    profileViews: 156,
    joinedAt: new Date('2023-06-15')
  };

  const mockListings: Listing[] = [
    {
      id: '1',
      title: 'iPhone 13 Pro Max حالة ممتازة',
      description: 'جهاز iPhone 13 Pro Max بحالة ممتازة، لون أزرق، 256GB، مع جميع الاكسسوارات الأصلية والكرتون.',
      price: 3200,
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop'
      ],
      category: 'electronics',
      condition: 'excellent',
      city: 'الرياض',
      userId: 'current-user',
      status: 'active',
      views: 145,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      isPromoted: true
    },
    {
      id: '2',
      title: 'سيارة كامري 2020 فل كامل',
      description: 'سيارة تويوتا كامري موديل 2020، ماشية 45 ألف كم فقط، فل كامل، حالة ممتازة.',
      price: 85000,
      images: [
        'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop'
      ],
      category: 'cars',
      condition: 'excellent',
      city: 'جدة',
      userId: 'current-user',
      status: 'active',
      views: 89,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'طقم أثاث غرفة معيشة كامل',
      description: 'طقم أثاث كامل لغرفة المعيشة، يشمل كنب وطاولة وستارة، حالة جيدة جداً.',
      price: 1800,
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop'
      ],
      category: 'furniture',
      condition: 'good',
      city: 'الرياض',
      userId: 'current-user',
      status: 'sold',
      views: 67,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '4',
      title: 'دراجة هوائية جبلية احترافية',
      description: 'دراجة هوائية جبلية عالية الجودة، مناسبة للمحترفين، مستعملة قليل.',
      price: 450,
      images: [
        'https://images.unsplash.com/photo-1544191696-15693072ab80?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop'
      ],
      category: 'sports',
      condition: 'excellent',
      city: 'الدمام',
      userId: 'current-user',
      status: 'inactive',
      views: 23,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '5',
      title: 'جهاز PlayStation 5 مع ألعاب',
      description: 'جهاز PlayStation 5 مع مجموعة من الألعاب الحصرية، حالة ممتازة.',
      price: 2100,
      images: [
        'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&h=400&fit=crop'
      ],
      category: 'electronics',
      condition: 'excellent',
      city: 'الرياض',
      userId: 'current-user',
      status: 'active',
      views: 78,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12')
    }
  ];

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (userId && userId !== 'current-user') {
        // Load another user's profile
        const userProfile = await profileService.getUserProfile(userId);
        setProfile(userProfile);
        setStats(null); // Other users' detailed stats are not visible
        setListings(userProfile.listings || []);
      } else {
        // Load current user's profile
        setProfile(mockProfile);
        setStats(mockStats);
        setListings(mockListings);
      }
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات');
      console.error('Profile loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile locally
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      // Call API service
      await profileService.updateProfile(data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في تحديث الملف الشخصي');
      throw err;
    }
  };

  const updateListing = async (listingId: string, data: Partial<Listing>) => {
    try {
      setError(null);
      
      // Update listing locally
      setListings(prev => 
        prev.map(listing => 
          listing.id === listingId ? { ...listing, ...data } : listing
        )
      );
      
      // Update stats if status changed
      if (data.status) {
        setStats(prev => {
          if (!prev) return prev;
          
          const oldListing = listings.find(l => l.id === listingId);
          if (!oldListing) return prev;
          
          let activeChange = 0;
          let inactiveChange = 0;
          let soldChange = 0;
          
          // Remove old status count
          if (oldListing.status === 'active') activeChange--;
          if (oldListing.status === 'inactive') inactiveChange--;
          if (oldListing.status === 'sold') soldChange--;
          
          // Add new status count
          if (data.status === 'active') activeChange++;
          if (data.status === 'inactive') inactiveChange++;
          if (data.status === 'sold') soldChange++;
          
          return {
            ...prev,
            activeListings: prev.activeListings + activeChange,
            inactiveListings: prev.inactiveListings + inactiveChange,
            soldItems: prev.soldItems + soldChange
          };
        });
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call API service
      await profileService.updateListing(listingId, data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في تحديث الإعلان');
      throw err;
    }
  };

  const deleteListing = async (listingId: string) => {
    try {
      setError(null);
      
      const listingToDelete = listings.find(l => l.id === listingId);
      
      // Remove listing locally
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      
      // Update stats
      if (listingToDelete) {
        setStats(prev => {
          if (!prev) return prev;
          
          let activeChange = 0;
          let inactiveChange = 0;
          let soldChange = 0;
          
          if (listingToDelete.status === 'active') activeChange = -1;
          if (listingToDelete.status === 'inactive') inactiveChange = -1;
          if (listingToDelete.status === 'sold') soldChange = -1;
          
          return {
            ...prev,
            totalListings: prev.totalListings - 1,
            activeListings: prev.activeListings + activeChange,
            inactiveListings: prev.inactiveListings + inactiveChange,
            soldItems: prev.soldItems + soldChange
          };
        });
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call API service
      await profileService.deleteListing(listingId);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في حذف الإعلان');
      throw err;
    }
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  return {
    profile,
    stats,
    listings,
    loading,
    error,
    updateProfile,
    updateListing,
    deleteListing,
    refreshProfile
  };
};