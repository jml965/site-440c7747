import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Save, Camera, User, Mail, Phone, MapPin, Calendar, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import ProfileForm from '../components/ProfileForm';
import AccountSettings from '../components/AccountSettings';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, loading } = useProfile();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      await updateProfile(formData);
      setSuccessMessage('تم تحديث الملف الشخصي بنجاح');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      setErrors({ general: error.message || 'حدث خطأ أثناء تحديث الملف الشخصي' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    {
      id: 'profile',
      label: 'المعلومات الشخصية',
      icon: User,
      description: 'تحديث معلوماتك الأساسية'
    },
    {
      id: 'security',
      label: 'الأمان والخصوصية',
      icon: Shield,
      description: 'إدارة كلمة المرور والإعدادات الأمنية'
    },
    {
      id: 'preferences',
      label: 'التفضيلات',
      icon: Eye,
      description: 'تخصيص تجربتك على المنصة'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">تحرير الملف الشخصي</h1>
                <p className="mt-2 text-gray-600">قم بتحديث معلوماتك الشخصية وإعداداتك</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-800 font-medium">{errors.general}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                {/* Profile Preview */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
                      alt={profile?.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 left-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors">
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                  <h3 className="mt-3 font-semibold text-gray-900">{profile?.name}</h3>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-right p-3 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div className="flex-1">
                            <div className="font-medium">{tab.label}</div>
                            <div className="text-xs text-gray-500">{tab.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="p-8">
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">المعلومات الشخصية</h2>
                        <p className="text-gray-600 mt-1">قم بتحديث معلوماتك الشخصية الأساسية</p>
                      </div>
                    </div>

                    <ProfileForm
                      initialData={profile}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      errors={errors}
                    />
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">الأمان والخصوصية</h2>
                        <p className="text-gray-600 mt-1">إدارة كلمة المرور والإعدادات الأمنية</p>
                      </div>
                    </div>

                    <AccountSettings
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      errors={errors}
                    />
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">التفضيلات</h2>
                        <p className="text-gray-600 mt-1">تخصيص تجربتك على المنصة</p>
                      </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الإشعارات</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">إشعارات الرسائل</h4>
                              <p className="text-sm text-gray-600">تلقي إشعارات عند وصول رسائل جديدة</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">إشعارات الإعلانات</h4>
                              <p className="text-sm text-gray-600">تلقي إشعارات حول نشاط إعلاناتك</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">إشعارات العروض الجديدة</h4>
                              <p className="text-sm text-gray-600">تلقي إشعارات حول الإعلانات الجديدة في اهتماماتك</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Privacy Settings */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الخصوصية</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">إظهار رقم الهاتف</h4>
                              <p className="text-sm text-gray-600">السماح للمستخدمين برؤية رقم هاتفك</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">إظهار آخر ظهور</h4>
                              <p className="text-sm text-gray-600">السماح للمستخدمين برؤية آخر مرة كنت نشطاً فيها</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Save className="h-5 w-5" />
                          حفظ التفضيلات
                        </button>
                      </div>
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

export default EditProfile;