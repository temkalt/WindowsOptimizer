Write-Host "[*] Removing non-essential provisioned UWP apps..." -ForegroundColor Cyan
$BloatApps = @(
    "Microsoft.BingNews", "Microsoft.BingWeather", "Microsoft.BingFinance", "Microsoft.BingSports",
    "Microsoft.GetHelp", "Microsoft.Getstarted", "Microsoft.MicrosoftOfficeHub", "Microsoft.MicrosoftSolitaireCollection",
    "Microsoft.People", "Microsoft.SkypeApp", "Microsoft.WindowsFeedbackHub", "Microsoft.WindowsMaps",
    "Microsoft.YourPhone", "Microsoft.ZuneMusic", "Microsoft.ZuneVideo", "Clipchamp.Clipchamp",
    "Microsoft.549981C3F5F10", "Microsoft.Todos", "Microsoft.PowerAutomateDesktop"
)
foreach ($app in $BloatApps) {
    Get-AppxPackage -Name $app -AllUsers -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue
    Get-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -like "*$app*" } | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue
    Write-Host " [+] Processed: $app" -ForegroundColor Green
}
Write-Host "[SUCCESS] Bloatware removed safely!" -ForegroundColor Green
