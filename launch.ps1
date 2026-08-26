# ============================================================================
#  WindowsOptimizer 2.0 - Fast Remote Cloud Launcher
#  GitHub: https://github.com/temkalt/WindowsOptimizer
# ============================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$scriptUrl = "https://raw.githubusercontent.com/temkalt/WindowsOptimizer/main/WindowsOptimizer.ps1"
try {
    $scriptContent = (Invoke-RestMethod -Uri $scriptUrl -TimeoutSec 10)
    Invoke-Expression $scriptContent
} catch {
    # Local fallback
    if (Test-Path "$PSScriptRoot\WindowsOptimizer.ps1") {
        & "$PSScriptRoot\WindowsOptimizer.ps1"
    } elseif (Test-Path "d:\winvan\WindowsOptimizer.ps1") {
        & "d:\winvan\WindowsOptimizer.ps1"
    } else {
        Write-Host "[!] Ошибка загрузки скрипта из GitHub. Проверьте интернет-соединение." -ForegroundColor Red
    }
}
