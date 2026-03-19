import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, MapPin, Calendar } from 'lucide-react';
import ListingGrid from '../components/ListingGrid';
import ListingFilter from '../components/ListingFilter';
import ListingSort from '../components/ListingSort';
import PaginationComponent from '../components/PaginationComponent';
import { useListings } from '../hooks/useListings';
import { Listing, FilterOptions } from '../types';
import { useSearchParams, Link } from 'react-router-dom';

const Listings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilter, setShowFilter] = useState(false);
  
  const categoryId = searchParams.get('category');
  const city = searchParams.get('city');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const condition = searchParams.get('condition');
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const filters: FilterOptions = {
    categoryId: categoryId || undefined,
    city: city || undefined,
    minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
    condition: condition as 'جديد' | 'مستعمل بحالة ممتازة' | 'مستعمل بحالة جيدة' | 'مستعمل' | undefined,
    search: searchQuery || undefined
  };
  
  const { listings, loading, totalPages, totalCount } = useListings({
    filters,
    sortBy: sortBy as any,
    page,
    limit: 12
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });
    
    newParams.set('page', '1');
    setSearchParams(newParams);
    setShowFilter(false);
  };

  const handleSortChange = (newSortBy: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', newSortBy);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">الإعلانات</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilter || activeFiltersCount > 0
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                تصفية
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-blue-600 text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  مسح الفلاتر
                </button>
              )}
              
              <div className="text-sm text-gray-600">
                {totalCount} إعلان
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ListingSort currentSort={sortBy} onSortChange={handleSortChange} />
              
              <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Panel */}
        {showFilter && (
          <div className="mb-8">
            <ListingFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilter(false)}
            />
          </div>
        )}
        
        {/* Breadcrumb */}
        {categoryId && (
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 space-x-reverse">
              <li>
                <Link to="/" className="text-blue-600 hover:text-blue-700">
                  الرئيسية
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link to="/categories" className="text-blue-600 hover:text-blue-700">
                  الأقسام
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-900 font-medium">
                القسم الحالي
              </li>
            </ol>
          </nav>
        )}
        
        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                لا توجد إعلانات
              </h3>
              <p className="text-gray-600 mb-6">
                لم نجد إعلانات تطابق معايير البحث الخاصة بك. جرب تعديل الفلاتر أو البحث عن شيء آخر.
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                مسح جميع الفلاتر
              </button>
            </div>
          </div>
        ) : (
          <>
            <ListingGrid listings={listings} viewMode={viewMode} />
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <PaginationComponent
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Listings;