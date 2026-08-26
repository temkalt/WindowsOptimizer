@echo off
chcp 65001 >nul
title Проверка прав Администратора
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Нет прав Администратора. Запрос повышения...
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
echo [УСПЕХ] Скрипт запущен с полными правами Администратора!
pause
