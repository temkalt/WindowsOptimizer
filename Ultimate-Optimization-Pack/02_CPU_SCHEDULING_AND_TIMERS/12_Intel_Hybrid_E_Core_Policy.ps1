Write-Host "[*] Setting Intel Heterogeneous Scheduling Policy for P-Cores..." -ForegroundColor Cyan
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR HETEROCLASS1CONCURRENCY 100 2>$null
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR HETEROINCREASETHRESHOLD 10 2>$null
powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR HETERODECREASETHRESHOLD 5 2>$null
powercfg -setactive SCHEME_CURRENT 2>$null
Write-Host "[SUCCESS] Intel P-Core gaming scheduling configured!" -ForegroundColor Green
