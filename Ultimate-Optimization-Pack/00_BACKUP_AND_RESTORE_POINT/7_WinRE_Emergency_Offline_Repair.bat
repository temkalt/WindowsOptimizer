@echo off
title APEXTWEAK EMERGENCY OFFLINE WINRE RECOVERY
color 4F
echo ============================================================================
echo         APEXTWEAK OFFLINE WINRE REPAIR SCRIPT (FOR WINDOWS RECOVERY)
echo ============================================================================
echo.
echo [*] Detecting Windows OS installation drive in offline environment...
set TARGET_DRIVE=C:
if exist D:\Windows\System32 set TARGET_DRIVE=D:
if exist E:\Windows\System32 set TARGET_DRIVE=E:
if exist F:\Windows\System32 set TARGET_DRIVE=F:
echo [+] Windows detected on %TARGET_DRIVE%\Windows
echo.

echo [*] 1/4 Running Offline System File Checker (SFC)...
sfc /scannow /offbootdir=%TARGET_DRIVE%\ /offwindir=%TARGET_DRIVE%\Windows

echo.
echo [*] 2/4 Restoring BCD Bootloader configuration...
bcdedit /set {default} disabledynamictick no >nul 2>&1
bcdedit /set {default} useplatformclock no >nul 2>&1
bcdedit /set {default} hypervisorlaunchtype auto >nul 2>&1
bcdedit /set {default} bootux standard >nul 2>&1
bcdedit /set {default} quietboot no >nul 2>&1

echo.
echo [*] 3/4 Enabling Essential Offline Core Services in Registry Hive...
reg load HKLM\OFFLINE_SYSTEM %TARGET_DRIVE%\Windows\System32\config\SYSTEM
reg add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\RpcSs" /v "Start" /t REG_DWORD /d 2 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\DcomLaunch" /v "Start" /t REG_DWORD /d 2 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\PlugPlay" /v "Start" /t REG_DWORD /d 2 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\Power" /v "Start" /t REG_DWORD /d 2 /f >nul
reg add "HKLM\OFFLINE_SYSTEM\ControlSet001\Services\WinDefend" /v "Start" /t REG_DWORD /d 2 /f >nul
reg unload HKLM\OFFLINE_SYSTEM

echo.
echo [*] 4/4 Clearing temporary pending updates flag...
del /f /q %TARGET_DRIVE%\Windows\WinSxS\pending.xml >nul 2>&1

echo ============================================================================
echo [SUCCESS] Offline repairs complete! Reboot into Windows normally.
echo ============================================================================
pause
