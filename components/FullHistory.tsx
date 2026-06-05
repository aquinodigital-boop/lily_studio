
import React from 'react';
import { GeneratedImage } from '../types';
import { Icons } from './Icon';

interface FullHistoryProps {
  history: GeneratedImage[];
  onClose: () => void;
  onSelect: (item: GeneratedImage) => void;
  onDeleteItem: (id: string) => void;
}

const FullHistory: React.FC<FullHistoryProps> = ({ history, onClose, onSelect, onDeleteItem }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#374151]/40 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div>
            <h2 className="text-2xl font-black text-[#374151] tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#355C7D] flex items-center justify-center text-white">
                <Icons.Grid size={20} />
              </div>
              Galeria de Criações
            </h2>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest px-1">
              {history.length} Imagens salvas no dispositivo
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
          >
            <Icons.Plus className="rotate-45" size={24} />
          </button>
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-[#F6F6F4]/30">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
               <Icons.Image size={80} strokeWidth={1} />
               <p className="mt-4 font-bold uppercase tracking-widest text-sm">Nenhuma imagem encontrada</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    <img src={item.url} alt="Gen" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <button 
                         onClick={() => onSelect(item)}
                         className="bg-white text-[#355C7D] px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                       >
                         <Icons.Refresh size={14} /> REUTILIZAR
                       </button>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <Icons.Trash size={14} />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-[10px] font-bold text-gray-700 leading-relaxed italic line-clamp-2">
                      "{item.prompt}"
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${item.model.includes('gemini-3') ? 'bg-[#355C7D]/10 text-[#355C7D]' : 'bg-gray-100 text-gray-400'}`}>
                        {item.model.includes('gemini-3') ? 'NANO 2' : 'NANO 1'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-6 bg-white border-t border-gray-100 flex justify-center">
           <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
             Lily Studio — Sua Galeria Privada e Local
           </p>
        </div>
      </div>
    </div>
  );
};

export default FullHistory;
