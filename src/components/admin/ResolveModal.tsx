import React, { useState } from 'react';
import { Report } from '../../types';
import { X, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

interface ResolveModalProps {
  report: Report;
  onResolve: (resolution: string) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

export function ResolveModal({
  report,
  onResolve,
  onClose,
  loading
}: ResolveModalProps) {
  const [resolution, setResolution] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const predefinedActions = [
    {
      id: 'remove_content',
      title: 'إزالة المحتوى',
      description: 'تم حذف المحتوى المخالف وإشعار المستخدم',
      template: 'تم حذف المحتوى المبلغ عنه لمخالفته قواعد المنصة. تم إشعار المستخدم بالمخالفة.'
    },
    {
      id: 'warning_user',
      title: 'تحذير المستخدم',
      description: 'إرسال تحذير للمستخدم مع الاحتفاظ بالمحتوى',
      template: 'تم إرسال تحذير للمستخدم بخصوص المحتوى المبلغ عنه. المحتوى لا يزال متاحاً مع المراقبة المستمرة.'
    },
    {
      id: 'suspend_user',
      title: 'إيقاف المستخدم',
      description: 'إيقاف حساب المستخدم مؤقتاً أو نهائياً',
      template: 'تم إيقاف حساب المستخدم بسبب مخالفة قواعد المنصة. تم حذف المحتوى المخالف.'
    },
    {
      id: 'no_action',
      title: 'لا يوجد مخالفة',
      description: 'البلاغ غير مبرر والمحتوى مقبول',
      template: 'تم مراجعة البلاغ وتبين أن المحتوى لا يخالف قواعد المنصة. لا يوجد إجراء مطلوب.'
    },
    {
      id: 'under_review',
      title: 'تحت المراجعة',
      description: 'يتطلب البلاغ مراجعة إضافية',
      template: 'البلاغ تحت المراجعة المتقدمة. سيتم اتخاذ الإجراء المناسب خلال 24-48 ساعة.'
    },
    {
      id: 'custom',
      title: 'إجراء مخصص',
      description: 'كتابة قرار مخصص',
      template: ''
    }
  ];

  const handleActionSelect = (action: typeof predefinedActions[0]) => {
    setSelectedAction(action.id);
    setResolution(action.template);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolution.trim()) return;
    
    try {
      await onResolve(resolution.trim());
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const getReasonText = (reason: string) => {
    const reasonMap: { [key: string]: string } = {
      'inappropriate_content': 'محتوى غير مناسب',
      'spam': 'رسائل مزعجة',
      'fake_listing': 'إعلان وهمي',
      'fraud': 'احتيال',
      'harassment': 'تحرش',
      'copyright': 'انتهاك حقوق طبع',
      'other': 'أخرى'
    };
    return reasonMap[reason] || reason;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                حل البلاغ
              </h3>
              <p className="text-sm text-gray-600">
                نوع البلاغ: {getReasonText(report.reason)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Report Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  ملخص البلاغ
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  نوع: {getReasonText(report.reason)}
                </p>
                {report.description && (
                  <p className="text-sm text-gray-700">
                    الوصف: {report.description}
                  </p>
                )}
                {report.reportedListing && (
                  <p className="text-sm text-gray-700 mt-1">
                    الإعلان: {report.reportedListing.title}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Predefined Actions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              اختر الإجراء المناسب
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predefinedActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleActionSelect(action)}
                  className={`p-4 text-right border rounded-lg transition-all hover:shadow-md ${
                    selectedAction === action.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium text-gray-900 mb-1">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قرار الإدارة والإجراء المتخذ *
            </label>
            <div className="relative">
              <FileText className="w-5 h-5 text-gray-400 absolute top-3 right-3" />
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="اكتب قرار الإدارة والإجراء المتخذ بخصوص هذا البلاغ..."
                rows={6}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              سيتم إشعار المبلغ بهذا القرار تلقائياً
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !resolution.trim()}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  حفظ القرار وحل البلاغ
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}