import React from 'react';
import { Search, Flame, ShieldCheck, RotateCcw, BookOpen, RefreshCw, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onApplyEsports: () => void;
  onApplySafe: () => void;
  onRestoreAll: () => void;
  onOpenBook: () => void;
  onRescan: () => void;
  isScanning: boolean;
  isApplying: boolean;
  optimizationPercentage: number;
  appliedCount: number;
  totalCount: number;
  activePowerPlan: string;
}

export const BlackOnyxHeader: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onApplyEsports,
  onApplySafe,
  onRestoreAll,
  onOpenBook,
  onRescan,
  isScanning,
  isApplying,
  optimizationPercentage,
  appliedCount,
  totalCount,
  activePowerPlan
}) => {
  return (
    <header className="h-16 bg-[#0a0a0a] border-b border-[#222222] px-5 flex items-center justify-between gap-4 select-none shrink-0">
      {/* Left: Search Input */}
      <div className="relative w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск твиков и настроек..."
          className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#00f0ff] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#71717a] focus:outline-none transition-colors"
        />
      </div>

      {/* Middle: 100% Real Windows Audit Health Widget */}
      <div className="hidden lg:flex items-center gap-3 bg-[#111111] border border-[#222222] px-3 py-1.5 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00f0ff]" />
          <div>
            <div className="text-[11px] font-bold text-white leading-none flex items-center gap-1.5">
              <span>Оптимизация:</span>
              <span className={optimizationPercentage >= 75 ? 'text-[#10b981] font-extrabold' : 'text-[#f59e0b] font-extrabold'}>
                {optimizationPercentage}%
              </span>
              <span className="text-[#52525b] font-normal">|</span>
              <span className="text-[#38bdf8] font-mono text-[10px] truncate max-w-[120px]">{activePowerPlan}</span>
            </div>
            <div className="text-[9px] text-[#71717a] font-mono mt-0.5">
              Применено: {appliedCount} из {totalCount} проверок ядра
            </div>
          </div>
        </div>

        <button
          onClick={onRescan}
          disabled={isScanning}
          title="Запустить повторную 100% реальную проверку всех параметров ПК"
          className="p-1 rounded hover:bg-[#222222] text-[#a1a1aa] hover:text-[#00f0ff] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-[#00f0ff]' : ''}`} />
        </button>
      </div>

      {/* Right: Master 1-Click Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenBook}
          className="px-3 py-1.5 rounded-lg bg-[#141414] border border-[#2a2a2a] hover:border-[#00f0ff] hover:text-[#00f0ff] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>База Знаний</span>
        </button>

        <button
          onClick={onApplySafe}
          disabled={isApplying}
          className="px-3 py-1.5 rounded-lg bg-[#141414] border border-[#2a2a2a] hover:border-[#10b981] hover:text-[#10b981] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Безопасный</span>
        </button>

        <button
          onClick={onApplyEsports}
          disabled={isApplying}
          className="px-3.5 py-1.5 rounded-lg bg-[#00f0ff] text-black hover:bg-[#38bdf8] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Flame className="w-3.5 h-3.5 text-black fill-black" />
          <span>Киберспорт</span>
        </button>

        <button
          onClick={onRestoreAll}
          disabled={isApplying}
          title="Сброс всех настроек по умолчанию"
          className="px-2.5 py-1.5 rounded-lg bg-[#141414] border border-[#2a2a2a] hover:border-[#f43f5e] hover:text-[#f43f5e] text-[#a1a1aa] text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Сброс</span>
        </button>
      </div>
    </header>
  );
};
