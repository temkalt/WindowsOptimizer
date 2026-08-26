import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuidedWizardProps {
  language: 'ru' | 'en';
  onApplyCustomConfig: (tweakIds: string[]) => void;
  onFinish: () => void;
}

interface Question {
  id: string;
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
  impactRu: string;
  impactEn: string;
  tweakIds: string[];
}

export const GuidedWizardView: React.FC<GuidedWizardProps> = ({
  language,
  onApplyCustomConfig,
  onFinish,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const questions: Question[] = [
    {
      id: 'telemetry',
      titleRu: 'Отключить фоновую телеметрию и сбор данных Windows?',
      titleEn: 'Disable Windows Background Telemetry & CEIP?',
      descRu: 'Блокирует отправку отчетов в Microsoft, отключает DiagTrack и освобождает ресурсы CPU.',
      descEn: 'Stops DiagTrack and background reporting services, saving CPU cycles.',
      impactRu: 'Рекомендуется для всех ПК (0% рисков, чистый фон)',
      impactEn: 'Recommended for all PCs (0% risk, clean background)',
      tweakIds: ['disable_telemetry', 'svchost_split_threshold'],
    },
    {
      id: 'timers',
      titleRu: 'Оптимизировать BCD таймеры ядра под 0.5000 ms?',
      titleEn: 'Optimize BCD Kernel Timers to 0.5000 ms?',
      descRu: 'Отключает Dynamic Tick, включает Platform Tick и удаляет медленный оверхед HPET.',
      descEn: 'Disables dynamic tick power saving and binds timers to high-speed TSC counter.',
      impactRu: 'Устраняет скачки времени кадра (Frametime Jitter) в соревновательных играх',
      impactEn: 'Eliminates frametime jitter in competitive esports titles',
      tweakIds: ['bcd_disable_dynamic_tick', 'bcd_use_platform_tick', 'bcd_delete_hpet_clock', 'serialize_timer_expiration'],
    },
    {
      id: 'gpu',
      titleRu: 'Заблокировать максимальные частоты видеокарты (P0 State & MPO Fix)?',
      titleEn: 'Lock Maximum GPU Clocks (P0 State & MPO Fix)?',
      descRu: 'Фиксирует P0 состояние видеопамяти NVIDIA, отключает MPO и шифрование HDCP.',
      descEn: 'Locks P0 performance state on NVIDIA GPUs, disables MPO and HDCP overhead.',
      impactRu: '+3-8% стабильность частот памяти, устранение мерцания монитора',
      impactEn: '+3-8% memory clock consistency, eliminates windowed stutter',
      tweakIds: ['gpu_pstate_lock', 'gpu_disable_hdcp', 'gpu_mpo_fix', 'gpu_fse_honor'],
    },
    {
      id: 'network',
      titleRu: 'Настроить сетевой стек под нулевую буферизацию (TCPNoDelay & IntMod=0)?',
      titleEn: 'Tune Network Stack for Zero Buffer Delay (TCPNoDelay & IntMod=0)?',
      descRu: 'Отключает алгоритм Nagle и модерацию прерываний сетевой карты для мгновенной регистрации пакетов.',
      descEn: 'Disables Nagle packet buffering and NIC interrupt moderation for Sub-Tick HitReg.',
      impactRu: '-5-25 мс к стабильности пинга, мгновенный регистратор попаданий',
      impactEn: '-5-25ms ping jitter reduction, instant hit registration',
      tweakIds: ['net_tcp_nodelay', 'net_adapter_full_matrix'],
    },
    {
      id: 'hid',
      titleRu: 'Оптимизировать очереди мыши и клавиатуры (16/20 QueueSize)?',
      titleEn: 'Optimize Mouse & Keyboard Input Queues (16/20 QueueSize)?',
      descRu: 'Сокращает задержку передачи координат мыши и нажатий клавиш в игру.',
      descEn: 'Reduces mouclass/kbdclass buffer depth for direct 1:1 input responsiveness.',
      impactRu: 'Более резкий и отзывчивый прицел',
      impactEn: 'Sharper, crisper cursor response in shooters',
      tweakIds: ['hid_queue_sizes', 'hid_raw_mouse_curves'],
    },
    {
      id: 'services',
      titleRu: 'Отключить 70+ неиспользуемых фоновых служб Windows?',
      titleEn: 'Purge 70+ Non-Essential Background Services?',
      descRu: 'Отключает диспетчер печати, биометрию, карты, факс, удаленный рабочий стол и датчики.',
      descEn: 'Disables print spooler, biometrics, maps, fax, remote desktop, and sensors.',
      impactRu: 'Освобождает до 2.5 ГБ RAM и снижает количество переключений контекста CPU',
      impactEn: 'Frees up to 2.5 GB RAM and reduces CPU context switching',
      tweakIds: ['mass_services_purge', 'mem_disable_paging_executive'],
    },
  ];

  const currentQ = questions[currentStep];

  const handleAnswer = (val: boolean) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishWizard({ ...answers, [currentQ.id]: val });
    }
  };

  const finishWizard = (finalAnswers: Record<string, boolean>) => {
    const selectedTweakIds: string[] = [];
    questions.forEach((q) => {
      if (finalAnswers[q.id] !== false) {
        selectedTweakIds.push(...q.tweakIds);
      }
    });

    onApplyCustomConfig(selectedTweakIds);
    confetti({ particleCount: 100, spread: 60 });
    onFinish();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
        <span>{language === 'ru' ? 'МАСТЕР НАСТРОЙКИ' : 'GUIDED SETUP WIZARD'}</span>
        <span>
          {currentStep + 1} / {questions.length}
        </span>
      </div>

      <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden border border-zinc-800">
        <div
          className="h-full bg-zinc-200 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="minimal-panel p-6 rounded-xl border border-zinc-800 space-y-5">
        <div className="flex items-center gap-2 text-zinc-400">
          <Sliders className="w-4 h-4 text-zinc-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider">
            {language === 'ru' ? 'ШАГ' : 'STEP'} {currentStep + 1}
          </span>
        </div>

        <h3 className="text-base font-bold text-white leading-snug">
          {language === 'ru' ? currentQ.titleRu : currentQ.titleEn}
        </h3>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {language === 'ru' ? currentQ.descRu : currentQ.descEn}
        </p>

        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{language === 'ru' ? currentQ.impactRu : currentQ.impactEn}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-colors cursor-pointer"
          >
            {language === 'ru' ? 'Да, применить (Рекомендуется)' : 'Yes, apply (Recommended)'}
          </button>

          <button
            onClick={() => handleAnswer(false)}
            className="py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold border border-zinc-800 transition-colors cursor-pointer"
          >
            {language === 'ru' ? 'Пропустить' : 'Skip'}
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-30 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'ru' ? 'Назад' : 'Back'}</span>
        </button>

        <button
          onClick={onFinish}
          className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
        >
          {language === 'ru' ? 'Выйти из мастера' : 'Exit Wizard'}
        </button>
      </div>
    </div>
  );
};
