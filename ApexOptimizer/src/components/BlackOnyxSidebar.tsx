import React from 'react';
import { 
  ShieldAlert, Layers, Cpu, MonitorPlay, Zap, HardDrive, 
  Wifi, MousePointer, Volume2, Settings, Server, Gamepad2, 
  Activity, Trash2, RotateCcw, BookOpen, CheckCircle2 
} from 'lucide-react';
import { BLACK_ONYX_CATEGORIES, type CategoryInfo } from '../data/blackOnyxCatalog';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  appliedCountMap: Record<string, number>;
  totalCountMap: Record<string, number>;
  cpuName?: string;
  isBookOpen?: boolean;
  onToggleBook: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldAlert, Layers, Cpu, MonitorPlay, Zap, HardDrive,
  Wifi, MousePointer, Volume2, Settings, Server, Gamepad2,
  Activity, Trash2, RotateCcw
};

export const BlackOnyxSidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onSelectCategory,
  appliedCountMap,
  totalCountMap,
  cpuName = 'AMD Ryzen / Intel Core',
  isBookOpen = false,
  onToggleBook
}) => {
  return (
    <aside className="w-72 bg-[#020202] border-r border-[#141414] flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#141414] flex items-center justify-between bg-[#040404]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] border border-[#222222] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Zap className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div>
            <div className="font-outfit font-extrabold text-sm tracking-wider text-white">
              WindowsOptimizer
            </div>
            <div className="text-[9px] font-mono text-[#00f0ff] tracking-widest uppercase flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
              BLACK ONYX 2.0
            </div>
          </div>
        </div>
      </div>

      {/* Featured: 20-Volume Encyclopedia Navigation Item */}
      <div className="p-2 pb-0">
        <button
          onClick={onToggleBook}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${
            isBookOpen
              ? 'bg-gradient-to-r from-[#00f0ff]/15 to-transparent border border-[#00f0ff] text-white shadow-[0_0_20px_rgba(0,240,255,0.15)]'
              : 'bg-[#080808] border border-[#1c1c1c] hover:border-[#333] text-[#d4d4d8] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className={`w-4 h-4 ${isBookOpen ? 'text-[#00f0ff]' : 'text-[#38bdf8]'}`} />
            <div>
              <div className="text-xs font-bold tracking-wide">📚 База Знаний</div>
              <div className="text-[9px] text-[#71717a] font-mono">20 томов энциклопедии</div>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#111] text-[#00f0ff] border border-[#222]">
            READ
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="px-3 pt-3 pb-1 text-[9px] font-mono text-[#52525b] uppercase tracking-wider font-semibold">
        Категории Оптимизации
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 bg-[#020202]">
        {BLACK_ONYX_CATEGORIES.map((cat: CategoryInfo) => {
          const IconComponent = ICON_MAP[cat.icon] || Settings;
          const isActive = !isBookOpen && activeCategory === cat.id;
          const applied = appliedCountMap[cat.id] || 0;
          const total = totalCountMap[cat.id] || 0;
          const isComplete = total > 0 && applied >= total;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left ${
                isActive
                  ? 'bg-[#0c0c0c] border border-[rgba(0,240,255,0.3)] text-white shadow-md'
                  : 'hover:bg-[#080808] border border-transparent text-[#71717a] hover:text-[#e4e4e7]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[9px] font-bold text-[#3f3f46] shrink-0">
                  {cat.num}
                </span>
                <IconComponent
                  className="w-3.5 h-3.5 transition-colors shrink-0"
                  style={{ color: isActive ? '#00f0ff' : (isComplete ? '#10b981' : '#52525b') }}
                />
                <span className="text-[11px] font-semibold tracking-wide truncate">
                  {cat.name}
                </span>
              </div>

              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ml-1.5 flex items-center gap-1 ${
                  isComplete
                    ? 'bg-[#0d2818] text-[#10b981] border border-[#10b981]/30'
                    : isActive
                    ? 'bg-[#141414] text-[#00f0ff] border border-[#222222]'
                    : 'bg-[#080808] text-[#52525b]'
                }`}
              >
                {isComplete && <CheckCircle2 className="w-2.5 h-2.5 text-[#10b981]" />}
                {applied}/{total}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Hardware / Status Footer */}
      <div className="p-3 border-t border-[#141414] bg-[#040404] text-[10px] font-mono text-[#52525b] flex items-center justify-between">
        <span className="truncate max-w-[170px]" title={cpuName}>{cpuName}</span>
        <span className="flex items-center gap-1.5 text-[#10b981] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          Active
        </span>
      </div>
    </aside>
  );
};
