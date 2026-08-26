@echo off
chcp 65001 >nul
title Очистка временных файлов
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
del /s /f /q "%temp%\*.*" 2>nul
del /s /f /q "C:\Windows\Temp\*.*" 2>nul
del /s /f /q "C:\Windows\Prefetch\*.*" 2>nul
del /s /f /q "C:\Users\%username%\AppData\Local\CrashDumps\*.*" 2>nul
echo [УСПЕХ] Временные файлы очищены!
pause
