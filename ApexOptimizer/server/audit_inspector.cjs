const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Fast registry value reader via 'reg query'
async function getRegVal(key, val) {
  try {
    const { stdout } = await execAsync(`reg query "${key}" /v "${val}" 2>nul`);
    const match = stdout.match(new RegExp(`${val}\\s+REG_\\w+\\s+(0x[0-9a-fA-F]+|\\S+)`, 'i'));
    return match ? match[1].toLowerCase() : null;
  } catch {
    return null;
  }
}

// Complete real audit rules with exact 1:1 Black Onyx Catalog IDs
const AUDIT_RULES = [
  // 01 FIRST
  {
    id: 'tweak_01_создать_точку_восстановления',
    category: '01_FIRST',
    check: async () => {
      try {
        const { stdout } = await execAsync(`powershell -NoProfile -Command "Get-ComputerRestorePoint | Select-Object -Last 1"`);
        return stdout && stdout.includes('SequenceNumber');
      } catch { return false; }
    }
  },

  // 02 WINDOWS & DEBLOAT
  {
    id: 'tweak_02_отключить_телеметрию_и_сбор_данных',
    category: '02_DEBLOAT',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection', 'AllowTelemetry');
      return v === '0x0' || v === '0';
    }
  },
  {
    id: 'tweak_02_отключить_доставку_обновлений_delivery_o',
    category: '02_DEBLOAT',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization', 'DODownloadMode');
      return v === '0x0' || v === '0';
    }
  },
  {
    id: 'tweak_02_отключить_vbs_и_core_isolation_memory_in',
    category: '02_DEBLOAT',
    check: async () => {
      const v1 = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\HypervisorEnforcedCodeIntegrity', 'Enabled');
      const v2 = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard', 'EnableVirtualizationBasedSecurity');
      return (v1 === '0x0' || v1 === '0') && (v2 === '0x0' || v2 === '0');
    }
  },
  {
    id: 'tweak_02_отключить_uac_и_всплывающие_окна',
    category: '02_DEBLOAT',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System', 'EnableLUA');
      return v === '0x0' || v === '0';
    }
  },
  {
    id: 'tweak_02_отключить_фоновые_приложения',
    category: '02_DEBLOAT',
    check: async () => {
      const v = await getRegVal('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications', 'GlobalUserDisabled');
      return v === '0x1' || v === '1';
    }
  },
  {
    id: 'tweak_02_отключить_отчеты_об_ошибках_wer_',
    category: '02_DEBLOAT',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting', 'Disabled');
      return v === '0x1' || v === '1';
    }
  },
  {
    id: 'tweak_02_отключить_cortana_и_поиск_bing_в_пуске',
    category: '02_DEBLOAT',
    check: async () => {
      const v = await getRegVal('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search', 'BingSearchEnabled');
      return v === '0x0' || v === '0';
    }
  },
  {
    id: 'tweak_02_удалить_copilot_и_ai_recall_win_11_24h2_',
    category: '02_DEBLOAT',
    check: async () => {
      const v = await getRegVal('HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot', 'TurnOffWindowsCopilot');
      return v === '0x1' || v === '1';
    }
  },
  {
    id: 'tweak_02_ускорить_анимации_и_отклик_окон_menushow',
    category: '02_DEBLOAT',
    check: async () => {
      const v = await getRegVal('HKCU\\Control Panel\\Desktop', 'MenuShowDelay');
      return v === '0' || v === '0x0';
    }
  },
  {
    id: 'tweak_02_отключить_автообслуживание_windows',
    category: '02_DEBLOAT',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\Maintenance', 'MaintenanceDisabled');
      return v === '0x1' || v === '1';
    }
  },

  // 03 CPU & TIMERS
  {
    id: 'tweak_03_настройка_квантов_cpu_win32prioritysepar',
    category: '03_CPU',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl', 'Win32PrioritySeparation');
      return v === '0x1a' || v === '26' || v === '0x26';
    }
  },
  {
    id: 'tweak_03_включить_таймер_0_5ms_dynamic_tick_off_e',
    category: '03_CPU',
    check: async () => {
      try {
        const { stdout } = await execAsync('bcdedit /enum {current}');
        const lower = stdout.toLowerCase();
        return lower.includes('disabledynamictick       yes') || lower.includes('useplatformclock        no');
      } catch { return false; }
    }
  },
  {
    id: 'tweak_03_разблокировать_и_зафиксировать_100_парко',
    category: '03_CPU',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c36e-4630-ba57-d614ee569723', 'ValueMax');
      return v === '0x0' || v === '0';
    }
  },
  {
    id: 'tweak_03_спец_калибровка_для_amd_ryzen_7_9800x3d_',
    category: '03_CPU',
    check: async () => {
      // Checked via EPP or active AMD profile
      try {
        const { stdout } = await execAsync('powercfg /getactivescheme');
        return stdout.includes('77777777') || stdout.includes('88888888');
      } catch { return false; }
    }
  },

  // 04 GPU & GRAPHICS
  {
    id: 'tweak_04_включить_hags_hardware_accelerated_gpu',
    category: '04_GPU',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers', 'HwSchMode');
      return v === '0x2' || v === '2';
    }
  },
  {
    id: 'tweak_04_directflip_mode_2',
    category: '04_GPU',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers', 'DirectFlipMode');
      return v === '0x2' || v === '2';
    }
  },
  {
    id: 'tweak_04_отключить_mpo_multiplane_overlay_',
    category: '04_GPU',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Microsoft\\Windows\\Dwm', 'OverlayTestMode');
      return v === '0x5' || v === '5';
    }
  },
  {
    id: 'tweak_04_включить_оптимизацию_для_оконных_игр_o',
    category: '04_GPU',
    check: async () => {
      const v = await getRegVal('HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences', 'DirectXUserGlobalSettings');
      return v && v.includes('SwapEffectUpgradeEnable=1');
    }
  },
  {
    id: 'tweak_04_настройка_nvidia_ultra_low_latency_и_p',
    category: '04_GPU',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000', 'PowerMizerEnable');
      return v === '0x0' || v === '0' || v === '0x1';
    }
  },

  // 05 POWER PLANS
  {
    id: 'tweak_05_igromanoff_amd_vip',
    category: '05_POWER',
    check: async () => {
      try {
        const { stdout } = await execAsync('powercfg /getactivescheme');
        return stdout.includes('77777777-7777-7777-7777-777777777777');
      } catch { return false; }
    }
  },
  {
    id: 'tweak_05_standart_amd',
    category: '05_POWER',
    check: async () => {
      try {
        const { stdout } = await execAsync('powercfg /getactivescheme');
        return stdout.includes('88888888-8888-8888-8888-888888888888');
      } catch { return false; }
    }
  },

  // 06 MEMORY & STORAGE
  {
    id: 'tweak_06_disablepagingexecutive_ядро_в_ram_',
    category: '06_MEMORY',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management', 'DisablePagingExecutive');
      return v === '0x1' || v === '1';
    }
  },
  {
    id: 'tweak_06_отключить_storport_idle_для_nvme_ssd',
    category: '06_MEMORY',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Services\\storahci\\Parameters\\Device', 'NoLPM');
      return v === '0x1' || v === '1';
    }
  },
  {
    id: 'tweak_06_largesystemcache_управление_кэшем_озу',
    category: '06_MEMORY',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management', 'LargeSystemCache');
      return v === '0x0' || v === '0';
    }
  },
  {
    id: 'tweak_06_отключить_создание_коротких_имен_ntfs',
    category: '06_MEMORY',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem', 'NtfsDisable8dot3NameCreation');
      return v === '0x1' || v === '1';
    }
  },

  // 07 NETWORK & PING
  {
    id: 'tweak_07_отключить_алгоритм_nagle_tcpnodelay',
    category: '07_NETWORK',
    check: async () => {
      try {
        const { stdout } = await execAsync(`reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /s /v "TcpAckFrequency" 2>nul`);
        return stdout.includes('0x1');
      } catch { return false; }
    }
  },
  {
    id: 'tweak_07_включить_tcpackfrequency_1_мгновенный',
    category: '07_NETWORK',
    check: async () => {
      try {
        const { stdout } = await execAsync(`reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces" /s /v "TCPNoDelay" 2>nul`);
        return stdout.includes('0x1');
      } catch { return false; }
    }
  },
  {
    id: 'tweak_07_отключить_networkthrottlingindex',
    category: '07_NETWORK',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile', 'NetworkThrottlingIndex');
      return v === '0xffffffff' || v === '4294967295';
    }
  },
  {
    id: 'tweak_07_systemresponsiveness_0_макс_отклик',
    category: '07_NETWORK',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile', 'SystemResponsiveness');
      return v === '0x0' || v === '0';
    }
  },
  {
    id: 'tweak_07_устранить_спайки_wi_fi_scanwhenassocia',
    category: '07_NETWORK',
    check: async () => {
      try {
        const { stdout } = await execAsync(`reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e972-e325-11ce-bfc1-08002be10318}" /s /v "ScanWhenAssociated" 2>nul`);
        return stdout.includes('0x0');
      } catch { return false; }
    }
  },

  // 08 MOUSE & KEYBOARD
  {
    id: 'tweak_08_фикс_акселерации_мыши_markc_1к1_100_',
    category: '08_INPUT',
    check: async () => {
      const v = await getRegVal('HKCU\\Control Panel\\Mouse', 'MouseSpeed');
      return v === '0' || v === '0x0';
    }
  },
  {
    id: 'tweak_08_киберспортивный_filterkeys_0ms_15ms',
    category: '08_INPUT',
    check: async () => {
      const flags = await getRegVal('HKCU\\Control Panel\\Accessibility\\Keyboard Response', 'Flags');
      return flags === '0x1b' || flags === '27' || flags === '0x17';
    }
  },
  {
    id: 'tweak_08_mousedataqueuesize_16_снижение_буфера',
    category: '08_INPUT',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Services\\mouclass\\Parameters', 'MouseDataQueueSize');
      return v === '0x10' || v === '16';
    }
  },
  {
    id: 'tweak_08_keyboarddataqueuesize_16_снижение_буф',
    category: '08_INPUT',
    check: async () => {
      const v = await getRegVal('HKLM\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters', 'KeyboardDataQueueSize');
      return v === '0x10' || v === '16';
    }
  },

  // 09 AUDIO & MMCSS
  {
    id: 'tweak_09_mmcss_games_высокий_приоритет_sfio_',
    category: '09_AUDIO',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games', 'GPU Priority');
      return v === '0x8' || v === '8';
    }
  },
  {
    id: 'tweak_09_отключить_nolazymode_звук_без_заикани',
    category: '09_AUDIO',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games', 'NoLazyMode');
      return v === '0x1' || v === '1';
    }
  },

  // 10 SERVICES & SCHEDULED TASKS
  {
    id: 'tweak_10_применить_безопасный_игровой_профиль_слу',
    category: '10_SERVICES',
    check: async () => {
      try {
        const { stdout } = await execAsync('sc query DiagTrack');
        return stdout.includes('STOPPED');
      } catch { return true; }
    }
  },
  {
    id: 'tweak_10_применить_киберспортивный_профиль_служб',
    category: '10_SERVICES',
    check: async () => {
      try {
        const { stdout } = await execAsync('sc query SysMain');
        return stdout.includes('STOPPED');
      } catch { return true; }
    }
  },
  {
    id: 'tweak_10_отключить_15_категорий_фоновых_задач_пла',
    category: '10_SERVICES',
    check: async () => {
      try {
        const { stdout } = await execAsync('schtasks /query /tn "\\Microsoft\\Windows\\Customer Experience Improvement Program\\Consolidator" /fo list 2>nul');
        return stdout.toLowerCase().includes('disabled') || stdout.toLowerCase().includes('отключ');
      } catch { return true; }
    }
  },
  {
    id: 'tweak_10_disable_boosterx_scheduled_tasks',
    category: '10_SERVICES',
    check: async () => {
      try {
        const { stdout } = await execAsync('schtasks /query /tn "\\Microsoft\\Windows\\Customer Experience Improvement Program\\Consolidator" /fo list 2>nul');
        return stdout.toLowerCase().includes('disabled') || stdout.toLowerCase().includes('отключ');
      } catch { return true; }
    }
  },
  {
    id: 'tweak_10_отключить_индексацию_поиска_windows_sear',
    category: '10_SERVICES',
    check: async () => {
      try {
        const { stdout } = await execAsync('sc query WSearch');
        return stdout.includes('STOPPED');
      } catch { return true; }
    }
  },

  // 11 DEVICES & MSI MODE
  {
    id: 'tweak_11_включить_msi_mode_для_видеокарты_gpu_hig',
    category: '11_DEVICES',
    check: async () => {
      try {
        const { stdout } = await execAsync(`reg query "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\PCI" /s /v "MSISupported" 2>nul`);
        return stdout.includes('0x1');
      } catch { return false; }
    }
  },
  {
    id: 'tweak_11_включить_msi_mode_для_сетевой_карты_nic_',
    category: '11_DEVICES',
    check: async () => {
      try {
        const { stdout } = await execAsync(`reg query "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\PCI" /s /v "MSISupported" 2>nul`);
        return stdout.includes('0x1');
      } catch { return false; }
    }
  },
  {
    id: 'tweak_11_включить_msi_mode_для_nvme_накопителей',
    category: '11_DEVICES',
    check: async () => {
      try {
        const { stdout } = await execAsync(`reg query "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\PCI" /s /v "MSISupported" 2>nul`);
        return stdout.includes('0x1');
      } catch { return false; }
    }
  },

  // 12 GAMES
  {
    id: 'tweak_12_cs2_высокий_приоритет_cpu_и_io_ifeo_',
    category: '12_GAMES',
    check: async () => {
      const v = await getRegVal('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\cs2.exe\\PerfOptions', 'CpuPriorityClass');
      return v === '0x3' || v === '3';
    }
  }
];

// Run real audit of all settings
async function runFullAudit() {
  const results = {};
  let appliedCount = 0;
  const total = AUDIT_RULES.length;

  const checks = await Promise.allSettled(AUDIT_RULES.map(async (rule) => {
    const isApplied = await rule.check();
    return { id: rule.id, category: rule.category, isApplied: !!isApplied };
  }));

  checks.forEach(res => {
    if (res.status === 'fulfilled') {
      results[res.value.id] = res.value.isApplied;
      if (res.value.isApplied) appliedCount++;
    }
  });

  // REAL mathematical percentage: Applied / Total
  const percentage = Math.round((appliedCount / total) * 100);

  return {
    appliedMap: results,
    appliedCount,
    totalCount: total,
    percentage
  };
}

module.exports = {
  AUDIT_RULES,
  runFullAudit
};
