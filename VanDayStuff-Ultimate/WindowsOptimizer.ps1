# ============================================================================
#  WindowsOptimizer 2.0 - Standalone Desktop App Launcher
#  GitHub: https://github.com/temkalt/WindowsOptimizer
#  One-Line Run: irm https://raw.githubusercontent.com/temkalt/WindowsOptimizer/main/WindowsOptimizer.ps1 | iex
# ============================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "WindowsOptimizer 2.0"

# 1. Ensure Administrator Privileges
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    $arg = if ($PSCommandPath) {
        "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    } else {
        "-NoProfile -ExecutionPolicy Bypass -Command `"& { irm https://raw.githubusercontent.com/temkalt/WindowsOptimizer/main/WindowsOptimizer.ps1 | iex }`""
    }
    Start-Process powershell.exe -ArgumentList $arg -Verb RunAs
    exit
}

Write-Host ""
Write-Host "  ██████╗ ██╗      █████╗  ██████╗██╗  ██╗     ██████╗ ███╗   ██╗██╗   ██╗██╗  ██╗" -ForegroundColor Cyan
Write-Host "  ██╔══██╗██║     ██╔══██╗██╔════╝██║ ██╔╝    ██╔═══██╗████╗  ██║╚██╗ ██╔╝╚██╗██╔╝" -ForegroundColor Cyan
Write-Host "  ██████╔╝██║     ███████║██║     █████╔╝     ██║   ██║██╔██╗ ██║ ╚████╔╝  ╚███╔╝ " -ForegroundColor Cyan
Write-Host "  ██╔══██╗██║     ██╔══██║██║     ██╔═██╗     ██║   ██║██║╚██╗██║  ╚██╔╝   ██╔██╗ " -ForegroundColor Cyan
Write-Host "  ██████╔╝███████╗██║  ██║╚██████╗██║  ██╗    ╚██████╔╝██║ ╚████║   ██║   ██╔╝ ██╗" -ForegroundColor Cyan
Write-Host "  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝     ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "          WindowsOptimizer 2.0 - КИБЕРСПОРТИВНЫЙ ЦЕНТР ОПТИМИЗАЦИИ          " -ForegroundColor White
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "[*] Проверка системного окружения..." -ForegroundColor Gray

# 2. Locate App Directory (Local or Cloud)
$AppDir = "d:\winvan\ApexOptimizer"
if (-not (Test-Path $AppDir)) {
    $AppDir = "$PSScriptRoot\ApexOptimizer"
}
if (-not (Test-Path $AppDir)) {
    $CloudDir = "$env:LOCALAPPDATA\WindowsOptimizer"
    if (-not (Test-Path "$CloudDir\ApexOptimizer")) {
        Write-Host "[*] Загрузка WindowsOptimizer Suite из GitHub репозитория..." -ForegroundColor Cyan
        New-Item -ItemType Directory -Force -Path $CloudDir | Out-Null
        $ZipPath = "$env:TEMP\WindowsOptimizer.zip"
        Invoke-WebRequest -Uri "https://github.com/temkalt/WindowsOptimizer/archive/refs/heads/main.zip" -OutFile $ZipPath
        Expand-Archive -Path $ZipPath -DestinationPath $CloudDir -Force
        Remove-Item $ZipPath -Force -ErrorAction SilentlyContinue
    }
    $AppDir = (Get-ChildItem -Path $CloudDir -Filter "ApexOptimizer" -Recurse | Select-Object -First 1).FullName
}

if (Test-Path $AppDir) {
    Set-Location -Path $AppDir

    # Check if node engine is already running
    $isRunning = $false
    try {
        $test = Invoke-RestMethod -Uri "http://localhost:5050/api/system/status" -TimeoutSec 1 -ErrorAction Stop
        if ($test) { $isRunning = $true }
    } catch {}

    if (-not $isRunning) {
        Write-Host "[*] Запуск системного движка ядра..." -ForegroundColor Cyan
        Start-Process -FilePath "node.exe" -ArgumentList "server/engine.js" -WindowStyle Hidden -ErrorAction SilentlyContinue
    }

    # Wait for server initialization & Live Audit
    $audit = $null
    for ($i = 0; $i -lt 15; $i++) {
        Start-Sleep -Milliseconds 300
        try {
            $audit = Invoke-RestMethod -Uri "http://localhost:5050/api/system/status" -TimeoutSec 2 -ErrorAction Stop
            if ($audit) { break }
        } catch {}
    }

    if ($audit) {
        Write-Host "[+] 100% Живой аудит завершен: $($audit.optimizationPercentage)% оптимизировано ($($audit.appliedChecksCount)/$($audit.auditedChecksCount) проверок)" -ForegroundColor Green
        Write-Host "[+] Активный план питания: $($audit.activePowerPlan)" -ForegroundColor Cyan
    }

    # Launch in Standalone Isolated Window (App Mode)
    $appLaunched = $false
    try {
        Start-Process "msedge.exe" -ArgumentList "--app=http://localhost:5050", "--window-size=1300,840" -ErrorAction Stop
        $appLaunched = $true
    } catch {
        try {
            Start-Process "chrome.exe" -ArgumentList "--app=http://localhost:5050", "--window-size=1300,840" -ErrorAction Stop
            $appLaunched = $true
        } catch {}
    }
    if (-not $appLaunched) {
        Start-Process "http://localhost:5050"
    }

    Write-Host "[УСПЕХ] Приложение WindowsOptimizer успешно открыто в отдельном окне!" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "[!] Папка с приложением не найдена." -ForegroundColor Red
}
