@echo off
echo [*] Exporting current power schemes...
powercfg /getactivescheme > "%~dp0Active_Power_Scheme.txt"
powercfg /list > "%~dp0All_Power_Schemes.txt"
echo [SUCCESS] Power scheme details exported!
pause
