import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Send, AlertCircle } from 'lucide-react';
import type { User } from '../types';
import { useAuth } from '../contexts/AppContext';

interface ContactSellerProps {
  seller: User;
  listingId: string;
  listingTitle: string;
  onSendMessage?: (message: string) => Promise<void>;
}

export default function ContactSeller({ seller, listingId, listingTitle, onSendMessage }: ContactSellerProps) {
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (!message.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      if (onSendMessage) {
        await onSendMessage(message);
        setMessage('');
        // Show success message or redirect to chat
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPhone = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowPhoneNumber(true);
  };

  const handleContactViaEmail = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    const subject = `استفسار عن إعلان: ${listingTitle}`;
    const body = `مرحباً ${seller.name},\n\nأرغب في الاستفسار عن إعلانك: ${listingTitle}\n\nشكراً`;
    window.open(`mailto:${seller.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Don't show contact options if user is the seller
  if (user && user.id === seller.id) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <div className="text-blue-600 mb-2">
          <MessageCircle size={24} className="mx-auto" />
        </div>
        <p className="text-blue-800 font-medium">هذا إعلانك</p>
        <p className="text-blue-600 text-sm mt-1">
          يمكنك إدارة هذا الإعلان من صفحة إعلاناتي
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        تواصل مع البائع
      </h3>

      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">
                يجب تسجيل الدخول
              </h4>
              <p className="text-yellow-700 text-sm mb-3">
                للتواصل مع البائع، يرجى تسجيل الدخول أو إنشاء حساب جديد
              </p>
              <div className="flex gap-2">
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  تسجيل الدخول
                </button>
                <button 
                  onClick={() => setShowLoginPrompt(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {/* Send Message */}
        <button
          onClick={() => !isAuthenticated ? setShowLoginPrompt(true) : null}
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-medium transition-all hover:scale-[1.02]"
        >
          <MessageCircle size={20} />
          <span>إرسال رسالة</span>
        </button>

        {/* Show Phone */}
        <button
          onClick={handleShowPhone}
          className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-medium transition-all hover:scale-[1.02]"
        >
          <Phone size={20} />
          <span>
            {showPhoneNumber && seller.phone 
              ? seller.phone 
              : 'إظهار رقم الهاتف'
            }
          </span>
        </button>

        {/* Email Contact */}
        {seller.email && (
          <button
            onClick={handleContactViaEmail}
            className="flex items-center justify-center gap-3 bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg font-medium transition-all hover:scale-[1.02]"
          >
            <Mail size={20} />
            <span>إرسال بريد إلكتروني</span>
          </button>
        )}
      </div>

      {/* Message Form */}
      {isAuthenticated && (
        <div className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              اكتب رسالتك
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="مرحباً، أرغب في الاستفسار عن هذا الإعلان..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              dir="rtl"
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send size={18} />
            )}
            <span>{isLoading ? 'جاري الإرسال...' : 'إرسال الرسالة'}</span>
          </button>
        </div>
      )}

      {/* Contact Tips */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">نصائح للتواصل الآمن</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• تواصل عبر المنصة أولاً</li>
          <li>• تجنب مشاركة المعلومات الشخصية</li>
          <li>• اختبر المنتج قبل الدفع</li>
          <li>• التقي في مكان عام وآمن</li>
        </ul>
      </div>

      {/* Seller Response Info */}
      {seller.averageResponseTime && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            متوسط وقت الرد: <span className="font-medium">{seller.averageResponseTime}</span>
          </p>
        </div>
      )}
    </div>
  );
}