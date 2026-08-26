@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR CPMINCORES 100
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR CPMAXCORES 100
powercfg -setactive SCHEME_CURRENT
echo [SUCCESS] All physical and logical CPU cores unparked!
pause
