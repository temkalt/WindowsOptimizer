@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
bcdedit /deletevalue disabledynamictick 2>nul
bcdedit /deletevalue useplatformtick 2>nul
bcdedit /deletevalue tscsyncpolicy 2>nul
bcdedit /deletevalue bootux 2>nul
bcdedit /deletevalue quietboot 2>nul
bcdedit /set hypervisorlaunchtype auto 2>nul
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d 2 /f >nul
echo [SUCCESS] Default CPU scheduling restored.
pause
