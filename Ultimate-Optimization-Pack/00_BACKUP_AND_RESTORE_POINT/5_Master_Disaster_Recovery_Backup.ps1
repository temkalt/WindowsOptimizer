# APEXTWEAK MASTER FAIL-SAFE BACKUP ENGINE
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     CREATING MASTER DISASTER RECOVERY BACKUP SNAPSHOT          " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupDir = Join-Path $PSScriptRoot "Snapshot_$Timestamp"
New-Item -ItemPath $BackupDir -ItemType Directory -Force | Out-Null

# 1. System Restore Point
Write-Host "[*] Creating VSS System Restore Point..." -ForegroundColor Yellow
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore" -Name "SystemRestorePointCreationFrequency" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
Enable-ComputerRestore -Drive "C:\" -ErrorAction SilentlyContinue
Checkpoint-Computer -Description "ApexTweak_MasterSnapshot_$Timestamp" -RestorePointType "MODIFY_SETTINGS" -ErrorAction SilentlyContinue

# 2. Registry Hives Export
Write-Host "[*] Exporting Registry Hives & Keys..." -ForegroundColor Yellow
$RegDir = Join-Path $BackupDir "Registry"
New-Item -ItemPath $RegDir -ItemType Directory -Force | Out-Null
& reg export "HKLM\SYSTEM\CurrentControlSet" "$RegDir\CurrentControlSet.reg" /y | Out-Null
& reg export "HKLM\SOFTWARE\Policies" "$RegDir\SoftwarePolicies.reg" /y | Out-Null
& reg export "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" "$RegDir\SystemProfile.reg" /y
& reg export "HKCU\Control Panel" "$RegDir\HKCU_ControlPanel.reg" /y
& reg export "HKCU\System\GameConfigStore" "$RegDir\GameConfigStore.reg" /y

# 3. Services State Snapshot
Write-Host "[*] Capturing Services State..." -ForegroundColor Yellow
Get-Service | Select-Object Name, DisplayName, Status, StartType | Export-Clixml -Path "$BackupDir\Services_State.xml" -Force
Get-Service | Select-Object Name, DisplayName, Status, StartType | ConvertTo-Json -Depth 3 | Set-Content -Path "$BackupDir\Services_State.json" -Encoding UTF8

# 4. Network Adapter Configuration
Write-Host "[*] Exporting Network Adapter State..." -ForegroundColor Yellow
Get-NetAdapterAdvancedProperty | Export-Clixml -Path "$BackupDir\NetAdapters_Advanced.xml" -Force

# 5. Power Scheme Binary Dump
Write-Host "[*] Exporting Active Power Scheme Binary..." -ForegroundColor Yellow
$ActiveGuid = ((powercfg /getactivescheme) -split ' ')[3]
if ($ActiveGuid) {
    powercfg /export "$BackupDir\ActiveScheme.pow" $ActiveGuid
}

# 6. BCD Configuration Export
Write-Host "[*] Exporting BCD Store..." -ForegroundColor Yellow
& bcdedit /export "$BackupDir\BCD_Backup.bcd"

Write-Host "================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] Master Disaster Recovery Snapshot Saved: $BackupDir" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
