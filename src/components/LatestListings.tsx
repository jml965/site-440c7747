import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types';
import { formatPrice, formatDate } from '../utils/helpers';

const LatestListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock latest listings data
    const fetchLatestListings = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockLatestListings: Listing[] = [
        {
          id: '5',
          title: 'PlayStation 5 مع يدين',
          description: 'بلايستيشن 5 استخدام خفيف، مع يدين إضافية و3 ألعاب، حالة ممتازة',
          price: 2200,
          currency: 'SAR',
          condition: 'excellent',
          categoryId: 'electronics',
          subcategoryId: 'gaming',
          userId: 'user5',
          userName: 'عبدالله الغامدي',
          userPhone: '+966505678901',
          userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face',
          city: 'الرياض',
          district: 'النرجس',
          images: [
            'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=600&fit=crop'
          ],
          status: 'active',
          isFeatured: false,
          views: 89,
          likes: 7,
          createdAt: new Date('2024-01-11'),
          updatedAt: new Date('2024-01-11')
        },
        {
          id: '6',
          title: 'دراجة نارية هوندا CBR',
          description: 'هوندا CBR 600RR موديل 2019، حالة ممتازة، ليس عليها حوادث، صيانة دورية منتظمة',
          price: 28000,
          currency: 'SAR',
          condition: 'excellent',
          categoryId: 'vehicles',
          subcategoryId: 'motorcycles',
          userId: 'user6',
          userName: 'خالد المطيري',
          userPhone: '+966506789012',
          userAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop&crop=face',
          city: 'جدة',
          district: 'الصفا',
          images: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop'
          ],
          status: 'active',
          isFeatured: false,
          views: 124,
          likes: 11,
          createdAt: new Date('2024-01-11'),
          updatedAt: new Date('2024-01-11')
        },
        {
          id: '7',
          title: 'طقم أثاث غرفة نوم',
          description: 'طقم غرفة نوم مودرن، سرير + دولابين + تسريحة، خشب ممتاز، استخدام قليل',
          price: 3500,
          currency: 'SAR',
          condition: 'good',
          categoryId: 'furniture',
          subcategoryId: 'bedroom',
          userId: 'user7',
          userName: 'مريم الشهري',
          userPhone: '+966507890123',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          city: 'الرياض',
          district: 'الورود',
          images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop'
          ],
          status: 'active',
          isFeatured: false,
          views: 67,
          likes: 5,
          createdAt: new Date('2024-01-11'),
          updatedAt: new Date('2024-01-11')
        },
        {
          id: '8',
          title: 'ساعة رولكس أصلية',
          description: 'ساعة رولكس Submariner أصلية مع الأوراق والكرتون، حالة ممتازة، شراء من معرض معتمد',
          price: 45000,
          currency: 'SAR',
          condition: 'excellent',
          categoryId: 'accessories',
          subcategoryId: 'watches',
          userId: 'user8',
          userName: 'عمر السعدي',
          userPhone: '+966508901234',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          city: 'الدمام',
          district: 'الركة',
          images: [
            'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=800&h=600&fit=crop'
          ],
          status: 'active',
          isFeatured: false,
          views: 201,
          likes: 23,
          createdAt: new Date('2024-01-11'),
          updatedAt: new Date('2024-01-11')
        },
        {
          id: '9',
          title: 'كاميرا كانون DSLR',
          description: 'كاميرا Canon EOS 5D Mark IV مع عدسة 24-70mm، حالة ممتازة، استخدام شخصي محترف',
          price: 6800,
          currency: 'SAR',
          condition: 'excellent',
          categoryId: 'electronics',
          subcategoryId: 'cameras',
          userId: 'user9',
          userName: 'نورا الحربي',
          userPhone: '+966509012345',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
          city: 'جدة',
          district: 'الزهراء',
          images: [
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&h=600&fit=crop'
          ],
          status: 'active',
          isFeatured: false,
          views: 98,
          likes: 12,
          createdAt: new Date('2024-01-11'),
          updatedAt: new Date('2024-01-11')
        },
        {
          id: '10',
          title: 'جهاز تمارين منزلي',
          description: 'جهاز تمارين شامل للمنزل، استخدام قليل، جميع القطع موجودة مع دليل التشغيل',
          price: 1800,
          currency: 'SAR',
          condition: 'good',
          categoryId: 'sports',
          subcategoryId: 'fitness',
          userId: 'user10',
          userName: 'طارق الجهني',
          userPhone: '+966501012345',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          city: 'الرياض',
          district: 'السليمانية',
          images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop'
          ],
          status: 'active',
          isFeatured: false,
          views: 45,
          likes: 3,
          createdAt: new Date('2024-01-11'),
          updatedAt: new Date('2024-01-11')
        }
      ];
      
      setListings(mockLatestListings);
      setLoading(false);
    };

    fetchLatestListings();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
            <div className="w-full h-48 bg-gray-200" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-6 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-100 rounded mb-2" />
              <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div key={listing.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* New Badge */}
            <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
              جديد
            </div>
            
            {/* Condition Badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
              {listing.condition === 'excellent' ? 'ممتاز' : 
               listing.condition === 'good' ? 'جيد' : 
               listing.condition === 'fair' ? 'مقبول' : 'للقطع'}
            </div>
            
            {/* Heart Icon */}
            <button className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors group/heart">
              <svg className="w-4 h-4 text-gray-600 group-hover/heart:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center mb-3">
              <img
                src={listing.userAvatar}
                alt={listing.userName}
                className="w-8 h-8 rounded-full mr-2"
                loading="lazy"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{listing.userName}</div>
                <div className="text-xs text-gray-500">{formatDate(listing.createdAt)}</div>
              </div>
            </div>
            
            {/* Title */}
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {listing.title}
            </h3>
            
            {/* Price */}
            <div className="text-xl font-bold text-green-600 mb-3">
              {formatPrice(listing.price, listing.currency)}
            </div>
            
            {/* Location */}
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {listing.city} - {listing.district}
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-400">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {listing.views}
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {listing.likes}
                </div>
              </div>
              
              <Link
                to={`/listings/${listing.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                عرض التفاصيل
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestListings;