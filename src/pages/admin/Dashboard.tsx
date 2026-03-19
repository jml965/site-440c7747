import React, { useEffect, useState } from 'react';
import { useAdminStats } from '../../hooks/useAdminStats';
import { AdminLayout } from './AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { ChartComponent } from '../../components/admin/ChartComponent';
import { RecentActivity } from '../../components/admin/RecentActivity';
import { Users, FileText, ShoppingBag, AlertTriangle, MessageSquare, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { stats, loading, error, refreshStats } = useAdminStats();
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">حدث خطأ في تحميل البيانات: {error}</p>
          <button 
            onClick={() => refreshStats()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </AdminLayout>
    );
  }

  const chartData = {
    labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    datasets: [
      {
        label: 'إعلانات جديدة',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'مستخدمين جدد',
        data: [8, 12, 10, 18, 15, 20, 18],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
              <p className="text-gray-600">نظرة عامة على نشاط المنصة</p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">آخر 7 أيام</option>
                <option value="30d">آخر 30 يوم</option>
                <option value="90d">آخر 3 أشهر</option>
              </select>
              <button 
                onClick={() => refreshStats()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                تحديث
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="إجمالي المستخدمين"
            value={stats?.totalUsers || 0}
            change={stats?.usersChange || 0}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="إجمالي الإعلانات"
            value={stats?.totalListings || 0}
            change={stats?.listingsChange || 0}
            icon={FileText}
            color="green"
          />
          <StatCard
            title="الإعلانات النشطة"
            value={stats?.activeListings || 0}
            change={stats?.activeListingsChange || 0}
            icon={ShoppingBag}
            color="purple"
          />
          <StatCard
            title="البلاغات المعلقة"
            value={stats?.pendingReports || 0}
            change={stats?.reportsChange || 0}
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">الرسائل</h3>
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">إجمالي الرسائل</span>
                <span className="font-semibold">{stats?.totalMessages || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الرسائل اليوم</span>
                <span className="font-semibold text-green-600">{stats?.todayMessages || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">الأقسام</h3>
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">إجمالي الأقسام</span>
                <span className="font-semibold">{stats?.totalCategories || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الأقسام النشطة</span>
                <span className="font-semibold text-green-600">{stats?.activeCategories || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">الإحصائيات السريعة</h3>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">معدل النمو</span>
                <span className="font-semibold text-green-600">+{stats?.growthRate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">مستخدمين نشطين</span>
                <span className="font-semibold">{stats?.activeUsers || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">نمو المنصة (آخر 7 أيام)</h3>
            <ChartComponent data={chartData} type="line" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع الأقسام</h3>
            <ChartComponent 
              data={{
                labels: ['سيارات', 'عقارات', 'إلكترونيات', 'أثاث', 'ملابس'],
                datasets: [{
                  data: [30, 25, 20, 15, 10],
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                  ]
                }]
              }} 
              type="doughnut" 
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">النشاط الأخير</h3>
          </div>
          <RecentActivity activities={stats?.recentActivities || []} />
        </div>
      </div>
    </AdminLayout>
  );
}