@echo off
chcp 65001 >nul
title Отключение фоновых задач Windows (BoosterX preset)

:: Запуск PowerShell скрипта с запросом прав администратора (UAC)
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell.exe -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"\"%~dp0Disable_BoosterX_Scheduled_Tasks.ps1\"\"' -Verb RunAs"
