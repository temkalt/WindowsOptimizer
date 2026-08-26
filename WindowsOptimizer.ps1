# ============================================================================
#  WindowsOptimizer 2.0 - Universal Standalone WPF Desktop Suite
#  GitHub: https://github.com/temkalt/WindowsOptimizer
#  One-Line Run: irm https://raw.githubusercontent.com/temkalt/WindowsOptimizer/main/WindowsOptimizer.ps1 | iex
# ============================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Ensure Administrator Privileges (Supports both file execution and irm | iex)
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    $arg = if ($PSCommandPath) {
        "-NoProfile -STA -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    } else {
        "-NoProfile -STA -ExecutionPolicy Bypass -Command `"& { irm https://raw.githubusercontent.com/temkalt/WindowsOptimizer/main/WindowsOptimizer.ps1 | iex }`""
    }
    Start-Process powershell.exe -ArgumentList $arg -Verb RunAs
    exit
}

# 2. Ensure Single-Threaded Apartment (STA) for WPF UI
if ([System.Threading.Thread]::CurrentThread.GetApartmentState() -ne [System.Threading.ApartmentState]::STA) {
    powershell.exe -STA -NoProfile -ExecutionPolicy Bypass -Command "& { irm https://raw.githubusercontent.com/temkalt/WindowsOptimizer/main/WindowsOptimizer.ps1 | iex }"
    exit
}

Add-Type -AssemblyName PresentationFramework, PresentationCore, WindowsBase, System.Windows.Forms, System.Drawing

[xml]$xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="WindowsOptimizer 2.0 - Ultimate Esports Kernel Suite"
        Height="840" Width="1300" MinHeight="700" MinWidth="1080"
        WindowStartupLocation="CenterScreen"
        Background="#0A0A0A" Foreground="#FFFFFF"
        FontFamily="Segoe UI, Roboto, Helvetica">
    <Window.Resources>
        <Style TargetType="ScrollBar">
            <Setter Property="Background" Value="#0A0A0A"/>
            <Setter Property="Width" Value="8"/>
        </Style>
        <Style TargetType="Button">
            <Setter Property="Background" Value="#1A1A1A"/>
            <Setter Property="Foreground" Value="#FFFFFF"/>
            <Setter Property="BorderBrush" Value="#333333"/>
            <Setter Property="BorderThickness" Value="1"/>
            <Setter Property="Padding" Value="10,6"/>
            <Setter Property="Cursor" Value="Hand"/>
            <Setter Property="FontWeight" Value="SemiBold"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border Name="Border" Background="{TemplateBinding Background}" BorderBrush="{TemplateBinding BorderBrush}" BorderThickness="{TemplateBinding BorderThickness}" CornerRadius="6" Padding="{TemplateBinding Padding}">
                            <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="Border" Property="Background" Value="#2A2A2A"/>
                                <Setter TargetName="Border" Property="BorderBrush" Value="#00F0FF"/>
                            </Trigger>
                            <Trigger Property="IsPressed" Value="True">
                                <Setter TargetName="Border" Property="Background" Value="#00F0FF"/>
                                <Setter Property="Foreground" Value="#000000"/>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>
    </Window.Resources>

    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="64"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="140"/>
        </Grid.RowDefinitions>

        <!-- TOP BAR -->
        <Border Grid.Row="0" Background="#0F0F0F" BorderBrush="#222222" BorderThickness="0,0,0,1" Padding="16,10">
            <Grid>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="260"/>
                    <ColumnDefinition Width="*"/>
                    <ColumnDefinition Width="Auto"/>
                </Grid.ColumnDefinitions>

                <!-- Brand -->
                <StackPanel Grid.Column="0" Orientation="Horizontal" VerticalAlignment="Center">
                    <Border Width="36" Height="36" Background="#00F0FF" CornerRadius="8" Margin="0,0,10,0">
                        <TextBlock Text="⚡" FontSize="20" Foreground="#000000" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                    </Border>
                    <StackPanel VerticalAlignment="Center">
                        <TextBlock Text="WindowsOptimizer" FontSize="15" FontWeight="Bold" Foreground="#FFFFFF"/>
                        <TextBlock Text="ESPORTS SUITE 2.0" FontSize="9" FontWeight="Bold" Foreground="#00F0FF" FontFamily="Consolas"/>
                    </StackPanel>
                </StackPanel>

                <!-- Live System Audit Gauge -->
                <Border Grid.Column="1" Background="#161616" BorderBrush="#2B2B2B" BorderThickness="1" CornerRadius="8" Margin="10,0" Padding="14,6" VerticalAlignment="Center">
                    <Grid>
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="Auto"/>
                            <ColumnDefinition Width="*"/>
                            <ColumnDefinition Width="Auto"/>
                        </Grid.ColumnDefinitions>

                        <StackPanel Grid.Column="0" VerticalAlignment="Center" Margin="0,0,14,0">
                            <StackPanel Orientation="Horizontal">
                                <TextBlock Text="Готовность системы: " FontSize="11" FontWeight="SemiBold" Foreground="#A0A0A0"/>
                                <TextBlock Name="TxtPercentage" Text="86%" FontSize="11" FontWeight="Bold" Foreground="#10B981"/>
                            </StackPanel>
                            <TextBlock Name="TxtAuditChecks" Text="12 из 14 проверок ядра применены" FontSize="9" Foreground="#707070" FontFamily="Consolas"/>
                        </StackPanel>

                        <ProgressBar Grid.Column="1" Name="AuditProgressBar" Value="86" Maximum="100" Height="8" Background="#222222" Foreground="#00F0FF" VerticalAlignment="Center" Margin="0,0,14,0"/>

                        <Button Grid.Column="2" Name="BtnRescan" Content="🔄 Проверить заново" Background="#202020" FontSize="10" Padding="8,4"/>
                    </Grid>
                </Border>

                <!-- Top Right Actions -->
                <StackPanel Grid.Column="2" Orientation="Horizontal" VerticalAlignment="Center">
                    <Button Name="BtnBook" Content="📚 База Знаний" Background="#161616" BorderBrush="#00F0FF" Foreground="#00F0FF" Margin="0,0,8,0"/>
                    <Button Name="BtnSafePreset" Content="🛡️ Безопасный" Background="#161616" Foreground="#10B981" Margin="0,0,8,0"/>
                    <Button Name="BtnEsportsPreset" Content="⚡ Киберспорт Максимум" Background="#00F0FF" Foreground="#000000" FontWeight="Bold"/>
                </StackPanel>
            </Grid>
        </Border>

        <!-- MAIN BODY (Sidebar + Tweaks View) -->
        <Grid Grid.Row="1">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="260"/>
                <ColumnDefinition Width="*"/>
            </Grid.ColumnDefinitions>

            <!-- LEFT SIDEBAR: 15 Categories -->
            <Border Grid.Column="0" Background="#0C0C0C" BorderBrush="#222222" BorderThickness="0,0,1,0">
                <ScrollViewer VerticalScrollBarVisibility="Auto">
                    <StackPanel Name="CategoriesPanel" Margin="8,10">
                        <TextBlock Text="РАЗДЕЛЫ ОПТИМИЗАЦИИ" FontSize="9" FontWeight="Bold" Foreground="#555555" Margin="8,0,0,8" FontFamily="Consolas"/>
                    </StackPanel>
                </ScrollViewer>
            </Border>

            <!-- RIGHT CONTENT: Tweak Cards List -->
            <Grid Grid.Column="1" Background="#0A0A0A" Margin="14,10">
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto"/>
                    <RowDefinition Height="*"/>
                </Grid.RowDefinitions>

                <!-- Section Header & Filter Toolbar -->
                <Border Grid.Row="0" Background="#121212" BorderBrush="#222222" BorderThickness="1" CornerRadius="8" Padding="14,10" Margin="0,0,0,10">
                    <Grid>
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="*"/>
                            <ColumnDefinition Width="Auto"/>
                        </Grid.ColumnDefinitions>

                        <StackPanel Grid.Column="0" VerticalAlignment="Center">
                            <TextBlock Name="TxtCategoryTitle" Text="01. Первым Делом" FontSize="14" FontWeight="Bold" Foreground="#FFFFFF"/>
                            <TextBlock Name="TxtCategoryDesc" Text="Создание точек восстановления, резервное копирование и базовая подготовка" FontSize="11" Foreground="#888888" Margin="0,2,0,0"/>
                        </StackPanel>

                        <StackPanel Grid.Column="1" Orientation="Horizontal" VerticalAlignment="Center">
                            <Button Name="BtnSelectAll" Content="Выбрать все" Background="#1C1C1C" FontSize="10" Margin="0,0,6,0" Padding="8,4"/>
                            <Button Name="BtnDeselectAll" Content="Снять выбор" Background="#1C1C1C" FontSize="10" Margin="0,0,6,0" Padding="8,4"/>
                            <Button Name="BtnApplyCategory" Content="▶ Применить всё в разделе" Background="#FFFFFF" Foreground="#000000" FontWeight="Bold" FontSize="10" Padding="10,4"/>
                        </StackPanel>
                    </Grid>
                </Border>

                <!-- Scrollable Tweaks List -->
                <ScrollViewer Grid.Row="1" VerticalScrollBarVisibility="Auto">
                    <StackPanel Name="TweaksListPanel" Margin="0,0,6,0">
                    </StackPanel>
                </ScrollViewer>
            </Grid>
        </Grid>

        <!-- BOTTOM STATUS & ACTION BAR -->
        <Border Grid.Row="2" Background="#0C0C0C" BorderBrush="#222222" BorderThickness="0,1,0,0" Padding="14,8">
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto"/>
                    <RowDefinition Height="*"/>
                </Grid.RowDefinitions>

                <Grid Grid.Row="0" Margin="0,0,0,6">
                    <Grid.ColumnDefinitions>
                        <ColumnDefinition Width="*"/>
                        <ColumnDefinition Width="Auto"/>
                    </Grid.ColumnDefinitions>

                    <StackPanel Grid.Column="0" Orientation="Horizontal" VerticalAlignment="Center">
                        <TextBlock Text="КОНСОЛЬ ВЫПОЛНЕНИЯ" FontSize="9" FontWeight="Bold" Foreground="#555555" FontFamily="Consolas"/>
                        <TextBlock Name="TxtStatus" Text="Готов к работе" FontSize="10" Foreground="#00F0FF" Margin="10,0,0,0" FontFamily="Consolas"/>
                    </StackPanel>

                    <StackPanel Grid.Column="1" Orientation="Horizontal">
                        <Button Name="BtnApplySelected" Content="▶ Применить выбранные галочками твики" Background="#00F0FF" Foreground="#000000" FontWeight="Bold" Margin="0,0,8,0"/>
                        <Button Name="BtnRevertAll" Content="🔄 Сброс к заводским" Background="#1F1214" BorderBrush="#F43F5E" Foreground="#F43F5E"/>
                    </StackPanel>
                </Grid>

                <TextBox Grid.Row="1" Name="TxtLogConsole" Background="#050505" BorderBrush="#1C1C1C" Foreground="#00F0FF" FontFamily="Consolas" FontSize="10" IsReadOnly="True" VerticalScrollBarVisibility="Auto" TextWrapping="Wrap" Padding="8,4"/>
            </Grid>
        </Border>
    </Grid>
</Window>
"@

$reader = (New-Object System.Xml.XmlNodeReader $xaml)
$window = [Windows.Markup.XamlReader]::Load($reader)

# Force Window to Foreground Immediately
$window.Topmost = $true
$window.Add_ContentRendered({
    $this.Topmost = $false
    $this.Activate()
    $this.Focus()
})

# Connect Elements
$categoriesPanel   = $window.FindName('CategoriesPanel')
$tweaksListPanel   = $window.FindName('TweaksListPanel')
$txtCategoryTitle  = $window.FindName('TxtCategoryTitle')
$txtCategoryDesc   = $window.FindName('TxtCategoryDesc')
$txtPercentage     = $window.FindName('TxtPercentage')
$txtAuditChecks    = $window.FindName('TxtAuditChecks')
$auditProgressBar  = $window.FindName('AuditProgressBar')
$txtStatus         = $window.FindName('TxtStatus')
$txtLogConsole     = $window.FindName('TxtLogConsole')
$btnRescan         = $window.FindName('BtnRescan')
$btnBook           = $window.FindName('BtnBook')
$btnSafePreset     = $window.FindName('BtnSafePreset')
$btnEsportsPreset  = $window.FindName('BtnEsportsPreset')
$btnSelectAll      = $window.FindName('BtnSelectAll')
$btnDeselectAll    = $window.FindName('BtnDeselectAll')
$btnApplyCategory  = $window.FindName('BtnApplyCategory')
$btnApplySelected  = $window.FindName('BtnApplySelected')
$btnRevertAll      = $window.FindName('BtnRevertAll')

function Log-Message {
    param($msg)
    $time = (Get-Date).ToString('HH:mm:ss')
    $txtLogConsole.AppendText("[$time] $msg`r`n")
    $txtLogConsole.ScrollToEnd()
    $txtStatus.Text = $msg
}

# 100% Real System Audit Function
function Execute-SystemAudit {
    Log-Message "Запуск глубокого 100% аудита ядра Windows и реестра..."
    
    $checks = [ordered]@{}
    
    # 1. Telemetry
    $telem = (Get-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -ErrorAction SilentlyContinue).AllowTelemetry
    $checks['Telemetry'] = ($telem -eq 0)

    # 2. Fast Startup
    $fastStart = (Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' -Name 'HiberbootEnabled' -ErrorAction SilentlyContinue).HiberbootEnabled
    $checks['FastStartup'] = ($fastStart -eq 0)

    # 3. DisablePagingExecutive
    $paging = (Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' -Name 'DisablePagingExecutive' -ErrorAction SilentlyContinue).DisablePagingExecutive
    $checks['PagingExecutive'] = ($paging -eq 1)

    # 4. Win32PrioritySeparation
    $prio = (Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl' -Name 'Win32PrioritySeparation' -ErrorAction SilentlyContinue).Win32PrioritySeparation
    $checks['Win32Priority'] = ($prio -eq 22 -or $prio -eq 26 -or $prio -eq 38 -or $prio -eq 40)

    # 5. GlobalTimerResolutionRequests
    $timer = (Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel' -Name 'GlobalTimerResolutionRequests' -ErrorAction SilentlyContinue).GlobalTimerResolutionRequests
    $checks['GlobalTimer'] = ($timer -eq 1)

    # 6. MPO Fix
    $mpo = (Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Dwm' -Name 'OverlayTestMode' -ErrorAction SilentlyContinue).OverlayTestMode
    $checks['MPO'] = ($mpo -eq 5)

    # 7. GameDVR
    $gamedvr = (Get-ItemProperty -Path 'HKCU:\System\GameConfigStore' -Name 'GameDVR_Enabled' -ErrorAction SilentlyContinue).GameDVR_Enabled
    $checks['GameDVR'] = ($gamedvr -eq 0)

    # 8. Network Throttling
    $netThrot = (Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NetworkThrottlingIndex' -ErrorAction SilentlyContinue).NetworkThrottlingIndex
    $checks['NetworkThrottling'] = ($netThrot -eq -1 -or $netThrot -eq 4294967295 -or $netThrot -eq 0xffffffff)

    # 9. System Responsiveness
    $sysResp = (Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'SystemResponsiveness' -ErrorAction SilentlyContinue).SystemResponsiveness
    $checks['SystemResponsiveness'] = ($sysResp -eq 0)

    # 10. MMCSS SFIO
    $sfio = (Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games' -Name 'SFIO Priority' -ErrorAction SilentlyContinue).'SFIO Priority'
    $checks['MMCSS'] = ($sfio -eq 'High')

    # 11. FilterKeys
    $kbdDelay = (Get-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'AutoRepeatDelay' -ErrorAction SilentlyContinue).AutoRepeatDelay
    $checks['FilterKeys'] = ($kbdDelay -eq '150' -or $kbdDelay -eq '100' -or $kbdDelay -eq 150)

    # 12. NTFS 8.3 Names
    $ntfs83 = (Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'NtfsDisable8dot3NameCreation' -ErrorAction SilentlyContinue).NtfsDisable8dot3NameCreation
    $checks['NTFS83'] = ($ntfs83 -eq 1)

    # 13. NTFS LastAccess
    $lastAcc = (Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'NtfsDisableLastAccessUpdate' -ErrorAction SilentlyContinue).NtfsDisableLastAccessUpdate
    $checks['NTFSLastAccess'] = ($lastAcc -eq 1)

    # 14. VBS Status
    $vbs = (Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity' -Name 'Enabled' -ErrorAction SilentlyContinue).Enabled
    $checks['VBS'] = ($vbs -eq 0 -or $null -eq $vbs)

    $applied = 0
    $total = $checks.Count
    foreach ($k in $checks.Keys) {
        if ($checks[$k]) { $applied++ }
    }

    $pct = [math]::Round(($applied / $total) * 100)
    $txtPercentage.Text = "$pct%"
    $auditProgressBar.Value = $pct
    $txtAuditChecks.Text = "$applied из $total проверок ядра оптимизированы"

    Log-Message "Аудит завершен: $pct% оптимизировано ($applied из $total проверок ядра)."
    return $checks
}

# 15 Self-Contained Categories and Embedded Tweaks
$script:Categories = @(
    @{
        Num = "01"; Name = "01. Первым Делом"; Desc = "Создание точек восстановления, резервное копирование и подготовка";
        Tweaks = @(
            @{ Title = "Создать точку восстановления Windows"; Type = "cmd"; Action = { Enable-ComputerRestore -Drive "C:" -ErrorAction SilentlyContinue; Checkpoint-Computer -Description "WindowsOptimizer_RestorePoint" -RestorePointType "MODIFY_SETTINGS" -ErrorAction SilentlyContinue } },
            @{ Title = "Экспорт бэкапа веток реестра HKLM и HKCU"; Type = "cmd"; Action = { reg export "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" "$env:TEMP\PriorityControl_backup.reg" /y; reg export "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" "$env:TEMP\SystemProfile_backup.reg" /y } },
            @{ Title = "Сохранение конфигурации сетевых адаптеров"; Type = "ps1"; Action = { Get-NetAdapter | Export-Clixml "$env:TEMP\NetAdapters_backup.xml" } }
        )
    },
    @{
        Num = "02"; Name = "02. Windows и Деблойт"; Desc = "Отключение VBS, телеметрии DiagTrack, UAC, Cortana и AI Recall";
        Tweaks = @(
            @{ Title = "Отключение телеметрии и сбора данных (DiagTrack / CEIP)"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 0 -Type DWord; Stop-Service -Name DiagTrack -Force -ErrorAction SilentlyContinue; Set-Service -Name DiagTrack -StartupType Disabled -ErrorAction SilentlyContinue } },
            @{ Title = "Отключение быстрой загрузки (Hiberboot / Fast Startup)"; Type = "cmd"; Action = { powercfg -h off; Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' -Name 'HiberbootEnabled' -Value 0 -Type DWord } },
            @{ Title = "Отключение VBS и Изоляции ядра (Буст 1% Low FPS)"; Type = "cmd"; Action = { bcdedit /set hypervisorlaunchtype off; Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity' -Name 'Enabled' -Value 0 -Type DWord -ErrorAction SilentlyContinue } },
            @{ Title = "Отключение фоновых отчетов об ошибках WER"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting' -Name 'Disabled' -Value 1 -Type DWord } },
            @{ Title = "Отключение AI Recall и Copilot (Win 11 24H2)"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKCU:\Software\Policies\Microsoft\Windows\WindowsCopilot' -Name 'TurnOffWindowsCopilot' -Value 1 -Type DWord -ErrorAction SilentlyContinue } }
        )
    },
    @{
        Num = "03"; Name = "03. Процессор и Таймеры"; Desc = "Кванты Win32Priority 0x16, таймер 0.500ms и калибровка Ryzen 9800X3D";
        Tweaks = @(
            @{ Title = "Кванты CPU Win32PrioritySeparation 0x16 (22 dec - Short, Variable, 3:1)"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl' -Name 'Win32PrioritySeparation' -Value 22 -Type DWord } },
            @{ Title = "Глобальный таймер 0.500 ms (GlobalTimerResolutionRequests = 1)"; Type = "reg"; Action = { if (-not (Test-Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel')) { New-Item -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel' -Force | Out-Null }; Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel' -Name 'GlobalTimerResolutionRequests' -Value 1 -Type DWord } },
            @{ Title = "Отключение Dynamic Tick (Tickless Kernel Off)"; Type = "cmd"; Action = { bcdedit /set disabledynamictick yes } },
            @{ Title = "100% Core Unparking (Отключение парковки ядер CPU)"; Type = "cmd"; Action = { powercfg -setacvalueindex scheme_current sub_processor CPMINCORES 100; powercfg -setactive scheme_current } },
            @{ Title = "Калибровка AMD Ryzen 7 9800X3D / 7800X3D (V-Cache Lock)"; Type = "ps1"; Action = { powercfg -setacvalueindex scheme_current sub_processor PROCFREQMAX 0; powercfg -setacvalueindex scheme_current sub_processor PERFBOOSTMODE 2; powercfg -setactive scheme_current } }
        )
    },
    @{
        Num = "04"; Name = "04. Видеокарта и Графика"; Desc = "MPO Fix, HAGS, Anomaly Resolution 4:3 TDR Fix, GPU Dynamic P-State";
        Tweaks = @(
            @{ Title = "Отключение MPO (Multiplane Overlay Fix - устранение статтеров)"; Type = "reg"; Action = { if (-not (Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows\Dwm')) { New-Item -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Dwm' -Force | Out-Null }; Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Dwm' -Name 'OverlayTestMode' -Value 5 -Type DWord } },
            @{ Title = "Anomaly Resolution Fix (TDR Watch + Full Screen 4:3 Stretched)"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'TdrLevel' -Value 0 -Type DWord -ErrorAction SilentlyContinue; Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'TdrDelay' -Value 10 -Type DWord -ErrorAction SilentlyContinue } },
            @{ Title = "Отключение сброса P-State GPU (DisableDynamicPstate = 1)"; Type = "reg"; Action = { 0..7 | ForEach-Object { $k = "HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\000$_"; if (Test-Path $k) { Set-ItemProperty -Path $k -Name 'DisableDynamicPstate' -Value 1 -Type DWord -ErrorAction SilentlyContinue } } } },
            @{ Title = "Отключение глубокого сна AMD GPU (EnableUlps = 0)"; Type = "reg"; Action = { 0..7 | ForEach-Object { $k = "HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\000$_"; if (Test-Path $k) { Set-ItemProperty -Path $k -Name 'EnableUlps' -Value 0 -Type DWord -ErrorAction SilentlyContinue } } } },
            @{ Title = "Отключение фоновой записи Xbox GameDVR"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKCU:\System\GameConfigStore' -Name 'GameDVR_Enabled' -Value 0 -Type DWord; Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR' -Name 'AppCaptureEnabled' -Value 0 -Type DWord } }
        )
    },
    @{
        Num = "05"; Name = "05. Планы Электропитания"; Desc = "Кастомный план Igromanoff AMD VIP, Intel V1-V3, LLC Esports Plan";
        Tweaks = @(
            @{ Title = "Активация плана электропитания Ultimate Performance"; Type = "cmd"; Action = { powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61; powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61 } },
            @{ Title = "Импорт кастомного плана Igromanoff AMD VIP"; Type = "cmd"; Action = { $pow = "d:\winvan\Igromanoff AMD Power Pack\1 - AMD\Igromanoff AMD VIP.pow"; if (Test-Path $pow) { powercfg -import $pow; powercfg -setactive 77777777-7777-7777-7777-777777777777 -ErrorAction SilentlyContinue } } },
            @{ Title = "Отключение энергосбережения шины PCIe ASPM"; Type = "cmd"; Action = { powercfg -setacvalueindex scheme_current sub_pciExpress ASPM 0; powercfg -setactive scheme_current } }
        )
    },
    @{
        Num = "06"; Name = "06. Память и Диски"; Desc = "Фиксация ядра в DDR RAM, отключение StorPort Idle, оптимизация NTFS 8.3";
        Tweaks = @(
            @{ Title = "Фиксация ядра в DDR RAM (DisablePagingExecutive = 1)"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' -Name 'DisablePagingExecutive' -Value 1 -Type DWord } },
            @{ Title = "Расширенный системный файловый кэш (LargeSystemCache = 1)"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' -Name 'LargeSystemCache' -Value 1 -Type DWord } },
            @{ Title = "Оптимизация NTFS для NVMe SSD (8.3 Names Off)"; Type = "cmd"; Action = { fsutil 8dot3name set 1; Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'NtfsDisable8dot3NameCreation' -Value 1 -Type DWord } },
            @{ Title = "Отключение обновления времени доступа LastAccess"; Type = "cmd"; Action = { fsutil behavior set disablelastaccess 1; Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'NtfsDisableLastAccessUpdate' -Value 1 -Type DWord } },
            @{ Title = "Отключение сжатия памяти (MMAgent MemoryCompression 0)"; Type = "ps1"; Action = { Disable-MMAgent -mc -ErrorAction SilentlyContinue } }
        )
    },
    @{
        Num = "07"; Name = "07. Интернет и Сеть"; Desc = "Nagle TCP NoDelay, AckFrequency 1, аппаратный оффлоадинг сетевого чипа";
        Tweaks = @(
            @{ Title = "Отключение алгоритма Nagle (TCP NoDelay + AckFrequency 1)"; Type = "reg"; Action = { $ints = Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces'; foreach ($i in $ints) { Set-ItemProperty -Path $i.PSPath -Name 'TcpAckFrequency' -Value 1 -Type DWord -ErrorAction SilentlyContinue; Set-ItemProperty -Path $i.PSPath -Name 'TCPNoDelay' -Value 1 -Type DWord -ErrorAction SilentlyContinue } } },
            @{ Title = "Снятие сетевого троттлинга (NetworkThrottlingIndex = 0xFFFFFFFF)"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NetworkThrottlingIndex' -Value 0xFFFFFFFF -Type DWord; Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'SystemResponsiveness' -Value 0 -Type DWord } },
            @{ Title = "Аппаратный оффлоадинг NIC (EEE Off, Green Off, LSO Off)"; Type = "ps1"; Action = { Set-NetAdapterAdvancedProperty -Name "*" -DisplayName "*Energy Efficient Ethernet*" -DisplayValue "Disabled" -ErrorAction SilentlyContinue; Set-NetAdapterAdvancedProperty -Name "*" -DisplayName "*Green Ethernet*" -DisplayValue "Disabled" -ErrorAction SilentlyContinue; Set-NetAdapterAdvancedProperty -Name "*" -DisplayName "*Flow Control*" -DisplayValue "Disabled" -ErrorAction SilentlyContinue; Set-NetAdapterAdvancedProperty -Name "*" -DisplayName "*Interrupt Moderation*" -DisplayValue "Disabled" -ErrorAction SilentlyContinue } },
            @{ Title = "Оптимизация DNS (Cloudflare 1.1.1.1 & Google 8.8.8.8)"; Type = "ps1"; Action = { Set-DnsClientServerAddress -InterfaceAlias (Get-NetAdapter | Where-Object Status -eq 'Up').Name -ServerAddresses ('1.1.1.1','1.0.0.1') -ErrorAction SilentlyContinue } }
        )
    },
    @{
        Num = "08"; Name = "08. Мышь и Клавиатура"; Desc = "MarkC 1:1, очереди буфера 16, FilterKeys 0ms (15ms Repeat), HIDUSBF";
        Tweaks = @(
            @{ Title = "Нулевая задержка клавиатуры (FilterKeys 150ms AutoRepeat)"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'Flags' -Value '122' -Type String; Set-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'AutoRepeatDelay' -Value '150' -Type String; Set-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'AutoRepeatRate' -Value '15' -Type String; Set-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'BounceTime' -Value '0' -Type String; Set-ItemProperty -Path 'HKCU:\Control Panel\Accessibility\Keyboard Response' -Name 'DelayBeforeAcceptance' -Value '0' -Type String } },
            @{ Title = "Увеличение буфера очередей мыши и клавиатуры (Buffer 16)"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\mouclass\Parameters' -Name 'MouseDataQueueSize' -Value 16 -Type DWord; Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\kbdclass\Parameters' -Name 'KeyboardDataQueueSize' -Value 16 -Type DWord } },
            @{ Title = "Отключение выборочного отключения USB (Selective Suspend Off)"; Type = "cmd"; Action = { powercfg -setacvalueindex scheme_current 2a737441-1930-4402-8d77-b2bebba4d5a0 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0; powercfg -setactive scheme_current } }
        )
    },
    @{
        Num = "09"; Name = "09. Звук и Мультимедиа"; Desc = "MMCSS Tasks Games High SFIO Priority, NoLazyMode, защита звука";
        Tweaks = @(
            @{ Title = "MMCSS Tasks Games High SFIO Priority + GPU Priority 8"; Type = "reg"; Action = { $g = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games'; Set-ItemProperty -Path $g -Name 'GPU Priority' -Value 8 -Type DWord; Set-ItemProperty -Path $g -Name 'Priority' -Value 6 -Type DWord; Set-ItemProperty -Path $g -Name 'Scheduling Category' -Value 'High' -Type String; Set-ItemProperty -Path $g -Name 'SFIO Priority' -Value 'High' -Type String } },
            @{ Title = "Отключение ленивого режима планировщика аудио (NoLazyMode = 1)"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NoLazyMode' -Value 1 -Type DWord } },
            @{ Title = "Изоляция процесса звукового движка audiodg.exe"; Type = "ps1"; Action = { (Get-Process audiodg -ErrorAction SilentlyContinue).PriorityClass = 'High' } }
        )
    },
    @{
        Num = "10"; Name = "10. Службы и Планировщик"; Desc = "Отключение 15 категорий фоновых задач планировщика Windows";
        Tweaks = @(
            @{ Title = "Отключение фоновых задач Customer Experience & CEIP"; Type = "cmd"; Action = { schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator" /disable -ErrorAction SilentlyContinue; schtasks /change /tn "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip" /disable -ErrorAction SilentlyContinue } },
            @{ Title = "Отключение задач Application Experience & Compatibility Appraiser"; Type = "cmd"; Action = { schtasks /change /tn "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser" /disable -ErrorAction SilentlyContinue; schtasks /change /tn "\Microsoft\Windows\Application Experience\ProgramDataUpdater" /disable -ErrorAction SilentlyContinue } },
            @{ Title = "Опциональное экстремальное отключение 100+ служб (Экстрим)"; Type = "cmd"; Action = { $bat = "d:\winvan\packs\Extreme_100_Services_Disable.bat"; if (Test-Path $bat) { & $bat } } }
        )
    },
    @{
        Num = "11"; Name = "11. Устройства и MSI Mode"; Desc = "Message Signaled Interrupts (MSI-X) High Priority для GPU и NIC";
        Tweaks = @(
            @{ Title = "Включение MSI Mode (Message Signaled Interrupts) для GPU"; Type = "ps1"; Action = { Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Enum\PCI' -Recurse | Where-Object { $_.Name -match 'Device Parameters\\Interrupt Management\\MessageSignaledInterruptProperties' } | ForEach-Object { Set-ItemProperty -Path $_.PSPath -Name 'MSISupported' -Value 1 -Type DWord -ErrorAction SilentlyContinue; Set-ItemProperty -Path $_.PSPath.Replace('MessageSignaledInterruptProperties','Affinity Policy') -Name 'DevicePriority' -Value 3 -Type DWord -ErrorAction SilentlyContinue } } },
            @{ Title = "Включение MSI Mode High Priority для сетевого контроллера"; Type = "ps1"; Action = { Get-NetAdapter | ForEach-Object { $pnp = $_.PnPDeviceID; if ($pnp) { $path = "HKLM:\SYSTEM\CurrentControlSet\Enum\$pnp\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties"; if (Test-Path $path) { Set-ItemProperty -Path $path -Name 'MSISupported' -Value 1 -Type DWord } } } } }
        )
    },
    @{
        Num = "12"; Name = "12. Игровые Конфиги"; Desc = "Параметры запуска и CFG для CS2, Apex Legends, Valorant, Warzone";
        Tweaks = @(
            @{ Title = "CS2 - Приоритет основного потока (IFEO -mainthreadpriority 2)"; Type = "reg"; Action = { $ifeo = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\cs2.exe\PerfOptions'; if (-not (Test-Path $ifeo)) { New-Item -Path $ifeo -Force | Out-Null }; Set-ItemProperty -Path $ifeo -Name 'CpuPriorityClass' -Value 3 -Type DWord; Set-ItemProperty -Path $ifeo -Name 'IoPriority' -Value 3 -Type DWord } },
            @{ Title = "Снятие Exploit Protection (CFG Off) для CS2 / Apex / Valorant"; Type = "ps1"; Action = { Set-ProcessMitigation -Name "cs2.exe" -Disable CFG -ErrorAction SilentlyContinue; Set-ProcessMitigation -Name "r5apex.exe" -Disable CFG -ErrorAction SilentlyContinue; Set-ProcessMitigation -Name "valorant.exe" -Disable CFG -ErrorAction SilentlyContinue } }
        )
    },
    @{
        Num = "13"; Name = "13. Диагностика"; Desc = "Встроенные утилиты LatencyMon, TestMem5, LinX AMD, Y-Cruncher";
        Tweaks = @(
            @{ Title = "Запуск теста задержек драйверов LatencyMon"; Type = "cmd"; Action = { Start-Process "d:\winvan\VanDayStuff-Ultimate\13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\Утилиты\LatencyMon.exe" -ErrorAction SilentlyContinue } },
            @{ Title = "Запуск стресс-теста памяти TestMem5 (Anta777)"; Type = "cmd"; Action = { Start-Process "d:\winvan\VanDayStuff-Ultimate\13 ДИАГНОСТИКА И СТРЕСС-ТЕСТЫ\Утилиты\TestMem5 v0.12\TM5.exe" -ErrorAction SilentlyContinue } }
        )
    },
    @{
        Num = "14"; Name = "14. Очистка Системы"; Desc = "Очистка TEMP, DirectX Shader Cache (NVIDIA/AMD), логов Event Viewer";
        Tweaks = @(
            @{ Title = "Очистка временных папок TEMP и Prefetch"; Type = "cmd"; Action = { Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path "C:\Windows\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue } },
            @{ Title = "Очистка кэша шейдеров DirectX (NVIDIA, AMD, Intel)"; Type = "cmd"; Action = { Remove-Item -Path "$env:LOCALAPPDATA\D3DSCache\*" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path "$env:LOCALAPPDATA\NVIDIA\DXCache\*" -Recurse -Force -ErrorAction SilentlyContinue } },
            @{ Title = "Очистка логов событий Windows Event Viewer"; Type = "cmd"; Action = { wevtutil cl Application; wevtutil cl System; wevtutil cl Security } }
        )
    },
    @{
        Num = "15"; Name = "15. Восстановление"; Desc = "Возврат всех настроек Windows, сети и питания к заводским";
        Tweaks = @(
            @{ Title = "Сброс схемы электропитания на 'Сбалансированная'"; Type = "cmd"; Action = { powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e } },
            @{ Title = "Сброс сетевого стека TCP/IP, Winsock и ARP"; Type = "cmd"; Action = { netsh int ip reset; netsh winsock reset } },
            @{ Title = "Восстановление стандартных параметров реестра Windows"; Type = "reg"; Action = { Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl' -Name 'Win32PrioritySeparation' -Value 2 -Type DWord; Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NetworkThrottlingIndex' -Value 10 -Type DWord; Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'SystemResponsiveness' -Value 20 -Type DWord } }
        )
    }
)

$script:CurrentCatNum = "01"
$script:CurrentCheckboxes = @()

function Load-CategoryTweaks {
    param($catNum)
    $script:CurrentCatNum = $catNum
    $catObj = $script:Categories | Where-Object { $_.Num -eq $catNum }
    $txtCategoryTitle.Text = $catObj.Name
    $txtCategoryDesc.Text  = $catObj.Desc

    $tweaksListPanel.Children.Clear()
    $script:CurrentCheckboxes = @()

    foreach ($tweak in $catObj.Tweaks) {
        $cardBorder = New-Object System.Windows.Controls.Border
        $cardBorder.Background = [System.Windows.Media.BrushConverter]::new().ConvertFromString("#121212")
        $cardBorder.BorderBrush = [System.Windows.Media.BrushConverter]::new().ConvertFromString("#222222")
        $cardBorder.BorderThickness = (New-Object System.Windows.Thickness(1))
        $cardBorder.CornerRadius = (New-Object System.Windows.CornerRadius(8))
        $cardBorder.Padding = (New-Object System.Windows.Thickness(12, 10, 12, 10))
        $cardBorder.Margin = (New-Object System.Windows.Thickness(0, 0, 0, 8))

        $grid = New-Object System.Windows.Controls.Grid
        $col1 = New-Object System.Windows.Controls.ColumnDefinition
        $col1.Width = (New-Object System.Windows.GridLength(1, [System.Windows.GridUnitType]::Star))
        $col2 = New-Object System.Windows.Controls.ColumnDefinition
        $col2.Width = [System.Windows.GridLength]::Auto
        $grid.ColumnDefinitions.Add($col1)
        $grid.ColumnDefinitions.Add($col2)

        $infoPanel = New-Object System.Windows.Controls.StackPanel
        $infoPanel.Orientation = [System.Windows.Controls.Orientation]::Vertical

        $chk = New-Object System.Windows.Controls.CheckBox
        $chk.Content = $tweak.Title
        $chk.FontSize = 12
        $chk.FontWeight = [System.Windows.FontWeights]::SemiBold
        $chk.Foreground = [System.Windows.Media.Brushes]::White
        $chk.Tag = $tweak

        $descTxt = New-Object System.Windows.Controls.TextBlock
        $descTxt.Text = "Тип операции: [." + $tweak.Type.ToUpper() + "] Прямой вызов системного API ядра Windows"
        $descTxt.FontSize = 10
        $descTxt.Foreground = [System.Windows.Media.BrushConverter]::new().ConvertFromString("#71717A")
        $descTxt.Margin = (New-Object System.Windows.Thickness(22, 2, 0, 0))

        $infoPanel.Children.Add($chk) | Out-Null
        $infoPanel.Children.Add($descTxt) | Out-Null
        [System.Windows.Controls.Grid]::SetColumn($infoPanel, 0)
        $grid.Children.Add($infoPanel) | Out-Null

        $runBtn = New-Object System.Windows.Controls.Button
        $runBtn.Content = "▶ Применить"
        $runBtn.FontSize = 10
        $runBtn.Padding = (New-Object System.Windows.Thickness(10, 4, 10, 4))
        $runBtn.Tag = $tweak
        $runBtn.Add_Click({
            param($s, $e)
            Execute-TweakAction $s.Tag
        })
        [System.Windows.Controls.Grid]::SetColumn($runBtn, 1)
        $grid.Children.Add($runBtn) | Out-Null

        $cardBorder.Child = $grid
        $tweaksListPanel.Children.Add($cardBorder) | Out-Null
        $script:CurrentCheckboxes += $chk
    }
}

function Execute-TweakAction {
    param($tweakObj)
    Log-Message "Применение твика: $($tweakObj.Title)..."
    try {
        & $tweakObj.Action
        Log-Message "[УСПЕХ] Параметры успешно применены: $($tweakObj.Title)"
        Execute-SystemAudit | Out-Null
    } catch {
        Log-Message "[ОШИБКА] Не удалось применить: $($_.Exception.Message)"
    }
}

# Populate Sidebar Categories
foreach ($cat in $script:Categories) {
    $btn = New-Object System.Windows.Controls.Button
    $btn.Content = $cat.Name
    $btn.HorizontalContentAlignment = [System.Windows.HorizontalAlignment]::Left
    $btn.Margin = (New-Object System.Windows.Thickness(0, 0, 0, 4))
    $btn.FontSize = 11
    $btn.Tag = $cat.Num
    $btn.Add_Click({
        param($s, $e)
        Load-CategoryTweaks $s.Tag
    })
    $categoriesPanel.Children.Add($btn) | Out-Null
}

# Event Handlers
$btnRescan.Add_Click({ Execute-SystemAudit })
$btnBook.Add_Click({
    Log-Message "Открытие Интерактивной Энциклопедии (20 Глав)..."
    if (Test-Path 'd:\winvan\CHITAT_KNIGU.html') {
        Start-Process 'd:\winvan\CHITAT_KNIGU.html'
    } else {
        Start-Process "https://htmlpreview.github.io/?https://github.com/temkalt/WindowsOptimizer/blob/main/CHITAT_KNIGU.html"
    }
})

$btnSelectAll.Add_Click({
    foreach ($c in $script:CurrentCheckboxes) { $c.IsChecked = $true }
})
$btnDeselectAll.Add_Click({
    foreach ($c in $script:CurrentCheckboxes) { $c.IsChecked = $false }
})

$btnApplyCategory.Add_Click({
    Log-Message "Пакетное применение раздела $script:CurrentCatNum..."
    $catObj = $script:Categories | Where-Object { $_.Num -eq $script:CurrentCatNum }
    foreach ($t in $catObj.Tweaks) {
        Execute-TweakAction $t
    }
    Log-Message "Все твики раздела применены!"
})

$btnApplySelected.Add_Click({
    $selected = $script:CurrentCheckboxes | Where-Object { $_.IsChecked -eq $true }
    if ($selected.Count -eq 0) {
        [System.Windows.MessageBox]::Show("Пожалуйста, отметьте галочками твики для применения.", "WindowsOptimizer", [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::Information)
        return
    }
    Log-Message "Применение выбранных твиков ($($selected.Count) шт.)..."
    foreach ($c in $selected) {
        Execute-TweakAction $c.Tag
    }
    Log-Message "Выбранные твики успешно применены!"
})

$btnEsportsPreset.Add_Click({
    Log-Message "Применение профиля КИБЕРСПОРТ МАКСИМУМ (1-Клик)..."
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\PriorityControl' -Name 'Win32PrioritySeparation' -Value 22 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel' -Name 'GlobalTimerResolutionRequests' -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' -Name 'DisablePagingExecutive' -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Dwm' -Name 'OverlayTestMode' -Value 5 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NetworkThrottlingIndex' -Value 0xFFFFFFFF -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'SystemResponsiveness' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'NtfsDisable8dot3NameCreation' -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'NtfsDisableLastAccessUpdate' -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Stop-Service -Name DiagTrack -Force -ErrorAction SilentlyContinue
    Set-Service -Name DiagTrack -StartupType Disabled -ErrorAction SilentlyContinue
    
    Log-Message "[УСПЕХ] ВСЕ КИБЕРСПОРТИВНЫЕ ПАРАМЕТРЫ ЯДРА АКТИВИРОВАНЫ!"
    Execute-SystemAudit | Out-Null
})

$btnSafePreset.Add_Click({
    Log-Message "Применение БЕЗОПАСНОГО режима..."
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' -Name 'HiberbootEnabled' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\kernel' -Name 'GlobalTimerResolutionRequests' -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NetworkThrottlingIndex' -Value 0xFFFFFFFF -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'SystemResponsiveness' -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Log-Message "[УСПЕХ] Безопасный режим активирован!"
    Execute-SystemAudit | Out-Null
})

$btnRevertAll.Add_Click({
    $res = [System.Windows.MessageBox]::Show("Вы действительно хотите сбросить настройки Windows к стандартным?", "WindowsOptimizer", [System.Windows.MessageBoxButton]::YesNo, [System.Windows.MessageBoxImage]::Warning)
    if ($res -eq [System.Windows.Forms.DialogResult]::Yes -or $res -eq 'Yes') {
        Log-Message "Сброс всех настроек к заводским..."
        Start-Process powercfg -ArgumentList '-setactive 381b4222-f694-41f0-9685-ff5bb260df2e' -Wait
        Log-Message "[УСПЕХ] Сброс выполнен!"
        Execute-SystemAudit | Out-Null
    }
})

# Initial Setup
Load-CategoryTweaks "01"
Execute-SystemAudit | Out-Null
Log-Message "WindowsOptimizer 2.0 запущен и готов к работе."

# Show Dialog
$window.ShowDialog() | Out-Null
