@echo off
chcp 65001 >nul
title Отключение VBS и Core Isolation
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0C
echo ============================================================================
echo  ОТКЛЮЧЕНИЕ VBS, HVCI (CORE ISOLATION) И MEMORY INTEGRITY
echo ============================================================================
echo  [ИНФО] Устраняет задержки виртуализации в играх (+5-15%% 1%% Low FPS).
echo ============================================================================
echo.
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard" /v "EnableVirtualizationBasedSecurity" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard" /v "RequirePlatformSecurityFeatures" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" /v "Enabled" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\CredentialGuard" /v "Enabled" /t REG_DWORD /d 0 /f >nul 2>&1
bcdedit /set hypervisorlaunchtype off >nul 2>&1
echo [УСПЕХ] VBS и Core Isolation отключены! Перезагрузите ПК.
pause
