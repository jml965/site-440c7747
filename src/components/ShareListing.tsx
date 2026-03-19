import React, { useState } from 'react';
import { Share2, Copy, Facebook, Twitter, MessageCircle, Mail, Link as LinkIcon, Check } from 'lucide-react';

interface ShareListingProps {
  listingId: string;
  listingTitle: string;
  listingUrl?: string;
}

export default function ShareListing({ listingId, listingTitle, listingUrl }: ShareListingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareUrl = listingUrl || `${window.location.origin}/listing/${listingId}`;
  const shareTitle = `تحقق من هذا الإعلان: ${listingTitle}`;
  const shareText = `وجدت هذا الإعلان المثير للاهتمام وأردت مشاركته معك!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleWhatsAppShare = () => {
    const whatsappText = `${shareTitle}\n${shareText}\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareText}\n\nالرابط: ${shareUrl}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(emailUrl);
    setIsOpen(false);
  };

  // Handle Web Share API if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        setIsOpen(false);
      } catch (error) {
        console.log('Native sharing cancelled or failed');
      }
    }
  };

  const shareOptions = [
    {
      id: 'copy',
      label: 'نسخ الرابط',
      icon: copiedLink ? Check : Copy,
      color: copiedLink ? 'text-green-600 bg-green-50 border-green-200' : 'text-gray-600 bg-white border-gray-200',
      action: handleCopyLink
    },
    {
      id: 'whatsapp',
      label: 'واتساب',
      icon: MessageCircle,
      color: 'text-green-600 bg-green-50 border-green-200',
      action: handleWhatsAppShare
    },
    {
      id: 'facebook',
      label: 'فيسبوك',
      icon: Facebook,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      action: handleFacebookShare
    },
    {
      id: 'twitter',
      label: 'تويتر',
      icon: Twitter,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      action: handleTwitterShare
    },
    {
      id: 'email',
      label: 'البريد الإلكتروني',
      icon: Mail,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      action: handleEmailShare
    }
  ];

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors text-sm"
      >
        <Share2 size={16} />
        <span>مشاركة</span>
      </button>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Share2 className="text-blue-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  مشاركة الإعلان
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-600 text-xl">✕</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Listing Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                  {listingTitle}
                </h3>
                <p className="text-gray-600 text-sm">
                  شارك هذا الإعلان مع الأصدقاء
                </p>
              </div>

              {/* Native Share (if supported) */}
              {navigator.share && (
                <div className="mb-4">
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Share2 size={18} />
                    <span>مشاركة</span>
                  </button>
                  <div className="flex items-center gap-4 my-4">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="text-gray-500 text-sm">أو</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                </div>
              )}

              {/* Share Options */}
              <div className="space-y-2">
                {shareOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={option.action}
                      className={`w-full flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-all ${option.color}`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">
                        {option.id === 'copy' && copiedLink ? 'تم النسخ!' : option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* URL Display */}
              <div className="mt-6 p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon size={14} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">رابط الإعلان:</span>
                </div>
                <p className="text-xs text-gray-600 break-all font-mono bg-white p-2 rounded border">
                  {shareUrl}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}