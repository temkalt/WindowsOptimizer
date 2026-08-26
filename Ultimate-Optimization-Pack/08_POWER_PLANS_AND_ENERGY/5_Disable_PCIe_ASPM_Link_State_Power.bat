@echo off
powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPMOFF 0
powercfg -setdcvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPMOFF 0
powercfg -setactive SCHEME_CURRENT
echo [SUCCESS] PCIe link state power saving disabled!
pause
