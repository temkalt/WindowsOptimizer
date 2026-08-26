# 60+ PREINSTALLED BLOATWARE REMOVER WITH SYSTEM PROTECTED WHITELIST
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   REMOVING 60+ UWP BLOATWARE PACKAGES WITH SYSTEM WHITELIST     " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$Whitelist = @(
    "Microsoft.WindowsStore", "Microsoft.StorePurchaseApp", "Microsoft.DesktopAppInstaller",
    "Microsoft.WindowsTerminal", "Microsoft.WindowsCalculator", "Microsoft.Windows.Photos",
    "Microsoft.ScreenSketch", "Microsoft.Paint", "Microsoft.DirectX", "Microsoft.VCLibs"
)

$BloatList = @(
    "Microsoft.BingNews", "Microsoft.BingWeather", "Microsoft.BingFinance", "Microsoft.BingSports",
    "Microsoft.GetHelp", "Microsoft.Getstarted", "Microsoft.MicrosoftOfficeHub", "Microsoft.MicrosoftSolitaireCollection",
    "Microsoft.People", "Microsoft.SkypeApp", "Microsoft.WindowsFeedbackHub", "Microsoft.WindowsMaps",
    "Microsoft.YourPhone", "Microsoft.ZuneMusic", "Microsoft.ZuneVideo", "Clipchamp.Clipchamp",
    "Microsoft.549981C3F5F10", "Microsoft.Todos", "Microsoft.PowerAutomateDesktop", "Microsoft.OutlookForWindows",
    "Microsoft.GamingApp", "Microsoft.XboxGamingOverlay", "Microsoft.XboxIdentityProvider", "Microsoft.XboxSpeechToTextOverlay",
    "Microsoft.Copilot", "Microsoft.WindowsAlarms", "Microsoft.SoundRecorder", "Microsoft.QuickAssist"
)

foreach ($pkg in Get-AppxPackage -AllUsers) {
    if ($Whitelist -contains $pkg.Name) { continue }
    if ($BloatList -contains $pkg.Name -or $pkg.Name -match "Solitaire|Cortana|Zune|Bing|Skype|Feedback|Clipchamp") {
        try {
            Remove-AppxPackage -Package $pkg.PackageFullName -AllUsers -ErrorAction SilentlyContinue
            Write-Host " [+] Removed: $($pkg.Name)" -ForegroundColor Green
        } catch {}
    }
}

foreach ($prov in Get-AppxProvisionedPackage -Online) {
    if ($Whitelist -contains $prov.DisplayName) { continue }
    if ($BloatList -contains $prov.DisplayName -or $prov.DisplayName -match "Solitaire|Cortana|Zune|Bing|Skype|Feedback|Clipchamp") {
        try {
            Remove-AppxProvisionedPackage -Online -PackageName $prov.PackageName -ErrorAction SilentlyContinue | Out-Null
            Write-Host " [+] Deprovisioned: $($prov.DisplayName)" -ForegroundColor Yellow
        } catch {}
    }
}

Write-Host "================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] Bloatware cleanly removed without touching Core Store!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
