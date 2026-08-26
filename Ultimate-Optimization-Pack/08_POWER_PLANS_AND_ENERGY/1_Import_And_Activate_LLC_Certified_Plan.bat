@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
set POW="d:\winvan\LLC Pack\4. План-питания\LLC-CERTIFIED.pow"
if exist %POW% (
    powercfg -import %POW% 33333333-3333-3333-3333-333333333333 2>nul
    powercfg -setactive 33333333-3333-3333-3333-333333333333 2>nul
    echo [SUCCESS] LLC-CERTIFIED Power Plan activated!
) else (
    powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
    powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61
    echo [SUCCESS] Ultimate Performance Plan activated!
)
pause
