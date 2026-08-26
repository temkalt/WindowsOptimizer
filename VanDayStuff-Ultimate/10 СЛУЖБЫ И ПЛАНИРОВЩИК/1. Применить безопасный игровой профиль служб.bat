@echo off
chcp 65001 >nul
title Безопасный профиль служб
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
set SERVICES=DiagTrack dmwappushservice WerSvc wisvc
for %%S in (%SERVICES%) do (
    sc stop %%S >nul 2>&1
    sc config %%S start= disabled >nul 2>&1
    echo  [+] Отключено: %%S
)
echo [УСПЕХ] Безопасная конфигурация служб применена!
pause
