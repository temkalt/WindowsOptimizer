@echo off
chcp 65001 >nul
title Отключение Hyper-V
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
bcdedit /set hypervisorlaunchtype off >nul 2>&1
echo [УСПЕХ] Гипервизор отключен! DPC задержки снижены.
pause
