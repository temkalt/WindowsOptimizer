@echo off
set NPI="d:\winvan\LLC Pack\2. Драйверы\2. Видеокарта\Nvidia Profile Inspector\nvidiaProfileInspector.exe"
set NIP="d:\winvan\LLC Pack\2. Драйверы\2. Видеокарта\Nvidia Profile Inspector\LLC-OPTIMIZED-V2.nip"
if not exist %NPI% set NPI="d:\winvan\ApexOptimizer\bin\nvidiaProfileInspector.exe"
if not exist %NIP% set NIP="d:\winvan\ApexOptimizer\bin\LLC-OPTIMIZED-V2.nip"
if exist %NPI% (
    if exist %NIP% (
        %NPI% -silentImport %NIP%
        echo [SUCCESS] NVIDIA driver profile imported!
    )
)
pause
