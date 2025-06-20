
import { ProcessedImage } from '@/pages/Index';
import { CheckCircle, X } from 'lucide-react';

interface ImagePreviewProps {
  images: ProcessedImage[];
  onImageSelect: (index: number) => void;
  onImageRemove: (imageId: string) => void;
  showWatermarked?: boolean;
}

export const ImagePreview = ({ 
  images, 
  onImageSelect, 
  onImageRemove, 
  showWatermarked = false 
}: ImagePreviewProps) => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative group cursor-pointer"
          >
            <div 
              onClick={() => onImageSelect(index)}
              className="aspect-square rounded-xl overflow-hidden border-2 border-gray-600 group-hover:border-cyan-400 transition-all duration-200 group-hover:shadow-lg"
            >
              <img
                src={showWatermarked && image.watermarkedUrl ? image.watermarkedUrl : image.originalUrl}
                alt={image.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageRemove(image.id);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Status indicator - only show if we're displaying watermarked and image has watermark */}
            {showWatermarked && image.watermarkedUrl && (
              <div className="absolute -top-2 -left-2 bg-emerald-500 rounded-full p-1 shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            
            {/* Filename */}
            <p className="text-xs text-gray-400 mt-2 truncate text-center">
              {image.name}
            </p>
          </div>
        ))}
      </div>
      
      {images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};
