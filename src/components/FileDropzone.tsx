
import { useCallback, useState } from 'react';
import { Upload, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFilesUpload: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  description: string;
  className?: string;
}

export const FileDropzone = ({ 
  onFilesUpload, 
  accept, 
  multiple = true, 
  description,
  className 
}: FileDropzoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onFilesUpload(multiple ? files : [files[0]]);
    }
  }, [onFilesUpload, multiple]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesUpload(multiple ? files : [files[0]]);
    }
    e.target.value = '';
  }, [onFilesUpload, multiple]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group",
        isDragOver 
          ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950 scale-105" 
          : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700",
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
          isDragOver 
            ? "bg-cyan-500 text-white scale-110" 
            : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
        )}>
          {multiple ? <Upload className="w-6 h-6" /> : <Image className="w-6 h-6" />}
        </div>
        
        <div>
          <p className={cn(
            "font-medium transition-colors",
            isDragOver ? "text-cyan-600 dark:text-cyan-400" : "text-slate-700 dark:text-slate-300"
          )}>
            {description}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {multiple ? 'PNG, JPG, GIF up to 10MB each' : 'PNG, JPG, GIF up to 10MB'}
          </p>
        </div>
      </div>
      
      {isDragOver && (
        <div className="absolute inset-0 bg-cyan-500/10 dark:bg-cyan-400/10 rounded-xl border-2 border-cyan-500 dark:border-cyan-400 flex items-center justify-center">
          <div className="bg-cyan-500 dark:bg-cyan-400 text-white dark:text-slate-900 px-4 py-2 rounded-lg font-medium">
            Drop files here
          </div>
        </div>
      )}
    </div>
  );
};
