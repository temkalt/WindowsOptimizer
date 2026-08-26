import React from 'react';
import { Search, Flame, ShieldCheck, RotateCcw, Activity, RefreshCw, BookOpen, Clock } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onApplyEsports: () => void;
  onApplySafe: () => void;
  onRestoreAll: () => void;
  onOpenBook: () => void;
  isApplying: boolean;
  activePowerPlan: string;
  vbsStatus: string;
  timerResolution: number;
  optimizationPercentage: number;
  onRescan: () => void;
  isScanning?: boolean;
}

export const BlackOnyxHeader: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onApplyEsports,
  onApplySafe,
  onRestoreAll,
  onOpenBook,
  isApplying,
  activePowerPlan,
  vbsStatus,
  timerResolution = 0.5,
  optimizationPercentage,
  onRescan,
  isScanning
}) => {
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, optimizationPercentage)) / 100) * circumference;

  return (
    <header className="h-16 bg-[#030303] border-b border-[#141414] px-6 flex items-center justify-between gap-4 select-none backdrop-blur-md sticky top-0 z-30">
      {/* Left: Search Input */}
      <div className="relative w-72">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск среди 140+ твиков ядра..."
          className="w-full bg-[#080808] border border-[#1a1a1a] focus:border-[#00f0ff] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#52525b] focus:outline-none transition-all shadow-inner"
        />
      </div>

      {/* Center: Live Telemetry Indicators */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Timer Resolution Live Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080808] border border-[#181818] text-[10px] font-mono shadow-sm">
          <Clock className="w-3 h-3 text-[#00f0ff]" />
          <span className="text-[#71717a]">Таймер:</span>
          <span className="text-[#00f0ff] font-bold">{timerResolution.toFixed(3)} ms</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
        </div>

        {/* VBS Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080808] border border-[#181818] text-[10px] font-mono shadow-sm">
          <span className="text-[#71717a]">VBS:</span>
          <span className={vbsStatus === 'Disabled' || vbsStatus === 'OFF' ? 'text-[#10b981] font-bold' : 'text-[#f59e0b] font-bold'}>
            {vbsStatus === 'Disabled' || vbsStatus === 'OFF' ? 'OFF (Ring 0)' : 'ON'}
          </span>
        </div>

        {/* Power Scheme */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080808] border border-[#181818] text-[10px] font-mono shadow-sm">
          <Activity className="w-3 h-3 text-[#38bdf8]" />
          <span className="text-[#71717a]">Питание:</span>
          <span className="text-white font-medium truncate max-w-[130px]">{activePowerPlan || 'AMD VIP'}</span>
        </div>

        {/* Optimization Gauge */}
        <div 
          onClick={onRescan}
          title="Нажмите для повторного сканирования системы"
          className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#080808] border border-[#181818] hover:border-[#2a2a2a] cursor-pointer transition-all group"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg className="w-6 h-6 -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r={radius} fill="none" stroke="#181818" strokeWidth="2.5" />
              <circle
                cx="16"
                cy="16"
                r={radius}
                fill="none"
                stroke={optimizationPercentage >= 80 ? '#10b981' : '#00f0ff'}
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <span className="absolute font-outfit text-[8px] font-bold text-white">
              {optimizationPercentage}%
            </span>
          </div>
          <span className="text-[10px] text-[#71717a] group-hover:text-white font-mono transition-colors">Готовность</span>
          <RefreshCw className={`w-2.5 h-2.5 text-[#52525b] group-hover:text-white transition-colors ${isScanning ? 'animate-spin text-white' : ''}`} />
        </div>
      </div>

      {/* Right: Actions and Knowledge Base */}
      <div className="flex items-center gap-2">
        {/* Knowledge Base Book Launcher */}
        <button
          onClick={onOpenBook}
          className="px-3 py-1.5 rounded-lg bg-[#0e0e0e] border border-[#222222] hover:border-[#00f0ff] text-[#e4e4e7] hover:text-[#00f0ff] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
          <span>База Знаний</span>
        </button>

        <button
          onClick={onApplySafe}
          disabled={isApplying}
          className="px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] text-[#d4d4d8] hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Безопасный</span>
        </button>

        <button
          onClick={onApplyEsports}
          disabled={isApplying}
          className="px-3.5 py-1.5 rounded-lg bg-[#ffffff] text-black hover:bg-[#00f0ff] text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <Flame className="w-3.5 h-3.5 text-black fill-black" />
          <span>Киберспорт</span>
        </button>

        <button
          onClick={onRestoreAll}
          disabled={isApplying}
          title="Полный откат к заводским настройкам Windows"
          className="p-2 rounded-lg bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#f43f5e] hover:text-[#f43f5e] text-[#52525b] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
