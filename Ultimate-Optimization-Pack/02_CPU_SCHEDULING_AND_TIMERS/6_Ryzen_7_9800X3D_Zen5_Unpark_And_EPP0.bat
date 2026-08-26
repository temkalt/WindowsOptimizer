@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
color 0C
echo ============================================================================
echo    AMD RYZEN 7 9800X3D (ZEN 5) UNPARKING & EPP MAXIMUM BOOST ENVELOPE
echo ============================================================================
echo [*] Unhiding processor power settings...
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb10593acda8 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 45bcc044-d885-43e8-ab6b-d03e52292c42 -ATTRIB_HIDE >nul 2>&1

echo [*] Enforcing 100%% unparked cores on Single CCD (0ns cross-core penalty)...
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 100
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb10593acda8 100

echo [*] Setting Energy Performance Preference (EPP) to 0 (Pure Performance)...
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 0

echo [*] Setting Boost Mode Aggressive & Boost Policy 100%%...
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 2
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 45bcc044-d885-43e8-ab6b-d03e52292c42 100

powercfg -setactive SCHEME_CURRENT
echo [SUCCESS] Ryzen 7 9800X3D power parameters fully calibrated!
pause
