Write-Host "[*] Tuning Hardware Offloads & RSS Queues..." -ForegroundColor Cyan
$adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" -and $_.Virtual -eq $false }
foreach ($adapter in $adapters) {
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "*Receive Side Scaling" -DisplayValue "Enabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "*Max number of RSS Queues" -DisplayValue "4" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "Large Send Offload v2 (IPv4)" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "Large Send Offload v2 (IPv6)" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
}
Write-Host "[SUCCESS] Network offloads optimized!" -ForegroundColor Green
