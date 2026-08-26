@echo off
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFEPP 0 2>nul
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFEPP1 0 2>nul
powercfg -setactive SCHEME_CURRENT
echo [SUCCESS] EPP set to 0 (100% frequency retention)!
pause
