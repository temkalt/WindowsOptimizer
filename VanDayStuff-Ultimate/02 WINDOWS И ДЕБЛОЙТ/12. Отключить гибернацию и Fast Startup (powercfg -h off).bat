@echo off
chcp 65001 >nul
title Отключение гибернации
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
powercfg -h off
echo [УСПЕХ] Файл hiberfil.sys удален, гибернация отключена!
pause
