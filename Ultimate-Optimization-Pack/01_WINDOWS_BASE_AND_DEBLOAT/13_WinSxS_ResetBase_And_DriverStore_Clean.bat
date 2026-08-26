@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
color 0A
echo ============================================================================
echo     WINSXS RESETBASE & DRIVER STORE DEDUPLICATION CLEANUP ENGINE
echo ============================================================================
echo [*] 1/3 Cleaning WinSxS Component Store (/ResetBase)...
dism /online /Cleanup-Image /StartComponentCleanup /ResetBase

echo [*] 2/3 Deduplicating and removing obsolete OEM Driver packages...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "
$drivers = pnputil /enum-drivers
$oems = [regex]::Matches($drivers, 'Published Name:s+(oemd+.inf)') | ForEach-Object { $_.Groups[1].Value }
foreach ($oem in $oems) {
    pnputil /delete-driver $oem /uninstall /force 2>$null | Out-Null
}
Write-Host '[+] Obsolete driver store packages purged!' -ForegroundColor Green
"

echo [*] 3/3 Clearing Windows Update Delivery & Temp caches...
net stop wuauserv >nul 2>&1
net stop bits >nul 2>&1
del /f /s /q %SystemRoot%\SoftwareDistribution\Download\* >nul 2>&1
del /f /s /q %TEMP%\* >nul 2>&1
del /f /s /q %SystemRoot%\Temp\* >nul 2>&1
net start wuauserv >nul 2>&1
net start bits >nul 2>&1

echo ============================================================================
echo [SUCCESS] Deep WinSxS and Driver Store cleanup finished!
echo ============================================================================
pause
