import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Eye, Edit, Trash2, Heart, MapPin, Calendar, Package, Filter, Search } from 'lucide-react';
import { Listing } from '../types';
import { formatDate, formatPrice } from '../utils/helpers';

interface UserListingsProps {
  userId?: string;
  showManagement?: boolean;
  showFavorites?: boolean;
  limit?: number;
  className?: string;
}

const UserListings: React.FC<UserListingsProps> = ({
  userId,
  showManagement = false,
  showFavorites = false,
  limit,
  className = ''
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'sold'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for user listings
  const mockListings: Listing[] = [
    {
      id: '1',
      title: 'iPhone 13 Pro Max حالة ممتازة',
      description: 'جهاز iPhone 13 Pro Max بحالة ممتازة، لون أزرق، 256GB',
      price: 3200,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop'],
      category: 'electronics',
      condition: 'excellent',
      city: 'الرياض',
      userId: '1',
      status: 'active',
      views: 145,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      isPromoted: true
    },
    {
      id: '2',
      title: 'سيارة كامري 2020',
      description: 'سيارة تويوتا كامري موديل 2020، ماشية 45 ألف كم فقط',
      price: 85000,
      images: ['https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop'],
      category: 'cars',
      condition: 'good',
      city: 'جدة',
      userId: '1',
      status: 'active',
      views: 89,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'طقم أثاث غرفة معيشة',
      description: 'طقم أثاث كامل لغرفة المعيشة، حالة جيدة جداً',
      price: 1800,
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'],
      category: 'furniture',
      condition: 'good',
      city: 'الرياض',
      userId: '1',
      status: 'sold',
      views: 67,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '4',
      title: 'دراجة هوائية جبلية',
      description: 'دراجة هوائية جبلية عالية الجودة، مستعملة قليل',
      price: 450,
      images: ['https://images.unsplash.com/photo-1544191696-15693072ab80?w=600&h=400&fit=crop'],
      category: 'sports',
      condition: 'excellent',
      city: 'الدمام',
      userId: '1',
      status: 'inactive',
      views: 23,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredListings = [...mockListings];
      
      // Apply filters
      if (filter !== 'all') {
        filteredListings = filteredListings.filter(listing => listing.status === filter);
      }
      
      if (searchTerm) {
        filteredListings = filteredListings.filter(listing =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (limit) {
        filteredListings = filteredListings.slice(0, limit);
      }
      
      setListings(filteredListings);
      setLoading(false);
    };

    loadListings();
  }, [userId, showFavorites, filter, searchTerm, limit]);

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: 'نشط', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'غير نشط', className: 'bg-gray-100 text-gray-800' },
      sold: { label: 'مباع', className: 'bg-blue-100 text-blue-800' },
      pending: { label: 'قيد المراجعة', className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const badge = badges[status as keyof typeof badges] || badges.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  const handleDelete = (listingId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      setListings(prev => prev.filter(listing => listing.id !== listingId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12" dir="rtl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`${className}`} dir="rtl">
      {/* Controls */}
      {showManagement && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث في إعلاناتك..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع الإعلانات</option>
            <option value="active">النشطة</option>
            <option value="inactive">غير النشطة</option>
            <option value="sold">المباعة</option>
          </select>
          
          {/* View Mode */}
          <div className="flex border border-gray-200 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {listings.length === 0 ? (
        <div className="text-center py-12">
          {showFavorites ? (
            <>
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد إعلانات مفضلة</h3>
              <p className="text-gray-600">لم تقم بحفظ أي إعلانات في المفضلة بعد</p>
            </>
          ) : (
            <>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد إعلانات</h3>
              <p className="text-gray-600 mb-4">لم تقم بنشر أي إعلانات بعد</p>
              {showManagement && (
                <button
                  onClick={() => navigate('/create-listing')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  إضافة إعلان جديد
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        /* Listings Grid/List */
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {listings.map((listing) => (
            <div
              key={listing.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(listing.status)}
                </div>
                
                {/* Views */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">
                  <Eye className="inline h-3 w-3 ml-1" />
                  {listing.views}
                </div>
                
                {/* Promoted Badge */}
                {listing.isPromoted && (
                  <div className="absolute bottom-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    مميز
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {listing.title}
                </h3>
                
                <p className="text-2xl font-bold text-blue-600 mb-3">{formatPrice(listing.price)}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(listing.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                {showManagement ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/listing/${listing.id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      عرض
                    </button>
                    <button
                      onClick={() => navigate(`/listing/${listing.id}/edit`)}
                      className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/listing/${listing.id}`)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    عرض التفاصيل
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {!limit && listings.length > 0 && listings.length % 9 === 0 && (
        <div className="text-center mt-8">
          <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            تحميل المزيد
          </button>
        </div>
      )}
    </div>
  );
};

export default UserListings;