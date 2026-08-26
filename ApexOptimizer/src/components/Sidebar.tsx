import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Sliders,
  Cpu,
  Crosshair,
  Shield,
  BarChart2,
  History,
  Download,
  FileText,
  HardDrive,
} from 'lucide-react';

export type ViewType =
  | 'dashboard'
  | 'games'
  | 'cpu_affinity'
  | 'bios_advisor'
  | 'hardware_db'
  | 'nvidia_custom'
  | 'driver_store'
  | 'expert'
  | 'guided'
  | 'audit'
  | 'security'
  | 'benchmark'
  | 'snapshots'
  | 'tools';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  language: 'ru' | 'en';
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, language }) => {
  const menuItems = [
    {
      id: 'dashboard' as ViewType,
      labelRu: 'Дашборд & Железо',
      labelEn: 'Dashboard & Hardware',
      icon: LayoutDashboard,
    },
    {
      id: 'games' as ViewType,
      labelRu: 'CS2 Esports Режим',
      labelEn: 'CS2 Esports Mode',
      icon: Crosshair,
      badge: 'Zero-Lag',
    },
    {
      id: 'cpu_affinity' as ViewType,
      labelRu: 'Матрица Ядер & IRQ',
      labelEn: 'CPU & IRQ Matrix',
      icon: Cpu,
      badge: 'MSI-X',
    },
    {
      id: 'bios_advisor' as ViewType,
      labelRu: 'BIOS & WMI Советник',
      labelEn: 'BIOS & Hardware Advisor',
      icon: Cpu,
      badge: 'SMBIOS',
    },
    {
      id: 'hardware_db' as ViewType,
      labelRu: 'База 100+ Сборок ПК',
      labelEn: '100+ Hardware Builds',
      icon: LayoutDashboard,
      badge: 'AI Match',
    },
    {
      id: 'nvidia_custom' as ViewType,
      labelRu: 'Кастомные Драйверы',
      labelEn: 'Custom Drivers & Power',
      icon: Sliders,
      badge: '596.36',
    },
    {
      id: 'driver_store' as ViewType,
      labelRu: 'Driver Store (RAPR)',
      labelEn: 'Driver Store Cleaner',
      icon: HardDrive,
      badge: 'Cleanup',
    },
    {
      id: 'expert' as ViewType,
      labelRu: 'Экспертные Твики',
      labelEn: 'System Tweaks',
      icon: Sliders,
      badge: '100%',
    },
    {
      id: 'audit' as ViewType,
      labelRu: 'Журнал Изменений',
      labelEn: 'Live Audit Log',
      icon: FileText,
      badge: 'Realtime',
    },
    {
      id: 'guided' as ViewType,
      labelRu: 'Мастер Настройки',
      labelEn: 'Guided Setup',
      icon: Compass,
    },
    {
      id: 'security' as ViewType,
      labelRu: 'Защитник & FACEIT',
      labelEn: 'Defender & FACEIT',
      icon: Shield,
    },
    {
      id: 'benchmark' as ViewType,
      labelRu: 'PresentMon Бенчмарк',
      labelEn: 'PresentMon Latency',
      icon: BarChart2,
    },
    {
      id: 'snapshots' as ViewType,
      labelRu: 'Снимки & Откат',
      labelEn: 'Snapshots & Rollback',
      icon: History,
    },
    {
      id: 'tools' as ViewType,
      labelRu: 'Геймерский Софт',
      labelEn: 'Software Center',
      icon: Download,
    },
  ];

  return (
    <aside className="w-64 bg-[#09090b] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-zinc-950 font-black text-xs">
              A
            </div>
            <div className="font-bold text-sm tracking-tight text-zinc-100 flex items-center gap-1.5">
              <span>ApexTweak</span>
              <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-800 px-1 py-0.5 rounded">
                ESPORTS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-2.5 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-zinc-100' : 'text-zinc-500'
                    }`}
                  />
                  <span>{language === 'ru' ? item.labelRu : item.labelEn}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? 'bg-zinc-700 text-zinc-200'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hardware Status Footer */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
          <span className="font-mono text-zinc-300">CS2 ESPORTS ENGINE</span>
          <span className="text-emerald-400 font-mono font-semibold">100% OK</span>
        </div>
        <p className="text-[10px] text-zinc-500 leading-tight">
          Sub-Tick, Raw Input, P0 State & IRQ Isolation
        </p>
      </div>
    </aside>
  );
};
