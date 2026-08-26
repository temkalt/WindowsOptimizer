@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
reg add "HKLM\SYSTEM\CurrentControlSet\Services\USB\Parameters" /v "DisableSelectiveSuspend" /t REG_DWORD /d 1 /f >nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Enum\USB' -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.PSChildName -eq 'Device Parameters' } | ForEach-Object { Set-ItemProperty -Path $_.PSPath -Name 'EnhancedPowerManagementEnabled' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue; Set-ItemProperty -Path $_.PSPath -Name 'SelectiveSuspendEnabled' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue; Set-ItemProperty -Path $_.PSPath -Name 'AllowIdleIrpInD3' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue }"
echo [SUCCESS] USB power throttling disabled!
pause
