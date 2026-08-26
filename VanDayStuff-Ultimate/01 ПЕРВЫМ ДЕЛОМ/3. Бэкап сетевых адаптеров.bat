@echo off
chcp 65001 >nul
title Бэкап настроек сети
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
set BDIR=%~dp0Backup_Network
mkdir "%BDIR%" 2>nul
netsh dump > "%BDIR%\netsh_backup.txt"
ipconfig /all > "%BDIR%\ipconfig_backup.txt"
echo [УСПЕХ] Настройки сети сохранены в папку Backup_Network!
pause
