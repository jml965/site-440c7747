import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Eye, MapPin, Calendar, Star, AlertTriangle } from 'lucide-react';
import { Listing } from '../../types';
import { formatCurrency, formatDate, getCityNameInArabic, getCategoryNameInArabic } from '../../utils/helpers';

interface ReviewModalProps {
  listing: Listing;
  onClose: () => void;
  onAction: (action: 'approve' | 'reject', reason?: string) => Promise<void>;
}

export default function ReviewModal({ listing, onClose, onAction }: ReviewModalProps) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSubmit = async () => {
    if (!action) return;
    
    setIsSubmitting(true);
    try {
      await onAction(action, action === 'reject' ? rejectionReason : undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectionReasons = [
    'محتوى غير لائق أو مخالف للقوانين',
    'معلومات غير صحيحة أو مضللة',
    'صور غير واضحة أو غير مناسبة',
    'سعر غير واقعي أو مشكوك فيه',
    'إعلان مكرر أو مشابه لإعلان موجود',
    'منتج محظور أو غير مسموح ببيعه',
    'بيانات الاتصال غير صحيحة',
    'أخرى (يرجى التوضيح)'
  ];

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new': return 'جديد';
      case 'excellent': return 'ممتاز';
      case 'good': return 'جيد';
      case 'fair': return 'مقبول';
      case 'poor': return 'يحتاج إصلاح';
      default: return condition;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">مراجعة الإعلان</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Listing Images */}
            <div className="mb-6">
              <div className="relative">
                <img
                  src={listing.images[currentImageIndex] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'}
                  alt={listing.title}
                  className="w-full h-80 object-cover rounded-lg"
                  loading="lazy"
                />
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      disabled={currentImageIndex === 0}
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(Math.min(listing.images.length - 1, currentImageIndex + 1))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      disabled={currentImageIndex === listing.images.length - 1}
                    >
                      →
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {listing.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {listing.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {listing.images.slice(0, 6).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{listing.title}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <span className="font-bold text-lg">{formatCurrency(listing.price)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{getCityNameInArabic(listing.city)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>تم النشر في {formatDate(listing.createdAt)}</span>
                  </div>
                  
                  {listing.featured && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span>إعلان مميز</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">القسم:</span>
                    <div className="font-medium">{getCategoryNameInArabic(listing.category)}</div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">حالة المنتج:</span>
                    <div className="font-medium">{getConditionText(listing.condition)}</div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">البائع:</span>
                    <div className="font-medium">{listing.user?.name || 'غير معروف'}</div>
                    <div className="text-sm text-gray-500">{listing.user?.email}</div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">رقم التواصل:</span>
                    <div className="font-medium">{listing.phone || 'غير محدد'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {listing.description || 'لا يوجد وصف متاح'}
                </p>
              </div>
            </div>

            {/* Action Selection */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">إجراء المراجعة</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setAction('approve')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    action === 'approve'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">الموافقة على الإعلان</div>
                  <div className="text-sm text-gray-600 mt-1">سيتم نشر الإعلان وإظهاره للمستخدمين</div>
                </button>
                
                <button
                  onClick={() => setAction('reject')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    action === 'reject'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <XCircle className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">رفض الإعلان</div>
                  <div className="text-sm text-gray-600 mt-1">سيتم إخفاء الإعلان وإشعار البائع</div>
                </button>
              </div>

              {/* Rejection Reason */}
              {action === 'reject' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <label className="block text-sm font-medium text-red-800 mb-3">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    سبب الرفض (مطلوب)
                  </label>
                  
                  <div className="space-y-2 mb-4">
                    {rejectionReasons.map((reason, index) => (
                      <label key={index} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="rejectionReason"
                          value={reason}
                          checked={rejectionReason === reason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="mt-1 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-red-700">{reason}</span>
                      </label>
                    ))}
                  </div>
                  
                  {rejectionReason === 'أخرى (يرجى التوضيح)' && (
                    <textarea
                      placeholder="يرجى توضيح سبب الرفض..."
                      className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={3}
                      onChange={(e) => setRejectionReason(`أخرى: ${e.target.value}`)}
                    />
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!action || isSubmitting || (action === 'reject' && !rejectionReason)}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    action === 'approve'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : action === 'reject'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      جاري المعالجة...
                    </div>
                  ) : action === 'approve' ? (
                    'تأكيد الموافقة'
                  ) : action === 'reject' ? (
                    'تأكيد الرفض'
                  ) : (
                    'اختر إجراء'
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}