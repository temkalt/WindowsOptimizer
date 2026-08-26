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
    <header className="h-20 bg-[#09090d] border-b border-[rgba(255,255,255,0.07)] px-8 flex items-center justify-between gap-6 select-none">
      {/* Search Input */}
      <div className="relative w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по всем 469 настройкам, твикам и реестру..."
          className="w-full bg-[#121218] border border-[rgba(255,255,255,0.09)] focus:border-[#00f0ff] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#64748b] focus:outline-none transition-all"
        />
      </div>

      {/* Live System Badges */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#121218] border border-[rgba(255,255,255,0.07)] text-[11px] font-mono">
          <Activity className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="text-[#94a3b8]">План питания:</span>
          <span className="text-[#00f0ff] font-semibold">{activePowerPlan || 'AMD VIP'}</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#121218] border border-[rgba(255,255,255,0.07)] text-[11px] font-mono">
          <span className="text-[#94a3b8]">VBS:</span>
          <span className={vbsStatus === 'Disabled' ? 'text-[#10b981] font-bold' : 'text-[#f59e0b]'}>
            {vbsStatus === 'Disabled' ? 'OFF (Буст 1% Low)' : 'Включен'}
          </span>
        </div>
      </div>

      {/* 1-Click Master Presets */}
      <div className="flex items-center gap-3">
        <button
          onClick={onApplySafe}
          disabled={isApplying}
          className="onyx-btn-secondary flex items-center gap-2 text-xs"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Безопасный гейминг</span>
        </button>

        <button
          onClick={onApplyEsports}
          disabled={isApplying}
          className="onyx-btn-primary flex items-center gap-2 text-xs"
        >
          <Flame className="w-3.5 h-3.5 text-black" />
          <span>Киберспорт Максимум</span>
        </button>

        <button
          onClick={onRestoreAll}
          disabled={isApplying}
          title="Полный откат к заводским настройкам"
          className="p-2.5 rounded-xl bg-[#121218] border border-[rgba(255,255,255,0.07)] hover:border-[#f43f5e] hover:text-[#f43f5e] text-[#94a3b8] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
