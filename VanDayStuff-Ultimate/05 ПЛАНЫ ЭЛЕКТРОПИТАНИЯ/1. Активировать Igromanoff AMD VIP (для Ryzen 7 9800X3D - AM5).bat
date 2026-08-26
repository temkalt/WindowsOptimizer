@echo off
chcp 65001 >nul
title Активация плана Igromanoff AMD VIP
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
set POW=%~dp0Файлы_планов_POW\Igromanoff AMD VIP.pow
powercfg -import "%POW%" 77777777-7777-7777-7777-777777777777 >nul 2>&1
powercfg -setactive 77777777-7777-7777-7777-777777777777 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPM 0 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1
echo [УСПЕХ] План 'Igromanoff AMD VIP' активирован!
powercfg -getactivescheme
pause
