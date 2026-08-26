import React from 'react';
import { 
  Layers, Cpu, MonitorPlay, Zap, HardDrive, 
  Wifi, MousePointer, Volume2, Settings, Server, Gamepad2, 
  Activity, Trash2, BookOpen, Check 
} from 'lucide-react';
import { BLACK_ONYX_CATEGORIES, type CategoryInfo } from '../data/blackOnyxCatalog';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  appliedCountMap: Record<string, number>;
  totalCountMap: Record<string, number>;
  isBookOpen?: boolean;
  onToggleBook: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Layers, Cpu, MonitorPlay, Zap, HardDrive,
  Wifi, MousePointer, Volume2, Settings, Server, Gamepad2,
  Activity, Trash2
};

export const BlackOnyxSidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onSelectCategory,
  appliedCountMap,
  totalCountMap,
  isBookOpen = false,
  onToggleBook
}) => {
  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#222222] flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-3.5 border-b border-[#222222] flex items-center gap-2.5 bg-[#0e0e0e]">
        <div className="w-7 h-7 rounded-lg bg-[#00f0ff] flex items-center justify-center">
          <Zap className="w-4 h-4 text-black fill-black" />
        </div>
        <div>
          <div className="font-bold text-sm text-white tracking-wide leading-none">
            WindowsOptimizer
          </div>
          <div className="text-[10px] text-[#71717a] font-mono mt-0.5">
            PRO EDITION
          </div>
        </div>
      </div>

      {/* Knowledge Base Item */}
      <div className="p-2 border-b border-[#1c1c1c]">
        <button
          onClick={onToggleBook}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-xs font-semibold ${
            isBookOpen
              ? 'bg-[#00f0ff] text-black font-bold'
              : 'bg-[#141414] hover:bg-[#1a1a1a] text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>📚 База Знаний</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30">
            20 глав
          </span>
        </button>
      </div>

      {/* Categories Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {BLACK_ONYX_CATEGORIES.map((cat: CategoryInfo) => {
          const IconComponent = ICON_MAP[cat.icon] || Settings;
          const isActive = !isBookOpen && activeCategory === cat.id;
          const applied = appliedCountMap[cat.id] || 0;
          const total = totalCountMap[cat.id] || 0;
          const isAllApplied = total > 0 && applied >= total;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left text-xs ${
                isActive
                  ? 'bg-[#1a1a1a] text-[#00f0ff] font-bold border border-[#333333]'
                  : 'hover:bg-[#141414] text-[#a1a1aa] hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <IconComponent className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{cat.name}</span>
              </div>

              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1 ${
                  isAllApplied
                    ? 'bg-[#10b981]/20 text-[#10b981] font-bold'
                    : isActive
                    ? 'bg-black text-[#00f0ff]'
                    : 'text-[#52525b]'
                }`}
              >
                {isAllApplied && <Check className="w-2.5 h-2.5" />}
                {applied}/{total}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
