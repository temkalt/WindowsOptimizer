@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
sc config DiagTrack start= disabled >nul 2>&1
sc stop DiagTrack >nul 2>&1
sc config dmwappushservice start= disabled >nul 2>&1
sc stop dmwappushservice >nul 2>&1
sc config WerSvc start= disabled >nul 2>&1
sc stop WerSvc >nul 2>&1
sc config RetailDemo start= disabled >nul 2>&1
sc stop RetailDemo >nul 2>&1
sc config RemoteRegistry start= disabled >nul 2>&1
sc stop RemoteRegistry >nul 2>&1
sc config MapsBroker start= disabled >nul 2>&1
sc stop MapsBroker >nul 2>&1
sc config SysMain start= disabled >nul 2>&1
sc stop SysMain >nul 2>&1
echo [SUCCESS] Safe services configuration applied!
pause
