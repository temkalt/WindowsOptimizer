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

    Write-Host ""
    Write-Host "============================================================================" -ForegroundColor Cyan
    Write-Host "         WindowsOptimizer - ГЛУБОКИЙ АУДИТ НАСТРОЕК СИСТЕМЫ" -ForegroundColor Cyan
    Write-Host "============================================================================" -ForegroundColor Cyan
    Write-Host "[1/6] Сканирование параметров ядра Windows, VBS и изоляции памяти..." -ForegroundColor DarkGray
    Write-Host "[2/6] Сканирование квантов Win32PrioritySeparation и таймеров BCD..." -ForegroundColor DarkGray
    Write-Host "[3/6] Сканирование видеокарты, DirectFlip Mode 2, MPO и HAGS..." -ForegroundColor DarkGray
    Write-Host "[4/6] Сканирование схем электропитания и параметров ACPI..." -ForegroundColor DarkGray
    Write-Host "[5/6] Сканирование сетевого стека TCP/IP, Nagle и задержки пакетов..." -ForegroundColor DarkGray
    Write-Host "[6/6] Сканирование фоновых служб, задач планировщика и устройств ввода..." -ForegroundColor DarkGray

    # Ожидание готовности сервера и получение точного аудита
    $audit = $null
    for ($i = 0; $i -lt 15; $i++) {
        Start-Sleep -Milliseconds 400
        try {
            $audit = Invoke-RestMethod -Uri "http://localhost:5050/api/system/status" -TimeoutSec 3 -ErrorAction Stop
            if ($audit) { break }
        } catch {}
    }

    if ($audit) {
        Write-Host "----------------------------------------------------------------------------" -ForegroundColor DarkGray
        Write-Host "[✓] Аудит завершен: применено $($audit.appliedCount) из $($audit.totalCount) настроек ($($audit.optimizationPercentage)% оптимизировано)" -ForegroundColor Green
    }

    # Открытие строго единого окна приложения (App Mode)
    $appLaunched = $false
    try {
        Start-Process "msedge.exe" -ArgumentList "--app=http://localhost:5050", "--window-size=1280,820" -ErrorAction Stop
        $appLaunched = $true
    } catch {
        try {
            Start-Process "chrome.exe" -ArgumentList "--app=http://localhost:5050", "--window-size=1280,820" -ErrorAction Stop
            $appLaunched = $true
        } catch {}
    }
    if (-not $appLaunched) {
        Start-Process "http://localhost:5050"
    }

    Write-Host "[УСПЕХ] WindowsOptimizer запущен в едином окне!" -ForegroundColor Cyan
} else {
    Write-Host "[!] Папка с приложением не найдена. Локальный путь: d:\winvan\ApexOptimizer" -ForegroundColor Red
}
