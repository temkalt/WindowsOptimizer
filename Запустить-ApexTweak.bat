@echo off
title ApexTweak - CS2 Esports & Windows Optimizer
echo ================================================================
echo   ApexTweak - CS2 Esports Zero-Latency Desktop App
echo   Запуск автономного десктопного приложения...
echo ================================================================
echo.

:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] Требуются права администратора для работы с реестром и BCD.
    echo [!] Перезапускаю с правами Администратора...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"

:: 1. Launch standalone Electron desktop app if present
if exist "%~dp0ApexTweak-Desktop\ApexTweak.exe" (
    echo [OK] Запуск автономного окна ApexTweak Desktop...
    start "" "%~dp0ApexTweak-Desktop\ApexTweak.exe"
    exit /b
)

:: 2. Fallback to Root ApexTweak.exe
if exist "%~dp0ApexTweak.exe" (
    echo [OK] Запуск ApexTweak.exe...
    start "" "%~dp0ApexTweak.exe"
    exit /b
)

pause
