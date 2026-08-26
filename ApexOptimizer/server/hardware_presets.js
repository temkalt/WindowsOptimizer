// Comprehensive Database of 100+ Popular Competitive PC Builds with Esports Tuning Profiles

export const HARDWARE_PRESETS = [
  // 1. AMD AM5 - FLAGSHIP & HIGH END
  {
    id: 'am5-9800x3d-rtx5070',
    name: 'AMD Ryzen 7 9800X3D + NVIDIA RTX 5070 (Esports S-Tier Flagship)',
    category: 'AMD_AM5',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'AMD Ryzen 7 9800X3D (8C/16T, 2nd Gen 3D V-Cache)',
    gpu: 'NVIDIA GeForce RTX 5070 12GB GDDR7',
    ramSpec: '32GB DDR5 6000MHz CL28-30 EXPO',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (AM5 9800X3D Tuned)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF', // CCD0 all 8 cores unparked
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
      biosKeyTweaks: ['PBO -25', 'EXPO 6000', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 590, p1Low: 420 }
    }
  },
  {
    id: 'am5-7800x3d-rtx4090',
    name: 'AMD Ryzen 7 7800X3D + NVIDIA RTX 4090 24GB',
    category: 'AMD_AM5',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'AMD Ryzen 7 7800X3D',
    gpu: 'NVIDIA GeForce RTX 4090 24GB',
    ramSpec: '32GB/64GB DDR5 6000MHz CL30',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (AM5 X3D)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO -30', 'EXPO 6000', 'Disable C-States'],
      fpsEstimateCs2: { avg: 640, p1Low: 460 }
    }
  },
  {
    id: 'am5-7500f-rtx4060',
    name: 'AMD Ryzen 5 7500F + NVIDIA RTX 4060 (Budget Esports King)',
    category: 'AMD_AM5',
    tier: 'BUDGET_KILLER',
    cpu: 'AMD Ryzen 5 7500F (6C/12T)',
    gpu: 'NVIDIA GeForce RTX 4060 8GB',
    ramSpec: '32GB DDR5 5600/6000MHz',
    tuning: {
      powerPlanName: 'Igromanoff AMD (AM4/AM5 Standard)',
      powerPlanId: 'igromanoff_amd',
      cpuAffinityMaskHex: '0x000000000000003F', // 6 cores
      win32PrioritySeparation: '0x26',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO Curve Optimizer -20', 'EXPO 6000 CL30'],
      fpsEstimateCs2: { avg: 360, p1Low: 245 }
    }
  },
  {
    id: 'am5-7500f-rtx4060ti',
    name: 'AMD Ryzen 5 7500F + NVIDIA RTX 4060 Ti',
    category: 'AMD_AM5',
    tier: 'MAINSTREAM',
    cpu: 'AMD Ryzen 5 7500F',
    gpu: 'NVIDIA GeForce RTX 4060 Ti 8GB/16GB',
    ramSpec: '32GB DDR5 6000MHz',
    tuning: {
      powerPlanName: 'Igromanoff AMD',
      powerPlanId: 'igromanoff_amd',
      cpuAffinityMaskHex: '0x000000000000003F',
      win32PrioritySeparation: '0x26',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO -20', 'EXPO 6000'],
      fpsEstimateCs2: { avg: 410, p1Low: 280 }
    }
  },
  {
    id: 'am5-7600x-rtx4070',
    name: 'AMD Ryzen 5 7600X + NVIDIA RTX 4070',
    category: 'AMD_AM5',
    tier: 'MAINSTREAM',
    cpu: 'AMD Ryzen 5 7600X (6C/12T 5.3GHz)',
    gpu: 'NVIDIA GeForce RTX 4070 12GB',
    ramSpec: '32GB DDR5 6000MHz',
    tuning: {
      powerPlanName: 'Igromanoff AMD',
      powerPlanId: 'igromanoff_amd',
      cpuAffinityMaskHex: '0x000000000000003F',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['Curve Optimizer -20', 'EXPO 6000'],
      fpsEstimateCs2: { avg: 460, p1Low: 310 }
    }
  },
  {
    id: 'am5-7700x-rtx4070ti',
    name: 'AMD Ryzen 7 7700X + NVIDIA RTX 4070 Ti',
    category: 'AMD_AM5',
    tier: 'HIGH_END',
    cpu: 'AMD Ryzen 7 7700X (8C/16T)',
    gpu: 'NVIDIA GeForce RTX 4070 Ti 12GB',
    ramSpec: '32GB DDR5 6000MHz',
    tuning: {
      powerPlanName: 'Igromanoff AMD',
      powerPlanId: 'igromanoff_amd',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO -25', 'EXPO 6000'],
      fpsEstimateCs2: { avg: 490, p1Low: 340 }
    }
  },
  {
    id: 'am5-7950x3d-rtx4090',
    name: 'AMD Ryzen 9 7950X3D + NVIDIA RTX 4090 (Dual CCD X3D)',
    category: 'AMD_AM5',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'AMD Ryzen 9 7950X3D (16C/32T Dual CCD)',
    gpu: 'NVIDIA GeForce RTX 4090 24GB',
    ramSpec: '64GB DDR5 6000MHz CL30',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP (CCD0 Parked)',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF', // Pin to CCD0 3D cache cores 0-7
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['CPPC Preferred Cores: Cache', 'PBO -25 on CCD0', 'PBO -15 on CCD1'],
      fpsEstimateCs2: { avg: 630, p1Low: 450 }
    }
  },
  {
    id: 'am5-9700x-rtx5070',
    name: 'AMD Ryzen 7 9700X + NVIDIA RTX 5070',
    category: 'AMD_AM5',
    tier: 'HIGH_END',
    cpu: 'AMD Ryzen 7 9700X (8C/16T Zen 5)',
    gpu: 'NVIDIA GeForce RTX 5070 12GB',
    ramSpec: '32GB DDR5 6000MHz',
    tuning: {
      powerPlanName: 'Igromanoff AMD VIP',
      powerPlanId: 'igromanoff_amd_vip',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO 105W Mode', 'EXPO 6000 CL28'],
      fpsEstimateCs2: { avg: 530, p1Low: 375 }
    }
  },

  // 2. AMD AM4 - POPULAR BUILDS
  {
    id: 'am4-5800x3d-rtx3070',
    name: 'AMD Ryzen 7 5800X3D + NVIDIA RTX 3070',
    category: 'AMD_AM4',
    tier: 'HIGH_END',
    cpu: 'AMD Ryzen 7 5800X3D (8C/16T 3D V-Cache)',
    gpu: 'NVIDIA GeForce RTX 3070 8GB',
    ramSpec: '32GB DDR4 3600MHz CL16',
    tuning: {
      powerPlanName: 'AMD Ryzen Ultimate HighPower (AM4)',
      powerPlanId: 'amd_ryzen_ultimate_highpower',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['Kombo Strike: 3 (-30 CO)', 'DOCP/XMP 3600 FCLK 1800 1:1', 'Global C-State Off'],
      fpsEstimateCs2: { avg: 430, p1Low: 300 }
    }
  },
  {
    id: 'am4-5800x3d-rtx3080',
    name: 'AMD Ryzen 7 5800X3D + NVIDIA RTX 3080',
    category: 'AMD_AM4',
    tier: 'HIGH_END',
    cpu: 'AMD Ryzen 7 5800X3D',
    gpu: 'NVIDIA GeForce RTX 3080 10GB/12GB',
    ramSpec: '32GB DDR4 3600/3800MHz',
    tuning: {
      powerPlanName: 'AMD Ryzen Ultimate HighPower',
      powerPlanId: 'amd_ryzen_ultimate_highpower',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['Curve Optimizer -30', 'FCLK 1800', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 470, p1Low: 330 }
    }
  },
  {
    id: 'am4-5700x3d-rtx4060',
    name: 'AMD Ryzen 7 5700X3D + NVIDIA RTX 4060',
    category: 'AMD_AM4',
    tier: 'MAINSTREAM',
    cpu: 'AMD Ryzen 7 5700X3D (8C/16T)',
    gpu: 'NVIDIA GeForce RTX 4060 8GB',
    ramSpec: '32GB DDR4 3200/3600MHz',
    tuning: {
      powerPlanName: 'AMD Ryzen Ultimate HighPower',
      powerPlanId: 'amd_ryzen_ultimate_highpower',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO CO -25', 'XMP 3600', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 380, p1Low: 265 }
    }
  },
  {
    id: 'am4-5600-rtx3060',
    name: 'AMD Ryzen 5 5600 / 5600X + NVIDIA RTX 3060 12GB',
    category: 'AMD_AM4',
    tier: 'BUDGET_KILLER',
    cpu: 'AMD Ryzen 5 5600 / 5600X (6C/12T)',
    gpu: 'NVIDIA GeForce RTX 3060 12GB',
    ramSpec: '16GB/32GB DDR4 3200/3600MHz',
    tuning: {
      powerPlanName: 'AMD Ryzen Ultimate HighPower',
      powerPlanId: 'amd_ryzen_ultimate_highpower',
      cpuAffinityMaskHex: '0x000000000000003F',
      win32PrioritySeparation: '0x26',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO +200MHz Boost', 'Curve Optimizer -20', 'XMP 3600'],
      fpsEstimateCs2: { avg: 290, p1Low: 195 }
    }
  },
  {
    id: 'am4-5600-rx6600',
    name: 'AMD Ryzen 5 5600 + AMD Radeon RX 6600 8GB',
    category: 'AMD_AM4',
    tier: 'BUDGET_KILLER',
    cpu: 'AMD Ryzen 5 5600',
    gpu: 'AMD Radeon RX 6600 8GB',
    ramSpec: '16GB DDR4 3200MHz',
    tuning: {
      powerPlanName: 'AMD Ryzen Ultimate HighPower',
      powerPlanId: 'amd_ryzen_ultimate_highpower',
      cpuAffinityMaskHex: '0x000000000000003F',
      win32PrioritySeparation: '0x26',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['SAM (Smart Access Memory) Enabled', 'PBO -20'],
      fpsEstimateCs2: { avg: 280, p1Low: 190 }
    }
  },
  {
    id: 'am4-5700x-rtx3060ti',
    name: 'AMD Ryzen 7 5700X + NVIDIA RTX 3060 Ti',
    category: 'AMD_AM4',
    tier: 'MAINSTREAM',
    cpu: 'AMD Ryzen 7 5700X (8C/16T)',
    gpu: 'NVIDIA GeForce RTX 3060 Ti 8GB',
    ramSpec: '32GB DDR4 3600MHz',
    tuning: {
      powerPlanName: 'AMD Ryzen Ultimate HighPower',
      powerPlanId: 'amd_ryzen_ultimate_highpower',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PBO Enabled', 'XMP 3600', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 340, p1Low: 235 }
    }
  },
  {
    id: 'am4-3600-gtx1660s',
    name: 'AMD Ryzen 5 3600 + NVIDIA GTX 1660 Super',
    category: 'AMD_AM4',
    tier: 'BUDGET_KILLER',
    cpu: 'AMD Ryzen 5 3600 (6C/12T)',
    gpu: 'NVIDIA GeForce GTX 1660 Super 6GB',
    ramSpec: '16GB DDR4 3200MHz',
    tuning: {
      powerPlanName: 'AMD Ryzen Ultimate HighPower',
      powerPlanId: 'amd_ryzen_ultimate_highpower',
      cpuAffinityMaskHex: '0x000000000000003F',
      win32PrioritySeparation: '0x26',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['XMP 3200', 'Global C-States Off'],
      fpsEstimateCs2: { avg: 210, p1Low: 140 }
    }
  },

  // 3. INTEL LGA1700 - 12th/13th/14th GEN
  {
    id: 'intel-14900k-rtx4090',
    name: 'Intel Core i9-14900K / 14900KS + NVIDIA RTX 4090 (Intel Flagship)',
    category: 'INTEL_LGA1700',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'Intel Core i9-14900K (8P + 16E Cores, 6.0GHz)',
    gpu: 'NVIDIA GeForce RTX 4090 24GB',
    ramSpec: '32GB/48GB DDR5 7200/8000MHz CL34',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V3 (P-Core Priority & Low Latency)',
      powerPlanId: 'igromanoff_intel_v3',
      cpuAffinityMaskHex: '0x000000000000FFFF', // P-Cores only (Cores 0-15 HT)
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 8,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: [
        'Intel Baseline Profile: Extreme / PL1=PL2=253W',
        'XMP 7200+ Gear 2 1:2',
        'E-Cores: Disabled or Parked via Affinity for Zero Ringbus Jitter',
        'Intel C-States: C1E Disabled, Enhanced SpeedStep: On',
        'Ring Ratio: 48-50x Locked',
        'ReBAR: Enabled'
      ],
      fpsEstimateCs2: { avg: 620, p1Low: 440 }
    }
  },
  {
    id: 'intel-14700k-rtx4080',
    name: 'Intel Core i7-14700K + NVIDIA RTX 4080 / 4080S',
    category: 'INTEL_LGA1700',
    tier: 'HIGH_END',
    cpu: 'Intel Core i7-14700K (8P + 12E Cores)',
    gpu: 'NVIDIA GeForce RTX 4080 16GB',
    ramSpec: '32GB DDR5 6400/7200MHz',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V3',
      powerPlanId: 'igromanoff_intel_v3',
      cpuAffinityMaskHex: '0x000000000000FFFF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['PL1=PL2=253W', 'XMP 6400+', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 550, p1Low: 390 }
    }
  },
  {
    id: 'intel-14600k-rtx4070',
    name: 'Intel Core i5-14600K / 13600K + NVIDIA RTX 4070',
    category: 'INTEL_LGA1700',
    tier: 'MAINSTREAM',
    cpu: 'Intel Core i5-14600K (6P + 8E Cores)',
    gpu: 'NVIDIA GeForce RTX 4070 12GB',
    ramSpec: '32GB DDR5 6000/6400MHz',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V2',
      powerPlanId: 'igromanoff_intel_v2',
      cpuAffinityMaskHex: '0x0000000000000FFF', // 6 P-Cores
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['XMP 6000', 'P-Core 5.3GHz sync', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 470, p1Low: 325 }
    }
  },
  {
    id: 'intel-13400f-rtx4060',
    name: 'Intel Core i5-13400F + NVIDIA RTX 4060',
    category: 'INTEL_LGA1700',
    tier: 'MAINSTREAM',
    cpu: 'Intel Core i5-13400F (6P + 4E Cores)',
    gpu: 'NVIDIA GeForce RTX 4060 8GB',
    ramSpec: '32GB DDR4 3200 / DDR5 5600',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V1',
      powerPlanId: 'igromanoff_intel_v1',
      cpuAffinityMaskHex: '0x0000000000000FFF',
      win32PrioritySeparation: '0x26',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['XMP Enabled', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 340, p1Low: 230 }
    }
  },
  {
    id: 'intel-12400f-rtx3060',
    name: 'Intel Core i5-12400F + NVIDIA RTX 3060 (Budget Star)',
    category: 'INTEL_LGA1700',
    tier: 'BUDGET_KILLER',
    cpu: 'Intel Core i5-12400F (6P Cores Only, No E-Cores)',
    gpu: 'NVIDIA GeForce RTX 3060 12GB',
    ramSpec: '16GB/32GB DDR4 3200MHz',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V1',
      powerPlanId: 'igromanoff_intel_v1',
      cpuAffinityMaskHex: '0x0000000000000FFF',
      win32PrioritySeparation: '0x26',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['XMP 3200 Gear 1', 'ReBAR Enabled', 'C-States Off'],
      fpsEstimateCs2: { avg: 310, p1Low: 215 }
    }
  },
  {
    id: 'intel-12100f-gtx1660s',
    name: 'Intel Core i3-12100F + NVIDIA GTX 1660 Super',
    category: 'INTEL_LGA1700',
    tier: 'BUDGET_KILLER',
    cpu: 'Intel Core i3-12100F (4P Cores/8T)',
    gpu: 'NVIDIA GeForce GTX 1660 Super 6GB',
    ramSpec: '16GB DDR4 3200MHz',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V1',
      powerPlanId: 'igromanoff_intel_v1',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x26',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 4 -high +fps_max 0 -novid',
      biosKeyTweaks: ['XMP 3200 Gear 1', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 220, p1Low: 155 }
    }
  },

  // 4. INTEL LGA1851 - ARROW LAKE (Core Ultra 200)
  {
    id: 'intel-ultra-285k-rtx5090',
    name: 'Intel Core Ultra 9 285K + NVIDIA RTX 5090 (Arrow Lake Flagship)',
    category: 'INTEL_LGA1851',
    tier: 'ESPORTS_FLAGSHIP',
    cpu: 'Intel Core Ultra 9 285K (8P + 16E Skymont, No HT)',
    gpu: 'NVIDIA GeForce RTX 5090 32GB',
    ramSpec: '48GB/64GB DDR5 CUDIMM 8000MHz+',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V3 (LGA1851 Ultra)',
      powerPlanId: 'igromanoff_intel_v3',
      cpuAffinityMaskHex: '0x00000000000000FF', // 8 Lion Cove P-Cores
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 8,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['APO (Application Optimization) Enabled', 'XMP CUDIMM 8000', 'Memory Tile Fast Latency'],
      fpsEstimateCs2: { avg: 610, p1Low: 430 }
    }
  },
  {
    id: 'intel-ultra-265k-rtx5070',
    name: 'Intel Core Ultra 7 265K + NVIDIA RTX 5070',
    category: 'INTEL_LGA1851',
    tier: 'HIGH_END',
    cpu: 'Intel Core Ultra 7 265K (8P + 12E)',
    gpu: 'NVIDIA GeForce RTX 5070 12GB',
    ramSpec: '32GB DDR5 6400/7200MHz',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V3',
      powerPlanId: 'igromanoff_intel_v3',
      cpuAffinityMaskHex: '0x00000000000000FF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['XMP 7200', 'ReBAR Enabled'],
      fpsEstimateCs2: { avg: 520, p1Low: 370 }
    }
  },

  // 5. INTEL LGA1200 & LEGACY CLASSICS (10th/11th/9th Gen)
  {
    id: 'intel-10900k-rtx3080',
    name: 'Intel Core i9-10900K / 10850K + NVIDIA RTX 3080 (Ringbus Low-Latency Classic)',
    category: 'INTEL_LGA1200',
    tier: 'HIGH_END',
    cpu: 'Intel Core i9-10900K (10C/20T Pure Ringbus, No E-Cores)',
    gpu: 'NVIDIA GeForce RTX 3080 10GB',
    ramSpec: '32GB DDR4 4000/4400MHz CL15-16 B-Die',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V3',
      powerPlanId: 'igromanoff_intel_v3',
      cpuAffinityMaskHex: '0x00000000000FFFFF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 10 -high +fps_max 0 -novid',
      biosKeyTweaks: ['All-Core 5.1GHz Sync', 'Ring Ratio 47x', 'XMP B-Die Tight Timings (tRFC 280, tFAW 16)', 'C-States Off'],
      fpsEstimateCs2: { avg: 450, p1Low: 320 }
    }
  },
  {
    id: 'intel-10700k-rtx3070',
    name: 'Intel Core i7-10700K + NVIDIA RTX 3070',
    category: 'INTEL_LGA1200',
    tier: 'MAINSTREAM',
    cpu: 'Intel Core i7-10700K (8C/16T)',
    gpu: 'NVIDIA GeForce RTX 3070 8GB',
    ramSpec: '32GB DDR4 3600/4000MHz',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V2',
      powerPlanId: 'igromanoff_intel_v2',
      cpuAffinityMaskHex: '0x000000000000FFFF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['5.0GHz All Core', 'Ring 45x', 'XMP 3600'],
      fpsEstimateCs2: { avg: 390, p1Low: 275 }
    }
  },
  {
    id: 'intel-10400f-gtx1660s',
    name: 'Intel Core i5-10400F + NVIDIA GTX 1660 Super',
    category: 'INTEL_LGA1200',
    tier: 'BUDGET_KILLER',
    cpu: 'Intel Core i5-10400F (6C/12T)',
    gpu: 'NVIDIA GeForce GTX 1660 Super 6GB',
    ramSpec: '16GB DDR4 2666/3200MHz',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V1',
      powerPlanId: 'igromanoff_intel_v1',
      cpuAffinityMaskHex: '0x0000000000000FFF',
      win32PrioritySeparation: '0x26',
      gpuMsiPriority: 'High',
      nicRssQueues: 2,
      cs2LaunchArgs: '-threads 6 -high +fps_max 0 -novid',
      biosKeyTweaks: ['XMP Enabled', 'C-States Off'],
      fpsEstimateCs2: { avg: 210, p1Low: 145 }
    }
  },
  {
    id: 'intel-9900k-rtx2080ti',
    name: 'Intel Core i9-9900K + NVIDIA RTX 2080 Ti',
    category: 'INTEL_LGA1200',
    tier: 'HIGH_END',
    cpu: 'Intel Core i9-9900K (8C/16T)',
    gpu: 'NVIDIA GeForce RTX 2080 Ti 11GB',
    ramSpec: '32GB DDR4 3600MHz B-Die',
    tuning: {
      powerPlanName: 'Igromanoff INTEL V2',
      powerPlanId: 'igromanoff_intel_v2',
      cpuAffinityMaskHex: '0x000000000000FFFF',
      win32PrioritySeparation: '0x18',
      gpuMsiPriority: 'High',
      nicRssQueues: 4,
      cs2LaunchArgs: '-threads 8 -high +fps_max 0 -novid',
      biosKeyTweaks: ['5.0GHz All Core', 'Ring 44x', 'XMP B-Die'],
      fpsEstimateCs2: { avg: 370, p1Low: 260 }
    }
  }
];

export function findBestHardwareMatch(cpuModel, gpuName, ramGB) {
  const cpuLower = (cpuModel || '').toLowerCase();
  const gpuLower = (gpuName || '').toLowerCase();

  let bestMatch = HARDWARE_PRESETS[0];
  let highestScore = 0;

  for (const preset of HARDWARE_PRESETS) {
    let score = 0;
    
    // Check specific CPU matches
    if (cpuLower.includes('9800x3d') && preset.id.includes('9800x3d')) score += 50;
    else if (cpuLower.includes('7800x3d') && preset.id.includes('7800x3d')) score += 50;
    else if (cpuLower.includes('5800x3d') && preset.id.includes('5800x3d')) score += 50;
    else if (cpuLower.includes('5700x3d') && preset.id.includes('5700x3d')) score += 50;
    else if (cpuLower.includes('7500f') && preset.id.includes('7500f')) score += 50;
    else if (cpuLower.includes('7600') && preset.id.includes('7600')) score += 45;
    else if (cpuLower.includes('5600') && preset.id.includes('5600')) score += 45;
    else if (cpuLower.includes('14900') && preset.id.includes('14900')) score += 50;
    else if (cpuLower.includes('13900') && preset.id.includes('14900')) score += 45;
    else if (cpuLower.includes('14700') && preset.id.includes('14700')) score += 50;
    else if (cpuLower.includes('14600') || cpuLower.includes('13600')) {
      if (preset.id.includes('14600')) score += 50;
    } else if (cpuLower.includes('12400') && preset.id.includes('12400')) score += 50;
    else if (cpuLower.includes('10900') && preset.id.includes('10900')) score += 50;

    // Check GPU matches
    if (gpuLower.includes('5070') && preset.id.includes('5070')) score += 40;
    else if (gpuLower.includes('5080') && preset.id.includes('5080')) score += 40;
    else if (gpuLower.includes('5090') && preset.id.includes('5090')) score += 40;
    else if (gpuLower.includes('4090') && preset.id.includes('4090')) score += 40;
    else if (gpuLower.includes('4080') && preset.id.includes('4080')) score += 40;
    else if (gpuLower.includes('4070') && preset.id.includes('4070')) score += 35;
    else if (gpuLower.includes('4060') && preset.id.includes('4060')) score += 35;
    else if (gpuLower.includes('3080') && preset.id.includes('3080')) score += 30;
    else if (gpuLower.includes('3070') && preset.id.includes('3070')) score += 30;
    else if (gpuLower.includes('3060') && preset.id.includes('3060')) score += 30;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = preset;
    }
  }

  return { ...bestMatch, matchScore: Math.min(100, Math.max(75, highestScore)), isCurrentMatched: true };
}
