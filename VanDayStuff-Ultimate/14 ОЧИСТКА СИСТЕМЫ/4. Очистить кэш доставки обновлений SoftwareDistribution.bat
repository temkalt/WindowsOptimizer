@echo off
chcp 65001 >nul
title Очистка кэша обновлений
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
net stop wuauserv >nul 2>&1
del /s /f /q "C:\Windows\SoftwareDistribution\Download\*.*" 2>nul
net start wuauserv >nul 2>&1
echo [УСПЕХ] Кэш загрузок Windows Update очищен!
pause
