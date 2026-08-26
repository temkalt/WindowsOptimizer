@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Disable-MMAgent -PageCombining -ApplicationPreLaunch -OperationEndpoints -ErrorAction SilentlyContinue"
echo [SUCCESS] MMAgent memory overhead minimized!
pause
