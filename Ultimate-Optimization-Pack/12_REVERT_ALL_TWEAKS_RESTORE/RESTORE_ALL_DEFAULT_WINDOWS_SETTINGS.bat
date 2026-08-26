@echo off
chcp 65001 >nul
title APEXTWEAK ULTIMATE PACK - RESTORE DEFAULT SETTINGS

:: Self-elevation check
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Requesting Administrator Privileges...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

color 0A
cls
echo ============================================================================
echo         APEXTWEAK ULTIMATE PACK - RESTORE DEFAULT WINDOWS SETTINGS
echo ============================================================================
echo.

echo [*] 1/4 Restoring Default Registry Settings...
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 3 /f >nul
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v "EnableLUA" /t REG_DWORD /d 1 /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 2 /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "DisablePagingExecutive" /t REG_DWORD /d 0 /f >nul
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d 20 /f >nul
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 10 /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Services\mouclass\Parameters" /v "MouseDataQueueSize" /t REG_DWORD /d 100 /f >nul
reg add "HKLM\SYSTEM\CurrentControlSet\Services\kbdclass\Parameters" /v "KeyboardDataQueueSize" /t REG_DWORD /d 100 /f >nul

echo [*] 2/4 Restoring Default BCD Flags...
bcdedit /deletevalue disabledynamictick 2>nul
bcdedit /deletevalue useplatformtick 2>nul
bcdedit /deletevalue tscsyncpolicy 2>nul
bcdedit /deletevalue bootux 2>nul
bcdedit /deletevalue quietboot 2>nul
bcdedit /set hypervisorlaunchtype auto 2>nul

echo [*] 3/4 Restoring Balanced Power Plan...
powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e 2>nul

echo [*] 4/4 Resetting Network and Services...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Enable-MMAgent -MemoryCompression -ErrorAction SilentlyContinue"
sc config Spooler start= auto >nul 2>&1
sc config WSearch start= auto >nul 2>&1
sc config SysMain start= auto >nul 2>&1
sc config DPS start= auto >nul 2>&1
netsh winsock reset >nul 2>&1
netsh int ip reset >nul 2>&1

echo.
echo ============================================================================
echo [SUCCESS] All default Windows settings have been restored!
echo ============================================================================
echo.
pause
