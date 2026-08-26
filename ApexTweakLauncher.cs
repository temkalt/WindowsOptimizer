using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace ApexTweak
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            try
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                
                // 1. Launch standalone Electron Desktop executable silently in the background
                string electronExe = Path.Combine(baseDir, "ApexTweak-Desktop", "ApexTweak.exe");
                if (File.Exists(electronExe))
                {
                    ProcessStartInfo psi = new ProcessStartInfo();
                    psi.FileName = electronExe;
                    psi.WorkingDirectory = Path.Combine(baseDir, "ApexTweak-Desktop");
                    psi.CreateNoWindow = true;
                    psi.WindowStyle = ProcessWindowStyle.Normal;
                    psi.UseShellExecute = true;
                    Process.Start(psi);
                    return;
                }

                // 2. Fallback to Chromium Desktop Window App Mode (Completely Silent Backend)
                string optimizerDir = Path.Combine(baseDir, "ApexOptimizer");
                if (!Directory.Exists(optimizerDir)) optimizerDir = baseDir;

                string serverScript = Path.Combine(optimizerDir, "server", "engine.js");

                // Start node engine process strictly hidden without any console window
                ProcessStartInfo nodePsi = new ProcessStartInfo();
                nodePsi.FileName = "node.exe";
                nodePsi.Arguments = "\"" + serverScript + "\"";
                nodePsi.WorkingDirectory = optimizerDir;
                nodePsi.WindowStyle = ProcessWindowStyle.Hidden;
                nodePsi.CreateNoWindow = true;
                nodePsi.UseShellExecute = false;

                Process nodeProcess = null;
                try
                {
                    nodeProcess = Process.Start(nodePsi);
                }
                catch {}

                System.Threading.Thread.Sleep(1000);

                string edgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
                if (!File.Exists(edgePath)) edgePath = @"C:\Program Files\Microsoft\Edge\Application\msedge.exe";
                if (!File.Exists(edgePath)) edgePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe";

                if (File.Exists(edgePath))
                {
                    ProcessStartInfo appPsi = new ProcessStartInfo();
                    appPsi.FileName = edgePath;
                    appPsi.Arguments = "--app=http://localhost:5050 --window-size=1280,820 --user-data-dir=\"" + Path.Combine(optimizerDir, ".apextweak_profile") + "\" --disable-extensions --app-id=ApexTweakOptimizer";
                    appPsi.CreateNoWindow = true;
                    appPsi.UseShellExecute = false;
                    Process appProc = Process.Start(appPsi);
                    if (appProc != null)
                    {
                        appProc.WaitForExit();
                        if (nodeProcess != null && !nodeProcess.HasExited)
                        {
                            try { nodeProcess.Kill(); } catch {}
                        }
                    }
                }
                else
                {
                    Process.Start(new ProcessStartInfo("http://localhost:5050") { UseShellExecute = true });
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error launching ApexTweak: " + ex.Message, "ApexTweak", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
