import React, { useState } from 'react';
import { Flag, X, AlertTriangle, Send } from 'lucide-react';

interface ReportListingProps {
  listingId: string;
  listingTitle: string;
  onSubmitReport?: (data: ReportData) => Promise<void>;
}

export interface ReportData {
  reason: string;
  description: string;
  listingId: string;
}

const reportReasons = [
  { id: 'fraud', label: 'احتيال أو خداع', description: 'الإعلان مضلل أو محتال' },
  { id: 'inappropriate', label: 'محتوى غير مناسب', description: 'محتوى غير لائق أو مخالف' },
  { id: 'spam', label: 'رسائل مزعجة', description: 'إعلان متكرر أو غير مرغوب فيه' },
  { id: 'fake', label: 'منتج مزيف', description: 'المنتج المعروض غير حقيقي' },
  { id: 'stolen', label: 'سلعة مسروقة', description: 'أشك في أن هذه السلعة مسروقة' },
  { id: 'wrong-category', label: 'قسم خاطئ', description: 'الإعلان في قسم غير مناسب' },
  { id: 'overpriced', label: 'سعر مبالغ فيه', description: 'السعر غير معقول مقارنة بالسوق' },
  { id: 'duplicate', label: 'إعلان مكرر', description: 'نفس الإعلان منشور عدة مرات' },
  { id: 'personal-info', label: 'معلومات شخصية', description: 'يحتوي على معلومات شخصية حساسة' },
  { id: 'other', label: 'أخرى', description: 'سبب آخر' }
];

export default function ReportListing({ listingId, listingTitle, onSubmitReport }: ReportListingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setSelectedReason('');
    setDescription('');
    setIsSubmitted(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedReason('');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason || !description.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reportData: ReportData = {
        reason: selectedReason,
        description: description.trim(),
        listingId
      };

      if (onSubmitReport) {
        await onSubmitReport(reportData);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Report submitted:', reportData);
      }
      
      setIsSubmitted(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedReasonData = reportReasons.find(r => r.id === selectedReason);

  return (
    <>
      {/* Report Button */}
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors text-sm"
      >
        <Flag size={16} />
        <span>الإبلاغ عن الإعلان</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Flag className="text-red-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  الإبلاغ عن الإعلان
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Success State */}
            {isSubmitted ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-green-600 text-2xl">✓</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  تم إرسال البلاغ بنجاح
                </h3>
                <p className="text-gray-600 text-sm">
                  شكراً لك على المساعدة في الحفاظ على سلامة المجتمع. سنراجع البلاغ في أقرب وقت ممكن.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Content */}
                <div className="p-6">
                  {/* Listing Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-1">
                      الإعلان المُبلغ عنه:
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {listingTitle}
                    </p>
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
                    <div className="text-sm">
                      <p className="text-yellow-800 font-medium mb-1">
                        يرجى الإبلاغ فقط عن المحتوى المخالف
                      </p>
                      <p className="text-yellow-700">
                        البلاغات الكاذبة قد تؤدي إلى إيقاف حسابك
                      </p>
                    </div>
                  </div>

                  {/* Reason Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      سبب الإبلاغ *
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {reportReasons.map((reason) => (
                        <label
                          key={reason.id}
                          className={`block p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedReason === reason.id
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="reason"
                            value={reason.id}
                            checked={selectedReason === reason.id}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {reason.label}
                              </div>
                              <div className="text-gray-600 text-xs mt-1">
                                {reason.description}
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedReason === reason.id
                                ? 'border-red-500 bg-red-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedReason === reason.id && (
                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                      تفاصيل إضافية *
                      {selectedReasonData && (
                        <span className="text-red-500 text-xs mr-2">
                          ({selectedReasonData.label})
                        </span>
                      )}
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="يرجى وصف المشكلة بالتفصيل..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      dir="rtl"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      كلما زادت التفاصيل، كلما تمكنا من التعامل مع البلاغ بشكل أسرع
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t bg-gray-50">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedReason || !description.trim() || isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send size={16} />
                    )}
                    <span>
                      {isSubmitting ? 'جاري الإرسال...' : 'إرسال البلاغ'}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}