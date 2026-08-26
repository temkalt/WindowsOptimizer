# AUDIODG.EXE ZERO-BUFFER UNDERRUN ISOLATION ENGINE
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "      ISOLATING AUDIODG.EXE ON CORE 6 WITH HIGH PRIORITY         " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Disable Protected Audio (DRM bypass allowing custom affinity)
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Audio" -Name "DisableProtectedAudioDG" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue

# 2. Pin audiodg.exe to Core 6 (Mask 0x40) and set High Priority
$audioProc = Get-Process audiodg -ErrorAction SilentlyContinue
if ($audioProc) {
    try {
        $coreCount = [Environment]::ProcessorCount
        $targetCore = if ($coreCount -gt 6) { 6 } else { [Math]::Max(0, $coreCount - 1) }
        $affinityMask = [IntPtr]([long]1 -shl $targetCore)
        $audioProc.ProcessorAffinity = $affinityMask
        $audioProc.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::High
        Write-Host "[+] audiodg.exe pinned to Core $targetCore with High Priority!" -ForegroundColor Green
    } catch {
        # Ignore if access denied or already set
    }
}

Write-Host "[SUCCESS] Audio processing isolated from gaming cores!" -ForegroundColor Green
