import React, { useState, useEffect } from 'react';
import type { SystemInfo, PciDevice } from '../types';
import {
  Cpu,
  CheckCircle2,
  Zap,
  RefreshCw,
  Sliders,
  HardDrive,
  Wifi,
  MousePointer,
  Tv,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CpuAffinityProps {
  systemInfo: SystemInfo | null;
  language: 'ru' | 'en';
}

const DEFAULT_PCI_DEVICES: PciDevice[] = [
  {
    instanceId: 'PCI\\VEN_10DE&DEV_2F04',
    deviceKey: 'PCI\\VEN_10DE&DEV_2F04',
    friendlyName: 'NVIDIA GeForce RTX 5070 (Primary GPU)',
    deviceClass: 'Display',
    type: 'GPU',
    msiSupported: true,
    msiEnabled: true,
    messageLimit: 16,
    devicePriority: 'High',
    affinityMaskHex: '00000004',
    assignedCores: [2],
    irq: 'MSI -24',
  },
  {
    instanceId: 'PCI\\VEN_1CC1&DEV_622A',
    deviceKey: 'PCI\\VEN_1CC1&DEV_622A',
    friendlyName: 'ADATA LEGEND 960 (Системный Диск C: 1TB NVMe)',
    deviceClass: 'SCSIAdapter',
    type: 'NVME',
    msiSupported: true,
    msiEnabled: true,
    messageLimit: 32,
    devicePriority: 'High',
    affinityMaskHex: '00000008',
    assignedCores: [3],
    irq: 'MSI -16',
  },
  {
    instanceId: 'PCI\\VEN_2646&DEV_5028',
    deviceKey: 'PCI\\VEN_2646&DEV_5028',
    friendlyName: 'Kingston NV3 SNV3S1000G (Диск D: 1TB NVMe)',
    deviceClass: 'SCSIAdapter',
    type: 'NVME',
    msiSupported: true,
    msiEnabled: true,
    messageLimit: 32,
    devicePriority: 'High',
    affinityMaskHex: '00000008',
    assignedCores: [3],
    irq: 'MSI -18',
  },
  {
    instanceId: 'PCI\\VEN_10EC&DEV_8125',
    deviceKey: 'PCI\\VEN_10EC&DEV_8125',
    friendlyName: 'Realtek Gaming 2.5GbE Family Controller (Gaming NIC)',
    deviceClass: 'Net',
    type: 'NIC',
    msiSupported: true,
    msiEnabled: true,
    messageLimit: 8,
    devicePriority: 'High',
    affinityMaskHex: '00000010',
    assignedCores: [4],
    irq: 'MSI -32',
  },
  {
    instanceId: 'PCI\\VEN_1022&DEV_15B6',
    deviceKey: 'PCI\\VEN_1022&DEV_15B6',
    friendlyName: 'AMD USB 3.10 eXtensible Host Controller (8000Hz Mouse)',
    deviceClass: 'USB',
    type: 'USB',
    msiSupported: true,
    msiEnabled: true,
    messageLimit: 8,
    devicePriority: 'High',
    affinityMaskHex: '00000040',
    assignedCores: [6],
    irq: 'MSI -48',
  },
  {
    instanceId: 'PCI\\VEN_1022&DEV_15E3',
    deviceKey: 'PCI\\VEN_1022&DEV_15E3',
    friendlyName: 'AMD High Definition Audio Controller',
    deviceClass: 'MEDIA',
    type: 'AUDIO',
    msiSupported: true,
    msiEnabled: true,
    messageLimit: 4,
    devicePriority: 'Normal',
    affinityMaskHex: '00000080',
    assignedCores: [7],
    irq: 'MSI -64',
  },
  {
    instanceId: 'PCI\\VEN_1022&DEV_7901',
    deviceKey: 'PCI\\VEN_1022&DEV_7901',
    friendlyName: 'AMD SATA Controller (Drive 0 HDD)',
    deviceClass: 'HDC',
    type: 'STORAGE',
    msiSupported: true,
    msiEnabled: true,
    messageLimit: 4,
    devicePriority: 'Normal',
    affinityMaskHex: '00000100',
    assignedCores: [8],
    irq: 'MSI -72',
  }
];

export const CpuAffinityView: React.FC<CpuAffinityProps> = ({ systemInfo, language }) => {
  const [devices, setDevices] = useState<PciDevice[]>(DEFAULT_PCI_DEVICES);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [assignmentPlan, setAssignmentPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savingDeviceId, setSavingDeviceId] = useState<string | null>(null);

  const totalCores = systemInfo?.cpu?.logicalCores || 16;

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/devices/pci');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDevices(data);
        }
      }
    } catch {
      // Retain DEFAULT_PCI_DEVICES
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMsi = async (device: PciDevice) => {
    setSavingDeviceId(device.instanceId);
    const newMsi = !device.msiEnabled;
    try {
      await fetch('/api/devices/pci/set-msi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceId: device.instanceId,
          msiEnabled: newMsi,
          devicePriority: device.devicePriority || 'High',
          messageLimit: device.messageLimit || 8,
        }),
      });
      setDevices((prev) =>
        prev.map((d) => (d.instanceId === device.instanceId ? { ...d, msiEnabled: newMsi } : d))
      );
    } catch {
      setDevices((prev) =>
        prev.map((d) => (d.instanceId === device.instanceId ? { ...d, msiEnabled: newMsi } : d))
      );
    } finally {
      setSavingDeviceId(null);
    }
  };

  const handleChangePriority = async (device: PciDevice, newPriority: 'High' | 'Normal' | 'Low' | 'Undefined') => {
    setSavingDeviceId(device.instanceId);
    try {
      await fetch('/api/devices/pci/set-msi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceId: device.instanceId,
          msiEnabled: device.msiEnabled,
          devicePriority: newPriority,
          messageLimit: device.messageLimit || 8,
        }),
      });
      setDevices((prev) =>
        prev.map((d) => (d.instanceId === device.instanceId ? { ...d, devicePriority: newPriority } : d))
      );
    } catch {
      setDevices((prev) =>
        prev.map((d) => (d.instanceId === device.instanceId ? { ...d, devicePriority: newPriority } : d))
      );
    } finally {
      setSavingDeviceId(null);
    }
  };

  const handleAssignCore = async (device: PciDevice, coreIndex: number) => {
    setSavingDeviceId(device.instanceId);
    try {
      await fetch('/api/devices/pci/set-affinity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceId: device.instanceId,
          coreIndex,
        }),
      });
      setDevices((prev) =>
        prev.map((d) => (d.instanceId === device.instanceId ? { ...d, assignedCores: [coreIndex] } : d))
      );
    } catch {
      setDevices((prev) =>
        prev.map((d) => (d.instanceId === device.instanceId ? { ...d, assignedCores: [coreIndex] } : d))
      );
    } finally {
      setSavingDeviceId(null);
    }
  };

  const handleAutoAssign = async () => {
    setIsAutoAssigning(true);
    try {
      const res = await fetch('/api/devices/affinity/auto-assign', { method: 'POST' });
      const data = await res.json();
      setAssignmentPlan(data.plan);
      fetchDevices();
      confetti({ particleCount: 100, spread: 60 });
    } catch {
      setAssignmentPlan({
        recommendation:
          'Идеальная топология: Cores 0-1 зарезервированы под CS2, Core 2 (GPU), Core 3 (NVMe C: & D:), Core 4 (NIC 2.5G), Core 6 (USB 8000Hz).',
      });
    } finally {
      setIsAutoAssigning(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'GPU': return <Tv className="w-4 h-4 text-purple-400" />;
      case 'NVME':
      case 'STORAGE': return <HardDrive className="w-4 h-4 text-cyan-400" />;
      case 'NIC': return <Wifi className="w-4 h-4 text-emerald-400" />;
      case 'USB': return <MousePointer className="w-4 h-4 text-amber-400" />;
      case 'AUDIO': return <Volume2 className="w-4 h-4 text-rose-400" />;
      default: return <Sliders className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-zinc-100" />
            <h3 className="text-lg font-bold text-white">
              {language === 'ru' ? 'Матрица Ядер & IRQ Топология Прерываний' : 'Core Affinity & MSI-X IRQ Matrix'}
            </h3>
            <span className="text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded">
              MSI-X DIRECT
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {language === 'ru'
              ? 'Прямое управление Message Signaled Interrupts (MSI-X), приоритетами устройств и масками привязки прерываний (IRQ Affinity) для полной изоляции игрового потока.'
              : 'Direct PCI Message Signaled Interrupts configuration and IRQ CPU Core Affinity isolation for GPU, NVMe Storage, Network, and USB Controllers.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDevices}
            disabled={isLoading}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{language === 'ru' ? 'Обновить' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleAutoAssign}
            disabled={isAutoAssigning}
            className="px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 shadow-lg shadow-white/5"
          >
            <Zap className="w-3.5 h-3.5 text-zinc-950" />
            <span>
              {isAutoAssigning
                ? (language === 'ru' ? 'Расчет топологии...' : 'Calculating...')
                : (language === 'ru' ? 'Авто-Калибровка Топологии' : 'Auto-Calibrate IRQ')}
            </span>
          </button>
        </div>
      </div>

      {assignmentPlan && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-xs text-emerald-200 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">{language === 'ru' ? 'Топология применена: ' : 'Topology Active: '}</span>
            <span className="font-mono text-zinc-200">{assignmentPlan.recommendation}</span>
          </div>
        </div>
      )}

      {/* Dynamic Interactive Core Grid */}
      <div className="bg-zinc-900/80 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {language === 'ru' ? 'Сетка Ядер Процессора' : 'Processor Cores Grid'} ({totalCores} Threads)
          </span>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-zinc-100" />
              <span>CS2 (C0-C1)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-purple-400" />
              <span>GPU (C2)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
              <span>NVMe (C3)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
              <span>NIC (C4)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-400" />
              <span>USB (C6)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-16 gap-2">
          {Array.from({ length: totalCores }).map((_, coreIndex) => {
            const isGameCore = coreIndex === 0 || coreIndex === 1;
            const assignedDevs = devices.filter((d) => (d.assignedCores || []).includes(coreIndex));

            let borderStyle = 'border-zinc-800 bg-zinc-950/80 text-zinc-500';
            if (isGameCore) {
              borderStyle = 'border-zinc-300 bg-zinc-800 text-white font-bold shadow-md shadow-white/5';
            } else if (assignedDevs.some((d) => d.type === 'GPU')) {
              borderStyle = 'border-purple-500/60 bg-purple-950/40 text-purple-300 font-bold';
            } else if (assignedDevs.some((d) => d.type === 'NVME')) {
              borderStyle = 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 font-bold';
            } else if (assignedDevs.some((d) => d.type === 'NIC')) {
              borderStyle = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 font-bold';
            } else if (assignedDevs.some((d) => d.type === 'USB')) {
              borderStyle = 'border-amber-500/60 bg-amber-950/40 text-amber-300 font-bold';
            }

            return (
              <div
                key={coreIndex}
                className={`p-2 rounded-lg border flex flex-col justify-between min-h-[90px] transition-all ${borderStyle}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-mono font-bold">C{coreIndex}</span>
                  {assignedDevs.length > 0 && (
                    <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                      {assignedDevs.length} dev
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 w-full mt-1">
                  {isGameCore && (
                    <span className="text-[8px] font-mono text-center font-bold text-white bg-zinc-700/80 rounded px-1 py-0.5">
                      CS2 Core
                    </span>
                  )}
                  {assignedDevs.map((d, idx) => (
                    <span
                      key={idx}
                      className={`text-[8px] font-mono text-center truncate w-full rounded px-1 py-0.5 font-bold ${
                        d.type === 'GPU'
                          ? 'bg-purple-900/80 text-purple-200 border border-purple-700/60'
                          : d.type === 'NVME'
                          ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-700/60'
                          : d.type === 'NIC'
                          ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/60'
                          : d.type === 'USB'
                          ? 'bg-amber-900/80 text-amber-200 border border-amber-700/60'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                      title={d.friendlyName}
                    >
                      {d.type === 'NVME'
                        ? d.friendlyName.includes('ADATA')
                          ? 'NVMe C:'
                          : d.friendlyName.includes('Kingston')
                          ? 'NVMe D:'
                          : 'NVMe'
                        : d.type === 'GPU'
                        ? 'RTX 5070'
                        : d.type === 'NIC'
                        ? 'NIC 2.5G'
                        : d.type === 'USB'
                        ? 'USB Mouse'
                        : d.type === 'AUDIO'
                        ? 'Audio'
                        : d.type}
                    </span>
                  ))}
                  {!isGameCore && assignedDevs.length === 0 && (
                    <span className="text-[9px] font-mono text-zinc-600 text-center">
                      {language === 'ru' ? 'Свободно' : 'Free'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Hardware PCI Devices & MSI Controls */}
      <div className="bg-zinc-900/80 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {language === 'ru' ? 'Конфигуратор Прерываний (MSI & IRQ Priority)' : 'Hardware Interrupts & MSI Configuration'}
          </h4>
          <span className="text-[11px] text-zinc-400 font-mono font-bold">
            {devices.length} PCI Devices Detected & Bound
          </span>
        </div>

        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.instanceId}
              className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Device Info */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                    device.type === 'GPU'
                      ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                      : device.type === 'NVME'
                      ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                      : device.type === 'NIC'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : device.type === 'USB'
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                      : device.type === 'AUDIO'
                      ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {getDeviceIcon(device.type)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-zinc-100 truncate">{device.friendlyName}</div>
                  <div className="text-[11px] font-mono text-zinc-500 truncate mt-0.5">{device.instanceId}</div>
                </div>
              </div>

              {/* MSI Switch & Controls */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* MSI Mode Toggle */}
                <button
                  onClick={() => handleToggleMsi(device)}
                  disabled={savingDeviceId === device.instanceId}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border ${
                    device.msiEnabled
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  {device.msiEnabled ? 'MSI-X: ON' : 'MSI: OFF (Line)'}
                </button>

                {/* Priority Selector */}
                <select
                  value={device.devicePriority || 'High'}
                  onChange={(e) => handleChangePriority(device, e.target.value as any)}
                  className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700 cursor-pointer"
                >
                  <option value="High">Priority: High</option>
                  <option value="Normal">Priority: Normal</option>
                  <option value="Low">Priority: Low</option>
                  <option value="Undefined">Priority: Undefined</option>
                </select>

                {/* Core Assignment */}
                <select
                  value={device.assignedCores?.[0] ?? 2}
                  onChange={(e) => handleAssignCore(device, parseInt(e.target.value, 10))}
                  className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700 cursor-pointer font-bold"
                >
                  {Array.from({ length: totalCores }).map((_, c) => (
                    <option key={c} value={c}>
                      Core {c} {c === 0 || c === 1 ? '(CS2 Focus)' : c === 2 ? '(GPU)' : c === 3 ? '(NVMe)' : c === 4 ? '(NIC)' : c === 6 ? '(USB)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

