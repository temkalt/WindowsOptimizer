# REALTEK 2.5GbE (RTL8125BG) ESPORTS ZERO-LATENCY PROFILING
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "       CONFIGURING REALTEK 2.5GbE LAN LOW-LATENCY PROFILE       " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$nics = Get-NetAdapter | Where-Object { $_.Status -eq "Up" -and $_.InterfaceDescription -match "Realtek|RTL8125|Family Controller" }
if ($nics.Count -eq 0) { $nics = Get-NetAdapter | Where-Object { $_.Status -eq "Up" -and $_.Virtual -eq $false } }

foreach ($nic in $nics) {
    Write-Host " [+] Tuning Adapter: $($nic.Name) ($($nic.InterfaceDescription))" -ForegroundColor Yellow
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "*Interrupt Moderation" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "*Energy Efficient Ethernet" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "Energy Efficient Ethernet" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "Green Ethernet" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "Gigabit Lite" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "Power Saving Mode" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "*FlowControl" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "Flow Control" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "*Receive Side Scaling" -DisplayValue "Enabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "*Max number of RSS Queues" -DisplayValue "4" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "Large Send Offload v2 (IPv4)" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "Large Send Offload v2 (IPv6)" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "*Receive Buffers" -DisplayValue "1024" -ErrorAction SilentlyContinue
    Set-NetAdapterAdvancedProperty -Name $nic.Name -DisplayName "*Transmit Buffers" -DisplayValue "1024" -ErrorAction SilentlyContinue
    Set-NetAdapterPowerManagement -Name $nic.Name -WakeOnMagicPacket Disabled -ErrorAction SilentlyContinue
}

# Deploy RSS on Cores 4-7 to leave cores 0-3 pure for game render
if ($nics -and $nics.Count -gt 0) {
    Set-NetAdapterRss -Name $nics[0].Name -BaseProcessorNumber 4 -MaxProcessors 4 -Profile NUMAScaling -ErrorAction SilentlyContinue
} elseif ($nics) {
    Set-NetAdapterRss -Name $nics.Name -BaseProcessorNumber 4 -MaxProcessors 4 -Profile NUMAScaling -ErrorAction SilentlyContinue
}

Write-Host "================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] Realtek 2.5GbE Low Latency settings applied!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
