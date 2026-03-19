import React, { useState } from 'react';
import { X, MessageCircle, Phone, User, Send } from 'lucide-react';
import type { Listing, User as UserType } from '../types/index';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  seller: UserType;
  onStartConversation: (message: string) => Promise<void>;
}

export default function ContactModal({ isOpen, onClose, listing, seller, onStartConversation }: ContactModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'message' | 'phone'>('message');

  const defaultMessage = `مرحبا، أنا مهتم بـ "${listing.title}" بسعر ${listing.price?.toLocaleString()} ر.س. هل لا يزال متوفراً؟`;

  React.useEffect(() => {
    if (isOpen) {
      setMessage(defaultMessage);
    }
  }, [isOpen, defaultMessage]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      await onStartConversation(message.trim());
      onClose();
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">تواصل مع البائع</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Listing Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex gap-4">
            <img
              src={listing.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'}
              alt={listing.title}
              className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{listing.title}</h3>
              <p className="text-lg font-bold text-blue-600">{listing.price?.toLocaleString()} ر.س</p>
              <p className="text-sm text-gray-500">{listing.city} • {listing.category}</p>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {seller.name?.charAt(0) || <User className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{seller.name}</h4>
              <p className="text-sm text-gray-500">عضو منذ {new Date(seller.createdAt).getFullYear()}</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(seller.rating || 4.5))}
              </div>
              <span className="text-sm text-gray-600">({seller.reviewsCount || 0})</span>
            </div>
          </div>
        </div>

        {/* Contact Tabs */}
        <div className="p-6">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'message'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircle className="h-5 w-5 inline-block ml-2" />
              إرسال رسالة
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'phone'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Phone className="h-5 w-5 inline-block ml-2" />
              رقم الهاتف
            </button>
          </div>

          {/* Message Tab */}
          {activeTab === 'message' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رسالتك للبائع
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1 text-left">
                  {message.length}/500
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">نصائح للتواصل الآمن:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• تواصل عبر المنصة قدر الإمكان</li>
                  <li>• تأكد من تفاصيل المنتج قبل الشراء</li>
                  <li>• اختر مكان آمن للقاء</li>
                  <li>• لا تدفع أي أموال مقدماً</li>
                </ul>
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    إرسال الرسالة
                  </>
                )}
              </button>
            </div>
          )}

          {/* Phone Tab */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              <div className="text-center">
                <Phone className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">رقم هاتف البائع</h4>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <p className="text-2xl font-mono font-bold text-gray-800 direction-ltr">
                    {seller.phone || '+966 50 123 4567'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`tel:${seller.phone || '+966501234567'}`}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                  >
                    اتصال مباشر
                  </a>
                  <a
                    href={`https://wa.me/${(seller.phone || '+966501234567').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center"
                  >
                    واتساب
                  </a>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <h5 className="font-medium text-amber-800 mb-2">تذكر:</h5>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• تأكد من هوية البائع قبل الاتفاق</li>
                  <li>• احرص على الفحص الجيد للمنتج</li>
                  <li>• اتفق على مكان آمن للقاء</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}