@echo off
title ETW DPC/ISR KERNEL TRACER
echo ============================================================================
echo         RECORDING 30-SECOND DPC/ISR DRIVER TRACE (xperf / WPR)
echo ============================================================================
echo [*] Starting ETW Kernel Session...
xperf -on PROC_THREAD+LOADER+INTERRUPT+DPC -stackwalk DPC+Interrupt -BufferSize 1024 -MinBuffers 128 -MaxBuffers 512
echo [+] Recording in progress... Please play game or move mouse for 30 seconds.
timeout /t 30 /nobreak
echo [*] Stopping and merging kernel trace...
xperf -stop -d "%~dp0DPC_ISR_Trace.etl"
echo [SUCCESS] Trace saved to DPC_ISR_Trace.etl! Open in Windows Performance Analyzer (WPA).
pause
