@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
echo [*] Disabling 8.3 short name generation...
fsutil.exe 8dot3name set 1
echo [*] Disabling NTFS Last Access timestamp updates...
fsutil behavior set disablelastaccess 1
echo [*] Increasing NTFS MFT memory cache buffer...
fsutil behavior set memoryusage 2
echo [*] Enabling TRIM...
fsutil behavior set DisableDeleteNotify 0
echo [SUCCESS] NTFS file system optimized!
pause
