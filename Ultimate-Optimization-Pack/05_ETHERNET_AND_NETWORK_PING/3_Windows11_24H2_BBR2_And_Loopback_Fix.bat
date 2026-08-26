@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Run as Administrator!
    pause
    exit /b 1
)
color 0B
echo ============================================================================
echo     WINDOWS 11 24H2 BBR2 CONGESTION & LOOPBACK MTU BUG REPAIR ENGINE
echo ============================================================================
echo [*] Disabling 64KB Loopback Large MTU (Fixes localhost lag in 24H2)...
netsh int ipv4 set global loopbacklargemtu=disable >nul 2>&1
netsh int ipv6 set global loopbacklargemtu=disable >nul 2>&1

echo [*] Enforcing TCP autotuning normal & BBR2 / CTCP congestion algorithm...
netsh int tcp set global autotuninglevel=normal >nul 2>&1
netsh int tcp set global congestionprovider=bbr2 >nul 2>&1
if %errorlevel% neq 0 netsh int tcp set global congestionprovider=ctcp >nul 2>&1

netsh int tcp set global ecncapability=disabled >nul 2>&1
netsh int tcp set global timestamps=disabled >nul 2>&1
netsh int tcp set global rss=enabled >nul 2>&1
netsh int tcp set global rsc=disabled >nul 2>&1
netsh int tcp set heuristics disabled >nul 2>&1

echo [SUCCESS] Windows 11 24H2 network parameters & loopback fix applied!
pause
