@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
set BACKUP_DIR=%~dp0Registry_Backup_%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%
set BACKUP_DIR=%BACKUP_DIR: =0%
mkdir "%BACKUP_DIR%" 2>nul
echo [*] Backing up critical Registry branches to %BACKUP_DIR%...
reg export "HKLM\SYSTEM\CurrentControlSet" "%BACKUP_DIR%\HKLM_CurrentControlSet.reg" /y
reg export "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" "%BACKUP_DIR%\HKLM_Multimedia_SystemProfile.reg" /y
reg export "HKLM\SOFTWARE\Policies\Microsoft\Windows" "%BACKUP_DIR%\HKLM_Policies_Windows.reg" /y
reg export "HKCU\Control Panel\Mouse" "%BACKUP_DIR%\HKCU_ControlPanel_Mouse.reg" /y
reg export "HKCU\Control Panel\Accessibility" "%BACKUP_DIR%\HKCU_ControlPanel_Accessibility.reg" /y
reg export "HKCU\System\GameConfigStore" "%BACKUP_DIR%\HKCU_GameConfigStore.reg" /y
reg export "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" "%BACKUP_DIR%\HKLM_PriorityControl.reg" /y
reg export "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" "%BACKUP_DIR%\HKLM_Tcpip_Parameters.reg" /y
echo [SUCCESS] Registry backup completed!
pause
