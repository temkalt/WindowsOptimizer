@echo off
title ApexTweak - Ultimate Windows Gaming Optimizer
color 0b
echo ================================================================
echo    APEXTWEAK: ULTIMATE WINDOWS GAMING OPTIMIZER
echo ================================================================
echo.
echo [1/3] Запуск Native Core Engine на порту 5050...
start /b "" node server\engine.js

echo [2/3] Запуск интерфейса ApexTweak UI...
start /b "" npx vite --host

echo [3/3] Открытие приложения...
timeout /t 2 >nul
start http://localhost:5173

echo.
echo ================================================================
echo    ApexTweak успешно запущен и работает!
echo    Интерфейс доступен по адресу: http://localhost:5173
echo ================================================================
echo.
pause
