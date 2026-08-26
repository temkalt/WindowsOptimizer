@echo off
chcp 65001 >nul
title Активация плана Igromanoff AMD Standart
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
set POW=%~dp0Файлы_планов_POW\Igromanoff AMD.pow
powercfg -import "%POW%" 88888888-8888-8888-8888-888888888888 >nul 2>&1
powercfg -setactive 88888888-8888-8888-8888-888888888888 >nul 2>&1
echo [УСПЕХ] План 'Igromanoff AMD Standart' активирован!
powercfg -getactivescheme
pause
