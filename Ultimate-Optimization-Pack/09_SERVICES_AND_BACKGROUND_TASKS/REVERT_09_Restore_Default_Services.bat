@echo off
sc config Spooler start= auto >nul 2>&1
sc start Spooler >nul 2>&1
sc config WSearch start= auto >nul 2>&1
sc start WSearch >nul 2>&1
sc config SysMain start= auto >nul 2>&1
sc start SysMain >nul 2>&1
sc config DPS start= auto >nul 2>&1
sc start DPS >nul 2>&1
echo [SUCCESS] Default services restored!
pause
