# ============================================================================
#  WindowsOptimizer - POWERSHELL 1-CLICK LAUNCHER & CLOUD INSTALLER
#  GitHub: https://github.com/temkalt/WindowsOptimizer
# ============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "WindowsOptimizer"

Write-Host ""
Write-Host "  ██████╗ ██╗      █████╗  ██████╗██╗  ██╗     ██████╗ ███╗   ██╗██╗   ██╗██╗  ██╗" -ForegroundColor Cyan
Write-Host "  ██╔══██╗██║     ██╔══██╗██╔════╝██║ ██╔╝    ██╔═══██╗████╗  ██║╚██╗ ██╔╝╚██╗██╔╝" -ForegroundColor Cyan
Write-Host "  ██████╔╝██║     ███████║██║     █████╔╝     ██║   ██║██╔██╗ ██║ ╚████╔╝  ╚███╔╝ " -ForegroundColor Cyan
Write-Host "  ██╔══██╗██║     ██╔══██║██║     ██╔═██╗     ██║   ██║██║╚██╗██║  ╚██╔╝   ██╔██╗ " -ForegroundColor Cyan
Write-Host "  ██████╔╝███████╗██║  ██║╚██████╗██║  ██╗    ╚██████╔╝██║ ╚████║   ██║   ██╔╝ ██╗" -ForegroundColor Cyan
Write-Host "  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝     ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "          WindowsOptimizer - КИБЕРСПОРТИВНЫЙ ЦЕНТР ОПТИМИЗАЦИИ WINDOWS 11   " -ForegroundColor White
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "[*] Проверка прав администратора..." -ForegroundColor Gray

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "[!] Запуск от имени Администратора..." -ForegroundColor Yellow
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command `"& { irm https://raw.githubusercontent.com/temkalt/WindowsOptimizer/main/launch.ps1 | iex }`"" -Verb RunAs
    exit
}

Write-Host "[+] Права администратора подтверждены." -ForegroundColor Green
Write-Host "[*] Инициализация локального движка WindowsOptimizer..." -ForegroundColor Cyan

# 1. Поиск локальной установки
$AppDir = "d:\winvan\ApexOptimizer"
if (-not (Test-Path $AppDir)) {
    $AppDir = "$PSScriptRoot\ApexOptimizer"
}

# 2. Если запускается на чистом ПК из интернета, загружаем из GitHub
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
    Start-Process -FilePath "node.exe" -ArgumentList "server/standalone_launcher.js" -WindowStyle Hidden -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    
    # Открытие в чистом едином окне App Mode
    Start-Process "msedge.exe" -ArgumentList "--app=http://localhost:5050", "--window-size=1280,820" -ErrorAction SilentlyContinue
    if (-not $?) {
        Start-Process "chrome.exe" -ArgumentList "--app=http://localhost:5050", "--window-size=1280,820" -ErrorAction SilentlyContinue
    }
    if (-not $?) {
        Start-Process "http://localhost:5050"
    }

    Write-Host "[УСПЕХ] WindowsOptimizer успешно запущен: http://localhost:5050" -ForegroundColor Cyan
} else {
    Write-Host "[!] Папка с приложением не найдена. Локальный путь: d:\winvan\ApexOptimizer" -ForegroundColor Red
}
