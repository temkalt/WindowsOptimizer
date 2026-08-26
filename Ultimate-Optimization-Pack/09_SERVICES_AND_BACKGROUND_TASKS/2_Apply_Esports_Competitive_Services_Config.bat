@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
set SERVICES=DPS WSearch Spooler edgeupdate edgeupdatem DiagTrack dmwappushservice SysMain TabletInputService TapiSrv Telemetry W32Time WalletService WarpJITSvc WbioSrvc WcsPlugInService WdNisSvc WerSvc wisvc WlanSvc wlidsvc wmiApSrv wscsvc WSService wuauserv XblAuthManager XblGameSave XboxGipSvc XboxNetApiSvc GameInputSvc bam Netlogon SessionEnv LanmanWorkstation rdpbus umbus CompositeBus
for %%S in (%SERVICES%) do (
    sc stop %%S >nul 2>&1
    sc config %%S start= disabled >nul 2>&1
    echo  [+] Disabled: %%S
)
echo [SUCCESS] Competitive services profile applied!
pause
