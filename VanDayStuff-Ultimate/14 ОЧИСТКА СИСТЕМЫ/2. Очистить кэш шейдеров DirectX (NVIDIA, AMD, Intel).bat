@echo off
chcp 65001 >nul
title Очистка кэша шейдеров DirectX
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
del /s /f /q "%LocalAppData%\NVIDIA\DXCache\*.*" 2>nul
del /s /f /q "%LocalAppData%\NVIDIA\GLCache\*.*" 2>nul
del /s /f /q "%LocalAppData%\AMD\DxCache\*.*" 2>nul
del /s /f /q "%LocalAppData%\D3DSCache\*.*" 2>nul
echo [УСПЕХ] Кэш шейдеров DirectX очищен!
pause
