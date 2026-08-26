@echo off
chcp 65001 >nul
title Активация плана электропитания Igromanoff AMD VIP

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Запрос прав Администратора...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)

color 0A
cls
echo ============================================================================
echo       УСТАНОВКА И АКТИВАЦИЯ ПЛАНА ЭЛЕКТРОПИТАНИЯ: IGROMANOFF AMD VIP
echo ============================================================================
echo  [ЦЕЛЬ] Максимальная производительность для AMD AM5 (Ryzen 7 9800X3D / 7800X3D)
echo ============================================================================
echo.

set POW_FILE=%~dp005 ПЛАНЫ ЭЛЕКТРОПИТАНИЯ\Файлы_планов_POW\Igromanoff AMD VIP.pow
if not exist "%POW_FILE%" (
    set POW_FILE=d:\winvan\Igromanoff AMD Power Pack\1 - AMD\Igromanoff AMD VIP.pow
)

echo [*] Импорт плана электропитания...
powercfg -import "%POW_FILE%" 77777777-7777-7777-7777-777777777777 >nul 2>&1

echo [*] Активация плана Igromanoff AMD VIP...
powercfg -setactive 77777777-7777-7777-7777-777777777777 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPM 0 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1

echo.
echo ============================================================================
echo [УСПЕХ] План электропитания 'Igromanoff AMD VIP' успешно активирован!
echo ============================================================================
powercfg -getactivescheme
echo.
pause
