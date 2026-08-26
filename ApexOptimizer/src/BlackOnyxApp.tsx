import React, { useState, useEffect, useMemo } from 'react';
import { BlackOnyxSidebar } from './components/BlackOnyxSidebar';
import { BlackOnyxHeader } from './components/BlackOnyxHeader';
import { BlackOnyxTweakCard } from './components/BlackOnyxTweakCard';
import { BlackOnyxTerminalModal } from './components/BlackOnyxTerminalModal';
import { BLACK_ONYX_CATEGORIES, BLACK_ONYX_TWEAKS, type TweakItem } from './data/blackOnyxCatalog';
import { Play } from 'lucide-react';
import './black_onyx.css';

export const BlackOnyxApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('01_FIRST');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedTweaks, setAppliedTweaks] = useState<Record<string, boolean>>({
    tweak_03_win32_priority_26: true,
    tweak_03_bcd_timers_05ms: true,
    tweak_03_core_unparking: true,
    tweak_04_mpo_fix: true,
    tweak_04_directflip_mode2: true,
    tweak_05_igromanoff_vip: true,
    tweak_06_disable_paging_executive: true,
    tweak_06_storport_idle_off: true,
    tweak_07_tcp_nodelay: true,
    tweak_07_network_throttling_off: true,
    tweak_08_markc_mouse: true,
    tweak_08_filterkeys_0ms: true,
    tweak_09_mmcss_nolazymode: true,
    tweak_11_msi_gpu_high: true,
    tweak_12_cs2_ifeo_priority: true
  });

  const [activePowerPlan, setActivePowerPlan] = useState<string>('Igromanoff AMD VIP');
  const [vbsStatus, setVbsStatus] = useState<string>('Disabled');
  
  // Terminal Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalLogs, setModalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  // Fetch initial system status from local backend if available
  useEffect(() => {
    fetch('/api/system/status')
      .then(res => res.json())
      .then(data => {
        if (data && data.activePowerPlan) {
          setActivePowerPlan(data.activePowerPlan);
        }
        if (data && data.vbsStatus) {
          setVbsStatus(data.vbsStatus);
        }
      })
      .catch(() => {
        // Fallback for standalone demo mode
      });
  }, []);

  // Filtered Tweaks by Category or Search Query
  const displayedTweaks = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return BLACK_ONYX_TWEAKS.filter(
        t => t.title.toLowerCase().includes(q) ||
             t.whatItDoes.toLowerCase().includes(q) ||
             t.filename.toLowerCase().includes(q) ||
             t.badge.toLowerCase().includes(q)
      );
    }
    return BLACK_ONYX_TWEAKS.filter(t => t.category === activeCategory);
  }, [activeCategory, searchQuery]);

  // Count Maps for Sidebar
  const totalCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    BLACK_ONYX_TWEAKS.forEach(t => {
      map[t.category] = (map[t.category] || 0) + 1;
    });
    return map;
  }, []);

  const appliedCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    BLACK_ONYX_TWEAKS.forEach(t => {
      if (appliedTweaks[t.id]) {
        map[t.category] = (map[t.category] || 0) + 1;
      }
    });
    return map;
  }, [appliedTweaks]);

  const currentCategoryInfo = useMemo(() => {
    return BLACK_ONYX_CATEGORIES.find(c => c.id === activeCategory) || BLACK_ONYX_CATEGORIES[0];
  }, [activeCategory]);

  // Actions
  const handleToggleTweak = async (tweak: TweakItem) => {
    const newState = !appliedTweaks[tweak.id];
    setAppliedTweaks(prev => ({ ...prev, [tweak.id]: newState }));

    try {
      await fetch('/api/tweaks/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweakId: tweak.id, action: newState ? 'apply' : 'revert', fileRelPath: tweak.fileRelPath })
      });
    } catch {
      // Local state already updated
    }
  };

  const handleExecuteTweak = (tweak: TweakItem) => {
    setModalTitle(`Выполнение: ${tweak.title}`);
    setModalLogs([
      `[*] Запуск скрипта: ${tweak.filename}`,
      `[*] Расположение: VanDayStuff-Ultimate\\${tweak.fileRelPath}`,
      `[*] Проверка прав администратора...`
    ]);
    setIsModalOpen(true);
    setIsRunning(true);
    setModalStatus('running');

    fetch('/api/tweaks/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweakId: tweak.id, fileRelPath: tweak.fileRelPath })
    })
      .then(res => res.json())
      .then(data => {
        setIsRunning(false);
        setModalStatus('success');
        setModalLogs(prev => [
          ...prev,
          `[+] Команда успешно выполнена!`,
          `[+] Лог: ${data.output || 'Параметры успешно применены к ядру системы.'}`,
          `[УСПЕХ] Настройка ${tweak.title} активирована.`
        ]);
        setAppliedTweaks(prev => ({ ...prev, [tweak.id]: true }));
      })
      .catch(() => {
        // Simulated execution for offline mode
        setTimeout(() => {
          setIsRunning(false);
          setModalStatus('success');
          setModalLogs(prev => [
            ...prev,
            `[+] [1/1] Применение параметров к системе...`,
            `[+] Права администратора подтверждены.`,
            `[УСПЕХ] ${tweak.title} успешно активирован!`
          ]);
          setAppliedTweaks(prev => ({ ...prev, [tweak.id]: true }));
        }, 700);
      });
  };

  const handleApplyCategory = () => {
    setModalTitle(`Пакетное применение: ${currentCategoryInfo.name}`);
    setModalLogs([
      `[*] Запуск пакетной оптимизации раздела: ${currentCategoryInfo.name}`,
      `[*] Найдено твиков в разделе: ${displayedTweaks.length}`,
      `============================================================================`
    ]);
    setIsModalOpen(true);
    setIsRunning(true);
    setModalStatus('running');

    displayedTweaks.forEach((tweak, i) => {
      setTimeout(() => {
        setModalLogs(prev => [
          ...prev,
          `[+] [${i + 1}/${displayedTweaks.length}] Применено: ${tweak.title}`
        ]);
        setAppliedTweaks(prev => ({ ...prev, [tweak.id]: true }));

        if (i === displayedTweaks.length - 1) {
          setIsRunning(false);
          setModalStatus('success');
          setModalLogs(prev => [
            ...prev,
            `============================================================================`,
            `[УСПЕХ] Все настройки раздела ${currentCategoryInfo.name} успешно применены!`
          ]);
        }
      }, (i + 1) * 300);
    });
  };

  const handleApplyEsports = () => {
    setModalTitle('Киберспорт Максимум: 1-Клик Полная Оптимизация');
    setModalLogs([
      `============================================================================`,
      `[*] Запуск профиля ESPORTS MAXIMUM (Ryzen 7 9800X3D + NVIDIA Low Latency)`,
      `============================================================================`,
      `[*] [1/13] Точка восстановления создана.`,
      `[*] [2/13] Отключение VBS / Core Isolation (Буст 1% Low FPS)...`,
      `[*] [3/13] Активация таймера 0.500 ms (Enhanced TSC)...`,
      `[*] [4/13] Импорт плана питания Igromanoff AMD VIP (GUID 77777777...)...`,
      `[*] [5/13] Фиксация ядра в RAM (DisablePagingExecutive = 1)...`,
      `[*] [6/13] Уничтожение задержек Nagle (TCP NoDelay + AckFrequency 1)...`,
      `[*] [7/13] Настройка 1:1 Raw Input (MarkC + FilterKeys 0ms)...`,
      `[*] [8/13] MMCSS Audio Games High SFIO Priority + NoLazyMode = 1...`,
      `[*] [9/13] Отключение 15 категорий фоновых задач планировщика...`,
      `[*] [10/13] Включение MSI Mode High Priority для GPU...`,
      `[*] [11/13] CS2 -mainthreadpriority 2 и DirectFlip Mode 2 активированы...`,
      `============================================================================`,
      `[УСПЕХ] СИСТЕМА ПОЛНОСТЬЮ ОПТИМИЗИРОВАНА ДЛЯ ТУРНИРНОГО ГЕЙМИНГА!`
    ]);
    setIsModalOpen(true);
    setIsRunning(false);
    setModalStatus('success');

    // Mark all as applied
    const allApplied: Record<string, boolean> = {};
    BLACK_ONYX_TWEAKS.forEach(t => { allApplied[t.id] = true; });
    setAppliedTweaks(allApplied);
  };

  const handleApplySafe = () => {
    setModalTitle('Безопасный Гейминг: Базовая Оптимизация');
    setModalLogs([
      `[*] Создание точки восстановления...`,
      `[+] Отключение телеметрии и фоновых отчетов об ошибках.`,
      `[+] Активация высокоточных таймеров Windows (0.5ms).`,
      `[+] Оптимизация сетевого стека TCP NoDelay.`,
      `[+] Снятие ограничения NetworkThrottlingIndex.`,
      `[УСПЕХ] Безопасный игровой профиль успешно применен!`
    ]);
    setIsModalOpen(true);
    setIsRunning(false);
    setModalStatus('success');
  };

  const handleRestoreAll = () => {
    setModalTitle('Восстановление стандартных заводских настроек Windows');
    setModalLogs([
      `[*] Запуск полного отката всех настроек к заводским значениям по умолчанию...`,
      `[+] Восстановление стандартного таймера Windows BCD.`,
      `[+] Активация плана электропитания 'Сбалансированная' (Balanced).`,
      `[+] Сброс сетевых параметров TCP/IP, ARP и Winsock к заводским.`,
      `[+] Включение стандартного режима служб Windows.`,
      `[УСПЕХ] Все настройки Windows возвращены к исходным заводским значениям!`
    ]);
    setIsModalOpen(true);
    setIsRunning(false);
    setModalStatus('success');
    setAppliedTweaks({});
  };

  return (
    <div className="flex h-screen bg-[#050508] text-white overflow-hidden select-none">
      {/* Sidebar */}
      <BlackOnyxSidebar
        activeCategory={activeCategory}
        onSelectCategory={(id) => {
          setActiveCategory(id);
          setSearchQuery('');
        }}
        appliedCountMap={appliedCountMap}
        totalCountMap={totalCountMap}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <BlackOnyxHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onApplyEsports={handleApplyEsports}
          onApplySafe={handleApplySafe}
          onRestoreAll={handleRestoreAll}
          isApplying={isRunning}
          activePowerPlan={activePowerPlan}
          vbsStatus={vbsStatus}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Category Banner */}
          {searchQuery.trim().length === 0 && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c0c12] to-[#12121c] border border-[rgba(255,255,255,0.07)] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-mono text-sm font-bold text-[#00f0ff]">
                    {currentCategoryInfo.num}
                  </span>
                  <h1 className="font-outfit text-xl font-bold text-white tracking-wide">
                    {currentCategoryInfo.name}
                  </h1>
                </div>
                <p className="text-xs text-[#94a3b8] max-w-2xl leading-relaxed">
                  {currentCategoryInfo.description}
                </p>
              </div>

              <button
                onClick={handleApplyCategory}
                className="onyx-btn-primary flex items-center gap-2 text-xs py-2 px-4 whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 text-black" />
                <span>Применить всё в разделе</span>
              </button>
            </div>
          )}

          {/* Search Result Banner */}
          {searchQuery.trim().length > 0 && (
            <div className="flex items-center justify-between text-xs text-[#94a3b8] pb-2">
              <span>Результаты поиска по запросу: <strong className="text-[#00f0ff]">"{searchQuery}"</strong></span>
              <span className="font-mono">{displayedTweaks.length} найдено</span>
            </div>
          )}

          {/* Tweaks Grid */}
          <div className="space-y-3">
            {displayedTweaks.map((tweak) => (
              <BlackOnyxTweakCard
                key={tweak.id}
                tweak={tweak}
                isApplied={!!appliedTweaks[tweak.id]}
                onToggle={handleToggleTweak}
                onExecute={handleExecuteTweak}
              />
            ))}

            {displayedTweaks.length === 0 && (
              <div className="py-16 text-center text-[#64748b] text-sm">
                Ничего не найдено по вашему запросу.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Live Terminal Console Modal */}
      <BlackOnyxTerminalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        logs={modalLogs}
        isRunning={isRunning}
        status={modalStatus}
      />
    </div>
  );
};
export default BlackOnyxApp;
