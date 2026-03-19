import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, AlertTriangle, Trash2, Key, Bell, Globe, Smartphone } from 'lucide-react';

interface AccountSettingsProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  onSubmit,
  isSubmitting = false,
  errors = {}
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('password');
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [dataDownload, setDataDownload] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return;
    }
    
    await onSubmit({
      type: 'password',
      ...passwordForm
    });
    
    // Reset form on success
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.'
    );
    
    if (confirmed) {
      const doubleConfirmed = window.confirm(
        'سيتم حذف جميع بياناتك وإعلاناتك نهائياً. هل أنت متأكد؟'
      );
      
      if (doubleConfirmed) {
        await onSubmit({ type: 'delete-account' });
      }
    }
  };

  const sections = [
    {
      id: 'password',
      title: 'تغيير كلمة المرور',
      icon: Lock,
      description: 'تحديث كلمة مرورك الحالية'
    },
    {
      id: 'security',
      title: 'إعدادات الأمان',
      icon: Shield,
      description: 'تفعيل المصادقة الثنائية وإعدادات الأمان'
    },
    {
      id: 'privacy',
      title: 'الخصوصية والبيانات',
      icon: Eye,
      description: 'إدارة خصوصيتك وبياناتك الشخصية'
    },
    {
      id: 'danger',
      title: 'المنطقة الخطرة',
      icon: AlertTriangle,
      description: 'حذف الحساب والإعدادات الحساسة'
    }
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-xl">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 min-w-0 p-3 rounded-lg transition-colors text-sm ${
                isActive
                  ? 'bg-white text-blue-600 shadow-sm font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Icon className="h-4 w-4 mx-auto mb-1" />
              <div className="truncate">{section.title}</div>
            </button>
          );
        })}
      </div>

      {/* Password Section */}
      {activeSection === 'password' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">تغيير كلمة المرور</h3>
              <p className="text-gray-600 text-sm">تأكد من استخدام كلمة مرور قوية</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور الحالية *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({...prev, currentPassword: e.target.value}))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل كلمة المرور الحالية"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور الجديدة *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل كلمة المرور الجديدة"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">يجب أن تحتوي على 8 أحرف على الأقل</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور الجديدة *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({...prev, confirmPassword: e.target.value}))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {passwordForm.newPassword && passwordForm.confirmPassword && 
               passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">كلمات المرور غير متطابقة</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || passwordForm.newPassword !== passwordForm.confirmPassword}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </button>
          </form>
        </div>
      )}

      {/* Security Section */}
      {activeSection === 'security' && (
        <div className="space-y-6">
          {/* Two Factor Authentication */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">المصادقة الثنائية</h3>
                  <p className="text-gray-600 text-sm">طبقة حماية إضافية لحسابك</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {twoFactorEnabled && (
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">تطبيق المصادقة</span>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  استخدم تطبيقاً مثل Google Authenticator أو Authy لإنشاء رموز المصادقة.
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  إعداد المصادقة الثنائية
                </button>
              </div>
            )}
          </div>

          {/* Login Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">تنبيهات تسجيل الدخول</h3>
                  <p className="text-gray-600 text-sm">تلقي إشعار عند تسجيل الدخول من جهاز جديد</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={loginAlerts}
                  onChange={(e) => setLoginAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">الجلسات النشطة</h3>
                <p className="text-gray-600 text-sm">إدارة الأجهزة المتصلة بحسابك</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">الجهاز الحالي</div>
                  <div className="text-sm text-gray-600">Chrome على Windows • الرياض، السعودية</div>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  نشط الآن
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">iPhone</div>
                  <div className="text-sm text-gray-600">Safari على iOS • منذ 3 أيام</div>
                </div>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  إنهاء الجلسة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Section */}
      {activeSection === 'privacy' && (
        <div className="space-y-6">
          {/* Data Download */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                  <Key className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">تنزيل بياناتك</h3>
                  <p className="text-gray-600 text-sm">احصل على نسخة من جميع بياناتك</p>
                </div>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              طلب تنزيل البيانات
            </button>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">إعدادات الخصوصية</h3>
                <p className="text-gray-600 text-sm">تحكم في من يمكنه رؤية معلوماتك</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">إظهار رقم الهاتف في الإعلانات</div>
                  <div className="text-sm text-gray-600">السماح للمهتمين برؤية رقمك مباشرة</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">إظهار آخر ظهور</div>
                  <div className="text-sm text-gray-600">السماح للآخرين برؤية آخر مرة كنت نشطاً فيها</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">فهرسة الملف الشخصي</div>
                  <div className="text-sm text-gray-600">السماح لمحركات البحث بفهرسة ملفك الشخصي</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Danger Section */}
      {activeSection === 'danger' && (
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 text-red-600 p-3 rounded-xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">المنطقة الخطرة</h3>
              <p className="text-red-600 text-sm">الإجراءات التي لا يمكن التراجع عنها</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-900">حذف الحساب نهائياً</h4>
                <p className="text-red-700 text-sm mt-1">
                  سيتم حذف جميع بياناتك، إعلاناتك، ورسائلك نهائياً. لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>
            
            <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-gray-900 mb-2">ما سيتم حذفه:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• جميع إعلاناتك المنشورة</li>
                <li>• تاريخ الرسائل والمحادثات</li>
                <li>• قائمة المفضلة</li>
                <li>• الملف الشخصي والصور</li>
                <li>• جميع البيانات الشخصية</li>
              </ul>
            </div>
            
            <button
              onClick={handleDeleteAccount}
              disabled={isSubmitting}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isSubmitting ? 'جاري الحذف...' : 'حذف الحساب نهائياً'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;