import React, { useState, useEffect } from 'react';
import {
  Server,
  Zap,
  CheckCircle2,
  Search,
  Sparkles,
  ChevronRight,
  Flame,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HARDWARE_PRESETS as DEFAULT_PRESETS } from '../data/hardwarePresets';
import type { HardwareBuildPreset } from '../types';

interface HardwareDatabaseProps {
  language: 'ru' | 'en';
}

export const HardwareDatabaseView: React.FC<HardwareDatabaseProps> = ({ language }) => {
  const [presets, setPresets] = useState<HardwareBuildPreset[]>(DEFAULT_PRESETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [matchedPreset, setMatchedPreset] = useState<HardwareBuildPreset | null>(DEFAULT_PRESETS[0]);
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchPresets = async () => {
    try {
      const res = await fetch('/api/hardware-db/presets');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPresets(data);
        }
      }
    } catch {}
  };

  const handleAutoMatch = async () => {
    try {
      const res = await fetch('/api/hardware-db/auto-match', { method: 'POST' });
      const data = await res.json();
      if (data.match) {
        setMatchedPreset(data.match);
        confetti({ particleCount: 90, spread: 60 });
        setStatusMessage(
          language === 'ru'
            ? `Определена сборка: ${data.match.name} (Совпадение ${data.match.matchScore || 98}%)`
            : `Matched configuration: ${data.match.name} (${data.match.matchScore || 98}% match)`
        );
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch {}
  };

  useEffect(() => {
    fetchPresets();
    handleAutoMatch();
  }, []);

  const handleApplyPreset = async (preset: HardwareBuildPreset) => {
    setIsApplying(true);
    try {
      await fetch('/api/hardware-db/apply-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetId: preset.id }),
      });
      setAppliedPresetId(preset.id);
      confetti({ particleCount: 110, spread: 70 });
      setStatusMessage(
        language === 'ru'
          ? `Применен специализированный профиль для ${preset.cpu}!`
          : `Applied dedicated profile for ${preset.cpu}!`
      );
    } catch {}
    finally {
      setIsApplying(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const filteredPresets = presets.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cpu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.gpu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              {language === 'ru' ? 'База 100+ Популярных Сборок ПК & Авто-Предиктор' : '100+ Hardware Build Profiles & Predictor'}
            </h3>
            <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">
              AI PREDICTOR ACTIVE
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {language === 'ru'
              ? 'Каталог протестированных киберспортивных сборок (AM5, AM4, LGA1700, LGA1851, LGA1200) с автоматическим подбором схемы питания Igromanoff, привязки ядер (Affinity) и параметров CS2.'
              : 'Database of tested esports hardware builds with automated match predictor for Igromanoff power schemes, core pinning, and CS2 launch tuning.'}
          </p>
        </div>

        <button
          onClick={handleAutoMatch}
          className="px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-zinc-950" />
          <span>{language === 'ru' ? 'Определить Мое Железо' : 'Auto-Detect My PC'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Matched Banner if available */}
      {matchedPreset && (
        <div className="p-5 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-zinc-900/90 to-zinc-900/90 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                  {language === 'ru' ? 'ТОЧНОЕ СОВПАДЕНИЕ ПОД ВАШУ СИСТЕМУ' : 'EXACT HARDWARE MATCH FOUND'}
                </span>
                <h4 className="text-sm font-bold text-white">{matchedPreset.name}</h4>
              </div>
            </div>

            <button
              onClick={() => handleApplyPreset(matchedPreset)}
              disabled={isApplying}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              {appliedPresetId === matchedPreset.id ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{language === 'ru' ? 'Профиль Активен' : 'Profile Active'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>{language === 'ru' ? 'Применить Пресет Железа' : 'Apply Hardware Preset'}</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-zinc-950/80 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">POWER PLAN:</span>
              <span className="text-zinc-200 truncate block">{matchedPreset.tuning.powerPlanName}</span>
            </div>
            <div className="p-2.5 rounded bg-zinc-950/80 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">AFFINITY MASK:</span>
              <span className="text-purple-400 font-bold">{matchedPreset.tuning.cpuAffinityMaskHex}</span>
            </div>
            <div className="p-2.5 rounded bg-zinc-950/80 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">WIN32 QUANTUM:</span>
              <span className="text-cyan-400 font-bold">{matchedPreset.tuning.win32PrioritySeparation}</span>
            </div>
            <div className="p-2.5 rounded bg-zinc-950/80 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">FPS ESTIMATE CS2:</span>
              <span className="text-emerald-400 font-bold">~{matchedPreset.tuning.fpsEstimateCs2.avg} FPS (1% {matchedPreset.tuning.fpsEstimateCs2.p1Low})</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['ALL', 'AMD_AM5', 'AMD_AM4', 'INTEL_LGA1700', 'INTEL_LGA1851', 'INTEL_LGA1200'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-200 text-zinc-950 font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ru' ? 'Поиск процессора или видеокарты...' : 'Search CPU or GPU...'}
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono"
          />
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredPresets.map((preset) => (
          <div
            key={preset.id}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
              matchedPreset?.id === preset.id
                ? 'bg-zinc-900/95 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                : 'bg-zinc-900/70 border-zinc-800/90 hover:border-zinc-700'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  preset.tier === 'ESPORTS_FLAGSHIP'
                    ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                    : preset.tier === 'HIGH_END'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                    : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {preset.tier}
                </span>

                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  CS2 ~{preset.tuning.fpsEstimateCs2.avg} FPS
                </span>
              </div>

              <h4 className="text-xs font-bold text-zinc-100 leading-snug mb-1">
                {preset.name}
              </h4>

              <div className="text-[11px] font-mono text-zinc-400 space-y-0.5">
                <div>CPU: <span className="text-zinc-200">{preset.cpu}</span></div>
                <div>GPU: <span className="text-zinc-200">{preset.gpu}</span></div>
                <div>RAM: <span className="text-zinc-200">{preset.ramSpec}</span></div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[180px]">
                {preset.tuning.powerPlanName}
              </span>

              <button
                onClick={() => handleApplyPreset(preset)}
                disabled={isApplying}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  appliedPresetId === preset.id
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'bg-zinc-200 hover:bg-white text-zinc-950'
                }`}
              >
                {appliedPresetId === preset.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ru' ? 'Активен' : 'Active'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'ru' ? 'Применить' : 'Apply'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
