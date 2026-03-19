import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';
import { Eye, EyeOff, UserPlus, MapPin, Phone, User, Mail } from 'lucide-react';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const cities = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
    'الخبر', 'تبوك', 'بريدة', 'خميس مشيط', 'حائل', 'الطائف',
    'الأحساء', 'ينبع', 'جازان', 'نجران', 'الباحة', 'عرعر',
    'سكاكا', 'أبها', 'القطيف'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتان');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('يجب الموافقة على الشروط والأحكام');
      setLoading(false);
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        password: formData.password
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الحساب. تأكد من البيانات وحاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const formFields = [
    {
      name: 'firstName',
      label: 'الاسم الأول',
      type: 'text',
      value: formData.firstName,
      placeholder: 'أدخل اسمك الأول',
      required: true,
      icon: <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    },
    {
      name: 'lastName',
      label: 'الاسم الأخير',
      type: 'text',
      value: formData.lastName,
      placeholder: 'أدخل اسمك الأخير',
      required: true,
      icon: <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    },
    {
      name: 'email',
      label: 'البريد الإلكتروني',
      type: 'email',
      value: formData.email,
      placeholder: 'أدخل بريدك الإلكتروني',
      required: true,
      icon: <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    },
    {
      name: 'phone',
      label: 'رقم الهاتف',
      type: 'tel',
      value: formData.phone,
      placeholder: '05xxxxxxxx',
      required: true,
      icon: <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    },
    {
      name: 'city',
      label: 'المدينة',
      type: 'select',
      value: formData.city,
      required: true,
      options: cities,
      icon: <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    },
    {
      name: 'password',
      label: 'كلمة المرور',
      type: showPassword ? 'text' : 'password',
      value: formData.password,
      placeholder: 'أدخل كلمة المرور (6 أحرف على الأقل)',
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
    },
    {
      name: 'confirmPassword',
      label: 'تأكيد كلمة المرور',
      type: showConfirmPassword ? 'text' : 'password',
      value: formData.confirmPassword,
      placeholder: 'أعد إدخال كلمة المرور',
      required: true,
      icon: (
        <button
          type="button"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )
    }
  ];

  return (
    <AuthLayout
      title="انضم إلى منصتنا اليوم"
      subtitle="أنشئ حسابك الآن وابدأ في بيع وشراء المنتجات المستعملة بسهولة"
      imageUrl="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop"
    >
      <AuthForm
        title="إنشاء حساب جديد"
        fields={formFields}
        onSubmit={handleSubmit}
        onChange={handleChange}
        submitLabel="إنشاء الحساب"
        loading={loading}
        error={error}
        icon={<UserPlus className="w-5 h-5" />}
      >
        <div className="mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              required
            />
            <span className="mr-2 text-sm text-gray-600 leading-relaxed">
              أوافق على{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800 transition-colors">
                الشروط والأحكام
              </Link>
              {' '}و{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800 transition-colors">
                سياسة الخصوصية
              </Link>
            </span>
          </label>
        </div>
        
        <div className="text-center">
          <span className="text-gray-600">لديك حساب بالفعل؟</span>{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            سجل الدخول
          </Link>
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default Register;