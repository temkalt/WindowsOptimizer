@echo off
chcp 65001 >nul
title Установка кастомного драйвера NVIDIA 596.36
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
cls
echo ============================================================================
echo      УСТАНОВКА КАСТОМНОГО ОЧИЩЕННОГО ДРАЙВЕРА NVIDIA (596.36 - CUSTOM)
echo ============================================================================
echo  [ИНФО] Данный драйвер очищен от телеметрии, GeForce Experience, Shield,
echo         Node.js и фонового мусора для достижения минимального DPC Latency.
echo ============================================================================
echo.
set DRV=%~dp0Утилиты\596.36 - Custom.exe
if exist "%DRV%" (
    echo [*] Запуск установщика драйвера 596.36...
    start "" "%DRV%"
) else (
    echo [ОШИБКА] Файл драйвера 596.36 - Custom.exe не найден.
)
pause
