@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
bcdedit /set hypervisorlaunchtype off
echo [SUCCESS] Hypervisor root overhead disabled!
pause
