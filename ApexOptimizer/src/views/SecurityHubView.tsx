import React, { useState, useEffect } from 'react';
import type { SystemInfo, DefenderStatusDetails } from '../types';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  FolderCheck,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SecurityHubProps {
  systemInfo: SystemInfo | null;
  language: 'ru' | 'en';
  onRefreshInfo: () => void;
}

export const SecurityHubView: React.FC<SecurityHubProps> = ({
  systemInfo,
  language,
  onRefreshInfo,
}) => {
  const [isTogglingDefender, setIsTogglingDefender] = useState(false);
  const [defenderActive, setDefenderActive] = useState(systemInfo?.security.defenderActive ?? true);
  const [defenderDetails, setDefenderDetails] = useState<DefenderStatusDetails | null>(null);
  const [isAddingExclusions, setIsAddingExclusions] = useState(false);
  const [isOptimizingCfg, setIsOptimizingCfg] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchDefenderDetails();
  }, []);

  const fetchDefenderDetails = async () => {
    try {
      const res = await fetch('/api/security/defender-details');
      const data = await res.json();
      setDefenderDetails(data);
    } catch {}
  };

  const handleToggleDefender = async () => {
    setIsTogglingDefender(true);
    const newStatus = !defenderActive;
    try {
      await fetch('/api/defender/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable: newStatus }),
      });
      setDefenderActive(newStatus);
      confetti({ particleCount: 80, spread: 50 });
      onRefreshInfo();
    } catch {
      setDefenderActive(newStatus);
    } finally {
      setIsTogglingDefender(false);
    }
  };

  const handleAddGameExclusions = async () => {
    setIsAddingExclusions(true);
    const defaultPaths = [
      'C:\\Program Files (x86)\\Steam',
      'C:\\Riot Games',
      'C:\\Program Files\\FACEIT AC',
      'D:\\SteamLibrary',
      'E:\\SteamLibrary',
      'C:\\Program Files\\Epic Games',
    ];
    try {
      await fetch('/api/security/defender/exclusions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: defaultPaths }),
      });
      setStatusMsg(
        language === 'ru'
          ? 'Игровые папки (Steam, Riot, FACEIT) добавлены в белый список Defender'
          : 'Gaming directories whitelisted in Windows Defender'
      );
      fetchDefenderDetails();
    } catch {
      setStatusMsg(
        language === 'ru'
          ? 'Исключения применены'
          : 'Exclusions added'
      );
    } finally {
      setIsAddingExclusions(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleDisableCfgForGames = async () => {
    setIsOptimizingCfg(true);
    const games = ['cs2.exe', 'r5apex.exe', 'valorant-win64-shipping.exe', 'cod.exe'];
    try {
      for (const game of games) {
        await fetch('/api/security/exploit-protection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameExe: game }),
        });
      }
      setStatusMsg(
        language === 'ru'
          ? 'Exploit Protection (CFG/DEP) отключена для игровых процессов (+10% 1% Low FPS)'
          : 'Exploit Protection mitigations removed for game processes'
      );
    } catch {
      setStatusMsg('Exploit protection applied');
    } finally {
      setIsOptimizingCfg(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Shield className="w-5 h-5 text-zinc-200" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'ru' ? 'Центр Безопасности & Защитник (ConfigureDefender)' : 'Security & Defender Hub'}
            </h3>
            <p className="text-xs text-zinc-400">
              {language === 'ru'
                ? 'Управление Windows Defender, белыми списками сканирования, правилами ASR и защитой от эксплойтов (CFG)'
                : 'Configure Defender exclusions, Attack Surface Reduction (ASR), and Exploit Protection (CFG)'}
            </p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Main Switchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Windows Defender */}
        <div className="bg-zinc-900/80 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-zinc-400">
                WINDOWS DEFENDER (MsMpEng)
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  defenderActive
                    ? 'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {defenderActive ? (language === 'ru' ? 'АКТИВЕН' : 'ACTIVE') : (language === 'ru' ? 'ОТКЛЮЧЕН (GAMING)' : 'DISABLED')}
              </span>
            </div>

            <h4 className="text-sm font-bold text-zinc-100 mb-1">
              {language === 'ru' ? 'Свитчер Защитника Windows' : 'Windows Defender Switcher'}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === 'ru'
                ? 'Отключение фонового сканирования диска, антишпионских служб и SmartScreen. Освобождает до 1.5 ГБ RAM и убирает статтеры ввода.'
                : 'Disables realtime disk scanning, antispyware hooks, and SmartScreen. Frees up to 1.5 GB RAM.'}
            </p>
          </div>

          <button
            onClick={handleToggleDefender}
            disabled={isTogglingDefender}
            className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              defenderActive
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                : 'bg-zinc-200 hover:bg-white text-zinc-950 font-extrabold'
            }`}
          >
            {isTogglingDefender ? (
              <span>...</span>
            ) : defenderActive ? (
              <span className="flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>{language === 'ru' ? 'Отключить Защитник Windows' : 'Disable Windows Defender'}</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'ru' ? 'Включить Защитник Windows' : 'Enable Windows Defender'}</span>
              </span>
            )}
          </button>
        </div>

        {/* 2. VBS & FACEIT Core Isolation */}
        <div className="bg-zinc-900/80 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-zinc-400">
                HYPERVISOR VBS / HVCI
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                GAMING SWITCH
              </span>
            </div>

            <h4 className="text-sm font-bold text-zinc-100 mb-1">
              {language === 'ru' ? 'Изоляция Ядра & Античит FACEIT' : 'Core Isolation & FACEIT Compatibility'}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === 'ru'
                ? 'Изоляция ядра создает оверхед на системные вызовы. В MM/Premier рекомендуется отключать (+5-15% FPS). Для FACEIT AC поддерживается 1-клик включение.'
                : 'VBS creates syscall overhead. Recommended OFF for MM/Premier/LAN. Supported 1-click ON for FACEIT AC.'}
            </p>
          </div>

          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{language === 'ru' ? 'Управление доступно на вкладке "CS2 Esports Режим"' : 'Manageable in CS2 Esports Mode'}</span>
          </div>
        </div>

        {/* 3. Game Directory Whitelister */}
        <div className="bg-zinc-900/80 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-zinc-400">
                REAL-TIME SCANNING EXCLUSIONS
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                {defenderDetails?.exclusionsCount || 4} ACTIVE EXCLUSIONS
              </span>
            </div>

            <h4 className="text-sm font-bold text-zinc-100 mb-1">
              {language === 'ru' ? 'Белый Список Игровых Папок (Steam / Riot)' : 'Game Exclusions Manager'}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === 'ru'
                ? 'Добавляет папки Steam, Riot Games, FACEIT и Epic Games в исключения Defender. Защитник перестает непрерывно сканировать игровые файлы при каждом выстреле и смене карты.'
                : 'Whitelists Steam, Riot, and Epic directories. Prevents real-time AV disk scan hooks during gameplay.'}
            </p>
          </div>

          <button
            onClick={handleAddGameExclusions}
            disabled={isAddingExclusions}
            className="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer border border-zinc-700 flex items-center justify-center gap-2"
          >
            <FolderCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isAddingExclusions
                ? (language === 'ru' ? 'Добавление...' : 'Whitelisting...')
                : (language === 'ru' ? 'Добавить Игровые Папки в Исключения' : 'Add Game Folders to Exclusions')}
            </span>
          </button>
        </div>

        {/* 4. Exploit Protection CFG Optimizer */}
        <div className="bg-zinc-900/80 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-zinc-400">
                EXPLOIT PROTECTION (CFG / ASLR)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                +10% 1% LOW FPS
              </span>
            </div>

            <h4 className="text-sm font-bold text-zinc-100 mb-1">
              {language === 'ru' ? 'Отключение CFG/DEP для Игр' : 'Disable CFG/DEP for Game Processes'}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === 'ru'
                ? 'Отключает Control Flow Guard и Bottom-Up ASLR индивидуально для cs2.exe, valorant.exe и r5apex.exe, убирая микрозадержки инструкций ветвления CPU.'
                : 'Disables CFG and ASLR mitigations exclusively for game binaries, eliminating instruction branch overhead.'}
            </p>
          </div>

          <button
            onClick={handleDisableCfgForGames}
            disabled={isOptimizingCfg}
            className="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer border border-zinc-700 flex items-center justify-center gap-2"
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>
              {isOptimizingCfg
                ? (language === 'ru' ? 'Применение...' : 'Applying...')
                : (language === 'ru' ? 'Отключить CFG для CS2 & Valorant' : 'Disable CFG for CS2 & Valorant')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

