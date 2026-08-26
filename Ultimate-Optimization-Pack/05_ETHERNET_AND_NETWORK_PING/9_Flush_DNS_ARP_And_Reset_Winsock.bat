@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
ipconfig /flushdns
arp -d * >nul 2>&1
netsh winsock reset >nul
netsh int ip reset >nul
echo [SUCCESS] Network stack refreshed!
pause
