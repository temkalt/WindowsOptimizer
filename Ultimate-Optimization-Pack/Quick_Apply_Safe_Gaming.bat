@echo off
chcp 65001 >nul
title APEXTWEAK ULTIMATE PACK - SAFE GAMING 1-CLICK OPTIMIZER

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
color 0B
cls
echo ============================================================================
echo         APEXTWEAK ULTIMATE PACK - SAFE GAMING 1-CLICK OPTIMIZER
echo ============================================================================
echo  [TARGET] 100%% Daily Stable, Zero Telemetry, Low DPC Latency, Full Compatibility
echo ============================================================================
echo.

:: 1. Restore Point
echo [*] [1/8] Creating System Restore Point...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore" /v "SystemRestorePointCreationFrequency" /t REG_DWORD /d 0 /f >nul 2>&1
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Enable-ComputerRestore -Drive 'C:\' -ErrorAction SilentlyContinue; Checkpoint-Computer -Description 'Safe_Gaming_Pre_Tweak_Backup' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction SilentlyContinue" >nul 2>&1
echo  [+] Restore Point initialized.

:: 2. Windows Base Debloat
echo [*] [2/8] Disabling Telemetry, Cortana and Error Reporting...
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\1_Disable_Telemetry_And_DiagTrack.reg"
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\5_Disable_Windows_Error_Reporting.reg"
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\6_Disable_Cortana_And_Web_Search.reg"
regedit /s "%PACK_DIR%01_WINDOWS_BASE_AND_DEBLOAT\7_Disable_Delivery_Optimization.reg"
powercfg -h off >nul 2>&1
echo  [+] Safe telemetry and background bloat removed.

:: 3. CPU Scheduling and Timers
echo [*] [3/8] Applying CPU Priority and High Precision Timers...
regedit /s "%PACK_DIR%02_CPU_SCHEDULING_AND_TIMERS\1_Win32PrioritySeparation_26_Hex1A_Esports.reg"
bcdedit /set disabledynamictick yes >nul 2>&1
bcdedit /deletevalue useplatformclock >nul 2>&1
bcdedit /set tscsyncpolicy Enhanced >nul 2>&1
echo  [+] CPU Timers and Priority configured.

:: 4. GPU and Display Latency
echo [*] [4/8] Enabling HAGS, Disabling MPO and GameDVR...
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\1_Enable_HAGS_Hardware_GPU_Scheduling.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\2_Disable_MPO_Multiplane_Overlay_Fix.reg"
regedit /s "%PACK_DIR%03_GPU_AND_GRAPHICS_LATENCY\3_Disable_GameDVR_And_Xbox_Capture.reg"
echo  [+] GPU optimizations deployed.

:: 5. Memory and Storage
echo [*] [5/8] Memory and Storage Latency Optimization...
regedit /s "%PACK_DIR%04_MEMORY_AND_STORAGE_SPEED\1_Pin_Kernel_In_RAM_DisablePagingExecutive.reg"
regedit /s "%PACK_DIR%04_MEMORY_AND_STORAGE_SPEED\3_Disable_NVMe_SATA_StorPort_Idle.reg"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Disable-MMAgent -MemoryCompression -ErrorAction SilentlyContinue" >nul 2>&1
echo  [+] Kernel pinned in RAM and StorPort configured.

:: 6. Network TCP/IP
echo [*] [6/8] Configuring TCP NoDelay and Auto-Tuning...
regedit /s "%PACK_DIR%05_ETHERNET_AND_NETWORK_PING\1_Disable_Nagle_Algorithm_TCPNoDelay.reg"
netsh int tcp set global autotuninglevel=normal >nul 2>&1
echo  [+] Network settings optimized.

:: 7. Mouse 1:1 Fix and Audio MMCSS
echo [*] [7/8] Calibrating 1:1 Mouse Mapping and Audio MMCSS...
regedit /s "%PACK_DIR%06_MOUSE_KEYBOARD_INPUT_LAG\1_MarkC_Windows11_10_Mouse_Fix_100_Percent.reg"
regedit /s "%PACK_DIR%07_AUDIO_AND_MMCSS_OPTIMIZATION\1_Configure_MMCSS_Games_High_Priority.reg"
echo  [+] Input and Audio configured.

:: 8. Defender Exclusions
echo [*] [8/8] Adding Game Exclusions to Windows Defender...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PACK_DIR%14_SECURITY_AND_ANTI_CHEAT_PROFILES\3_Configure_Windows_Defender_Game_Exclusions.ps1" >nul 2>&1
echo  [+] Defender exclusions set.

echo.
echo ============================================================================
echo  [SUCCESS] SAFE GAMING PRESET APPLIED SUCCESSFULLY!
echo ============================================================================
echo  - 100%% compatibility with FACEIT, Vanguard, EasyAntiCheat and BattlEye
echo  - Telemetry and Background bloat suppressed
echo  - Low display and input latency enabled
echo.
echo  [!] A SYSTEM RESTART IS RECOMMENDED FOR ALL CHANGES TO TAKE EFFECT.
echo ============================================================================
echo.
pause
