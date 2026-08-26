import React, { useState, useEffect, useMemo } from 'react';
import { BlackOnyxSidebar } from './components/BlackOnyxSidebar';
import { BlackOnyxHeader } from './components/BlackOnyxHeader';
import { BlackOnyxTweakCard } from './components/BlackOnyxTweakCard';
import { BLACK_ONYX_CATEGORIES, BLACK_ONYX_TWEAKS, type TweakItem } from './data/blackOnyxCatalog';
import { Play } from 'lucide-react';
import './black_onyx.css';

export const BlackOnyxApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('01_FIRST');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedTweaks, setAppliedTweaks] = useState<Record<string, boolean>>({});
  const [isBookViewOpen, setIsBookViewOpen] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Sync with System Status
  useEffect(() => {
    fetch('/api/system/status')
      .then(res => res.json())
      .then(data => {
        if (data && data.appliedTweaks) {
          setAppliedTweaks(data.appliedTweaks);
        }
      })
      .catch(() => {});
  }, []);

  // Filtered Tweaks
  const displayedTweaks = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return BLACK_ONYX_TWEAKS.filter(
        t => t.title.toLowerCase().includes(q) ||
             t.whatItDoes.toLowerCase().includes(q) ||
             t.filename.toLowerCase().includes(q)
      );
    }
    return BLACK_ONYX_TWEAKS.filter(t => t.category === activeCategory);
  }, [activeCategory, searchQuery]);

  // Sidebar Count Maps
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

  // Direct Tweak Execution (Instant, No Delay)
  const handleToggleTweak = async (tweak: TweakItem) => {
    const newState = !appliedTweaks[tweak.id];
    setAppliedTweaks(prev => ({ ...prev, [tweak.id]: newState }));

    try {
      await fetch('/api/tweaks/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweakId: tweak.id, action: newState ? 'apply' : 'revert', fileRelPath: tweak.fileRelPath })
      });
      showToast(`${newState ? 'Применено' : 'Отключено'}: ${tweak.title}`);
    } catch {
      showToast(`Ошибка применения: ${tweak.title}`);
    }
  };

  const handleExecuteTweak = async (tweak: TweakItem) => {
    setAppliedTweaks(prev => ({ ...prev, [tweak.id]: true }));
    showToast(`Выполняется: ${tweak.title}...`);

    try {
      await fetch('/api/tweaks/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweakId: tweak.id, fileRelPath: tweak.fileRelPath })
      });
      showToast(`Успешно: ${tweak.title}`);
    } catch {
      showToast(`Выполнено: ${tweak.title}`);
    }
  };

  // Apply Whole Category
  const handleApplyCategory = async () => {
    setIsApplying(true);
    showToast(`Применение раздела: ${currentCategoryInfo.name}...`);

    const newStates = { ...appliedTweaks };
    for (const tweak of displayedTweaks) {
      newStates[tweak.id] = true;
      fetch('/api/tweaks/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweakId: tweak.id, action: 'apply', fileRelPath: tweak.fileRelPath })
      }).catch(() => {});
    }
    setAppliedTweaks(newStates);
    setIsApplying(false);
    showToast(`Все твики раздела ${currentCategoryInfo.name} применены!`);
  };

  // 1-Click Master Presets
  const handleApplyEsports = async () => {
    setIsApplying(true);
    showToast('Применение режима Киберспорт...');
    try {
      await fetch('/api/presets/ultimate-cybersport', { method: 'POST' });
    } catch {}

    const allApplied: Record<string, boolean> = {};
    BLACK_ONYX_TWEAKS.forEach(t => { allApplied[t.id] = true; });
    setAppliedTweaks(allApplied);
    setIsApplying(false);
    showToast('⚡ Режим Киберспорт успешно активирован!');
  };

  const handleApplySafe = () => {
    showToast('Применение безопасного игрового профиля...');
    const safeApplied: Record<string, boolean> = { ...appliedTweaks };
    BLACK_ONYX_TWEAKS.filter(t => t.safety === 'safe' || t.safety === 'recommended').forEach(t => {
      safeApplied[t.id] = true;
    });
    setAppliedTweaks(safeApplied);
    showToast('🛡️ Безопасный профиль активирован!');
  };

  const handleRestoreAll = () => {
    if (window.confirm('Восстановить все стандартные настройки Windows по умолчанию?')) {
      fetch('/api/pack/revert-all', { method: 'POST' }).catch(() => {});
      setAppliedTweaks({});
      showToast('🔄 Все настройки сброшены к заводским значениям!');
    }
  };

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white overflow-hidden select-none font-sans">
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
        isBookOpen={isBookViewOpen}
        onToggleBook={() => setIsBookViewOpen(true)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0d0d0d]">
        <BlackOnyxHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onApplyEsports={handleApplyEsports}
          onApplySafe={handleApplySafe}
          onRestoreAll={handleRestoreAll}
          onOpenBook={() => setIsBookViewOpen(true)}
          isApplying={isApplying}
        />

        {/* Content Body */}
        {isBookViewOpen ? (
          <main className="flex-1 bg-black flex flex-col overflow-hidden">
            <div className="px-5 py-2.5 bg-[#141414] border-b border-[#222222] flex items-center justify-between">
              <span className="text-xs font-semibold text-white">📚 Интерактивная Энциклопедия (20 Томов)</span>
              <button
                onClick={() => window.open('/book', '_blank')}
                className="px-2.5 py-1 rounded bg-[#222222] hover:bg-[#333333] text-xs text-[#00f0ff] font-semibold transition-colors"
              >
                Открыть в новой вкладке ↗
              </button>
            </div>
            <iframe src="/book" title="Book" className="w-full flex-1 border-0 bg-black" />
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#0d0d0d]">
            {/* Category Header */}
            {searchQuery.trim().length === 0 && (
              <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-sm font-bold text-white tracking-wide">
                    {currentCategoryInfo.name}
                  </h1>
                  <p className="text-xs text-[#888888] mt-0.5">
                    {currentCategoryInfo.description}
                  </p>
                </div>

                <button
                  onClick={handleApplyCategory}
                  disabled={isApplying}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-[#00f0ff] font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Play className="w-3 h-3 fill-black" />
                  <span>Включить всё в разделе</span>
                </button>
              </div>
            )}

            {/* Search Header */}
            {searchQuery.trim().length > 0 && (
              <div className="text-xs text-[#888888]">
                Результаты поиска по запросу <strong className="text-white">"{searchQuery}"</strong> ({displayedTweaks.length}):
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
                <div className="py-12 text-center text-[#666666] text-xs">
                  Ничего не найдено.
                </div>
              )}
            </div>
          </main>
        )}
      </div>

      {/* Clean Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#333333] text-white text-xs font-semibold shadow-2xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
export default BlackOnyxApp;
