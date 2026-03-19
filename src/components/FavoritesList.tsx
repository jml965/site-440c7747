import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Eye, MessageCircle, Share2, Trash2 } from 'lucide-react';
import { Listing } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { formatPrice, formatDate, formatTimeAgo } from '../utils/helpers';
import FavoriteButton from './FavoriteButton';
import { toast } from 'react-hot-toast';

interface FavoritesListProps {
  favorites: Listing[];
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites }) => {
  const { removeFavorite } = useFavorites();

  const handleRemoveFavorite = async (listingId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await removeFavorite(listingId);
      toast.success('تم إزالة الإعلان من المفضلة');
    } catch (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    }
  };

  const handleShare = (listing: Listing, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: `${window.location.origin}/listings/${listing.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/listings/${listing.id}`);
      toast.success('تم نسخ رابط الإعلان');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {favorites.map((listing) => (
        <Link
          key={listing.id}
          to={`/listings/${listing.id}`}
          className="group block"
        >
          <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={listing.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              
              {/* Favorite button */}
              <div className="absolute top-3 right-3">
                <FavoriteButton listingId={listing.id} size="md" />
              </div>

              {/* Quick actions */}
              <div className="absolute top-3 left-3 flex space-x-reverse space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => handleShare(listing, e)}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                  title="مشاركة"
                >
                  <Share2 className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={(e) => handleRemoveFavorite(listing.id, e)}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-colors group"
                  title="إزالة من المفضلة"
                >
                  <Trash2 className="h-4 w-4 text-gray-600 group-hover:text-red-600" />
                </button>
              </div>

              {/* Status badge */}
              {listing.status && (
                <div className="absolute bottom-3 right-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    listing.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : listing.status === 'sold'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {listing.status === 'available' && 'متاح'}
                    {listing.status === 'sold' && 'مباع'}
                    {listing.status === 'pending' && 'قيد التفاوض'}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {listing.title}
              </h3>

              {/* Price */}
              <div className="text-2xl font-bold text-blue-600 mb-3">
                {formatPrice(listing.price)}
                {listing.negotiable && (
                  <span className="text-sm font-normal text-gray-500 mr-2">قابل للتفاوض</span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 ml-1 flex-shrink-0" />
                  <span className="truncate">{listing.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 ml-1 flex-shrink-0" />
                  <span>{formatTimeAgo(listing.createdAt)}</span>
                </div>

                {listing.condition && (
                  <div className="flex items-center">
                    <div className="w-4 h-4 ml-1 flex-shrink-0 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${
                        listing.condition === 'new' ? 'bg-green-500' :
                        listing.condition === 'like_new' ? 'bg-blue-500' :
                        listing.condition === 'good' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                    </div>
                    <span>
                      {listing.condition === 'new' && 'جديد'}
                      {listing.condition === 'like_new' && 'مثل الجديد'}
                      {listing.condition === 'good' && 'حالة جيدة'}
                      {listing.condition === 'fair' && 'حالة مقبولة'}
                      {listing.condition === 'poor' && 'يحتاج إصلاح'}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-reverse space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 ml-1" />
                    <span>{listing.views || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-3 w-3 ml-1" />
                    <span>{listing.messageCount || 0}</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  {formatDate(listing.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FavoritesList;