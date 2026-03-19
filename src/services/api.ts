import { APP_CONFIG, API_ENDPOINTS } from '../utils/constants';
import type { ApiResponse } from '../types';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

class ApiService {
  private baseURL: string;
  private authToken: string | null = null;
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // Check for existing token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      this.setAuthToken(token);
    }
  }

  // Set authentication token
  setAuthToken(token: string | null): void {
    this.authToken = token;
    
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  // Get current auth token
  getAuthToken(): string | null {
    return this.authToken;
  }

  // Build full URL
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBaseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    return `${cleanBaseURL}/${cleanEndpoint}`;
  }

  // Handle API response
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const errorMessage = this.getErrorMessage(response.status, data);
      
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }

    return {
      success: true,
      data: data?.data || data,
      message: data?.message
    };
  }

  // Get error message based on status code and response data
  private getErrorMessage(status: number, data: any): string {
    // Return server error message if available
    if (data?.message) {
      return data.message;
    }
    
    if (data?.error) {
      return data.error;
    }

    // Default messages based on status code
    switch (status) {
      case 400:
        return 'طلب غير صحيح';
      case 401:
        return 'غير مخول للوصول';
      case 403:
        return 'ممنوع الوصول';
      case 404:
        return 'العنصر المطلوب غير موجود';
      case 409:
        return 'تضارب في البيانات';
      case 422:
        return 'بيانات غير صحيحة';
      case 429:
        return 'تم تجاوز الحد المسموح من الطلبات';
      case 500:
        return 'خطأ في الخادم';
      case 502:
        return 'خطأ في البوابة';
      case 503:
        return 'الخدمة غير متاحة حالياً';
      case 504:
        return 'انتهت مهلة الطلب';
      default:
        return 'حدث خطأ غير متوقع';
    }
  }

  // Make HTTP request
  private async request<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body } = options;
    
    const url = this.buildUrl(endpoint);
    const requestHeaders = { ...this.defaultHeaders, ...headers };
    
    // Handle FormData (for file uploads)
    let requestBody = body;
    if (body instanceof FormData) {
      // Remove Content-Type header to let browser set it with boundary
      delete requestHeaders['Content-Type'];
    } else if (body && typeof body === 'object') {
      requestBody = JSON.stringify(body);
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders,
      body: requestBody
    };

    try {
      // Check network connectivity
      if (!navigator.onLine) {
        return {
          success: false,
          error: 'لا يوجد اتصال بالإنترنت',
          data: null
        };
      }

      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('API Request Error:', error);
      
      // Handle different types of errors
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'تم إلغاء الطلب',
          data: null
        };
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'خطأ في الشبكة، تأكد من اتصالك بالإنترنت',
          data: null
        };
      }
      
      return {
        success: false,
        error: error.message || 'حدث خطأ في الشبكة',
        data: null
      };
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }
    
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(
    endpoint: string, 
    data?: any, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data,
      headers
    });
  }

  async put<T>(
    endpoint: string, 
    data?: any, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data,
      headers
    });
  }

  async patch<T>(
    endpoint: string, 
    data?: any, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data,
      headers
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Specialized methods for common operations
  async uploadFile<T>(
    endpoint: string, 
    file: File, 
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }
    
    return this.post<T>(endpoint, formData);
  }

  async uploadFiles<T>(
    endpoint: string, 
    files: File[], 
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }
    
    return this.post<T>(endpoint, formData);
  }

  // Authentication specific methods
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const response = await this.post(API_ENDPOINTS.LOGIN, { email, password });
    
    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response;
  }

  async register(userData: any): Promise<ApiResponse<any>> {
    const response = await this.post(API_ENDPOINTS.REGISTER, userData);
    
    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse<any>> {
    const response = await this.post(API_ENDPOINTS.LOGOUT);
    
    // Clear local auth state regardless of response
    this.setAuthToken(null);
    localStorage.removeItem('authToken');
    
    return response;
  }

  async refreshToken(): Promise<ApiResponse<any>> {
    const response = await this.post(API_ENDPOINTS.REFRESH_TOKEN);
    
    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
      localStorage.setItem('authToken', response.data.token);
    } else {
      // If refresh fails, clear auth state
      this.setAuthToken(null);
      localStorage.removeItem('authToken');
    }
    
    return response;
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  // Method to handle token expiration
  async handleTokenExpiration(): Promise<boolean> {
    try {
      const response = await this.refreshToken();
      return response.success;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.setAuthToken(null);
      localStorage.removeItem('authToken');
      return false;
    }
  }

  // Request interceptor for automatic token refresh
  private async requestWithAutoRefresh<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const response = await this.request<T>(endpoint, options);
    
    // If unauthorized and we have a token, try to refresh it
    if (!response.success && response.error?.includes('غير مخول') && this.authToken) {
      const refreshSuccess = await this.handleTokenExpiration();
      
      if (refreshSuccess) {
        // Retry the original request with new token
        return this.request<T>(endpoint, options);
      }
    }
    
    return response;
  }

  // Health check method
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.get('/health');
  }

  // Get API status and version
  async getApiInfo(): Promise<ApiResponse<any>> {
    return this.get('/info');
  }
}

// Create and export the API service instance
export const apiService = new ApiService(APP_CONFIG.API_BASE_URL);

// Export individual endpoint builders for convenience
export const buildApiUrl = (endpoint: string): string => {
  return apiService['buildUrl'](endpoint);
};

// Export helper functions for common API operations
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof Array) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item);
        } else {
          formData.append(`${key}[${index}]`, item.toString());
        }
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  
  return formData;
};

// Response handler wrapper for components
export const handleApiResponse = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
): Promise<T | null> => {
  try {
    const response = await apiCall();
    
    if (response.success && response.data) {
      onSuccess?.(response.data);
      return response.data;
    } else {
      const errorMessage = response.error || 'حدث خطأ غير متوقع';
      onError?.(errorMessage);
      return null;
    }
  } catch (error: any) {
    const errorMessage = error.message || 'حدث خطأ في الشبكة';
    onError?.(errorMessage);
    return null;
  }
};

// Error codes mapping
export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE'
} as const;

// Default export
export default apiService;