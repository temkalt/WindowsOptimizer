import type { HardwareBuildPreset } from '../types';

export const HARDWARE_PRESETS: HardwareBuildPreset[] = [
  {
    id: 'am5-9800x3d-rtx5070',
    name: 'AMD Ryzen 7 9800X3D + NVIDIA RTX 5070 (ASRock B650M Pro RS & ADATA 6200)',
    category: 'AMD_AM5',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'AMD Ryzen 7 9800X3D (8C/16T, 2nd Gen 3D V-Cache)',
    gpu: 'NVIDIA GeForce RTX 5070 12GB GDDR7',
    ramSpec: '32GB DDR5 6200MHz (ADATA XPG AX5U6400C3216G-BLABK 2x16GB)',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (AM5 9800X3D Tuned)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid +exec autoexec.cfg',
      biosKeyTweaks: [
        'PBO: Advanced -> Curve Optimizer: -25 all cores',
        'EXPO I: DDR5 6000 FCLK 2000 UCLK=MCLK 1:1',
        'CPPC Preferred Cores: Driver / Cache Priority',
        'Global C-State Control: Disabled (Low Syscall Latency)',
        'Above 4G Decoding: Enabled, Resizable BAR: Enabled',
        'SVM Virtualization: Disabled (Unless FACEIT VBS required)'
      ],
      fpsEstimateCs2: { avg: 620, p1Low: 440 }
    }
  },
  {
    id: 'am5-9800x3d-rtx5080',
    name: 'AMD Ryzen 7 9800X3D + NVIDIA RTX 5080 (Ultra Tier)',
    category: 'AMD_AM5',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'AMD Ryzen 7 9800X3D',
    gpu: 'NVIDIA GeForce RTX 5080 16GB GDDR7',
    ramSpec: '32GB/64GB DDR5 6400MHz CL30 EXPO',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (AM5 X3D)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO Curve Optimizer -28', 'EXPO 6400 FCLK 2133', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 680, p1Low: 490 }
    }
  },
  {
    id: 'am5-9800x3d-rtx5090',
    name: 'AMD Ryzen 7 9800X3D + NVIDIA RTX 5090 (God-Tier Esports Setup)',
    category: 'AMD_AM5',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'AMD Ryzen 7 9800X3D',
    gpu: 'NVIDIA GeForce RTX 5090 32GB GDDR7',
    ramSpec: '64GB DDR5 6400MHz CL28 EXPO',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (AM5 X3D)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 8,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO Curve Optimizer -30', 'EXPO 6400 CL28', 'DirectFlip Mode 2'],
      fpsEstimateCs2: { avg: 740, p1Low: 530 }
    }
  },
  {
    id: 'am5-7800x3d-rtx4070',
    name: 'AMD Ryzen 7 7800X3D + NVIDIA RTX 4070 / 4070 Super',
    category: 'AMD_AM5',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'AMD Ryzen 7 7800X3D (8C/16T 3D V-Cache)',
    gpu: 'NVIDIA GeForce RTX 4070 / 4070S 12GB',
    ramSpec: '32GB DDR5 6000MHz CL30',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (AM5 X3D)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['Curve Optimizer -25', 'EXPO 6000 CL30', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 540, p1Low: 385 }
    }
  },
  {
    id: 'am5-7800x3d-rtx4080',
    name: 'AMD Ryzen 7 7800X3D + NVIDIA RTX 4080 / 4080 Super',
    category: 'AMD_AM5',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'AMD Ryzen 7 7800X3D',
    gpu: 'NVIDIA GeForce RTX 4080 / 4080 Super 16GB',
    ramSpec: '32GB DDR5 6000MHz CL30',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (AM5 X3D)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['Curve Optimizer -25', 'ReBAR Enabled', 'Above 4G Decoding'],
      fpsEstimateCs2: { avg: 610, p1Low: 430 }
    }
  },
  {
    id: 'am5-7800x3d-rtx4090',
    name: 'AMD Ryzen 7 7800X3D + NVIDIA RTX 4090 24GB',
    category: 'AMD_AM5',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'AMD Ryzen 7 7800X3D',
    gpu: 'NVIDIA GeForce RTX 4090 24GB',
    ramSpec: '32GB DDR5 6000MHz CL30 EXPO',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (AM5 X3D)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['Curve Optimizer -30', 'EXPO 6000 CL28', 'DWM Flush ON'],
      fpsEstimateCs2: { avg: 670, p1Low: 475 }
    }
  },
  {
    id: 'am5-7500f-rtx4060',
    name: 'AMD Ryzen 5 7500F + NVIDIA RTX 4060 / 4060 Ti (Budget Esports)',
    category: 'AMD_AM5',
    tier: 'BUDGET_COMPETITIVE',
    cpu: 'AMD Ryzen 5 7500F (6C/12T)',
    gpu: 'NVIDIA GeForce RTX 4060 8GB',
    ramSpec: '32GB DDR5 6000MHz CL36',
    tuning: {
      powerPlanName: 'Igromanoff AMD (AM4/AM5 Standard)',
      powerPlanId: 'igromanoff_amd_standard',
      cpuAffinityMaskHex: '0x000000000000003F',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO +200MHz', 'Curve Optimizer -20', 'EXPO 6000 CL36'],
      fpsEstimateCs2: { avg: 360, p1Low: 240 }
    }
  },
  {
    id: 'am5-7600x-rtx4070',
    name: 'AMD Ryzen 5 7600X + NVIDIA RTX 4070',
    category: 'AMD_AM5',
    tier: 'MID_RANGE',
    cpu: 'AMD Ryzen 5 7600X (6C/12T)',
    gpu: 'NVIDIA GeForce RTX 4070 12GB',
    ramSpec: '32GB DDR5 6000MHz CL32',
    tuning: {
      powerPlanName: 'Igromanoff AMD (AM4/AM5 Standard)',
      powerPlanId: 'igromanoff_amd_standard',
      cpuAffinityMaskHex: '0x000000000000003F',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0',
      biosKeyTweaks: ['Curve Optimizer -20', 'EXPO 6000 CL32'],
      fpsEstimateCs2: { avg: 430, p1Low: 290 }
    }
  },
  {
    id: 'am5-7700x-rtx4070ti',
    name: 'AMD Ryzen 7 7700X + NVIDIA RTX 4070 Ti / Super',
    category: 'AMD_AM5',
    tier: 'HIGH_END',
    cpu: 'AMD Ryzen 7 7700X (8C/16T)',
    gpu: 'NVIDIA GeForce RTX 4070 Ti 12GB / 16GB',
    ramSpec: '32GB DDR5 6000MHz CL30',
    tuning: {
      powerPlanName: 'Igromanoff AMD (AM4/AM5 Standard)',
      powerPlanId: 'igromanoff_amd_standard',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0',
      biosKeyTweaks: ['Curve Optimizer -25', 'EXPO 6000'],
      fpsEstimateCs2: { avg: 490, p1Low: 340 }
    }
  },
  {
    id: 'am4-5700x3d-rtx4060',
    name: 'AMD Ryzen 7 5700X3D + NVIDIA RTX 4060 / 4060 Ti',
    category: 'AMD_AM4',
    tier: 'MID_RANGE',
    cpu: 'AMD Ryzen 7 5700X3D (8C/16T 3D V-Cache)',
    gpu: 'NVIDIA GeForce RTX 4060 Ti 8GB/16GB',
    ramSpec: '32GB DDR4 3600MHz CL16',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (AM4 X3D)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO2 Tuner: -30 all cores', 'DOCP/XMP 3600MHz FCLK 1800 1:1', 'Global C-State: Disabled'],
      fpsEstimateCs2: { avg: 410, p1Low: 285 }
    }
  },
  {
    id: 'am4-5800x3d-rtx4070',
    name: 'AMD Ryzen 7 5800X3D + NVIDIA RTX 4070 / 4070 Super',
    category: 'AMD_AM4',
    tier: 'HIGH_END',
    cpu: 'AMD Ryzen 7 5800X3D (8C/16T 3D V-Cache)',
    gpu: 'NVIDIA GeForce RTX 4070 12GB',
    ramSpec: '32GB DDR4 3800MHz CL14/16 B-Die',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (AM4 X3D)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['Kombo Strike: 3 / Curve -30', 'XMP DDR4 3800 FCLK 1900', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 460, p1Low: 320 }
    }
  },
  {
    id: 'am4-5600-rtx3060',
    name: 'AMD Ryzen 5 5600 / 5600X + NVIDIA RTX 3060 / 4060',
    category: 'AMD_AM4',
    tier: 'BUDGET_COMPETITIVE',
    cpu: 'AMD Ryzen 5 5600 (6C/12T)',
    gpu: 'NVIDIA GeForce RTX 3060 12GB / RTX 4060',
    ramSpec: '16GB/32GB DDR4 3600MHz CL16/18',
    tuning: {
      powerPlanName: 'Igromanoff AMD (AM4/AM5 Standard)',
      powerPlanId: 'igromanoff_amd_standard',
      cpuAffinityMaskHex: '0x000000000000003F',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO +200MHz', 'Curve Optimizer -25', 'DOCP 3600 FCLK 1800'],
      fpsEstimateCs2: { avg: 310, p1Low: 195 }
    }
  },
  {
    id: 'intel-14900k-rtx4090',
    name: 'Intel Core i9-14900K / 14900KS + NVIDIA RTX 4090 (Intel Flagship)',
    category: 'INTEL_LGA1700',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'Intel Core i9-14900K (8P+16E Cores)',
    gpu: 'NVIDIA GeForce RTX 4090 24GB',
    ramSpec: '32GB/48GB DDR5 7600-8000MHz CL36/38',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V3 (P-Core Lock)',
      powerPlanId: 'igromanoff_intel_v3',
      cpuAffinityMaskHex: '0x000000000000FFFF',
      win32PrioritySeparation: '0x28',
      gpuMsiPriority: 'High',
      nicRssQueues: 8,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['Intel Baseline Profile (PL1=253W PL2=253W)', 'XMP 7600+ with 1.45V VDD', 'E-Cores Parked or Disabled in BIOS for 0ms jitter'],
      fpsEstimateCs2: { avg: 690, p1Low: 470 }
    }
  },
  {
    id: 'intel-14700k-rtx4080',
    name: 'Intel Core i7-14700K / 14700KF + NVIDIA RTX 4080',
    category: 'INTEL_LGA1700',
    tier: 'HIGH_END',
    cpu: 'Intel Core i7-14700K (8P+12E Cores)',
    gpu: 'NVIDIA GeForce RTX 4080 / 4080 Super 16GB',
    ramSpec: '32GB DDR5 7200MHz CL34',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V3 (P-Core Lock)',
      powerPlanId: 'igromanoff_intel_v3',
      cpuAffinityMaskHex: '0x000000000000FFFF',
      win32PrioritySeparation: '0x28',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0',
      biosKeyTweaks: ['PL1=253W PL2=253W', 'XMP 7200', 'LLC Mode 4'],
      fpsEstimateCs2: { avg: 590, p1Low: 410 }
    }
  },
  {
    id: 'intel-13600k-rtx4070',
    name: 'Intel Core i5-13600K / 14600K + NVIDIA RTX 4070',
    category: 'INTEL_LGA1700',
    tier: 'MID_RANGE',
    cpu: 'Intel Core i5-13600K (6P+8E Cores)',
    gpu: 'NVIDIA GeForce RTX 4070 12GB',
    ramSpec: '32GB DDR5 6400MHz / DDR4 3600MHz',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V2 (Balanced Esports)',
      powerPlanId: 'igromanoff_intel_v2',
      cpuAffinityMaskHex: '0x0000000000000FFF',
      win32PrioritySeparation: '0x26',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0',
      biosKeyTweaks: ['P-Core Sync All Cores 5.3GHz', 'XMP Enabled'],
      fpsEstimateCs2: { avg: 470, p1Low: 320 }
    }
  },
  {
    id: 'intel-12400f-rtx3060',
    name: 'Intel Core i5-12400F + NVIDIA RTX 3060 / 4060',
    category: 'INTEL_LGA1700',
    tier: 'BUDGET_COMPETITIVE',
    cpu: 'Intel Core i5-12400F (6P Cores Only)',
    gpu: 'NVIDIA GeForce RTX 3060 12GB',
    ramSpec: '16GB/32GB DDR4 3200-3600MHz CL16',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V1 (Legacy & Non-K)',
      powerPlanId: 'igromanoff_intel_v1',
      cpuAffinityMaskHex: '0x0000000000000FFF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0',
      biosKeyTweaks: ['Power Limits: Max Unlocked', 'Gear 1 Memory Mode'],
      fpsEstimateCs2: { avg: 290, p1Low: 185 }
    }
  },
  {
    id: 'intel-core-ultra-285k-rtx5090',
    name: 'Intel Core Ultra 9 285K + NVIDIA RTX 5090 (Arrow Lake Flagship)',
    category: 'INTEL_LGA1851',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'Intel Core Ultra 9 285K (8P+16E Cores)',
    gpu: 'NVIDIA GeForce RTX 5090 32GB GDDR7',
    ramSpec: '48GB/64GB DDR5 8000-8400MHz CUDIMM',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V3 (P-Core Lock)',
      powerPlanId: 'igromanoff_intel_v3',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x28',
      gpuMsiPriority: 'High',
      nicRssQueues: 8,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['APO (Intel Application Optimization) Enabled', 'XMP 8000 CUDIMM Gear 2', 'Ring Frequency 4.8GHz'],
      fpsEstimateCs2: { avg: 710, p1Low: 495 }
    }
  },
  {
    id: 'intel-10400f-gtx1660s',
    name: 'Intel Core i5-10400F / 10600K + GTX 1660 Super / RTX 2060',
    category: 'INTEL_LGA1200',
    tier: 'BUDGET_COMPETITIVE',
    cpu: 'Intel Core i5-10400F (6C/12T)',
    gpu: 'NVIDIA GeForce GTX 1660 Super 6GB',
    ramSpec: '16GB DDR4 2666-3200MHz',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V1 (Legacy & Non-K)',
      powerPlanId: 'igromanoff_intel_v1',
      cpuAffinityMaskHex: '0x0000000000000FFF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0',
      biosKeyTweaks: ['Power Limit Max', 'XMP Profile 1'],
      fpsEstimateCs2: { avg: 220, p1Low: 140 }
    }
  }
];
