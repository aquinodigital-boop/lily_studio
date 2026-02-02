
import React, { useState, useEffect } from 'react';
import Controls from './components/Controls';
import PreviewArea from './components/PreviewArea';
import HistoryBar from './components/HistoryBar';
import FullHistory from './components/FullHistory';
import Login from './components/Login';
import { AppConfig, GeneratedImage, ModelType, AspectRatio } from './types';
import { DEFAULT_CONFIG } from './constants';
import { generateImage } from './services/geminiService';
import { Icons } from './components/Icon';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
  const [secondaryImage, setSecondaryImage] = useState<File | null>(null);
  const [secondaryPreview, setSecondaryPreview] = useState<string | null>(null);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Tenta carregar sessão
        const session = localStorage.getItem('lily_session_active');
        if (session === 'true') {
          setIsAuthorized(true);
        }

        // 2. Tenta carregar histórico com proteção total
        const savedHistory = localStorage.getItem('lily_studio_history');
        if (savedHistory) {
          try {
            const parsed = JSON.parse(savedHistory);
            if (Array.isArray(parsed)) setHistory(parsed);
          } catch (e) {
            localStorage.removeItem('lily_studio_history');
          }
        }

        // 3. Verificacao simplificada (sessao apenas)

      } catch (err) {
        console.warn("Erro silencioso na inicialização");
      } finally {
        setIsLoadingAuth(false);
      }
    };

    initApp();
  }, []);

  const handleResetApp = () => {
    if (confirm("Resetar este dispositivo? O histórico local será perdido.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handlePrimarySelect = (file: File) => {
    setPrimaryImage(file);
    if (primaryPreview) URL.revokeObjectURL(primaryPreview);
    setPrimaryPreview(URL.createObjectURL(file));
  };

  const handleSecondarySelect = (file: File) => {
    setSecondaryImage(file);
    if (secondaryPreview) URL.revokeObjectURL(secondaryPreview);
    setSecondaryPreview(URL.createObjectURL(file));
  };

  const handleGenerate = async (overrides: Partial<AppConfig> = {}) => {
    if (!config.prompt && !overrides.prompt) return;
    setErrorMsg(null);
    setIsGenerating(true);
    try {
      const finalConfig = { ...config, ...overrides };
      const resultUrl = await generateImage(finalConfig, primaryImage, secondaryImage);
      setGeneratedImage(resultUrl);
      const newItem: GeneratedImage = {
        id: Date.now().toString(),
        url: resultUrl,
        prompt: finalConfig.prompt,
        model: finalConfig.model,
        timestamp: Date.now(),
        seed: finalConfig.seed
      };
      const newHistory = [newItem, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('lily_studio_history', JSON.stringify(newHistory));
    } catch (error: any) {
      setErrorMsg(error.message || "Erro inesperado.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lily_session_active');
    setIsAuthorized(false);
  };

  if (isLoadingAuth) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F6F6F4]">
        <Icons.Loader className="animate-spin text-[#355C7D]" size={32} />
      </div>
    );
  }

  if (!isAuthorized) return <Login onUnlock={() => setIsAuthorized(true)} />;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F6F6F4] overflow-hidden font-sans">


      {errorMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-red-100 shadow-2xl p-4 rounded-3xl flex items-center gap-4 z-[500] animate-in slide-in-from-top">
          <Icons.Alert className="text-red-500" size={20} />
          <span className="text-xs font-bold text-slate-700">{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="p-2 hover:bg-slate-100 rounded-xl"><Icons.Plus className="rotate-45" size={20} /></button>
        </div>
      )}

      <div className="relative h-full flex flex-col w-[380px] shrink-0 hidden md:flex">
        <Controls config={config} setConfig={setConfig} isGenerating={isGenerating} onGenerate={() => handleGenerate()} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <PreviewArea
          primaryImage={primaryImage} primaryPreview={primaryPreview}
          secondaryImage={secondaryImage} secondaryPreview={secondaryPreview}
          generatedImage={generatedImage} isGenerating={isGenerating}
          onPrimarySelect={handlePrimarySelect} onSecondarySelect={handleSecondarySelect}
          onRemoveSecondary={() => { setSecondaryImage(null); setSecondaryPreview(null); }}
          onGenerateVariation={() => handleGenerate({ seed: Math.floor(Math.random() * 1000000) })}
        />

        <HistoryBar
          history={history}
          onClear={() => { if (confirm("Limpar histórico?")) setHistory([]); }}
          onOpenGallery={() => setIsGalleryOpen(true)}
          onSelect={(item) => { setGeneratedImage(item.url); setConfig(prev => ({ ...prev, prompt: item.prompt })); }}
        />

        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button onClick={handleResetApp} className="p-3 bg-white border border-gray-200 rounded-full shadow-lg text-gray-400"><Icons.Refresh size={20} /></button>
        </div>

        {isGalleryOpen && (
          <FullHistory
            history={history} onClose={() => setIsGalleryOpen(false)}
            onSelect={(item) => { setGeneratedImage(item.url); setConfig(prev => ({ ...prev, prompt: item.prompt })); setIsGalleryOpen(false); }}
            onDeleteItem={(id) => setHistory(h => h.filter(i => i.id !== id))}
          />
        )}
      </div>
    </div>
  );
};

export default App;
