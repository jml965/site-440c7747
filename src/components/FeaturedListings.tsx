import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types';
import { formatPrice, formatDate } from '../utils/helpers';

const FeaturedListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock featured listings data
    const fetchFeaturedListings = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFeaturedListings: Listing[] = [
        {
          id: '1',
          title: 'آيفون 14 برو مكس 256 جيجا',
          description: 'آيفون 14 برو مكس بحالة ممتازة، استخدام شخصي، جميع الملحقات موجودة، لا يوجد خدوش أو كسور',
          price: 4500,
          currency: 'SAR',
          condition: 'excellent',
          categoryId: 'mobiles',
          subcategoryId: 'smartphones',
          userId: 'user1',
          userName: 'أحمد محمد',
          userPhone: '+966501234567',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          city: 'الرياض',
          district: 'العليا',
          images: [
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=600&fit=crop'
          ],
          status: 'active',
          isFeatured: true,
          views: 245,
          likes: 18,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10')
        },
        {
          id: '2',
          title: 'BMW X5 2020 فل كامل',
          description: 'BMW X5 موديل 2020، فل كامل، حالة ممتازة، سيرفس منتظم، لا يحتاج أي إصلاحات',
          price: 185000,
          currency: 'SAR',
          condition: 'excellent',
          categoryId: 'cars',
          subcategoryId: 'luxury-cars',
          userId: 'user2',
          userName: 'سعد العتيبي',
          userPhone: '+966502345678',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          city: 'جدة',
          district: 'الحمراء',
          images: [
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
          ],
          status: 'active',
          isFeatured: true,
          views: 432,
          likes: 32,
          createdAt: new Date('2024-01-08'),
          updatedAt: new Date('2024-01-08')
        },
        {
          id: '3',
          title: 'شقة للبيع في الرياض',
          description: 'شقة 3 غرف و2 حمام في موقع ممتاز، الطابق الثالث، مساحة 120 متر مربع، تشطيب راقي',
          price: 450000,
          currency: 'SAR',
          condition: 'excellent',
          categoryId: 'real-estate',
          subcategoryId: 'apartments',
          userId: 'user3',
          userName: 'فاطمة الزهراني',
          userPhone: '+966503456789',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          city: 'الرياض',
          district: 'الملز',
          images: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
          ],
          status: 'active',
          isFeatured: true,
          views: 187,
          likes: 24,
          createdAt: new Date('2024-01-09'),
          updatedAt: new Date('2024-01-09')
        },
        {
          id: '4',
          title: 'لابتوب ماك بوك برو 2023',
          description: 'MacBook Pro 16 inch 2023، معالج M2 Pro، 16GB RAM، 512GB SSD، حالة ممتازة مع الكرتون',
          price: 8500,
          currency: 'SAR',
          condition: 'excellent',
          categoryId: 'electronics',
          subcategoryId: 'laptops',
          userId: 'user4',
          userName: 'محمد القحطاني',
          userPhone: '+966504567890',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
          city: 'الدمام',
          district: 'الخبر',
          images: [
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop'
          ],
          status: 'active',
          isFeatured: true,
          views: 156,
          likes: 15,
          createdAt: new Date('2024-01-07'),
          updatedAt: new Date('2024-01-07')
        }
      ];
      
      setListings(mockFeaturedListings);
      setLoading(false);
    };

    fetchFeaturedListings();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            
            {/* Featured Badge */}
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              مميز
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
            {/* Title */}
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {listing.title}
            </h3>
            
            {/* Price */}
            <div className="text-2xl font-bold text-green-600 mb-3">
              {formatPrice(listing.price, listing.currency)}
            </div>
            
            {/* Location & Date */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {listing.city}
              </div>
              <div>{formatDate(listing.createdAt)}</div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4 space-x-reverse">
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
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
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

export default FeaturedListings;