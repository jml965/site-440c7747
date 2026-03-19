/**
 * Image utilities for handling file uploads, compression, and validation
 */

export interface ImageValidation {
  valid: boolean;
  error?: string;
}

export interface ImageCompression {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  format: 'jpeg' | 'webp' | 'png';
}

// Default compression settings
const DEFAULT_COMPRESSION: ImageCompression = {
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200,
  format: 'jpeg'
};

// Allowed image types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validate image file
 */
export const validateImageFile = (file: File): ImageValidation => {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'نوع الملف غير مدعوم. يرجى اختيار JPG، PNG، WebP أو GIF'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `حجم الملف كبير جداً (${sizeMB} ميجا). الحد الأقصى 5 ميجا`
    };
  }

  // Check if file is actually an image
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'الملف المحدد ليس صورة صالحة'
    };
  }

  return { valid: true };
};

/**
 * Compress image file
 */
export const compressImage = (
  file: File,
  options: Partial<ImageCompression> = {}
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const settings = { ...DEFAULT_COMPRESSION, ...options };
    
    // If file is already small enough, return as is
    if (file.size <= 500 * 1024) { // 500KB
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions
        let { width, height } = img;
        const ratio = width / height;

        if (width > settings.maxWidth) {
          width = settings.maxWidth;
          height = width / ratio;
        }

        if (height > settings.maxHeight) {
          height = settings.maxHeight;
          width = height * ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, `.${settings.format === 'jpeg' ? 'jpg' : settings.format}`),
                  {
                    type: `image/${settings.format}`,
                    lastModified: Date.now()
                  }
                );
                resolve(compressedFile);
              } else {
                reject(new Error('فشل في ضغط الصورة'));
              }
            },
            `image/${settings.format}`,
            settings.quality
          );
        } else {
          reject(new Error('فشل في إنشاء canvas context'));
        }
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('فشل في تحميل الصورة'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Convert file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('فشل في تحويل الملف'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('فشل في قراءة الملف'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Generate thumbnail from image
 */
export const generateThumbnail = (
  file: File,
  width: number = 150,
  height: number = 150
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          // Calculate crop dimensions to maintain aspect ratio
          const imgRatio = img.width / img.height;
          const canvasRatio = width / height;
          
          let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
          
          if (imgRatio > canvasRatio) {
            drawHeight = height;
            drawWidth = drawHeight * imgRatio;
            offsetX = (width - drawWidth) / 2;
          } else {
            drawWidth = width;
            drawHeight = drawWidth / imgRatio;
            offsetY = (height - drawHeight) / 2;
          }

          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve(reader.result as string);
                };
                reader.readAsDataURL(blob);
              } else {
                reject(new Error('فشل في إنشاء المعاينة'));
              }
            },
            'image/jpeg',
            0.7
          );
        } else {
          reject(new Error('فشل في إنشاء canvas context'));
        }
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('فشل في تحميل الصورة'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Get image dimensions
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('فشل في قراءة أبعاد الصورة'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create image preview URL
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Clean up image preview URL
 */
export const cleanupImagePreview = (url: string): void => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Check if string is base64 image
 */
export const isBase64Image = (str: string): boolean => {
  return str.startsWith('data:image/');
};

/**
 * Extract base64 data from data URL
 */
export const extractBase64Data = (dataUrl: string): string => {
  const base64Index = dataUrl.indexOf(',');
  return base64Index !== -1 ? dataUrl.substring(base64Index + 1) : dataUrl;
};

/**
 * Get file extension from MIME type
 */
export const getExtensionFromMimeType = (mimeType: string): string => {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg'
  };
  
  return extensions[mimeType.toLowerCase()] || 'jpg';
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 بايت';
  
  const k = 1024;
  const sizes = ['بايت', 'كيلو', 'ميجا', 'جيجا'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Multiple file upload with progress tracking
 */
export const uploadMultipleImages = async (
  files: FileList,
  options: {
    onProgress?: (progress: number, fileIndex: number) => void;
    onError?: (error: string, fileIndex: number) => void;
    compression?: Partial<ImageCompression>;
  } = {}
): Promise<string[]> => {
  const results: string[] = [];
  const fileArray = Array.from(files);
  
  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    
    try {
      options.onProgress?.(0, i);
      
      // Validate
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      options.onProgress?.(30, i);
      
      // Compress
      const compressedFile = await compressImage(file, options.compression);
      
      options.onProgress?.(70, i);
      
      // Convert to base64
      const base64 = await fileToBase64(compressedFile);
      
      options.onProgress?.(100, i);
      
      results.push(base64);
    } catch (error: any) {
      options.onError?.(error.message, i);
    }
  }
  
  return results;
};