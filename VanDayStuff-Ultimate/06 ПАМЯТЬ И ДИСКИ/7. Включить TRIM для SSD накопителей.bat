@echo off
chcp 65001 >nul
title Включение TRIM для SSD
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
fsutil behavior set DisableDeleteNotify 0 >nul 2>&1
echo [УСПЕХ] Команда TRIM для SSD активна!
pause
