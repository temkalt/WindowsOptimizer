@echo off
chcp 65001 >nul
title WindowsOptimizer
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

color 0A
cls
echo ============================================================================
echo           WindowsOptimizer - КИБЕРСПОРТИВНЫЙ ЦЕНТР ОПТИМИЗАЦИИ
echo ============================================================================
echo   [ИНФО] Запуск локального движка и графического интерфейса...
echo ============================================================================
echo.

cd /d "d:\winvan\ApexOptimizer"

:: Запуск бэкенда в фоновом режиме
start /b "" node server/standalone_launcher.js >nul 2>&1

:: Ожидание инициализации порта 5050
timeout /t 1 /nobreak >nul

:: Открытие приложения в чистом едином окне (App Mode)
start msedge --app=http://localhost:5050 --window-size=1280,820 || start chrome --app=http://localhost:5050 --window-size=1280,820 || start http://localhost:5050

echo [+] WindowsOptimizer успешно запущен!
echo [+] Вы можете свернуть это окно.
echo ============================================================================
pause
