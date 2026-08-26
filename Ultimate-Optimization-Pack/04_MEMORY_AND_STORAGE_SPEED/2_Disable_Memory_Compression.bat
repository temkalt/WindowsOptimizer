@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Disable-MMAgent -MemoryCompression -ErrorAction SilentlyContinue"
echo [SUCCESS] Memory compression disabled!
pause
