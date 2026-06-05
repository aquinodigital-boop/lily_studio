
import React from 'react';
import { GeneratedImage } from '../types';
import { Icons } from './Icon';

interface HistoryBarProps {
  history: GeneratedImage[];
  onSelect: (item: GeneratedImage) => void;
  onClear: () => void;
  onOpenGallery: () => void;
}

const HistoryBar: React.FC<HistoryBarProps> = ({ history, onSelect, onClear, onOpenGallery }) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white border-t border-gray-100 h-[190px] shrink-0 overflow-hidden flex flex-col z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
      <div className="px-8 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <Icons.History size={14} className="text-[#355C7D]/60" />
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Criações Recentes</span>
            </div>
            <button 
              onClick={onOpenGallery}
              className="text-[10px] bg-[#355C7D]/5 text-[#355C7D] font-black px-3 py-1 rounded-full hover:bg-[#355C7D] hover:text-white transition-all flex items-center gap-1.5"
            >
              <Icons.Grid size={10} /> VER GALERIA COMPLETA
            </button>
         </div>
         <button 
           onClick={onClear} 
           className="text-[10px] text-gray-400 font-bold hover:text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 transition-all flex items-center gap-1"
         >
           <Icons.Trash size={12} /> Limpar Tudo
         </button>
      </div>
      <div className="flex-1 flex gap-5 overflow-x-auto px-8 py-4 items-center scroll-smooth">
         {history.map((item) => (
           <button 
             key={item.id}
             onClick={() => onSelect(item)}
             className="flex bg-white p-2.5 rounded-2xl border border-gray-100 hover:border-[#355C7D]/30 hover:shadow-lg transition-all shrink-0 w-[240px] text-left group active:scale-95"
           >
             <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-50 relative">
                <img src={item.url} alt="Hist" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
             </div>
             <div className="flex-1 ml-3 min-w-0 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-700 leading-tight line-clamp-2 italic mb-1">
                  "{item.prompt}"
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${item.model.includes('gemini-3') ? 'bg-[#355C7D]/10 text-[#355C7D]' : 'bg-gray-100 text-gray-400'}`}>
                    {item.model.includes('gemini-3') ? 'NANO 2' : 'NANO 1'}
                  </span>
                  <span className="text-[8px] font-bold text-gray-300">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
             </div>
           </button>
         ))}
      </div>
    </div>
  );
};

export default HistoryBar;
