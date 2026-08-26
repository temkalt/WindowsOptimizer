@echo off
chcp 65001 >nul
title WindowsOptimizer 2.0 - Ultimate Esports Kernel & System Suite
cd /d "%~dp0"

net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

if exist "%~dp0WindowsOptimizer.ps1" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0WindowsOptimizer.ps1"
) else (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "d:\winvan\WindowsOptimizer.ps1"
)
pause
