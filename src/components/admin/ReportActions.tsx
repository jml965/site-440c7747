import React, { useState } from 'react';
import { Report } from '../../types';
import { MoreVertical, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';

interface ReportActionsProps {
  report: Report;
  onResolve: (id: string, resolution: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ReportActions({
  report,
  onResolve,
  onDismiss,
  onDelete
}: ReportActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: () => Promise<void>) => {
    setLoading(true);
    setShowMenu(false);
    try {
      await action();
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickResolve = () => {
    handleAction(() => onResolve(report.id, 'تم حل البلاغ بواسطة الإدارة'));
  };

  const handleQuickDismiss = () => {
    handleAction(() => onDismiss(report.id));
  };

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذا البلاغ؟ لا يمكن التراجع عن هذا الإجراء.')) {
      handleAction(() => onDelete(report.id));
    }
  };

  return (
    <div className="relative" dir="rtl">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        disabled={loading}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        title="المزيد من الخيارات"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            {report.status === 'pending' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickResolve();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  حل البلاغ (سريع)
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickDismiss();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  رفض البلاغ
                </button>
                
                <hr className="my-2 border-gray-200" />
              </>
            )}
            
            {report.reportedListing && (
              <a
                href={`/listings/${report.reportedListing.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                عرض الإعلان
              </a>
            )}
            
            {report.reportedUser && (
              <a
                href={`/admin/users/${report.reportedUser.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                عرض المستخدم
              </a>
            )}
            
            <hr className="my-2 border-gray-200" />
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              حذف البلاغ
            </button>
          </div>
        </>
      )}
    </div>
  );
}