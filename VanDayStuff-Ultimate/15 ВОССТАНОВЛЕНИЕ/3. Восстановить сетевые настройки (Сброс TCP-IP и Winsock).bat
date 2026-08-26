@echo off
chcp 65001 >nul
title Сброс сетевых настроек
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
netsh winsock reset >nul 2>&1
netsh int ip reset >nul 2>&1
echo [УСПЕХ] Сетевые протоколы сброшены к стандартным!
pause
