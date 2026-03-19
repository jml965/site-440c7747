import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Grid, List, SlidersHorizontal } from 'lucide-react';
import CategoryFilter from '../components/CategoryFilter';
import SubcategoryList from '../components/SubcategoryList';
import { useCategoryListings } from '../hooks/useCategoryListings';
import { Category, Listing } from '../types';
import { categoriesService } from '../services/categoryService';

const CategoryListings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categorySlug = searchParams.get('category') || '';
  const subcategorySlug = searchParams.get('subcategory') || '';
  
  const [category, setCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    listings,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    loadMore
  } = useCategoryListings(categorySlug, subcategorySlug);

  useEffect(() => {
    const loadCategory = async () => {
      if (categorySlug) {
        try {
          const categoryData = await categoriesService.getBySlug(categorySlug);
          setCategory(categoryData);
        } catch (error) {
          console.error('خطأ في تحميل القسم:', error);
        }
      }
    };
    loadCategory();
  }, [categorySlug]);

  const handleSubcategorySelect = (subcategorySlug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (subcategorySlug) {
      newParams.set('subcategory', subcategorySlug);
    } else {
      newParams.delete('subcategory');
    }
    navigate({ search: newParams.toString() });
  };

  if (loading && !listings.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4 w-64"></div>
            <div className="h-8 bg-gray-300 rounded mb-6 w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-3 w-1/2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">خطأ في تحميل الإعلانات</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 space-x-reverse text-sm mb-6">
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            الرئيسية
          </button>
          <ChevronRight className="h-4 w-4 text-gray-400 rotate-180" />
          <button 
            onClick={() => navigate('/categories')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            الأقسام
          </button>
          {category && (
            <>
              <ChevronRight className="h-4 w-4 text-gray-400 rotate-180" />
              <span className="text-gray-600 font-medium">{category.name}</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {category?.name || 'الإعلانات'}
            </h1>
            <p className="text-gray-600">
              {pagination.total} إعلان متاح
            </p>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse mt-4 md:mt-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 space-x-reverse bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>الفلاتر</span>
            </button>
          </div>
        </div>

        {/* Subcategories */}
        {category?.subcategories && category.subcategories.length > 0 && (
          <div className="mb-8">
            <SubcategoryList
              subcategories={category.subcategories}
              selectedSubcategory={subcategorySlug}
              onSubcategorySelect={handleSubcategorySelect}
            />
          </div>
        )}

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <CategoryFilter
                filters={filters}
                onFiltersChange={setFilters}
                category={category}
              />
            </div>
          )}

          {/* Listings Grid/List */}
          <div className="flex-1">
            {listings.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <Grid className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  لا توجد إعلانات متاحة
                </h3>
                <p className="text-gray-500">
                  جرب تغيير الفلاتر أو البحث في قسم آخر
                </p>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {listings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} viewMode="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} viewMode="list" />
                    ))}
                  </div>
                )}

                {/* Load More */}
                {pagination.hasMore && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'جاري التحميل...' : 'تحميل المزيد'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Listing Card Component
interface ListingCardProps {
  listing: Listing;
  viewMode: 'grid' | 'list';
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, viewMode }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      >
        <div className="flex">
          <div className="relative w-48 h-36 flex-shrink-0">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-3 left-3 p-2 rounded-full transition-colors ${
                isFavorite ? 'bg-red-100 text-red-600' : 'bg-white/80 text-gray-600'
              }`}
            >
              <svg className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-4">
            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {listing.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {listing.description}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-blue-600">
                  {listing.price.toLocaleString('ar-SA')} ر.س
                </span>
                <div className="text-sm text-gray-500 mt-1">
                  {listing.city} • {new Date(listing.createdAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{listing.condition}</div>
                <div className="text-sm text-gray-600">{listing.category?.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      <div className="relative">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isFavorite ? 'bg-red-100 text-red-600' : 'bg-white/80 text-gray-600'
          }`}
        >
          <svg className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {listing.featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            مميز
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-blue-600">
            {listing.price.toLocaleString('ar-SA')} ر.س
          </span>
          <span className="text-sm text-gray-500">{listing.condition}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{listing.city}</span>
          <span>{new Date(listing.createdAt).toLocaleDateString('ar-SA')}</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryListings;