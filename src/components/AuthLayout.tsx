import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Package, Shield, Users } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  imageUrl,
  children
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              العودة إلى الصفحة الرئيسية
            </Link>
            
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-full mb-4">
                <Package className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">سوق المستعمل</h1>
              <p className="text-gray-600 text-sm">منصة البيع والشراء الآمنة</p>
            </div>
          </div>
          
          {children}
          
          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">آمن ومضمون</h3>
              <p className="text-xs text-gray-500">حماية كاملة لبياناتك</p>
            </div>
            
            <div className="p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-2">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">مجتمع موثوق</h3>
              <p className="text-xs text-gray-500">آلاف المستخدمين الموثوقين</p>
            </div>
            
            <div className="p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mb-2">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">تنوع المنتجات</h3>
              <p className="text-xs text-gray-500">جميع الفئات متاحة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - Image & Content */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-12 max-w-lg">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-xl leading-relaxed mb-8 text-blue-100">
            {subtitle}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">+10K</div>
              <div className="text-blue-200 text-sm">مستخدم نشط</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">+5K</div>
              <div className="text-blue-200 text-sm">إعلان شهرياً</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">+20</div>
              <div className="text-blue-200 text-sm">فئة منتجات</div>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <p className="text-blue-100 mb-4 italic">
              "منصة رائعة للبيع والشراء. واجهة سهلة وتعامل آمن مع المشترين والبائعين."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-right">
                <div className="text-white font-medium text-sm">أحمد محمد</div>
                <div className="text-blue-200 text-xs">مستخدم منذ سنتين</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;