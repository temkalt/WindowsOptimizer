Write-Host "[*] Enabling MSI Mode for Ethernet Adapters..." -ForegroundColor Cyan
$nics = Get-PnpDevice -Class Net | Where-Object { $_.Present -eq $true -and $_.FriendlyName -notmatch "Virtual|WAN|Miniport|Kernel" }
foreach ($nic in $nics) {
    $devPath = "HKLM:\SYSTEM\CurrentControlSet\Enum\$($nic.InstanceId)\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties"
    if (-not (Test-Path $devPath)) { New-Item -Path $devPath -Force | Out-Null }
    Set-ItemProperty -Path $devPath -Name "MSISupported" -Value 1 -Type DWord -Force
    Write-Host " [+] Network Adapter MSI Mode Enabled: $($nic.FriendlyName)" -ForegroundColor Green
}
Write-Host "[SUCCESS] Network Adapter MSI Mode configured!" -ForegroundColor Green
