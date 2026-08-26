@echo off
chcp 65001 >nul
:: Проверка прав администратора
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Требуются права администратора! Перезапуск с повышением привилегий...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~dp0%~nx0\"\"' -Verb runAs"
    exit /b
)

title Отключение фоновых задач Windows
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Disable_BoosterX_Scheduled_Tasks.ps1"
echo.
pause
