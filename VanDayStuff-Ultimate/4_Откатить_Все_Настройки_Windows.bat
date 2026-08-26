@echo off
chcp 65001 >nul
title Восстановление стандартных настроек Windows

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Запрос прав Администратора...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)

color 0A
cls
echo ============================================================================
echo         ВОССТАНОВЛЕНИЕ СТАНДАРТНЫХ НАСТРОЕК WINDOWS К ЗАВОДСКИМ
echo ============================================================================
echo.

echo [*] 1/4 Восстановление настроек реестра по умолчанию...
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 3 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v "EnableLUA" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "DisablePagingExecutive" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d 20 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 10 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Services\mouclass\Parameters" /v "MouseDataQueueSize" /t REG_DWORD /d 100 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Services\kbdclass\Parameters" /v "KeyboardDataQueueSize" /t REG_DWORD /d 100 /f >nul 2>&1

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
