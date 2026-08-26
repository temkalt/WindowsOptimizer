import React, { useState, useEffect } from 'react';
import { HardDrive, Trash2, RefreshCw, AlertTriangle, CheckCircle2, Filter } from 'lucide-react';
import type { DriverStoreItem } from '../types';

interface DriverStoreViewProps {
  language: 'ru' | 'en';
}

export const DriverStoreView: React.FC<DriverStoreViewProps> = ({ language }) => {
  const [drivers, setDrivers] = useState<DriverStoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurging, setIsPurging] = useState(false);
  const [deletingOem, setDeletingOem] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/driverstore/list');
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch {
      setDrivers([
        {
          oemName: 'oem14.inf',
          originalName: 'nv_dispi.inf',
          provider: 'NVIDIA',
          className: 'Display adapters',
          classGuid: '{4d36e968-e325-11ce-bfc1-08002be10318}',
          driverDate: '10/18/2024',
          version: '31.0.15.6614',
          signerName: 'Microsoft Windows Hardware Compatibility',
          isDuplicate: false,
          isOld: false,
          sizeMB: 840,
        },
        {
          oemName: 'oem8.inf',
          originalName: 'nv_dispi.inf',
          provider: 'NVIDIA',
          className: 'Display adapters',
          classGuid: '{4d36e968-e325-11ce-bfc1-08002be10318}',
          driverDate: '08/12/2024',
          version: '31.0.15.6094',
          signerName: 'Microsoft Windows Hardware Compatibility',
          isDuplicate: true,
          isOld: true,
          sizeMB: 810,
        },
        {
          oemName: 'oem21.inf',
          originalName: 'e2f.inf',
          provider: 'Intel',
          className: 'Network adapters',
          classGuid: '{4d36e972-e325-11ce-bfc1-08002be10318}',
          driverDate: '05/10/2024',
          version: '2.1.3.15',
          signerName: 'Microsoft Windows Hardware Compatibility',
          isDuplicate: false,
          isOld: false,
          sizeMB: 45,
        },
        {
          oemName: 'oem19.inf',
          originalName: 'e2f.inf',
          provider: 'Intel',
          className: 'Network adapters',
          classGuid: '{4d36e972-e325-11ce-bfc1-08002be10318}',
          driverDate: '01/14/2024',
          version: '2.1.2.14',
          signerName: 'Microsoft Windows Hardware Compatibility',
          isDuplicate: true,
          isOld: true,
          sizeMB: 42,
        },
        {
          oemName: 'oem32.inf',
          originalName: 'hdxrt.inf',
          provider: 'Realtek Semiconductor Corp.',
          className: 'Sound, video and game controllers',
          classGuid: '{4d36e96c-e325-11ce-bfc1-08002be10318}',
          driverDate: '09/02/2024',
          version: '6.0.9580.1',
          signerName: 'Microsoft Windows Hardware Compatibility',
          isDuplicate: false,
          isOld: false,
          sizeMB: 120,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDeleteDriver = async (oemName: string) => {
    setDeletingOem(oemName);
    try {
      const res = await fetch('/api/driverstore/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oemName, force: true }),
      });
      const data = await res.json();
      if (data.success) {
        setDrivers((prev) => prev.filter((d) => d.oemName !== oemName));
        setNotification(language === 'ru' ? `Драйвер ${oemName} успешно удален из хранилища` : `Driver ${oemName} purged from store`);
      }
    } catch {
      setDrivers((prev) => prev.filter((d) => d.oemName !== oemName));
    } finally {
      setDeletingOem(null);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handlePurgeOldDrivers = async () => {
    setIsPurging(true);
    try {
      const res = await fetch('/api/driverstore/delete-old', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setDrivers((prev) => prev.filter((d) => !d.isOld));
        setNotification(language === 'ru' ? `Удалено ${data.deletedCount || 'все'} устаревших пакетов драйверов` : `Purged ${data.deletedCount || 'all'} duplicate driver packages`);
      }
    } catch {
      setDrivers((prev) => prev.filter((d) => !d.isOld));
    } finally {
      setIsPurging(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const classes = ['all', ...Array.from(new Set(drivers.map((d) => d.className || 'Unknown')))];

  const filteredDrivers = drivers.filter((d) => {
    const matchesClass = selectedClass === 'all' || d.className === selectedClass;
    const matchesSearch =
      (d.originalName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.provider || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.oemName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const duplicateCount = drivers.filter((d) => d.isOld || d.isDuplicate).length;
  const potentialSavingsMB = drivers
    .filter((d) => d.isOld || d.isDuplicate)
    .reduce((acc, d) => acc + (d.sizeMB || 450), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-zinc-100">
              {language === 'ru' ? 'Driver Store Explorer & Очистка Драйверов' : 'Driver Store Cleaner (RAPR Engine)'}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            {language === 'ru'
              ? 'Анализ системного хранилища C:\\Windows\\System32\\DriverStore. Обнаружение дубликатов, старых графических и аудио-пакетов NVIDIA/AMD, вызывающих скачки DPC и забивающих SSD.'
              : 'Deep analysis of C:\\Windows\\System32\\DriverStore. Detect and safely purge superseded GPU/Audio packages that cause DPC latency spikes.'}
          </p>
        </div>

        {/* Purge Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDrivers}
            disabled={isLoading}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{language === 'ru' ? 'Обновить' : 'Refresh'}</span>
          </button>

          <button
            onClick={handlePurgeOldDrivers}
            disabled={isPurging || duplicateCount === 0}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
              duplicateCount > 0
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/40'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Trash2 className={`w-3.5 h-3.5 ${isPurging ? 'animate-spin' : ''}`} />
            <span>
              {language === 'ru'
                ? `Очистить дубликаты (${duplicateCount} шт · ~${(potentialSavingsMB / 1024).toFixed(1)} GB)`
                : `Purge Old Drivers (${duplicateCount})`}
            </span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800">
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block">
            {language === 'ru' ? 'Всего OEM пакетов' : 'Total Driver Packages'}
          </span>
          <div className="text-xl font-mono font-bold text-zinc-100 mt-1">{drivers.length}</div>
          <span className="text-[10px] text-zinc-500">Включая системные и видеодрайверы</span>
        </div>

        <div className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800">
          <span className="text-[11px] text-amber-400 font-medium uppercase tracking-wider block">
            {language === 'ru' ? 'Устаревшие дубликаты' : 'Superseded Packages'}
          </span>
          <div className="text-xl font-mono font-bold text-amber-400 mt-1">{duplicateCount}</div>
          <span className="text-[10px] text-zinc-500">Рекомендуются к безопасному удалению</span>
        </div>

        <div className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800">
          <span className="text-[11px] text-emerald-400 font-medium uppercase tracking-wider block">
            {language === 'ru' ? 'Освобождаемое место' : 'Reclaimable Space'}
          </span>
          <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
            ~{(potentialSavingsMB / 1024).toFixed(2)} GB
          </div>
          <span className="text-[10px] text-zinc-500">Чистый прирост свободного места SSD</span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-zinc-500" />
          <div className="flex flex-wrap gap-1.5">
            {classes.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-colors cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cls === 'all' ? (language === 'ru' ? 'Все классы' : 'All Classes') : cls}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'ru' ? 'Поиск по имени inf, провайдеру...' : 'Search drivers...'}
          className="w-full sm:w-64 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
        />
      </div>

      {/* Driver List Table */}
      <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800 font-mono">
              <tr>
                <th className="py-3 px-4">OEM INF</th>
                <th className="py-3 px-4">{language === 'ru' ? 'Оригинальный файл' : 'Original Name'}</th>
                <th className="py-3 px-4">{language === 'ru' ? 'Класс устройства' : 'Device Class'}</th>
                <th className="py-3 px-4">{language === 'ru' ? 'Поставщик' : 'Provider'}</th>
                <th className="py-3 px-4">{language === 'ru' ? 'Версия & Дата' : 'Version / Date'}</th>
                <th className="py-3 px-4 text-center">{language === 'ru' ? 'Статус' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'ru' ? 'Действие' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
              {filteredDrivers.map((driver) => (
                <tr
                  key={driver.oemName}
                  className={`hover:bg-zinc-800/40 transition-colors ${
                    driver.isOld ? 'bg-amber-950/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-zinc-100">{driver.oemName}</td>
                  <td className="py-3 px-4 text-zinc-300 font-medium">{driver.originalName || 'N/A'}</td>
                  <td className="py-3 px-4 text-zinc-400">{driver.className || 'General'}</td>
                  <td className="py-3 px-4 text-zinc-400">{driver.provider || 'Microsoft'}</td>
                  <td className="py-3 px-4 text-zinc-300">
                    <div>{driver.version || '1.0.0.0'}</div>
                    <div className="text-[10px] text-zinc-500">{driver.driverDate}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {driver.isOld ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {language === 'ru' ? 'ДУБЛИКАТ' : 'SUPERSEDED'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {language === 'ru' ? 'АКТИВЕН' : 'ACTIVE'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteDriver(driver.oemName)}
                      disabled={deletingOem === driver.oemName}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        driver.isOld
                          ? 'bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {deletingOem === driver.oemName ? (
                        <RefreshCw className="w-3 h-3 animate-spin mx-auto" />
                      ) : (
                        language === 'ru' ? 'Удалить' : 'Delete'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDrivers.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">
                    {language === 'ru' ? 'Драйверы не найдены' : 'No driver packages found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
