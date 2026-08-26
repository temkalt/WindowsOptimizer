Write-Host "[*] Disabling Energy Efficient Ethernet & Power Saving on Network Adapters..." -ForegroundColor Cyan
$adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" -and $_.Virtual -eq $false }
foreach ($adapter in $adapters) {
    Write-Host " [+] Configuring: $($adapter.Name)" -ForegroundColor Green
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "*Energy Efficient Ethernet" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "Energy Efficient Ethernet" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "Advanced EEE" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "Green Ethernet" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "Gigabit Lite" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "Power Saving Mode" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "Flow Control" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $adapter.Name -DisplayName "*FlowControl" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterPowerManagement -Name $adapter.Name -WakeOnMagicPacket Disabled -ErrorAction SilentlyContinue
}
Write-Host "[SUCCESS] Network power saving disabled!" -ForegroundColor Green
