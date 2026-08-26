@echo off
chcp 65001 >nul
title Активация плана Igromanoff INTEL
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
set POW=%~dp0Файлы_планов_POW\Igromanoff INTEL V2.pow
powercfg -import "%POW%" 99999999-9999-9999-9999-999999999999 >nul 2>&1
powercfg -setactive 99999999-9999-9999-9999-999999999999 >nul 2>&1
echo [УСПЕХ] План 'Igromanoff INTEL' активирован!
powercfg -getactivescheme
pause
