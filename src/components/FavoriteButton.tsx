import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AppContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface FavoriteButtonProps {
  listingId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon';
  className?: string;
  showTooltip?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  listingId,
  size = 'md',
  variant = 'icon',
  className = '',
  showTooltip = true
}) => {
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite, isLoading } = useFavorites();

  const isFav = isFavorite(listingId);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    if (isLoading) return;

    try {
      await toggleFavorite(listingId);
      if (isFav) {
        toast.success('تم إزالة الإعلان من المفضلة');
      } else {
        toast.success('تم إضافة الإعلان إلى المفضلة');
      }
    } catch (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    }
  };

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className={`inline-flex items-center justify-center transition-all duration-200 group ${
          variant === 'button'
            ? 'px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg'
            : `${buttonSizeClasses[size]} bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-md hover:shadow-lg`
        } ${className}`}
        title={showTooltip ? 'تسجيل الدخول للإضافة إلى المفضلة' : undefined}
      >
        <Heart
          className={`${sizeClasses[size]} text-gray-400 group-hover:text-gray-600 transition-colors`}
        />
        {variant === 'button' && (
          <span className="mr-2 text-sm font-medium text-gray-600 group-hover:text-gray-800">
            إضافة للمفضلة
          </span>
        )}
      </Link>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`inline-flex items-center justify-center transition-all duration-200 group disabled:opacity-50 ${
        variant === 'button'
          ? `px-4 py-2 rounded-lg ${
              isFav
                ? 'bg-red-50 hover:bg-red-100 border border-red-200'
                : 'bg-gray-100 hover:bg-gray-200'
            }`
          : `${buttonSizeClasses[size]} rounded-full shadow-md hover:shadow-lg ${
              isFav
                ? 'bg-red-50 hover:bg-red-100'
                : 'bg-white/80 backdrop-blur-sm hover:bg-white'
            }`
      } ${className}`}
      title={showTooltip ? (isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة') : undefined}
    >
      {isLoading ? (
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-red-600`} />
      ) : (
        <Heart
          className={`${sizeClasses[size]} transition-all duration-200 ${
            isFav
              ? 'text-red-600 fill-current scale-110'
              : 'text-gray-400 group-hover:text-red-500 group-hover:scale-110'
          }`}
        />
      )}
      {variant === 'button' && (
        <span className={`mr-2 text-sm font-medium transition-colors ${
          isFav
            ? 'text-red-600'
            : 'text-gray-600 group-hover:text-gray-800'
        }`}>
          {isFav ? 'محفوظ في المفضلة' : 'إضافة للمفضلة'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;