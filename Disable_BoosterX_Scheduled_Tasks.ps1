# ==============================================================================
# Script: Disable BoosterX / Windows Tweaker Scheduled Tasks
# ==============================================================================

# Auto-elevate to Administrator if not already elevated
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[*] Requesting Administrator privileges..." -ForegroundColor Yellow
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  ОТКЛЮЧЕНИЕ ФОНОВЫХ ЗАДАЧ ПЛАНИРОВЩИКА WINDOWS" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$TasksToDisable = @(
    # 1. Задачи Windows Insider (Flighting)
    "\Microsoft\Windows\Flighting\FeatureConfig\BootstrapUsageDataReporting",
    "\Microsoft\Windows\Flighting\FeatureConfig\GovernedFeatureUsageProcessing",
    "\Microsoft\Windows\Flighting\FeatureConfig\ReconcileConfigs",
    "\Microsoft\Windows\Flighting\FeatureConfig\ReconcileFeatures",
    "\Microsoft\Windows\Flighting\FeatureConfig\SafeguardsReconciliation",
    "\Microsoft\Windows\Flighting\FeatureConfig\UsageDataFlushing",
    "\Microsoft\Windows\Flighting\FeatureConfig\UsageDataReceiver",
    "\Microsoft\Windows\Flighting\FeatureConfig\UsageDataReporting",
    "\Microsoft\Windows\Flighting\OneSettings\RefreshCache",
    "\Microsoft\Windows\Flighting\OneSettings\Validation",

    # 2. Задачи для анализа (Customer Experience / Application Experience)
    "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator",
    "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip",
    "\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask",
    "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser",
    "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser Exp",
    "\Microsoft\Windows\Application Experience\ProgramDataUpdater",
    "\Microsoft\Windows\Application Experience\StartupAppTask",
    "\Microsoft\Windows\Application Experience\PcaPatchDbTask",
    "\Microsoft\Windows\Application Experience\MareBackup",
    "\Microsoft\Windows\Application Experience\SdbinstMergeDbTask",
    "\Microsoft\Windows\PI\Sqm-Tasks",

    # 3. Задачи для диагностики
    "\Microsoft\Windows\Diagnosis\RecommendedTroubleshootingScanner",
    "\Microsoft\Windows\Diagnosis\Scheduled",
    "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector",
    "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticResolver",
    "\Microsoft\Windows\MemoryDiagnostic\ProcessMemoryDiagnosticEvents",
    "\Microsoft\Windows\MemoryDiagnostic\RunFullMemoryDiagnostic",
    "\Microsoft\Windows\Windows Error Reporting\QueueReporting",
    "\Microsoft\Windows\DiskFootprint\Diagnostics",
    "\Microsoft\Windows\NetTrace\GatherNetworkInfo",
    "\Microsoft\Windows\Feedback\Siuf\DmClient",
    "\Microsoft\Windows\Feedback\Siuf\DmClientOnScenarioDownload",

    # 4. Авто-определение прокси
    "\Microsoft\Windows\Wininet\Proxy Discovery",
    "\Microsoft\Windows\Autochk\Proxy",

    # 5. Установка и удаление языков
    "\Microsoft\Windows\LanguageComponentsInstaller\Installation",
    "\Microsoft\Windows\LanguageComponentsInstaller\ReconcileLanguageResources",
    "\Microsoft\Windows\LanguageComponentsInstaller\Uninstallation",
    "\Microsoft\Windows\International\LanguageConfigurationOperationTask",

    # 6. Авто-проверка производительности (WinSAT / Power)
    "\Microsoft\Windows\Maintenance\WinSAT",
    "\Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem",

    # 7. Карты и локация
    "\Microsoft\Windows\Maps\MapsUpdateTask",
    "\Microsoft\Windows\Maps\MapsToastTask",
    "\Microsoft\Windows\Location\Notifications",
    "\Microsoft\Windows\Location\WindowsActionDialog",

    # 8. Удаленное управление
    "\Microsoft\Windows\RemoteAssistance\RemoteAssistanceTask",
    "\Microsoft\Windows\RemoteDesktop\CertificateExpiryCheck",

    # 9. Синхронизация Microsoft
    "\Microsoft\Windows\SettingSync\BackgroundUploadTask",
    "\Microsoft\Windows\SettingSync\BackupTask",
    "\Microsoft\Windows\SettingSync\NetworkStateChangeTask",
    "\Microsoft\Windows\Shell\ThemesSyncedImageDownload",

    # 10. Задачи очистки
    "\Microsoft\Windows\DiskCleanup\SilentCleanup",
    "\Microsoft\Windows\DiskFootprint\StorageSense",
    "\Microsoft\Windows\Storage\Task",

    # 11. Microsoft Store
    "\Microsoft\Windows\WS\Badge Update",
    "\Microsoft\Windows\WS\Sync Licenses",
    "\Microsoft\Windows\WS\WSRefreshBannedAppsListTask",
    "\Microsoft\Windows\WindowsUpdate\Automatic App Update",

    # 12. XBOX
    "\Microsoft\XblGameSave\XblGameSaveTask",
    "\Microsoft\XblGameSave\XblGameSaveTaskLogon",

    # 13. Обновление политики
    "\Microsoft\Windows\Group Policy\Group Policy Refresh",
    "\Microsoft\Windows\CloudExperienceHost\CreateObjectTask",
    "\Microsoft\Windows\EnterpriseMgmt\MDM Maintenence Task",

    # 14. Задачи связанные с HDD (Defrag / SysMain)
    "\Microsoft\Windows\Defrag\ScheduledDefrag",
    "\Microsoft\Windows\Sysmain\HybridDriveCachePrepopulate",
    "\Microsoft\Windows\Sysmain\HybridDriveCacheRebalance",
    "\Microsoft\Windows\Sysmain\ResPriStaticDbSync",
    "\Microsoft\Windows\Sysmain\WsSwapAssessmentTask",

    # 15. Задачи уведомления
    "\Microsoft\Windows\Shell\FamilySafetyMonitor",
    "\Microsoft\Windows\Shell\FamilySafetyMonitorToastTask",
    "\Microsoft\Windows\Shell\FamilySafetyRefreshTask",
    "\Microsoft\Windows\PushToInstall\LoginCheck",
    "\Microsoft\Windows\PushToInstall\Registration",
    "\Microsoft\Windows\WwanSvc\NotificationTask"
)

$disabledCount = 0

foreach ($fullPath in $TasksToDisable) {
    $taskPath = Split-Path -Path $fullPath
    $taskName = Split-Path -Path $fullPath -Leaf
    
    if (-not $taskPath.EndsWith("\")) {
        $taskPath += "\"
    }

    try {
        $task = Get-ScheduledTask -TaskPath $taskPath -TaskName $taskName -ErrorAction SilentlyContinue
        if ($task) {
            if ($task.State -ne 'Disabled') {
                Disable-ScheduledTask -TaskPath $taskPath -TaskName $taskName -ErrorAction SilentlyContinue | Out-Null
                Write-Host " [ОТКЛЮЧЕНО] $fullPath" -ForegroundColor Green
                $disabledCount++
            } else {
                Write-Host " [УЖЕ БЫЛО ОТКЛЮЧЕНО] $fullPath" -ForegroundColor DarkGray
                $disabledCount++
            }
        }
    } catch {
        # Skip
    }
}

# Отключение автоопределения прокси в реестре
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -Name "AutoDetect" -Value 0 -Type DWord -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " [ГОТОВО] Все фоновые задачи из списка успешно обработаны!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Нажмите любую клавишу для выхода..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
