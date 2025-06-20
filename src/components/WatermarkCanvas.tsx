
import { useEffect, useRef, useState, useCallback } from 'react';
import { WatermarkSettings } from '@/pages/Index';

interface WatermarkCanvasProps {
  imageUrl: string;
  watermarkUrl: string;
  settings: WatermarkSettings;
  onSettingsChange: (settings: WatermarkSettings) => void;
  onWatermarkUpdate: (url: string) => void;
}

export const WatermarkCanvas = ({
  imageUrl,
  watermarkUrl,
  settings,
  onSettingsChange,
  onWatermarkUpdate
}: WatermarkCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load images
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setBaseImage(img);
    img.src = imageUrl;

    const watermark = new Image();
    watermark.crossOrigin = 'anonymous';
    watermark.onload = () => setWatermarkImage(watermark);
    watermark.src = watermarkUrl;
  }, [imageUrl, watermarkUrl]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImage || !watermarkImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to fit container while maintaining aspect ratio
    const containerWidth = canvas.parentElement?.clientWidth || 800;
    const maxWidth = Math.min(containerWidth - 32, 800);
    const aspectRatio = baseImage.height / baseImage.width;
    
    canvas.width = maxWidth;
    canvas.height = maxWidth * aspectRatio;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base image
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Calculate watermark dimensions
    const watermarkWidth = canvas.width * settings.scale;
    const watermarkHeight = (watermarkImage.height / watermarkImage.width) * watermarkWidth;

    // Calculate position
    const x = settings.position.x * (canvas.width - watermarkWidth);
    const y = settings.position.y * (canvas.height - watermarkHeight);

    // Save context for transformations
    ctx.save();
    
    // Set opacity
    ctx.globalAlpha = settings.opacity;
    
    // Apply rotation
    const centerX = x + watermarkWidth / 2;
    const centerY = y + watermarkHeight / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((settings.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Draw watermark
    ctx.drawImage(watermarkImage, x, y, watermarkWidth, watermarkHeight);

    // Restore context
    ctx.restore();

    // Update parent with watermarked image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onWatermarkUpdate(url);
      }
    }, 'image/png');
  }, [baseImage, watermarkImage, settings, onWatermarkUpdate]);

  // Redraw when settings change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle mouse interactions for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setIsDragging(true);
    setDragStart({ x: x - settings.position.x, y: y - settings.position.y });
  }, [settings.position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const newX = Math.max(0, Math.min(1, x - dragStart.x));
    const newY = Math.max(0, Math.min(1, y - dragStart.y));
    
    onSettingsChange({
      ...settings,
      position: { x: newX, y: newY }
    });
  }, [isDragging, dragStart, settings, onSettingsChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className={`w-full h-auto border border-gray-600 rounded-xl shadow-lg ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } transition-all duration-200 hover:shadow-xl`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {isDragging && (
        <div className="absolute top-4 left-4 bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
          Positioning watermark...
        </div>
      )}
    </div>
  );
};
