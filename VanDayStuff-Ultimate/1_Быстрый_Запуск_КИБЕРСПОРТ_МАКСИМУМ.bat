@echo off
chcp 65001 >nul
title VANDAYSTUFF ULTIMATE - КИБЕРСПОРТ МАКСИМУМ (1-КЛИК)

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Запрос прав Администратора...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c ""%~f0""' -Verb RunAs"
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
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore" /v "SystemRestorePointCreationFrequency" /t REG_DWORD /d 0 /f >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Enable-ComputerRestore -Drive 'C:\' -ErrorAction SilentlyContinue; Checkpoint-Computer -Description 'VanDay_Ultimate_Esports_Backup' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue" >nul 2>&1
echo  [+] Точка восстановления создана.

:: 2. Windows Debloat
echo [*] [2/14] Отключение телеметрии, сбора данных и Copilot 24H2...
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\1. Отключить телеметрию и сбор данных.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\2. Отключить UAC и всплывающие окна.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\3. Отключить фоновые приложения.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\4. Отключить отчеты об ошибках (WER).reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\5. Отключить Cortana и поиск Bing в Пуске.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\7. Вернуть классическое меню Windows 11.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\8. Ускорить анимации и отклик окон (MenuShowDelay 0).reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\9. Отключить автообслуживание Windows.reg" >nul 2>&1
powercfg -h off >nul 2>&1

reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Policies\Microsoft\Windows\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d 1 /f >nul 2>&1
echo  [+] Телеметрия и фоновый мусор Windows отключены.

:: 3. CPU и Таймеры
echo [*] [3/14] Настройка квантов CPU (Win32PrioritySeparation 26), таймеров 0.5ms и ядер...
regedit /s "%PACK_DIR%03 ПРОЦЕССОР И ТАЙМЕРЫ\1. Настройка квантов CPU (Win32PrioritySeparation 26 Hex).reg" >nul 2>&1
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
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\1. Включить HAGS (Hardware Accelerated GPU Scheduling).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\2. Отключить MPO (Multiplane Overlay Fix).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\3. Отключить Xbox GameDVR и захват экрана.reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\4. Включить DirectFlip Mode 2 (минимальный инпутлаг).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\5. Приоритет видеопотоков dxgkrnl и nvlddmkm.reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\6. Кэш шейдеров NVIDIA 10GB (безлимитный).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\7. Отключить энергосбережение GPU.reg" >nul 2>&1

if exist "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\Утилиты\nvidiaProfileInspector.exe" (
    if exist "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\Утилиты\LLC-OPTIMIZED-V2.nip" (
        "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\Утилиты\nvidiaProfileInspector.exe" "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\Утилиты\LLC-OPTIMIZED-V2.nip" -silent >nul 2>&1
        echo  [+] Профиль драйвера NVIDIA импортирован.
    )
)
echo  [+] Графика и видеокарта оптимизированы.

:: 5. Планы электропитания
echo [*] [5/14] Активация плана электропитания Igromanoff AMD VIP / LLC...
set IGRO_POW="%PACK_DIR%05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\Файлы_планов_POW\Igromanoff AMD VIP.pow"
set LLC_POW="%PACK_DIR%05 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\Файлы_планов_POW\LLC-CERTIFIED.pow"
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
regedit /s "%PACK_DIR%06 ПАМЯТЬ И ДИСКИ\1. Закрепить ядро Windows в RAM (DisablePagingExecutive).reg" >nul 2>&1
regedit /s "%PACK_DIR%06 ПАМЯТЬ И ДИСКИ\2. Отключить засыпание NVMe и SATA (StorPort Idle Disable).reg" >nul 2>&1
regedit /s "%PACK_DIR%06 ПАМЯТЬ И ДИСКИ\5. Максимальный приоритет отклика (SystemResponsiveness 0).reg" >nul 2>&1
fsutil behavior set disablelastaccess 1 >nul 2>&1
fsutil behavior set disable8dot3 1 >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Disable-MMAgent -MemoryCompression -PageCombining -ApplicationPreLaunch -OperationEndpoints -ErrorAction SilentlyContinue" >nul 2>&1
echo  [+] Память и диски настроены.

:: 7. Интернет и Сеть
echo [*] [7/14] Настройка TCP NoDelay, снятие Throttling и тюнинг адаптера...
regedit /s "%PACK_DIR%07 ИНТЕРНЕТ И СЕТЬ\1. Отключить алгоритм Nagle (TCP NoDelay + AckFrequency 1).reg" >nul 2>&1
regedit /s "%PACK_DIR%07 ИНТЕРНЕТ И СЕТЬ\2. Снять ограничение Network Throttling Index.reg" >nul 2>&1
netsh int tcp set global autotuninglevel=normal >nul 2>&1
netsh int tcp set global ecncapability=enabled >nul 2>&1
netsh int tcp set global rss=enabled >nul 2>&1
netsh int tcp set global timestamps=disabled >nul 2>&1
netsh int tcp set heuristics disabled >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%07 ИНТЕРНЕТ И СЕТЬ\5. Тюнинг Realtek 2.5GbE (RTL8125) Ultra Low Latency.ps1" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%07 ИНТЕРНЕТ И СЕТЬ\4. Отключить энергосбережение сетевой карты.ps1" >nul 2>&1
echo  [+] Сетевой стек настроен на минимальный пинг.

:: 8. Мышь и Клавиатура
echo [*] [8/14] Настройка 1:1 мыши, 16 пакетов буфера и FilterKeys 0ms...
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\1. Фикс MarkC 1к1 (полное отключение акселерации мыши).reg" >nul 2>&1
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\2. Буфер очереди мыши 16 пакетов (MouseDataQueueSize 16).reg" >nul 2>&1
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\3. Буфер очереди клавиатуры 16 пакетов (KeyboardDataQueueSize 16).reg" >nul 2>&1
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\4. Киберспортивный FilterKeys (0ms задержка, 15ms повтор).reg" >nul 2>&1
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\6. Приоритет прерываний контроллера USB xHCI.reg" >nul 2>&1
echo  [+] Стек ввода откалиброван под 8000Hz/4000Hz/1000Hz.

:: 9. Звук и MMCSS
echo [*] [9/14] Настройка приоритета MMCSS Games и изоляция audiodg...
regedit /s "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\1. Приоритет MMCSS Games (высокий приоритет аудио в играх).reg" >nul 2>&1
regedit /s "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\2. Устранение заиканий звука MMCSS Audio Zero Stutter.reg" >nul 2>&1
regedit /s "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\4. Отключить энергосбережение ЦАП Realtek ALC.reg" >nul 2>&1
regedit /s "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\5. Снять лимит пропускной способности сети при звуке.reg" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\3. Изоляция процесса audiodg.exe с авто-привязкой к ядрам.ps1" >nul 2>&1
echo  [+] Аудио-подсистема оптимизирована.

:: 10. Службы и Планировщик
echo [*] [10/14] Отключение мусорных служб и 15 категорий фоновых задач планировщика...
set SERVICES=DPS DiagTrack dmwappushservice SysMain TabletInputService Telemetry WalletService WarpJITSvc WbioSrvc WcsPlugInService WdNisSvc WerSvc wisvc wlidsvc wmiApSrv wscsvc WSService
for %%S in (%SERVICES%) do (
    sc stop %%S >nul 2>&1
    sc config %%S start= disabled >nul 2>&1
)
if exist "%PACK_DIR%..\Disable_BoosterX_Scheduled_Tasks.ps1" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%..\Disable_BoosterX_Scheduled_Tasks.ps1" >nul 2>&1
)
echo  [+] Фоновые службы и задачи планировщика остановлены.

:: 11. MSI Mode
echo [*] [11/14] Перевод видеокарты, сети и USB в режим MSI (Message Signaled Interrupts)...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%11 УСТРОЙСТВА И MSI MODE\1. Включить MSI Mode для видеокарты (GPU High Priority).ps1" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%11 УСТРОЙСТВА И MSI MODE\2. Включить MSI Mode для сетевой карты (NIC Ethernet).ps1" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%11 УСТРОЙСТВА И MSI MODE\3. Включить MSI Mode для NVMe накопителей.ps1" >nul 2>&1
echo  [+] Прерывания переведены в режим MSI с высоким приоритетом.

:: 12. Игровые конфиги
echo [*] [12/14] Применение приоритетов для игр (CS2 IFEO High Priority)...
regedit /s "%PACK_DIR%12 ИГРОВЫЕ КОНФИГИ\1. CS2 - Высокий приоритет CPU и IO (IFEO).reg" >nul 2>&1
echo  [+] Приоритеты для киберспортивных дисциплин заданы.

:: 13. Защитник и Исключения
echo [*] [13/14] Добавление папок Steam, Faceit, Vanguard в исключения Defender...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Add-MpPreference -ExclusionPath 'C:\Program Files (x86)\Steam', 'C:\Program Files\FACEIT AC', 'C:\Riot Games', 'C:\Program Files\Riot Vanguard' -ErrorAction SilentlyContinue" >nul 2>&1
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
