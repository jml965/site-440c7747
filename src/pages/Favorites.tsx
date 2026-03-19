import React from 'react';
import { Heart, Search, Filter } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import FavoritesList from '../components/FavoritesList';
import EmptyFavorites from '../components/EmptyFavorites';
import { useAuth } from '../contexts/AppContext';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { favorites, isLoading, error, searchQuery, setSearchQuery, sortBy, setSortBy } = useFavorites();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-gray-600 mb-4">يجب تسجيل الدخول لعرض الإعلانات المفضلة</p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">الإعلانات المفضلة</h1>
                <p className="text-gray-600">الإعلانات التي قمت بحفظها</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {favorites.length} إعلان محفوظ
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        {favorites.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="ابحث في المفضلة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="md:w-64">
                <div className="relative">
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="newest">الأحدث إضافة</option>
                    <option value="oldest">الأقدم إضافة</option>
                    <option value="price_high">السعر من الأعلى</option>
                    <option value="price_low">السعر من الأقل</option>
                    <option value="title">الترتيب الأبجدي</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">جاري تحميل المفضلة...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          favorites.length === 0 ? (
            <EmptyFavorites />
          ) : (
            <FavoritesList favorites={favorites} />
          )
        )}
      </div>
    </div>
  );
};

export default Favorites;