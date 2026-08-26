@echo off
chcp 65001 >nul
title Калибровка Ryzen 7 9800X3D (Zen 5)
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process cmd -ArgumentList '/c ""%~f0""' -Verb RunAs"
    exit /b
)
color 0A
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 45bcc044-d885-43e8-ab6b-d03e52292c42 -ATTRIB_HIDE >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 0 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 2 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 45bcc044-d885-43e8-ab6b-d03e52292c42 100 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1
echo [УСПЕХ] Ryzen 7 9800X3D переведен в режим максимального буста (EPP 0, Aggressive Boost 100%%)!
pause
