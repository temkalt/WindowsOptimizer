Write-Host "[*] Enabling MSI Mode for Display Adapters (GPU)..." -ForegroundColor Cyan
$gpus = Get-PnpDevice -Class Display | Where-Object { $_.Present -eq $true }
foreach ($gpu in $gpus) {
    $devPath = "HKLM:\SYSTEM\CurrentControlSet\Enum\$($gpu.InstanceId)\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties"
    if (-not (Test-Path $devPath)) { New-Item -Path $devPath -Force | Out-Null }
    Set-ItemProperty -Path $devPath -Name "MSISupported" -Value 1 -Type DWord -Force
    Set-ItemProperty -Path $devPath -Name "MessageNumberLimit" -Value 2048 -Type DWord -Force

    $affPath = "HKLM:\SYSTEM\CurrentControlSet\Enum\$($gpu.InstanceId)\Device Parameters\Interrupt Management\Affinity Policy"
    if (-not (Test-Path $affPath)) { New-Item -Path $affPath -Force | Out-Null }
    Set-ItemProperty -Path $affPath -Name "DevicePriority" -Value 3 -Type DWord -Force
    Write-Host " [+] GPU MSI Mode Enabled (High Priority): $($gpu.FriendlyName)" -ForegroundColor Green
}
Write-Host "[SUCCESS] GPU MSI Mode configured!" -ForegroundColor Green
