import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Grid, List, Eye, Edit, Trash2, ToggleLeft, ToggleRight, Calendar, MapPin, DollarSign, Package } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { Listing } from '../types';
import { formatDate, formatPrice } from '../utils/helpers';

const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const { listings, loading, updateListing, deleteListing } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'sold'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low' | 'views'>('newest');

  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (!listings) return;
    
    let filtered = [...listings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => {
        switch (statusFilter) {
          case 'active':
            return listing.status === 'active';
          case 'inactive':
            return listing.status === 'inactive';
          case 'sold':
            return listing.status === 'sold';
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  }, [listings, searchTerm, statusFilter, sortBy]);

  const handleStatusToggle = async (listing: Listing) => {
    const newStatus = listing.status === 'active' ? 'inactive' : 'active';
    await updateListing(listing.id, { status: newStatus });
  };

  const handleDelete = async (listingId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      await deleteListing(listingId);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">إعلاناتي</h1>
                <p className="mt-2 text-gray-600">إدارة جميع إعلاناتك في مكان واحد</p>
              </div>
              <button
                onClick={() => navigate('/create-listing')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                إضافة إعلان جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ابحث في إعلاناتك..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">الإعلانات النشطة</option>
              <option value="inactive">الإعلانات غير النشطة</option>
              <option value="sold">الإعلانات المباعة</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
              <option value="price-high">الأغلى أولاً</option>
              <option value="price-low">الأرخص أولاً</option>
              <option value="views">الأكثر مشاهدة</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white p-3 rounded-xl">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي الإعلانات</p>
                <p className="text-2xl font-bold text-gray-900">{listings?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 text-white p-3 rounded-xl">
                <ToggleRight className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">الإعلانات النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listings?.filter(l => l.status === 'active').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 text-white p-3 rounded-xl">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listings?.reduce((total, l) => total + (l.views || 0), 0) || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-600 text-white p-3 rounded-xl">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">متوسط السعر</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listings?.length ? formatPrice(listings.reduce((total, l) => total + l.price, 0) / listings.length) : '0 ر.س'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد إعلانات</h3>
            <p className="text-gray-600 mb-6">لم تقم بإضافة أي إعلانات بعد</p>
            <button
              onClick={() => navigate('/create-listing')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              إضافة إعلان جديد
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                  <img
                    src={listing.images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(listing.status)}
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">
                    <Eye className="inline h-3 w-3 ml-1" />
                    {listing.views || 0}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>
                    <button
                      onClick={() => handleStatusToggle(listing)}
                      className="mr-2 flex-shrink-0"
                    >
                      {listing.status === 'active' ? (
                        <ToggleRight className="h-6 w-6 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                  </div>

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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/listing/${listing.id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      عرض
                    </button>
                    <button
                      onClick={() => navigate(`/listing/${listing.id}/edit`)}
                      className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 text-sm"
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;