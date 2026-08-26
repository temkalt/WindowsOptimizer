@echo off
chcp 65001 >nul
title Отключение сжатия оперативной памяти
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
powershell -Command "Disable-MMAgent -MemoryCompression -PageCombining -ApplicationPreLaunch -OperationEndpoints -ErrorAction SilentlyContinue"
echo [УСПЕХ] Сжатие памяти MMAgent отключено!
pause
