import React from 'react';
import { Search, Flame, ShieldCheck, RotateCcw, Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onApplyEsports: () => void;
  onApplySafe: () => void;
  onRestoreAll: () => void;
  isApplying: boolean;
  activePowerPlan: string;
  vbsStatus: string;
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
  isApplying,
  activePowerPlan,
  vbsStatus,
  optimizationPercentage,
  onRescan,
  isScanning
}) => {
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, optimizationPercentage)) / 100) * circumference;

  return (
    <header className="h-16 bg-[#000000] border-b border-[#141414] px-6 flex items-center justify-between gap-4 select-none">
      {/* Left: Clean Search Input */}
      <div className="relative w-80">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по 133 настройкам и твикам..."
          className="w-full bg-[#080808] border border-[#181818] focus:border-[#2a2a2a] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#52525b] focus:outline-none transition-all"
        />
      </div>

      {/* Middle: Sleek Minimalist Optimization Gauge */}
      <div 
        onClick={onRescan}
        title="Нажмите для повторного сканирования системы"
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#060606] border border-[#161616] hover:border-[#262626] cursor-pointer transition-all group"
      >
        <div className="relative w-7 h-7 flex items-center justify-center">
          <svg className="w-7 h-7 -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r={radius}
              fill="none"
              stroke="#141414"
              strokeWidth="2.5"
            />
            <circle
              cx="16"
              cy="16"
              r={radius}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <span className="absolute font-outfit text-[9px] font-bold text-white">
            {optimizationPercentage}%
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-white leading-none">
            Оптимизация
          </span>
          <span className="text-[9px] text-[#71717a] font-mono leading-tight mt-0.5">
            {optimizationPercentage >= 80 ? 'Максимальная' : 'Базовая'}
          </span>
        </div>

        <RefreshCw className={`w-3 h-3 text-[#52525b] group-hover:text-white ml-1 transition-colors ${isScanning ? 'animate-spin text-white' : ''}`} />
      </div>

      {/* Live System Badges */}
      <div className="hidden xl:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080808] border border-[#161616] text-[10px] font-mono">
          <Activity className="w-3 h-3 text-[#38bdf8]" />
          <span className="text-[#71717a]">Схема:</span>
          <span className="text-white font-medium">{activePowerPlan || 'AMD VIP'}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080808] border border-[#161616] text-[10px] font-mono">
          <span className="text-[#71717a]">VBS:</span>
          <span className={vbsStatus === 'Disabled' ? 'text-[#10b981] font-semibold' : 'text-[#f59e0b]'}>
            {vbsStatus === 'Disabled' ? 'OFF' : 'ON'}
          </span>
        </div>
      </div>

      {/* Right: Clean Master Presets */}
      <div className="flex items-center gap-2">
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
          className="px-3.5 py-1.5 rounded-lg bg-[#ffffff] text-black hover:bg-[#e4e4e7] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Flame className="w-3.5 h-3.5 text-black" />
          <span>Киберспорт</span>
        </button>

        <button
          onClick={onRestoreAll}
          disabled={isApplying}
          title="Полный откат к заводским настройкам"
          className="p-1.5 rounded-lg bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#f43f5e] hover:text-[#f43f5e] text-[#52525b] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
