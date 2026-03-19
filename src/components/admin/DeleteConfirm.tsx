import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmProps {
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function DeleteConfirm({
  onConfirm,
  onCancel,
  title = "تأكيد حذف الإعلان",
  message = "هل أنت متأكد من رغبتك في حذف هذا الإعلان؟ هذا الإجراء لا يمكن التراجع عنه.",
  confirmText = "نعم، احذف الإعلان",
  cancelText = "إلغاء"
}: DeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onCancel} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <div className="font-medium mb-1">تحذير مهم:</div>
                <ul className="list-disc list-inside space-y-1 text-red-700">
                  <li>سيتم حذف الإعلان نهائياً من النظام</li>
                  <li>سيتم حذف جميع الصور المرتبطة بالإعلان</li>
                  <li>سيتم إشعار البائع بحذف الإعلان</li>
                  <li>لا يمكن استرداد البيانات بعد الحذف</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  {confirmText}
                </>
              )}
            </button>
            
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}