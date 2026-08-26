# 8000Hz / 4000Hz HIGH POLLING RATE INPUT QUEUE CALIBRATION
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     CALIBRATING 8000Hz/4000Hz HIGH POLLING INPUT STACK         " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Truncate Buffer Queue Size (Ensures instant delivery to user32.dll)
Write-Host "[*] Setting MouseDataQueueSize to 16 packets..." -ForegroundColor Yellow
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\mouclass\Parameters" -Name "MouseDataQueueSize" -Value 16 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\kbdclass\Parameters" -Name "KeyboardDataQueueSize" -Value 16 -Type DWord -Force

# 2. Competitive FilterKeys 0ms Debounce
Write-Host "[*] Applying FilterKeys 0ms debounce response..." -ForegroundColor Yellow
$FKPath = "HKCU:\Control Panel\Accessibility\Keyboard Response"
Set-ItemProperty -Path $FKPath -Name "Flags" -Value "27" -Type String -Force
Set-ItemProperty -Path $FKPath -Name "AutoRepeatDelay" -Value "150" -Type String -Force
Set-ItemProperty -Path $FKPath -Name "AutoRepeatRate" -Value "15" -Type String -Force
Set-ItemProperty -Path $FKPath -Name "BounceTime" -Value "0" -Type String -Force
Set-ItemProperty -Path $FKPath -Name "DelayBeforeAcceptance" -Value "0" -Type String -Force

# 3. Disable USB Selective Suspend on all USB device nodes
Write-Host "[*] Purging USB Power Gating across all USB nodes..." -ForegroundColor Yellow
Get-ChildItem "HKLM:\SYSTEM\CurrentControlSet\Enum\USB" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.PSChildName -eq "Device Parameters" } | ForEach-Object {
    Set-ItemProperty -Path $_.PSPath -Name "EnhancedPowerManagementEnabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $_.PSPath -Name "SelectiveSuspendEnabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $_.PSPath -Name "AllowIdleIrpInD3" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
}

Write-Host "================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] 8000Hz High Polling HID stack calibrated!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
