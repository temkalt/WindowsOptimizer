import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, CheckCircle2, ShieldCheck, FileCode, Terminal } from 'lucide-react';
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
  onExecute
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${
        isApplied
          ? 'bg-[#101017] border border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.08)]'
          : 'bg-[#0d0d12] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)]'
      }`}
    >
      {/* Main Card Row */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Badges & Meta */}
          <div className="flex items-center gap-2 mb-2">
            <span className="onyx-badge onyx-badge-cyan">
              {tweak.badge}
            </span>

            {tweak.safety === 'recommended' && (
              <span className="onyx-badge onyx-badge-emerald flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Рекомендуется
              </span>
            )}

            {tweak.safety === 'safe' && (
              <span className="onyx-badge bg-[#1e293b] text-[#94a3b8] border border-[rgba(255,255,255,0.1)]">
                100% Безопасно
              </span>
            )}

            <span className="text-[10px] font-mono text-[#64748b] bg-[#14141d] px-2 py-0.5 rounded-md">
              .{tweak.type.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-white tracking-wide mb-1">
            {tweak.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-2">
            {tweak.whatItDoes}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-1">
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
              className="onyx-btn-secondary flex items-center gap-1.5 text-xs py-1.5 px-3"
            >
              <Play className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>Запуск</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-[#1c1c28] text-[#64748b] hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Technical Explanations Accordion */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-3 border-t border-[rgba(255,255,255,0.06)] bg-[#09090e] rounded-b-2xl space-y-3.5 text-xs">
          {/* What it does */}
          <div>
            <div className="flex items-center gap-1.5 text-[#00f0ff] font-semibold mb-1">
              <FileCode className="w-3.5 h-3.5" />
              <span>Что делает твик (Технические параметры):</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0e0e16] border border-[rgba(255,255,255,0.05)] font-mono text-[11px] text-[#cbd5e1]">
              {tweak.whatItDoes}
            </div>
          </div>

          {/* Why Needed & Proof */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#12121a] border border-[rgba(255,255,255,0.05)]">
              <div className="text-[#10b981] font-semibold mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Зачем это нужно (Импакт на FPS и Latency):</span>
              </div>
              <p className="text-[#94a3b8] text-[11px] leading-relaxed">
                {tweak.whyNeeded}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#12121a] border border-[rgba(255,255,255,0.05)]">
              <div className="text-[#f59e0b] font-semibold mb-1 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>Доказательство эффективности:</span>
              </div>
              <p className="text-[#94a3b8] text-[11px] leading-relaxed">
                {tweak.proof}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex items-center justify-between text-[11px] text-[#64748b] pt-1">
            <span>Файл: <code className="text-[#38bdf8] font-mono">{tweak.filename}</code></span>
            <span>{tweak.instructions}</span>
          </div>
        </div>
      )}
    </div>
  );
};
