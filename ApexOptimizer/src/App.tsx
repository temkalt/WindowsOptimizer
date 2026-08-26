import React, { useState, useEffect } from 'react';
import type { SystemInfo, TweakItem } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import type { ViewType } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { GuidedWizardView } from './views/GuidedWizardView';
import { ExpertTweaksView } from './views/ExpertTweaksView';
import { CpuAffinityView } from './views/CpuAffinityView';
import { GameProfilesView } from './views/GameProfilesView';
import { SecurityHubView } from './views/SecurityHubView';
import { BenchmarkView } from './views/BenchmarkView';
import { SnapshotsView } from './views/SnapshotsView';
import { ToolsInstallerView } from './views/ToolsInstallerView';
import { AuditLogView } from './views/AuditLogView';
import { DriverStoreView } from './views/DriverStoreView';
import { BiosAdvisorView } from './views/BiosAdvisorView';
import { HardwareDatabaseView } from './views/HardwareDatabaseView';
import { NvidiaCustomDriverView } from './views/NvidiaCustomDriverView';
import { BlackOnyxApp } from './BlackOnyxApp';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType | 'black_onyx'>('black_onyx');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [tweaks, setTweaks] = useState<TweakItem[]>([]);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isApplyingPreset, setIsApplyingPreset] = useState(false);
  const [isProcessingTweakId, setIsProcessingTweakId] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemInfo();
    fetchTweaks();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const res = await fetch('/api/system/info');
      const data = await res.json();
      setSystemInfo(data);
    } catch {
      setSystemInfo({
        cpu: {
          model: 'AMD Ryzen 7 9800X3D 8-Core Processor',
          logicalCores: 16,
          physicalCores: 8,
          isIntel: false,
          isAmd: true,
          isAmdX3D: true,
          hasHybridArchitecture: false,
        },
        ram: { totalGB: 32, freeGB: 22.4 },
        gpu: { name: 'NVIDIA GeForce RTX 5070', driver: '566.14' },
        os: { platform: 'win32', release: '11 Pro 24H2', arch: 'x64', uptimeHours: '8.4' },
        security: { defenderActive: false, uacEnabled: true, vbsEnabled: true },
        timerResolutionMs: 0.5000,
        estimatedDpcLatencyUs: 14.8,
      });
    }
  };

  const fetchTweaks = async () => {
    try {
      const res = await fetch('/api/tweaks');
      const data = await res.json();
      setTweaks(Array.isArray(data) ? data : []);
    } catch {}
  };

  const handleQuickClean = async () => {
    setIsCleaning(true);
    try {
      await fetch('/api/cleaner/run', { method: 'POST' });
      fetchSystemInfo();
    } catch {}
    finally {
      setTimeout(() => setIsCleaning(false), 600);
    }
  };

  const handleApplyPreset = async (presetId: 'safe' | 'pro' | 'extreme') => {
    setIsApplyingPreset(true);
    try {
      await fetch('/api/presets/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetId }),
      });
      fetchTweaks();
      fetchSystemInfo();
    } catch {}
    finally {
      setIsApplyingPreset(false);
    }
  };

  const handleToggleTweak = async (id: string, currentlyApplied: boolean) => {
    setIsProcessingTweakId(id);
    const endpoint = currentlyApplied ? '/api/tweaks/revert' : '/api/tweaks/apply';
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setTweaks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isApplied: !currentlyApplied } : t))
      );
      fetchSystemInfo();
    } catch {
      setTweaks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isApplied: !currentlyApplied } : t))
      );
    } finally {
      setIsProcessingTweakId(null);
    }
  };

  const handleApplyCustomConfig = async (tweakIds: string[]) => {
    for (const id of tweakIds) {
      try {
        await fetch('/api/tweaks/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
      } catch {}
    }
    fetchTweaks();
    fetchSystemInfo();
  };

  if (currentView === 'black_onyx') {
    return <BlackOnyxApp />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        language={language}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          systemInfo={systemInfo}
          language={language}
          onLanguageChange={setLanguage}
          onQuickClean={handleQuickClean}
          isCleaning={isCleaning}
        />

        {/* View Switcher */}
        <main className="p-6 max-w-6xl mx-auto w-full flex-1">
          {currentView === 'dashboard' && (
            <DashboardView
              systemInfo={systemInfo}
              tweaks={tweaks}
              language={language}
              onApplyPreset={handleApplyPreset}
              onNavigate={setCurrentView}
              isApplyingPreset={isApplyingPreset}
            />
          )}

          {currentView === 'games' && (
            <GameProfilesView
              language={language}
            />
          )}

          {currentView === 'cpu_affinity' && (
            <CpuAffinityView
              systemInfo={systemInfo}
              language={language}
            />
          )}

          {currentView === 'bios_advisor' && (
            <BiosAdvisorView
              language={language}
            />
          )}

          {currentView === 'hardware_db' && (
            <HardwareDatabaseView
              language={language}
            />
          )}

          {currentView === 'nvidia_custom' && (
            <NvidiaCustomDriverView
              language={language}
            />
          )}

          {currentView === 'driver_store' && (
            <DriverStoreView
              language={language}
            />
          )}

          {currentView === 'expert' && (
            <ExpertTweaksView
              tweaks={tweaks}
              language={language}
              onToggleTweak={handleToggleTweak}
              isProcessingId={isProcessingTweakId}
            />
          )}

          {currentView === 'audit' && (
            <AuditLogView
              language={language}
            />
          )}

          {currentView === 'guided' && (
            <GuidedWizardView
              language={language}
              onApplyCustomConfig={handleApplyCustomConfig}
              onFinish={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'security' && (
            <SecurityHubView
              systemInfo={systemInfo}
              language={language}
              onRefreshInfo={fetchSystemInfo}
            />
          )}

          {currentView === 'benchmark' && (
            <BenchmarkView
              language={language}
            />
          )}

          {currentView === 'snapshots' && (
            <SnapshotsView
              language={language}
            />
          )}

          {currentView === 'tools' && (
            <ToolsInstallerView
              language={language}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;

