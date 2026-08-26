Write-Host "[*] Disabling background scheduled telemetry tasks..." -ForegroundColor Cyan
$Tasks = @(
    "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser",
    "\Microsoft\Windows\Application Experience\ProgramDataUpdater",
    "\Microsoft\Windows\Application Experience\StartupAppTask",
    "\Microsoft\Windows\Autochk\Proxy",
    "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator",
    "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip",
    "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector",
    "\Microsoft\Windows\Feedback\Siuf\DmClient",
    "\Microsoft\Windows\Maps\MapsUpdateTask",
    "\Microsoft\Windows\Windows Error Reporting\QueueReporting"
)
foreach ($task in $Tasks) {
    Disable-ScheduledTask -TaskPath (Split-Path $task) -TaskName (Split-Path $task -Leaf) -ErrorAction SilentlyContinue | Out-Null
    Write-Host " [+] Task disabled: $task" -ForegroundColor Green
}
Write-Host "[SUCCESS] Telemetry scheduled tasks disabled!" -ForegroundColor Green
