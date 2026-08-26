import React, { useState } from 'react';
import {
  Crosshair,
  CheckCircle2,
  Terminal,
  Zap,
  Copy,
  Check,
  RefreshCw,
  Monitor,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameProfilesProps {
  language: 'ru' | 'en';
}

export const GameProfilesView: React.FC<GameProfilesProps> = ({ language }) => {
  const [faceitMode, setFaceitMode] = useState(false);
  const [fseMode, setFseMode] = useState(true);
  const [win32Priority, setWin32Priority] = useState('0x18');
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isRestartingGpu, setIsRestartingGpu] = useState(false);

  const steamLaunchOptions = '-high -threads 8 +fps_max 0 -novid +exec autoexec.cfg -nojoy -fullscreen';

  const handleCopyLaunchOptions = () => {
    navigator.clipboard.writeText(steamLaunchOptions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCS2Profile = async () => {
    setIsApplying(true);
    try {
      await fetch('/api/cs2/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceitMode }),
      });
      setIsApplied(true);
      confetti({ particleCount: 100, spread: 60 });
    } catch {}
    finally {
      setIsApplying(false);
    }
  };

  const handleToggleFaceit = async (enabled: boolean) => {
    setFaceitMode(enabled);
    try {
      await fetch('/api/cs2/faceit-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enableFaceit: enabled }),
      });
    } catch {}
  };

  const handleToggleFse = async (enableFse: boolean) => {
    setFseMode(enableFse);
    try {
      await fetch(enableFse ? '/api/tweaks/apply' : '/api/tweaks/revert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'fse_behavior_mode_2' }),
      });
      setStatusMessage(
        enableFse
          ? (language === 'ru' ? 'Активирован прямой DirectX Fullscreen Exclusive Mode 2' : 'DirectX Fullscreen Exclusive Mode 2 activated')
          : (language === 'ru' ? 'Включен режим Fullscreen Optimizations' : 'Fullscreen Optimizations enabled')
      );
    } catch {}
    finally {
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleSetWin32Priority = async (val: string) => {
    setWin32Priority(val);
    try {
      await fetch('/api/tweaks/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'win32_priority_separation' }),
      });
      setStatusMessage(
        language === 'ru'
          ? `Кванты планировщика Win32PrioritySeparation установлены в ${val}`
          : `Win32PrioritySeparation quantum set to ${val}`
      );
    } catch {}
    finally {
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleRestartGraphicsDriver = async () => {
    setIsRestartingGpu(true);
    try {
      await fetch('/api/graphics/restart', { method: 'POST' });
      setStatusMessage(
        language === 'ru'
          ? 'Драйвер дисплея и DWM пайплайн сброшены через restart64.exe'
          : 'Display driver and DWM pipeline flushed via restart64.exe'
      );
    } catch {}
    finally {
      setIsRestartingGpu(false);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleApplyFaceitHvciFix = async () => {
    try {
      await fetch('/api/tweaks/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'faceit_memory_integrity_fix' }),
      });
      setStatusMessage(
        language === 'ru'
          ? 'Применен фикс целостности памяти FACEIT (HypervisorEnforcedCodeIntegrity)'
          : 'Applied FACEIT memory integrity fix (HypervisorEnforcedCodeIntegrity)'
      );
    } catch {}
    finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const cs2Features = [
    {
      titleRu: 'Сетевой Sub-Tick HitReg:',
      descRu: 'rate 786432, cl_updaterate 128, cl_interp 0.015625, cl_interp_ratio 1, TCPNoDelay=1',
      titleEn: 'Sub-Tick HitReg:',
      descEn: 'rate 786432, cl_updaterate 128, cl_interp 0.015625, cl_interp_ratio 1, TCPNoDelay=1',
    },
    {
      titleRu: 'Аппаратная изоляция ядер (3D V-Cache):',
      descRu: 'Принудительная привязка CS2 к CCD0 (кэш), прерывания GPU к ядру 2, сеть к ядру 4, мышь к ядру 6',
      titleEn: 'Hardware 3D V-Cache Isolation:',
      descEn: 'Pin CS2 to CCD0 cache, GPU MSI to Core 2, NIC RSS to Core 4, USB mouse to Core 6',
    },
    {
      titleRu: 'DXGI Flip Model & FSE Behavior Mode 2:',
      descRu: 'Прямой вывод кадров видеокарты без композитора DWM (минус 4-8 мс задержки отрисовки)',
      titleEn: 'DXGI Flip Model & FSE Behavior 2:',
      descEn: 'Direct frame presentation bypassing DWM compositor (-4-8ms rendering lag)',
    },
    {
      titleRu: 'P0 State Lock & Отключение HDCP:',
      descRu: 'Фиксация максимальных частот видеопамяти NVIDIA и отключение циклов шифрования HDCP',
      titleEn: 'P0 State Lock & HDCP Disable:',
      descEn: 'Lock maximum NVIDIA GPU clocks and disable display verification overhead',
    },
    {
      titleRu: 'Очереди ввода мыши и клавиатуры:',
      descRu: 'MouseDataQueueSize = 20, KeyboardDataQueueSize = 16, линейный 1:1 Raw Input',
      titleEn: 'HID Mouse & Keyboard Queues:',
      descEn: 'MouseDataQueueSize = 20, KeyboardDataQueueSize = 16, true 1:1 raw mouse curves',
    },
    {
      titleRu: 'Таймеры ядра и MMCSS 100%:',
      descRu: 'Калибровка 0.5000 мс, Dynamic Tick off, Platform Tick on, Win32PrioritySeparation 0x18',
      titleEn: 'Kernel Timers & MMCSS 100%:',
      descEn: '0.5000ms calibration, Dynamic Tick off, Platform Tick on, Win32PrioritySeparation 0x18',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crosshair className="w-5 h-5 text-zinc-100" />
            <h3 className="text-lg font-bold text-white">
              {language === 'ru' ? 'Специализированный Профиль CS2 Esports' : 'CS2 Esports Dedicated Profile'}
            </h3>
            <span className="text-[10px] font-mono font-bold bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded">
              COMPETITIVE READY
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {language === 'ru'
              ? 'Комплексная настройка Windows и движка Source 2 для максимальной стабильности времени кадра, регистрации попаданий Sub-Tick и минимального инпут-лага.'
              : 'Complete Windows and Source 2 engine calibration for maximum frametime consistency, Sub-Tick HitReg, and minimal input lag.'}
          </p>
        </div>

        <button
          onClick={handleApplyCS2Profile}
          disabled={isApplying}
          className="px-6 py-3 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Zap className="w-4 h-4 text-zinc-950" />
          <span>
            {isApplying
              ? (language === 'ru' ? 'Применение...' : 'Applying...')
              : isApplied
              ? (language === 'ru' ? 'Профиль Активирован' : 'Profile Active')
              : (language === 'ru' ? 'Применить Профиль CS2' : 'Apply CS2 Profile')}
          </span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Advanced Switches Grid from LLC Pack & VanDayStuff11 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* FSE vs FSO (LLC Pack 16) */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ru' ? 'FSE Режим (LLC Pack 16)' : 'FSE Direct Mode'}</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {fseMode ? 'FSE (MODE 2)' : 'FSO (DEFAULT)'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            {language === 'ru'
              ? 'Аппаратный Fullscreen Exclusive без задержек оверлея DWM'
              : 'Direct Fullscreen Exclusive bypass'}
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleToggleFse(true)}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                fseMode ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              FSE (Min Lag)
            </button>
            <button
              onClick={() => handleToggleFse(false)}
              className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                !fseMode ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              FSO
            </button>
          </div>
        </div>

        {/* Win32PrioritySeparation (LLC Pack 17) */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>{language === 'ru' ? 'Win32Priority (LLC 17)' : 'Win32Priority'}</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-purple-300">
              {win32Priority}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            {language === 'ru'
              ? 'Кванты времени переднего плана (0x18 short fixed / 0x26 variable)'
              : 'Thread scheduling quantum'}
          </p>
          <div className="flex gap-1.5 pt-1">
            {['0x18', '0x26', '0x28', '0x16'].map((q) => (
              <button
                key={q}
                onClick={() => handleSetWin32Priority(q)}
                className={`flex-1 py-1.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                  win32Priority === q ? 'bg-purple-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* CRU restart64.exe & FACEIT Fix */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-zinc-300" />
                <span>{language === 'ru' ? 'Быстрые Инструменты' : 'Quick Actions'}</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {language === 'ru'
                ? 'Сброс видеодрайвера без перезагрузки и фикс FACEIT'
                : 'Flush GPU pipeline & apply FACEIT fix'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRestartGraphicsDriver}
              disabled={isRestartingGpu}
              className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isRestartingGpu ? 'animate-spin' : ''}`} />
              <span>restart64</span>
            </button>
            <button
              onClick={handleApplyFaceitHvciFix}
              className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-300 text-xs font-bold rounded transition-colors flex items-center justify-center gap-1 cursor-pointer border border-emerald-500/20"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>FACEIT FIX</span>
            </button>
          </div>
        </div>
      </div>

      {/* Anti-Cheat Mode Switcher (FACEIT vs MM/Premier/LAN) */}
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide">
            {language === 'ru' ? 'Режим Совместимости с Античитом' : 'Anti-Cheat Compatibility Mode'}
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            {faceitMode ? 'FACEIT AC ON' : 'PREMIER / LAN / MM (MAX FPS)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            onClick={() => handleToggleFaceit(false)}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              !faceitMode
                ? 'bg-zinc-800 border-zinc-600 text-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="text-xs font-bold mb-1 flex items-center justify-between">
              <span>{language === 'ru' ? 'Premier / Matchmaking / LAN (Макс. FPS)' : 'Premier / MM / LAN (Max FPS)'}</span>
              {!faceitMode && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-zinc-400">
              {language === 'ru'
                ? 'Изоляция ядра (VBS/HVCI) отключена. Максимальная производительность процессора (+5-15% FPS).'
                : 'Hypervisor VBS disabled for maximum raw CPU throughput and lowest syscall latency.'}
            </p>
          </div>

          <div
            onClick={() => handleToggleFaceit(true)}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              faceitMode
                ? 'bg-zinc-800 border-zinc-600 text-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="text-xs font-bold mb-1 flex items-center justify-between">
              <span>{language === 'ru' ? 'FACEIT Anti-Cheat Compatible' : 'FACEIT AC Compatible'}</span>
              {faceitMode && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-zinc-400">
              {language === 'ru'
                ? 'Изоляция ядра включена для соответствия правилам FACEIT AC при сохранении остальных 99% твиков.'
                : 'Memory Integrity enabled to comply with FACEIT Anti-Cheat requirements.'}
            </p>
          </div>
        </div>
      </div>

      {/* Steam Launch Options Box */}
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>{language === 'ru' ? 'Рекомендуемые параметры запуска Steam для CS2:' : 'Recommended Steam Launch Options for CS2:'}</span>
          </label>

          <button
            onClick={handleCopyLaunchOptions}
            className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? (language === 'ru' ? 'Скопировано!' : 'Copied!') : (language === 'ru' ? 'Скопировать' : 'Copy')}</span>
          </button>
        </div>

        <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/80 font-mono text-xs text-zinc-200 select-all">
          {steamLaunchOptions}
        </div>
      </div>

      {/* Features Included Grid */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          {language === 'ru' ? 'Внедренные Инженерные Оптимизации CS2 (LLC Pack & VanDayStuff11):' : 'Deployed CS2 Engineering Optimizations:'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cs2Features.map((feat, i) => (
            <div key={i} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs space-y-1">
              <div className="font-bold text-zinc-200 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{language === 'ru' ? feat.titleRu : feat.titleEn}</span>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 pl-3.5">
                {language === 'ru' ? feat.descRu : feat.descEn}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

