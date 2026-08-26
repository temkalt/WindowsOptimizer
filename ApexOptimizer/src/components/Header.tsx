import React, { useState } from 'react';
import type { SystemInfo } from '../types';
import { Activity, Clock, Shield, ShieldAlert, Zap, Minus, Square, X, Copy } from 'lucide-react';

interface HeaderProps {
  systemInfo: SystemInfo | null;
  language: 'ru' | 'en';
  onLanguageChange: (lang: 'ru' | 'en') => void;
  onQuickClean: () => void;
  isCleaning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  systemInfo,
  language,
  onLanguageChange,
  onQuickClean,
  isCleaning,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = async () => {
    try {
      await fetch('/api/window/minimize', { method: 'POST' });
    } catch {}
  };

  const handleMaximize = async () => {
    try {
      await fetch('/api/window/maximize', { method: 'POST' });
      setIsMaximized(!isMaximized);
    } catch {}
  };

  const handleClose = async () => {
    try {
      await fetch('/api/window/close', { method: 'POST' });
    } catch {}
  };

  return (
    <header className="h-12 border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur px-4 flex items-center justify-between sticky top-0 z-40 titlebar-drag select-none">
      {/* Left Info Badges */}
      <div className="flex items-center gap-4 titlebar-nodrag">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wide">
            {language === 'ru' ? 'NTAPI ЯДРО 100%' : 'NTAPI KERNEL 100%'}
          </span>
        </div>

        <div className="h-3.5 w-px bg-zinc-800" />

        {/* Live Timer Precision */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span>{language === 'ru' ? 'Таймер:' : 'Timer:'}</span>
          <span className="font-mono-data font-semibold text-emerald-400">
            {systemInfo?.timerResolutionMs.toFixed(4) || '0.5000'} ms
          </span>
        </div>

        {/* Live DPC Latency */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>{language === 'ru' ? 'DPC:' : 'DPC:'}</span>
          <span className="font-mono-data font-semibold text-emerald-400">
            ~{systemInfo?.estimatedDpcLatencyUs || '14.8'} µs
          </span>
        </div>

        {/* Defender */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400">
          {systemInfo?.security.defenderActive ? (
            <>
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ru' ? 'Защитник: Вкл' : 'Defender: On'}</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-300">{language === 'ru' ? 'Защитник: Откл' : 'Defender: Off'}</span>
            </>
          )}
        </div>
      </div>

      {/* Right Actions & Seamless Window Controls */}
      <div className="flex items-center gap-3 titlebar-nodrag">
        <button
          onClick={onQuickClean}
          disabled={isCleaning}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5 text-zinc-400" />
          <span>{isCleaning ? (language === 'ru' ? 'Очистка...' : 'Cleaning...') : (language === 'ru' ? 'Очистить RAM' : 'Flush RAM')}</span>
        </button>

        {/* Language Switcher */}
        <div className="flex bg-zinc-900 p-0.5 rounded-md border border-zinc-800 text-xs">
          <button
            onClick={() => onLanguageChange('ru')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              language === 'ru' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            RU
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              language === 'en' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            EN
          </button>
        </div>

        <div className="h-4 w-px bg-zinc-800/80 ml-1" />

        {/* Integrated Seamless Frameless Window Controls */}
        <div className="flex items-center">
          <button
            onClick={handleMinimize}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <Copy className="w-3 h-3 rotate-180" /> : <Square className="w-3 h-3" />}
          </button>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-rose-600 rounded transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

