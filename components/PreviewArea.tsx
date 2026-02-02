
import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import { Icons } from './Icon';

interface PreviewAreaProps {
  primaryImage: File | null;
  primaryPreview: string | null;
  secondaryImage: File | null;
  secondaryPreview: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
  onPrimarySelect: (file: File) => void;
  onSecondarySelect: (file: File) => void;
  onRemoveSecondary: () => void;
  onGenerateVariation: () => void;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ 
  primaryImage, primaryPreview, 
  secondaryImage, secondaryPreview,
  generatedImage, isGenerating,
  onPrimarySelect, onSecondarySelect, onRemoveSecondary,
  onGenerateVariation
}) => {
  const [showSecondary, setShowSecondary] = useState(false);

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `lily-studio-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Upload Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
             <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                <Icons.Layers size={12} /> Imagem Base (Opcional)
             </label>
             <ImageUpload 
               selectedImage={primaryImage}
               previewUrl={primaryPreview}
               onImageSelect={onPrimarySelect}
             />
          </div>

          <div className="flex flex-col justify-end">
            {!showSecondary && !secondaryImage ? (
              <button 
                onClick={() => setShowSecondary(true)}
                className="flex flex-col items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-[#355C7D] border border-gray-200 border-dashed rounded-3xl w-full h-[220px] transition-all hover:bg-white hover:border-[#355C7D]/30 group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-[#355C7D] transition-colors">
                  <Icons.Plus size={20} />
                </div>
                Adicionar Imagem Secundária
              </button>
            ) : (
              <div className="relative group space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <Icons.Star size={12} /> Referência
                </label>
                <ImageUpload 
                  selectedImage={secondaryImage}
                  previewUrl={secondaryPreview}
                  onImageSelect={onSecondarySelect}
                />
                <button 
                  onClick={() => { setShowSecondary(false); onRemoveSecondary(); }}
                  className="absolute top-10 right-3 bg-white text-red-500 p-2 rounded-xl shadow-md border border-gray-100 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Icons.Trash size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Result Area Container */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-200 min-h-[580px] flex flex-col relative">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-[#6BAF92]"></div>
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Painel de Visualização</span>
            </div>
            {generatedImage && !isGenerating && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={onGenerateVariation} 
                  className="flex items-center gap-2 text-[#355C7D] font-bold text-[11px] bg-white border border-[#355C7D]/20 hover:bg-[#355C7D]/5 px-5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                >
                  <Icons.Refresh size={14} /> GERAR VARIAÇÃO
                </button>
                <button 
                  onClick={handleDownload} 
                  className="flex items-center gap-2 text-white font-bold text-[11px] bg-[#6BAF92] hover:bg-[#5a9a81] px-5 py-2 rounded-xl transition-all shadow-md active:scale-95"
                >
                  <Icons.Download size={14} /> BAIXAR IMAGEM
                </button>
              </div>
            )}
          </div>

          {/* Clean Canvas */}
          <div className="flex-1 flex items-center justify-center p-8 bg-[#FDFDFB]">
            {isGenerating ? (
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-[3px] border-gray-100 rounded-full absolute inset-0"></div>
                  <div className="w-20 h-20 border-[3px] border-[#355C7D] border-t-transparent rounded-full animate-spin relative z-10"></div>
                  <Icons.Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#355C7D]/20" size={24} />
                </div>
                <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">Renderizando sua visão</h3>
                <p className="text-gray-400 text-xs mt-2 font-medium">Isso leva cerca de 10 a 20 segundos.</p>
              </div>
            ) : generatedImage ? (
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={generatedImage} 
                  alt="Result" 
                  className="max-w-full max-h-[650px] rounded-2xl shadow-2xl object-contain border border-gray-100 transition-all" 
                />
              </div>
            ) : (
              <div className="text-center opacity-40 group">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6 border border-gray-100">
                  <Icons.Image size={40} className="text-gray-300" />
                </div>
                <h3 className="text-sm font-bold text-gray-400">Sua imagem aparecerá aqui</h3>
                <p className="text-[10px] text-gray-300 uppercase tracking-tighter mt-1 font-black">Aguardando comando...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreviewArea;
