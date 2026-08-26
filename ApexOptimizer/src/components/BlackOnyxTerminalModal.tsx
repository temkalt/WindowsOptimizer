import React, { useEffect, useRef } from 'react';
import { Terminal, X, CheckCircle, AlertCircle } from 'lucide-react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  logs: string[];
  isRunning: boolean;
  status: 'idle' | 'running' | 'success' | 'error';
}

export const BlackOnyxTerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  title,
  logs,
  isRunning,
  status
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#000000] border border-[#222222] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[80vh] overflow-hidden">
        {/* Terminal Header */}
        <div className="p-3.5 border-b border-[#141414] flex items-center justify-between bg-[#040404]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="font-mono text-xs font-semibold text-white">
              {title || 'Командный терминал Windows'}
            </span>
            {isRunning && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={isRunning}
            className="p-1 rounded-md hover:bg-[#121212] text-[#52525b] hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-[#d4d4d8] space-y-1 bg-[#000000]">
          {logs.length === 0 ? (
            <div className="text-[#52525b] italic">Инициализация команды...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="leading-relaxed whitespace-pre-wrap">
                {log.startsWith('[+]') ? (
                  <span className="text-[#10b981]">{log}</span>
                ) : log.startsWith('[*]') ? (
                  <span className="text-[#38bdf8]">{log}</span>
                ) : log.startsWith('[!]') || log.includes('ОШИБКА') ? (
                  <span className="text-[#f43f5e]">{log}</span>
                ) : log.startsWith('[УСПЕХ]') ? (
                  <span className="text-[#00f0ff] font-bold">{log}</span>
                ) : (
                  <span>{log}</span>
                )}
              </div>
            ))
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Footer */}
        <div className="p-3.5 border-t border-[#141414] flex items-center justify-between bg-[#040404]">
          <div className="flex items-center gap-2 text-xs font-mono">
            {status === 'running' && <span className="text-[#00f0ff]">Выполнение процесса...</span>}
            {status === 'success' && (
              <span className="text-[#10b981] flex items-center gap-1 font-bold text-xs">
                <CheckCircle className="w-3.5 h-3.5" /> Завершено успешно
              </span>
            )}
            {status === 'error' && (
              <span className="text-[#f43f5e] flex items-center gap-1 font-bold text-xs">
                <AlertCircle className="w-3.5 h-3.5" /> Завершено с предупреждением
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={isRunning}
            className="px-3 py-1 rounded-md bg-[#0a0a0a] border border-[#222222] hover:border-[#444444] text-white text-xs font-semibold"
          >
            Закрыть окно
          </button>
        </div>
      </div>
    </div>
  );
};
