@echo off
chcp 65001 >nul
title Бэкап реестра Windows
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
set BDIR=%~dp0Backup_Registry
mkdir "%BDIR%" 2>nul
echo [*] Экспорт ключевых веток реестра в папку Backup_Registry...
reg export "HKLM\SYSTEM\CurrentControlSet" "%BDIR%\HKLM_CurrentControlSet.reg" /y >nul 2>&1
reg export "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" "%BDIR%\HKLM_SystemProfile.reg" /y >nul 2>&1
reg export "HKLM\SOFTWARE\Policies\Microsoft\Windows" "%BDIR%\HKLM_Policies.reg" /y >nul 2>&1
reg export "HKCU\Control Panel\Mouse" "%BDIR%\HKCU_Mouse.reg" /y >nul 2>&1
reg export "HKCU\System\GameConfigStore" "%BDIR%\HKCU_GameConfigStore.reg" /y >nul 2>&1
echo [УСПЕХ] Бэкап реестра сохранен в: %BDIR%
pause
