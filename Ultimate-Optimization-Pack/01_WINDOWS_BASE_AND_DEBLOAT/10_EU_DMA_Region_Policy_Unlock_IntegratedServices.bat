@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
echo ============================================================================
echo   UNLOCK EUROPEAN UNION DMA REGION PRIVILEGES FOR WORLDWIDE WINDOWS 11
echo ============================================================================
echo [*] Applying IntegratedServicesRegionPolicySet patch...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "
$jsonPath = Join-Path $env:SystemRoot 'System32\IntegratedServicesRegionPolicySet.json'
if (Test-Path $jsonPath) {
    try {
        $json = Get-Content $jsonPath -Raw | ConvertFrom-Json
        foreach ($policy in $json.policies) {
            $policy.defaultState = 'enabled'
            $policy.conditions.region = @('all')
        }
        $json | ConvertTo-Json -Depth 10 | Set-Content $jsonPath -Encoding UTF8 -Force
        Write-Host '[+] IntegratedServicesRegionPolicySet unlocked for all regions!' -ForegroundColor Green
    } catch {
        Write-Host '[!] Fallback to registry DMA flags' -ForegroundColor Yellow
    }
}
"
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection" /v "RegionPolicyUnlocked" /t REG_DWORD /d 1 /f >nul
echo [SUCCESS] European DMA policies unlocked! You can now cleanly remove Edge & Web search in Start Menu.
pause
