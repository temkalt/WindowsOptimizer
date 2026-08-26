@echo off
chcp 65001 >nul
title Отключение фоновых задач планировщика
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Disable_BoosterX_Scheduled_Tasks.ps1"
pause
