import React, { useCallback } from 'react';
import { Icons } from './Icon';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  previewUrl: string | null;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage, previewUrl, label }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  }, [onImageSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full relative h-[220px]">
      <div 
        className="w-full h-full relative group cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" 
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleChange}
        />
        
        {previewUrl ? (
          <div className="w-full h-full bg-white rounded-3xl overflow-hidden border border-gray-200 group-hover:border-[#355C7D] transition-all relative shadow-sm">
            <img 
              src={previewUrl} 
              alt="Upload preview" 
              className="w-full h-full object-contain p-2"
            />
            <div className="absolute inset-0 bg-[#355C7D]/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white font-bold text-xs gap-2 backdrop-blur-[2px]">
                <Icons.Refresh size={20} />
                Substituir Imagem
            </div>
            <div className="absolute bottom-2 right-2 bg-[#6BAF92] text-white p-1 rounded-full shadow-sm">
               <Icons.Check size={12} />
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-white rounded-3xl border border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-[#355C7D] hover:bg-gray-50/50 transition-all gap-3 p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icons.Upload size={24} className="text-gray-300 group-hover:text-[#355C7D]" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-600 uppercase tracking-tight">Clique para adicionar</p>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">PNG ou JPG até 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;