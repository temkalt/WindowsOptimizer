@echo off
chcp 65001 >nul
title Сбалансированный план
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e >nul 2>&1
echo [УСПЕХ] Схема электропитания восстановлена на Сбалансированную!
pause
