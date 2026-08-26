import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, CheckCircle2, ShieldCheck, FileCode, Terminal, AlertTriangle } from 'lucide-react';
import type { TweakItem } from '../data/blackOnyxCatalog';

interface TweakCardProps {
  tweak: TweakItem;
  isApplied: boolean;
  onToggle: (tweak: TweakItem) => void;
  onExecute: (tweak: TweakItem) => void;
  }

export const BlackOnyxTweakCard: React.FC<TweakCardProps> = ({
  tweak,
  isApplied,
  onToggle,
  onExecute,
  }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isExtreme = tweak.safety === 'extreme' || tweak.badge?.toLowerCase().includes('extreme');

  return (
    <div
      className={`rounded-xl transition-all duration-150 border ${
        isExtreme
          ? isApplied
            ? 'bg-[#12080a] border-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.15)]'
            : 'bg-[#080405] border-[#2e1216] hover:border-[#f43f5e]/50'
          : isApplied
          ? 'bg-[#07090b] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.08)]'
          : 'bg-[#050505] border-[#151515] hover:border-[#262626]'
      }`}
    >
      {/* Main Card Row */}
      <div className="p-3.5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Badges & Meta */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className={`onyx-badge ${isExtreme ? 'onyx-badge-rose' : 'onyx-badge-cyan'}`}>
              {tweak.badge}
            </span>

            {tweak.safety === 'recommended' && (
              <span className="onyx-badge onyx-badge-emerald flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                Рекомендуется
              </span>
            )}

            {tweak.safety === 'safe' && (
              <span className="onyx-badge onyx-badge-dark">
                100% Безопасно
              </span>
            )}

            {isExtreme && (
              <span className="onyx-badge onyx-badge-rose flex items-center gap-1 font-bold">
                <AlertTriangle className="w-2.5 h-2.5" />
                НЕ РЕКОМЕНДУЕТСЯ
              </span>
            )}

            <span className="text-[9px] font-mono text-[#52525b] bg-[#0c0c0c] px-1.5 py-0.5 rounded border border-[#1a1a1a]">
              .{tweak.type.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-xs font-semibold tracking-wide mb-1 ${isExtreme ? 'text-[#fda4af]' : 'text-white'}`}>
            {tweak.title}
          </h3>

          {/* Short description */}
          <p className="text-[11px] text-[#71717a] leading-relaxed line-clamp-2">
            {tweak.whatItDoes}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-0.5 shrink-0">
          {tweak.type === 'reg' ? (
            <label className="onyx-switch">
              <input
                type="checkbox"
                checked={isApplied}
                onChange={() => onToggle(tweak)}
              />
              <span className="onyx-slider"></span>
            </label>
          ) : (
            <button
              onClick={() => onExecute(tweak)}
              className={`px-3 py-1.5 rounded-lg border text-white flex items-center gap-1 text-[11px] font-bold transition-all shadow-sm ${
                isExtreme
                  ? 'bg-[#2b0c10] border-[#f43f5e] hover:bg-[#f43f5e] hover:text-black'
                  : 'bg-[#0a0a0a] border-[#222222] hover:border-[#00f0ff] hover:text-[#00f0ff]'
              }`}
            >
              <Play className="w-3 h-3 text-[#00f0ff] fill-current" />
              <span>Запуск</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Подробные технические сведения"
            className="p-1.5 rounded-md hover:bg-[#141414] text-[#52525b] hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Technical Explanations Accordion */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2.5 border-t border-[#141414] bg-[#020202] rounded-b-xl space-y-2.5 text-xs">
          {/* What it does */}
          <div>
            <div className="flex items-center gap-1 text-[#00f0ff] font-semibold mb-1 text-[11px]">
              <FileCode className="w-3 h-3" />
              <span>Технические параметры твика:</span>
            </div>
            <div className="p-2 rounded-lg bg-[#070707] border border-[#181818] font-mono text-[10px] text-[#a1a1aa] whitespace-pre-wrap">
              {tweak.whatItDoes}
            </div>
          </div>

          {/* Why Needed & Proof */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-[#070707] border border-[#181818]">
              <div className="text-[#10b981] font-semibold mb-1 flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>Импакт на FPS и Latency:</span>
              </div>
              <p className="text-[#71717a] text-[10px] leading-relaxed">
                {tweak.whyNeeded}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#070707] border border-[#181818]">
              <div className="text-[#f59e0b] font-semibold mb-1 flex items-center gap-1 text-[10px]">
                <Terminal className="w-3 h-3" />
                <span>Доказательство эффективности:</span>
              </div>
              <p className="text-[#71717a] text-[10px] leading-relaxed">
                {tweak.proof}
              </p>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-[10px] text-[#52525b] pt-1 flex-wrap gap-2">
            <span>Файл: <code className="text-[#38bdf8] font-mono">{tweak.filename}</code></span>
            <span>{tweak.instructions}</span>
          </div>
        </div>
      )}
    </div>
  );
};
