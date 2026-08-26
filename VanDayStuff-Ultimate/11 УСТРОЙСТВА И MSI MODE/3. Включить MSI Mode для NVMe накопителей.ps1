Write-Host "[*] Enabling MSI Mode for NVMe Controllers..." -ForegroundColor Cyan
$nvmes = Get-PnpDevice -Class SCSIAdapter | Where-Object { $_.Present -eq $true }
foreach ($nvme in $nvmes) {
    $devPath = "HKLM:\SYSTEM\CurrentControlSet\Enum\$($nvme.InstanceId)\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties"
    if (-not (Test-Path $devPath)) { New-Item -Path $devPath -Force | Out-Null }
    Set-ItemProperty -Path $devPath -Name "MSISupported" -Value 1 -Type DWord -Force
    Write-Host " [+] Storage Controller MSI Mode Enabled: $($nvme.FriendlyName)" -ForegroundColor Green
}
Write-Host "[SUCCESS] Storage MSI Mode configured!" -ForegroundColor Green
