# APEXTWEAK MASTER FAIL-SAFE RESTORATION ENGINE
Write-Host "================================================================" -ForegroundColor Magenta
Write-Host "         APPLYING MASTER DISASTER RECOVERY ROLLBACK             " -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Magenta

$Snapshots = Get-ChildItem -Path $PSScriptRoot -Directory -Filter "Snapshot_*" | Sort-Object CreationTime -Descending
if ($Snapshots.Count -eq 0) {
    Write-Host "[!] No snapshots found. Reverting to factory defaults..." -ForegroundColor Red
    & "$PSScriptRoot\..\12_REVERT_ALL_TWEAKS_RESTORE\RESTORE_ALL_DEFAULT_WINDOWS_SETTINGS.bat"
    exit
}

$TargetSnapshot = $Snapshots[0].FullName
Write-Host "[*] Restoring from latest snapshot: $TargetSnapshot" -ForegroundColor Yellow

# 1. Restore Registry
$RegDir = Join-Path $TargetSnapshot "Registry"
if (Test-Path $RegDir) {
    Write-Host "[*] Importing Registry Hives..." -ForegroundColor Yellow
    Get-ChildItem -Path $RegDir -Filter "*.reg" | ForEach-Object {
        & reg import $_.FullName
        Write-Host " [+] Imported: $($_.Name)" -ForegroundColor Green
    }
}

# 2. Restore Services
$ServicesXml = Join-Path $TargetSnapshot "Services_State.xml"
if (Test-Path $ServicesXml) {
    Write-Host "[*] Restoring Exact Services Startup Modes..." -ForegroundColor Yellow
    $SavedServices = Import-Clixml -Path $ServicesXml
    foreach ($svc in $SavedServices) {
        try {
            $mode = if ($svc.StartType -eq "Automatic") { "auto" } elseif ($svc.StartType -eq "Manual") { "demand" } else { "disabled" }
            & sc config $svc.Name start= $mode >$null 2>&1
        } catch {}
    }
}

# 3. Restore Network Adapters
$NetXml = Join-Path $TargetSnapshot "NetAdapters_Advanced.xml"
if (Test-Path $NetXml) {
    Write-Host "[*] Restoring Network Adapter Advanced Properties..." -ForegroundColor Yellow
    $SavedProps = Import-Clixml -Path $NetXml
    foreach ($prop in $SavedProps) {
        try {
            Set-NetAdapterAdvancedProperty -Name $prop.InterfaceDescription -RegistryKeyword $prop.RegistryKeyword -RegistryValue $prop.RegistryValue -ErrorAction SilentlyContinue
        } catch {}
    }
}

# 4. Restore BCD
$BcdFile = Join-Path $TargetSnapshot "BCD_Backup.bcd"
if (Test-Path $BcdFile) {
    Write-Host "[*] Importing BCD Store..." -ForegroundColor Yellow
    & bcdedit /import $BcdFile
}

Write-Host "================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] Disaster Recovery Rollback Completed Successfully!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
