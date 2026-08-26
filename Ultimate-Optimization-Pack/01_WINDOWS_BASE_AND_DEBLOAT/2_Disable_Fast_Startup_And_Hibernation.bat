@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
echo [*] Disabling Hibernation...
powercfg -h off
echo [*] Disabling Hiberboot...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Power" /v "HiberbootEnabled" /t REG_DWORD /d 0 /f >nul
echo [SUCCESS] Fast Startup & Hibernation disabled!
pause
