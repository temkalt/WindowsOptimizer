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
    <aside className="w-72 bg-[#08080c] border-r border-[rgba(255,255,255,0.07)] flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[rgba(255,255,255,0.07)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#0284c7] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          <Zap className="w-5 h-5 text-black" />
        </div>
        <div>
          <div className="font-outfit font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            BLACK ONYX
          </div>
          <div className="text-[10px] font-mono text-[#00f0ff] tracking-widest uppercase">
            ULTIMATE SUITE 2026
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {BLACK_ONYX_CATEGORIES.map((cat: CategoryInfo) => {
          const IconComponent = ICON_MAP[cat.icon] || Settings;
          const isActive = activeCategory === cat.id;
          const applied = appliedCountMap[cat.id] || 0;
          const total = totalCountMap[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left ${
                isActive
                  ? 'bg-gradient-to-r from-[rgba(0,240,255,0.12)] to-[rgba(20,20,28,0.8)] border border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'hover:bg-[#121218] border border-transparent text-[#94a3b8] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-bold text-[#64748b]">
                  {cat.num}
                </span>
                <IconComponent
                  className="w-4 h-4 transition-colors"
                  style={{ color: isActive ? cat.accent : '#64748b' }}
                />
                <span className="text-xs font-semibold tracking-wide">
                  {cat.name}
                </span>
              </div>

              {total > 0 && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#00f0ff] text-black font-bold'
                      : 'bg-[#181824] text-[#94a3b8]'
                  }`}
                >
                  {applied}/{total}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.07)] bg-[#060609]">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b]">
          <span>CPU: AMD Ryzen 9800X3D</span>
          <span className="text-[#10b981] font-bold">● Active</span>
        </div>
      </div>
    </aside>
  );
};
