import React from 'react';
import { Heart, MapPin, Eye } from 'lucide-react';
import type { Listing } from '../types';
import { formatPrice, formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';

interface SimilarListingsProps {
  listings: Listing[];
  currentListingId?: string;
  onToggleFavorite?: (listingId: string) => void;
  favoriteIds?: string[];
}

export default function SimilarListings({ 
  listings, 
  currentListingId, 
  onToggleFavorite,
  favoriteIds = []
}: SimilarListingsProps) {
  // Filter out current listing if provided
  const filteredListings = currentListingId 
    ? listings.filter(listing => listing.id !== currentListingId)
    : listings;

  if (!filteredListings || filteredListings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          إعلانات مشابهة
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📦</div>
          <p className="text-gray-600">لا توجد إعلانات مشابهة متاحة</p>
        </div>
      </div>
    );
  }

  const handleFavoriteClick = (e: React.MouseEvent, listingId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(listingId);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        إعلانات مشابهة
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredListings.slice(0, 6).map((listing) => {
          const isFavorite = favoriteIds.includes(listing.id);
          const mainImage = listing.images && listing.images.length > 0 
            ? listing.images[0].url 
            : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';

          return (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={mainImage}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Favorite Button */}
                {onToggleFavorite && (
                  <button
                    onClick={(e) => handleFavoriteClick(e, listing.id)}
                    className={`absolute top-2 left-2 p-1.5 rounded-full backdrop-blur-sm transition-all ${
                      isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                )}

                {/* Status Badge */}
                {listing.status === 'sold' && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    تم البيع
                  </div>
                )}
                {listing.isFeatured && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded">
                    مميز
                  </div>
                )}

                {/* Views Count */}
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Eye size={12} />
                  <span>{listing.viewsCount || 0}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {listing.title}
                </h4>
                
                <div className="text-blue-600 font-bold text-lg mb-2">
                  {formatPrice(listing.price)}
                  {listing.isNegotiable && (
                    <span className="text-xs font-normal text-gray-500 mr-1">
                      قابل للتفاوض
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{listing.city?.name || 'غير محدد'}</span>
                  </div>
                  <span>{formatDate(listing.createdAt)}</span>
                </div>

                {/* Condition */}
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    listing.condition === 'new'
                      ? 'bg-green-100 text-green-800'
                      : listing.condition === 'like-new'
                      ? 'bg-blue-100 text-blue-800'
                      : listing.condition === 'good'
                      ? 'bg-yellow-100 text-yellow-800'
                      : listing.condition === 'fair'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {listing.condition === 'new' && 'جديد'}
                    {listing.condition === 'like-new' && 'كالجديد'}
                    {listing.condition === 'good' && 'جيد'}
                    {listing.condition === 'fair' && 'مقبول'}
                    {listing.condition === 'poor' && 'يحتاج صيانة'}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View More Button */}
      {filteredListings.length > 6 && (
        <div className="mt-6 text-center">
          <Link
            to={`/listings?category=${filteredListings[0]?.category?.slug || ''}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            عرض المزيد من الإعلانات المشابهة
          </Link>
        </div>
      )}

      {/* Empty State for no listings */}
      {filteredListings.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">🔍</div>
          <p className="text-gray-600 mb-4">لم نجد إعلانات مشابهة</p>
          <Link
            to="/listings"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            تصفح جميع الإعلانات
          </Link>
        </div>
      )}
    </div>
  );
}