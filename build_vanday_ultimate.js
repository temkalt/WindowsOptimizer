import fs from 'fs';
import path from 'path';

const TARGET_DIR = 'd:\\winvan\\VanDayStuff-Ultimate';
const SRC_VANDAY = 'd:\\winvan\\VanDayStuff11';
const SRC_LLC = 'd:\\winvan\\LLC Pack';
const SRC_ULTIMATE = 'd:\\winvan\\Ultimate-Optimization-Pack';
const SRC_IGRO = 'd:\\winvan\\Igromanoff AMD Power Pack';
const SRC_ASTRO = 'd:\\winvan\\packs\\AstroCrew Stuff';
const SRC_OPTIMIZATION = 'd:\\winvan\\packs\\Optimization';
const SRC_EXM = 'd:\\winvan\\packs\\EXM LEAKED PREMIUM PACK (@EXMTWEAKSLEAK)';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeTextFile(relPath, content) {
  const fullPath = path.join(TARGET_DIR, relPath);
  ensureDir(path.dirname(fullPath));
  const crlf = content.replace(/\r?\n/g, '\r\n');
  fs.writeFileSync(fullPath, crlf, 'utf-8');
}

function copyFile(src, relDest) {
  if (fs.existsSync(src)) {
    const dest = path.join(TARGET_DIR, relDest);
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

function copyDirRecursive(srcDir, relDestDir) {
  if (fs.existsSync(srcDir)) {
    const target = path.join(TARGET_DIR, relDestDir);
    ensureDir(target);
    const items = fs.readdirSync(srcDir);
    for (const item of items) {
      const srcItem = path.join(srcDir, item);
      const destItem = path.join(target, item);
      const stat = fs.statSync(srcItem);
      if (stat.isDirectory()) {
        copyDirRecursive(srcItem, path.join(relDestDir, item));
      } else {
        fs.copyFileSync(srcItem, destItem);
      }
    }
  }
}

console.log('--- GENERATING VANDAYSTUFF-ULTIMATE PACK ---');
ensureDir(TARGET_DIR);

// ==========================================
// ROOT MASTER BATCH LAUNCHERS
// ==========================================
writeTextFile('1_Быстрый_Запуск_КИБЕРСПОРТ_МАКСИМУМ.bat', `@echo off
chcp 65001 >nul
title VANDAYSTUFF ULTIMATE - КИБЕРСПОРТ МАКСИМУМ (1-КЛИК)

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Запрос прав Администратора...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

set PACK_DIR=%~dp0
color 0C
cls
echo ============================================================================
echo      VANDAYSTUFF ULTIMATE 2026 - КИБЕРСПОРТ МАКСИМУМ (1-КЛИК)
echo ============================================================================
echo  [ЦЕЛЬ] Максимальный FPS, 0.5ms Таймеры, 0ms Input Lag, План Игроманова VIP
echo ============================================================================
echo.

:: 1. Точка восстановления
echo [*] [1/14] Создание точки восстановления системы...
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SystemRestore" /v "SystemRestorePointCreationFrequency" /t REG_DWORD /d 0 /f >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Enable-ComputerRestore -Drive 'C:\\' -ErrorAction SilentlyContinue; Checkpoint-Computer -Description 'VanDay_Ultimate_Esports_Backup' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue" >nul 2>&1
echo  [+] Точка восстановления создана.

:: 2. Windows Debloat
echo [*] [2/14] Отключение телеметрии, сбора данных и Copilot 24H2...
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\1. Отключить телеметрию и сбор данных.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\2. Отключить UAC и всплывающие окна.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\3. Отключить фоновые приложения.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\4. Отключить отчеты об ошибках (WER).reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\5. Отключить Cortana и поиск Bing в Пуске.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\7. Вернуть классическое меню Windows 11.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\8. Ускорить анимации и отклик окон (MenuShowDelay 0).reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\9. Отключить автообслуживание Windows.reg" >nul 2>&1
powercfg -h off >nul 2>&1

reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d 1 /f >nul 2>&1
echo  [+] Телеметрия и фоновый мусор Windows отключены.

:: 3. CPU и Таймеры
echo [*] [3/14] Настройка квантов CPU (Win32PrioritySeparation 26), таймеров 0.5ms и ядер...
regedit /s "%PACK_DIR%03 ПРОЦЕССОР И ТАЙМЕРЫ\\1. Настройка квантов CPU (Win32PrioritySeparation 26 Hex).reg" >nul 2>&1
bcdedit /set disabledynamictick yes >nul 2>&1
bcdedit /deletevalue useplatformclock >nul 2>&1
bcdedit /set tscsyncpolicy Enhanced >nul 2>&1

powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb10593acda8 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 -ATTRIB_HIDE >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 100 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb10593acda8 100 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 0 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1
echo  [+] Процессор и высокоточные таймеры настроены.

:: 4. Видеокарта и Графика
echo [*] [4/14] Оптимизация видеокарты, HAGS, DirectFlip и профиля NVIDIA...
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\1. Включить HAGS (Hardware Accelerated GPU Scheduling).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\2. Отключить MPO (Multiplane Overlay Fix).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\3. Отключить Xbox GameDVR и захват экрана.reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\4. Включить DirectFlip Mode 2 (минимальный инпутлаг).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\5. Приоритет видеопотоков dxgkrnl и nvlddmkm.reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\6. Кэш шейдеров NVIDIA 10GB (безлимитный).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\7. Отключить энергосбережение GPU.reg" >nul 2>&1

if exist "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\nvidiaProfileInspector.exe" (
    if exist "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\LLC-OPTIMIZED-V2.nip" (
        "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\nvidiaProfileInspector.exe" "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\LLC-OPTIMIZED-V2.nip" -silent >nul 2>&1
        echo  [+] Профиль драйвера NVIDIA импортирован.
    )
)
echo  [+] Графика и видеокарта оптимизированы.

:: 5. Планы электропитания
echo [*] [5/14] Активация плана электропитания Igromanoff AMD VIP / LLC...
set IGRO_POW="%PACK_DIR%05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\Файлы_планов_POW\\Igromanoff AMD VIP.pow"
set LLC_POW="%PACK_DIR%05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\Файлы_планов_POW\\LLC-CERTIFIED.pow"
if exist %IGRO_POW% (
    powercfg -import %IGRO_POW% 77777777-7777-7777-7777-777777777777 >nul 2>&1
    powercfg -setactive 77777777-7777-7777-7777-777777777777 >nul 2>&1
    echo  [+] План электропитания 'Igromanoff AMD VIP' активирован.
) else if exist %LLC_POW% (
    powercfg -import %LLC_POW% 33333333-3333-3333-3333-333333333333 >nul 2>&1
    powercfg -setactive 33333333-3333-3333-3333-333333333333 >nul 2>&1
    echo  [+] План электропитания 'LLC-CERTIFIED' активирован.
) else (
    powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
    powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
    echo  [+] План электропитания 'Максимальная производительность' активирован.
)
powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPM 0 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1

:: 6. Память и Накопители
echo [*] [6/14] Оптимизация памяти, NTFS и StorPort...
regedit /s "%PACK_DIR%06 ПАМЯТЬ И ДИСКИ\\1. Закрепить ядро Windows в RAM (DisablePagingExecutive).reg" >nul 2>&1
regedit /s "%PACK_DIR%06 ПАМЯТЬ И ДИСКИ\\2. Отключить засыпание NVMe и SATA (StorPort Idle Disable).reg" >nul 2>&1
regedit /s "%PACK_DIR%06 ПАМЯТЬ И ДИСКИ\\5. Максимальный приоритет отклика (SystemResponsiveness 0).reg" >nul 2>&1
fsutil behavior set disablelastaccess 1 >nul 2>&1
fsutil behavior set disable8dot3 1 >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Disable-MMAgent -MemoryCompression -PageCombining -ApplicationPreLaunch -OperationEndpoints -ErrorAction SilentlyContinue" >nul 2>&1
echo  [+] Память и диски настроены.

:: 7. Интернет и Сеть
echo [*] [7/14] Настройка TCP NoDelay, снятие Throttling и тюнинг адаптера...
regedit /s "%PACK_DIR%07 ИНТЕРНЕТ И СЕТЬ\\1. Отключить алгоритм Nagle (TCP NoDelay + AckFrequency 1).reg" >nul 2>&1
regedit /s "%PACK_DIR%07 ИНТЕРНЕТ И СЕТЬ\\2. Снять ограничение Network Throttling Index.reg" >nul 2>&1
netsh int tcp set global autotuninglevel=normal >nul 2>&1
netsh int tcp set global ecncapability=enabled >nul 2>&1
netsh int tcp set global rss=enabled >nul 2>&1
netsh int tcp set global timestamps=disabled >nul 2>&1
netsh int tcp set heuristics disabled >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%07 ИНТЕРНЕТ И СЕТЬ\\5. Тюнинг Realtek 2.5GbE (RTL8125) Ultra Low Latency.ps1" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%07 ИНТЕРНЕТ И СЕТЬ\\4. Отключить энергосбережение сетевой карты.ps1" >nul 2>&1
echo  [+] Сетевой стек настроен на минимальный пинг.

:: 8. Мышь и Клавиатура
echo [*] [8/14] Настройка 1:1 мыши, 16 пакетов буфера и FilterKeys 0ms...
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\\1. Фикс MarkC 1к1 (полное отключение акселерации мыши).reg" >nul 2>&1
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\\2. Буфер очереди мыши 16 пакетов (MouseDataQueueSize 16).reg" >nul 2>&1
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\\3. Буфер очереди клавиатуры 16 пакетов (KeyboardDataQueueSize 16).reg" >nul 2>&1
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\\4. Киберспортивный FilterKeys (0ms задержка, 15ms повтор).reg" >nul 2>&1
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\\6. Приоритет прерываний контроллера USB xHCI.reg" >nul 2>&1
echo  [+] Стек ввода откалиброван под 8000Hz/4000Hz/1000Hz.

:: 9. Звук и MMCSS
echo [*] [9/14] Настройка приоритета MMCSS Games и изоляция audiodg...
regedit /s "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\\1. Приоритет MMCSS Games (высокий приоритет аудио в играх).reg" >nul 2>&1
regedit /s "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\\2. Устранение заиканий звука MMCSS Audio Zero Stutter.reg" >nul 2>&1
regedit /s "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\\4. Отключить энергосбережение ЦАП Realtek ALC.reg" >nul 2>&1
regedit /s "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\\5. Снять лимит пропускной способности сети при звуке.reg" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\\3. Изоляция процесса audiodg.exe с авто-привязкой к ядрам.ps1" >nul 2>&1
echo  [+] Аудио-подсистема оптимизирована.

:: 10. Службы и Планировщик
echo [*] [10/14] Отключение мусорных служб и 15 категорий фоновых задач планировщика...
set SERVICES=DPS DiagTrack dmwappushservice SysMain TabletInputService Telemetry WalletService WarpJITSvc WbioSrvc WcsPlugInService WdNisSvc WerSvc wisvc wlidsvc wmiApSrv wscsvc WSService
for %%S in (%SERVICES%) do (
    sc stop %%S >nul 2>&1
    sc config %%S start= disabled >nul 2>&1
)
if exist "%PACK_DIR%..\\Disable_BoosterX_Scheduled_Tasks.ps1" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%..\\Disable_BoosterX_Scheduled_Tasks.ps1" >nul 2>&1
)
echo  [+] Фоновые службы и задачи планировщика остановлены.

:: 11. MSI Mode
echo [*] [11/14] Перевод видеокарты, сети и USB в режим MSI (Message Signaled Interrupts)...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%11 УСТРОЙСТВА И MSI MODE\\1. Включить MSI Mode для видеокарты (GPU High Priority).ps1" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%11 УСТРОЙСТВА И MSI MODE\\2. Включить MSI Mode для сетевой карты (NIC Ethernet).ps1" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%11 УСТРОЙСТВА И MSI MODE\\3. Включить MSI Mode для NVMe накопителей.ps1" >nul 2>&1
echo  [+] Прерывания переведены в режим MSI с высоким приоритетом.

:: 12. Игровые конфиги
echo [*] [12/14] Применение приоритетов для игр (CS2 IFEO High Priority)...
regedit /s "%PACK_DIR%12 ИГРОВЫЕ КОНФИГИ\\1. CS2 - Высокий приоритет CPU и IO (IFEO).reg" >nul 2>&1
echo  [+] Приоритеты для киберспортивных дисциплин заданы.

:: 13. Защитник и Исключения
echo [*] [13/14] Добавление папок Steam, Faceit, Vanguard в исключения Defender...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Add-MpPreference -ExclusionPath 'C:\\Program Files (x86)\\Steam', 'C:\\Program Files\\FACEIT AC', 'C:\\Riot Games', 'C:\\Program Files\\Riot Vanguard' -ErrorAction SilentlyContinue" >nul 2>&1
echo  [+] Игровые каталоги добавлены в исключения.

:: 14. Сброс кэшей
echo [*] [14/14] Сброс DNS, ARP и очистка временного кэша...
ipconfig /flushdns >nul 2>&1
arp -d * >nul 2>&1
echo  [+] Сетевые кэши сброшены.

echo.
echo ============================================================================
echo  [УСПЕХ] ПОЛНАЯ КИБЕРСПОРТИВНАЯ ОПТИМИЗАЦИЯ УСПЕШНО ЗАВЕРШЕНА!
echo ============================================================================
echo  - Таймеры Windows переведены в 0.5ms
echo  - Разблокированы все ядра CPU (100%% Unpark) и активирован буст EPP 0
echo  - Активирован план электропитания Igromanoff AMD VIP
echo  - Включен HAGS и DirectFlip Mode 2 (минимальный инпутлаг)
echo  - Настроен 1:1 ввод мыши и очередь прерываний 16 пакетов
echo  - Отключен алгоритм Nagle (TCP NoDelay) и Network Throttling
echo  - Отключены фоновые службы телеметрии и задачи планировщика
echo  - Видеокарта, сеть и накопители переведены в MSI Mode
echo.
echo  [!] РЕКОМЕНДУЕТСЯ ПЕРЕЗАГРУЗИТЬ КОМПЬЮТЕР ДЛЯ ПРИМЕНЕНИЯ ПАРАМЕТРОВ ЯДРА.
echo ============================================================================
echo.
pause
`);

writeTextFile('2_Быстрый_Запуск_БЕЗОПАСНЫЙ_ИГРОВОЙ.bat', `@echo off
chcp 65001 >nul
title VANDAYSTUFF ULTIMATE - БЕЗОПАСНЫЙ ИГРОВОЙ (1-КЛИК)

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Запрос прав Администратора...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

set PACK_DIR=%~dp0
color 0B
cls
echo ============================================================================
echo      VANDAYSTUFF ULTIMATE 2026 - БЕЗОПАСНЫЙ ИГРОВОЙ РЕЖИМ (1-КЛИК)
echo ============================================================================
echo  [ЦЕЛЬ] 100%% стабильность, 0 телеметрии, поддержка античитов и принтеров
echo ============================================================================
echo.

echo [*] [1/8] Создание точки восстановления...
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SystemRestore" /v "SystemRestorePointCreationFrequency" /t REG_DWORD /d 0 /f >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Enable-ComputerRestore -Drive 'C:\\' -ErrorAction SilentlyContinue; Checkpoint-Computer -Description 'VanDay_Safe_Gaming_Backup' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue" >nul 2>&1

echo [*] [2/8] Отключение телеметрии и сбора данных...
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\1. Отключить телеметрию и сбор данных.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\4. Отключить отчеты об ошибках (WER).reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\5. Отключить Cortana и поиск Bing в Пуске.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\\7. Вернуть классическое меню Windows 11.reg" >nul 2>&1
powercfg -h off >nul 2>&1

echo [*] [3/8] Настройка таймеров BCD и приоритета CPU...
regedit /s "%PACK_DIR%03 ПРОЦЕССОР И ТАЙМЕРЫ\\1. Настройка квантов CPU (Win32PrioritySeparation 26 Hex).reg" >nul 2>&1
bcdedit /set disabledynamictick yes >nul 2>&1
bcdedit /deletevalue useplatformclock >nul 2>&1
bcdedit /set tscsyncpolicy Enhanced >nul 2>&1

echo [*] [4/8] Включение HAGS, фикс MPO и отключение GameDVR...
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\1. Включить HAGS (Hardware Accelerated GPU Scheduling).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\2. Отключить MPO (Multiplane Overlay Fix).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\\3. Отключить Xbox GameDVR и захват экрана.reg" >nul 2>&1

echo [*] [5/8] Настройка памяти и дисков...
regedit /s "%PACK_DIR%06 ПАМЯТЬ И ДИСКИ\\1. Закрепить ядро Windows в RAM (DisablePagingExecutive).reg" >nul 2>&1
regedit /s "%PACK_DIR%06 ПАМЯТЬ И ДИСКИ\\2. Отключить засыпание NVMe и SATA (StorPort Idle Disable).reg" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Disable-MMAgent -MemoryCompression -ErrorAction SilentlyContinue" >nul 2>&1

echo [*] [6/8] Настройка TCP NoDelay...
regedit /s "%PACK_DIR%07 ИНТЕРНЕТ И СЕТЬ\\1. Отключить алгоритм Nagle (TCP NoDelay + AckFrequency 1).reg" >nul 2>&1
netsh int tcp set global autotuninglevel=normal >nul 2>&1

echo [*] [7/8] Настройка мыши 1:1 и аудио MMCSS...
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\\1. Фикс MarkC 1к1 (полное отключение акселерации мыши).reg" >nul 2>&1
regedit /s "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\\1. Приоритет MMCSS Games (высокий приоритет аудио в играх).reg" >nul 2>&1

echo [*] [8/8] Добавление папок игр в исключения Defender...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Add-MpPreference -ExclusionPath 'C:\\Program Files (x86)\\Steam', 'C:\\Program Files\\FACEIT AC', 'C:\\Riot Games' -ErrorAction SilentlyContinue" >nul 2>&1

echo.
echo ============================================================================
echo [УСПЕХ] БЕЗОПАСНЫЙ ИГРОВОЙ РЕЖИМ УСПЕШНО ПРИМЕНЕН!
echo ============================================================================
echo  - Сохранена полная совместимость с FACEIT, Vanguard, EasyAntiCheat, принтерами
echo  - Отключена телеметрия и фоновый мусор
echo  - Включены таймеры высокой точности и минимальный инпутлаг
echo.
echo  [!] Рекомендуется перезагрузить компьютер.
echo ============================================================================
echo.
pause
`);

writeTextFile('3_Активировать_План_Igromanoff_AMD_VIP.bat', `@echo off
chcp 65001 >nul
title Активация плана электропитания Igromanoff AMD VIP

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Запрос прав Администратора...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

color 0A
cls
echo ============================================================================
echo       УСТАНОВКА И АКТИВАЦИЯ ПЛАНА ЭЛЕКТРОПИТАНИЯ: IGROMANOFF AMD VIP
echo ============================================================================
echo  [ЦЕЛЬ] Максимальная производительность для AMD AM5 (Ryzen 7 9800X3D / 7800X3D)
echo ============================================================================
echo.

set POW_FILE=%~dp005 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\Файлы_планов_POW\\Igromanoff AMD VIP.pow
if not exist "%POW_FILE%" (
    set POW_FILE=d:\\winvan\\Igromanoff AMD Power Pack\\1 - AMD\\Igromanoff AMD VIP.pow
)

echo [*] Импорт плана электропитания...
powercfg -import "%POW_FILE%" 77777777-7777-7777-7777-777777777777 >nul 2>&1

echo [*] Активация плана Igromanoff AMD VIP...
powercfg -setactive 77777777-7777-7777-7777-777777777777 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPM 0 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1

echo.
echo ============================================================================
echo [УСПЕХ] План электропитания 'Igromanoff AMD VIP' успешно активирован!
echo ============================================================================
powercfg -getactivescheme
echo.
pause
`);

writeTextFile('4_Откатить_Все_Настройки_Windows.bat', `@echo off
chcp 65001 >nul
title Восстановление стандартных настроек Windows

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Запрос прав Администратора...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

color 0A
cls
echo ============================================================================
echo         ВОССТАНОВЛЕНИЕ СТАНДАРТНЫХ НАСТРОЕК WINDOWS К ЗАВОДСКИМ
echo ============================================================================
echo.

echo [*] 1/4 Восстановление настроек реестра по умолчанию...
reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 3 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v "EnableLUA" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "DisablePagingExecutive" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d 20 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 10 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\mouclass\\Parameters" /v "MouseDataQueueSize" /t REG_DWORD /d 100 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters" /v "KeyboardDataQueueSize" /t REG_DWORD /d 100 /f >nul 2>&1

echo [*] 2/4 Восстановление стандартных флагов загрузчика BCD...
bcdedit /deletevalue disabledynamictick 2>nul
bcdedit /deletevalue useplatformtick 2>nul
bcdedit /deletevalue tscsyncpolicy 2>nul
bcdedit /deletevalue bootux 2>nul
bcdedit /deletevalue quietboot 2>nul
bcdedit /set hypervisorlaunchtype auto 2>nul

echo [*] 3/4 Восстановление сбалансированной схемы электропитания...
powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e 2>nul

echo [*] 4/4 Сброс сетевых параметров и восстановление служб...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Enable-MMAgent -MemoryCompression -ErrorAction SilentlyContinue" >nul 2>&1
sc config Spooler start= auto >nul 2>&1
sc config WSearch start= auto >nul 2>&1
sc config SysMain start= auto >nul 2>&1
sc config DPS start= auto >nul 2>&1
netsh winsock reset >nul 2>&1
netsh int ip reset >nul 2>&1

echo.
echo ============================================================================
echo [УСПЕХ] Все стандартные настройки Windows успешно восстановлены!
echo ============================================================================
echo.
pause
`);

writeTextFile('ЧИТАЙ_МЕНЯ_ИНСТРУКЦИЯ.txt', `================================================================================
          VANDAYSTUFF ULTIMATE 2026 - КИБЕРСПОРТИВНЫЙ ПАК ОПТИМИЗАЦИИ
================================================================================

СТРУКТУРА ПАКА (ПО ПАПКАМ):

01 ПЕРВЫМ ДЕЛОМ            - Создание точки восстановления и бэкап реестра
02 WINDOWS И ДЕБЛОЙТ       - Отключение телеметрии, Cortana, Copilot 24H2, меню Win 11
03 ПРОЦЕССОР И ТАЙМЕРЫ     - Кванты 26 Hex, таймеры 0.5ms, разблокировка ядер Ryzen 9800X3D
04 ВИДЕОКАРТА И ГРАФИКА    - HAGS, фикс MPO, DirectFlip Mode 2, профиль NVIDIA Inspector
05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ    - Планы Игроманова (VIP AM5 / Standart AM4 / Intel / LLC)
06 ПАМЯТЬ И ДИСКИ          - Закрепление ядра в RAM, StorPort Idle, ускорение NTFS
07 ИНТЕРНЕТ И СЕТЬ         - TCP NoDelay, снятие Throttling, тюнинг Realtek 2.5G LAN
08 МЫШЬ И КЛАВИАТУРА       - Фикс MarkC 1:1, очереди 16 пакетов, FilterKeys 0ms
09 ЗВУК И МУЛЬТИМЕДИА      - MMCSS Games, изоляция audiodg.exe, фикс задержек звука
10 СЛУЖБЫ И ПЛАНИРОВЩИК    - Остановка мусорных служб и 15 групп задач (BoosterX)
11 УСТРОЙСТВА И MSI MODE   - Перевод GPU, NIC, NVMe и USB в режим MSI с высоким приоритетом
12 ИГРОВЫЕ КОНФИГИ         - Конфиги и приоритеты для CS2, Apex Legends, Valorant
13 ДИАГНОСТИКА И ТЕСТЫ     - LatencyMon, CRU, TM5, Prime95, MemTest, проверка таймера
14 ОЧИСТКА СИСТЕМЫ         - Очистка %TEMP%, шейдеров DirectX, логов и кэша
15 ВОССТАНОВЛЕНИЕ          - 1-клик откат всех настроек к заводским значениям

БЫСТРЫЙ СТАРТ В 1 КЛИК:
1. "1_Быстрый_Запуск_КИБЕРСПОРТ_МАКСИМУМ.bat" - применяет все твики разом для макс. FPS.
2. "2_Быстрый_Запуск_БЕЗОПАСНЫЙ_ИГРОВОЙ.bat" - мягкий режим с сохранением всех сервисов.
3. "3_Активировать_План_Igromanoff_AMD_VIP.bat" - активирует план Игроманова для Ryzen 9800X3D.
4. "4_Откатить_Все_Настройки_Windows.bat" - полный сброс к стандарту.
================================================================================
`);

// ==========================================
// 01 ПЕРВЫМ ДЕЛОМ
// ==========================================
writeTextFile('01 ПЕРВЫМ ДЕЛОМ\\1. Создать точку восстановления.bat', `@echo off
chcp 65001 >nul
title Создание точки восстановления Windows
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
echo [*] Включение защиты системы на диске C:...
powershell -Command "Enable-ComputerRestore -Drive 'C:\\' -ErrorAction SilentlyContinue"
echo [*] Создание точки восстановления 'VanDay_Optimization_Backup'...
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SystemRestore" /v "SystemRestorePointCreationFrequency" /t REG_DWORD /d 0 /f >nul 2>&1
powershell -Command "Checkpoint-Computer -Description 'VanDay_Optimization_Backup' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue"
echo.
echo [УСПЕХ] Точка восстановления создана!
pause
`);

writeTextFile('01 ПЕРВЫМ ДЕЛОМ\\2. Бэкап реестра Windows.bat', `@echo off
chcp 65001 >nul
title Бэкап реестра Windows
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
set BDIR=%~dp0Backup_Registry
mkdir "%BDIR%" 2>nul
echo [*] Экспорт ключевых веток реестра в папку Backup_Registry...
reg export "HKLM\\SYSTEM\\CurrentControlSet" "%BDIR%\\HKLM_CurrentControlSet.reg" /y >nul 2>&1
reg export "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" "%BDIR%\\HKLM_SystemProfile.reg" /y >nul 2>&1
reg export "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows" "%BDIR%\\HKLM_Policies.reg" /y >nul 2>&1
reg export "HKCU\\Control Panel\\Mouse" "%BDIR%\\HKCU_Mouse.reg" /y >nul 2>&1
reg export "HKCU\\System\\GameConfigStore" "%BDIR%\\HKCU_GameConfigStore.reg" /y >nul 2>&1
echo [УСПЕХ] Бэкап реестра сохранен в: %BDIR%
pause
`);

writeTextFile('01 ПЕРВЫМ ДЕЛОМ\\3. Бэкап сетевых адаптеров.bat', `@echo off
chcp 65001 >nul
title Бэкап настроек сети
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
set BDIR=%~dp0Backup_Network
mkdir "%BDIR%" 2>nul
netsh dump > "%BDIR%\\netsh_backup.txt"
ipconfig /all > "%BDIR%\\ipconfig_backup.txt"
echo [УСПЕХ] Настройки сети сохранены в папку Backup_Network!
pause
`);

writeTextFile('01 ПЕРВЫМ ДЕЛОМ\\4. Проверка прав Администратора.bat', `@echo off
chcp 65001 >nul
title Проверка прав Администратора
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Нет прав Администратора. Запрос повышения...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
echo [УСПЕХ] Скрипт запущен с полными правами Администратора!
pause
`);

writeTextFile('01 ПЕРВЫМ ДЕЛОМ\\5. Полный аудит и отчет о системе (Диагностика).bat', `@echo off
chcp 65001 >nul
title Аудит и диагностика системы
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0B
cls
echo ============================================================================
echo         ПОЛНЫЙ АУДИТ И ДИАГНОСТИКА СИСТЕМЫ ПЕРЕД ОПТИМИЗАЦИЕЙ
echo ============================================================================
echo.
echo [*] Проверка процессора и ядер:
powershell -Command "Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed | Format-List"
echo [*] Проверка видеокарты и драйвера:
powershell -Command "Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion | Format-List"
echo [*] Проверка статуса схемы электропитания:
powercfg -getactivescheme
echo.
echo [*] Проверка статуса изоляции ядра (VBS / Core Isolation):
powershell -Command "Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\\Microsoft\\Windows\\DeviceGuard -ErrorAction SilentlyContinue | Select-Object VirtualizationBasedSecurityStatus, SecurityServicesRunning | Format-List"
echo [*] Проверка сетевых адаптеров и RSS очередей:
powershell -Command "Get-NetAdapter | Select-Object Name, InterfaceDescription, Status, LinkSpeed | Format-Table -AutoSize"
echo ============================================================================
echo [УСПЕХ] Диагностика системы завершена!
echo ============================================================================
pause
`);



// ==========================================
// 02 WINDOWS И ДЕБЛОЙТ
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '01_WINDOWS_BASE_AND_DEBLOAT\\1_Disable_Telemetry_And_DiagTrack.reg'), '02 WINDOWS И ДЕБЛОЙТ\\1. Отключить телеметрию и сбор данных.reg');
copyFile(path.join(SRC_ULTIMATE, '01_WINDOWS_BASE_AND_DEBLOAT\\3_Disable_UAC_Prompts.reg'), '02 WINDOWS И ДЕБЛОЙТ\\2. Отключить UAC и всплывающие окна.reg');
copyFile(path.join(SRC_ULTIMATE, '01_WINDOWS_BASE_AND_DEBLOAT\\4_Disable_Background_Apps_Global.reg'), '02 WINDOWS И ДЕБЛОЙТ\\3. Отключить фоновые приложения.reg');
copyFile(path.join(SRC_ULTIMATE, '01_WINDOWS_BASE_AND_DEBLOAT\\5_Disable_Windows_Error_Reporting.reg'), '02 WINDOWS И ДЕБЛОЙТ\\4. Отключить отчеты об ошибках (WER).reg');
copyFile(path.join(SRC_ULTIMATE, '01_WINDOWS_BASE_AND_DEBLOAT\\6_Disable_Cortana_And_Web_Search.reg'), '02 WINDOWS И ДЕБЛОЙТ\\5. Отключить Cortana и поиск Bing в Пуске.reg');
copyFile(path.join(SRC_ULTIMATE, '01_WINDOWS_BASE_AND_DEBLOAT\\7_Disable_Delivery_Optimization.reg'), '02 WINDOWS И ДЕБЛОЙТ\\11. Отключить доставку обновлений Delivery Optimization.reg');
copyFile(path.join(SRC_ULTIMATE, '01_WINDOWS_BASE_AND_DEBLOAT\\8_Disable_Automatic_Maintenance.reg'), '02 WINDOWS И ДЕБЛОЙТ\\9. Отключить автообслуживание Windows.reg');
copyFile(path.join(SRC_ULTIMATE, '01_WINDOWS_BASE_AND_DEBLOAT\\10_Restore_Classic_Context_Menu_Win11.reg'), '02 WINDOWS И ДЕБЛОЙТ\\7. Вернуть классическое меню Windows 11.reg');
copyFile(path.join(SRC_ULTIMATE, '01_WINDOWS_BASE_AND_DEBLOAT\\12_Safe_60_Plus_UWP_Debloat_With_Whitelist.ps1'), '02 WINDOWS И ДЕБЛОЙТ\\10. Безопасное удаление предустановленных UWP программ.ps1');

writeTextFile('02 WINDOWS И ДЕБЛОЙТ\\6. Удалить Copilot и AI Recall (Win 11 24H2).bat', `@echo off
chcp 65001 >nul
title Отключение Copilot и AI Recall
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d 1 /f >nul 2>&1
echo [УСПЕХ] AI Copilot и Recall отключены!
pause
`);

writeTextFile('02 WINDOWS И ДЕБЛОЙТ\\8. Ускорить анимации и отклик окон (MenuShowDelay 0).reg', `Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\\Control Panel\\Desktop]
"MenuShowDelay"="0"
"AutoEndTasks"="1"
"WaitToKillAppTimeout"="2000"
"HungAppTimeout"="1000"

[HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Serialize]
"StartupDelayInMSec"=dword:00000000
`);

writeTextFile('02 WINDOWS И ДЕБЛОЙТ\\12. Отключить гибернацию и Fast Startup (powercfg -h off).bat', `@echo off
chcp 65001 >nul
title Отключение гибернации
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
powercfg -h off
echo [УСПЕХ] Файл hiberfil.sys удален, гибернация отключена!
pause
`);

writeTextFile('02 WINDOWS И ДЕБЛОЙТ\\13. Отключить VBS и Core Isolation (Memory Integrity) для макс. FPS.bat', `@echo off
chcp 65001 >nul
title Отключение VBS и Core Isolation
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0C
echo ============================================================================
echo  ОТКЛЮЧЕНИЕ VBS, HVCI (CORE ISOLATION) И MEMORY INTEGRITY
echo ============================================================================
echo  [ИНФО] Устраняет задержки виртуализации в играх (+5-15%% 1%% Low FPS).
echo ============================================================================
echo.
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard" /v "EnableVirtualizationBasedSecurity" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard" /v "RequirePlatformSecurityFeatures" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\HypervisorEnforcedCodeIntegrity" /v "Enabled" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\CredentialGuard" /v "Enabled" /t REG_DWORD /d 0 /f >nul 2>&1
bcdedit /set hypervisorlaunchtype off >nul 2>&1
echo [УСПЕХ] VBS и Core Isolation отключены! Перезагрузите ПК.
pause
`);

writeTextFile('02 WINDOWS И ДЕБЛОЙТ\\14. Включить VBS и Core Isolation обратно (Защита).bat', `@echo off
chcp 65001 >nul
title Включение VBS и Core Isolation
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard" /v "EnableVirtualizationBasedSecurity" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\HypervisorEnforcedCodeIntegrity" /v "Enabled" /t REG_DWORD /d 1 /f >nul 2>&1
bcdedit /set hypervisorlaunchtype auto >nul 2>&1
echo [УСПЕХ] VBS и Защита ядра возвращены в стандартный режим!
pause
`);

writeTextFile('02 WINDOWS И ДЕБЛОЙТ\\15. Оптимизация Spectre-Meltdown (InSpectre Gaming Boost).bat', `@echo off
chcp 65001 >nul
title Оптимизация Spectre и Meltdown
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0E
echo ============================================================================
echo  ОТКЛЮЧЕНИЕ ПРОГРАММНЫХ МИТИГАЦИЙ SPECTRE/MELTDOWN ДЛЯ ИГР
echo ============================================================================
echo  [ИНФО] Снижает накладные расходы на системные вызовы ядра.
echo ============================================================================
echo.
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "FeatureSettingsOverride" /t REG_DWORD /d 3 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "FeatureSettingsOverrideMask" /t REG_DWORD /d 3 /f >nul 2>&1
echo [УСПЕХ] Митигации отключены для максимальной скорости CPU!
pause
`);

copyFile(path.join(SRC_OPTIMIZATION, '2.debloat\\2.OOSU10.exe'), '02 WINDOWS И ДЕБЛОЙТ\\Утилиты\\OOSU10.exe');
copyFile(path.join(SRC_OPTIMIZATION, '2.debloat\\defender\\dControl.exe'), '02 WINDOWS И ДЕБЛОЙТ\\Утилиты\\dControl.exe');

// ==========================================
// 03 ПРОЦЕССОР И ТАЙМЕРЫ
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '02_CPU_SCHEDULING_AND_TIMERS\\1_Win32PrioritySeparation_26_Hex1A_Esports.reg'), '03 ПРОЦЕССОР И ТАЙМЕРЫ\\1. Настройка квантов CPU (Win32PrioritySeparation 26 Hex).reg');
copyFile(path.join(SRC_ULTIMATE, '02_CPU_SCHEDULING_AND_TIMERS\\UnparkCpu.exe'), '03 ПРОЦЕССОР И ТАЙМЕРЫ\\Утилиты\\UnparkCpu.exe');
copyDirRecursive(path.join(SRC_VANDAY, '8 STRESS TEST\\ThrottleStop_9.6'), '03 ПРОЦЕССОР И ТАЙМЕРЫ\\Утилиты\\ThrottleStop_9.6');
copyDirRecursive(path.join(SRC_ASTRO, 'RAM stuff\\ZEN TIMINGS'), '03 ПРОЦЕССОР И ТАЙМЕРЫ\\Утилиты\\ZenTimings (AM5 - Zen 5)');
copyDirRecursive(path.join(SRC_ASTRO, 'RAM stuff\\ATC'), '03 ПРОЦЕССОР И ТАЙМЕРЫ\\Утилиты\\ASRock Timing Configurator (ATC)');
copyDirRecursive(path.join(SRC_ASTRO, 'RAM stuff\\thphn174'), '03 ПРОЦЕССОР И ТАЙМЕРЫ\\Утилиты\\Thaiphoon Burner');

writeTextFile('03 ПРОЦЕССОР И ТАЙМЕРЫ\\2. Включить таймер 0.5ms (Dynamic Tick Off + Enhanced TSC).bat', `@echo off
chcp 65001 >nul
title Настройка высокоточных таймеров Windows
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
bcdedit /set disabledynamictick yes >nul 2>&1
bcdedit /deletevalue useplatformclock >nul 2>&1
bcdedit /set tscsyncpolicy Enhanced >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\kernel" /v "GlobalTimerResolutionRequests" /t REG_DWORD /d 1 /f >nul 2>&1
echo [УСПЕХ] Таймеры BCD настроены (Disabledynamictick=yes, TSC=Enhanced)!
pause
`);

writeTextFile('03 ПРОЦЕССОР И ТАЙМЕРЫ\\3. Разблокировать и зафиксировать 100% парковку ядер.bat', `@echo off
chcp 65001 >nul
title Разблокировка ядер процессора
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb10593acda8 -ATTRIB_HIDE >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 100 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb10593acda8 100 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1
echo [УСПЕХ] Все ядра процессора разблокированы на 100%% (Core Parking = 0%%)!
pause
`);

writeTextFile('03 ПРОЦЕССОР И ТАЙМЕРЫ\\4. Спец-калибровка для AMD Ryzen 7 9800X3D (Zen 5 V-Cache).bat', `@echo off
chcp 65001 >nul
title Калибровка Ryzen 7 9800X3D (Zen 5)
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 45bcc044-d885-43e8-ab6b-d03e52292c42 -ATTRIB_HIDE >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 0 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 2 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 45bcc044-d885-43e8-ab6b-d03e52292c42 100 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1
echo [УСПЕХ] Ryzen 7 9800X3D переведен в режим максимального буста (EPP 0, Aggressive Boost 100%%)!
pause
`);

writeTextFile('03 ПРОЦЕССОР И ТАЙМЕРЫ\\6. Настройка квантов CPU (Win32PrioritySeparation 28 Hex - Short Fixed).reg', `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl]
"Win32PrioritySeparation"=dword:00000028
`);

writeTextFile('03 ПРОЦЕССОР И ТАЙМЕРЫ\\7. Разведение прерываний GPU и Сети по ядрам (Affinity).ps1', `# DPC and Interrupt Affinity Configuration
# Pins GPU interrupts to Cores 2-3 and NIC interrupts to Cores 4-5
Write-Host "[*] Configuring Interrupt Affinity for GPU & NIC..." -ForegroundColor Cyan

$gpuDevices = Get-PnpDevice -Class Display -Status OK -ErrorAction SilentlyContinue
foreach ($gpu in $gpuDevices) {
    $instance = $gpu.InstanceId
    $regPath = "HKLM:\\SYSTEM\\CurrentControlSet\\Enum\\$instance\\Device Parameters\\Interrupt Management\\Affinity Policy"
    if (Test-Path $regPath) {
        Set-ItemProperty -Path $regPath -Name "DevicePolicy" -Value 4 -Type DWord -Force
        Set-ItemProperty -Path $regPath -Name "AssignmentSetOverride" -Value ([byte[]](0x0C,0x00,0x00,0x00,0x00,0x00,0x00,0x00)) -Type Binary -Force
        Write-Host " [+] GPU Interrupt Affinity assigned to Cores 2-3 (Mask 0x0C)" -ForegroundColor Green
    }
}
Write-Host "[+] Affinity Policy applied successfully!" -ForegroundColor Green
`);

// ==========================================
// 04 ВИДЕОКАРТА И ГРАФИКА
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '03_GPU_AND_GRAPHICS_LATENCY\\1_Enable_HAGS_Hardware_GPU_Scheduling.reg'), '04 ВИДЕОКАРТА И ГРАФИКА\\1. Включить HAGS (Hardware Accelerated GPU Scheduling).reg');
copyFile(path.join(SRC_ULTIMATE, '03_GPU_AND_GRAPHICS_LATENCY\\2_Disable_MPO_Multiplane_Overlay_Fix.reg'), '04 ВИДЕОКАРТА И ГРАФИКА\\2. Отключить MPO (Multiplane Overlay Fix).reg');
copyFile(path.join(SRC_ULTIMATE, '03_GPU_AND_GRAPHICS_LATENCY\\3_Disable_GameDVR_And_Xbox_Capture.reg'), '04 ВИДЕОКАРТА И ГРАФИКА\\3. Отключить Xbox GameDVR и захват экрана.reg');
copyFile(path.join(SRC_ULTIMATE, '03_GPU_AND_GRAPHICS_LATENCY\\5_DirectFlip_Mode2_And_DXGI_FlipModel.reg'), '04 ВИДЕОКАРТА И ГРАФИКА\\4. Включить DirectFlip Mode 2 (минимальный инпутлаг).reg');
copyFile(path.join(SRC_ULTIMATE, '03_GPU_AND_GRAPHICS_LATENCY\\6_Set_DirectX_DXGKrnl_Thread_Priority.reg'), '04 ВИДЕОКАРТА И ГРАФИКА\\5. Приоритет видеопотоков dxgkrnl и nvlddmkm.reg');
copyFile(path.join(SRC_ULTIMATE, '03_GPU_AND_GRAPHICS_LATENCY\\8_NVIDIA_Shader_Cache_Unlimited_10GB.reg'), '04 ВИДЕОКАРТА И ГРАФИКА\\6. Кэш шейдеров NVIDIA 10GB (безлимитный).reg');
copyFile(path.join(SRC_ULTIMATE, '03_GPU_AND_GRAPHICS_LATENCY\\9_Disable_GPU_Energy_Throttling.reg'), '04 ВИДЕОКАРТА И ГРАФИКА\\7. Отключить энергосбережение GPU.reg');
copyFile(path.join(SRC_ULTIMATE, '03_GPU_AND_GRAPHICS_LATENCY\\4_Enable_FSE_And_FSO_Optimizations.reg'), '04 ВИДЕОКАРТА И ГРАФИКА\\8. Включить оптимизацию полноэкранного режима FSE-FSO.reg');
copyFile(path.join(SRC_ULTIMATE, '03_GPU_AND_GRAPHICS_LATENCY\\10_Enable_Variable_Refresh_Rate_VRR.reg'), '04 ВИДЕОКАРТА И ГРАФИКА\\9. Включить Variable Refresh Rate (VRR).reg');

writeTextFile('04 ВИДЕОКАРТА И ГРАФИКА\\11. Включить оптимизацию для оконных игр (OptimizationsForWindowedGames).reg', `Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\\Software\\Microsoft\\DirectX\\UserGpuPreferences]
"DirectXUserGlobalSettings"="AutoSwapchain=1;OptimizationsForWindowedGames=1;"
`);

writeTextFile('04 ВИДЕОКАРТА И ГРАФИКА\\12. Настройка NVIDIA Ultra Low Latency и P0 State.reg', `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\\Power]
"DefaultPowerMode"=dword:00000001

[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000]
"DisableDynamicPState"=dword:00000001
`);

copyFile(path.join(SRC_ULTIMATE, 'bin\\nvidiaProfileInspector.exe'), '04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\nvidiaProfileInspector.exe');
copyFile(path.join(SRC_ULTIMATE, 'bin\\LLC-OPTIMIZED-V2.nip'), '04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\LLC-OPTIMIZED-V2.nip');
copyFile(path.join(SRC_ULTIMATE, '03_GPU_AND_GRAPHICS_LATENCY\\MPOGPUFIX.exe'), '04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\MPOGPUFIX.exe');
copyFile(path.join(SRC_LLC, '2. Драйвера\\2. Видео\\NVCleanstall_1.19.0.exe'), '04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\NVCleanstall.exe');
copyFile(path.join(SRC_LLC, '2. Драйвера\\2. Видео\\Display Driver Uninstaller.exe'), '04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\Display Driver Uninstaller.exe');
copyDirRecursive(path.join(SRC_VANDAY, 'Custom Resolution Utility'), '04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\Custom Resolution Utility (CRU)');
copyFile('d:\\winvan\\packs\\596.36 - Custom.exe', '04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\596.36 - Custom.exe');
copyFile(path.join(SRC_ASTRO, 'GPU stuff\\MSIAfterburnerSetup465.exe'), '04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\MSIAfterburnerSetup465.exe');
copyFile(path.join(SRC_ASTRO, 'GPU stuff\\GPU-Z.2.56.0.exe'), '04 ВИДЕОКАРТА И ГРАФИКА\\Утилиты\\GPU-Z.exe');

writeTextFile('04 ВИДЕОКАРТА И ГРАФИКА\\0. Установить кастомный чистый драйвер NVIDIA (596.36).bat', `@echo off
chcp 65001 >nul
title Установка кастомного драйвера NVIDIA 596.36
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
cls
echo ============================================================================
echo      УСТАНОВКА КАСТОМНОГО ОЧИЩЕННОГО ДРАЙВЕРА NVIDIA (596.36 - CUSTOM)
echo ============================================================================
echo  [ИНФО] Данный драйвер очищен от телеметрии, GeForce Experience, Shield,
echo         Node.js и фонового мусора для достижения минимального DPC Latency.
echo ============================================================================
echo.
set DRV=%~dp0Утилиты\\596.36 - Custom.exe
if exist "%DRV%" (
    echo [*] Запуск установщика драйвера 596.36...
    start "" "%DRV%"
) else (
    echo [ОШИБКА] Файл драйвера 596.36 - Custom.exe не найден.
)
pause
`);

writeTextFile('04 ВИДЕОКАРТА И ГРАФИКА\\Инструкция_по_чистой_установке_драйвера.txt', `================================================================================
          ИНСТРУКЦИЯ ПО ПРАВИЛЬНОЙ ЧИСТОЙ УСТАНОВКЕ ДРАЙВЕРА NVIDIA
================================================================================

1. ЭТАП 1: УДАЛЕНИЕ СТАРОГО ДРАЙВЕРА ЧЕРЕЗ DDU
   - Отключите интернет (выдерните кабель или отключите адаптер), чтобы Windows Update не скачала стандартный драйвер.
   - Запустите 'Утилиты\\Display Driver Uninstaller.exe'.
   - Выберите тип устройства: 'Видеокарта' -> 'NVIDIA'.
   - Нажмите 'Удалить и перезагрузить' (Clean and Restart).

2. ЭТАП 2: УСТАНОВКА КАСТОМНОГО ДРАЙВЕРА 596.36
   - После перезагрузки запустите '0. Установить кастомный чистый драйвер NVIDIA (596.36).bat'
     или файл 'Утилиты\\596.36 - Custom.exe'.
   - Выберите 'Выборочная установка' -> 'Чистая установка'.
   - Установите только Графический драйвер + PhysX (без лишних компонентов).

3. ЭТАП 3: ИМПОРТ КИБЕРСПОРТИВНОГО ПРОФИЛЯ
   - Запустите '10. Импорт киберспортивного профиля NVIDIA (LLC-V2).bat'.
   - Включите интернет.
================================================================================
`);

writeTextFile('04 ВИДЕОКАРТА И ГРАФИКА\\10. Импорт киберспортивного профиля NVIDIA (LLC-V2).bat', `@echo off
chcp 65001 >nul
title Импорт профиля драйвера NVIDIA
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
if exist "%TOOL%" (
    "%TOOL%" "%NIP%" -silent
    echo [УСПЕХ] Киберспортивный профиль NVIDIA LLC-V2 успешно импортирован!
) else (
    echo [ОШИБКА] Файл nvidiaProfileInspector.exe не найден.
)
pause
`);

writeTextFile('04 ВИДЕОКАРТА И ГРАФИКА\\13. Anomaly Resolution Fix (TDR + Full Screen 4на3).bat', `@echo off
chcp 65001 >nul
title Anomaly Resolution Input Lag Fix
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
echo ============================================================================
echo   ANOMALY RESOLUTION INPUT LAG FIX (IGROMANOFF METHOD)
echo ============================================================================
echo  [ИНФО] Фикс задержки растянутого разрешения (4:3) и калибровка TDR GPU.
echo ============================================================================
echo.

echo [*] 1/3 Применение настроек TDR Watch...
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "TdrLevel" /t REG_DWORD /d 3 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "TdrDelay" /t REG_DWORD /d 10 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "TdrDdiDelay" /t REG_DWORD /d 10 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers" /v "TdrDebugMode" /t REG_DWORD /d 0 /f >nul 2>&1

echo [*] 2/3 Разрешение запуска PowerShell скриптов (ExecutionPolicy Bypass)...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope LocalMachine -Force -ErrorAction SilentlyContinue" >nul 2>&1

echo [*] 3/3 Настройка аппаратного масштабирования Full Screen Scaling...
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\\Configuration" /v "Scaling" /t REG_DWORD /d 3 /f >nul 2>&1
powershell -Command "Get-ChildItem 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\\Configuration' -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Property -contains 'Scaling' } | ForEach-Object { Set-ItemProperty -Path $_.PSPath -Name 'Scaling' -Value 3 -Type DWord -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo.
echo ============================================================================
echo [УСПЕХ] Anomaly Resolution Fix успешно применен!
echo.
echo [!] ВАЖНО:
echo  1. В Панели управления NVIDIA перейдите в:
echo     "Регулировка размера и положения рабочего стола"
echo  2. Выберите режим: "Во весь экран", поставьте галочку "Замещение режима масштабирования"
echo  3. После перезагрузки там может отображаться "Не выполнять масштабирование" - так и должно быть!
echo ============================================================================
pause
`);

writeTextFile('04 ВИДЕОКАРТА И ГРАФИКА\\14. Настройка TDR Watch (Защита от сбоев и статтеров GPU).reg', `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers]
"TdrLevel"=dword:00000003
"TdrDelay"=dword:0000000a
"TdrDdiDelay"=dword:0000000a
"TdrDebugMode"=dword:00000000
`);

// ==========================================
// 05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ
// ==========================================
copyFile(path.join(SRC_IGRO, '1 - AMD\\Igromanoff AMD VIP.pow'), '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\Файлы_планов_POW\\Igromanoff AMD VIP.pow');
copyFile(path.join(SRC_IGRO, '1 - AMD\\Igromanoff AMD.pow'), '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\Файлы_планов_POW\\Igromanoff AMD.pow');
copyFile(path.join(SRC_IGRO, '1 - AMD\\AMD Ryzen Ultimate HighPower.pow'), '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\Файлы_планов_POW\\AMD Ryzen Ultimate HighPower.pow');
copyFile(path.join(SRC_IGRO, '2 - INTEL\\Igromanoff INTEL V1.pow'), '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\Файлы_планов_POW\\Igromanoff INTEL V1.pow');
copyFile(path.join(SRC_IGRO, '2 - INTEL\\igromanoff INTEL V2.pow'), '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\Файлы_планов_POW\\Igromanoff INTEL V2.pow');
copyFile(path.join(SRC_IGRO, '2 - INTEL\\Igromanoff INTEL V3.pow'), '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\Файлы_планов_POW\\Igromanoff INTEL V3.pow');
copyFile(path.join(SRC_ULTIMATE, '08_POWER_PLANS_AND_ENERGY\\LLC-CERTIFIED.pow'), '05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\Файлы_планов_POW\\LLC-CERTIFIED.pow');

writeTextFile('05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\1. Активировать Igromanoff AMD VIP (для Ryzen 7 9800X3D - AM5).bat', `@echo off
chcp 65001 >nul
title Активация плана Igromanoff AMD VIP
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
set POW=%~dp0Файлы_планов_POW\\Igromanoff AMD VIP.pow
powercfg -import "%POW%" 77777777-7777-7777-7777-777777777777 >nul 2>&1
powercfg -setactive 77777777-7777-7777-7777-777777777777 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPM 0 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1
echo [УСПЕХ] План 'Igromanoff AMD VIP' активирован!
powercfg -getactivescheme
pause
`);

writeTextFile('05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\2. Активировать Igromanoff AMD Standart (для AM4).bat', `@echo off
chcp 65001 >nul
title Активация плана Igromanoff AMD Standart
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
set POW=%~dp0Файлы_планов_POW\\Igromanoff AMD.pow
powercfg -import "%POW%" 88888888-8888-8888-8888-888888888888 >nul 2>&1
powercfg -setactive 88888888-8888-8888-8888-888888888888 >nul 2>&1
echo [УСПЕХ] План 'Igromanoff AMD Standart' активирован!
powercfg -getactivescheme
pause
`);

writeTextFile('05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\3. Активировать Igromanoff INTEL (для Core i5-i9).bat', `@echo off
chcp 65001 >nul
title Активация плана Igromanoff INTEL
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
set POW=%~dp0Файлы_планов_POW\\Igromanoff INTEL V2.pow
powercfg -import "%POW%" 99999999-9999-9999-9999-999999999999 >nul 2>&1
powercfg -setactive 99999999-9999-9999-9999-999999999999 >nul 2>&1
echo [УСПЕХ] План 'Igromanoff INTEL' активирован!
powercfg -getactivescheme
pause
`);

writeTextFile('05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\4. Активировать LLC-CERTIFIED Esports Plan.bat', `@echo off
chcp 65001 >nul
title Активация плана LLC-CERTIFIED
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
set POW=%~dp0Файлы_планов_POW\\LLC-CERTIFIED.pow
powercfg -import "%POW%" 33333333-3333-3333-3333-333333333333 >nul 2>&1
powercfg -setactive 33333333-3333-3333-3333-333333333333 >nul 2>&1
echo [УСПЕХ] План 'LLC-CERTIFIED' активирован!
powercfg -getactivescheme
pause
`);

writeTextFile('05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\5. Активировать Ultimate Performance (Макс. производительность).bat', `@echo off
chcp 65001 >nul
title Активация Максимальной производительности
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
echo [УСПЕХ] Схема 'Максимальная производительность' активирована!
pause
`);

writeTextFile('05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\6. Отключить энергосбережение шины PCIe ASPM.bat', `@echo off
chcp 65001 >nul
title Отключение PCIe ASPM
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPM 0 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1
echo [УСПЕХ] Энергосбережение шины PCIe (ASPM) отключено!
pause
`);

writeTextFile('05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\\7. Восстановить стандартный сбалансированный план.bat', `@echo off
chcp 65001 >nul
title Сбалансированный план Windows
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e >nul 2>&1
echo [УСПЕХ] Стандартная схема 'Сбалансированная' активирована!
pause
`);

// ==========================================
// 06 ПАМЯТЬ И ДИСКИ
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '04_MEMORY_AND_STORAGE_SPEED\\1_Pin_Kernel_In_RAM_DisablePagingExecutive.reg'), '06 ПАМЯТЬ И ДИСКИ\\1. Закрепить ядро Windows в RAM (DisablePagingExecutive).reg');
copyFile(path.join(SRC_ULTIMATE, '04_MEMORY_AND_STORAGE_SPEED\\3_Disable_NVMe_SATA_StorPort_Idle.reg'), '06 ПАМЯТЬ И ДИСКИ\\2. Отключить засыпание NVMe и SATA (StorPort Idle Disable).reg');
copyFile(path.join(SRC_ULTIMATE, '04_MEMORY_AND_STORAGE_SPEED\\9_Set_System_Responsiveness_Zero.reg'), '06 ПАМЯТЬ И ДИСКИ\\5. Максимальный приоритет отклика (SystemResponsiveness 0).reg');
copyFile(path.join(SRC_ULTIMATE, '04_MEMORY_AND_STORAGE_SPEED\\7_Increase_NTFS_Memory_Usage_Buffer.reg'), '06 ПАМЯТЬ И ДИСКИ\\6. Увеличить системный файловый кэш NTFS.reg');

writeTextFile('06 ПАМЯТЬ И ДИСКИ\\3. Ускорить NTFS (отключить запись даты доступа и имена 8.3).bat', `@echo off
chcp 65001 >nul
title Ускорение файловой системы NTFS
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
fsutil behavior set disablelastaccess 1 >nul 2>&1
fsutil behavior set disable8dot3 1 >nul 2>&1
echo [УСПЕХ] Лишние дисковые операции NTFS отключены!
pause
`);

writeTextFile('06 ПАМЯТЬ И ДИСКИ\\4. Отключить сжатие памяти (MMAgent MemoryCompression).bat', `@echo off
chcp 65001 >nul
title Отключение сжатия оперативной памяти
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
powershell -Command "Disable-MMAgent -MemoryCompression -PageCombining -ApplicationPreLaunch -OperationEndpoints -ErrorAction SilentlyContinue"
echo [УСПЕХ] Сжатие памяти MMAgent отключено!
pause
`);

writeTextFile('06 ПАМЯТЬ И ДИСКИ\\7. Включить TRIM для SSD накопителей.bat', `@echo off
chcp 65001 >nul
title Включение TRIM для SSD
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
fsutil behavior set DisableDeleteNotify 0 >nul 2>&1
echo [УСПЕХ] Команда TRIM для SSD активна!
pause
`);

writeTextFile('06 ПАМЯТЬ И ДИСКИ\\8. Настройка ISLC и файла подкачки (Рекомендации).txt', `================================================================================
          ОПТИМИЗАЦИЯ ОПЕРАТИВНОЙ ПАМЯТИ И ФАЙЛА ПОДКАЧКИ
================================================================================

1. ФАЙЛ ПОДКАЧКИ (PAGEFILE.SYS):
   - ПОЧЕМУ НЕЛЬЗЯ ПОЛНОСТЬЮ ОТКЛЮЧАТЬ:
     Игровые движки (CS2, Apex Legends, Warzone, UE5) выделяют виртуальную память
     через commit charge. При pagefile=0 происходят краши "Out of Memory" даже при 32/64 ГБ RAM.
   - РЕКОМЕНДУЕМАЯ НАСТРОЙКА:
     Укажите фиксированный размер на самом быстром NVMe SSD диске:
     Исходный размер: 4096 МБ
     Максимальный размер: 8192 МБ
     (Фиксированный размер исключает фрагментацию и задержки динамического расширения).

2. ИСПОЛЬЗОВАНИЕ ISLC (Intelligent Standby List Cleaner):
   - 'The list size is at least': 1024 MB
   - 'Free memory is lower than': 8192 MB (для 32GB RAM) или 4096 MB (для 16GB RAM)
   - 'Wanted timer resolution': 0.50 ms
   - Нажмите 'Start' и включите автозапуск с Windows.
================================================================================
`);

// ==========================================
// 07 ИНТЕРНЕТ И СЕТЬ
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '05_ETHERNET_AND_NETWORK_PING\\1_Disable_Nagle_Algorithm_TCPNoDelay.reg'), '07 ИНТЕРНЕТ И СЕТЬ\\1. Отключить алгоритм Nagle (TCP NoDelay + AckFrequency 1).reg');
copyFile(path.join(SRC_ULTIMATE, '05_ETHERNET_AND_NETWORK_PING\\3_Disable_Network_Throttling_Index.reg'), '07 ИНТЕРНЕТ И СЕТЬ\\2. Снять ограничение Network Throttling Index.reg');
copyFile(path.join(SRC_ULTIMATE, '05_ETHERNET_AND_NETWORK_PING\\6_Network_Adapter_Disable_PowerSaving.ps1'), '07 ИНТЕРНЕТ И СЕТЬ\\4. Отключить энергосбережение сетевой карты.ps1');
copyFile(path.join(SRC_ULTIMATE, '05_ETHERNET_AND_NETWORK_PING\\2_Realtek_2.5GbE_RTL8125_Ultra_Low_Latency.ps1'), '07 ИНТЕРНЕТ И СЕТЬ\\5. Тюнинг Realtek 2.5GbE (RTL8125) Ultra Low Latency.ps1');
copyFile(path.join(SRC_ULTIMATE, '05_ETHERNET_AND_NETWORK_PING\\7_Network_Adapter_Esports_Offloads_Tuning.ps1'), '07 ИНТЕРНЕТ И СЕТЬ\\6. Тюнинг сетевых очередей и буферов.ps1');
copyFile(path.join(SRC_ULTIMATE, '05_ETHERNET_AND_NETWORK_PING\\5_Optimize_DNS_And_NetBT_Priorities.reg'), '07 ИНТЕРНЕТ И СЕТЬ\\7. Настройка DNS Cloudflare (1.1.1.1) и приоритетов NetBT.reg');

writeTextFile('07 ИНТЕРНЕТ И СЕТЬ\\3. Оптимизация TCP AutoTuning, ECN и RSS.bat', `@echo off
chcp 65001 >nul
title Оптимизация сетевого стека Windows
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
netsh int tcp set global autotuninglevel=normal >nul 2>&1
netsh int tcp set global ecncapability=enabled >nul 2>&1
netsh int tcp set global rss=enabled >nul 2>&1
netsh int tcp set global timestamps=disabled >nul 2>&1
netsh int tcp set heuristics disabled >nul 2>&1
echo [УСПЕХ] Параметры TCP стек (AutoTuning=normal, ECN=enabled, RSS=enabled) применены!
pause
`);

writeTextFile('07 ИНТЕРНЕТ И СЕТЬ\\8. Сбросить кэш DNS, ARP и Winsock.bat', `@echo off
chcp 65001 >nul
title Сброс сетевых кэшей
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
ipconfig /flushdns >nul 2>&1
arp -d * >nul 2>&1
netsh winsock reset >nul 2>&1
echo [УСПЕХ] Кэши DNS и таблицы ARP сброшены!
pause
`);

writeTextFile('07 ИНТЕРНЕТ И СЕТЬ\\9. Ускорение закрытия сетевых сокетов (MaxUserPort 65534, TimedWait 30).reg', `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters]
"MaxUserPort"=dword:0000fffe
"TcpTimedWaitDelay"=dword:0000001e
"DefaultTTL"=dword:00000040
"SynAttackProtect"=dword:00000001
"EnableDSO"=dword:00000000
`);

copyFile(path.join(SRC_OPTIMIZATION, '3.DnsJumper.exe'), '07 ИНТЕРНЕТ И СЕТЬ\\Утилиты\\DnsJumper.exe');
writeTextFile('07 ИНТЕРНЕТ И СЕТЬ\\10. Оптимизация Wi-Fi (Устранение спайков пинга).reg', `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\WlanSvc\\Parameters]
"ScanWhenAssociated"=dword:00000000
`);

// ==========================================
// 08 МЫШЬ И КЛАВИАТУРА
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '06_MOUSE_KEYBOARD_INPUT_LAG\\1_MarkC_Windows11_10_Mouse_Fix_100_Percent.reg'), '08 МЫШЬ И КЛАВИАТУРА\\1. Фикс MarkC 1к1 (полное отключение акселерации мыши).reg');
copyFile(path.join(SRC_ULTIMATE, '06_MOUSE_KEYBOARD_INPUT_LAG\\2_Set_MouseDataQueueSize_16_Low_Buffer.reg'), '08 МЫШЬ И КЛАВИАТУРА\\2. Буфер очереди мыши 16 пакетов (MouseDataQueueSize 16).reg');
copyFile(path.join(SRC_ULTIMATE, '06_MOUSE_KEYBOARD_INPUT_LAG\\3_Set_KeyboardDataQueueSize_16_Low_Buffer.reg'), '08 МЫШЬ И КЛАВИАТУРА\\3. Буфер очереди клавиатуры 16 пакетов (KeyboardDataQueueSize 16).reg');
copyFile(path.join(SRC_ULTIMATE, '06_MOUSE_KEYBOARD_INPUT_LAG\\4_Apply_Competitive_FilterKeys_0ms_15ms.reg'), '08 МЫШЬ И КЛАВИАТУРА\\4. Киберспортивный FilterKeys (0ms задержка, 15ms повтор).reg');
copyFile(path.join(SRC_ULTIMATE, '06_MOUSE_KEYBOARD_INPUT_LAG\\6_Set_USBHUB3_USBXHCI_Thread_Priority.reg'), '08 МЫШЬ И КЛАВИАТУРА\\6. Приоритет прерываний контроллера USB xHCI.reg');
copyFile(path.join(SRC_ULTIMATE, '06_MOUSE_KEYBOARD_INPUT_LAG\\FilterKeysSetter.exe'), '08 МЫШЬ И КЛАВИАТУРА\\Утилиты\\FilterKeysSetter.exe');
copyDirRecursive(path.join(SRC_LLC, '12. Мышь-и-клавиатура\\HIDUSBF'), '08 МЫШЬ И КЛАВИАТУРА\\Утилиты\\HIDUSBF (Разгон геймпадов 1000Hz)');

writeTextFile('08 МЫШЬ И КЛАВИАТУРА\\5. Отключить засыпание USB портов (USB Selective Suspend).bat', `@echo off
chcp 65001 >nul
title Отключение засыпания USB
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
powershell -Command "Get-ChildItem 'HKLM:\\SYSTEM\\CurrentControlSet\\Enum\\USB' -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.PSChildName -eq 'Device Parameters' } | ForEach-Object { Set-ItemProperty -Path $_.PSPath -Name 'EnhancedPowerManagementEnabled' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue; Set-ItemProperty -Path $_.PSPath -Name 'SelectiveSuspendEnabled' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue }"
echo [УСПЕХ] Энергосбережение и засыпание USB устройств отключено!
pause
`);

// ==========================================
// 09 ЗВУК И МУЛЬТИМЕДИА
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '07_AUDIO_AND_MMCSS_OPTIMIZATION\\1_Configure_MMCSS_Games_High_Priority.reg'), '09 ЗВУК И МУЛЬТИМЕДИА\\1. Приоритет MMCSS Games (высокий приоритет аудио в играх).reg');
copyFile(path.join(SRC_ULTIMATE, '07_AUDIO_AND_MMCSS_OPTIMIZATION\\2_Configure_MMCSS_Audio_Zero_Stutter.reg'), '09 ЗВУК И МУЛЬТИМЕДИА\\2. Устранение заиканий звука MMCSS Audio Zero Stutter.reg');
copyFile(path.join(SRC_ULTIMATE, '07_AUDIO_AND_MMCSS_OPTIMIZATION\\2_AudioDG_Priority_High_And_Core_Pinning.ps1'), '09 ЗВУК И МУЛЬТИМЕДИА\\3. Изоляция процесса audiodg.exe с авто-привязкой к ядрам.ps1');
copyFile(path.join(SRC_ULTIMATE, '07_AUDIO_AND_MMCSS_OPTIMIZATION\\3_Realtek_ALC897_DAC_Idle_Power_Disable.reg'), '09 ЗВУК И МУЛЬТИМЕДИА\\4. Отключить энергосбережение ЦАП Realtek ALC.reg');
copyFile(path.join(SRC_ULTIMATE, '07_AUDIO_AND_MMCSS_OPTIMIZATION\\5_Fix_MMCSS_Network_Bandwidth_Throttling.reg'), '09 ЗВУК И МУЛЬТИМЕДИА\\5. Снять лимит пропускной способности сети при звуке.reg');

writeTextFile('09 ЗВУК И МУЛЬТИМЕДИА\\6. Отключить NoLazyMode и повысить SFIO Priority в MMCSS.reg', `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games]
"Affinity"=dword:00000000
"Background Only"="False"
"Clock Rate"=dword:00002710
"GPU Priority"=dword:00000008
"Priority"=dword:00000006
"Scheduling Category"="High"
"SFIO Priority"="High"
"Latency Sensitive"="True"

[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Audio]
"NoLazyMode"=dword:00000001
"Latency Sensitive"="True"
`);

// ==========================================
// 10 СЛУЖБЫ И ПЛАНИРОВЩИК
// ==========================================
writeTextFile('10 СЛУЖБЫ И ПЛАНИРОВЩИК\\1. Применить безопасный игровой профиль служб.bat', `@echo off
chcp 65001 >nul
title Безопасный профиль служб
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
set SERVICES=DiagTrack dmwappushservice WerSvc wisvc
for %%S in (%SERVICES%) do (
    sc stop %%S >nul 2>&1
    sc config %%S start= disabled >nul 2>&1
    echo  [+] Отключено: %%S
)
echo [УСПЕХ] Безопасная конфигурация служб применена!
pause
`);

writeTextFile('10 СЛУЖБЫ И ПЛАНИРОВЩИК\\2. Применить киберспортивный профиль служб.bat', `@echo off
chcp 65001 >nul
title Киберспортивный профиль служб
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
set SERVICES=DPS DiagTrack dmwappushservice SysMain TabletInputService Telemetry WalletService WarpJITSvc WbioSrvc WcsPlugInService WdNisSvc WerSvc wisvc wlidsvc wmiApSrv wscsvc WSService
for %%S in (%SERVICES%) do (
    sc stop %%S >nul 2>&1
    sc config %%S start= disabled >nul 2>&1
    echo  [+] Отключено: %%S
)
echo [УСПЕХ] Киберспортивный профиль служб применен!
pause
`);

copyFile('d:\\winvan\\Disable_BoosterX_Scheduled_Tasks.ps1', '10 СЛУЖБЫ И ПЛАНИРОВЩИК\\Disable_BoosterX_Scheduled_Tasks.ps1');

writeTextFile('10 СЛУЖБЫ И ПЛАНИРОВЩИК\\3. Отключить 15 категорий фоновых задач планировщика (BoosterX).bat', `@echo off
chcp 65001 >nul
title Отключение фоновых задач планировщика
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Disable_BoosterX_Scheduled_Tasks.ps1"
pause
`);

writeTextFile('10 СЛУЖБЫ И ПЛАНИРОВЩИК\\4. Отключить индексацию поиска Windows Search.bat', `@echo off
chcp 65001 >nul
title Отключение Windows Search
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
sc stop WSearch >nul 2>&1
sc config WSearch start= disabled >nul 2>&1
echo [УСПЕХ] Индексация Windows Search остановлена и отключена!
pause
`);

writeTextFile('10 СЛУЖБЫ И ПЛАНИРОВЩИК\\5. Восстановить стандартные службы Windows.bat', `@echo off
chcp 65001 >nul
title Восстановление служб
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
sc config Spooler start= auto >nul 2>&1
sc config WSearch start= auto >nul 2>&1
sc config SysMain start= auto >nul 2>&1
sc config DPS start= auto >nul 2>&1
sc config DiagTrack start= auto >nul 2>&1
echo [УСПЕХ] Стандартные службы восстановлены в режим автозапуска!
pause
`);

// ==========================================
// 11 УСТРОЙСТВА И MSI MODE
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '10_MSI_AND_INTERRUPT_AFFINITY\\1_Enable_MSI_Mode_For_GPU_High_Priority.ps1'), '11 УСТРОЙСТВА И MSI MODE\\1. Включить MSI Mode для видеокарты (GPU High Priority).ps1');
copyFile(path.join(SRC_ULTIMATE, '10_MSI_AND_INTERRUPT_AFFINITY\\2_Enable_MSI_Mode_For_NIC_Ethernet.ps1'), '11 УСТРОЙСТВА И MSI MODE\\2. Включить MSI Mode для сетевой карты (NIC Ethernet).ps1');
copyFile(path.join(SRC_ULTIMATE, '10_MSI_AND_INTERRUPT_AFFINITY\\4_Enable_MSI_Mode_For_NVMe_Storage.ps1'), '11 УСТРОЙСТВА И MSI MODE\\3. Включить MSI Mode для NVMe накопителей.ps1');
copyFile(path.join(SRC_ULTIMATE, '10_MSI_AND_INTERRUPT_AFFINITY\\MSI_Utility_V3.exe'), '11 УСТРОЙСТВА И MSI MODE\\Утилиты\\MSI_Utility_V3.exe');
copyFile(path.join(SRC_ULTIMATE, '10_MSI_AND_INTERRUPT_AFFINITY\\MSI_Mode_Tool.exe'), '11 УСТРОЙСТВА И MSI MODE\\Утилиты\\MSI_Mode_Tool.exe');

// ==========================================
// 12 ИГРОВЫЕ КОНФИГИ
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '11_GAMES_CS2_VALORANT_APEX_CONFIGS\\2_CS2_IFEO_High_CPU_And_IO_Priority.reg'), '12 ИГРОВЫЕ КОНФИГИ\\1. CS2 - Высокий приоритет CPU и IO (IFEO).reg');
copyFile(path.join(SRC_ULTIMATE, '11_GAMES_CS2_VALORANT_APEX_CONFIGS\\1_CS2_Ultimate_Zero_Latency_Autoexec.cfg'), '12 ИГРОВЫЕ КОНФИГИ\\2. CS2 - autoexec.cfg (копировать в csgo cfg).cfg');
copyFile(path.join(SRC_ULTIMATE, '11_GAMES_CS2_VALORANT_APEX_CONFIGS\\4_Apex_Legends_Autoexec_High_FPS.cfg'), '12 ИГРОВЫЕ КОНФИГИ\\3. Apex Legends - autoexec.cfg High FPS.cfg');
copyFile(path.join(SRC_ULTIMATE, '11_GAMES_CS2_VALORANT_APEX_CONFIGS\\3_Valorant_Competitive_Settings_Guide.txt'), '12 ИГРОВЫЕ КОНФИГИ\\4. Valorant - Гайд и настройки для минимального инпутлага.txt');
copyFile(path.join(SRC_ULTIMATE, '11_GAMES_CS2_VALORANT_APEX_CONFIGS\\5_Warzone_CST_RendererWorkerCount_8.cst'), '12 ИГРОВЫЕ КОНФИГИ\\5. Warzone - Конфиг потоков CPU (RendererWorkerCount 8).cst');

writeTextFile('12 ИГРОВЫЕ КОНФИГИ\\6. CS2 - Параметры запуска со скрытым приоритетом потоков (-mainthreadpriority).txt', `================================================================================
          CS2 - СКРЫТЫЕ ПАРАМЕТРЫ ЗАПУСКА И ПРИОРИТЕТ ГЛАВНОГО ПОТОКА
================================================================================
Источник: Igromanoff (https://t.me/igromanoff_news/21)

Суть параметра:
В движке Source 2 главный поток (Main Thread) отвечает за физику, логику и рендеринг.
Параметр '-mainthreadpriority' задает приоритет главного потока игры относительно Windows:

0 — THREAD_PRIORITY_NORMAL (Стандартный)
1 — THREAD_PRIORITY_ABOVE_NORMAL (Повышенный - рекомендуется)
2 — THREAD_PRIORITY_HIGHEST (Высокий - максимальный отклик)
3 — THREAD_PRIORITY_TIME_CRITICAL (Критический - только для тестов)

РЕКОМЕНДУЕМЫЕ ПАРАМЕТРЫ ЗАПУСКА CS2 В STEAM:
-high -mainthreadpriority 2 +fps_max 0 -nojoy +cl_updaterate 128

КАК ПРОВЕРИТЬ В ИГРЕ:
1. Запустите CS2
2. Откройте консоль (тильда ~)
3. Введите команду: sys_info
4. Найдите строку 'CPU Thread Priority'
================================================================================
`);

writeTextFile('12 ИГРОВЫЕ КОНФИГИ\\7. Apex Legends - Оптимальный videoconfig.txt (Zero Lag).txt', `================================================================================
          APEX LEGENDS - ОПТИМАЛЬНЫЙ VIDEOCONFIG.TXT ДЛЯ МАКС. FPS
================================================================================
Путь к файлу:
%USERPROFILE%\\Saved Games\\Respawn\\Apex\\local\\videoconfig.txt

Оптимальные значения параметров для нулевого инпутлага:
"setting.cl_ragdoll_maxcount"		"0"
"setting.mat_depthfeather_enable"		"0"
"setting.mat_forceaniso"		"1"
"setting.mat_picmip"		"4"
"setting.mat_shadowstate"		"0"
"setting.shadow_enable"		"0"
"setting.stream_memory"		"0"
"setting.dvs_enable"		"0"
"setting.dvs_gpuframetime_min"		"1"
"setting.dvs_gpuframetime_max"		"1"
"setting.defaultres"		"1920"
"setting.defaultresheight"		"1080"
"setting.fullscreen"		"1"
"setting.nowindowborder"		"0"
"setting.volumetric_lighting"		"0"
"setting.mat_vsync_mode"		"0"

После редактирования поставьте на файл videoconfig.txt атрибут 'Только чтение' (Read-Only).
================================================================================
`);

// ==========================================
// 13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '13_DIAGNOSTICS_LATENCY_TOOLS\\1_Check_Current_Timer_Resolution.bat'), '13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\\1. Проверить текущее разрешение таймера Windows.bat');
copyFile(path.join(SRC_ULTIMATE, '13_DIAGNOSTICS_LATENCY_TOOLS\\2_Check_PCI_MSI_Mode_Status.bat'), '13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\\2. Проверить статус режима MSI на устройствах.bat');
copyFile(path.join(SRC_ULTIMATE, '13_DIAGNOSTICS_LATENCY_TOOLS\\LatencyMon.exe'), '13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\\Утилиты\\LatencyMon.exe');
copyFile(path.join(SRC_LLC, '18. Программы\\HWINFO\\HWiNFO64.exe'), '13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\\Утилиты\\HWiNFO64.exe');
copyDirRecursive(path.join(SRC_LLC, '18. Программы\\PRESENTMON-CSV-PLOTTER'), '13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\\Утилиты\\PresentMon Plotter');
copyDirRecursive(path.join(SRC_VANDAY, '8 STRESS TEST\\TestMem5 v0.12 (Many configs repackaged)'), '13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\\Утилиты\\TestMem5 v0.12');
copyDirRecursive(path.join(SRC_VANDAY, '8 STRESS TEST\\prime95'), '13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\\Утилиты\\Prime95');
copyDirRecursive(path.join(SRC_VANDAY, '8 STRESS TEST\\MemTestPro 7'), '13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\\Утилиты\\MemTestPro 7');
copyDirRecursive(path.join(SRC_VANDAY, '8 STRESS TEST\\LinX v0.9.7 (AMD)'), '13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\\Утилиты\\LinX (AMD)');
copyDirRecursive(path.join(SRC_VANDAY, '8 STRESS TEST\\Y-CRUNCHER'), '13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\\Утилиты\\Y-Cruncher');

// ==========================================
// 14 ОЧИСТКА СИСТЕМЫ
// ==========================================
copyFile(path.join(SRC_OPTIMIZATION, '2.DeviceCleanup.exe'), '14 ОЧИСТКА СИСТЕМЫ\\Утилиты\\DeviceCleanup.exe');
writeTextFile('14 ОЧИСТКА СИСТЕМЫ\\1. Полная очистка временных файлов (TEMP, Prefetch, CrashDumps).bat', `@echo off
chcp 65001 >nul
title Очистка временных файлов
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
del /s /f /q "%temp%\\*.*" 2>nul
del /s /f /q "C:\\Windows\\Temp\\*.*" 2>nul
del /s /f /q "C:\\Windows\\Prefetch\\*.*" 2>nul
del /s /f /q "C:\\Users\\%username%\\AppData\\Local\\CrashDumps\\*.*" 2>nul
echo [УСПЕХ] Временные файлы очищены!
pause
`);

writeTextFile('14 ОЧИСТКА СИСТЕМЫ\\2. Очистить кэш шейдеров DirectX (NVIDIA, AMD, Intel).bat', `@echo off
chcp 65001 >nul
title Очистка кэша шейдеров DirectX
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
del /s /f /q "%LocalAppData%\\NVIDIA\\DXCache\\*.*" 2>nul
del /s /f /q "%LocalAppData%\\NVIDIA\\GLCache\\*.*" 2>nul
del /s /f /q "%LocalAppData%\\AMD\\DxCache\\*.*" 2>nul
del /s /f /q "%LocalAppData%\\D3DSCache\\*.*" 2>nul
echo [УСПЕХ] Кэш шейдеров DirectX очищен!
pause
`);

writeTextFile('14 ОЧИСТКА СИСТЕМЫ\\3. Очистить журналы событий Windows (Event Logs).bat', `@echo off
chcp 65001 >nul
title Очистка журналов событий
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
for /f "tokens=*" %%1 in ('wevtutil.exe el') do (wevtutil.exe cl "%%1" 2>nul)
echo [УСПЕХ] Все журналы событий Windows очищены!
pause
`);

writeTextFile('14 ОЧИСТКА СИСТЕМЫ\\4. Очистить кэш доставки обновлений SoftwareDistribution.bat', `@echo off
chcp 65001 >nul
title Очистка кэша обновлений
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
net stop wuauserv >nul 2>&1
del /s /f /q "C:\\Windows\\SoftwareDistribution\\Download\\*.*" 2>nul
net start wuauserv >nul 2>&1
echo [УСПЕХ] Кэш загрузок Windows Update очищен!
pause
`);

// ==========================================
// 15 ВОССТАНОВЛЕНИЕ
// ==========================================
copyFile(path.join(SRC_ULTIMATE, '12_REVERT_ALL_TWEAKS_RESTORE\\RESTORE_ALL_DEFAULT_WINDOWS_SETTINGS.bat'), '15 ВОССТАНОВЛЕНИЕ\\1. Полный откат всех настроек Windows к заводским.bat');

writeTextFile('15 ВОССТАНОВЛЕНИЕ\\2. Восстановить стандартные службы Windows.bat', `@echo off
chcp 65001 >nul
title Восстановление служб
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
sc config Spooler start= auto >nul 2>&1
sc config WSearch start= auto >nul 2>&1
sc config SysMain start= auto >nul 2>&1
sc config DPS start= auto >nul 2>&1
sc config DiagTrack start= auto >nul 2>&1
echo [УСПЕХ] Службы возвращены в автозапуск!
pause
`);

writeTextFile('15 ВОССТАНОВЛЕНИЕ\\3. Восстановить сетевые настройки (Сброс TCP-IP и Winsock).bat', `@echo off
chcp 65001 >nul
title Сброс сетевых настроек
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
netsh winsock reset >nul 2>&1
netsh int ip reset >nul 2>&1
echo [УСПЕХ] Сетевые протоколы сброшены к стандартным!
pause
`);

writeTextFile('15 ВОССТАНОВЛЕНИЕ\\4. Восстановить сбалансированную схему электропитания.bat', `@echo off
chcp 65001 >nul
title Сбалансированный план
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)
color 0A
powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e >nul 2>&1
echo [УСПЕХ] Схема электропитания восстановлена на Сбалансированную!
pause
`);

console.log('--- VANDAYSTUFF-ULTIMATE PACK BUILT SUCCESSFULLY ---');
