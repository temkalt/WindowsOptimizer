@echo off
chcp 65001 >nul
title Создание точки восстановления Windows
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
echo [*] Включение защиты системы на диске C:...
powershell -Command "Enable-ComputerRestore -Drive 'C:\' -ErrorAction SilentlyContinue"
echo [*] Создание точки восстановления 'VanDay_Optimization_Backup'...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore" /v "SystemRestorePointCreationFrequency" /t REG_DWORD /d 0 /f >nul 2>&1
powershell -Command "Checkpoint-Computer -Description 'VanDay_Optimization_Backup' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue"
echo.
echo [УСПЕХ] Точка восстановления создана!
pause
