import React, { useState } from 'react';
import type { TweakItem, RiskLevel } from '../types';
import {
  Search,
  Filter,
  CheckCircle2,
  Zap,
  FolderArchive,
  ShieldCheck,
  Flame,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

interface ExpertTweaksProps {
  tweaks: TweakItem[];
  language: 'ru' | 'en';
  onToggleTweak: (id: string, currentlyApplied: boolean) => void;
  isProcessingId: string | null;
}

export const ExpertTweaksView: React.FC<ExpertTweaksProps> = ({
  tweaks,
  language,
  onToggleTweak,
  isProcessingId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [isPresetRunning, setIsPresetRunning] = useState<string | null>(null);
  const [presetMessage, setPresetMessage] = useState<string | null>(null);

  const categories = [
    { id: 'all', nameRu: 'Все твики', nameEn: 'All Tweaks' },
    { id: 'kernel_bcd', nameRu: 'Ядро & BCD', nameEn: 'Kernel & BCD' },
    { id: 'net_adapter', nameRu: 'Сетевой адаптер', nameEn: 'NIC Hardware' },
    { id: 'base', nameRu: 'База & Проводник', nameEn: 'Base & Explorer' },
    { id: 'cpu', nameRu: 'CPU & Таймеры', nameEn: 'CPU & Timers' },
    { id: 'gpu', nameRu: 'Видеокарта & GPU', nameEn: 'GPU & Display' },
    { id: 'network', nameRu: 'Сеть & Пинг', nameEn: 'Network & Ping' },
    { id: 'hid', nameRu: 'Мышь & Звук', nameEn: 'HID & Audio' },
    { id: 'memory', nameRu: 'Память & NVMe', nameEn: 'Memory & NVMe' },
    { id: 'services', nameRu: 'Службы', nameEn: 'Services' },
    { id: 'security', nameRu: 'Безопасность', nameEn: 'Security & VBS' },
  ];

  const handleApplyPreset = async (type: 'safe' | 'esports' | 'revert' | 'rebuild') => {
    setIsPresetRunning(type);
    setPresetMessage(null);
    try {
      let endpoint = '/api/pack/apply-safe';
      if (type === 'esports') endpoint = '/api/pack/apply-esports';
      if (type === 'revert') endpoint = '/api/pack/revert-all';
      if (type === 'rebuild') endpoint = '/api/pack/rebuild';

      const res = await fetch(`http://localhost:5050${endpoint}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPresetMessage(
          language === 'ru'
            ? `✅ Успешно выполнено: ${type.toUpperCase()}`
            : `✅ Successfully executed: ${type.toUpperCase()}`
        );
      } else {
        setPresetMessage(`❌ Ошибка: ${data.error || 'Failed'}`);
      }
    } catch (err: any) {
      setPresetMessage(`❌ Ошибка подключения: ${err.message}`);
    } finally {
      setIsPresetRunning(null);
    }
  };

  const filteredTweaks = tweaks.filter((tw) => {
    const matchesSearch =
      tw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tw.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tw.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tw.category === selectedCategory;
    const matchesRisk = selectedRisk === 'all' || tw.riskLevel === selectedRisk;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const getRiskBadge = (risk: RiskLevel) => {
    if (risk === 'safe') {
      return (
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
          SAFE
        </span>
      );
    }
    if (risk === 'moderate') {
      return (
        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30">
          PRO
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-500/30">
        HARDCORE
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Ultimate Pack Master Control Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <FolderArchive className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
                <span>{language === 'ru' ? 'Ultimate Optimization Pack (1000+ гайдов)' : 'Ultimate Optimization Pack (1000+ Guides)'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  14 Folders / 60+ Scripts
                </span>
              </h3>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              d:\winvan\Ultimate-Optimization-Pack
            </p>
          </div>

          {/* Quick Master Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleApplyPreset('safe')}
              disabled={!!isPresetRunning}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isPresetRunning === 'safe' ? '...' : language === 'ru' ? '1-Click Safe Gaming' : '1-Click Safe Gaming'}</span>
            </button>

            <button
              onClick={() => handleApplyPreset('esports')}
              disabled={!!isPresetRunning}
              className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-rose-950/20"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isPresetRunning === 'esports' ? '...' : language === 'ru' ? '1-Click Esports Max' : '1-Click Esports Max'}</span>
            </button>

            <button
              onClick={() => handleApplyPreset('revert')}
              disabled={!!isPresetRunning}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isPresetRunning === 'revert' ? '...' : language === 'ru' ? 'Сброс (Default)' : 'Revert All'}</span>
            </button>

            <button
              onClick={() => handleApplyPreset('rebuild')}
              disabled={!!isPresetRunning}
              title={language === 'ru' ? 'Пересоздать файлы пака на диске' : 'Rebuild pack files on disk'}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPresetRunning === 'rebuild' ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {presetMessage && (
          <div className="text-xs font-mono p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
            {presetMessage}
          </div>
        )}
      </div>

      {/* Top Search & Filter */}
      <div className="minimal-panel p-4 rounded-xl border border-zinc-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'ru' ? 'Поиск параметров...' : 'Search system tweaks...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="text-[11px] text-zinc-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>{language === 'ru' ? 'Риск:' : 'Risk:'}</span>
            </span>
            {['all', 'safe', 'moderate', 'extreme'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRisk(r)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  selectedRisk === r
                    ? 'bg-zinc-700 text-white font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {language === 'ru' ? cat.nameRu : cat.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tweaks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTweaks.map((tw) => {
          const isProcessing = isProcessingId === tw.id;
          return (
            <div
              key={tw.id}
              className={`minimal-card p-4 rounded-xl flex flex-col justify-between transition-colors ${
                tw.isApplied ? 'border-zinc-700 bg-zinc-900/60' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h4 className="text-xs font-bold text-zinc-200 leading-snug">
                    {language === 'ru' ? tw.name : tw.nameEn}
                  </h4>
                  {getRiskBadge(tw.riskLevel)}
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                  {tw.description}
                </p>

                <div className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800/80 mb-3 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span className="truncate">{tw.impact}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80">
                <span className="text-[10px] font-mono uppercase text-zinc-500">
                  {tw.categoryName}
                </span>

                <button
                  onClick={() => onToggleTweak(tw.id, tw.isApplied)}
                  disabled={isProcessing}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                    tw.isApplied
                      ? 'bg-zinc-800 text-emerald-400 hover:bg-zinc-700'
                      : 'bg-zinc-200 hover:bg-white text-zinc-950 font-bold'
                  }`}
                >
                  {isProcessing ? (
                    <span>...</span>
                  ) : tw.isApplied ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === 'ru' ? 'Активен (Откатить)' : 'Active (Revert)'}</span>
                    </>
                  ) : (
                    <span>{language === 'ru' ? 'Применить' : 'Apply'}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
