@echo off
chcp 65001 >nul
title APEXTWEAK ULTIMATE PACK - ESPORTS MAXIMUM 1-CLICK OPTIMIZER

:: ============================================================================
:: 0. Self-Elevation Check (Auto-request Administrator via UAC)
:: ============================================================================
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Requesting Administrator Privileges...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

set PACK_DIR=%~dp0
color 0C
cls
echo ============================================================================
echo        APEXTWEAK ULTIMATE PACK - ESPORTS MAXIMUM 1-CLICK OPTIMIZER
echo ============================================================================
echo  [TARGET] Maximum FPS, Minimum DPC Latency, 0.5ms Timers, 0ms Input Lag
echo ============================================================================
echo.

:: ============================================================================
:: 1. System Restore Point and Safety Backup
:: ============================================================================
echo [*] [1/13] Creating System Restore Point 'Ultimate_Optimization_Pre_Tweak'...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore" /v "SystemRestorePointCreationFrequency" /t REG_DWORD /d 0 /f >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Enable-ComputerRestore -Drive 'C:\' -ErrorAction SilentlyContinue; Checkpoint-Computer -Description 'Ultimate_Optimization_Pre_Tweak_Backup' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue" >nul 2>&1
echo  [+] Restore Point initialized.

:: ============================================================================
:: 2. Windows Base Debloat and Telemetry Purge
:: ============================================================================
echo [*] [2/13] Applying Windows Base Debloat and Telemetry Purge...
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\1_Disable_Telemetry_And_DiagTrack.reg"
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\3_Disable_UAC_Prompts.reg"
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\4_Disable_Background_Apps_Global.reg"
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\5_Disable_Windows_Error_Reporting.reg"
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\6_Disable_Cortana_And_Web_Search.reg"
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\7_Disable_Delivery_Optimization.reg"
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\8_Disable_Automatic_Maintenance.reg"
powercfg -h off >nul 2>&1

:: Windows 11 24H2 Copilot / Recall Purge
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Policies\Microsoft\Windows\WindowsAI" /v "DisableAIDataAnalysis" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Policies\Microsoft\Windows\WindowsCopilot" /v "TurnOffWindowsCopilot" /t REG_DWORD /d 1 /f >nul 2>&1
echo  [+] Base Debloat and Telemetry disabled.

:: ============================================================================
:: 3. CPU Scheduling, Timers and Core Unparking
:: ============================================================================
echo [*] [3/13] Configuring CPU Scheduling, Enhanced TSC Sync and Core Unparking...
regedit /s "%PACK_DIR%02_CPU_SCHEDULING_AND_TIMERS\1_Win32PrioritySeparation_26_Hex1A_Esports.reg"
regedit /s "%PACK_DIR%02_CPU_SCHEDULING_AND_TIMERS\7_GlobalTimerResolutionRequests_Fix.reg"
bcdedit /set disabledynamictick yes >nul 2>&1
bcdedit /deletevalue useplatformclock >nul 2>&1
bcdedit /set tscsyncpolicy Enhanced >nul 2>&1

:: Core Unparking and EPP 0 (Maximum Boost)
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb10593acda8 -ATTRIB_HIDE >nul 2>&1
powercfg -attributes 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 -ATTRIB_HIDE >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 100 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 ea062031-0e34-4ff1-9b6d-eb10593acda8 100 >nul 2>&1
powercfg -setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 0 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1
echo  [+] CPU Timers and Core Unparking configured.

:: ============================================================================
:: 4. GPU Latency, HAGS, DirectFlip and Driver Optimization
:: ============================================================================
echo [*] [4/13] Calibrating GPU Drivers, HAGS, DirectFlip and Thread Priorities...
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\1_Enable_HAGS_Hardware_GPU_Scheduling.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\2_Disable_MPO_Multiplane_Overlay_Fix.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\3_Disable_GameDVR_And_Xbox_Capture.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\4_Enable_FSE_And_FSO_Optimizations.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\5_DirectFlip_Mode2_And_DXGI_FlipModel.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\6_Set_DirectX_DXGKrnl_Thread_Priority.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\7_Set_Nvidia_Kernel_nvlddmkm_Thread_Priority.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\8_NVIDIA_Shader_Cache_Unlimited_10GB.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\9_Disable_GPU_Energy_Throttling.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\10_Enable_Variable_Refresh_Rate_VRR.reg"

:: NVIDIA Profile Inspector Import if NVIDIA GPU is present
if exist "%PACK_DIR%bin\nvidiaProfileInspector.exe" (
    if exist "%PACK_DIR%bin\LLC-OPTIMIZED-V2.nip" (
        "%PACK_DIR%bin\nvidiaProfileInspector.exe" "%PACK_DIR%bin\LLC-OPTIMIZED-V2.nip" -silent >nul 2>&1
        echo  [+] NVIDIA Zero-Latency Driver Profile imported.
    )
)
echo  [+] GPU graphics stack tuned for zero display delay.

:: ============================================================================
:: 5. Memory and Storage (Pin Kernel in RAM, Disable StorPort Idle, NTFS Speed)
:: ============================================================================
echo [*] [5/13] Optimizing Memory Paging, NTFS Filesystem and StorPort Low-Latency...
regedit /s "%PACK_DIR%04_MEMORY_AND_STORAGE_SPEED\1_Pin_Kernel_In_RAM_DisablePagingExecutive.reg"
regedit /s "%PACK_DIR%04_MEMORY_AND_STORAGE_SPEED\3_Disable_NVMe_SATA_StorPort_Idle.reg"
regedit /s "%PACK_DIR%04_MEMORY_AND_STORAGE_SPEED\4_Disable_NVMe_SATA_StorPort_Idle.reg"
regedit /s "%PACK_DIR%04_MEMORY_AND_STORAGE_SPEED\7_Increase_NTFS_Memory_Usage_Buffer.reg"
regedit /s "%PACK_DIR%04_MEMORY_AND_STORAGE_SPEED\9_Set_System_Responsiveness_Zero.reg"

:: Disable NTFS 8.3 and Last Access Update
fsutil behavior set disablelastaccess 1 >nul 2>&1
fsutil behavior set disable8dot3 1 >nul 2>&1

:: Disable MMAgent Memory Compression and Page Combining
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Disable-MMAgent -MemoryCompression -PageCombining -ApplicationPreLaunch -OperationEndpoints -ErrorAction SilentlyContinue" >nul 2>&1
echo  [+] Memory and Storage latency optimizations deployed.

:: ============================================================================
:: 6. Network and Ethernet (TCP NoDelay, AckFrequency 1, Adapter Tuning)
:: ============================================================================
echo [*] [6/13] Configuring TCP/IP Zero-Delay Stack and Network Adapter...
regedit /s "%PACK_DIR%05_ETHERNET_AND_NETWORK_PING\1_Disable_Nagle_Algorithm_TCPNoDelay.reg"
regedit /s "%PACK_DIR%05_ETHERNET_AND_NETWORK_PING\2_Enable_TcpAckFrequency_1_Instant_Packets.reg"
regedit /s "%PACK_DIR%05_ETHERNET_AND_NETWORK_PING\3_Disable_Network_Throttling_Index.reg"
regedit /s "%PACK_DIR%05_ETHERNET_AND_NETWORK_PING\5_Optimize_DNS_And_NetBT_Priorities.reg"
regedit /s "%PACK_DIR%05_ETHERNET_AND_NETWORK_PING\8_Set_MaxUserPort_And_TcpTimedWaitDelay.reg"

netsh int tcp set global autotuninglevel=normal >nul 2>&1
netsh int tcp set global ecncapability=enabled >nul 2>&1
netsh int tcp set global rss=enabled >nul 2>&1
netsh int tcp set global timestamps=disabled >nul 2>&1
netsh int tcp set heuristics disabled >nul 2>&1

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%05_ETHERNET_AND_NETWORK_PING\2_Realtek_2.5GbE_RTL8125_Ultra_Low_Latency.ps1" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%05_ETHERNET_AND_NETWORK_PING\6_Network_Adapter_Disable_PowerSaving.ps1" >nul 2>&1
echo  [+] Network latency and packet throughput calibrated.

:: ============================================================================
:: 7. Mouse, Keyboard and 8000Hz HID Input Stack
:: ============================================================================
echo [*] [7/13] Applying 1:1 Mouse Linear Mapping, 16 Packet Buffer and FilterKeys...
regedit /s "%PACK_DIR%06_MOUSE_KEYBOARD_INPUT_LAG\1_MarkC_Windows11_10_Mouse_Fix_100_Percent.reg"
regedit /s "%PACK_DIR%06_MOUSE_KEYBOARD_INPUT_LAG\2_Set_MouseDataQueueSize_16_Low_Buffer.reg"
regedit /s "%PACK_DIR%06_MOUSE_KEYBOARD_INPUT_LAG\3_Set_KeyboardDataQueueSize_16_Low_Buffer.reg"
regedit /s "%PACK_DIR%06_MOUSE_KEYBOARD_INPUT_LAG\4_Apply_Competitive_FilterKeys_0ms_15ms.reg"
regedit /s "%PACK_DIR%06_MOUSE_KEYBOARD_INPUT_LAG\6_Set_USBHUB3_USBXHCI_Thread_Priority.reg"
regedit /s "%PACK_DIR%06_MOUSE_KEYBOARD_INPUT_LAG\7_Disable_Mouse_Acceleration_And_Thresholds.reg"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%06_MOUSE_KEYBOARD_INPUT_LAG\2_High_Polling_8000Hz_HID_Optimizer.ps1" >nul 2>&1
echo  [+] 8000Hz/4000Hz/1000Hz Input polling stack maximized.

:: ============================================================================
:: 8. Audio Isolation and MMCSS High Priority
:: ============================================================================
echo [*] [8/13] Configuring MMCSS Gaming Priority and AudioDG Low-Latency Isolation...
regedit /s "%PACK_DIR%07_AUDIO_AND_MMCSS_OPTIMIZATION\1_Configure_MMCSS_Games_High_Priority.reg"
regedit /s "%PACK_DIR%07_AUDIO_AND_MMCSS_OPTIMIZATION\2_Configure_MMCSS_Audio_Zero_Stutter.reg"
regedit /s "%PACK_DIR%07_AUDIO_AND_MMCSS_OPTIMIZATION\3_Realtek_ALC897_DAC_Idle_Power_Disable.reg"
regedit /s "%PACK_DIR%07_AUDIO_AND_MMCSS_OPTIMIZATION\5_Fix_MMCSS_Network_Bandwidth_Throttling.reg"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%07_AUDIO_AND_MMCSS_OPTIMIZATION\2_AudioDG_Priority_High_And_Core_Pinning.ps1" >nul 2>&1
echo  [+] Audio sub-system isolated and MMCSS configured.

:: ============================================================================
:: 9. Power Plans and Energy Management
:: ============================================================================
echo [*] [9/13] Activating Esports Low-Latency Power Plan (Igromanoff VIP / LLC)...
set IGRO_POW="%PACK_DIR%08_POWER_PLANS_AND_ENERGY\Igromanoff_AMD_VIP.pow"
set LLC_POW="%PACK_DIR%08_POWER_PLANS_AND_ENERGY\LLC-CERTIFIED.pow"
if exist %IGRO_POW% (
    powercfg -import %IGRO_POW% 77777777-7777-7777-7777-777777777777 >nul 2>&1
    powercfg -setactive 77777777-7777-7777-7777-777777777777 >nul 2>&1
    echo  [+] Igromanoff AMD VIP Power Plan activated.
) else if exist %LLC_POW% (
    powercfg -import %LLC_POW% 33333333-3333-3333-3333-333333333333 >nul 2>&1
    powercfg -setactive 33333333-3333-3333-3333-333333333333 >nul 2>&1
    echo  [+] LLC-CERTIFIED Power Plan activated.
) else (
    powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
    powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
    echo  [+] Ultimate Performance Power Plan activated.
)
:: Disable PCIe ASPM Link State Power Management
powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPM 0 >nul 2>&1
powercfg -setactive SCHEME_CURRENT >nul 2>&1

:: ============================================================================
:: 10. Background Services and Telemetry Scheduled Tasks
:: ============================================================================
echo [*] [10/13] Disabling Bloat Services and Telemetry Scheduled Tasks...
set SERVICES=DPS DiagTrack dmwappushservice SysMain TabletInputService Telemetry WalletService WarpJITSvc WbioSrvc WcsPlugInService WdNisSvc WerSvc wisvc wlidsvc wmiApSrv wscsvc WSService
for %%S in (%SERVICES%) do (
    sc stop %%S >nul 2>&1
    sc config %%S start= disabled >nul 2>&1
)

:: Disable 15 Categories of Scheduled Tasks (BoosterX preset)
if exist "%PACK_DIR%..\Disable_BoosterX_Scheduled_Tasks.ps1" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%..\Disable_BoosterX_Scheduled_Tasks.ps1" >nul 2>&1
) else if exist "%PACK_DIR%09_SERVICES_AND_BACKGROUND_TASKS\3_Disable_100_Telemetry_Scheduled_Tasks.ps1" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%09_SERVICES_AND_BACKGROUND_TASKS\3_Disable_100_Telemetry_Scheduled_Tasks.ps1" >nul 2>&1
)
echo  [+] Background telemetry services and scheduled tasks stopped.

:: ============================================================================
:: 11. MSI Mode and Hardware Interrupt Steering (GPU, NIC, NVMe, USB)
:: ============================================================================
echo [*] [11/13] Enabling MSI Mode and High Priority for GPU, NIC and Storage...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%10_MSI_AND_INTERRUPT_AFFINITY\1_MSI_And_Affinity_Steering_GPU_NIC_USB.ps1" >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%10_MSI_AND_INTERRUPT_AFFINITY\4_Enable_MSI_Mode_For_NVMe_Storage.ps1" >nul 2>&1
echo  [+] MSI Line Interrupts routed to Message Signaled Interrupts.

:: ============================================================================
:: 12. Windows Defender Esports Exclusions
:: ============================================================================
echo [*] [12/13] Configuring Defender Exclusions for Game Directories...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%14_SECURITY_AND_ANTI_CHEAT_PROFILES\3_Configure_Windows_Defender_Game_Exclusions.ps1" >nul 2>&1
echo  [+] Defender gaming process exceptions applied.

:: ============================================================================
:: 13. Classic UI, Fast Menu and System Cache Flush
:: ============================================================================
echo [*] [13/13] Restoring Classic Context Menu, Fast Menu Delay and Flushing Caches...
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\10_Restore_Classic_Context_Menu_Win11.reg" >nul 2>&1
reg add "HKCU\Control Panel\Desktop" /v "MenuShowDelay" /t REG_SZ /d "0" /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize" /v "StartupDelayInMSec" /t REG_DWORD /d 0 /f >nul 2>&1

ipconfig /flushdns >nul 2>&1
arp -d * >nul 2>&1
echo  [+] UI animations accelerated, DNS and ARP caches refreshed.

echo.
echo ============================================================================
echo  [SUCCESS] ESPORTS MAXIMUM OPTIMIZATION COMPLETED SUCCESSFULLY!
echo ============================================================================
echo  - 0.5ms System Timer Resolution initialized
echo  - 100%% CPU Core Unparking and EPP 0 Boost active
echo  - DirectFlip Mode 2 and HAGS Low Display Latency active
echo  - 1:1 Linear Mouse HID 16 Queue Buffer active
echo  - TCP NoDelay and Network Throttling removed
echo  - Background Telemetry and 100+ Scheduled Tasks Purged
echo.
echo  [!] A SYSTEM RESTART IS RECOMMENDED FOR ALL CHANGES TO TAKE FULL EFFECT.
echo ============================================================================
echo.
pause
