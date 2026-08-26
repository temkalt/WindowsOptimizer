import React from 'react';
import { 
  ShieldAlert, Layers, Cpu, MonitorPlay, Zap, HardDrive, 
  Wifi, MousePointer, Volume2, Settings, Server, Gamepad2, 
  Activity, Trash2, RotateCcw 
} from 'lucide-react';
import { BLACK_ONYX_CATEGORIES, type CategoryInfo } from '../data/blackOnyxCatalog';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  appliedCountMap: Record<string, number>;
  totalCountMap: Record<string, number>;
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
  totalCountMap
}) => {
  return (
    <aside className="w-72 bg-[#000000] border-r border-[#141414] flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#141414] flex items-center gap-3 bg-[#020202]">
        <div className="w-9 h-9 rounded-lg bg-[#0e0e0e] border border-[#222222] flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          <Zap className="w-4 h-4 text-[#00f0ff]" />
        </div>
        <div>
          <div className="font-outfit font-extrabold text-sm tracking-wider text-white">
            WindowsOptimizer
          </div>
          <div className="text-[9px] font-mono text-[#71717a] tracking-widest uppercase">
            BLACK ONYX EDITION
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#000000]">
        {BLACK_ONYX_CATEGORIES.map((cat: CategoryInfo) => {
          const IconComponent = ICON_MAP[cat.icon] || Settings;
          const isActive = activeCategory === cat.id;
          const applied = appliedCountMap[cat.id] || 0;
          const total = totalCountMap[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${
                isActive
                  ? 'bg-[#0a0a0a] border border-[rgba(255,255,255,0.18)] text-white shadow-lg'
                  : 'hover:bg-[#060606] border border-transparent text-[#71717a] hover:text-[#d4d4d8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] font-bold text-[#3f3f46]">
                  {cat.num}
                </span>
                <IconComponent
                  className="w-3.5 h-3.5 transition-colors"
                  style={{ color: isActive ? '#00f0ff' : '#52525b' }}
                />
                <span className="text-[11px] font-semibold tracking-wide">
                  {cat.name}
                </span>
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive
                    ? 'bg-[#141414] text-[#00f0ff] border border-[#222222]'
                    : 'bg-[#080808] text-[#52525b]'
                }`}
              >
                {applied}/{total}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Hardware / Status Footer */}
      <div className="p-3 border-t border-[#141414] bg-[#020202] text-[10px] font-mono text-[#52525b] flex items-center justify-between">
        <span>CPU: Ryzen 7 9800X3D</span>
        <span className="flex items-center gap-1.5 text-[#10b981]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          Active
        </span>
      </div>
    </aside>
  );
};
