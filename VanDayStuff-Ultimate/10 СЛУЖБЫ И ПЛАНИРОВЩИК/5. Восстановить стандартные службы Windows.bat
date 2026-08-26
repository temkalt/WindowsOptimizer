@echo off
chcp 65001 >nul
title Восстановление служб
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
sc config Spooler start= auto >nul 2>&1
sc config WSearch start= auto >nul 2>&1
sc config SysMain start= auto >nul 2>&1
sc config DPS start= auto >nul 2>&1
sc config DiagTrack start= auto >nul 2>&1
echo [УСПЕХ] Стандартные службы восстановлены в режим автозапуска!
pause
