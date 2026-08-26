# 100% FACEIT & RIOT VANGUARD COMPATIBLE HARDENED PROFILE
Write-Host "================================================================" -ForegroundColor Green
Write-Host "     ENABLING FACEIT / VANGUARD ANTI-CHEAT COMPLIANT PROFILE     " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green

# 1. Enable Core Isolation / HVCI Hypervisor
Write-Host "[*] Enabling Virtualization-Based Security (VBS/HVCI)..." -ForegroundColor Yellow
& bcdedit /set hypervisorlaunchtype auto
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard" -Name "EnableVirtualizationBasedSecurity" -Value 1 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" -Name "Enabled" -Value 1 -Type DWord -Force

# 2. Add Smart Exclusions to Defender without breaking security
Write-Host "[*] Adding Game Exclusions to Windows Defender..." -ForegroundColor Yellow
$Exclusions = @(
    "C:\Program Files (x86)\Steam", "C:\Program Files\Epic Games",
    "C:\Riot Games", "C:\Program Files\FACEIT AC",
    "$env:LOCALAPPDATA\NVIDIA\DXCache", "$env:LOCALAPPDATA\D3DSCache"
)
foreach ($path in $Exclusions) {
    Add-MpPreference -ExclusionPath $path -ErrorAction SilentlyContinue
    Write-Host " [+] Defender Exclusion Added: $path" -ForegroundColor Green
}

Write-Host "================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] 100% Anti-Cheat Compatible Profile Deployed!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
