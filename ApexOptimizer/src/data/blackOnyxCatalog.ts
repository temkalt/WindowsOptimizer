export interface TweakItem {
  id: string;
  category: string;
  categoryName: string;
  title: string;
  filename: string;
  fileRelPath: string;
  type: 'reg' | 'bat' | 'ps1' | 'exe' | 'txt' | 'cfg' | 'pow';
  badge: string;
  safety: 'safe' | 'recommended' | 'optional';
  whatItDoes: string;
  whyNeeded: string;
  proof: string;
  instructions: string;
  regKeys?: string[];
  command?: string;
}

export interface CategoryInfo {
  id: string;
  num: string;
  name: string;
  icon: string;
  description: string;
  accent: string;
}

export const BLACK_ONYX_CATEGORIES: CategoryInfo[] = [
  {
    id: '01_FIRST',
    num: '01',
    name: 'Первым делом',
    icon: 'ShieldAlert',
    description: 'Создание точек восстановления, резервные копии реестра и сетевых адаптеров, аудит системы.',
    accent: '#38bdf8'
  },
  {
    id: '02_DEBLOAT',
    num: '02',
    name: 'Windows & Деблойт',
    icon: 'Layers',
    description: 'Отключение VBS / Core Isolation, телеметрии, Copilot 24H2, InSpectre Gaming Boost, очистка UWP.',
    accent: '#00f0ff'
  },
  {
    id: '03_CPU',
    num: '03',
    name: 'Процессор & Таймеры',
    icon: 'Cpu',
    description: 'Win32PrioritySeparation 26/28, аппаратные таймеры 0.5ms, разблокировка ядер, калибровка Ryzen 9800X3D.',
    accent: '#10b981'
  },
  {
    id: '04_GPU',
    num: '04',
    name: 'Видеокарта & Графика',
    icon: 'MonitorPlay',
    description: 'Кастомный драйвер 596.36, LLC-V2 Profile, HAGS, DirectFlip 2, Anomaly Resolution 4:3, TDR Watch, MPO Fix.',
    accent: '#f59e0b'
  },
  {
    id: '05_POWER',
    num: '05',
    name: 'Планы электропитания',
    icon: 'Zap',
    description: 'Igromanoff AMD VIP (для AM5/9800X3D), AMD Standart, Intel V1-V3, LLC-CERTIFIED, отключение PCIe ASPM.',
    accent: '#eab308'
  },
  {
    id: '06_MEMORY',
    num: '06',
    name: 'Память & Диски',
    icon: 'HardDrive',
    description: 'DisablePagingExecutive (ядро в RAM), StorPort Idle Off (запрет сна NVMe), NTFS Speedup, MMAgent Off, ISLC.',
    accent: '#a855f7'
  },
  {
    id: '07_NETWORK',
    num: '07',
    name: 'Интернет & Сеть',
    icon: 'Wifi',
    description: 'TCP NoDelay, NetworkThrottlingIndex ffffffff, тюнинг Realtek 2.5GbE RTL8125, Wi-Fi Spike Fix, DnsJumper.',
    accent: '#06b6d4'
  },
  {
    id: '08_INPUT',
    num: '08',
    name: 'Мышь & Клавиатура',
    icon: 'MousePointer',
    description: 'MarkC 1:1, MouseDataQueueSize 16, FilterKeys 0ms, разгон геймпадов HIDUSBF 1000Hz, USB Selective Suspend Off.',
    accent: '#ec4899'
  },
  {
    id: '09_AUDIO',
    num: '09',
    name: 'Звук & MMCSS',
    icon: 'Volume2',
    description: 'MMCSS Games High SFIO, NoLazyMode=1, изоляция audiodg.exe с Realtime приоритетом, Realtek DAC Idle Off.',
    accent: '#8b5cf6'
  },
  {
    id: '10_SERVICES',
    num: '10',
    name: 'Службы & Задачи',
    icon: 'Settings',
    description: '15 категорий фоновых задач планировщика BoosterX, безопасный и киберспортивный профили служб.',
    accent: '#64748b'
  },
  {
    id: '11_DEVICES',
    num: '11',
    name: 'Устройства & MSI Mode',
    icon: 'Server',
    description: 'Перевод GPU, NIC Ethernet, NVMe и USB xHCI в режим MSI (Message Signaled Interrupts) с высоким приоритетом.',
    accent: '#3b82f6'
  },
  {
    id: '12_GAMES',
    num: '12',
    name: 'Игровые Конфиги',
    icon: 'Gamepad2',
    description: 'CS2 (-mainthreadpriority 2 + autoexec + IFEO), Apex Legends autoexec + videoconfig, Valorant, Warzone CST.',
    accent: '#f43f5e'
  },
  {
    id: '13_DIAGNOSTICS',
    num: '13',
    name: 'Диагностика & Тесты',
    icon: 'Activity',
    description: 'Замер DPC (LatencyMon), тест таймеров, TM5 Anta777, Prime95, LinX AMD, Y-Cruncher, ZenTimings, PresentMon.',
    accent: '#14b8a6'
  },
  {
    id: '14_CLEANING',
    num: '14',
    name: 'Очистка Системы',
    icon: 'Trash2',
    description: 'Очистка Temp/Prefetch, DirectX Shader Cache, журналов событий Event Logs, удаление фантомных USB (DeviceCleanup).',
    accent: '#f97316'
  },
  {
    id: '15_RESTORE',
    num: '15',
    name: 'Восстановление',
    icon: 'RotateCcw',
    description: 'Полный откат всех настроек Windows к заводским по умолчанию, сброс сетевых протоколов и автозапуска служб.',
    accent: '#94a3b8'
  }
];

export const BLACK_ONYX_TWEAKS: TweakItem[] = [
  // 01 ПЕРВЫМ ДЕЛОМ
  {
    id: 'tweak_01_restore_point',
    category: '01_FIRST',
    categoryName: '01 ПЕРВЫМ ДЕЛОМ',
    title: 'Создать системную точку восстановления Windows',
    filename: '1. Создать точку восстановления.bat',
    fileRelPath: '01 ПЕРВЫМ ДЕЛОМ\\1. Создать точку восстановления.bat',
    type: 'bat',
    badge: 'Безопасность',
    safety: 'safe',
    whatItDoes: 'Вызывает Enable-ComputerRestore для диска C: и создает контрольную точку с типом MODIFY_SETTINGS через командлет Checkpoint-Computer.',
    whyNeeded: 'Позволяет моментально откатить реестр и системные службы в случае любого сбоя или несовместимости.',
    proof: 'Официальный механизм Volume Shadow Copy (VSS) в Windows.',
    instructions: 'Нажмите кнопку применения или запустите скрипт. Дождитесь надписи [УСПЕХ].'
  },
  {
    id: 'tweak_01_backup_reg',
    category: '01_FIRST',
    categoryName: '01 ПЕРВЫМ ДЕЛОМ',
    title: 'Полный бэкап системных веток реестра (HKLM и HKCU)',
    filename: '2. Бэкап реестра Windows.bat',
    fileRelPath: '01 ПЕРВЫМ ДЕЛОМ\\2. Бэкап реестра Windows.bat',
    type: 'bat',
    badge: 'Бэкап',
    safety: 'safe',
    whatItDoes: 'Экспортирует ветки SYSTEM, SOFTWARE и HKCU в локальную папку Backup_Registry.',
    whyNeeded: 'Гарантирует 100% восстановление исходных настроек реестра в любой момент.',
    proof: 'Штатная команда reg export.',
    instructions: 'Создает копию реестра перед внесением изменений.'
  },
  {
    id: 'tweak_01_system_audit',
    category: '01_FIRST',
    categoryName: '01 ПЕРВЫМ ДЕЛОМ',
    title: 'Полный аудит и диагностический отчет о системе',
    filename: '5. Полный аудит и отчет о системе (Диагностика).bat',
    fileRelPath: '01 ПЕРВЫМ ДЕЛОМ\\5. Полный аудит и отчет о системе (Диагностика).bat',
    type: 'bat',
    badge: 'Диагностика',
    safety: 'safe',
    whatItDoes: 'Собирает данные о модели CPU, ядрах, версии видеодрайвера, активной схеме питания, статусе VBS и сетевых очередях RSS.',
    whyNeeded: 'Позволяет точно оценить готовность системы к киберспортивной оптимизации.',
    proof: 'WMI/CIM запросы к ядру Windows.',
    instructions: 'Запустите для вывода сводного отчета о компонентах вашего ПК.'
  },

  // 02 WINDOWS И ДЕБЛОЙТ
  {
    id: 'tweak_02_vbs_disable',
    category: '02_DEBLOAT',
    categoryName: '02 WINDOWS И ДЕБЛОЙТ',
    title: 'Отключить VBS и Core Isolation (Memory Integrity) — Буст 1% Low',
    filename: '13. Отключить VBS и Core Isolation (Memory Integrity) для макс. FPS.bat',
    fileRelPath: '02 WINDOWS И ДЕБЛОЙТ\\13. Отключить VBS и Core Isolation (Memory Integrity) для макс. FPS.bat',
    type: 'bat',
    badge: '+5-15% 1% Low FPS',
    safety: 'recommended',
    whatItDoes: 'Выставляет HypervisorEnforcedCodeIntegrity=0, EnableVirtualizationBasedSecurity=0 и отключает запуск гипервизора через bcdedit /set hypervisorlaunchtype off.',
    whyNeeded: 'Устраняет перехват прерываний гипервизором (VM-Exit overhead), давая максимальный прирост 0.1%/1% Low FPS и устраняя микрофризы.',
    proof: 'Бенчмарки Tom\'s Hardware и PC Gamer показывают прирост 5-15% редких событий при выключении VBS в Windows 11.',
    instructions: 'Примените твик и обязательно перезагрузите компьютер для применения изменений ядра.'
  },
  {
    id: 'tweak_02_spectre_boost',
    category: '02_DEBLOAT',
    categoryName: '02 WINDOWS И ДЕБЛОЙТ',
    title: 'InSpectre Gaming Mode (Отключение программных митигаций Spectre/Meltdown)',
    filename: '15. Оптимизация Spectre-Meltdown (InSpectre Gaming Boost).bat',
    fileRelPath: '02 WINDOWS И ДЕБЛОЙТ\\15. Оптимизация Spectre-Meltdown (InSpectre Gaming Boost).bat',
    type: 'bat',
    badge: 'CPU Syscall Boost',
    safety: 'recommended',
    whatItDoes: 'Задает FeatureSettingsOverride=3 и FeatureSettingsOverrideMask=3 в ветке Memory Management.',
    whyNeeded: 'Убирает оверхед ядра на проверку спекулятивного исполнения команд, ускоряя системные вызовы процессора (syscalls).',
    proof: 'Тесты Phoronix и AnandTech фиксируют ускорение I/O операций на 3-7%.',
    instructions: 'Рекомендуется для игровых ПК.'
  },
  {
    id: 'tweak_02_copilot_recall_purge',
    category: '02_DEBLOAT',
    categoryName: '02 WINDOWS И ДЕБЛОЙТ',
    title: 'Удалить фоновые службы AI Copilot и Recall (Windows 11 24H2)',
    filename: '6. Удалить Copilot и AI Recall (Win 11 24H2).bat',
    fileRelPath: '02 WINDOWS И ДЕБЛОЙТ\\6. Удалить Copilot и AI Recall (Win 11 24H2).bat',
    type: 'bat',
    badge: 'Win 11 24H2 Purge',
    safety: 'safe',
    whatItDoes: 'Блокирует DisableAIDataAnalysis=1 и TurnOffWindowsCopilot=1 в политиках HKLM и HKCU.',
    whyNeeded: 'Предотвращает периодический фоновый анализ скриншотов и активности пользователя искусственным интеллектом Windows 11.',
    proof: 'Устраняет фоновые циклы CPU и дисковую активность службы NPU/AI.',
    instructions: 'Примените для полной очистки от AI-телеметрии в Windows 11 24H2.'
  },
  {
    id: 'tweak_02_telemetry_purge',
    category: '02_DEBLOAT',
    categoryName: '02 WINDOWS И ДЕБЛОЙТ',
    title: 'Отключить сбор диагностических данных и DiagTrack',
    filename: '1. Отключить телеметрию и сбор данных.reg',
    fileRelPath: '02 WINDOWS И ДЕБЛОЙТ\\1. Отключить телеметрию и сбор данных.reg',
    type: 'reg',
    badge: 'Приватность & Фреймтайм',
    safety: 'safe',
    whatItDoes: 'Отключает AllowTelemetry=0, CommercialDataOptIn=0, EnhancedDataCollection=0.',
    whyNeeded: 'Блокирует отправку отчетов в Microsoft во время игровых сессий.',
    proof: 'Снижает сетевой фоновый трафик и прерывания службы DiagTrack.',
    instructions: 'Импортируйте файл в реестр.'
  },

  // 03 ПРОЦЕССОР И ТАЙМЕРЫ
  {
    id: 'tweak_03_win32_priority_26',
    category: '03_CPU',
    categoryName: '03 ПРОЦЕССОР И ТАЙМЕРЫ',
    title: 'Кванты CPU Win32PrioritySeparation = 26 Hex (Esports Dynamic Boost)',
    filename: '1. Настройка квантов CPU (Win32PrioritySeparation 26 Hex).reg',
    fileRelPath: '03 ПРОЦЕССОР И ТАЙМЕРЫ\\1. Настройка квантов CPU (Win32PrioritySeparation 26 Hex).reg',
    type: 'reg',
    badge: 'Esports Standard (26 Hex)',
    safety: 'recommended',
    whatItDoes: 'Выставляет Win32PrioritySeparation = 0x26 (38 dec). Задает короткие переменные кванты времени с приоритетом 3:1 для активного окна игры.',
    whyNeeded: 'Гарантирует, что процессор бросает все доступные вычислительные ресурсы на процесс игры, игнорируя фоновые задачи.',
    proof: 'Золотой стандарт киберспортивных оптимизаций Windows 10/11.',
    instructions: 'Рекомендуется для большинства соревновательных игр (CS2, Apex, Valorant).'
  },
  {
    id: 'tweak_03_bcd_timers_05ms',
    category: '03_CPU',
    categoryName: '03 ПРОЦЕССОР И ТАЙМЕРЫ',
    title: 'Высокоточный таймер 0.500 ms (Enhanced TSC + Dynamic Tick Off)',
    filename: '2. Включить таймер 0.5ms (Dynamic Tick Off + Enhanced TSC).bat',
    fileRelPath: '03 ПРОЦЕССОР И ТАЙМЕРЫ\\2. Включить таймер 0.5ms (Dynamic Tick Off + Enhanced TSC).bat',
    type: 'bat',
    badge: '0.500 ms Таймер',
    safety: 'recommended',
    whatItDoes: 'Выполняет bcdedit /set disabledynamictick yes, bcdedit /set tscsyncpolicy Enhanced, удаляет useplatformclock и активирует GlobalTimerResolutionRequests=1.',
    whyNeeded: 'Устраняет скачки времени кадра (Frame Pacing Jitter), делая движение картинки идеально плавным.',
    proof: 'Замеры в TimerTool и LatencyMon подтверждают фиксацию таймера на значении 0.500 мс.',
    instructions: 'Примените и перезагрузите ПК для переинициализации загрузчика BCD.'
  },
  {
    id: 'tweak_03_core_unparking',
    category: '03_CPU',
    categoryName: '03 ПРОЦЕССОР И ТАЙМЕРЫ',
    title: '100% Core Unparking (Разблокировка всех ядер и потоков CPU)',
    filename: '3. Разблокировать и зафиксировать 100% парковку ядер.bat',
    fileRelPath: '03 ПРОЦЕССОР И ТАЙМЕРЫ\\3. Разблокировать и зафиксировать 100% парковку ядер.bat',
    type: 'bat',
    badge: '100% Ядер Активны',
    safety: 'safe',
    whatItDoes: 'Выставляет параметры парковки ядер 0cc5b647... = 100% и ea062031... = 100% в схеме электропитания.',
    whyNeeded: 'Запрещает Windows усыплять ядра процессора, исключая задержку на их пробуждение при резком спавне врагов.',
    proof: 'Проверяется через Resource Monitor (ни одно ядро не находится в статусе Parked).',
    instructions: 'Примените в 1 клик.'
  },
  {
    id: 'tweak_03_ryzen_9800x3d',
    category: '03_CPU',
    categoryName: '03 ПРОЦЕССОР И ТАЙМЕРЫ',
    title: 'Спец-калибровка для AMD Ryzen 7 9800X3D (Zen 5 3D V-Cache)',
    filename: '4. Спец-калибровка для AMD Ryzen 7 9800X3D (Zen 5 V-Cache).bat',
    fileRelPath: '03 ПРОЦЕССОР И ТАЙМЕРЫ\\4. Спец-калибровка для AMD Ryzen 7 9800X3D (Zen 5 V-Cache).bat',
    type: 'bat',
    badge: 'Ryzen 9800X3D Custom',
    safety: 'recommended',
    whatItDoes: 'Задает EPP = 0 (Energy Performance Preference), Aggressive Boost = 100% и блокирует сброс частоты шины Infinity Fabric.',
    whyNeeded: 'Максимизирует эффективность 3D V-Cache второго поколения на архитектуре Zen 5.',
    proof: 'Удерживает процессор на максимальной частоте буста (до 5.2+ ГГц) без микропросадок.',
    instructions: 'Идеально для процессора AMD Ryzen 7 9800X3D.'
  },

  // 04 ВИДЕОКАРТА И ГРАФИКА
  {
    id: 'tweak_04_driver_custom',
    category: '04_GPU',
    categoryName: '04 ВИДЕОКАРТА И ГРАФИКА',
    title: 'Кастомный чистый драйвер NVIDIA 596.36 (Clean-Custom Installer)',
    filename: '0. Установить кастомный чистый драйвер NVIDIA (596.36).bat',
    fileRelPath: '04 ВИДЕОКАРТА И ГРАФИКА\\0. Установить кастомный чистый драйвер NVIDIA (596.36).bat',
    type: 'bat',
    badge: '596.36 Clean Driver',
    safety: 'recommended',
    whatItDoes: 'Запускает инсталлятор чистого драйвера 596.36, очищенного от телеметрии, GFE, Shield и фоновых сервисов.',
    whyNeeded: 'Обеспечивает минимально возможную задержку драйвера nvlddmkm.sys и чистый рендеринг.',
    proof: 'Снижение DPC-задержки видеодрайвера в LatencyMon до 10-15 мкс.',
    instructions: 'Рекомендуется устанавливать после удаления старого драйвера через DDU.'
  },
  {
    id: 'tweak_04_llc_profile',
    category: '04_GPU',
    categoryName: '04 ВИДЕОКАРТА И ГРАФИКА',
    title: 'Импорт киберспортивного профиля NVIDIA (LLC-V2.nip)',
    filename: '10. Импорт киберспортивного профиля NVIDIA (LLC-V2).bat',
    fileRelPath: '04 ВИДЕОКАРТА И ГРАФИКА\\10. Импорт киберспортивного профиля NVIDIA (LLC-V2).bat',
    type: 'bat',
    badge: 'LLC-V2 Low Latency',
    safety: 'recommended',
    whatItDoes: 'Автоматически импортирует LLC-OPTIMIZED-V2.nip через nvidiaProfileInspector в тихом режиме.',
    whyNeeded: 'Выставляет Ultra Low Latency, P0 State, кэш шейдеров 10GB и выключает лишнюю постобработку драйвера.',
    proof: 'Эталонный профиль соревновательного сообщества Low Latency Community.',
    instructions: 'Нажмите для импорта профиля. Диспетчер драйвера обновит настройки за 1 секунду.'
  },
  {
    id: 'tweak_04_mpo_fix',
    category: '04_GPU',
    categoryName: '04 ВИДЕОКАРТА И ГРАФИКА',
    title: 'Отключить MPO (Multiplane Overlay Fix) — Устранение статтеров',
    filename: '2. Отключить MPO (Multiplane Overlay Fix).reg',
    fileRelPath: '04 ВИДЕОКАРТА И ГРАФИКА\\2. Отключить MPO (Multiplane Overlay Fix).reg',
    type: 'reg',
    badge: 'Фикс микрофризов',
    safety: 'safe',
    whatItDoes: 'Задает OverlayTestMode=5 в ветке GraphicsDrivers.',
    whyNeeded: 'Устраняет черные экраны, микростаттеры при открытом Discord/браузере на втором мониторе.',
    proof: 'Официально признанный NVIDIA способ решения проблем с рассинхронизацией DWM.',
    instructions: 'Импортируйте файл в реестр.'
  },
  {
    id: 'tweak_04_anomaly_resolution',
    category: '04_GPU',
    categoryName: '04 ВИДЕОКАРТА И ГРАФИКА',
    title: 'Anomaly Resolution Fix (Игроманов: Scaling=3 + TDR Watchdog)',
    filename: '13. Anomaly Resolution Fix (TDR + Full Screen 4на3).bat',
    fileRelPath: '04 ВИДЕОКАРТА И ГРАФИКА\\13. Anomaly Resolution Fix (TDR + Full Screen 4на3).bat',
    type: 'bat',
    badge: '4:3 Stretched 0ms Lag',
    safety: 'recommended',
    whatItDoes: 'Фиксирует Scaling=3 во всех конфигурациях дисплеев и калибрует тайминги TdrDelay=10, TdrLevel=3.',
    whyNeeded: 'Убирает аппаратный инпутлаг масштабирования при игре с растянутыми разрешениями (4:3) и защищает GPU от сбоев.',
    proof: 'Метод Игроманова (igromanoff_news/13), проверенный тысячами игроков CS2.',
    instructions: 'Примените батник, в панели NVIDIA выберите "Во весь экран". После перезагрузки статус зафиксируется.'
  },
  {
    id: 'tweak_04_directflip_mode2',
    category: '04_GPU',
    categoryName: '04 ВИДЕОКАРТА И ГРАФИКА',
    title: 'Включить DirectFlip Mode 2 (Прямой вывод кадров без задержки)',
    filename: '4. Включить DirectFlip Mode 2 (минимальный инпутлаг).reg',
    fileRelPath: '04 ВИДЕОКАРТА И ГРАФИКА\\4. Включить DirectFlip Mode 2 (минимальный инпутлаг).reg',
    type: 'reg',
    badge: 'DirectFlip 0ms Lag',
    safety: 'safe',
    whatItDoes: 'Задает DirectFlipMode=2, EnableDirectFlip=1 и AutoSwapchain=1.',
    whyNeeded: 'Позволяет окну без рамки отправлять кадры напрямую в скан-аут видеокарты в обход композитора DWM.',
    proof: 'Документация Microsoft DXGI Flip Model.',
    instructions: 'Импортируйте файл в реестр.'
  },

  // 05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ
  {
    id: 'tweak_05_igromanoff_vip',
    category: '05_POWER',
    categoryName: '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ',
    title: 'Активировать план Igromanoff AMD VIP (для Ryzen 7 9800X3D - AM5)',
    filename: '1. Активировать Igromanoff AMD VIP (для Ryzen 7 9800X3D - AM5).bat',
    fileRelPath: '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\1. Активировать Igromanoff AMD VIP (для Ryzen 7 9800X3D - AM5).bat',
    type: 'bat',
    badge: 'AM5 VIP Custom Plan',
    safety: 'recommended',
    whatItDoes: 'Импортирует и активирует GUID 77777777-7777-7777-7777-777777777777 с отключением PCIe ASPM.',
    whyNeeded: 'Создан эксклюзивно под архитектуру Zen 4/5 для максимального раскрытия кэша 3D V-Cache.',
    proof: 'Фиксирует максимальные тактовые частоты и отключает засыпание интерфейсов.',
    instructions: 'Примените для мгновенной активации плана питания.'
  },
  {
    id: 'tweak_05_llc_certified',
    category: '05_POWER',
    categoryName: '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ',
    title: 'Активировать план LLC-CERTIFIED Esports Plan',
    filename: '4. Активировать LLC-CERTIFIED Esports Plan.bat',
    fileRelPath: '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\4. Активировать LLC-CERTIFIED Esports Plan.bat',
    type: 'bat',
    badge: 'LLC Certified',
    safety: 'recommended',
    whatItDoes: 'Импортирует и активирует эталонный план сообщества Low Latency Community.',
    whyNeeded: 'Обеспечивает минимальный джиттер DPC на любых процессорах.',
    proof: 'Проверен в киберспортивных тестах LLC.',
    instructions: 'Примените в 1 клик.'
  },

  // 06 ПАМЯТЬ И ДИСКИ
  {
    id: 'tweak_06_disable_paging_executive',
    category: '06_MEMORY',
    categoryName: '06 ПАМЯТЬ И ДИСКИ',
    title: 'Закрепить ядро Windows в RAM (DisablePagingExecutive = 1)',
    filename: '1. Закрепить ядро Windows в RAM (DisablePagingExecutive).reg',
    fileRelPath: '06 ПАМЯТЬ И ДИСКИ\\1. Закрепить ядро Windows в RAM (DisablePagingExecutive).reg',
    type: 'reg',
    badge: 'Kernel in RAM',
    safety: 'recommended',
    whatItDoes: 'Задает DisablePagingExecutive=1 в ветке Memory Management.',
    whyNeeded: 'Запрещает сбрасывать системные модули ядра ntoskrnl и видеодрайвер в файл подкачки на диск.',
    proof: 'Документация Microsoft Windows Internals (Mark Russinovich).',
    instructions: 'Импортируйте файл в реестр.'
  },
  {
    id: 'tweak_06_storport_idle_off',
    category: '06_MEMORY',
    categoryName: '06 ПАМЯТЬ И ДИСКИ',
    title: 'Отключить засыпание NVMe SSD (StorPort Idle Power Management Off)',
    filename: '2. Отключить засыпание NVMe и SATA (StorPort Idle Disable).reg',
    fileRelPath: '06 ПАМЯТЬ И ДИСКИ\\2. Отключить засыпание NVMe и SATA (StorPort Idle Disable).reg',
    type: 'reg',
    badge: '0ms NVMe Wake Lag',
    safety: 'safe',
    whatItDoes: 'Отключает переход контроллера накопителя в режим энергосбережения StorPort Idle.',
    whyNeeded: 'Исключает фризы при потоковой подгрузке текстур и звуков в CS2, Apex Legends и Warzone.',
    proof: 'Устраняет микрозадержки шины PCI Express при обращении к диску.',
    instructions: 'Импортируйте файл в реестр.'
  },
  {
    id: 'tweak_06_mmagent_compression_off',
    category: '06_MEMORY',
    categoryName: '06 ПАМЯТЬ И ДИСКИ',
    title: 'Отключить сжатие памяти (MMAgent MemoryCompression Off)',
    filename: '4. Отключить сжатие памяти (MMAgent MemoryCompression).bat',
    fileRelPath: '06 ПАМЯТЬ И ДИСКИ\\4. Отключить сжатие памяти (MMAgent MemoryCompression).bat',
    type: 'bat',
    badge: 'CPU Cycles Saved',
    safety: 'recommended',
    whatItDoes: 'Выполняет Disable-MMAgent -MemoryCompression -PageCombining -ApplicationPreLaunch.',
    whyNeeded: 'Освобождает процессорные такты от постоянной фоновой компрессии страниц памяти.',
    proof: 'Исключает периодические всплески нагрузки на системный процесс "Система и сжатая память".',
    instructions: 'Примените в 1 клик.'
  },

  // 07 ИНТЕРНЕТ И СЕТЬ
  {
    id: 'tweak_07_tcp_nodelay',
    category: '07_NETWORK',
    categoryName: '07 ИНТЕРНЕТ И СЕТЬ',
    title: 'Уничтожение алгоритма Nagle (TcpNoDelay = 1, TcpAckFrequency = 1)',
    filename: '1. Отключить алгоритм Nagle (TCP NoDelay + AckFrequency 1).reg',
    fileRelPath: '07 ИНТЕРНЕТ И СЕТЬ\\1. Отключить алгоритм Nagle (TCP NoDelay + AckFrequency 1).reg',
    type: 'reg',
    badge: '0ms Packet Delay',
    safety: 'safe',
    whatItDoes: 'Задает TcpNoDelay=1, TcpAckFrequency=1, TCPDelAckTicks=0 во всех сетевых интерфейсах.',
    whyNeeded: 'Заставляет сетевую карту отправлять пакеты ввода мгновенно без буферизации и задержек.',
    proof: 'Снижение вариативности пинга (Jitter) в соревновательных играх.',
    instructions: 'Импортируйте файл в реестр.'
  },
  {
    id: 'tweak_07_network_throttling_off',
    category: '07_NETWORK',
    categoryName: '07 ИНТЕРНЕТ И СЕТЬ',
    title: 'Снять ограничение NetworkThrottlingIndex (0xffffffff)',
    filename: '2. Снять ограничение Network Throttling Index.reg',
    fileRelPath: '07 ИНТЕРНЕТ И СЕТЬ\\2. Снять ограничение Network Throttling Index.reg',
    type: 'reg',
    badge: 'Full Network Bandwidth',
    safety: 'safe',
    whatItDoes: 'Выставляет NetworkThrottlingIndex = 0xffffffff и SystemResponsiveness = 0.',
    whyNeeded: 'Отключает ограничение Windows на обработку не-мультимедийных пакетов при активном звуке.',
    proof: 'Документация Microsoft Multimedia Class Scheduler Service.',
    instructions: 'Импортируйте файл в реестр.'
  },
  {
    id: 'tweak_07_wifi_spike_fix',
    category: '07_NETWORK',
    categoryName: '07 ИНТЕРНЕТ И СЕТЬ',
    title: 'Фикс спайков пинга Wi-Fi (ScanWhenAssociated = 0)',
    filename: '10. Оптимизация Wi-Fi (Устранение спайков пинга).reg',
    fileRelPath: '07 ИНТЕРНЕТ И СЕТЬ\\10. Оптимизация Wi-Fi (Устранение спайков пинга).reg',
    type: 'reg',
    badge: 'Wi-Fi Zero Spike',
    safety: 'safe',
    whatItDoes: 'Задает ScanWhenAssociated=0 в ветке WlanSvc.',
    whyNeeded: 'Блокирует 60-секундное фоновое сканирование сетей Windows, вызывающее спайки пинга до 300 мс.',
    proof: 'Устраняет периодические лаги при игре через Wi-Fi.',
    instructions: 'Импортируйте файл в реестр.'
  },

  // 08 МЫШЬ И КЛАВИАТУРА
  {
    id: 'tweak_08_markc_mouse',
    category: '08_INPUT',
    categoryName: '08 МЫШЬ И КЛАВИАТУРА',
    title: 'Фикс MarkC 1:1 (Полное отключение акселерации мыши)',
    filename: '1. Фикс MarkC 1к1 (полное отключение акселерации мыши).reg',
    fileRelPath: '08 МЫШЬ И КЛАВИАТУРА\\1. Фикс MarkC 1к1 (полное отключение акселерации мыши).reg',
    type: 'reg',
    badge: '1:1 Raw Mouse Input',
    safety: 'safe',
    whatItDoes: 'Калибрует кривую SmoothMouseCurve под строго линейную пропорцию 1:1.',
    whyNeeded: 'Гарантирует, что курсор перемещается ровно на столько пикселей, на сколько сместился сенсор мыши.',
    proof: 'Золотой стандарт киберспортивного сообщества со времен MarkC.',
    instructions: 'Импортируйте файл в реестр.'
  },
  {
    id: 'tweak_08_filterkeys_0ms',
    category: '08_INPUT',
    categoryName: '08 МЫШЬ И КЛАВИАТУРА',
    title: 'Киберспортивный FilterKeys (0ms задержка, 15ms повтор)',
    filename: '4. Киберспортивный FilterKeys (0ms задержка, 15ms повтор).reg',
    fileRelPath: '08 МЫШЬ И КЛАВИАТУРА\\4. Киберспортивный FilterKeys (0ms задержка, 15ms повтор).reg',
    type: 'reg',
    badge: 'Instant Strafe',
    safety: 'safe',
    whatItDoes: 'Выставляет Flags=27, DelayBeforeAcceptance=0, AutoRepeatRate=15 в Keyboard Response.',
    whyNeeded: 'Убирает задержку первого нажатия клавиш, делая стрейфы в CS2 и Apex мгновенными.',
    proof: 'Используется про-игроками для максимального контроля движения.',
    instructions: 'Импортируйте файл в реестр.'
  },

  // 09 ЗВУК И MMCSS
  {
    id: 'tweak_09_mmcss_nolazymode',
    category: '09_AUDIO',
    categoryName: '09 ЗВУК И МУЛЬТИМЕДИА',
    title: 'MMCSS Games High SFIO Priority + NoLazyMode = 1',
    filename: '6. Отключить NoLazyMode и повысить SFIO Priority в MMCSS.reg',
    fileRelPath: '09 ЗВУК И МУЛЬТИМЕДИА\\6. Отключить NoLazyMode и повысить SFIO Priority в MMCSS.reg',
    type: 'reg',
    badge: 'Zero Audio Stutter',
    safety: 'safe',
    whatItDoes: 'Выставляет Scheduling Category=High, SFIO Priority=High, GPU Priority=8 и NoLazyMode=1.',
    whyNeeded: 'Запрещает операционной системе усыплять аудиодрайвер и устраняет заикания звука в тяжелых файтах.',
    proof: 'Исследования sweetlow и сообщества Low Latency Community.',
    instructions: 'Импортируйте файл в реестр.'
  },
  {
    id: 'tweak_09_audiodg_isolation',
    category: '09_AUDIO',
    categoryName: '09 ЗВУК И МУЛЬТИМЕДИА',
    title: 'Изоляция процесса audiodg.exe с Realtime приоритетом на выделенном ядре',
    filename: '3. Изоляция процесса audiodg.exe с авто-привязкой к ядрам.ps1',
    fileRelPath: '09 ЗВУК И МУЛЬТИМЕДИА\\3. Изоляция процесса audiodg.exe с авто-привязкой к ядрам.ps1',
    type: 'ps1',
    badge: 'DPC Audio Fix',
    safety: 'recommended',
    whatItDoes: 'Находит audiodg.exe, выставляет приоритет Realtime и закрепляет его за ядрами 6-7.',
    whyNeeded: 'Исключает DPC спайки звукового движка на ядрах, где выполняется игровой поток.',
    proof: 'Решает проблему щелчков и рассинхрона звука при высокой нагрузке на процессор.',
    instructions: 'Запустите скрипт PowerShell от имени администратора.'
  },

  // 10 СЛУЖБЫ И ПЛАНИРОВЩИК
  {
    id: 'tweak_10_boosterx_tasks',
    category: '10_SERVICES',
    categoryName: '10 СЛУЖБЫ И ПЛАНИРОВЩИК',
    title: 'Отключить 15 категорий фоновых задач планировщика (BoosterX)',
    filename: '3. Отключить 15 категорий фоновых задач планировщика (BoosterX).bat',
    fileRelPath: '10 СЛУЖБЫ И ПЛАНИРОВЩИК\\3. Отключить 15 категорий фоновых задач планировщика (BoosterX).bat',
    type: 'bat',
    badge: '15 Категорий BoosterX',
    safety: 'recommended',
    whatItDoes: 'Отключает 15 категорий фоновых задач Windows (Customer Experience, Application Experience, CloudExperienceHost, Maps, Diagnosis, Defrag, Chkdsk, Feedback, Family, DeliveryOptimization, DiskFootprint, Speech, FileHistory, MemoryDiagnostic, DeviceInformation).',
    whyNeeded: 'Устраняет периодические микрофризы и спайки нагрузки на CPU во время игры каждые 15-30 минут.',
    proof: 'Официальный перечень BoosterX и Sophia Script для устранения фоновых регламентных прерываний.',
    instructions: 'Примените в 1 клик для полной остановки фонового планировщика.'
  },
  {
    id: 'tweak_10_safe_services',
    category: '10_SERVICES',
    categoryName: '10 СЛУЖБЫ И ПЛАНИРОВЩИК',
    title: 'Применить безопасный игровой профиль служб Windows',
    filename: '1. Применить безопасный игровой профиль служб.bat',
    fileRelPath: '10 СЛУЖБЫ И ПЛАНИРОВЩИК\\1. Применить безопасный игровой профиль служб.bat',
    type: 'bat',
    badge: 'Safe Gaming Services',
    safety: 'safe',
    whatItDoes: 'Отключает DiagTrack, dmwappushservice, WerSvc, wisvc без затрагивания печати, магазина и обновлений.',
    whyNeeded: 'Освобождает ОЗУ и убирает лишние дескрипторы процессов.',
    proof: 'Стандартный профиль безопасности.',
    instructions: 'Рекомендуется для повседневных ПК.'
  },
  {
    id: 'tweak_10_esports_services',
    category: '10_SERVICES',
    categoryName: '10 СЛУЖБЫ И ПЛАНИРОВЩИК',
    title: 'Применить киберспортивный профиль служб (Esports Zero Latency)',
    filename: '2. Применить киберспортивный профиль служб.bat',
    fileRelPath: '10 СЛУЖБЫ И ПЛАНИРОВЩИК\\2. Применить киберспортивный профиль служб.bat',
    type: 'bat',
    badge: 'Esports Zero Services',
    safety: 'recommended',
    whatItDoes: 'Отключает SysMain, DPS, WbioSrvc, WalletService, TabletInputService, wscsvc и 15 других фоновых служб.',
    whyNeeded: 'Снижает число активных потоков Windows с ~2500 до <1400.',
    proof: 'Максимальный результат в тестах DPC latency.',
    instructions: 'Для чисто игровых соревновательных систем.'
  },

  // 11 УСТРОЙСТВА И MSI MODE
  {
    id: 'tweak_11_msi_gpu_high',
    category: '11_DEVICES',
    categoryName: '11 УСТРОЙСТВА И MSI MODE',
    title: 'Включить MSI Mode (Message Signaled Interrupts) для видеокарты — High Priority',
    filename: '1. Включить MSI Mode для видеокарты (GPU High Priority).ps1',
    fileRelPath: '11 УСТРОЙСТВА И MSI MODE\\1. Включить MSI Mode для видеокарты (GPU High Priority).ps1',
    type: 'ps1',
    badge: 'GPU High Priority',
    safety: 'recommended',
    whatItDoes: 'Включает MSISupported=1 и выставляет MessageNumberLimit=1, DevicePriority=3 в ветке драйвера GPU.',
    whyNeeded: 'Устраняет конфликты общих линий IRQ, снижая задержку обработки кадров видеокартой.',
    proof: 'Снижает среднее время обработки прерываний в LatencyMon.',
    instructions: 'Примените скрипт. Требуется перезагрузка.'
  },

  // 12 ИГРОВЫЕ КОНФИГИ
  {
    id: 'tweak_12_cs2_mainthreadpriority',
    category: '12_GAMES',
    categoryName: '12 ИГРОВЫЕ КОНФИГИ',
    title: 'CS2: Скрытый приоритет главного потока (-mainthreadpriority 2)',
    filename: '6. CS2 - Параметры запуска со скрытым приоритетом потоков (-mainthreadpriority).txt',
    fileRelPath: '12 ИГРОВЫЕ КОНФИГИ\\6. CS2 - Параметры запуска со скрытым приоритетом потоков (-mainthreadpriority).txt',
    type: 'txt',
    badge: 'CS2 Source 2 Threading',
    safety: 'recommended',
    whatItDoes: 'Рекомендует параметр запуска -mainthreadpriority 2 (THREAD_PRIORITY_HIGHEST) для CS2 в Steam.',
    whyNeeded: 'Гарантирует, что главный поток движка Source 2 не конкурирует с фоновыми потоками Windows.',
    proof: 'Рекомендация Игроманова и сообщества CS2 (igromanoff_news/21).',
    instructions: 'Скопируйте строку запуска в свойства CS2 в библиотеке Steam.'
  },
  {
    id: 'tweak_12_cs2_ifeo_priority',
    category: '12_GAMES',
    categoryName: '12 ИГРОВЫЕ КОНФИГИ',
    title: 'CS2: Реестровый высокий приоритет CPU и I/O (IFEO)',
    filename: '1. CS2 - Высокий приоритет CPU и IO (IFEO).reg',
    fileRelPath: '12 ИГРОВЫЕ КОНФИГИ\\1. CS2 - Высокий приоритет CPU и IO (IFEO).reg',
    type: 'reg',
    badge: 'CS2 High IFEO',
    safety: 'safe',
    whatItDoes: 'Задает CpuPriorityClass=3 и IoPriority=3 для cs2.exe в Image File Execution Options.',
    whyNeeded: 'Автоматически повышает приоритет процесса CS2 при каждом запуске игры.',
    proof: 'Штатный механизм Windows IFEO.',
    instructions: 'Импортируйте файл в реестр.'
  },

  // 15 ВОССТАНОВЛЕНИЕ
  {
    id: 'tweak_15_full_revert',
    category: '15_RESTORE',
    categoryName: '15 ВОССТАНОВЛЕНИЕ',
    title: '1-Клик Полный откат всех настроек Windows к заводским по умолчанию',
    filename: '1. Полный откат всех настроек Windows к заводским.bat',
    fileRelPath: '15 ВОССТАНОВЛЕНИЕ\\1. Полный откат всех настроек Windows к заводским.bat',
    type: 'bat',
    badge: 'Заводские Настройки',
    safety: 'safe',
    whatItDoes: 'Возвращает стандартные флаги BCD, схему Сбалансированная, стандартные кванты CPU, включает службы и сбрасывает TCP/IP.',
    whyNeeded: 'Позволяет моментально вернуть Windows в исходное заводское состояние.',
    proof: 'Комплексный скрипт сброса реестра и сетевого стека.',
    instructions: 'Запустите скрипт, если хотите полностью вернуть стандартные параметры Windows.'
  }
];
