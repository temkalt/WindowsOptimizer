@echo off
sc stop WSearch >nul 2>&1
sc config WSearch start= disabled >nul 2>&1
echo [SUCCESS] Windows Search indexing disabled!
pause
