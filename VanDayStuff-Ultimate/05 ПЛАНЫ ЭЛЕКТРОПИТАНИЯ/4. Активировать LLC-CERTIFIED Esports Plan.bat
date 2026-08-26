@echo off
chcp 65001 >nul
title Активация плана LLC-CERTIFIED
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
set POW=%~dp0Файлы_планов_POW\LLC-CERTIFIED.pow
powercfg -import "%POW%" 33333333-3333-3333-3333-333333333333 >nul 2>&1
powercfg -setactive 33333333-3333-3333-3333-333333333333 >nul 2>&1
echo [УСПЕХ] План 'LLC-CERTIFIED' активирован!
powercfg -getactivescheme
pause
