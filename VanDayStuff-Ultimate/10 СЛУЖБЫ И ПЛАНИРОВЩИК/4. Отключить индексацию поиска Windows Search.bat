@echo off
chcp 65001 >nul
title Отключение Windows Search
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
sc stop WSearch >nul 2>&1
sc config WSearch start= disabled >nul 2>&1
echo [УСПЕХ] Индексация Windows Search остановлена и отключена!
pause
