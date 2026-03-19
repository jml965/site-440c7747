import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { compressImage, validateImageFile } from '../utils/imageUtils';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  error?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5,
  error,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList) => {
    setUploadError('');
    setUploading(true);

    try {
      const newImages: string[] = [];
      const remainingSlots = maxImages - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToProcess) {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setUploadError(validation.error || 'ملف غير صالح');
          continue;
        }

        // Compress and convert to base64
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        
        await new Promise<void>((resolve, reject) => {
          reader.onload = (e) => {
            if (e.target?.result) {
              newImages.push(e.target.result as string);
            }
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(compressedFile);
        });
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
      }

      if (filesToProcess.length < files.length) {
        setUploadError(`تم رفع ${filesToProcess.length} صور فقط من أصل ${files.length} (الحد الأقصى ${maxImages} صور)`);
      }
    } catch (err: any) {
      setUploadError(err.message || 'حدث خطأ في رفع الصور');
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    setUploadError('');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={className}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center">
            <div className={`
              p-3 rounded-full mb-4
              ${dragOver ? 'bg-blue-100' : error ? 'bg-red-100' : 'bg-gray-200'}
            `}>
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              ) : (
                <Upload className={`
                  w-8 h-8
                  ${dragOver ? 'text-blue-600' : error ? 'text-red-600' : 'text-gray-500'}
                `} />
              )}
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {uploading ? 'جاري رفع الصور...' : 'اسحب الصور هنا أو اضغط للاختيار'}
            </h3>
            
            <p className="text-gray-500 text-sm mb-4">
              يمكنك رفع حتى {maxImages} صور • JPG, PNG, WebP
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                حد أقصى 5 ميجا
              </span>
              <span className="flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                دقة عالية مفضلة
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {(error || uploadError) && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            {error && <p className="text-red-600 font-medium">{error}</p>}
            {uploadError && <p className="text-red-600">{uploadError}</p>}
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              الصور المرفقة ({images.length}/{maxImages})
            </h4>
            <p className="text-sm text-gray-500">
              اسحب لإعادة ترتيب الصور
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
              >
                <img
                  src={image}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                
                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                    صورة رئيسية
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 left-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Index Badge */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h4 className="font-medium text-blue-900 mb-2">نصائح للحصول على أفضل النتائج:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            استخدم إضاءة طبيعية جيدة
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            اجعل المنتج في مركز الصورة
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            التقط صوراً من زوايا مختلفة
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            اظهر أي عيوب أو خدوش بوضوح
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            الصورة الأولى ستظهر كصورة رئيسية
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploader;