@echo off
chcp 65001 >nul
title Аудит и диагностика системы
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0B
cls
echo ============================================================================
echo         ПОЛНЫЙ АУДИТ И ДИАГНОСТИКА СИСТЕМЫ ПЕРЕД ОПТИМИЗАЦИЕЙ
echo ============================================================================
echo.
echo [*] Проверка процессора и ядер:
powershell -Command "Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed | Format-List"
echo [*] Проверка видеокарты и драйвера:
powershell -Command "Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion | Format-List"
echo [*] Проверка статуса схемы электропитания:
powercfg -getactivescheme
echo.
echo [*] Проверка статуса изоляции ядра (VBS / Core Isolation):
powershell -Command "Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard -ErrorAction SilentlyContinue | Select-Object VirtualizationBasedSecurityStatus, SecurityServicesRunning | Format-List"
echo [*] Проверка сетевых адаптеров и RSS очередей:
powershell -Command "Get-NetAdapter | Select-Object Name, InterfaceDescription, Status, LinkSpeed | Format-Table -AutoSize"
echo ============================================================================
echo [УСПЕХ] Диагностика системы завершена!
echo ============================================================================
pause
