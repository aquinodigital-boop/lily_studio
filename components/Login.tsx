
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icon';

interface LoginProps {
  onUnlock: () => void;
}

const ACCESS_CODE = "LILY2025"; 

const Login: React.FC<LoginProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.toUpperCase().trim() === ACCESS_CODE) {
      localStorage.setItem('lily_session_active', 'true');
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setCode('');
    }
  };

  const handleHardReset = () => {
    if(confirm("Isso vai limpar o cache deste PC e resetar o app. O histórico local será apagado. Deseja continuar?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#F6F6F4] p-4">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#355C7D]/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6BAF92]/5 rounded-full blur-[100px]"></div>

      <div className="relative w-full max-w-md p-6 md:p-10 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/50">
        <div className="space-y-5">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#355C7D] rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-[#355C7D]/20">
            <Icons.Wand size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-[#374151] tracking-tight">Lily Studio</h1>
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Autenticação Necessária</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" name="loginForm" id="loginForm">
          <input type="text" name="username" value="lily_user" readOnly className="hidden" autoComplete="username" />
          
          <div className="relative">
            <input
              ref={inputRef}
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="CÓDIGO DE ACESSO"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full px-6 py-4 bg-white border-2 rounded-2xl text-center font-bold tracking-[0.3em] md:tracking-[0.5em] focus:outline-none transition-all placeholder:tracking-normal placeholder:font-bold placeholder:text-gray-300 ${
                error 
                ? 'border-red-200 bg-red-50 text-red-500 animate-shake' 
                : 'border-gray-100 focus:border-[#355C7D] text-[#374151]'
              }`}
            />
            {error && (
              <p className="absolute -bottom-6 left-0 right-0 text-[10px] font-black text-red-400 uppercase tracking-widest animate-in fade-in">
                Código Incorreto
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-[#355C7D] hover:bg-[#2a4a65] text-white font-black rounded-2xl shadow-xl shadow-[#355C7D]/10 transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            ENTRAR NO ESTÚDIO
            <Icons.ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-2 flex flex-col gap-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
            * Acesso único por dispositivo.
          </p>
          <button 
            onClick={handleHardReset}
            className="text-[9px] text-[#355C7D]/50 font-black uppercase tracking-widest hover:text-red-400 transition-colors"
          >
            Problemas ao carregar? Resetar este PC
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Login;
