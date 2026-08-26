export type CategoryType =
  | 'base'
  | 'cpu'
  | 'gpu'
  | 'network'
  | 'hid'
  | 'memory'
  | 'services'
  | 'security'
  | 'kernel_bcd'
  | 'net_adapter'
  | 'driver_store'
  | 'bios_advisor'
  | 'hardware_db'
  | 'nvidia_custom';

export type RiskLevel = 'safe' | 'moderate' | 'extreme';

export interface TweakItem {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  categoryName: string;
  riskLevel: RiskLevel;
  description: string;
  impact: string;
  isApplied: boolean;
}

export interface SystemInfo {
  cpu: {
    model: string;
    logicalCores: number;
    physicalCores: number;
    isIntel: boolean;
    isAmd: boolean;
    isAmdX3D: boolean;
    hasHybridArchitecture: boolean;
  };
  ram: {
    totalGB: number;
    freeGB: number;
  };
  gpu: {
    name: string;
    driver: string;
  };
  os: {
    platform: string;
    release: string;
    arch: string;
    uptimeHours: string;
  };
  security: {
    defenderActive: boolean;
    uacEnabled: boolean;
    vbsEnabled: boolean;
  };
  timerResolutionMs: number;
  estimatedDpcLatencyUs: number;
}

export interface PciDevice {
  instanceId: string;
  deviceKey: string;
  friendlyName: string;
  deviceClass: string;
  type: 'GPU' | 'NIC' | 'USB' | 'NVME' | 'AUDIO' | 'STORAGE' | 'OTHER';
  msiSupported: boolean;
  msiEnabled: boolean;
  messageLimit: number;
  devicePriority: 'High' | 'Normal' | 'Low' | 'Undefined';
  affinityMaskHex: string;
  assignedCores: number[];
  irq: number | string;
}

export interface DriverStoreItem {
  oemName: string;
  originalName: string;
  provider: string;
  className: string;
  classGuid: string;
  driverDate: string;
  version: string;
  signerName: string;
  isDuplicate: boolean;
  isOld: boolean;
  sizeMB?: number;
}

export interface NetAdapterProp {
  name: string;
  displayName: string;
  displayValue: string;
  registryKeyword: string;
  registryValue: string;
}

export interface NetAdapterItem {
  id: string;
  name: string;
  interfaceDescription: string;
  status: string;
  linkSpeed: string;
  interruptModeration: boolean;
  flowControl: boolean;
  rssEnabled: boolean;
  udpChecksumOffload: boolean;
  properties?: NetAdapterProp[];
}

export interface DaemonStatus {
  isActive: boolean;
  timerResolutionMs: number;
  timerLocked: boolean;
  autoWatcherEnabled: boolean;
  activeGameDetected: string | null;
  standbyPurgeCount: number;
  lastPurgedAt: string | null;
}

export interface DpcDriverLatency {
  driverName: string;
  description: string;
  executionTimeUs: number;
  dpcCount: number;
  isrCount: number;
  status: 'OPTIMAL' | 'MODERATE' | 'CRITICAL';
}

export interface DpcLatencyReport {
  currentDpcLatencyUs: number;
  maxDpcLatencyUs: number;
  highestLatencyDriver: string;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_OPTIMIZATION';
  drivers: DpcDriverLatency[];
  timestamp: string;
}

export interface BcdSetting {
  name: string;
  param: string;
  currentValue: string;
  recommendedValue: string;
  isOptimized: boolean;
  description: string;
}

export interface DefenderStatusDetails {
  realTimeProtection: boolean;
  cloudProtection: boolean;
  sampleSubmission: boolean;
  tamperProtection: boolean;
  exclusionsCount: number;
  exclusionsList: string[];
  exploitProtectionConfigured: boolean;
}

export interface SnapshotItem {
  id: string;
  label: string;
  timestamp: string;
  appliedTweaksCount: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  category: string;
  action: string;
  target: string;
  details: string;
  status: 'SUCCESS' | 'ERROR';
}

export interface BiosHardwareReport {
  motherboard: {
    manufacturer: string;
    product: string;
    version: string;
    serialNumber: string;
  };
  bios: {
    version: string;
    releaseDate: string;
    vendor: string;
    smbiosVersion: string;
  };
  ram: {
    totalGB: number;
    speedMHz: number;
    configuredSpeedMHz: number;
    isExpoXmpActive: boolean;
    partNumbers: string[];
  };
  features: {
    rebarEnabled: boolean;
    above4gEnabled: boolean;
    virtualizationEnabled: boolean;
    tpmEnabled: boolean;
    secureBootEnabled: boolean;
    pcieLinkSpeed: string;
    pcieLinkWidth: string;
    spreadSpectrumStable: boolean;
  };
  vendorRecommendations: {
    title: string;
    category: 'RAM' | 'CPU' | 'GPU' | 'SECURITY' | 'POWER';
    status: 'OPTIMAL' | 'RECOMMENDED' | 'CRITICAL';
    currentValue: string;
    optimalValue: string;
    instructions: string;
  }[];
}

export interface HardwareBuildPreset {
  id: string;
  name: string;
  category: 'AMD_AM5' | 'AMD_AM4' | 'INTEL_LGA1700' | 'INTEL_LGA1851' | 'INTEL_LGA1200';
  tier: 'ESPORTS_FLAGSHIP' | 'HIGH_END' | 'MAINSTREAM' | 'BUDGET_KILLER' | 'MID_RANGE' | 'BUDGET_COMPETITIVE' | string;
  cpu: string;
  gpu: string;
  ramSpec: string;
  matchScore?: number;
  isCurrentMatched?: boolean;
  tuning: {
    powerPlanName: string;
    powerPlanId: string;
    cpuAffinityMaskHex: string;
    win32PrioritySeparation: string;
    gpuMsiPriority: 'High' | 'Normal';
    nicRssQueues: number;
    cs2LaunchArgs: string;
    biosKeyTweaks: string[];
    fpsEstimateCs2: {
      avg: number;
      p1Low: number;
    };
  };
}

export interface NvidiaCustomDriverInfo {
  installedVersion: string;
  driverDate: string;
  cardName: string;
  isCustom: boolean;
  dpcLatencyUs: number;
  telemetryDisabled: boolean;
  hdmiAudioDisabled: boolean;
  p0StateLocked: boolean;
  customInstallerAvailable: boolean;
  customInstallerPath: string;
}

export interface PowerPlanItem {
  id: string;
  name: string;
  description: string;
  platform: 'AMD_AM5' | 'AMD_AM4' | 'INTEL' | 'UNIVERSAL';
  filePath: string;
  isCurrent: boolean;
}


