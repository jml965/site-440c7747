import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { 
  Bell, 
  MessageCircle, 
  Heart, 
  ShoppingBag, 
  User, 
  AlertTriangle,
  Smartphone,
  Mail,
  Monitor,
  Volume2,
  VolumeX
} from 'lucide-react';

interface NotificationPreferences {
  messages: boolean;
  favorites: boolean;
  listings: boolean;
  users: boolean;
  alerts: boolean;
  email: boolean;
  push: boolean;
  sound: boolean;
}

export function NotificationSettings() {
  const { preferences, updatePreferences, loading } = useNotifications();
  const [localPreferences, setLocalPreferences] = React.useState<NotificationPreferences>({
    messages: true,
    favorites: true,
    listings: true,
    users: false,
    alerts: true,
    email: true,
    push: true,
    sound: false
  });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences(localPreferences);
      // Show success message
    } catch (error) {
      console.error('Error updating preferences:', error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const notificationTypes = [
    {
      key: 'messages' as keyof NotificationPreferences,
      label: 'رسائل جديدة',
      description: 'إشعار عند استلام رسالة جديدة',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      key: 'favorites' as keyof NotificationPreferences,
      label: 'المفضلة',
      description: 'إشعار عند إضافة إعلان للمفضلة',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-red-600'
    },
    {
      key: 'listings' as keyof NotificationPreferences,
      label: 'الإعلانات',
      description: 'إشعارات متعلقة بإعلاناتك',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      key: 'users' as keyof NotificationPreferences,
      label: 'المستخدمون',
      description: 'إشعارات عن أنشطة المستخدمين',
      icon: <User className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      key: 'alerts' as keyof NotificationPreferences,
      label: 'التنبيهات',
      description: 'تنبيهات أمنية ومهمة',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-orange-600'
    }
  ];

  const deliveryMethods = [
    {
      key: 'push' as keyof NotificationPreferences,
      label: 'إشعارات المتصفح',
      description: 'إشعارات فورية في المتصفح',
      icon: <Monitor className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      key: 'email' as keyof NotificationPreferences,
      label: 'البريد الإلكتروني',
      description: 'إرسال الإشعارات للبريد الإلكتروني',
      icon: <Mail className="w-5 h-5" />,
      color: 'text-gray-600'
    },
    {
      key: 'sound' as keyof NotificationPreferences,
      label: 'الصوت',
      description: 'تشغيل صوت مع الإشعارات',
      icon: localPreferences.sound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />,
      color: localPreferences.sound ? 'text-green-600' : 'text-gray-400'
    }
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Notification Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          أنواع الإشعارات
        </h3>
        
        <div className="space-y-3">
          {notificationTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`${type.color} p-2 bg-white rounded-lg`}>
                  {type.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{type.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPreferences[type.key]}
                  onChange={() => handleToggle(type.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-green-600" />
          طرق الإشعار
        </h3>
        
        <div className="space-y-3">
          {deliveryMethods.map((method) => (
            <div key={method.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`${method.color} p-2 bg-white rounded-lg`}>
                  {method.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{method.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPreferences[method.key]}
                  onChange={() => handleToggle(method.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري الحفظ...
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              حفظ الإعدادات
            </>
          )}
        </button>
      </div>
    </div>
  );
}