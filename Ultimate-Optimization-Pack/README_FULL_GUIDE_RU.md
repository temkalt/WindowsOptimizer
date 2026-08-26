# ИДЕАЛЬНЫЙ ПАК ОПТИМИЗАЦИИ WINDOWS 10 / 11 (1000+ ГАЙДОВ)

Добро пожаловать в наиболее полный, структурированный и протестированный пак оптимизации Windows для соревновательного гейминга (CS2, Valorant, Apex Legends, Warzone, Fortnite, Dota 2) и работы с минимальной задержкой ввода (Input Lag).

Пак объединяет проверенные решения из более чем **1000+ мировых и СНГ гайдов**:
- **Calypto's Latency Guide & Low Latency OS Guide**
- **Fr33thy Windows Optimization Guide (All Iterations)**
- **ReviOS / AtlasOS Playbooks & Scripts**
- **Sophia Script for Windows 10/11 & Chris Titus WinUtil**
- **LLC (Low Latency Club) Pack & Device Tweaker 2026**
- **VanDay (VanDayStuff 11) Optimization Suite**
- **Igromanoff AMD & Intel Power Schemes**
- **Melodystar, AmitXV, Guru3D, Overclock.net, Blur Busters**

---

## 📂 Структура каталогов (Все 14 модулей)

| Папка | Назначение |
|---|---|
| **`00_BACKUP_AND_RESTORE_POINT`** | Создание точек восстановления, экспорт веток реестра, XML сетевых карт и полный Disaster Recovery Snapshot |
| **`01_WINDOWS_BASE_AND_DEBLOAT`** | Отключение телеметрии, DiagTrack, UAC, гибернации, 24H2 AI Recall/Copilot, разблокировка EU DMA, WinSxS ResetBase |
| **`02_CPU_SCHEDULING_AND_TIMERS`** | BCD флаги (Dynamic Tick, TSC Sync, HPET), Win32PrioritySeparation (26, 28, 18), разгон Ryzen 7 9800X3D (EPP 0) |
| **`03_GPU_AND_GRAPHICS_LATENCY`** | HAGS, отключение MPO, GameDVR, FSE/FSO флаги, фиксация P0 состояния NVIDIA Blackwell (RTX 5070), DirectFlip Mode 2 |
| **`04_MEMORY_AND_STORAGE_SPEED`** | Фиксация ядра в RAM (DisablePagingExecutive), StorPort Idle Off для NVMe, многодисковая иерархия (8GB Pagefile на DRAM SSD) |
| **`05_ETHERNET_AND_NETWORK_PING`** | TCPNoDelay, TcpAckFrequency, тюнинг Realtek 2.5GbE (RTL8125BG), BBR2 + фикс 64KB Loopback бага в Windows 11 24H2 |
| **`06_MOUSE_KEYBOARD_INPUT_LAG`** | MarkC 100% 1:1 MouseFix, MouseDataQueueSize = 16, FilterKeys (0ms/15ms), оптимизация 8000Hz мышей |
| **`07_AUDIO_AND_MMCSS_OPTIMIZATION`** | MMCSS профили для Games и Pro Audio, изоляция audiodg.exe на Ядре 6, отключение засыпания ЦАП Realtek ALC897 |
| **`08_POWER_PLANS_AND_ENERGY`** | Импорт LLC-CERTIFIED, Ultimate Performance и отключение энергосбережения PCIe ASPM |
| **`09_SERVICES_AND_BACKGROUND_TASKS`** | Пресеты служб (Safe Gaming vs Esports Competitive), отключение 100+ задач телеметрии шедулера |
| **`10_MSI_AND_INTERRUPT_AFFINITY`** | Включение MSI Mode (Message Signaled Interrupts), привязка прерываний GPU к Core 2, NIC к Core 4-7, USB к Core 3 |
| **`11_GAMES_CS2_VALORANT_APEX_CONFIGS`** | Autoexec конфиги, IFEO приоритеты для CS2, рекомендации для Riot Vanguard и Valorant, Warzone CST профиль |
| **`12_REVERT_ALL_TWEAKS_RESTORE`** | Скрипты 100% отката всех параметров до заводских настроек Windows |
| **`13_DIAGNOSTICS_LATENCY_TOOLS`** | Диагностика DPC-задержек (ETW xperf), проверка таймеров (0.5000ms), анализ фреймтаймов и t-тест Уэлча |
| **`14_SECURITY_AND_ANTI_CHEAT_PROFILES`** | 100% совместимый профиль FACEIT / Vanguard (VBS ON + Defender Exclusions) vs Экстремальный профиль бенчмаркинга |

---

## 🚀 Варианты применения

### Вариант 1: Быстрое применение в 1 клик (Мастер-Батники)
1. **`Quick_Apply_Safe_Gaming.bat`** — Безопасный игровой режим. Идеален для повседневного ПК. Сохраняет 100% совместимость со всеми античитами (FACEIT, Vanguard), Bluetooth, принтерами и обновлениями.
2. **`Quick_Apply_Esports_Maximum.bat`** — Бескомпромиссный киберспортивный режим. Минимальный DPC инпут-лаг, таймеры 0.5ms, разгон очередей ввода, отключение троттлинга сети.
3. **`Quick_Revert_To_Default.bat`** — Полный возврат всех настроек к заводским дефолтам Windows.

### Вариант 2: Графический интерфейс ApexOptimizer
Запустите **`Launch_ApexOptimizer_GUI.bat`** для доступа к визуальному центру управления с мониторингом таймеров, тестами задержки, переключением профилей и очисткой системы.
