@echo off
chcp 65001 >nul
title Оптимизация Spectre и Meltdown
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0E
echo ============================================================================
echo  ОТКЛЮЧЕНИЕ ПРОГРАММНЫХ МИТИГАЦИЙ SPECTRE/MELTDOWN ДЛЯ ИГР
echo ============================================================================
echo  [ИНФО] Снижает накладные расходы на системные вызовы ядра.
echo ============================================================================
echo.
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverride" /t REG_DWORD /d 3 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverrideMask" /t REG_DWORD /d 3 /f >nul 2>&1
echo [УСПЕХ] Митигации отключены для максимальной скорости CPU!
pause
