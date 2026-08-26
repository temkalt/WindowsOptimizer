@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
echo [*] Exporting Network Adapter Advanced Properties...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-NetAdapterAdvancedProperty | Export-Clixml -Path '%~dp0NetworkAdapterBackup.xml' -Force"
echo [SUCCESS] Network adapter configuration exported to NetworkAdapterBackup.xml!
pause
