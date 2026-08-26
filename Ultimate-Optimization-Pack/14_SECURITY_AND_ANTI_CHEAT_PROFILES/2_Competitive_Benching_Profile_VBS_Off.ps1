# MAXIMUM 1% LOW BENCHMARK PROFILE (VBS OFF, EXPLOIT PROTECTION OFF FOR GAMES)
Write-Host "================================================================" -ForegroundColor Magenta
Write-Host "       DEPLOYING BENCHMARKING PROFILE (MAXIMUM 1% LOW FPS)       " -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Magenta

# 1. Disable VBS / HVCI Hypervisor Overhead
Write-Host "[*] Disabling Virtualization-Based Security (VBS/HVCI)..." -ForegroundColor Yellow
& bcdedit /set hypervisorlaunchtype off
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard" -Name "EnableVirtualizationBasedSecurity" -Value 0 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" -Name "Enabled" -Value 0 -Type DWord -Force

# 2. Disable Control Flow Guard (CFG) for CS2 and Apex Legends (+10% 1% Lows)
Write-Host "[*] Disabling CFG Exploit Mitigation per-game executable..." -ForegroundColor Yellow
try {
    Set-ProcessMitigation -Name "cs2.exe" -Disable CFG,StrictCFG -ErrorAction SilentlyContinue
    Set-ProcessMitigation -Name "r5apex.exe" -Disable CFG,StrictCFG -ErrorAction SilentlyContinue
    Set-ProcessMitigation -Name "cod.exe" -Disable CFG,StrictCFG -ErrorAction SilentlyContinue
    Write-Host "[+] CFG disabled for cs2.exe, r5apex.exe, cod.exe!" -ForegroundColor Green
} catch {}

Write-Host "================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] Maximum Framerate Benching Profile Deployed!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
