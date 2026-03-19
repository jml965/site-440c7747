import type { ListingCondition, ReportReason, AppConstants } from '../types';

// Application Constants
export const APP_CONFIG: AppConstants = {
  APP_NAME: 'سوق المستعمل',
  APP_DESCRIPTION: 'منصة بيع وشراء المنتجات المستعملة',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  ITEMS_PER_PAGE: 12,
  MAX_IMAGES_PER_LISTING: 8,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  LISTING_EXPIRY_DAYS: 30,
  CITIES: [
    'الرياض',
    'جدة',
    'مكة المكرمة',
    'المدينة المنورة',
    'الدمام',
    'الخبر',
    'الظهران',
    'تبوك',
    'بريدة',
    'خميس مشيط',
    'حائل',
    'المجمعة',
    'الأحساء',
    'نجران',
    'جازان',
    'عرعر',
    'سكاكا',
    'أبها',
    'ينبع',
    'الطائف',
    'القطيف',
    'صفوى',
    'رابغ',
    'محايل عسير',
    'الباحة',
    'القنفذة',
    'صبيا',
    'أخرى'
  ],
  CONDITIONS: ['جديد', 'مستعمل', 'ممتاز', 'جيد', 'يحتاج إصلاح'] as ListingCondition[],
  REPORT_REASONS: [
    { value: 'spam', label: 'إعلان مكرر أو عشوائي' },
    { value: 'inappropriate_content', label: 'محتوى غير مناسب' },
    { value: 'fake_listing', label: 'إعلان وهمي' },
    { value: 'fraud', label: 'احتيال أو نصب' },
    { value: 'harassment', label: 'تحرش أو إزعاج' },
    { value: 'copyright_violation', label: 'انتهاك حقوق الطبع والنشر' },
    { value: 'other', label: 'سبب آخر' }
  ] as { value: ReportReason; label: string }[]
};

// Category Icons Map
export const CATEGORY_ICONS = {
  'cars': 'Car',
  'real-estate': 'Home',
  'mobiles': 'Smartphone',
  'electronics': 'Laptop',
  'furniture': 'Sofa',
  'appliances': 'Refrigerator',
  'clothing': 'Shirt',
  'watches': 'Watch',
  'tools': 'Wrench',
  'kids': 'Baby',
  'sports': 'Dumbbell',
  'other': 'Package'
} as const;

// Default Categories
export const DEFAULT_CATEGORIES = [
  {
    name: 'سيارات',
    slug: 'cars',
    icon: 'Car',
    description: 'سيارات مستعملة وجديدة للبيع'
  },
  {
    name: 'عقارات',
    slug: 'real-estate',
    icon: 'Home',
    description: 'شقق، فلل، أراضي، ومحلات تجارية'
  },
  {
    name: 'جوالات',
    slug: 'mobiles',
    icon: 'Smartphone',
    description: 'هواتف ذكية وأجهزة لوحية'
  },
  {
    name: 'إلكترونيات',
    slug: 'electronics',
    icon: 'Laptop',
    description: 'أجهزة كمبيوتر، ألعاب، وإلكترونيات'
  },
  {
    name: 'أثاث',
    slug: 'furniture',
    icon: 'Sofa',
    description: 'أثاث منزلي ومكتبي'
  },
  {
    name: 'أجهزة منزلية',
    slug: 'appliances',
    icon: 'Refrigerator',
    description: 'ثلاجات، غسالات، ومكيفات'
  },
  {
    name: 'ملابس',
    slug: 'clothing',
    icon: 'Shirt',
    description: 'ملابس رجالية ونسائية وأطفال'
  },
  {
    name: 'ساعات وإكسسوارات',
    slug: 'watches',
    icon: 'Watch',
    description: 'ساعات، مجوهرات، وإكسسوارات'
  },
  {
    name: 'معدات وأدوات',
    slug: 'tools',
    icon: 'Wrench',
    description: 'أدوات ومعدات صناعية ومنزلية'
  },
  {
    name: 'مستلزمات أطفال',
    slug: 'kids',
    icon: 'Baby',
    description: 'ألعاب، ملابس، ومستلزمات الأطفال'
  },
  {
    name: 'رياضة',
    slug: 'sports',
    icon: 'Dumbbell',
    description: 'معدات رياضية وأدوات اللياقة'
  },
  {
    name: 'أخرى',
    slug: 'other',
    icon: 'Package',
    description: 'منتجات أخرى متنوعة'
  }
];

// UI Constants
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;

// Color Palette
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  }
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  RECENT_SEARCHES: 'recentSearches',
  VIEWED_LISTINGS: 'viewedListings',
  DRAFT_LISTING: 'draftListing',
  THEME: 'theme',
  LANGUAGE: 'language'
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_LISTINGS: (id: string) => `/users/${id}/listings`,
  
  // Listings
  LISTINGS: '/listings',
  LISTING_BY_ID: (id: string) => `/listings/${id}`,
  LISTING_IMAGES: (id: string) => `/listings/${id}/images`,
  LISTING_VIEWS: (id: string) => `/listings/${id}/views`,
  SEARCH_LISTINGS: '/listings/search',
  FEATURED_LISTINGS: '/listings/featured',
  RECENT_LISTINGS: '/listings/recent',
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,
  CATEGORY_LISTINGS: (id: string) => `/categories/${id}/listings`,
  
  // Favorites
  FAVORITES: '/favorites',
  TOGGLE_FAVORITE: (listingId: string) => `/favorites/${listingId}`,
  
  // Messages & Conversations
  CONVERSATIONS: '/conversations',
  CONVERSATION_BY_ID: (id: string) => `/conversations/${id}`,
  CONVERSATION_MESSAGES: (id: string) => `/conversations/${id}/messages`,
  SEND_MESSAGE: (id: string) => `/conversations/${id}/messages`,
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_BY_ID: (id: string) => `/notifications/${id}`,
  MARK_NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_NOTIFICATIONS_READ: '/notifications/read-all',
  
  // Reports
  REPORTS: '/reports',
  REPORT_BY_ID: (id: string) => `/reports/${id}`,
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_LISTINGS: '/admin/listings',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_STATISTICS: '/admin/statistics',
  
  // Uploads
  UPLOAD_IMAGE: '/upload/image',
  UPLOAD_IMAGES: '/upload/images',
  DELETE_IMAGE: (id: string) => `/upload/images/${id}`
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  USER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: false
  },
  LISTING_TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100
  },
  LISTING_DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 2000
  },
  LISTING_PRICE: {
    MIN: 1,
    MAX: 10000000
  },
  PHONE: {
    PATTERN: /^[0-9+\-\s()]+$/,
    MIN_LENGTH: 10,
    MAX_LENGTH: 15
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
} as const;

// Default Images
export const DEFAULT_IMAGES = {
  USER_AVATAR: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  PLACEHOLDER_LISTING: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
  CATEGORY_PLACEHOLDER: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=200&h=200&fit=crop',
  HERO_BACKGROUND: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop',
  EMPTY_STATE: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  MEDIUM: 'DD MMM YYYY',
  LONG: 'DD MMMM YYYY',
  WITH_TIME: 'DD/MM/YYYY HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'هذا الحقل مطلوب',
  INVALID_EMAIL: 'البريد الإلكتروني غير صحيح',
  PASSWORD_TOO_SHORT: 'كلمة المرور قصيرة جداً',
  PASSWORD_MISMATCH: 'كلمات المرور غير متطابقة',
  INVALID_PHONE: 'رقم الهاتف غير صحيح',
  FILE_TOO_LARGE: 'حجم الملف كبير جداً',
  INVALID_FILE_TYPE: 'نوع الملف غير مدعوم',
  NETWORK_ERROR: 'خطأ في الشبكة، يرجى المحاولة مرة أخرى',
  UNAUTHORIZED: 'غير مخول للوصول',
  NOT_FOUND: 'العنصر المطلوب غير موجود',
  SERVER_ERROR: 'خطأ في الخادم، يرجى المحاولة لاحقاً'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LISTING_CREATED: 'تم إنشاء الإعلان بنجاح',
  LISTING_UPDATED: 'تم تحديث الإعلان بنجاح',
  LISTING_DELETED: 'تم حذف الإعلان بنجاح',
  PROFILE_UPDATED: 'تم تحديث الملف الشخصي بنجاح',
  MESSAGE_SENT: 'تم إرسال الرسالة بنجاح',
  FAVORITE_ADDED: 'تم إضافة الإعلان للمفضلة',
  FAVORITE_REMOVED: 'تم حذف الإعلان من المفضلة',
  REPORT_SUBMITTED: 'تم إرسال البلاغ بنجاح',
  LOGIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
  REGISTER_SUCCESS: 'تم إنشاء الحساب بنجاح',
  LOGOUT_SUCCESS: 'تم تسجيل الخروج بنجاح'
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_CHAT: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_FAVORITES: true,
  ENABLE_REPORTS: true,
  ENABLE_ANALYTICS: false,
  ENABLE_PWA: true,
  ENABLE_DARK_MODE: false,
  ENABLE_MULTI_LANGUAGE: false
} as const;

// Performance Limits
export const PERFORMANCE_LIMITS = {
  DEBOUNCE_SEARCH: 500, // ms
  THROTTLE_SCROLL: 100, // ms
  MAX_CONCURRENT_UPLOADS: 3,
  IMAGE_COMPRESSION_QUALITY: 0.8,
  LAZY_LOADING_THRESHOLD: 200, // px
  VIRTUAL_LIST_ITEM_HEIGHT: 120 // px
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/souq_almustaemal',
  FACEBOOK: 'https://facebook.com/souq.almustaemal',
  INSTAGRAM: 'https://instagram.com/souq_almustaemal',
  LINKEDIN: 'https://linkedin.com/company/souq-almustaemal',
  WHATSAPP: 'https://wa.me/966500000000',
  EMAIL: 'info@souqalmustaemal.com'
} as const;