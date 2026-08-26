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
if not exist "%DRV%" (
    echo [*] Файл драйвера не найден локально в папке Утилиты.
    echo [*] Начинаем загрузку кастомного драйвера 596.36 (835 MB) из GitHub Releases...
    powershell -Command "Write-Host 'Загрузка 596.36 Custom...' -ForegroundColor Cyan; (New-Object System.Net.WebClient).DownloadFile('https://github.com/temkalt/WindowsOptimizer/releases/download/v1.0.0/596.36-Custom.exe', '%DRV%')"
)

if exist "%DRV%" (
    echo [*] Запуск установщика драйвера 596.36...
    start "" "%DRV%"
) else (
    echo [ИНФО] Скачайте драйвер вручную из раздела Releases:
    echo https://github.com/temkalt/WindowsOptimizer/releases
)
pause
