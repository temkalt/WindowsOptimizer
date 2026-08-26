@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
bcdedit /set bootux disabled
bcdedit /set quietboot yes
echo [SUCCESS] Fast boot enabled!
pause
