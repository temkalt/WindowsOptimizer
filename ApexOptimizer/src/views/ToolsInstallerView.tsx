import React, { useState } from 'react';
import {
  DownloadCloud,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToolsInstallerProps {
  language: 'ru' | 'en';
}

export const ToolsInstallerView: React.FC<ToolsInstallerProps> = ({ language }) => {
  const [installingIds, setInstallingIds] = useState<Record<string, boolean>>({});
  const [installedIds, setInstalledIds] = useState<Record<string, boolean>>({});

  const utilities = [
    {
      id: 'vcredist',
      name: 'Visual C++ Redistributable All-in-One (2005–2022)',
      category: 'Runtimes',
      descRu: 'Необходим для работы всех 3D игр и исключения ошибок MSVCP140.dll.',
      descEn: 'Required for all modern 3D games to prevent missing runtime DLL crashes.',
      size: '38 MB',
    },
    {
      id: 'directx',
      name: 'DirectX End-User Runtimes (Legacy Pack)',
      category: 'Runtimes',
      descRu: 'Полный набор библиотек d3dx9_43.dll, XAudio и DirectInput.',
      descEn: 'Complete legacy package with d3dx9, XAudio, and DirectInput libraries.',
      size: '95 MB',
    },
    {
      id: 'cru',
      name: 'Custom Resolution Utility (CRU 1.5.2 & restart64)',
      category: 'Display',
      descRu: 'Разгон герцовки монитора, калибровка частоты развертки, сброс видеодрайвера без ребута.',
      descEn: 'Monitor refresh rate overclocking and display extension block optimizer.',
      size: '1.2 MB',
    },
    {
      id: 'memreduct',
      name: 'MemReduct RAM Standby Purger (LLC Pack 18)',
      category: 'Memory',
      descRu: 'Очистка рабочей памяти, системного кэша и Standby List в реальном времени.',
      descEn: 'Instant Working Set and Standby List cache purge.',
      size: '1.5 MB',
    },
    {
      id: 'islc',
      name: 'Intelligent Standby List Cleaner (ISLC v1.0.3)',
      category: 'Memory',
      descRu: 'Фиксация таймера 0.5000ms и автоматический сброс кэша памяти при играх.',
      descEn: '0.5000ms timer lock and automated standby list memory manager.',
      size: '2.1 MB',
    },
    {
      id: 'processlasso',
      name: 'Process Lasso (Bitsum Highest Performance)',
      category: 'CPU',
      descRu: 'Аппаратная изоляция ядер, ProBalance, запрет троттлинга и авто-приоритеты.',
      descEn: 'CPU core affinity automation, ProBalance, and process rules.',
      size: '6.8 MB',
    },
    {
      id: 'msi_utility',
      name: 'MSI Utility v3 (Message Signaled Interrupts)',
      category: 'System',
      descRu: 'Включение MSI-X режима и высокого приоритета прерываний для GPU и периферии.',
      descEn: 'PCI Express MSI-X mode and interrupt priority manager.',
      size: '0.8 MB',
    },
    {
      id: 'nvcleanstall',
      name: 'TechPowerUp NVCleanstall (LLC Pack 18)',
      category: 'GPU',
      descRu: 'Установка чистых видеодрайверов NVIDIA без телеметрии, Shield и оверхеда.',
      descEn: 'Clean bloat-free NVIDIA driver installer generator.',
      size: '3.4 MB',
    },
    {
      id: 'hidusbf',
      name: 'HIDUSBF Mouse & Keyboard Polling Overclocker',
      category: 'HID',
      descRu: 'Разгон частоты опроса портов мыши до 1000/2000/4000/8000 Hz.',
      descEn: 'USB polling rate overclocker for high-rate gaming mice.',
      size: '0.5 MB',
    },
    {
      id: 'tm5',
      name: 'TestMem5 v0.12 (X3D & anta777 configs)',
      category: 'Stress',
      descRu: 'Стресс-тест оперативной памяти DDR4/DDR5 с профилями 1usmus_v3 и Universal X3D.',
      descEn: 'DDR4/DDR5 memory stability stress test with tuned profiles.',
      size: '4.2 MB',
    },
    {
      id: 'ddu',
      name: 'Display Driver Uninstaller (DDU 18.0.7)',
      category: 'GPU',
      descRu: 'Глубокая очистка остатков старых видеодрайверов NVIDIA, AMD и Intel.',
      descEn: 'Deep driver uninstaller removing registry leftovers before clean installs.',
      size: '4.5 MB',
    },
    {
      id: '7zip',
      name: '7-Zip 64-bit Ultra Compression (VanDayStuff11)',
      category: 'Apps',
      descRu: 'Высокопроизводительный архиватор для быстрой распаковки игровых кэшей.',
      descEn: 'High performance file archiver.',
      size: '1.8 MB',
    },
    {
      id: 'everything',
      name: 'Everything Instant File Search (Voidtools)',
      category: 'Apps',
      descRu: 'Мгновенный поиск файлов в NTFS таблице без создания фонового индексатора Windows.',
      descEn: 'Instant NTFS file search without background indexing lag.',
      size: '1.8 MB',
    },
    {
      id: 'teamspeak',
      name: 'TeamSpeak 3 Client (Low-Latency Voice)',
      category: 'Apps',
      descRu: 'Минимальный оверхед по оперативной памяти и CPU по сравнению с тяжелым Discord.',
      descEn: 'Ultra low latency voice chat with minimal CPU/RAM footprint.',
      size: '113 MB',
    },
    {
      id: 'notepadplus',
      name: 'Notepad++ 64-bit (Config Editor)',
      category: 'Apps',
      descRu: 'Редактор для мгновенной правки autoexec.cfg, gameinfo.gi и скриптов.',
      descEn: 'Fast text and code editor for autoexec and engine configurations.',
      size: '4.8 MB',
    },
    {
      id: 'occt',
      name: 'OCCT 12 (GPU / CPU / Power Stress Test)',
      category: 'Stress',
      descRu: 'Проверка стабильности Curve Optimizer, частот памяти и стабильности блока питания.',
      descEn: 'Comprehensive hardware stress test for stability verification.',
      size: '201 MB',
    },
    {
      id: 'hwinfo',
      name: 'HWiNFO64 Pro (Hardware Sensor Monitor)',
      category: 'Monitoring',
      descRu: 'Мониторинг температур CCD, напряжений SOC/VDD, эффективных частот и троттлинга.',
      descEn: 'Deep hardware sensor monitoring for temperatures, clocks, and power draw.',
      size: '12 MB',
    },
  ];

  const handleInstall = async (id: string) => {
    setInstallingIds((prev) => ({ ...prev, [id]: true }));
    try {
      await fetch('/api/tools/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setInstalledIds((prev) => ({ ...prev, [id]: true }));
      confetti({ particleCount: 80, spread: 50 });
    } catch {}
    finally {
      setInstallingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="minimal-panel p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <DownloadCloud className="w-4 h-4 text-zinc-200" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'ru' ? 'Центр Установки Геймерского Софта' : 'Gamer Utilities & Runtime Center'}
            </h3>
            <p className="text-xs text-zinc-400">
              {language === 'ru'
                ? 'Пакетная тихая установка системных библиотек и профессиональных утилит'
                : 'Clean silent installer for essential gaming runtimes and tuning tools'}
            </p>
          </div>
        </div>
      </div>

      {/* Utilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {utilities.map((tool) => {
          const isInstalling = installingIds[tool.id];
          const isInstalled = installedIds[tool.id];

          return (
            <div
              key={tool.id}
              className="minimal-card p-4 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h4 className="text-xs font-bold text-zinc-200 leading-snug">
                    {tool.name}
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                    {tool.size}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                  {language === 'ru' ? tool.descRu : tool.descEn}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  {tool.category}
                </span>

                <button
                  onClick={() => handleInstall(tool.id)}
                  disabled={isInstalling || isInstalled}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-70 ${
                    isInstalled
                      ? 'bg-zinc-800 text-emerald-400'
                      : isInstalling
                      ? 'bg-zinc-800 text-zinc-300'
                      : 'bg-zinc-200 hover:bg-white text-zinc-950 font-bold'
                  }`}
                >
                  {isInstalled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'ru' ? 'Установлено' : 'Installed'}</span>
                    </>
                  ) : isInstalling ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>{language === 'ru' ? 'Установка...' : 'Installing...'}</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>{language === 'ru' ? 'Тихая установка' : 'Silent Install'}</span>
                    </>
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
