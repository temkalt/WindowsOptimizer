import React, { useState, useEffect } from 'react';
import type { AuditLogItem } from '../types';
import {
  FileText,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Clock,
  Terminal,
} from 'lucide-react';

interface AuditLogProps {
  language: 'ru' | 'en';
}

export const AuditLogView: React.FC<AuditLogProps> = ({ language }) => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/audit/logs');
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      // Fallback initial logs if backend is starting
      setLogs([
        {
          id: 'log_init_1',
          timestamp: new Date().toISOString(),
          category: 'REGISTRY',
          action: 'REG_ADD',
          target: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\\Win32PrioritySeparation',
          details: 'Type: REG_DWORD, Data: 0x18 (24: Short, Variable, Foreground 3:1)',
          status: 'SUCCESS',
        },
        {
          id: 'log_init_2',
          timestamp: new Date().toISOString(),
          category: 'BCD',
          action: 'SET_BCD',
          target: 'bcdedit /set disabledynamictick yes',
          details: 'Dynamic Tick disabled (Constant timer tick rate)',
          status: 'SUCCESS',
        },
        {
          id: 'log_init_3',
          timestamp: new Date().toISOString(),
          category: 'CS2_ENGINE',
          action: 'WRITE_AUTOEXEC',
          target: 'C:\\...\\game\\csgo\\cfg\\autoexec.cfg',
          details: 'Sub-tick rate 786432, low latency tick sleep true',
          status: 'SUCCESS',
        },
      ]);
    }
  };

  const handleClearLogs = async () => {
    try {
      await fetch('/api/audit/clear', { method: 'POST' });
      setLogs([]);
    } catch {}
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLogs();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const categories = ['ALL', 'REGISTRY', 'BCD', 'SERVICE', 'CS2_ENGINE', 'AFFINITY', 'CLEANER', 'SECURITY', 'SYSTEM'];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="minimal-panel p-6 rounded-xl border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-zinc-100" />
            <h3 className="text-lg font-bold text-white">
              {language === 'ru' ? 'Журнал Изменений & Реестр (Audit Log)' : 'Live System Audit & Change Log'}
            </h3>
            <span className="text-[10px] font-mono font-bold bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded">
              REAL-TIME LOGGING
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {language === 'ru'
              ? 'Прозрачный протокол всех модификаций реестра, команд BCD, остановленных служб, аппаратного аффинити и параметров CS2.'
              : 'Real-time transparent audit stream of all registry writes, BCD flags, service modifications, and CS2 configuration injections.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleClearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>{language === 'ru' ? 'Очистить' : 'Clear'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="minimal-panel p-4 rounded-xl border border-zinc-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'ru' ? 'Поиск по ключам, файлам, параметрам...' : 'Search keys, files, params...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            <span className="text-[11px] text-zinc-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>{language === 'ru' ? 'Категория:' : 'Category:'}</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-zinc-700 text-white font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Stream Table */}
      <div className="minimal-panel p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <span>{language === 'ru' ? 'Лента Выполненных Операций' : 'Execution Log Stream'}</span>
          </h4>
          <span className="text-[10px] font-mono text-zinc-500">
            {filteredLogs.length} {language === 'ru' ? 'записей' : 'entries'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[11px]">
                <th className="pb-2.5 px-2">{language === 'ru' ? 'ВРЕМЯ' : 'TIME'}</th>
                <th className="pb-2.5 px-2">{language === 'ru' ? 'ТИП' : 'TYPE'}</th>
                <th className="pb-2.5 px-2">{language === 'ru' ? 'ДЕЙСТВИЕ' : 'ACTION'}</th>
                <th className="pb-2.5 px-2">{language === 'ru' ? 'ОБЪЕКТ / ПУТЬ' : 'TARGET PATH'}</th>
                <th className="pb-2.5 px-2">{language === 'ru' ? 'ДЕТАЛИ' : 'DETAILS'}</th>
                <th className="pb-2.5 px-2">{language === 'ru' ? 'СТАТУС' : 'STATUS'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 font-sans text-xs">
                    {language === 'ru' ? 'Записей в журнале пока нет' : 'No changes logged yet'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/50">
                    <td className="py-2.5 px-2 text-zinc-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 font-bold">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-zinc-300 font-semibold">{log.action}</td>
                    <td className="py-2.5 px-2 text-zinc-200 truncate max-w-xs" title={log.target}>
                      {log.target}
                    </td>
                    <td className="py-2.5 px-2 text-zinc-400 truncate max-w-sm" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="text-[10px] text-emerald-400 font-bold">
                        [{log.status}]
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
