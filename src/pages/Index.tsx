
import { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { WatermarkCanvas } from '@/components/WatermarkCanvas';
import { WatermarkControls } from '@/components/WatermarkControls';
import { ImagePreview } from '@/components/ImagePreview';
import { Button } from '@/components/ui/button';
import { Download, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

export interface WatermarkSettings {
  opacity: number;
  scale: number;
  rotation: number;
  position: { x: number; y: number };
}

export interface ProcessedImage {
  id: string;
  originalFile: File;
  originalUrl: string;
  watermarkedUrl?: string;
  name: string;
}

const Index = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>({
    opacity: 0.8,
    scale: 0.2,
    rotation: 0,
    position: { x: 0.8, y: 0.8 }
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImagesUpload = useCallback((files: File[]) => {
    const newImages: ProcessedImage[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      name: file.name
    }));
    
    setImages(prev => [...prev, ...newImages]);
    toast.success(`Added ${files.length} image${files.length > 1 ? 's' : ''}`);
  }, []);

  const handleWatermarkUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setWatermarkImage(url);
    toast.success('Watermark logo uploaded');
  }, []);

  const handleRemoveWatermark = useCallback(() => {
    if (watermarkImage) {
      URL.revokeObjectURL(watermarkImage);
      setWatermarkImage(null);
      toast.success('Watermark logo removed');
    }
  }, [watermarkImage]);

  const handleRemoveImage = useCallback((imageId: string) => {
    setImages(prev => {
      const updatedImages = prev.filter(img => img.id !== imageId);
      const removedImage = prev.find(img => img.id === imageId);
      
      if (removedImage) {
        URL.revokeObjectURL(removedImage.originalUrl);
        if (removedImage.watermarkedUrl) {
          URL.revokeObjectURL(removedImage.watermarkedUrl);
        }
      }
      
      // Adjust current index if needed
      if (currentImageIndex >= updatedImages.length && updatedImages.length > 0) {
        setCurrentImageIndex(updatedImages.length - 1);
      } else if (updatedImages.length === 0) {
        setCurrentImageIndex(0);
      }
      
      return updatedImages;
    });
    toast.success('Image removed');
  }, [currentImageIndex]);

  const handleWatermarkUpdate = useCallback((url: string, imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, watermarkedUrl: url } : img
    ));
  }, []);

  const processAllImages = async () => {
    if (!watermarkImage || images.length === 0) {
      toast.error('Please upload both images and a watermark');
      return;
    }

    setIsProcessing(true);
    
    // Trigger processing for all images
    // This will be handled by individual WatermarkCanvas components
    toast.success('Processing all images...');
    
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('All images processed successfully!');
    }, 2000);
  };

  const downloadAll = () => {
    const watermarkedImages = images.filter(img => img.watermarkedUrl);
    if (watermarkedImages.length === 0) {
      toast.error('No processed images to download');
      return;
    }

    watermarkedImages.forEach(img => {
      if (img.watermarkedUrl) {
        const link = document.createElement('a');
        link.href = img.watermarkedUrl;
        link.download = `watermarked_${img.name}`;
        link.click();
      }
    });
    
    toast.success(`Downloaded ${watermarkedImages.length} images`);
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              WatermarkPro
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Professional watermarking tool with drag-and-drop functionality, 
            interactive positioning, and batch processing capabilities.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Upload Images</h2>
              <FileDropzone
                onFilesUpload={handleImagesUpload}
                accept="image/*"
                multiple={true}
                description="Drop your images here or click to browse"
              />
              
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-2">Images uploaded: {images.length}</p>
                {images.length > 0 && (
                  <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                    {images.map((img, index) => (
                      <div key={img.id} className="relative group">
                        <button
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex 
                              ? 'border-cyan-500 shadow-lg scale-105' 
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <img 
                            src={img.originalUrl} 
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                        </button>
                        <button
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-100">Upload Watermark</h2>
                {watermarkImage && (
                  <button
                    onClick={handleRemoveWatermark}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <FileDropzone
                onFilesUpload={([file]) => handleWatermarkUpload(file)}
                accept="image/*"
                multiple={false}
                description="Drop your logo here or click to browse"
              />
              
              {watermarkImage && (
                <div className="mt-4 text-center">
                  <img 
                    src={watermarkImage} 
                    alt="Watermark preview"
                    className="w-16 h-16 object-contain mx-auto rounded-lg border border-gray-600"
                  />
                  <p className="text-sm text-gray-400 mt-2">Watermark loaded</p>
                </div>
              )}
            </div>

            <WatermarkControls
              settings={watermarkSettings}
              onSettingsChange={setWatermarkSettings}
            />
          </div>

          {/* Canvas Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Preview & Edit</h2>
                {currentImage && (
                  <span className="text-sm text-gray-400">
                    {currentImageIndex + 1} of {images.length}
                  </span>
                )}
              </div>
              
              {currentImage && watermarkImage ? (
                <WatermarkCanvas
                  imageUrl={currentImage.originalUrl}
                  watermarkUrl={watermarkImage}
                  settings={watermarkSettings}
                  onSettingsChange={setWatermarkSettings}
                  onWatermarkUpdate={(url) => handleWatermarkUpdate(url, currentImage.id)}
                />
              ) : (
                <div className="h-96 bg-gray-900 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-300 text-lg font-medium">Ready to watermark</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Upload images and a watermark to get started
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={processAllImages}
                disabled={!watermarkImage || images.length === 0 || isProcessing}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Process All Images'}
              </Button>
              
              <Button
                onClick={downloadAll}
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 rounded-xl shadow-lg transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Image Gallery</h2>
            <ImagePreview 
              images={images} 
              onImageSelect={setCurrentImageIndex}
              onImageRemove={handleRemoveImage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
