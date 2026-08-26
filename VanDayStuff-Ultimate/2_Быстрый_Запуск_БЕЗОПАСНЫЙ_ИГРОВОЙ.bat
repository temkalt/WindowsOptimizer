@echo off
chcp 65001 >nul
title VANDAYSTUFF ULTIMATE - БЕЗОПАСНЫЙ ИГРОВОЙ (1-КЛИК)

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Запрос прав Администратора...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c ""%~f0""' -Verb RunAs"
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
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore" /v "SystemRestorePointCreationFrequency" /t REG_DWORD /d 0 /f >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Enable-ComputerRestore -Drive 'C:\' -ErrorAction SilentlyContinue; Checkpoint-Computer -Description 'VanDay_Safe_Gaming_Backup' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue" >nul 2>&1

echo [*] [2/8] Отключение телеметрии и сбора данных...
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\1. Отключить телеметрию и сбор данных.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\4. Отключить отчеты об ошибках (WER).reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\5. Отключить Cortana и поиск Bing в Пуске.reg" >nul 2>&1
regedit /s "%PACK_DIR%02 WINDOWS И ДЕБЛОЙТ\7. Вернуть классическое меню Windows 11.reg" >nul 2>&1
powercfg -h off >nul 2>&1

echo [*] [3/8] Настройка таймеров BCD и приоритета CPU...
regedit /s "%PACK_DIR%03 ПРОЦЕССОР И ТАЙМЕРЫ\1. Настройка квантов CPU (Win32PrioritySeparation 26 Hex).reg" >nul 2>&1
bcdedit /set disabledynamictick yes >nul 2>&1
bcdedit /deletevalue useplatformclock >nul 2>&1
bcdedit /set tscsyncpolicy Enhanced >nul 2>&1

echo [*] [4/8] Включение HAGS, фикс MPO и отключение GameDVR...
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\1. Включить HAGS (Hardware Accelerated GPU Scheduling).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\2. Отключить MPO (Multiplane Overlay Fix).reg" >nul 2>&1
regedit /s "%PACK_DIR%04 ВИДЕОКАРТА И ГРАФИКА\3. Отключить Xbox GameDVR и захват экрана.reg" >nul 2>&1

echo [*] [5/8] Настройка памяти и дисков...
regedit /s "%PACK_DIR%06 ПАМЯТЬ И ДИСКИ\1. Закрепить ядро Windows в RAM (DisablePagingExecutive).reg" >nul 2>&1
regedit /s "%PACK_DIR%06 ПАМЯТЬ И ДИСКИ\2. Отключить засыпание NVMe и SATA (StorPort Idle Disable).reg" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Disable-MMAgent -MemoryCompression -ErrorAction SilentlyContinue" >nul 2>&1

echo [*] [6/8] Настройка TCP NoDelay...
regedit /s "%PACK_DIR%07 ИНТЕРНЕТ И СЕТЬ\1. Отключить алгоритм Nagle (TCP NoDelay + AckFrequency 1).reg" >nul 2>&1
netsh int tcp set global autotuninglevel=normal >nul 2>&1

echo [*] [7/8] Настройка мыши 1:1 и аудио MMCSS...
regedit /s "%PACK_DIR%08 МЫШЬ И КЛАВИАТУРА\1. Фикс MarkC 1к1 (полное отключение акселерации мыши).reg" >nul 2>&1
regedit /s "%PACK_DIR%09 ЗВУК И МУЛЬТИМЕДИА\1. Приоритет MMCSS Games (высокий приоритет аудио в играх).reg" >nul 2>&1

echo [*] [8/8] Добавление папок игр в исключения Defender...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Add-MpPreference -ExclusionPath 'C:\Program Files (x86)\Steam', 'C:\Program Files\FACEIT AC', 'C:\Riot Games' -ErrorAction SilentlyContinue" >nul 2>&1

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
