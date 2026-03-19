import React, { useState } from 'react';
import { User } from '../../types';
import { X, Ban, AlertTriangle, Clock } from 'lucide-react';

interface BanUserModalProps {
  user: User;
  onConfirm: (reason: string, duration?: number) => Promise<void>;
  onClose: () => void;
}

export function BanUserModal({ user, onConfirm, onClose }: BanUserModalProps) {
  const [reason, setReason] = useState('');
  const [durationType, setDurationType] = useState<'permanent' | 'temporary'>('permanent');
  const [duration, setDuration] = useState(7); // days
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const predefinedReasons = [
    'انتهاك قوانين المنصة',
    'نشر محتوى مخالف',
    'سلوك غير لائق',
    'احتيال أو خداع',
    'تكرار الإبلاغات',
    'عدم الاستجابة للتحذيرات',
    'بيانات مزيفة',
    'سبام أو إعلانات مكررة'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('سبب الحظر مطلوب');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const banDuration = durationType === 'temporary' ? duration : undefined;
      await onConfirm(reason.trim(), banDuration);
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء حظر المستخدم');
      setLoading(false);
    }
  };

  const handleReasonSelect = (selectedReason: string) => {
    setReason(selectedReason);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              حظر المستخدم
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium mb-1">
                تأكيد حظر المستخدم
              </p>
              <p className="text-red-700 text-sm">
                سيتم منع <strong>{user.name}</strong> من الوصول إلى المنصة
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Ban Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              مدة الحظر
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  value="permanent"
                  checked={durationType === 'permanent'}
                  onChange={(e) => setDurationType(e.target.value as 'permanent')}
                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="text-gray-700">حظر دائم</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  value="temporary"
                  checked={durationType === 'temporary'}
                  onChange={(e) => setDurationType(e.target.value as 'temporary')}
                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="text-gray-700">حظر مؤقت</span>
              </label>
            </div>

            {durationType === 'temporary' && (
              <div className="mt-3 mr-7">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-20 px-3 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-gray-700">يوم</span>
                </div>
              </div>
            )}
          </div>

          {/* Predefined Reasons */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              أسباب شائعة
            </label>
            <div className="grid grid-cols-2 gap-2">
              {predefinedReasons.map((predefinedReason, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleReasonSelect(predefinedReason)}
                  className={`p-2 text-sm border rounded-lg text-right transition-colors ${
                    reason === predefinedReason
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {predefinedReason}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              سبب الحظر *
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                error && !reason.trim() ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              rows={4}
              placeholder="اكتب سبب الحظر بالتفصيل..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'جاري الحظر...' : 'تأكيد الحظر'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}