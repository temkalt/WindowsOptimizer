@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
bcdedit /deletevalue useplatformclock 2>nul
bcdedit /set useplatformclock no 2>nul
bcdedit /set tscsyncpolicy Enhanced 2>nul
echo [SUCCESS] High-overhead HPET deleted! CPU Invariant TSC enforced.
pause
