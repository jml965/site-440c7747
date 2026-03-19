import React from 'react';
import { Report } from '../../types';
import { ResolveModal } from './ResolveModal';
import { 
  X, 
  AlertTriangle, 
  Calendar, 
  User, 
  FileText, 
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  MessageSquare
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useState } from 'react';

interface ReportDetailsProps {
  report: Report;
  onClose: () => void;
  onResolve: (id: string, resolution: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
}

export function ReportDetails({
  report,
  onClose,
  onResolve,
  onDismiss
}: ReportDetailsProps) {
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'resolved': return 'text-green-700 bg-green-100 border-green-200';
      case 'dismissed': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'resolved': return <CheckCircle className="w-5 h-5" />;
      case 'dismissed': return <XCircle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'معلق';
      case 'resolved': return 'محلول';
      case 'dismissed': return 'مرفوض';
      default: return 'غير محدد';
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

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'inappropriate_content':
      case 'spam':
      case 'harassment':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'fake_listing':
      case 'fraud':
        return <Flag className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleDismiss = async () => {
    setLoading(true);
    try {
      await onDismiss(report.id);
      onClose();
    } catch (error) {
      console.error('Error dismissing report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (resolution: string) => {
    setLoading(true);
    try {
      await onResolve(report.id, resolution);
      setShowResolveModal(false);
      onClose();
    } catch (error) {
      console.error('Error resolving report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {getReasonIcon(report.reason)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                تفاصيل البلاغ
              </h3>
              <p className="text-sm text-gray-600">
                البلاغ رقم: {report.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                getStatusColor(report.status)
              }`}>
                {getStatusIcon(report.status)}
                {getStatusText(report.status)}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDistanceToNow(new Date(report.createdAt), {
                  addSuffix: true,
                  locale: ar
                })}
              </div>
            </div>
          </div>

          {/* Report Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع البلاغ
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getReasonIcon(report.reason)}
                <span className="font-medium">{getReasonText(report.reason)}</span>
              </div>
            </div>

            {report.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف البلاغ
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-900 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reporter Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المبلغ
            </label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{report.reportedBy.name}</p>
                <p className="text-sm text-gray-600">{report.reportedBy.email}</p>
                {report.reportedBy.phone && (
                  <p className="text-sm text-gray-600">{report.reportedBy.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Reported Content */}
          {report.reportedListing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الإعلان المبلغ عنه
              </label>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {report.reportedListing.images && report.reportedListing.images.length > 0 && (
                    <img
                      src={report.reportedListing.images[0]}
                      alt={report.reportedListing.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {report.reportedListing.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      السعر: {report.reportedListing.price} ريال
                    </p>
                    <p className="text-sm text-gray-600">
                      البائع: {report.reportedListing.user.name}
                    </p>
                  </div>
                  <a
                    href={`/listings/${report.reportedListing.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="عرض الإعلان"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {report.reportedUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المستخدم المبلغ عنه
              </label>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {report.reportedUser.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {report.reportedUser.email}
                    </p>
                  </div>
                  <a
                    href={`/admin/users/${report.reportedUser.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="عرض ملف المستخدم"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Resolution */}
          {report.resolution && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                قرار الإدارة
              </label>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-green-900">{report.resolution}</p>
                </div>
                {report.resolvedAt && (
                  <p className="text-sm text-green-600 mt-2">
                    تم الحل في: {new Date(report.resolvedAt).toLocaleString('ar-SA')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {report.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowResolveModal(true)}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                حل البلاغ
              </button>
              <button
                onClick={handleDismiss}
                disabled={loading}
                className="flex-1 bg-gray-600 text-white py-2.5 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                رفض البلاغ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <ResolveModal
          report={report}
          onResolve={handleResolve}
          onClose={() => setShowResolveModal(false)}
          loading={loading}
        />
      )}
    </>
  );
}