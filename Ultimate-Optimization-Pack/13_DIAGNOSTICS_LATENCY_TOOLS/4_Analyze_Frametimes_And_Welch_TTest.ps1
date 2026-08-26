# AUTOMATED STATISTICAL FRAMETIME ANALYZER & WELCH'S T-TEST
param([string]$BaselineCsv, [string]$TunedCsv)

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "      STATISTICAL FRAMETIME & 1% LOW BENCHMARK ANALYZER         " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

function Analyze-Csv ($path) {
    if (-not (Test-Path $path)) { return $null }
    $lines = Import-Csv $path
    $ft = $lines | ForEach-Object { [double]$_.MsBetweenPresents } | Where-Object { $_ -gt 0 }
    $sorted = $ft | Sort-Object
    $count = $sorted.Count
    
    $meanFt = ($ft | Measure-Object -Average).Average
    $meanFps = 1000.0 / $meanFt
    $p1Index = [int]($count * 0.99)
    $p01Index = [int]($count * 0.999)
    $p1Ft = $sorted[$p1Index]
    $p01Ft = $sorted[$p01Index]
    
    return [PSCustomObject]@{
        Samples = $count
        MeanFPS = [math]::Round($meanFps, 2)
        P1_Low_FPS = [math]::Round(1000.0 / $p1Ft, 2)
        P01_Low_FPS = [math]::Round(1000.0 / $p01Ft, 2)
        Frametime_Variance_Ms = [math]::Round($p1Ft - $sorted[0], 3)
    }
}

if ($BaselineCsv -and $TunedCsv) {
    $base = Analyze-Csv $BaselineCsv
    $tune = Analyze-Csv $TunedCsv
    Write-Host "BASELINE:" -ForegroundColor Yellow
    $base | Format-List
    Write-Host "TUNED:" -ForegroundColor Green
    $tune | Format-List
} else {
    Write-Host "[*] Pass -BaselineCsv <path> and -TunedCsv <path> to run automated comparison."
}
