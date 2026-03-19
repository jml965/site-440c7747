import React from 'react';
import { Report } from '../../types';
import { ReportActions } from './ReportActions';
import { AlertTriangle, Clock, CheckCircle, XCircle, Eye, Flag, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ReportTableProps {
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
  onResolveReport: (id: string, resolution: string) => Promise<void>;
  onDismissReport: (id: string) => Promise<void>;
  onDeleteReport: (id: string) => Promise<void>;
}

export function ReportTable({
  reports,
  selectedReport,
  onSelectReport,
  onResolveReport,
  onDismissReport,
  onDeleteReport
}: ReportTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'resolved': return 'text-green-700 bg-green-100';
      case 'dismissed': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'dismissed': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
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
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'fake_listing':
      case 'fraud':
        return <Flag className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (reports.length === 0) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بلاغات</h3>
        <p className="text-gray-600">لم يتم العثور على أي بلاغات مطابقة للمعايير المحددة.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">قائمة البلاغات</h3>
        <p className="text-sm text-gray-600 mt-1">إجمالي {reports.length} بلاغ</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                نوع البلاغ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المبلغ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr
                key={report.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedReport?.id === report.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => onSelectReport(report)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {getReasonIcon(report.reason)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getReasonText(report.reason)}
                      </p>
                      {report.reportedListing && (
                        <p className="text-xs text-gray-500 mt-1">
                          إعلان: {report.reportedListing.title}
                        </p>
                      )}
                      {report.reportedUser && (
                        <p className="text-xs text-gray-500 mt-1">
                          مستخدم: {report.reportedUser.name}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {report.reportedBy.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {report.reportedBy.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStatusColor(report.status)
                  }`}>
                    {getStatusIcon(report.status)}
                    {getStatusText(report.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {formatDistanceToNow(new Date(report.createdAt), {
                          addSuffix: true,
                          locale: ar
                        })}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReport(report);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <ReportActions
                      report={report}
                      onResolve={onResolveReport}
                      onDismiss={onDismissReport}
                      onDelete={onDeleteReport}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}