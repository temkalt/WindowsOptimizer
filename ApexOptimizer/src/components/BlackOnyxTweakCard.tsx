import React from 'react';
import { Play, Check, AlertTriangle } from 'lucide-react';
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
  const isExtreme = tweak.safety === 'extreme' || tweak.badge?.toLowerCase().includes('extreme');

  return (
    <div
      className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between gap-4 ${
        isExtreme
          ? 'bg-[#14080a] border-[#f43f5e]/40'
          : isApplied
          ? 'bg-[#111618] border-[#00f0ff]/40'
          : 'bg-[#111111] border-[#222222] hover:border-[#333333]'
      }`}
    >
      {/* Tweak Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-semibold text-white tracking-wide">
            {tweak.title}
          </span>

          {isExtreme && (
            <span className="px-1.5 py-0.5 rounded bg-[#f43f5e]/20 border border-[#f43f5e]/40 text-[#f43f5e] text-[9px] font-bold flex items-center gap-1 uppercase">
              <AlertTriangle className="w-2.5 h-2.5" />
              Экстрим
            </span>
          )}

          {tweak.safety === 'recommended' && (
            <span className="px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] text-[9px] font-semibold">
              Рекомендуется
            </span>
          )}
        </div>

        <p className="text-[11px] text-[#888888] leading-relaxed line-clamp-1">
          {tweak.whatItDoes}
        </p>
      </div>

      {/* Tweak Action Control */}
      <div className="shrink-0 flex items-center">
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              isExtreme
                ? 'bg-[#f43f5e] text-white hover:bg-[#e11d48]'
                : isApplied
                ? 'bg-[#10b981] text-black font-bold'
                : 'bg-[#222222] hover:bg-[#333333] text-white'
            }`}
          >
            {isApplied ? (
              <>
                <Check className="w-3 h-3 text-black" />
                <span>Применено</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Применить</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
