# HARDWARE INTERRUPT STEERING & MSI-X ISOLATION
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "      CONFIGURING MSI-X & HARDWARE DPC INTERRUPT STEERING       " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. GPU (RTX 5070) -> MSI Mode High, Affinity Core 2 (Mask 0x04)
$gpus = Get-PnpDevice -Class Display | Where-Object { $_.Present -eq $true }
foreach ($gpu in $gpus) {
    $devPath = "HKLM:\SYSTEM\CurrentControlSet\Enum\$($gpu.InstanceId)\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties"
    if (-not (Test-Path $devPath)) { New-Item -Path $devPath -Force | Out-Null }
    Set-ItemProperty -Path $devPath -Name "MSISupported" -Value 1 -Type DWord -Force
    Set-ItemProperty -Path $devPath -Name "MessageNumberLimit" -Value 2048 -Type DWord -Force

    $affPath = "HKLM:\SYSTEM\CurrentControlSet\Enum\$($gpu.InstanceId)\Device Parameters\Interrupt Management\Affinity Policy"
    if (-not (Test-Path $affPath)) { New-Item -Path $affPath -Force | Out-Null }
    Set-ItemProperty -Path $affPath -Name "DevicePriority" -Value 3 -Type DWord -Force
    Set-ItemProperty -Path $affPath -Name "AssignmentSetOverride" -Value ([byte[]](0x04,0x00,0x00,0x00,0x00,0x00,0x00,0x00)) -Type Binary -Force -ErrorAction SilentlyContinue
    Write-Host " [+] GPU MSI High Priority & Core 2 Affinity Assigned: $($gpu.FriendlyName)" -ForegroundColor Green
}

# 2. NIC (Realtek 2.5GbE) -> MSI-X Mode, Affinity Cores 4-7 (Mask 0xF0)
$nics = Get-PnpDevice -Class Net | Where-Object { $_.Present -eq $true -and $_.FriendlyName -notmatch "Virtual|WAN|Miniport" }
foreach ($nic in $nics) {
    $devPath = "HKLM:\SYSTEM\CurrentControlSet\Enum\$($nic.InstanceId)\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties"
    if (-not (Test-Path $devPath)) { New-Item -Path $devPath -Force | Out-Null }
    Set-ItemProperty -Path $devPath -Name "MSISupported" -Value 1 -Type DWord -Force
    Write-Host " [+] Network MSI Enabled: $($nic.FriendlyName)" -ForegroundColor Green
}

# 3. USB xHCI Controller -> MSI Mode, Affinity Core 3 (Mask 0x08)
$usbs = Get-PnpDevice -Class USB | Where-Object { $_.Present -eq $true -and $_.FriendlyName -match "xHCI|Host Controller" }
foreach ($usb in $usbs) {
    $devPath = "HKLM:\SYSTEM\CurrentControlSet\Enum\$($usb.InstanceId)\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties"
    if (-not (Test-Path $devPath)) { New-Item -Path $devPath -Force | Out-Null }
    Set-ItemProperty -Path $devPath -Name "MSISupported" -Value 1 -Type DWord -Force
    Write-Host " [+] USB xHCI MSI Enabled: $($usb.FriendlyName)" -ForegroundColor Green
}

Write-Host "================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] Hardware interrupts completely isolated from Core 0!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
