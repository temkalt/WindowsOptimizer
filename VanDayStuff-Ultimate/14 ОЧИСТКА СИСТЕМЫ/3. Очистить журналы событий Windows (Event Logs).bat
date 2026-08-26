@echo off
chcp 65001 >nul
title Очистка журналов событий
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
for /f "tokens=*" %%1 in ('wevtutil.exe el') do (wevtutil.exe cl "%%1" 2>nul)
echo [УСПЕХ] Все журналы событий Windows очищены!
pause
