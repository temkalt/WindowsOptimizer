@echo off
chcp 65001 >nul
title Сброс сетевых кэшей
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
ipconfig /flushdns >nul 2>&1
arp -d * >nul 2>&1
netsh winsock reset >nul 2>&1
echo [УСПЕХ] Кэши DNS и таблицы ARP сброшены!
pause
