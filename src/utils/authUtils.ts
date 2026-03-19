import { User } from '../types';

// Local storage keys
const USER_STORAGE_KEY = 'used_marketplace_user';
const TOKEN_STORAGE_KEY = 'used_marketplace_token';
const REFRESH_TOKEN_STORAGE_KEY = 'used_marketplace_refresh_token';

// User storage functions
export const setStoredUser = (user: User): void => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    if (user.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, user.token);
    }
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getStoredUser = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
    removeStoredUser();
  }
  return null;
};

export const removeStoredUser = (): void => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

// Token functions
export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const setStoredToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const removeStoredToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Refresh token functions
export const getStoredRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

export const setStoredRefreshToken = (refreshToken: string): void => {
  try {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  } catch (error) {
    console.error('Error storing refresh token:', error);
  }
};

export const removeStoredRefreshToken = (): void => {
  try {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing refresh token:', error);
  }
};

// Token validation
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const getTokenPayload = (token: string): any | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

// Form validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+966|0)?5[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Password strength checker
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('أضف حروف صغيرة');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('أضف حروف كبيرة');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('أضف أرقام');
  }

  if (/[^\w\s]/.test(password)) {
    score += 1;
  } else {
    feedback.push('أضف رموز خاصة');
  }

  return { score, feedback };
};

// Format user display name
export const formatUserName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

// Format user initials
export const getUserInitials = (user: User): string => {
  const firstName = user.firstName?.charAt(0) || '';
  const lastName = user.lastName?.charAt(0) || '';
  return `${firstName}${lastName}`.toUpperCase();
};

// Check if user has required permissions
export const hasPermission = (user: User, permission: string): boolean => {
  if (user.role === 'admin') return true;
  if (user.role === 'moderator' && permission === 'moderate') return true;
  return false;
};

// Generate avatar URL
export const getAvatarUrl = (user: User, size = 100): string => {
  if (user.avatar) {
    return user.avatar;
  }
  
  // Generate initials-based avatar
  const initials = getUserInitials(user);
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  const colorIndex = (user.id?.charCodeAt(0) || 0) % colors.length;
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=${colors[colorIndex].replace('bg-', '').replace('-500', '')}&color=fff&font-size=0.33`;
};

// Session management
export const isSessionValid = (): boolean => {
  const user = getStoredUser();
  if (!user?.token) return false;
  
  return !isTokenExpired(user.token);
};

export const clearSession = (): void => {
  removeStoredUser();
  removeStoredToken();
  removeStoredRefreshToken();
};

// Auto-logout timer
let logoutTimer: NodeJS.Timeout | null = null;

export const setAutoLogout = (callback: () => void, timeInMs: number = 30 * 60 * 1000): void => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
  }
  
  logoutTimer = setTimeout(() => {
    clearSession();
    callback();
  }, timeInMs);
};

export const clearAutoLogout = (): void => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
};

// Activity tracking
let lastActivity = Date.now();

export const updateLastActivity = (): void => {
  lastActivity = Date.now();
};

export const getTimeSinceLastActivity = (): number => {
  return Date.now() - lastActivity;
};

// Setup activity listeners
export const setupActivityListeners = (): void => {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  events.forEach(event => {
    document.addEventListener(event, updateLastActivity, true);
  });
};

// Cleanup activity listeners
export const cleanupActivityListeners = (): void => {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  events.forEach(event => {
    document.removeEventListener(event, updateLastActivity, true);
  });
};