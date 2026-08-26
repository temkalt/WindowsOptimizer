@echo off
chcp 65001 >nul
title Anomaly Resolution Input Lag Fix
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
echo ============================================================================
echo   ANOMALY RESOLUTION INPUT LAG FIX (IGROMANOFF METHOD)
echo ============================================================================
echo  [ИНФО] Фикс задержки растянутого разрешения (4:3) и калибровка TDR GPU.
echo ============================================================================
echo.

echo [*] 1/3 Применение настроек TDR Watch...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TdrLevel" /t REG_DWORD /d 3 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TdrDelay" /t REG_DWORD /d 10 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TdrDdiDelay" /t REG_DWORD /d 10 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" /v "TdrDebugMode" /t REG_DWORD /d 0 /f >nul 2>&1

echo [*] 2/3 Разрешение запуска PowerShell скриптов (ExecutionPolicy Bypass)...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope LocalMachine -Force -ErrorAction SilentlyContinue" >nul 2>&1

echo [*] 3/3 Настройка аппаратного масштабирования Full Screen Scaling...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Configuration" /v "Scaling" /t REG_DWORD /d 3 /f >nul 2>&1
powershell -Command "Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Configuration' -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Property -contains 'Scaling' } | ForEach-Object { Set-ItemProperty -Path $_.PSPath -Name 'Scaling' -Value 3 -Type DWord -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo.
echo ============================================================================
echo [УСПЕХ] Anomaly Resolution Fix успешно применен!
echo.
echo [!] ВАЖНО:
echo  1. В Панели управления NVIDIA перейдите в:
echo     "Регулировка размера и положения рабочего стола"
echo  2. Выберите режим: "Во весь экран", поставьте галочку "Замещение режима масштабирования"
echo  3. После перезагрузки там может отображаться "Не выполнять масштабирование" - так и должно быть!
echo ============================================================================
pause
