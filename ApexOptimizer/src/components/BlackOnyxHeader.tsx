import React from 'react';
import { Search, Flame, ShieldCheck, RotateCcw, BookOpen } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onApplyEsports: () => void;
  onApplySafe: () => void;
  onRestoreAll: () => void;
  onOpenBook: () => void;
  isApplying: boolean;
}

export const BlackOnyxHeader: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onApplyEsports,
  onApplySafe,
  onRestoreAll,
  onOpenBook,
  isApplying
}) => {
  return (
    <header className="h-14 bg-[#0a0a0a] border-b border-[#222222] px-5 flex items-center justify-between gap-4 select-none shrink-0">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск твиков и настроек..."
          className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#00f0ff] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#71717a] focus:outline-none transition-colors"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenBook}
          className="px-3 py-1.5 rounded-lg bg-[#141414] border border-[#2a2a2a] hover:border-[#00f0ff] hover:text-[#00f0ff] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Книга (База Знаний)</span>
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
