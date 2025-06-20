
import { ProcessedImage } from '@/pages/Index';
import { CheckCircle } from 'lucide-react';

interface ImagePreviewProps {
  images: ProcessedImage[];
  onImageSelect: (index: number) => void;
}

export const ImagePreview = ({ images, onImageSelect }: ImagePreviewProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            onClick={() => onImageSelect(index)}
            className="relative group cursor-pointer"
          >
            <div className="aspect-square rounded-xl overflow-hidden border-2 border-slate-200 group-hover:border-blue-300 transition-all duration-200 group-hover:shadow-lg">
              <img
                src={image.watermarkedUrl || image.originalUrl}
                alt={image.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            {/* Status indicator */}
            {image.watermarkedUrl && (
              <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1 shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            
            {/* Filename */}
            <p className="text-xs text-slate-600 mt-2 truncate text-center">
              {image.name}
            </p>
          </div>
        ))}
      </div>
      
      {images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};
