import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';
import { Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formFields = [
    {
      name: 'email',
      label: 'البريد الإلكتروني',
      type: 'email',
      value: formData.email,
      placeholder: 'أدخل بريدك الإلكتروني',
      required: true
    },
    {
      name: 'password',
      label: 'كلمة المرور',
      type: showPassword ? 'text' : 'password',
      value: formData.password,
      placeholder: 'أدخل كلمة المرور',
      required: true,
      icon: (
        <button
          type="button"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )
    }
  ];

  return (
    <AuthLayout
      title="مرحباً بك مرة أخرى"
      subtitle="سجل دخولك للوصول إلى حسابك وإدارة إعلاناتك"
      imageUrl="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop"
    >
      <AuthForm
        title="تسجيل الدخول"
        fields={formFields}
        onSubmit={handleSubmit}
        onChange={handleChange}
        submitLabel="دخول"
        loading={loading}
        error={error}
        icon={<LogIn className="w-5 h-5" />}
      >
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="mr-2 text-sm text-gray-600">تذكرني</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>
        
        <div className="text-center">
          <span className="text-gray-600">لا تملك حساباً؟</span>{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            أنشئ حساباً جديداً
          </Link>
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default Login;