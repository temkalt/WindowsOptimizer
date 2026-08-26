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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#09090e] border border-[rgba(0,240,255,0.3)] rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col max-h-[80vh] overflow-hidden">
        {/* Terminal Header */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between bg-[#060609]">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-[#00f0ff]" />
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
            className="p-1.5 rounded-lg hover:bg-[#1c1c28] text-[#64748b] hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-[#cbd5e1] space-y-1.5 bg-[#050508]">
          {logs.length === 0 ? (
            <div className="text-[#64748b] italic">Инициализация команды...</div>
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
        <div className="p-4 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between bg-[#060609]">
          <div className="flex items-center gap-2 text-xs font-mono">
            {status === 'running' && <span className="text-[#00f0ff]">Выполнение процесса...</span>}
            {status === 'success' && (
              <span className="text-[#10b981] flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-4 h-4" /> Завершено успешно
              </span>
            )}
            {status === 'error' && (
              <span className="text-[#f43f5e] flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4" /> Завершено с предупреждением
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={isRunning}
            className="onyx-btn-secondary text-xs"
          >
            Закрыть окно
          </button>
        </div>
      </div>
    </div>
  );
};
