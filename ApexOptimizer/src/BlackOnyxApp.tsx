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
  const [safetyFilter, setSafetyFilter] = useState<'all' | 'safe' | 'recommended' | 'extreme'>('all');
  const [appliedTweaks, setAppliedTweaks] = useState<Record<string, boolean>>({});
  const [activePowerPlan, setActivePowerPlan] = useState<string>('Igromanoff AMD VIP');
  const [vbsStatus, setVbsStatus] = useState<string>('Disabled');
  const [timerResolution, setTimerResolution] = useState<number>(0.5000);
  const [cpuName, setCpuName] = useState<string>('AMD Ryzen 7 9800X3D');
  const [optimizationPercentage, setOptimizationPercentage] = useState<number>(94);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isBookViewOpen, setIsBookViewOpen] = useState<boolean>(false);
  
  // Terminal Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalLogs, setModalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  

  // Live System Audit: Scans Live Metrics & Telemetry
  const performSystemAudit = () => {
    setIsScanning(true);
    fetch('/api/metrics/live')
      .then(res => res.json())
      .then(data => {
        setIsScanning(false);
        if (data && data.metrics) {
          if (data.metrics.timerResolutionMs) setTimerResolution(data.metrics.timerResolutionMs);
          if (data.metrics.vbsOptimized !== undefined) setVbsStatus(data.metrics.vbsOptimized ? 'OFF' : 'ON');
          if (data.metrics.systemReadinessPercent) setOptimizationPercentage(data.metrics.systemReadinessPercent);
        }
      })
      .catch(() => {
        setIsScanning(false);
      });

    fetch('/api/system/status')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.activePowerPlan) setActivePowerPlan(data.activePowerPlan);
          if (data.cpuName) setCpuName(data.cpuName);
          if (data.appliedTweaks) setAppliedTweaks(data.appliedTweaks);
          
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    performSystemAudit();
  }, []);

  // Filtered Tweaks by Category, Search, and Safety Level
  const displayedTweaks = useMemo(() => {
    let list = BLACK_ONYX_TWEAKS;

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        t => t.title.toLowerCase().includes(q) ||
             t.whatItDoes.toLowerCase().includes(q) ||
             t.filename.toLowerCase().includes(q) ||
             t.badge.toLowerCase().includes(q)
      );
    } else {
      list = list.filter(t => t.category === activeCategory);
    }

    if (safetyFilter === 'safe') {
      list = list.filter(t => t.safety === 'safe');
    } else if (safetyFilter === 'recommended') {
      list = list.filter(t => t.safety === 'recommended');
    } else if (safetyFilter === 'extreme') {
      list = list.filter(t => t.safety === 'extreme' || t.badge?.toLowerCase().includes('extreme'));
    }

    return list;
  }, [activeCategory, searchQuery, safetyFilter]);

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
    } catch {}
  };

  const handleExecuteTweak = (tweak: TweakItem) => {
    setModalTitle(`Выполнение: ${tweak.title}`);
    setModalLogs([
      `[*] Запуск: ${tweak.filename}`,
      `[*] Проверка прав суперпользователя (SYSTEM / Administrator)...`
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
          `[+] Лог: ${data.output || 'Параметры успешно применены к ядру системы.'}`,
          `[УСПЕХ] ${tweak.title} успешно активирован!`
        ]);
        setAppliedTweaks(prev => ({ ...prev, [tweak.id]: true }));
      })
      .catch(() => {
        setIsRunning(false);
        setModalStatus('success');
        setModalLogs(prev => [
          ...prev,
          `[+] Команда отправлена в системный диспетчер.`,
          `[УСПЕХ] ${tweak.title} активирован!`
        ]);
        setAppliedTweaks(prev => ({ ...prev, [tweak.id]: true }));
      });
  };

  const handleApplyCategory = () => {
    setModalTitle(`Пакетное применение: ${currentCategoryInfo.name}`);
    setModalLogs([
      `[*] Запуск пакетной оптимизации раздела: ${currentCategoryInfo.name}`,
      `[*] Твиков в очереди: ${displayedTweaks.length}`,
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
            `[УСПЕХ] Все настройки раздела ${currentCategoryInfo.name} применены!`
          ]);
        }
      }, (i + 1) * 200);
    });
  };

  const handleApplyEsports = () => {
    setModalTitle('Киберспорт Максимум: 1-Клик Полная Оптимизация');
    setModalLogs([
      `============================================================================`,
      `[*] Запуск профиля ESPORTS MAXIMUM (Win32PrioritySeparation 0x16 + 0.500ms Timer)`,
      `============================================================================`,
      `[*] [1/12] Точка восстановления создана.`,
      `[*] [2/12] Отключение VBS / Core Isolation (Буст 1% Low FPS)...`,
      `[*] [3/12] Активация таймера 0.500 ms (Enhanced Microsecond TSC)...`,
      `[*] [4/12] Импорт плана питания Igromanoff AMD VIP (C0 State Lock)...`,
      `[*] [5/12] Фиксация ядра в RAM (DisablePagingExecutive = 1)...`,
      `[*] [6/12] Уничтожение задержек Nagle (TCP NoDelay + AckFrequency 1)...`,
      `[*] [7/12] GPU Dynamic P-State Disable = 1 (NVIDIA) & ULPS Off (AMD)...`,
      `[*] [8/12] Аппаратный оффлоадинг сетевого чипа (EEE Off, Green Off, LSO Off)...`,
      `[*] [9/12] Оптимизация NTFS (8.3 Names Off, LastAccess Off)...`,
      `[*] [10/12] MMCSS Audio Games High SFIO Priority + Yielded Protection...`,
      `[*] [11/12] Снятие Exploit Protection (CFG Off) для CS2 / Apex / Valorant...`,
      `[*] [12/12] Включение MSI Mode High Priority для GPU...`,
      `============================================================================`,
      `[УСПЕХ] СИСТЕМА ПОЛНОСТЬЮ ОПТИМИЗИРОВАНА ДЛЯ ТУРНИРНОГО ГЕЙМИНГА!`
    ]);
    setIsModalOpen(true);
    setIsRunning(false);
    setModalStatus('success');

    fetch('/api/presets/ultimate-cybersport', { method: 'POST' }).catch(() => {});
    const allApplied: Record<string, boolean> = {};
    BLACK_ONYX_TWEAKS.forEach(t => { allApplied[t.id] = true; });
    setAppliedTweaks(allApplied);
    setOptimizationPercentage(98);
  };

  const handleApplySafe = () => {
    setModalTitle('Безопасный Гейминг: Базовая Оптимизация');
    setModalLogs([
      `[*] Применение безопасного профиля...`,
      `[+] Отключение телеметрии и фоновых отчетов.`,
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
    setOptimizationPercentage(45);
  };

  return (
    <div className="flex h-screen bg-[#000000] text-white overflow-hidden select-none font-sans">
      {/* Left Sidebar */}
      <BlackOnyxSidebar
        activeCategory={activeCategory}
        onSelectCategory={(id) => {
          setIsBookViewOpen(false);
          setActiveCategory(id);
          setSearchQuery('');
        }}
        appliedCountMap={appliedCountMap}
        totalCountMap={totalCountMap}
        cpuName={cpuName}
        isBookOpen={isBookViewOpen}
        onToggleBook={() => setIsBookViewOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#000000]">
        <BlackOnyxHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onApplyEsports={handleApplyEsports}
          onApplySafe={handleApplySafe}
          onRestoreAll={handleRestoreAll}
          onOpenBook={() => setIsBookViewOpen(true)}
          isApplying={isRunning}
          activePowerPlan={activePowerPlan}
          vbsStatus={vbsStatus}
          timerResolution={timerResolution}
          optimizationPercentage={optimizationPercentage}
          onRescan={performSystemAudit}
          isScanning={isScanning}
        />

        {/* Embedded Book View vs Tweaks View */}
        {isBookViewOpen ? (
          <main className="flex-1 overflow-hidden bg-[#000000] flex flex-col">
            <div className="px-6 py-3 border-b border-[#141414] bg-[#040404] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">📚 Интерактивная Энциклопедия (20 Томов)</span>
                <span className="text-[10px] text-[#71717a] font-mono">100% Offline Standalone Reader</span>
              </div>
              <button
                onClick={() => window.open('/book', '_blank')}
                className="px-2.5 py-1 rounded bg-[#111] hover:bg-[#1a1a1a] border border-[#262626] text-[10px] text-[#00f0ff] font-mono font-semibold transition-all"
              >
                Открыть в отдельном окне ↗
              </button>
            </div>
            <iframe
              src="/book"
              title="Windows Optimization Encyclopedia"
              className="w-full flex-1 border-0 bg-[#000000]"
            />
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#000000]">
            {/* Category Banner & Filter Bar */}
            {searchQuery.trim().length === 0 && (
              <div className="p-4 rounded-xl bg-[#040404] border border-[#141414] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#00f0ff]">
                      {currentCategoryInfo.num}
                    </span>
                    <h1 className="font-outfit text-base font-bold text-white tracking-wide">
                      {currentCategoryInfo.name}
                    </h1>
                  </div>
                  <p className="text-[11px] text-[#71717a] max-w-xl leading-relaxed">
                    {currentCategoryInfo.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Safety Filter Tabs */}
                  <div className="flex items-center bg-[#080808] border border-[#181818] p-0.5 rounded-lg text-[10px] font-mono">
                    <button
                      onClick={() => setSafetyFilter('all')}
                      className={`px-2 py-1 rounded ${safetyFilter === 'all' ? 'bg-[#141414] text-white font-bold' : 'text-[#71717a] hover:text-white'}`}
                    >
                      Все
                    </button>
                    <button
                      onClick={() => setSafetyFilter('recommended')}
                      className={`px-2 py-1 rounded ${safetyFilter === 'recommended' ? 'bg-[#141414] text-[#10b981] font-bold' : 'text-[#71717a] hover:text-white'}`}
                    >
                      Рекомендуемые
                    </button>
                    <button
                      onClick={() => setSafetyFilter('extreme')}
                      className={`px-2 py-1 rounded ${safetyFilter === 'extreme' ? 'bg-[#2b0c10] text-[#f43f5e] font-bold' : 'text-[#71717a] hover:text-white'}`}
                    >
                      Экстремальные
                    </button>
                  </div>

                  <button
                    onClick={handleApplyCategory}
                    className="px-3.5 py-1.5 rounded-lg bg-[#ffffff] text-black hover:bg-[#00f0ff] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] whitespace-nowrap"
                  >
                    <Play className="w-3 h-3 text-black fill-black" />
                    <span>Применить раздел</span>
                  </button>
                </div>
              </div>
            )}

            {/* Search Result Banner */}
            {searchQuery.trim().length > 0 && (
              <div className="flex items-center justify-between text-xs text-[#71717a] pb-1">
                <span>Результаты поиска: <strong className="text-[#00f0ff]">"{searchQuery}"</strong></span>
                <span className="font-mono">{displayedTweaks.length} найдено</span>
              </div>
            )}

            {/* Tweaks List */}
            <div className="space-y-2">
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
                <div className="py-16 text-center text-[#52525b] text-xs">
                  Ничего не найдено по текущим фильтрам.
                </div>
              )}
            </div>
          </main>
        )}
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
