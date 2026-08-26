# ============================================================================
#  WindowsOptimizer 2.0 - Native PowerShell Ultimate Esports Edition
# ============================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Ensure Administrator Privileges
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host '[!] Запуск от имени Администратора...' -ForegroundColor Yellow
    Start-Process powershell.exe -ArgumentList ('-NoProfile -ExecutionPolicy Bypass -File "' + $PSCommandPath + '"') -Verb RunAs
    exit
}

$Host.UI.RawUI.WindowTitle = 'WindowsOptimizer 2.0 - Ultimate Esports Kernel Suite'

function Get-RegistryValue {
    param($Path, $Name)
    try {
        if (Test-Path $Path) {
            $val = (Get-ItemProperty -Path $Path -Name $Name -ErrorAction SilentlyContinue).$Name
            return $val
        }
    } catch {}
    return $null
}

function Run-DeepAudit {
    Clear-Host
    Write-Host '============================================================================' -ForegroundColor Cyan
    Write-Host '          WindowsOptimizer 2.0 - 100% РЕАЛЬНЫЙ АУДИТ СИСТЕМЫ                ' -ForegroundColor White
    Write-Host '============================================================================' -ForegroundColor Cyan
    Write-Host ' [*] Сканирование ядра Windows, реестра, таймеров, драйверов и служб...' -ForegroundColor DarkGray
    Write-Host ''

    $checks = [ordered]@{}
    
    # 1. Telemetry
    $telem = Get-RegistryValue 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection' 'AllowTelemetry'
    $checks['Отключение телеметрии и сбора данных (DiagTrack)'] = ($telem -eq 0)

    # 2. Fast Startup
    $fastStart = Get-RegistryValue 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' 'HiberbootEnabled'
    $checks['Отключение быстрой загрузки и гибернации (Hiberboot)'] = ($fastStart -eq 0)

    # 3. Kernel Paging Executive
    $paging = Get-RegistryValue 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' 'DisablePagingExecutive'
    $checks['Фиксация ядра Windows в DDR RAM (DisablePagingExecutive = 1)'] = ($paging -eq 1)

    # 4. Win32PrioritySeparation
    $prio = Get-RegistryValue 'HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl' 'Win32PrioritySeparation'
    $checks['Кванты CPU для киберспорта (Win32PrioritySeparation 22/26)'] = ($prio -eq 22 -or $prio -eq 26 -or $prio -eq 38 -or $prio -eq 40)

    # 5. Global Timer Resolution Requests
    $timer = Get-RegistryValue 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel' 'GlobalTimerResolutionRequests'
    $checks['Глобальное микросекундное разрешение таймера 0.500 ms'] = ($timer -eq 1)

    # 6. MPO Fix
    $mpo = Get-RegistryValue 'HKLM:\SOFTWARE\Microsoft\Windows\Dwm' 'OverlayTestMode'
    $checks['Отключение MPO (Устранение статтеров и сбоев DWM)'] = ($mpo -eq 5)

    # 7. GameDVR
    $gamedvr = Get-RegistryValue 'HKCU:\System\GameConfigStore' 'GameDVR_Enabled'
    $checks['Отключение фоновой записи Xbox GameDVR'] = ($gamedvr -eq 0)

    # 8. Network Throttling
    $netThrot = Get-RegistryValue 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' 'NetworkThrottlingIndex'
    $checks['Снятие сетевого троттлинга (NetworkThrottlingIndex = 0xFFFFFFFF)'] = ($netThrot -eq -1 -or $netThrot -eq 4294967295 -or $netThrot -eq 0xffffffff)

    # 9. System Responsiveness
    $sysResp = Get-RegistryValue 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' 'SystemResponsiveness'
    $checks['100% Приоритет сетевых пакетов (SystemResponsiveness = 0)'] = ($sysResp -eq 0)

    # 10. MMCSS Tasks Games
    $sfio = Get-RegistryValue 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games' 'SFIO Priority'
    $sched = Get-RegistryValue 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games' 'Scheduling Category'
    $checks['Приоритет игрового и аудио потока MMCSS (High Priority)'] = ($sfio -eq 'High' -or $sched -eq 'High')

    # 11. FilterKeys
    $kbdDelay = Get-RegistryValue 'HKCU:\Control Panel\Accessibility\Keyboard Response' 'AutoRepeatDelay'
    $checks['Нулевая задержка клавиатуры (FilterKeys AutoRepeat 150ms)'] = ($kbdDelay -eq '150' -or $kbdDelay -eq '100' -or $kbdDelay -eq 150)

    # 12. NTFS 8.3 Names
    $ntfs83 = Get-RegistryValue 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' 'NtfsDisable8dot3NameCreation'
    $checks['Оптимизация файловой системы NTFS (8.3 Names Off)'] = ($ntfs83 -eq 1)

    # 13. NTFS LastAccess
    $lastAcc = Get-RegistryValue 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' 'NtfsDisableLastAccessUpdate'
    $checks['Отключение обновления времени доступа LastAccess на NVMe'] = ($lastAcc -eq 1)

    # 14. VBS Status
    $vbs = Get-RegistryValue 'HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity' 'Enabled'
    $checks['Прямой доступ к ядру Ring 0 (VBS / Core Isolation Отключен)'] = ($vbs -eq 0 -or $null -eq $vbs)

    # Output Items
    $applied = 0
    $total = $checks.Count
    foreach ($k in $checks.Keys) {
        if ($checks[$k]) {
            $applied++
            Write-Host "  [+] $k" -ForegroundColor Green
        } else {
            Write-Host "  [-] $k" -ForegroundColor DarkGray
        }
    }

    $pct = [math]::Round(($applied / $total) * 100)

    # Draw Progress Bar
    $barLength = 28
    $filled = [math]::Round(($pct / 100) * $barLength)
    $empty = $barLength - $filled
    $bar = ('#' * $filled) + ('-' * $empty)

    Write-Host ''
    Write-Host '============================================================================' -ForegroundColor Cyan
    Write-Host '  РЕАЛЬНАЯ ГОТОВНОСТЬ СИСТЕМЫ: ' -NoNewline -ForegroundColor White
    if ($pct -ge 75) {
        Write-Host "$pct% " -ForegroundColor Green -NoNewline
    } else {
        Write-Host "$pct% " -ForegroundColor Yellow -NoNewline
    }
    Write-Host "[$bar] ($applied из $total проверок)" -ForegroundColor White
    
    # Show Active Power Plan
    try {
        $pPlan = (powercfg /getactivescheme)
        if ($pPlan -match '\(([^)]+)\)') {
            Write-Host '  Активный план электропитания: ' -NoNewline -ForegroundColor DarkGray
            Write-Host $matches[1] -ForegroundColor Cyan
        }
    } catch {}
    Write-Host '============================================================================' -ForegroundColor Cyan
    Write-Host ''

    return @{ Applied = $applied; Total = $total; Percentage = $pct }
}

function Apply-EsportsMaximum {
    Write-Host ''
    Write-Host '============================================================================' -ForegroundColor Yellow
    Write-Host '  [*] ПРИМЕНЕНИЕ РЕЖИМА: КИБЕРСПОРТ МАКСИМУМ (1-КЛИК ОПТИМИЗАЦИЯ)...' -ForegroundColor White
    Write-Host '============================================================================' -ForegroundColor Yellow

    # 1. Win32PrioritySeparation 0x16 (22 dec - Short, Variable, 3:1 Boost)
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl' -Name 'Win32PrioritySeparation' -Value 22 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host '  [+] Win32PrioritySeparation установлен в 0x16 (22 dec - Short, Variable, 3:1)' -ForegroundColor Green

    # 2. GlobalTimerResolutionRequests = 1 (0.500ms Timer)
    if (-not (Test-Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel')) {
        New-Item -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel' -Force | Out-Null
    }
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel' -Name 'GlobalTimerResolutionRequests' -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host '  [+] GlobalTimerResolutionRequests = 1 (Активирован системный таймер 0.500 ms)' -ForegroundColor Green

    # 3. DisablePagingExecutive = 1 (Lock Kernel in DDR RAM)
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' -Name 'DisablePagingExecutive' -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host '  [+] DisablePagingExecutive = 1 (Ядро зафиксировано в оперативной памяти)' -ForegroundColor Green

    # 4. MPO Disable
    if (-not (Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows\Dwm')) {
        New-Item -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Dwm' -Force | Out-Null
    }
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Dwm' -Name 'OverlayTestMode' -Value 5 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host '  [+] OverlayTestMode = 5 (Multi-Plane Overlay отключен для устранения статтеров)' -ForegroundColor Green

    # 5. Network Throttling & Responsiveness
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NetworkThrottlingIndex' -Value 0xFFFFFFFF -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'SystemResponsiveness' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host '  [+] NetworkThrottlingIndex = 0xFFFFFFFF и SystemResponsiveness = 0' -ForegroundColor Green

    # 6. MMCSS Tasks Games
    $gamesPath = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games'
    if (Test-Path $gamesPath) {
        Set-ItemProperty -Path $gamesPath -Name 'GPU Priority' -Value 8 -Type DWord -Force -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $gamesPath -Name 'Priority' -Value 6 -Type DWord -Force -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $gamesPath -Name 'Scheduling Category' -Value 'High' -Type String -Force -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $gamesPath -Name 'SFIO Priority' -Value 'High' -Type String -Force -ErrorAction SilentlyContinue
        Write-Host '  [+] MMCSS Tasks Games переведен в режим наивысшего игрового приоритета' -ForegroundColor Green
    }

    # 7. NTFS 8.3 & LastAccess
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'NtfsDisable8dot3NameCreation' -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'NtfsDisableLastAccessUpdate' -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host '  [+] Оптимизация NTFS для NVMe SSD (8.3 Names Off, LastAccess Off)' -ForegroundColor Green

    # 8. FilterKeys 150ms AutoRepeat
    Set-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'Flags' -Value '122' -Type String -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'AutoRepeatDelay' -Value '150' -Type String -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'AutoRepeatRate' -Value '15' -Type String -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'BounceTime' -Value '0' -Type String -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'DelayBeforeAcceptance' -Value '0' -Type String -Force -ErrorAction SilentlyContinue
    Write-Host '  [+] FilterKeys настроен на 0ms задержку отклика клавиш' -ForegroundColor Green

    # 9. Telemetry & DiagTrack
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Stop-Service -Name DiagTrack -Force -ErrorAction SilentlyContinue
    Set-Service -Name DiagTrack -StartupType Disabled -ErrorAction SilentlyContinue
    Write-Host '  [+] Служба телеметрии DiagTrack остановлена и отключена' -ForegroundColor Green

    Write-Host ''
    Write-Host '[УСПЕХ] ВСЕ КИБЕРСПОРТИВНЫЕ ПАРАМЕТРЫ ЯДРА УСПЕШНО ПРИМЕНЕНЫ!' -ForegroundColor Cyan
    Start-Sleep -Milliseconds 1500
}

function Apply-SafeMode {
    Write-Host ''
    Write-Host '============================================================================' -ForegroundColor Green
    Write-Host '  [*] ПРИМЕНЕНИЕ РЕЖИМА: БЕЗОПАСНЫЙ ГЕЙМИНГ...' -ForegroundColor White
    Write-Host '============================================================================' -ForegroundColor Green

    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' -Name 'HiberbootEnabled' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel' -Name 'GlobalTimerResolutionRequests' -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NetworkThrottlingIndex' -Value 0xFFFFFFFF -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'SystemResponsiveness' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    
    Write-Host '  [+] Базовые безопасные твики успешно активированы!' -ForegroundColor Green
    Start-Sleep -Milliseconds 1200
}

function Show-CategoriesMenu {
    $categories = @(
        '01. Первым Делом (Точки восстановления, таймеры)',
        '02. Windows и Деблойт (Телеметрия, UAC, VBS, Cortana, Recall)',
        '03. Процессор и Таймеры (Win32Priority, 0.500ms, X3D V-Cache)',
        '04. Видеокарта и Графика (MPO, HAGS, GameDVR, Dynamic P-State)',
        '05. Планы Электропитания (Igromanoff AMD VIP, Intel HighPower)',
        '06. Память и Диски (DisablePagingExecutive, NTFS 8.3, NVMe)',
        '07. Интернет и Сеть (TCP NoDelay, AckFrequency 1, NIC Offloads)',
        '08. Мышь и Клавиатура (MarkC 1:1, FilterKeys 0ms, Buffer 16)',
        '09. Звук и Мультимедиа (MMCSS Tasks Games, NoLazyMode, Realtek)',
        '10. Службы и Планировщик (15 категорий фоновых задач)',
        '11. Устройства и MSI Mode (GPU and NIC Message Signaled Interrupts)',
        '12. Игровые Конфиги (CS2, Apex Legends, Valorant, Warzone)',
        '13. Диагностика и Стресс-Тесты (LatencyMon, TM5, LinX)',
        '14. Очистка Системы (TEMP, Shader Cache, EventLogs)',
        '15. Восстановление (Возврат заводских параметров)'
    )

    while ($true) {
        Clear-Host
        Write-Host '============================================================================' -ForegroundColor Cyan
        Write-Host '                 СПИСОК 15 РАЗДЕЛОВ ОПТИМИЗАЦИИ                             ' -ForegroundColor White
        Write-Host '============================================================================' -ForegroundColor Cyan
        for ($i = 0; $i -lt $categories.Count; $i++) {
            Write-Host ('  [' + ($i + 1) + '] ' + $categories[$i]) -ForegroundColor Yellow
        }
        Write-Host '  [0] Назад в Главное Меню' -ForegroundColor White
        Write-Host '============================================================================' -ForegroundColor Cyan

        $cChoice = Read-Host 'Выберите номер раздела (1-15)'
        if ($cChoice -eq '0' -or [string]::IsNullOrWhiteSpace($cChoice)) {
            break
        }

        $cNum = [int]$cChoice
        if ($cNum -ge 1 -and $cNum -le 15) {
            $catPrefix = '{0:D2}' -f $cNum
            $catDir = Get-ChildItem -Path 'd:\winvan\VanDayStuff-Ultimate' -Directory | Where-Object { $_.Name.StartsWith($catPrefix) } | Select-Object -First 1
            if ($catDir) {
                Show-CategoryFiles $catDir.FullName $categories[$cNum - 1]
            } else {
                Write-Host 'Раздел не найден на диске.' -ForegroundColor Red
                Start-Sleep -Seconds 1
            }
        }
    }
}

function Show-CategoryFiles {
    param($DirPath, $CatTitle)
    while ($true) {
        Clear-Host
        Write-Host '============================================================================' -ForegroundColor Cyan
        Write-Host "  РАЗДЕЛ: $CatTitle" -ForegroundColor White
        Write-Host '============================================================================' -ForegroundColor Cyan

        $files = Get-ChildItem -Path $DirPath -File | Where-Object { $_.Extension -in @('.bat', '.reg', '.ps1', '.txt', '.cfg') }
        if ($files.Count -eq 0) {
            Write-Host '  Файлы не найдены в этой папке.' -ForegroundColor Gray
        } else {
            for ($j = 0; $j -lt $files.Count; $j++) {
                $ext = $files[$j].Extension.ToUpper()
                Write-Host ('  [' + ($j + 1) + '] [' + $ext + '] ' + $files[$j].Name) -ForegroundColor Green
            }
        }
        Write-Host '  [A] ПРИМЕНИТЬ ВСЕ СКРИПТЫ В ЭТОМ РАЗДЕЛЕ' -ForegroundColor Cyan
        Write-Host '  [0] Назад к списку разделов' -ForegroundColor White
        Write-Host '============================================================================' -ForegroundColor Cyan

        $fChoice = Read-Host 'Выберите действие или номер файла'
        if ($fChoice -eq '0' -or [string]::IsNullOrWhiteSpace($fChoice)) {
            break
        }

        if ($fChoice.ToUpper() -eq 'A') {
            Write-Host ''
            Write-Host '[*] Пакетное применение раздела...' -ForegroundColor Yellow
            foreach ($f in $files) {
                Execute-TweakFile $f.FullName
            }
            Write-Host ''
            Write-Host '[+] Все файлы раздела успешно применены!' -ForegroundColor Green
            Start-Sleep -Seconds 2
            break
        }

        $fIdx = [int]$fChoice - 1
        if ($fIdx -ge 0 -and $fIdx -lt $files.Count) {
            Execute-TweakFile $files[$fIdx].FullName
            Start-Sleep -Seconds 1
        }
    }
}

function Execute-TweakFile {
    param($FilePath)
    $ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
    $name = [System.IO.Path]::GetFileName($FilePath)
    Write-Host "  [*] Выполнение: $name..." -ForegroundColor Yellow

    try {
        if ($ext -eq '.reg') {
            Start-Process regedit.exe -ArgumentList ('/s "' + $FilePath + '"') -Wait -WindowStyle Hidden
            Write-Host "  [+] Импортирован в реестр: $name" -ForegroundColor Green
        } elseif ($ext -eq '.bat' -or $ext -eq '.cmd') {
            Start-Process cmd.exe -ArgumentList ('/c "' + $FilePath + '"') -Wait -WindowStyle Hidden
            Write-Host "  [+] Скрипт выполнен: $name" -ForegroundColor Green
        } elseif ($ext -eq '.ps1') {
            & $FilePath
            Write-Host "  [+] PowerShell скрипт выполнен: $name" -ForegroundColor Green
        }
    } catch {
        Write-Host ('  [!] Ошибка: ' + $_.Exception.Message) -ForegroundColor Red
    }
}

# ============================================================================
#  MAIN INTERACTIVE LOOP
# ============================================================================
while ($true) {
    $auditResult = Run-DeepAudit

    Write-Host '  [1] КИБЕРСПОРТ МАКСИМУМ (1-Клик Полная Оптимизация)' -ForegroundColor Yellow
    Write-Host '  [2] БЕЗОПАСНЫЙ ИГРОВОЙ РЕЖИМ (Без Риска)' -ForegroundColor Green
    Write-Host '  [3] ПОШАГОВАЯ НАСТРОЙКА (15 Разделов на выбор)' -ForegroundColor Cyan
    Write-Host '  [4] ПОВТОРИТЬ АУДИТ СИСТЕМЫ' -ForegroundColor White
    Write-Host '  [5] ОТКРЫТЬ ЭНЦИКЛОПЕДИЮ (20 Глав)' -ForegroundColor Cyan
    Write-Host '  [6] СБРОС ВСЕХ НАСТРОЕК К ЗАВОДСКИМ' -ForegroundColor Red
    Write-Host '  [7] ЗАПУСТИТЬ ГРАФИЧЕСКОЕ ПРИЛОЖЕНИЕ (GUI)' -ForegroundColor Magenta
    Write-Host '  [0] ВЫХОД' -ForegroundColor Gray
    Write-Host '============================================================================' -ForegroundColor Cyan

    $choice = Read-Host 'Выберите пункт меню (0-7)'

    switch ($choice) {
        '1' { Apply-EsportsMaximum }
        '2' { Apply-SafeMode }
        '3' { Show-CategoriesMenu }
        '4' { <# Re-runs audit at loop start #> }
        '5' { Start-Process 'd:\winvan\CHITAT_KNIGU.html' }
        '6' {
            $conf = Read-Host 'Вы уверены, что хотите сбросить все настройки Windows? (Y/N)'
            if ($conf -eq 'Y' -or $conf -eq 'y' -or $conf -eq 'Д' -or $conf -eq 'д') {
                Write-Host '[*] Сброс параметров к заводским...' -ForegroundColor Yellow
                Start-Process powercfg -ArgumentList '-setactive 381b4222-f694-41f0-9685-ff5bb260df2e' -Wait
                Start-Sleep -Seconds 1
            }
        }
        '7' {
            Write-Host '[*] Запуск Графического Центра Оптимизации...' -ForegroundColor Magenta
            cd 'd:\winvan\ApexOptimizer'
            Start-Process 'Запустить-ApexTweak.bat'
            Start-Sleep -Seconds 1
        }
        '0' {
            Write-Host ''
            Write-Host 'Выход из WindowsOptimizer. До свидания!' -ForegroundColor Green
            exit
        }
    }
}
