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
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, optimizationPercentage)) / 100) * circumference;

  const getScoreColor = (pct: number) => {
    if (pct >= 85) return '#00f0ff';
    if (pct >= 60) return '#10b981';
    if (pct >= 40) return '#f59e0b';
    return '#f43f5e';
  };

  const scoreColor = getScoreColor(optimizationPercentage);

  return (
    <header className="h-18 bg-[#000000] border-b border-[#141414] px-6 py-2.5 flex items-center justify-between gap-4 select-none">
      {/* Left: Search Input */}
      <div className="relative w-72">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск настроек и твиков..."
          className="w-full bg-[#070707] border border-[#1c1c1c] focus:border-[#00f0ff] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#52525b] focus:outline-none transition-all"
        />
      </div>

      {/* Middle: Optimization Percentage Radial Circle Gauge */}
      <div 
        onClick={onRescan}
        title="Нажмите для повторного сканирования реестра и системы"
        className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#050505] border border-[#181818] hover:border-[#282828] cursor-pointer transition-all group"
      >
        {/* Radial SVG Circle */}
        <div className="relative w-11 h-11 flex items-center justify-center">
          <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
            {/* Background Track */}
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="transparent"
              stroke="#141414"
              strokeWidth="3.5"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="transparent"
              stroke={scoreColor}
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{ filter: `drop-shadow(0 0 6px ${scoreColor}80)` }}
            />
          </svg>
          <span className="absolute font-mono text-[11px] font-extrabold text-white">
            {optimizationPercentage}%
          </span>
        </div>

        {/* Text Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span 
              className="text-[10px] font-mono font-bold uppercase tracking-wider"
              style={{ color: scoreColor }}
            >
              {optimizationPercentage >= 85 ? 'Киберспорт Ready' : optimizationPercentage >= 60 ? 'Оптимально' : 'Требует Твиков'}
            </span>
            <RefreshCw className={`w-2.5 h-2.5 text-[#52525b] group-hover:text-white transition-colors ${isScanning ? 'animate-spin' : ''}`} />
          </div>
          <span className="text-[9px] text-[#71717a] font-mono">
            Аудит системы активен
          </span>
        </div>
      </div>

      {/* Live System Badges */}
      <div className="hidden xl:flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#070707] border border-[#181818] text-[10px] font-mono">
          <Activity className="w-3 h-3 text-[#00f0ff]" />
          <span className="text-[#71717a]">Схема:</span>
          <span className="text-[#00f0ff] font-semibold">{activePowerPlan || 'AMD VIP'}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#070707] border border-[#181818] text-[10px] font-mono">
          <span className="text-[#71717a]">VBS:</span>
          <span className={vbsStatus === 'Disabled' ? 'text-[#10b981] font-bold' : 'text-[#f59e0b]'}>
            {vbsStatus === 'Disabled' ? 'OFF (Max FPS)' : 'Active'}
          </span>
        </div>
      </div>

      {/* 1-Click Master Presets */}
      <div className="flex items-center gap-2">
        <button
          onClick={onApplySafe}
          disabled={isApplying}
          className="px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#222222] hover:border-[#333333] text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Безопасный</span>
        </button>

        <button
          onClick={onApplyEsports}
          disabled={isApplying}
          className="px-3 py-1.5 rounded-lg bg-[#ffffff] text-black hover:bg-[#00f0ff] text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        >
          <Flame className="w-3.5 h-3.5 text-black" />
          <span>Киберспорт</span>
        </button>

        <button
          onClick={onRestoreAll}
          disabled={isApplying}
          title="Полный откат к заводским настройкам"
          className="p-1.5 rounded-lg bg-[#0a0a0a] border border-[#222222] hover:border-[#f43f5e] hover:text-[#f43f5e] text-[#71717a] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
