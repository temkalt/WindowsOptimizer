@echo off
chcp 65001 >nul
title Импорт профиля драйвера NVIDIA
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
if exist "%TOOL%" (
    "%TOOL%" "%NIP%" -silent
    echo [УСПЕХ] Киберспортивный профиль NVIDIA LLC-V2 успешно импортирован!
) else (
    echo [ОШИБКА] Файл nvidiaProfileInspector.exe не найден.
)
pause
