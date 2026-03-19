import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Calendar,
  Eye,
  Phone,
  MessageCircle,
  Star,
  Shield,
  Clock,
  Tag
} from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  viewMode?: 'grid' | 'list';
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, viewMode = 'grid' }) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(listing.id);
  });
  const [imageError, setImageError] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const newFavorites = isFavorite
        ? favorites.filter((fav: string) => fav !== listing.id)
        : [...favorites, listing.id];
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'اليوم';
    if (diffDays === 2) return 'أمس';
    if (diffDays <= 7) return `منذ ${diffDays} أيام`;
    if (diffDays <= 30) return `منذ ${Math.ceil(diffDays / 7)} أسابيع`;
    if (diffDays <= 365) return `منذ ${Math.ceil(diffDays / 30)} أشهر`;
    return `منذ ${Math.ceil(diffDays / 365)} سنة`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'جديد':
        return 'bg-green-100 text-green-700';
      case 'مستعمل بحالة ممتازة':
        return 'bg-blue-100 text-blue-700';
      case 'مستعمل بحالة جيدة':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center';

  if (viewMode === 'list') {
    return (
      <Link 
        to={`/listings/${listing.id}`} 
        className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-200"
        dir="rtl"
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-36 flex-shrink-0">
            <img
              src={imageError ? fallbackImage : listing.images[0] || fallbackImage}
              alt={listing.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={handleImageError}
            />
            
            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className="absolute top-2 left-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
                }`}
              />
            </button>
            
            {/* Condition Badge */}
            <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
              getConditionColor(listing.condition)
            }`}>
              {listing.condition}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {listing.title}
              </h3>
              <div className="text-xl font-bold text-blue-600 ml-4">
                {formatPrice(listing.price)}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {listing.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{listing.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(listing.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{listing.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>{listing.category}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-medium">
                    {listing.sellerName?.charAt(0) || 'ب'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{listing.sellerName}</span>
                {listing.featured && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/listings/${listing.id}`} 
      className="block bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-200 group"
      dir="rtl"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageError ? fallbackImage : listing.images[0] || fallbackImage}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={handleImageError}
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 left-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10 backdrop-blur-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
            }`}
          />
        </button>
        
        {/* Featured Badge */}
        {listing.featured && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <span>مميز</span>
          </div>
        )}
        
        {/* Condition Badge */}
        <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
          getConditionColor(listing.condition)
        }`}>
          {listing.condition}
        </div>
        
        {/* Views Count */}
        <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm">
          <Eye className="w-3 h-3" />
          <span>{listing.views}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          <div className="text-xl font-bold text-blue-600 ml-2">
            {formatPrice(listing.price)}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
          {listing.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{listing.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(listing.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{listing.category}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-medium">
                {listing.sellerName?.charAt(0) || 'ب'}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-600 font-medium">{listing.sellerName}</span>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">موثق</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;