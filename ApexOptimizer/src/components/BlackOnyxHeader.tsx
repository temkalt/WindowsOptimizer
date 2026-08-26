import React from 'react';
import { Search, Flame, ShieldCheck, RotateCcw, Activity } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onApplyEsports: () => void;
  onApplySafe: () => void;
  onRestoreAll: () => void;
  isApplying: boolean;
  activePowerPlan: string;
  vbsStatus: string;
}

export const BlackOnyxHeader: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onApplyEsports,
  onApplySafe,
  onRestoreAll,
  isApplying,
  activePowerPlan,
  vbsStatus
}) => {
  return (
    <header className="h-16 bg-[#000000] border-b border-[#141414] px-6 flex items-center justify-between gap-4 select-none">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск настроек и твиков..."
          className="w-full bg-[#080808] border border-[#1c1c1c] focus:border-[#00f0ff] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#52525b] focus:outline-none transition-all"
        />
      </div>

      {/* Live System Badges */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080808] border border-[#181818] text-[10px] font-mono">
          <Activity className="w-3 h-3 text-[#00f0ff]" />
          <span className="text-[#71717a]">Схема:</span>
          <span className="text-[#00f0ff] font-semibold">{activePowerPlan || 'AMD VIP'}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080808] border border-[#181818] text-[10px] font-mono">
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
          <span>Безопасный режим</span>
        </button>

        <button
          onClick={onApplyEsports}
          disabled={isApplying}
          className="px-3 py-1.5 rounded-lg bg-[#ffffff] text-black hover:bg-[#00f0ff] text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        >
          <Flame className="w-3.5 h-3.5 text-black" />
          <span>Киберспорт Максимум</span>
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
