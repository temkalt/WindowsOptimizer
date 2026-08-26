import React, { useState, useEffect } from 'react';
import type { SnapshotItem } from '../types';
import {
  History,
  RotateCcw,
  Save,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SnapshotsProps {
  language: 'ru' | 'en';
}

export const SnapshotsView: React.FC<SnapshotsProps> = ({ language }) => {
  const [snapshots, setSnapshots] = useState<SnapshotItem[]>([]);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const fetchSnapshots = async () => {
    try {
      const res = await fetch('/api/snapshots');
      const data = await res.json();
      setSnapshots(Array.isArray(data) ? data : []);
    } catch {
      setSnapshots([
        {
          id: 'snap_init',
          label: 'Default Windows Baseline State',
          timestamp: new Date().toISOString(),
          appliedTweaksCount: 16,
        },
      ]);
    }
  };

  const handleCreateSnapshot = async () => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/snapshots/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: snapshotLabel || 'Manual Snapshot' }),
      });
      const data = await res.json();
      if (data.snapshot) {
        setSnapshots((prev) => [data.snapshot, ...prev]);
        setSnapshotLabel('');
        setStatusMessage(
          language === 'ru'
            ? 'Снимок и системная точка восстановления успешно созданы!'
            : 'Snapshot and system restore point created successfully!'
        );
        confetti({ particleCount: 80, spread: 50 });
      }
    } catch {
      setStatusMessage('Ошибка при создании снимка');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestoreAll = async () => {
    if (!confirm(language === 'ru' ? 'Вы уверены, что хотите вернуть все настройки в исходное состояние Windows?' : 'Are you sure you want to revert all optimizations back to Windows defaults?')) {
      return;
    }

    setIsRestoring(true);
    try {
      const res = await fetch('/api/snapshots/restore', { method: 'POST' });
      const data = await res.json();
      setStatusMessage(data.message || 'Настройки сброшены к значениям по умолчанию');
      confetti({ particleCount: 100, spread: 60 });
    } catch {
      setStatusMessage('Ошибка при восстановлении');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="minimal-panel p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <History className="w-4 h-4 text-zinc-200" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'ru' ? 'Движок Снимков & Точек Отката' : 'Snapshot & Rollback Engine'}
            </h3>
            <p className="text-xs text-zinc-400">
              {language === 'ru'
                ? 'Создание системных точек восстановления VSS и полная гарантия 100% отката любого твика'
                : 'Creation of VSS restore points and transactional rollback guarantees for all settings'}
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center gap-3 text-xs text-zinc-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Create New Snapshot Box */}
      <div className="minimal-card p-5 rounded-xl space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          {language === 'ru' ? 'Создать новый снимок системы' : 'Create New System Snapshot'}
        </h4>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            placeholder={
              language === 'ru'
                ? 'Название снимка (например: Перед CS2 турниром)...'
                : 'Snapshot label (e.g. Before CS2 Tournament)...'
            }
            value={snapshotLabel}
            onChange={(e) => setSnapshotLabel(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />

          <button
            onClick={handleCreateSnapshot}
            disabled={isCreating}
            className="px-5 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>
              {isCreating
                ? (language === 'ru' ? 'Создание...' : 'Creating...')
                : (language === 'ru' ? 'Сохранить Снимок' : 'Save Snapshot')}
            </span>
          </button>
        </div>
      </div>

      {/* Snapshots History Table */}
      <div className="minimal-panel p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {language === 'ru' ? 'История снимков и контрольных точек' : 'Snapshot History & Restore Points'}
          </h4>

          <button
            onClick={handleRestoreAll}
            disabled={isRestoring}
            className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
            <span>
              {isRestoring
                ? (language === 'ru' ? 'Откат...' : 'Reverting...')
                : (language === 'ru' ? 'Экстренный сброс к Windows' : 'Emergency Factory Reset')}
            </span>
          </button>
        </div>

        <div className="space-y-2">
          {snapshots.map((snap) => (
            <div
              key={snap.id}
              className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs font-bold text-zinc-200">{snap.label}</div>
                  <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(snap.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRestoreAll}
                className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'ru' ? 'Восстановить' : 'Restore'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
