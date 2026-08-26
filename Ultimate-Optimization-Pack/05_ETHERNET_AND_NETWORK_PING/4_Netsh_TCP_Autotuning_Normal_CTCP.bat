@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
netsh int tcp set global autotuninglevel=normal
netsh int tcp set global congestionprovider=ctcp 2>nul
netsh int tcp set global ecncapability=disabled
netsh int tcp set global timestamps=disabled
netsh int tcp set global rss=enabled
netsh int tcp set global rsc=disabled
netsh int tcp set heuristics disabled
echo [SUCCESS] Netsh TCP parameters configured!
pause
