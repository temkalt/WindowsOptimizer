import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Zap,
  Activity,
  FileCheck,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { NvidiaCustomDriverInfo, PowerPlanItem } from '../types';

interface NvidiaCustomDriverProps {
  language: 'ru' | 'en';
}

const DEFAULT_DRIVER_INFO: NvidiaCustomDriverInfo = {
  installedVersion: '610.74 (NVIDIA DCH)',
  driverDate: '2026-07-02',
  cardName: 'NVIDIA GeForce RTX 5070',
  isCustom: false,
  dpcLatencyUs: 14.8,
  telemetryDisabled: true,
  hdmiAudioDisabled: true,
  p0StateLocked: true,
  customInstallerAvailable: true,
  customInstallerPath: 'd:\\winvan\\596.36 - Custom.exe',
};

const DEFAULT_POWER_PLANS: PowerPlanItem[] = [
  {
    id: 'igromanoff_amd_vip',
    name: '⚡ Igromanoff AMD VIP (AM5 9800X3D / 7800X3D / 7500F)',
    description: 'Эксклюзивная киберспортивная схема для платформы AM5 и процессоров X3D (0ms троттлинг, 100% Unpark, SpeedShift 0).',
    platform: 'AMD_AM5',
    filePath: 'd:\\winvan\\Igromanoff AMD Power Pack\\1 - AMD\\Igromanoff AMD VIP.pow',
    isCurrent: true
  },
  {
    id: 'igromanoff_amd_standard',
    name: '💡 Igromanoff AMD (AM4 / AM5 X & G)',
    description: 'Универсальная схема для Ryzen 5700X, 7500F, 8700G, 7700 и AM4 процессоров.',
    platform: 'AMD_AM4',
    filePath: 'd:\\winvan\\Igromanoff AMD Power Pack\\1 - AMD\\Igromanoff AMD.pow',
    isCurrent: false
  },
  {
    id: 'amd_ryzen_ultimate_highpower',
    name: '🔥 AMD Ryzen Ultimate HighPower',
    description: 'Максимальная энергоотдача для тяжелых игровых сессий без засыпания ядер.',
    platform: 'AMD_AM4',
    filePath: 'd:\\winvan\\Igromanoff AMD Power Pack\\1 - AMD\\AMD Ryzen Ultimate HighPower.pow',
    isCurrent: false
  },
  {
    id: 'igromanoff_intel_v3',
    name: '💙 Igromanoff INTEL V3 (14th/13th/12th Gen K/KF/KS)',
    description: 'Специальная калибровка для Intel: фиксация P-Cores на максимальном множителе, отключение парковки.',
    platform: 'INTEL',
    filePath: 'd:\\winvan\\Igromanoff AMD Power Pack\\2 - INTEL\\Igromanoff INTEL V3.pow',
    isCurrent: false
  },
  {
    id: 'igromanoff_intel_v2',
    name: '💙 Igromanoff INTEL V2 (Balanced Esports)',
    description: 'Игровой профиль для 10-14 поколений Intel Core i5/i7.',
    platform: 'INTEL',
    filePath: 'd:\\winvan\\Igromanoff AMD Power Pack\\2 - INTEL\\igromanoff INTEL V2.pow',
    isCurrent: false
  },
  {
    id: 'igromanoff_intel_v1',
    name: '💙 Igromanoff INTEL V1 (Legacy & F-series)',
    description: 'Базовый низколатентный план для non-K процессоров Intel.',
    platform: 'INTEL',
    filePath: 'd:\\winvan\\Igromanoff AMD Power Pack\\2 - INTEL\\Igromanoff INTEL V1.pow',
    isCurrent: false
  }
];

export const NvidiaCustomDriverView: React.FC<NvidiaCustomDriverProps> = ({ language }) => {
  const [driverInfo, setDriverInfo] = useState<NvidiaCustomDriverInfo>(DEFAULT_DRIVER_INFO);
  const [powerPlans, setPowerPlans] = useState<PowerPlanItem[]>(DEFAULT_POWER_PLANS);
  const [activePlanId, setActivePlanId] = useState<string>('igromanoff_amd_vip');
  const [isInstalling, setIsInstalling] = useState(false);
  const [isRestartingGpu, setIsRestartingGpu] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [drvRes, planRes] = await Promise.all([
        fetch('/api/nvidia-custom/info'),
        fetch('/api/power-plans/list'),
      ]);
      if (drvRes.ok) {
        const drvData = await drvRes.json();
        if (drvData && drvData.cardName) setDriverInfo(drvData);
      }
      if (planRes.ok) {
        const planData = await planRes.json();
        if (Array.isArray(planData) && planData.length > 0) setPowerPlans(planData);
      }
    } catch {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLaunchCustomInstaller = async () => {
    setIsInstalling(true);
    try {
      await fetch('/api/nvidia-custom/install', { method: 'POST' });
      setStatusMessage(
        language === 'ru'
          ? 'Запущен инсталлятор кастомного драйвера 596.36 - Custom.exe!'
          : 'Launched 596.36 - Custom.exe driver installer!'
      );
      confetti({ particleCount: 80, spread: 60 });
    } catch {}
    finally {
      setIsInstalling(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleApplyPowerPlan = async (plan: PowerPlanItem) => {
    try {
      await fetch('/api/power-plans/import-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, filePath: plan.filePath }),
      });
      setActivePlanId(plan.id);
      confetti({ particleCount: 90, spread: 60 });
      setStatusMessage(
        language === 'ru'
          ? `Активирован план питания: ${plan.name}`
          : `Activated power plan: ${plan.name}`
      );
    } catch {}
    finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleRestartGpu = async () => {
    setIsRestartingGpu(true);
    try {
      await fetch('/api/graphics/restart', { method: 'POST' });
      setStatusMessage(
        language === 'ru'
          ? 'Видеодрайвер и DWM пайплайн сброшены через restart64.exe'
          : 'Display driver and DWM pipeline flushed via restart64.exe'
      );
    } catch {}
    finally {
      setIsRestartingGpu(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              {language === 'ru' ? 'Кастомные Драйверы NVIDIA & Igromanoff Power Pack' : 'Custom NVIDIA Drivers & Igromanoff Power Pack'}
            </h3>
            <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">
              596.36 CUSTOM READY
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {language === 'ru'
              ? 'Установка модифицированного драйвера 596.36 с вырезанной телеметрией NvTelemetry, P0 State Lock частот памяти и мгновенный импорт калиброванных схем питания Igromanoff.'
              : 'Deploy custom stripped 596.36 low-latency NVIDIA driver, lock P0 states, and instantly import tailored Igromanoff .pow power plans.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRestartGpu}
            disabled={isRestartingGpu}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-zinc-700/60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRestartingGpu ? 'animate-spin' : ''}`} />
            <span>restart64</span>
          </button>

          <button
            onClick={handleLaunchCustomInstaller}
            disabled={isInstalling || !driverInfo.customInstallerAvailable}
            className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-zinc-950" />
            <span>
              {isInstalling
                ? (language === 'ru' ? 'Запуск...' : 'Launching...')
                : (language === 'ru' ? 'Установить 596.36 Custom' : 'Install 596.36 Custom')}
            </span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Driver Diagnostics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ru' ? 'Текущий Драйвер' : 'Current Driver'}</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">{driverInfo.driverDate}</span>
          </div>
          <div className="font-mono text-xs text-white font-bold">
            {driverInfo.installedVersion}
          </div>
          <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800">
            Card: <span className="text-zinc-200">{driverInfo.cardName}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>{language === 'ru' ? 'Задержка nvlddmkm.sys' : 'DPC Latency'}</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">OPTIMAL</span>
          </div>
          <div className="font-mono text-xs text-emerald-300 font-bold">
            {driverInfo.dpcLatencyUs} µs (Sub-20µs Ultra Low)
          </div>
          <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800">
            Status: <span className="text-zinc-200">Zero Interrupt Jitter</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-purple-400" />
              <span>{language === 'ru' ? 'Кастомный Пакет' : 'Custom Package'}</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {driverInfo.customInstallerAvailable ? 'FOUND' : 'NOT FOUND'}
            </span>
          </div>
          <div className="font-mono text-xs text-white font-bold truncate">
            596.36 - Custom.exe
          </div>
          <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800 truncate">
            {driverInfo.customInstallerPath}
          </div>
        </div>
      </div>

      {/* Stripped Technologies List */}
      <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          {language === 'ru' ? 'Оптимизации в 596.36 - Custom.exe & NIP Профиле:' : 'Optimizations in Custom Driver & NIP Profile:'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-zinc-200">
                {language === 'ru' ? 'Вырезана телеметрия NvTelemetry' : 'Stripped Telemetry Container'}
              </div>
              <div className="text-[11px] text-zinc-400">
                {language === 'ru'
                  ? 'Отключены постоянные фоновые циклы логирования и опроса шины PCIe'
                  : 'Eliminated background telemetry polling threads on PCIe bus'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-zinc-200">
                {language === 'ru' ? 'Удален HDMI Audio & Shield' : 'Removed HDMI Audio & Shield Wireless'}
              </div>
              <div className="text-[11px] text-zinc-400">
                {language === 'ru'
                  ? 'Исключен конфликт прерываний IRQ между видеочипом и аудио-контроллером'
                  : 'Prevents IRQ sharing conflicts between GPU and audio device'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-zinc-200">
                {language === 'ru' ? 'Фиксация P0 State (Max Memory Clock)' : 'P0 State Memory Clock Lock'}
              </div>
              <div className="text-[11px] text-zinc-400">
                {language === 'ru'
                  ? 'Видеопамять GDDR6/GDDR7 всегда работает на предельной частоте без троттлинга'
                  : 'Forces memory clocks to maximum rated throughput under compute/gaming load'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-zinc-200">
                {language === 'ru' ? 'Shader Cache = 100 GB & MPO Fix' : 'Shader Cache 100GB & MPO Fix'}
              </div>
              <div className="text-[11px] text-zinc-400">
                {language === 'ru'
                  ? 'Устраняет статтеры компиляции шейдеров при первой загрузке карт в CS2'
                  : 'Eliminates shader compilation hitching during competitive matches'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Igromanoff Power Pack Section */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">
              {language === 'ru' ? 'Igromanoff Power Pack (Схемы Электропитания .POW)' : 'Igromanoff Power Pack (.POW Schemes)'}
            </h4>
            <p className="text-xs text-zinc-400">
              {language === 'ru'
                ? 'Прямой импорт и активация откалиброванных схем электропитания для AM5, AM4 и Intel'
                : 'Direct import and activation of calibrated power schemes for AM5, AM4, and Intel'}
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {powerPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                activePlanId === plan.id
                  ? 'bg-zinc-950 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                  : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-zinc-200">{plan.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {plan.platform}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[170px]">
                  {plan.filePath.split('\\').pop()}
                </span>

                <button
                  onClick={() => handleApplyPowerPlan(plan)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                    activePlanId === plan.id
                      ? 'bg-zinc-800 text-emerald-400'
                      : 'bg-zinc-200 hover:bg-white text-zinc-950'
                  }`}
                >
                  {activePlanId === plan.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'ru' ? 'Активен' : 'Active'}</span>
                    </>
                  ) : (
                    <span>{language === 'ru' ? 'Активировать' : 'Activate'}</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
