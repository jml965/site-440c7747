import React from 'react';
import { Heart, Search, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyFavorites: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-red-50 to-pink-50 rounded-full flex items-center justify-center">
            <Heart className="h-16 w-16 text-red-300" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          لا توجد إعلانات محفوظة بعد
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          ابدأ بتصفح الإعلانات واحفظ ما يعجبك لتجده هنا بسهولة
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/listings"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Search className="h-5 w-5 ml-2" />
            تصفح الإعلانات
          </Link>
          
          <Link
            to="/create-listing"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Plus className="h-5 w-5 ml-2" />
            إضافة إعلان جديد
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 ml-2" />
            نصائح للاستفادة من المفضلة
          </h3>
          <div className="space-y-3 text-sm text-blue-800 text-right">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 ml-3 flex-shrink-0"></div>
              <span>احفظ الإعلانات التي تهمك للعودة إليها لاحقاً</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 ml-3 flex-shrink-0"></div>
              <span>قارن بين عدة إعلانات بسهولة</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 ml-3 flex-shrink-0"></div>
              <span>تابع التحديثات على الأسعار</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 ml-3 flex-shrink-0"></div>
              <span>شارك الإعلانات المحفوظة مع الأصدقاء</span>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-8">
          <p className="text-gray-500 text-sm mb-4">أو ابدأ بتصفح الأقسام الأكثر شعبية:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { name: 'سيارات', path: '/listings?category=cars' },
              { name: 'عقارات', path: '/listings?category=real-estate' },
              { name: 'جوالات', path: '/listings?category=phones' },
              { name: 'إلكترونيات', path: '/listings?category=electronics' }
            ].map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyFavorites;