import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit, Package, Heart, MessageCircle, Bell, Settings, Camera, Phone, Mail, MapPin, Calendar, ShoppingBag, Eye, Star } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import ProfileCard from '../components/ProfileCard';
import UserListings from '../components/UserListings';
import { formatDate } from '../utils/helpers';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, stats, loading } = useProfile();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: User },
    { id: 'listings', label: 'إعلاناتي', icon: Package, count: stats?.activeListings },
    { id: 'favorites', label: 'المفضلة', icon: Heart, count: stats?.favorites },
    { id: 'messages', label: 'الرسائل', icon: MessageCircle, count: stats?.unreadMessages },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Section with Cover Photo */}
      <div className="relative h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/30"></div>
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Profile Picture and Basic Info */}
        <div className="absolute bottom-0 right-0 left-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-6">
              <div className="relative">
                <img
                  src={profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
                  alt={profile?.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                />
                <button className="absolute bottom-2 left-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{profile?.name}</h1>
                  {profile?.isVerified && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      موثق
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>انضم في {formatDate(profile?.joinedAt || new Date())}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile?.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{stats?.profileViews} مشاهدة</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/profile/edit')}
                className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                تحرير الملف الشخصي
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 -mt-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Quick Stats */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الإعلانات النشطة</span>
                    <span className="font-semibold text-blue-600">{stats?.activeListings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">إجمالي المبيعات</span>
                    <span className="font-semibold text-green-600">{stats?.totalSales || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">التقييم</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{stats?.rating || '5.0'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">مشاهدات الملف</span>
                    <span className="font-semibold text-purple-600">{stats?.profileViews || 0}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/create-listing')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    إضافة إعلان جديد
                  </button>
                  <button
                    onClick={() => navigate('/my-listings')}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    إدارة الإعلانات
                  </button>
                  <button
                    onClick={() => navigate('/profile/settings')}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    إعدادات الحساب
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات التواصل</h3>
                <div className="space-y-3">
                  {profile?.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile?.city && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.city}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" dir="ltr">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                          isActive
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                        {tab.count && tab.count > 0 && (
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">نظرة عامة</h2>
                    
                    {/* About Section */}
                    {profile?.bio && (
                      <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">نبذة عني</h3>
                        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                      </div>
                    )}

                    {/* Recent Activity */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-blue-600 text-white p-3 rounded-xl">
                            <Package className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">آخر الإعلانات</h3>
                            <p className="text-gray-600 text-sm">{stats?.activeListings || 0} إعلان نشط</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-green-600 text-white p-3 rounded-xl">
                            <MessageCircle className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">الرسائل</h3>
                            <p className="text-gray-600 text-sm">{stats?.unreadMessages || 0} رسالة جديدة</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'listings' && (
                  <UserListings userId={profile?.id} showManagement={true} />
                )}

                {activeTab === 'favorites' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">الإعلانات المفضلة</h2>
                    <UserListings userId={profile?.id} showFavorites={true} />
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">الرسائل</h2>
                    <div className="text-center py-12">
                      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">سيتم إضافة قسم الرسائل قريباً</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;