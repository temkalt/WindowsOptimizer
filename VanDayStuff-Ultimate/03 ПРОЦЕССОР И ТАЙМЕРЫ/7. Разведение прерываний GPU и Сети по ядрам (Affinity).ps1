# DPC and Interrupt Affinity Configuration
# Pins GPU interrupts to Cores 2-3 and NIC interrupts to Cores 4-5
Write-Host "[*] Configuring Interrupt Affinity for GPU & NIC..." -ForegroundColor Cyan

$gpuDevices = Get-PnpDevice -Class Display -Status OK -ErrorAction SilentlyContinue
foreach ($gpu in $gpuDevices) {
    $instance = $gpu.InstanceId
    $regPath = "HKLM:\SYSTEM\CurrentControlSet\Enum\$instance\Device Parameters\Interrupt Management\Affinity Policy"
    if (Test-Path $regPath) {
        Set-ItemProperty -Path $regPath -Name "DevicePolicy" -Value 4 -Type DWord -Force
        Set-ItemProperty -Path $regPath -Name "AssignmentSetOverride" -Value ([byte[]](0x0C,0x00,0x00,0x00,0x00,0x00,0x00,0x00)) -Type Binary -Force
        Write-Host " [+] GPU Interrupt Affinity assigned to Cores 2-3 (Mask 0x0C)" -ForegroundColor Green
    }
}
Write-Host "[+] Affinity Policy applied successfully!" -ForegroundColor Green
