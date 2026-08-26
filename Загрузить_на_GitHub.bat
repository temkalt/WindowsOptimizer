@echo off
chcp 65001 >nul
title Загрузка WindowsOptimizer на GitHub
color 0A
cls
echo ============================================================================
echo      ПУБЛИКАЦИЯ BLACK ONYX WINDOWS OPTIMIZER В GITHUB РЕПОЗИТОРИЙ
echo ============================================================================
echo   Репозиторий: https://github.com/temkalt/WindowsOptimizer.git
echo ============================================================================
echo.

cd /d "d:\winvan"

echo [*] Инициализация Git...
git init
git branch -M main

echo [*] Добавление файлов в коммит...
git add .

echo [*] Создание коммита...
git commit -m "feat: Initial release of Black Onyx WindowsOptimizer Suite 2026"

echo [*] Привязка удаленного репозитория GitHub...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/temkalt/WindowsOptimizer.git

echo [*] Отправка в GitHub (git push)...
git push -u origin main --force

echo.
echo ============================================================================
echo [УСПЕХ] Проект успешно опубликован на GitHub!
echo Команда для запуска на любом ПК в PowerShell:
echo irm https://raw.githubusercontent.com/temkalt/WindowsOptimizer/main/launch.ps1 | iex
echo ============================================================================
pause
