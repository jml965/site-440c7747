// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  city: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  whatsapp?: string;
  telegram?: string;
  isPhonePublic: boolean;
  joinedAt: string;
  listingsCount: number;
  rating: number;
  reviewsCount: number;
}

// Listing Types
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  category: Category;
  userId: string;
  user: User;
  city: string;
  condition: ListingCondition;
  status: ListingStatus;
  images: ListingImage[];
  phone: string;
  views: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface ListingImage {
  id: string;
  listingId: string;
  url: string;
  isMain: boolean;
  order: number;
  createdAt: string;
}

export type ListingCondition = 'جديد' | 'مستعمل' | 'ممتاز' | 'جيد' | 'يحتاج إصلاح';
export type ListingStatus = 'active' | 'sold' | 'inactive' | 'pending' | 'rejected';

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  image?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  listingsCount: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// City Types
export interface City {
  id: string;
  name: string;
  slug: string;
  regionId: string;
  region: Region;
  listingsCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
  country: string;
  cities: City[];
  createdAt: string;
}

// Message & Conversation Types
export interface Conversation {
  id: string;
  listingId: string;
  listing: Listing;
  buyerId: string;
  buyer: User;
  sellerId: string;
  seller: User;
  lastMessage?: Message;
  lastMessageAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  conversation?: Conversation;
  senderId: string;
  sender: User;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  user?: User;
  type: NotificationType;
  title: string;
  content: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'message'
  | 'listing_approved'
  | 'listing_rejected'
  | 'listing_expired'
  | 'favorite_added'
  | 'report_received'
  | 'system_announcement'
  | 'account_warning';

// Favorite Types
export interface Favorite {
  id: string;
  userId: string;
  user: User;
  listingId: string;
  listing: Listing;
  createdAt: string;
}

// Report Types
export interface Report {
  id: string;
  reporterId: string;
  reporter: User;
  listingId?: string;
  listing?: Listing;
  userId?: string;
  reportedUser?: User;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reviewedBy?: string;
  reviewer?: User;
  reviewedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportReason = 
  | 'spam'
  | 'inappropriate_content'
  | 'fake_listing'
  | 'fraud'
  | 'harassment'
  | 'copyright_violation'
  | 'other';

export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';

// Search Types
export interface SearchFilters {
  categoryId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ListingCondition;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'views' | 'relevance';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Application State
export interface AppState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Data State
  listings: Listing[];
  categories: Category[];
  favorites: string[];
  conversations: Conversation[];
  notifications: Notification[];
  
  // Search State
  searchResults: Listing[];
  searchQuery: string;
  
  // Current Selection State
  currentConversation: Conversation | null;
  
  // Counters
  unreadNotifications: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  city: string;
  acceptTerms: boolean;
}

export interface CreateListingFormData {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  city: string;
  condition: ListingCondition;
  images: File[];
  phone: string;
}

export interface ProfileUpdateFormData {
  name: string;
  phone: string;
  city: string;
  bio?: string;
  whatsapp?: string;
  telegram?: string;
  isPhonePublic: boolean;
}

// Component Props Types
export interface ListingCardProps {
  listing: Listing;
  showActions?: boolean;
  className?: string;
}

export interface CategoryCardProps {
  category: Category;
  className?: string;
}

export interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnline?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Hook Types
export interface UseLocalStorageOptions {
  defaultValue?: any;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
}

export interface UsePaginationOptions {
  page?: number;
  limit?: number;
  total?: number;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
  [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
}[Keys];

// Constants Types
export interface AppConstants {
  APP_NAME: string;
  APP_DESCRIPTION: string;
  API_BASE_URL: string;
  ITEMS_PER_PAGE: number;
  MAX_IMAGES_PER_LISTING: number;
  MAX_IMAGE_SIZE: number;
  SUPPORTED_IMAGE_TYPES: string[];
  LISTING_EXPIRY_DAYS: number;
  CITIES: string[];
  CONDITIONS: ListingCondition[];
  REPORT_REASONS: { value: ReportReason; label: string }[];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
}

// WebSocket Types
export interface SocketEvent {
  type: 'message' | 'notification' | 'listing_update' | 'user_status';
  data: any;
  timestamp: string;
}

export interface TypingStatus {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp: string;
}

// SEO Types
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

// File Upload Types
export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UploadedFile {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}