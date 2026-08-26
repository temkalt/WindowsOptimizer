@echo off
chcp 65001 >nul
title Сбалансированный план Windows
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e >nul 2>&1
echo [УСПЕХ] Стандартная схема 'Сбалансированная' активирована!
pause
