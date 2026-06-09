
import React from 'react';
import { AppConfig, ModelType, AspectRatio } from '../types';
import { Icons } from './Icon';

interface ControlsProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  isGenerating: boolean;
  onGenerate: () => void;
}

const Controls: React.FC<ControlsProps> = ({ config, setConfig, isGenerating, onGenerate }) => {


  return (
    <div className="w-[380px] h-full bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto z-20">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#355C7D] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Icons.Wand size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-[#374151]">Lily Studio 🎨</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Editor Criativo</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-1">
        {/* Step 1: Prompt */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-[#374151] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">1</span>
              Descreva sua ideia
            </label>
          </div>
          <textarea
            className="w-full h-32 p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#355C7D] focus:border-transparent transition-all resize-none outline-none placeholder:text-gray-400 font-medium leading-relaxed"
            placeholder="Ex: Garrafa de vinho tinto em mesa rústica, luz de fim de tarde, fotorrealista..."
            value={config.prompt}
            onChange={(e) => setConfig(prev => ({ ...prev, prompt: e.target.value }))}
          />
        </div>

        {/* Step 2: Model Selection */}
        <div className="space-y-3">
          <label className="text-xs font-black text-[#374151] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">2</span>
            Potência Criativa
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: ModelType.FLASH, label: 'Nano Banana 1', sub: 'Econômico • Rápido', icon: <Icons.Zap size={14} /> },
              { id: ModelType.PRO, label: 'Nano Banana 2', sub: 'Pago • Premium', icon: <Icons.Star size={14} /> }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setConfig(prev => ({ ...prev, model: m.id }))}
                className={`p-3 rounded-xl border-2 transition-all text-left flex flex-col gap-1 ${config.model === m.id
                  ? 'border-[#355C7D] bg-[#355C7D]/5 ring-1 ring-[#355C7D]'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
              >
                <div className={`flex items-center gap-2 text-xs font-bold ${config.model === m.id ? 'text-[#355C7D]' : 'text-gray-600'}`}>
                  {m.icon} {m.label}
                </div>
                <span className={`text-[9px] font-bold uppercase ${config.model === m.id ? 'text-[#355C7D]/60' : 'text-gray-400'}`}>
                  {m.sub}
                </span>
              </button>
            ))}
          </div>
          {config.model === ModelType.PRO && (
            <p className="text-[9px] text-amber-600 font-bold bg-amber-50 p-2 rounded-lg border border-amber-100">
              * Nano Banana 2 é pago (~$0,05+/imagem) e exige billing ativo na chave Gemini. O Nano Banana 1 é grátis.
            </p>
          )}
        </div>

        {/* Step 3: Format */}
        <div className="space-y-3">
          <label className="text-xs font-black text-[#374151] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">3</span>
            Formato de Saída
          </label>

          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Redes Sociais</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: AspectRatio.SQUARE, label: 'Feed', sub: 'Quadrado', icon: <Icons.Maximize size={16} /> },
              { id: AspectRatio.VERTICAL, label: 'Stories', sub: 'Vertical', icon: <Icons.Smartphone size={16} /> },
              { id: AspectRatio.HORIZONTAL, label: 'Capa', sub: 'Horizontal', icon: <Icons.Monitor size={16} /> }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setConfig(prev => ({ ...prev, aspectRatio: r.id }))}
                className={`py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${config.aspectRatio === r.id
                  ? 'border-[#355C7D] bg-[#355C7D]/5 text-[#355C7D]'
                  : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
              >
                {r.icon}
                <span className="text-[10px] font-bold">{r.label}</span>
              </button>
            ))}
          </div>

          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider pt-1">Banners do Site</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: AspectRatio.BANNER_DESKTOP, label: 'Desktop', sub: '1920x400', icon: <Icons.Monitor size={16} /> },
              { id: AspectRatio.BANNER_MOBILE, label: 'Mobile', sub: '600x400', icon: <Icons.Smartphone size={16} /> }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setConfig(prev => ({ ...prev, aspectRatio: r.id }))}
                className={`py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${config.aspectRatio === r.id
                  ? 'border-[#355C7D] bg-[#355C7D]/5 text-[#355C7D]'
                  : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
              >
                {r.icon}
                <span className="text-[10px] font-bold">{r.label}</span>
                <span className="text-[9px] font-medium opacity-70">{r.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !config.prompt}
          className={`w-full py-4 rounded-xl font-extrabold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${isGenerating || !config.prompt
            ? 'bg-gray-300 cursor-not-allowed shadow-none'
            : 'bg-[#355C7D] hover:bg-[#2a4a65] active:scale-95 shadow-[#355C7D]/20'
            }`}
        >
          {isGenerating ? (
            <Icons.Loader className="animate-spin" size={20} />
          ) : (
            <Icons.Zap size={18} fill="currentColor" />
          )}
          <span>{isGenerating ? 'CRIANDO IMAGEM...' : 'GERAR IMAGEM'}</span>
        </button>


        <div className="flex flex-col items-center gap-2">
          {isGenerating && (
            <p className="text-[10px] text-center text-gray-400 font-bold animate-pulse">
              Isso pode levar alguns segundos...
            </p>
          )}
        </div>
      </div>
    </div >
  );
};

export default Controls;
