@echo off
chcp 65001 >nul
title Ускорение файловой системы NTFS
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
fsutil behavior set disablelastaccess 1 >nul 2>&1
fsutil behavior set disable8dot3 1 >nul 2>&1
echo [УСПЕХ] Лишние дисковые операции NTFS отключены!
pause
