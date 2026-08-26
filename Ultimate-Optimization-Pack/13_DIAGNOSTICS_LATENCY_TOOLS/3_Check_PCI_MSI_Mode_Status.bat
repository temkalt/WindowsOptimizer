@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Enum\PCI' -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.PSChildName -eq 'MessageSignaledInterruptProperties' } | ForEach-Object { $name = (Get-ItemProperty (Split-Path (Split-Path (Split-Path $_.PSPath))) -ErrorAction SilentlyContinue).DeviceDesc; $msi = (Get-ItemProperty $_.PSPath).MSISupported; [PSCustomObject]@{ Device = $name; MSISupported = $msi } } | Format-Table -AutoSize"
pause
