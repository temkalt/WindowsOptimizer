# WINDOWS DEFENDER REAL-TIME SCANNING EXCLUSIONS FOR ESPORTS
Write-Host "[*] Adding Esports Game Directories and Shader Caches to Windows Defender..." -ForegroundColor Cyan
$Paths = @(
    "C:\Program Files (x86)\Steam", "C:\Program Files\Epic Games",
    "C:\Riot Games", "C:\Program Files\Electronic Arts",
    "D:\SteamLibrary", "D:\Games", "C:\Games",
    "$env:LOCALAPPDATA\NVIDIA\DXCache", "$env:LOCALAPPDATA\D3DSCache"
)
foreach ($p in $Paths) {
    if (Test-Path $p) {
        Add-MpPreference -ExclusionPath $p -ErrorAction SilentlyContinue
        Write-Host " [+] Defender Exclusion: $p" -ForegroundColor Green
    }
}
Write-Host "[SUCCESS] Defender exclusions configured!" -ForegroundColor Green
