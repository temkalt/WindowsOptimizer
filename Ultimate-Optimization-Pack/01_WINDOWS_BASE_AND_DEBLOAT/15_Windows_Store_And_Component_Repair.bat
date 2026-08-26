@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
color 0F
echo ============================================================================
echo         WINDOWS STORE, APPS & SYSTEM COMPONENT REPAIR THERAPY
echo ============================================================================
echo [*] Resetting Microsoft Store Cache (wsreset)...
start /wait wsreset.exe

echo [*] Re-registering all core AppX packages...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-AppXPackage -AllUsers | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register '$($_.InstallLocation)\AppXManifest.xml' -ErrorAction SilentlyContinue}"

echo [*] Refreshing Windows Component Store Health (DISM)...
dism /online /cleanup-image /restorehealth

echo [*] Validating System File Integrity (SFC)...
sfc /scannow

echo [SUCCESS] Windows Component Store and Store Apps Fully Repaired!
pause
