import { useState, useCallback } from 'react';
import { Report, ApiResponse } from '../types';
import { api } from '../services/api';

interface ReportsStats {
  total: number;
  pending: number;
  resolved: number;
  dismissed: number;
}

export function useAdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ReportsStats>({
    total: 0,
    pending: 0,
    resolved: 0,
    dismissed: 0
  });

  const updateStats = useCallback((reportsList: Report[]) => {
    const newStats = {
      total: reportsList.length,
      pending: reportsList.filter(r => r.status === 'pending').length,
      resolved: reportsList.filter(r => r.status === 'resolved').length,
      dismissed: reportsList.filter(r => r.status === 'dismissed').length
    };
    setStats(newStats);
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<Report[]>>('/admin/reports');
      const reportsList = response.data.data || [];
      setReports(reportsList);
      updateStats(reportsList);
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Mock data for development
      const mockReports: Report[] = [
        {
          id: '1',
          reason: 'inappropriate_content',
          description: 'يحتوي الإعلان على محتوى غير مناسب ومسيء',
          status: 'pending',
          reportedBy: {
            id: '1',
            name: 'أحمد محمد',
            email: 'ahmed@example.com',
            phone: '+966501234567'
          },
          reportedListing: {
            id: '1',
            title: 'سيارة مرسيدس للبيع',
            price: 50000,
            images: ['https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop'],
            user: {
              id: '2',
              name: 'سعد الأحمد',
              email: 'saad@example.com'
            }
          },
          createdAt: new Date('2024-01-15T10:30:00').toISOString()
        },
        {
          id: '2',
          reason: 'spam',
          description: 'يرسل رسائل مزعجة ومتكررة',
          status: 'pending',
          reportedBy: {
            id: '3',
            name: 'فاطمة علي',
            email: 'fatima@example.com'
          },
          reportedUser: {
            id: '4',
            name: 'محمد سالم',
            email: 'mohammed@example.com'
          },
          createdAt: new Date('2024-01-14T15:45:00').toISOString()
        },
        {
          id: '3',
          reason: 'fake_listing',
          description: 'الإعلان وهمي والسعر غير منطقي',
          status: 'resolved',
          reportedBy: {
            id: '5',
            name: 'خالد البراهيم',
            email: 'khalid@example.com'
          },
          reportedListing: {
            id: '2',
            title: 'آيفون 14 برو ماكس بسعر منخفض جداً',
            price: 100,
            images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop'],
            user: {
              id: '6',
              name: 'عبدالله النحاس',
              email: 'abdullah@example.com'
            }
          },
          resolution: 'تم حذف الإعلان المخالف وإرسال تحذير للمستخدم. تم التأكد من صحة الأسعار.',
          resolvedAt: new Date('2024-01-13T12:00:00').toISOString(),
          createdAt: new Date('2024-01-12T09:20:00').toISOString()
        },
        {
          id: '4',
          reason: 'fraud',
          description: 'محاولة احتيال واضحة',
          status: 'resolved',
          reportedBy: {
            id: '7',
            name: 'نورا الزهراني',
            email: 'nora@example.com'
          },
          reportedListing: {
            id: '3',
            title: 'شقة للإيجار بسعر مشكوك فيه',
            price: 500,
            images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
            user: {
              id: '8',
              name: 'مشبوه مجهول',
              email: 'suspicious@example.com'
            }
          },
          resolution: 'تم حذف الحساب نهائياً وحذف جميع الإعلانات المرتبطة به. تم إبلاغ الجهات المختصة.',
          resolvedAt: new Date('2024-01-10T16:30:00').toISOString(),
          createdAt: new Date('2024-01-09T14:15:00').toISOString()
        },
        {
          id: '5',
          reason: 'harassment',
          description: 'تحرش لفظي في الرسائل',
          status: 'dismissed',
          reportedBy: {
            id: '9',
            name: 'ريم الشهري',
            email: 'reem@example.com'
          },
          reportedUser: {
            id: '10',
            name: 'يوسف الغامدي',
            email: 'yousef@example.com'
          },
          createdAt: new Date('2024-01-11T11:00:00').toISOString()
        },
        {
          id: '6',
          reason: 'copyright',
          description: 'استخدام صور محمية بحقوق الطبع',
          status: 'pending',
          reportedBy: {
            id: '11',
            name: 'عمر الشمري',
            email: 'omar@example.com'
          },
          reportedListing: {
            id: '4',
            title: 'ساعة رولكس أصلية',
            price: 25000,
            images: ['https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=300&fit=crop'],
            user: {
              id: '12',
              name: 'ماجد القحطاني',
              email: 'majed@example.com'
            }
          },
          createdAt: new Date('2024-01-16T08:45:00').toISOString()
        },
        {
          id: '7',
          reason: 'other',
          description: 'مخالفة شروط الاستخدام',
          status: 'pending',
          reportedBy: {
            id: '13',
            name: 'سارة المطيري',
            email: 'sara@example.com'
          },
          reportedListing: {
            id: '5',
            title: 'كتب دراسية مستعملة',
            price: 150,
            images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'],
            user: {
              id: '14',
              name: 'طالب الجامعة',
              email: 'student@example.com'
            }
          },
          createdAt: new Date('2024-01-17T13:20:00').toISOString()
        }
      ];
      setReports(mockReports);
      updateStats(mockReports);
    } finally {
      setLoading(false);
    }
  }, [updateStats]);

  const resolveReport = useCallback(async (id: string, resolution: string) => {
    try {
      await api.put(`/admin/reports/${id}/resolve`, { resolution });
      
      setReports(prev => {
        const updated = prev.map(report => 
          report.id === id 
            ? { 
                ...report, 
                status: 'resolved' as const, 
                resolution,
                resolvedAt: new Date().toISOString()
              }
            : report
        );
        updateStats(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error resolving report:', error);
      // Mock success for development
      setReports(prev => {
        const updated = prev.map(report => 
          report.id === id 
            ? { 
                ...report, 
                status: 'resolved' as const, 
                resolution,
                resolvedAt: new Date().toISOString()
              }
            : report
        );
        updateStats(updated);
        return updated;
      });
    }
  }, [updateStats]);

  const dismissReport = useCallback(async (id: string) => {
    try {
      await api.put(`/admin/reports/${id}/dismiss`);
      
      setReports(prev => {
        const updated = prev.map(report => 
          report.id === id ? { ...report, status: 'dismissed' as const } : report
        );
        updateStats(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error dismissing report:', error);
      // Mock success for development
      setReports(prev => {
        const updated = prev.map(report => 
          report.id === id ? { ...report, status: 'dismissed' as const } : report
        );
        updateStats(updated);
        return updated;
      });
    }
  }, [updateStats]);

  const deleteReport = useCallback(async (id: string) => {
    try {
      await api.delete(`/admin/reports/${id}`);
      
      setReports(prev => {
        const updated = prev.filter(report => report.id !== id);
        updateStats(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      // Mock success for development
      setReports(prev => {
        const updated = prev.filter(report => report.id !== id);
        updateStats(updated);
        return updated;
      });
    }
  }, [updateStats]);

  return {
    reports,
    loading,
    stats,
    fetchReports,
    resolveReport,
    dismissReport,
    deleteReport
  };
}