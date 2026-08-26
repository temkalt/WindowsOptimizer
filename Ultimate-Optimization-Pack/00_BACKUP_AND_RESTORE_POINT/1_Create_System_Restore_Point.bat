@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Please run this file as Administrator!
    pause
    exit /b 1
)
echo [*] Bypassing 24h Restore Point frequency limitation...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore" /v "SystemRestorePointCreationFrequency" /t REG_DWORD /d 0 /f >nul
echo [*] Enabling System Restore on Drive C:...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Enable-ComputerRestore -Drive 'C:\' -ErrorAction SilentlyContinue"
echo [*] Creating System Restore Point 'Ultimate_Optimization_Pre_Tweak_Backup'...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Checkpoint-Computer -Description 'Ultimate_Optimization_Pre_Tweak_Backup' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue"
echo [SUCCESS] System Restore Point Created Successfully!
pause
