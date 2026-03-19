import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  Flag,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Clock,
  User,
  Tag,
  Package
} from 'lucide-react';
import { Listing } from '../types';
import { listingService } from '../services/listingService';
import ListingCard from '../components/ListingCard';

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [relatedListings, setRelatedListings] = useState<Listing[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    if (id) {
      loadListing(id);
    }
  }, [id]);

  const loadListing = async (listingId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await listingService.getById(listingId);
      setListing(data);
      
      // Load related listings
      if (data.categoryId) {
        const related = await listingService.getRelated(listingId, data.categoryId);
        setRelatedListings(related);
      }
      
      // Check if favorited (from localStorage for demo)
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(listingId));
      
      // Increment view count
      await listingService.incrementViews(listingId);
    } catch (err) {
      setError('حدث خطأ في تحميل الإعلان');
      console.error('Error loading listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!listing) return;
    
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

  const handleShare = async () => {
    if (!listing) return;
    
    try {
      await navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href
      });
    } catch (err) {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };

  const handleReport = async () => {
    if (!listing || !reportReason) return;
    
    try {
      // In a real app, this would send to the backend
      console.log('Reporting listing:', listing.id, 'Reason:', reportReason);
      alert('تم إرسال البلاغ بنجاح');
      setShowReportModal(false);
      setReportReason('');
    } catch (err) {
      console.error('Error reporting listing:', err);
      alert('حدث خطأ في إرسال البلاغ');
    }
  };

  const nextImage = () => {
    if (listing && listing.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const previousImage = () => {
    if (listing && listing.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-4">{error || 'لم يتم العثور على الإعلان'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 space-x-reverse">
            <li>
              <Link to="/" className="text-blue-600 hover:text-blue-700">
                الرئيسية
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link to="/listings" className="text-blue-600 hover:text-blue-700">
                الإعلانات
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900 font-medium">{listing.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 right-1/2 transform translate-x-1/2 flex gap-2">
                  {listing.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {listing.images.length > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="grid grid-cols-6 gap-2">
                    {listing.images.slice(0, 6).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(listing.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{listing.views} مشاهدة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>{listing.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(listing.price)}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <Package className="w-4 h-4" />
                    <span>{listing.condition}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">الوصف</h2>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                  {listing.description}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                    isFavorite
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">حفظ</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">مشاركة</span>
                </button>
              </div>
              
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                <Flag className="w-4 h-4" />
                الإبلاغ عن الإعلان
              </button>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات البائع</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{listing.sellerName}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span>4.8 (23 تقييم)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                <Shield className="w-4 h-4" />
                <span>عضو موثق</span>
              </div>
              
              <div className="space-y-3">
                {!showContactInfo ? (
                  <button
                    onClick={() => setShowContactInfo(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    إظهار رقم الهاتف
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg text-center font-mono text-lg">
                      {listing.phoneNumber}
                    </div>
                    <a
                      href={`tel:${listing.phoneNumber}`}
                      className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      اتصال
                    </a>
                  </div>
                )}
                
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  إرسال رسالة
                </button>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                نصائح الأمان
              </h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• تأكد من المنتج قبل الدفع</li>
                <li>• التقِ في مكان عام وآمن</li>
                <li>• لا تدفع مقدماً</li>
                <li>• احذر من العروض المشبوهة</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">إعلانات مشابهة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedListings.slice(0, 4).map((relatedListing) => (
                <ListingCard key={relatedListing.id} listing={relatedListing} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الإبلاغ عن الإعلان</h3>
            
            <div className="space-y-3 mb-4">
              {[
                'محتوى مخالف',
                'سعر غير واقعي',
                'إعلان مكرر',
                'احتيال',
                'منتج مسروق',
                'أخرى'
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إرسال البلاغ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetails;