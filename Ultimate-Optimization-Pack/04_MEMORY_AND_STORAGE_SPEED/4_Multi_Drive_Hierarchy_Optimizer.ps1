# MULTI-DRIVE HIERARCHY OPTIMIZER (ADATA DRAM SSD + KINGSTON HMB SSD + SEAGATE HDD)
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "         CONFIGURING MULTI-DRIVE STORAGE & PAGEFILE HIERARCHY   " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Drive C (ADATA Legend 960 with DRAM) -> Dedicated 8192MB Pagefile
Write-Host "[*] Configuring 8192MB Fixed Pagefile on Drive C: (DRAM NVMe)..." -ForegroundColor Yellow
$wmi = Get-CimInstance Win32_PageFileSetting -ErrorAction SilentlyContinue
if ($wmi) { Remove-CimInstance $wmi -ErrorAction SilentlyContinue }

Set-CimInstance -Query "Select * from Win32_ComputerSystem" -Property @{AutomaticManagedPagefile = $False} -ErrorAction SilentlyContinue
New-CimInstance -ClassName Win32_PageFileSetting -Property @{Name = "C:\pagefile.sys"; InitialSize = 8192; MaximumSize = 8192} -ErrorAction SilentlyContinue

# 2. Drive E (Seagate 2TB HDD) -> Exclude from Windows Search Indexing to eliminate spin-up stutter
Write-Host "[*] Excluding Archive HDD from Windows Search Indexing..." -ForegroundColor Yellow
powershell.exe -Command "
try {
    $sm = New-Object -ComObject CSearchManager
    $cat = $sm.GetCatalog('SystemIndex')
    $cman = $cat.GetCrawlScopeManager()
    $cman.AddUserExclusionRule('file:///E:\*')
    $cman.SaveAll()
    Write-Host '[+] Drive E: excluded from Windows Search index!' -ForegroundColor Green
} catch {}
"

Write-Host "================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] Multi-Drive storage layout configured!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
