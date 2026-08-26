@echo off
echo [*] Checking System Timer Resolution via PowerShell...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class TimerCheck { [DllImport(\"ntdll.dll\")] public static extern int NtQueryTimerResolution(out uint min, out uint max, out uint current); public static void Check() { uint min, max, cur; NtQueryTimerResolution(out min, out max, out cur); Console.WriteLine(\"[+] Current Timer Resolution: \" + (cur / 10000.0) + \" ms (\" + cur + \" 100ns units)\"); } }'; [TimerCheck]::Check()"
pause
