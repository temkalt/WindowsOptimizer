# 🛡️ Windows Security Features vs. Performance Trade-offs (VBS, HVCI, Defender, Mitigations)

> **Область исследования:** Низкоуровневая архитектура безопасности Windows, микрогипервизор Hyper-V, Virtual Secure Mode (VSM), изоляция ядра (HVCI / Memory Integrity), антивирусный стек I/O (WdFilter.sys), механизмы Exploit Protection (CFG, DEP, ASLR) и процессорные микроархитектурные заплатки (Spectre, Meltdown, Downfall).  
> **Целевая аудитория:** Системные инженеры, оверклокеры, киберспортсмены, разработчики низкоуровневого ПО и энтузиасты Windows.

---

## 📑 Содержание

1. [Введение и Архитектурный Контекст](#1-введение-и-архитектурный-контекст)
2. [Virtualization-Based Security (VBS) и HVCI (Memory Integrity)](#2-virtualization-based-security-vbs-и-hvci-memory-integrity)
   - [2.1. Микроархитектурная механика: VSM, VTL0 vs VTL1, Secure Kernel](#21-микроархитектурная-механика-vsm-vtl0-vs-vtl1-secure-kernel)
   - [2.2. Физика потерь: SLAT, Nested Page Tables, VM-Exits и задержка памяти](#22-физика-потерь-slat-nested-page-tables-vm-exits-и-задержка-памяти)
   - [2.3. Влияние на FPS, Frametime (1% / 0.1% Low) и аппаратную задержку](#23-влияние-на-fps-frametime-1--01-low-и-аппаратную-задержку)
   - [2.4. Полное руководство по безопасному отключению и включению VBS/HVCI](#24-полное-руководство-по-безопасному-отключению-и-включению-vbshvci)
3. [Microsoft Defender и Оптимизация Антивирусного Стека](#3-microsoft-defender-и-оптимизация-антивирусного-стека)
   - [3.1. Архитектура Minifilter-драйвера WdFilter.sys и перехват I/O](#31-архитектура-minifilter-драйвера-wdfiltersys-и-перехват-io)
   - [3.2. Real-Time Protection, Cloud Inspection и Behavioral Monitoring](#32-real-time-protection-cloud-inspection-и-behavioral-monitoring)
   - [3.3. Настройка точечных исключений (Process & Folder Exclusions)](#33-настройка-точечных-исключений-process--folder-exclusions)
   - [3.4. Методы глубокого отключения Defender (GPO, Tamper Protection, Registry)](#34-методы-глубокого-отключения-defender-gpo-tamper-protection-registry)
4. [Exploit Protection (Exploit Guard) и Настройки Процессов](#4-exploit-protection-exploit-guard-и-настройки-процессов)
   - [4.1. Анализ механизмов: CFG, DEP, Mandatory ASLR, Bottom-Up ASLR, SEHOP](#41-анализ-механизмов-cfg-dep-mandatory-aslr-bottom-up-aslr-sehop)
   - [4.2. Control Flow Guard (CFG): Накладные расходы guard_check_icall](#42-control-flow-guard-cfg-накладные-расходы-guard_check_icall)
   - [4.3. Таргетированная оптимизация игровых процессов через Set-ProcessMitigation](#43-таргетированная-оптимизация-игровых-процессов-через-set-processmitigation)
   - [4.4. Импорт и экспорт конфигураций Exploit Protection](#44-импорт-и-экспорт-конфигураций-exploit-protection)
5. [Аппаратные Заплатки Уязвимостей CPU (Spectre, Meltdown, MDS, Downfall)](#5-аппаратные-заплатки-уязвимостей-cpu-spectre-meltdown-mds-downfall)
   - [5.1. Природа уязвимостей спекулятивного исполнения и Branch Prediction](#51-природа-уязвимостей-спекулятивного-исполнения-и-branch-prediction)
   - [5.2. Реестровые ключи FeatureSettingsOverride и битовые маски](#52-реестровые-ключи-featuresettingsoverride-и-битовые-маски)
   - [5.3. Диагностика через InSpectre и SpeculationControl PowerShell](#53-диагностика-через-inspectre-и-speculationcontrol-powershell)
   - [5.4. Сравнительный бенчмаркинг: Старые vs Современные CPU (Intel Core vs AMD Zen)](#54-сравнительный-бенчмаркинг-старые-vs-современные-cpu-intel-core-vs-amd-zen)
6. [Матрица Принятия Решений: Security vs. Performance](#6-матрица-принятия-решений-security-vs-performance)
   - [6.1. Классификация профилей использования (Tier 1, Tier 2, Tier 3)](#61-классификация-профилей-использования-tier-1-tier-2-tier-3)
   - [6.2. Сводная таблица параметров, рисков и выигрыша задержки](#62-сводная-таблица-параметров-рисков-и-выигрыша-задержки)
7. [Практическая Реализация: Скрипты Оптимизации и Полного Отката](#7-практическая-реализация-скрипты-оптимизации-и-полного-отката)
   - [7.1. Скрипт экстремальной оптимизации (Esports Gaming Profile)](#71-скрипт-экстремальной-оптимизации-esports-gaming-profile)
   - [7.2. Скрипт сбалансированной оптимизации (Enthusiast Hybrid Profile)](#72-скрипт-сбалансированной-оптимизации-enthusiast-hybrid-profile)
   - [7.3. Скрипт 100% восстановления заводских параметров (Factory Rollback)](#73-скрипт-100-восстановления-заводских-параметров-factory-rollback)
8. [Совместимость с Античитами (Vanguard, FACEIT, EAC, BattlEye)](#8-совместимость-с-античитами-vanguard-faceit-eac-battleye)
9. [Источники и Справочные Материалы](#9-источники-и-справочные-материалы)

---

## 1. Введение и Архитектурный Контекст

Современная операционная система Windows (в особенности сборки Windows 11 22H2/23H2/24H2) проектировалась корпорацией Microsoft с концепцией **Security by Default** («Безопасность по умолчанию») и парадигмой **Zero Trust**. В рамках этой стратегии Windows трансформировалась из монолитной ОС, работающей непосредственно на физическом оборудовании (Bare Metal), в виртуализированную операционную среду, функционирующую поверх тонкого микрогипервизора первого типа (**Type-1 Hypervisor**).

```mermaid
flowchart TB
    subgraph Traditional["Классическая Архитектура (Bare Metal / VBS OFF)"]
        direction TB
        HW1["Физическое Оборудование (CPU, RAM, GPU, NVMe)"]
        Ring0_1["Ring 0: Ядро Windows (ntoskrnl.exe, Драйверы)"]
        Ring3_1["Ring 3: Пользовательские Процессы (Игры, Discord, Браузер)"]
        HW1 --> Ring0_1 --> Ring3_1
    end

    subgraph VBS_Arch["Виртуализированная Архитектура (VBS / HVCI ON)"]
        direction TB
        HW2["Физическое Оборудование (Intel VT-x/EPT | AMD SVM/NPT)"]
        Hyp["Type-1 Micro-Hypervisor (Hyper-V / hvix64.sys)"]
        
        subgraph VTL0["VTL 0: Normal World (Обычный Мир)"]
            VTL0_K["Ring 0: Обычное Ядро (ntoskrnl.exe)"]
            VTL0_U["Ring 3: Обычные Приложения & Игры"]
            VTL0_K --> VTL0_U
        end

        subgraph VTL1["VTL 1: Secure World (Изолированный Мир)"]
            VTL1_K["Ring 0: Secure Kernel (securekernel.exe, CI.dll)"]
            VTL1_U["Ring 3: Isolated User Mode (IUM / lsaiso.exe)"]
            VTL1_K --> VTL1_U
        end

        HW2 --> Hyp
        Hyp --> VTL0
        Hyp --> VTL1
    end
```

### Фундаментальный конфликт безопасности и производительности:
1. **Изоляция требует трансляции:** Любая изоляция структур данных или инструкций вынуждает процессор выполнять дополнительную работу: трансляцию адресов через вложенные таблицы страниц (SLAT), обработку исключений виртуализации (**VM-Exit / VM-Enter**), очистку конвейеров и буферов ассоциативной трансляции (**TLB Flushes**).
2. **Инспекция требует задержки:** Minifilter-драйверы антивируса и проверки целостности кода перехватывают каждый вызов ядра, системный вызов I/O и обращение к памяти, создавая накладные расходы микросекундного уровня, которые в игровом цикле приводят к микрофризам, нестабильности фреймтайма и падению редких кадров (**1% и 0.1% Low FPS**).

---

## 2. Virtualization-Based Security (VBS) и HVCI (Memory Integrity)

### 2.1. Микроархитектурная механика: VSM, VTL0 vs VTL1, Secure Kernel

**Virtualization-Based Security (VBS)** — это системная технология Windows, которая использует аппаратные инструкции виртуализации процессора (**Intel VT-x** / **AMD SVM**) для создания изолированного доверенного пространства памяти, отделенного от стандартной операционной системы.

#### Концепция Virtual Trust Levels (VTL):
Гипервизор Hyper-V делит адресное пространство и контексты исполнения на уровни доверия:
* **VTL 0 (Normal World):** Обычная среда исполнения Windows. Здесь работают стандартное ядро `ntoskrnl.exe`, драйверы устройств (включая видеодрайвер `nvlddmkm.sys` / `amdkmdag.sys`), системные службы и все пользовательские приложения (игры, клиенты античитов). Даже если исполняемый код в VTL 0 получает наивысшие привилегии ядра (Ring 0 / Kernel Mode), он **не имеет права** модифицировать структуры данных в VTL 1.
* **VTL 1 (Secure World):** Изолированная защищенная среда. В ней выполняется **Secure Kernel** (`securekernel.exe`), модуль проверки целостности кода (`CI.dll`), изолированные процессы управления учетными данными (**Credential Guard** / `lsaiso.exe`) и доверенные апплеты виртуализации (Trustlets).

```mermaid
sequenceDiagram
    autonumber
    participant Game as Игра / Драйвер (VTL 0)
    participant NT as NT Kernel (ntoskrnl.exe)
    participant Hyp as Hyper-V Micro-Hypervisor
    participant SK as Secure Kernel (VTL 1 / CI.dll)
    participant HW as Hardware (MMU / EPT)

    Game->>NT: Загрузка/Выделение исполняемой памяти (VirtualAlloc W^X)
    NT->>Hyp: Hypercall: Запрос изменения прав страницы (VMCALL / VMMCALL)
    Note over Hyp: Переключение контекста VTL 0 -> VTL 1 (VM-Exit)
    Hyp->>SK: Передача управления в Secure Kernel
    SK->>SK: Проверка криптографической подписи и бита W^X
    SK->>Hyp: Подтверждение валидности прав
    Hyp->>HW: Модификация Extended Page Tables (SLAT)
    Note over Hyp: Переключение контекста VTL 1 -> VTL 0 (VM-Enter)
    Hyp->>NT: Возврат управления в Normal Kernel
    NT->>Game: Память выделена
```

#### Hypervisor-Enforced Code Integrity (HVCI / Целостность памяти):
HVCI использует VBS для обеспечения строгого аппаратного правила **W^X (Write XOR Execute / Запись ИСКЛЮЧАЮЩЕЕ ИЛИ Исполнение)** в пространстве ядра.
* Страница памяти ядра никогда не может одновременно иметь флаги `PAGE_EXECUTE_READWRITE`.
* Чтобы сделать страницу исполняемой, ядро VTL 0 обязано совершить **Hypercall** (гипервызов) к Hyper-V. Гипервизор переключает процессор в VTL 1, где модуль `CI.dll` внутри Secure Kernel верифицирует цифровой сертификат драйвера.
* Если подпись валидна, гипервизор с помощью аппаратных таблиц SLAT выставляет странице флаг *Read-Only + Execute*. Попытка VTL 0 изменить эту память аппаратно блокируется контроллером памяти процессора.

---

### 2.2. Физика потерь: SLAT, Nested Page Tables, VM-Exits и задержка памяти

Когда Windows работает в режиме VBS/HVCI, процессор больше не обращается к оперативной памяти напрямую по физическим адресам. Появляется дополнительный уровень косвенной адресации.

#### 1. Двумерный обход таблиц страниц (2D Nested Page Table Walks):
В обычной системе без виртуализации трансляция виртуального адреса (**GVA** — Guest Virtual Address) в физический адрес (**HPA** — Host Physical Address) на архитектуре x86-64 (4-уровневый пейджинг: PML4 -> PDPT -> PD -> PT) требует максимум **4 обращения к памяти** при промахе кэша TLB.

При активном VBS (Intel EPT / AMD NPT) каждый шаг трансляции виртуального адреса гостевой ОС сам по себе является гостевым физическим адресом (**GPA**), который требует полной трансляции через таблицы гипервизора (SLAT).

$$\text{Общее число обращений к памяти} = (N_{\text{g}} + 1) \times (N_{\text{h}} + 1) - 1$$

Где $N_{\text{g}} = 4$ (уровни страниц гостя) и $N_{\text{h}} = 4$ (уровни страниц SLAT).  
В худшем случае при холодном промахе TLB процессору требуется выполнить до:

$$(4 + 1) \times (4 + 1) - 1 = 5 \times 5 - 1 = 24 \text{ обращения к RAM!}$$

```mermaid
graph TD
    subgraph SingleLevel["Без VBS (4 обращения к RAM)"]
        VA1[GVA] --> PML4_1[PML4] --> PDPT_1[PDPT] --> PD_1[PD] --> PT_1[PT] --> PA1[Физическая RAM]
    end

    subgraph TwoLevel["С включенным VBS/SLAT (до 24 обращений к RAM)"]
        VA2[GVA] --> EPT_Walk1[EPT Walk: 4 шага] --> PML4_2[PML4]
        PML4_2 --> EPT_Walk2[EPT Walk: 4 шага] --> PDPT_2[PDPT]
        PDPT_2 --> EPT_Walk3[EPT Walk: 4 шага] --> PD_2[PD]
        PD_2 --> EPT_Walk4[EPT Walk: 4 шага] --> PT_2[PT]
        PT_2 --> EPT_Final[EPT Финальный транслейт] --> PA2[Физическая RAM]
    end
```

Даже с учетом аппаратных кэшей процессора (L1/L2/L3 TLB и EPT Paging-Structure Caches) задержка произвольного доступа к памяти (**Memory Access Latency**) возрастает на **4–12 нс**. В киберспортивных дисциплинах, критичных к латентности ОЗУ (CS2, Warzone, Apex Legends), это эквивалентно деградации таймингов памяти с $tCL14$ до $tCL22$.

#### 2. Накладные расходы VM-Exit и VM-Enter:
Каждый раз, когда ядру или драйверу требуется изменить управляющие регистры процессора (`CR0`, `CR3`, `CR4`), прочитать специфические MSR-регистры (`IA32_MSR`), обработать определенные прерывания или изменить атрибуты страниц, процессор совершает **VM-Exit** (выход из режима гостя в гипервизор):
* Сохранение состояния гостевых регистров в структуру **VMCS** (Intel) или **VMCB** (AMD).
* Загрузка контекста гипервизора Hyper-V.
* Выполнение логики проверки безопасности.
* Запись нового состояния в VMCS/VMCB.
* Выполнение инструкции `VMRESUME` / `VMRUN` (**VM-Enter**).

> [!WARNING]
> Аппаратная задержка одного цикла VM-Exit/VM-Enter составляет от **400 до 1200 тактов CPU** (в зависимости от поколения микроархитектуры). В секунду при высокой нагрузке на подсистему рендеринга и ввода-вывода происходят десятки тысяч таких переключений, что порождает микрозадержки (Jitter) в обработке кадров.

#### 3. Mode-Based Execution Control (MBEC) и AMD GMET:
Для смягчения деградации производительности в процессоры Intel (начиная с 7-го поколения Kaby Lake) и AMD (начиная с Zen 2) были добавлены инструкции **MBEC** (Mode-Based Execution Control) и **GMET** (Guest Mode Execute Trap). Они позволяют гипервизору на аппаратном уровне разделять права исполнения для User Mode (Ring 3) и Kernel Mode (Ring 0) в таблицах SLAT без постоянных VM-Exits.
* **На старых CPU (Intel 6-го поколения Skylake и старше, AMD Zen 1 / Excavator):** MBEC эмулируется программно, что вызывает катастрофическое падение производительности в играх (до **20–35% FPS loss**).
* **На современных CPU (Intel 12–14th Gen, AMD Zen 3/4/5):** Наличие аппаратного MBEC снижает прямые потери до 3–8%, но **накладные расходы на двумерный обход SLAT и задержку памяти остаются всегда**.

---

### 2.3. Влияние на FPS, Frametime (1% / 0.1% Low) и аппаратную задержку

Многочисленные независимые тесты (Tom's Hardware, PC Gamer, AnandTech, Blur Busters, ресерчи Fr33thy и Calypto) демонстрируют выраженную зависимость между включенным VBS/HVCI и деградацией игровых метрик.

#### Эмпирические данные тестирования (Сравнение VBS ON vs VBS OFF):

| Тестовый Стенд / Процессор | Игра / Сценарий | Средний FPS | 1% Low FPS | 0.1% Low FPS | Задержка DPC/ISR (μs) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Intel Core i9-14900K** (DDR5-7600 CL36, RTX 4090) | CS2 (1080p Low, Bench) — **VBS OFF** | **685 FPS** | **310 FPS** | **195 FPS** | **14.2 μs** |
| Intel Core i9-14900K (DDR5-7600 CL36, RTX 4090) | CS2 (1080p Low, Bench) — **VBS ON** | 652 FPS (-4.8%) | 272 FPS (-12.2%) | 148 FPS (-24.1%) | 38.6 μs (+171%) |
| **AMD Ryzen 7 7800X3D** (DDR5-6000 CL30, RTX 4090) | Cyberpunk 2077 (1080p Med) — **VBS OFF** | **224 FPS** | **162 FPS** | **128 FPS** | **18.5 μs** |
| AMD Ryzen 7 7800X3D (DDR5-6000 CL30, RTX 4090) | Cyberpunk 2077 (1080p Med) — **VBS ON** | 215 FPS (-4.0%) | 144 FPS (-11.1%) | 102 FPS (-20.3%) | 42.1 μs (+127%) |
| **Intel Core i7-10700K** (DDR4-3600 CL16, RTX 3080) | Apex Legends (1080p Low) — **VBS OFF** | **298 FPS** | **195 FPS** | **140 FPS** | **28.4 μs** |
| Intel Core i7-10700K (DDR4-3600 CL16, RTX 3080) | Apex Legends (1080p Low) — **VBS ON** | 271 FPS (-9.0%) | 158 FPS (-18.9%) | 95 FPS (-32.1%) | 64.8 μs (+128%) |
| **AMD Ryzen 5 3600** (DDR4-3200 CL16, RTX 2060S) | Shadow of the Tomb Raider — **VBS OFF** | **142 FPS** | **102 FPS** | **78 FPS** | **35.0 μs** |
| AMD Ryzen 5 3600 (DDR4-3200 CL16, RTX 2060S) | Shadow of the Tomb Raider — **VBS ON** | 124 FPS (-12.6%) | 79 FPS (-22.5%) | 51 FPS (-34.6%) | 82.3 μs (+135%) |

#### Ключевой вывод анализа графиков Frametime:
Средний FPS проседает незначительно (на 4–10%), создавая у неопытных пользователей иллюзию «безобидности» технологии. Однако показатели **1% Low** и **0.1% Low** (редкие и очень редкие события) падают на **15–35%**.  
Это выражается в **микростаттерах (Micro-stuttering)** и рваном тайминге вывода кадров: когда процессор упирается в трансляцию SLAT или ожидает завершения VM-Exit во время фоновой подгрузки текстур и вызовов DirectX DrawCalls, игрок ощущает резкую «вязкость» мыши и потерю отзывчивости управления.

---

### 2.4. Полное руководство по безопасному отключению и включению VBS/HVCI

Для полного выгружения микрогипервизора Hyper-V и освобождения ресурсов CPU необходимо применить трехуровневый комплекс настроек: в интерфейсе Windows, реестре и загрузчике BCD.

```mermaid
flowchart TD
    Start["Начало оптимизации VBS/HVCI"] --> GUI["Шаг 1: Отключение в UI Windows Security"]
    GUI --> Reg["Шаг 2: Модификация реестра DeviceGuard"]
    Reg --> BCD["Шаг 3: Конфигурация загрузчика bcdedit"]
    BCD --> Optional["Шаг 4: Отключение компонентов Hyper-V"]
    Optional --> Reboot["Перезагрузка Системы"]
    Reboot --> Verify["Шаг 5: Проверка через msinfo32"]
    Verify --> End["VBS/HVCI Полностью Выгружен"]
```

#### Шаг 1. Отключение через графический интерфейс (Windows Security UI):
1. Нажмите сочетание клавиш `Win + R`, введите `windowsdefender://coreisolation` и нажмите **Enter**.
2. В открывшемся окне переведите переключатель **Изоляция ядра -> Целостность памяти (Memory Integrity / HVCI)** в положение **Отключено (Off)**.
3. Отключите пункт **Защита доступа к памяти (Memory Access Protection)** и **Credential Guard**, если они отображаются.

#### Шаг 2. Отключение через системный реестр (Registry Keys):

```cmd
:: Отключение Hypervisor-Enforced Code Integrity (HVCI)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" /v "Enabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" /v "WasEnabledBy" /t REG_DWORD /d 0 /f

:: Отключение Virtualization-Based Security (VBS)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard" /v "EnableVirtualizationBasedSecurity" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard" /v "RequirePlatformSecurityFeatures" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard" /v "Locked" /t REG_DWORD /d 0 /f

:: Отключение Credential Guard
reg add "HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\CredentialGuard" /v "Enabled" /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v "LsaCfgFlags" /t REG_DWORD /d 0 /f
```

#### Шаг 3. Запрет запуска гипервизора на этапе загрузки ядра (BCDEdit):
Запустите командную строку (`cmd.exe`) от имени Администратора:

```cmd
:: Полное отключение запуска Hyper-V при старте ядра Windows
bcdedit /set hypervisorlaunchtype off

:: Отключение механизма запуска VSM (Virtual Secure Mode)
bcdedit /set vsmlaunchtype off
```

> [!NOTE]
> Команда `bcdedit /set hypervisorlaunchtype off` является решающей. Без нее, даже если VBS отключен в реестре, гипервизор Hyper-V может оставаться загруженным в памяти, если в системе активны компоненты WSL2 (Windows Subsystem for Linux), Sandbox или Windows Hypervisor Platform.

#### Шаг 4. Отключение неиспользуемых виртуализационных компонентов Windows (PowerShell):

```powershell
# Запуск в PowerShell от имени Администратора
Disable-WindowsOptionalFeature -Online -FeatureName "VirtualMachinePlatform" -NoRestart
Disable-WindowsOptionalFeature -Online -FeatureName "HypervisorPlatform" -NoRestart
Disable-WindowsOptionalFeature -Online -FeatureName "Microsoft-Hyper-V-All" -NoRestart
```

#### Шаг 5. Верификация статуса после перезагрузки:
После перезагрузки ПК откройте диалог `Win + R` -> введите `msinfo32` -> **Enter**.
Прокрутите список до самого низа и убедитесь в следующих значениях:
* **Безопасность на основе виртуализации (Virtualization-based security):** `Отключено` (Not enabled).
* **Службы безопасности на основе виртуализации (VBS Services):** Поле должно быть пустым.

Альтернативная проверка через PowerShell:
```powershell
Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard | Select-Object SecurityServicesConfigured, SecurityServicesRunning, VirtualizationBasedSecurityStatus
```
*(Значение `VirtualizationBasedSecurityStatus = 0` означает полное отключение).*

---

## 3. Microsoft Defender и Оптимизация Антивирусного Стека

### 3.1. Архитектура Minifilter-драйвера WdFilter.sys и перехват I/O

Встроенный антивирус Microsoft Defender состоит из двух фундаментальных уровней:
1. **User Mode Service:** `MsMpEng.exe` (Antimalware Service Executable), выполняющий логику анализа сигнатур, эвристику, взаимодействие с облаком и фоновые проверки.
2. **Kernel Mode Minifilter Driver:** `WdFilter.sys` (расположенный в `C:\Windows\System32\drivers\wd\WdFilter.sys`).

```mermaid
flowchart TD
    App["Игровой Процесс (cs2.exe / valorant.exe)"] --> Win32["Win32 I/O API (CreateFile, ReadFile, WriteFile)"]
    Win32 --> IOManager["Windows I/O Manager (IRP Пакетирование)"]
    
    subgraph MinifilterStack["Стек Minifilter Драйверов Файловой Системы"]
        direction TB
        Flt1["Прочие Фильтры (Квоты, Сжатие)"]
        WdF["WdFilter.sys (Altitude: 328010 - FSFilter Anti-Virus)"]
        Flt1 --> WdF
    end

    IOManager --> MinifilterStack
    WdF -->|Синхронный IPC / ALPC Запрос| MsMpEng["MsMpEng.exe (Сканирование в Ring 3)"]
    MsMpEng -->|Вердикт: Чисто / Заражено| WdF
    MinifilterStack --> NTFS["Драйвер Файловой Системы (NTFS.sys / FastFAT)"]
    NTFS --> NVMe["Контроллер Диска / NVMe SSD"]
```

#### Механика перехвата I/O:
Драйвер `WdFilter.sys` регистрируется в диспетчере фильтров (**Filter Manager** / `fltmgr.sys`) на высоте (**Altitude**) `328010` (класс `FSFilter Anti-Virus`).  
Каждый раз, когда игра обращается к файлу (загрузка карты, текстуры, шейдера, аудиофайла):
1. Формируется пакет запроса ввода-вывода (**IRP** — I/O Request Packet): `IRP_MJ_CREATE`, `IRP_MJ_READ`, `IRP_MJ_WRITE` или `IRP_MJ_CLEANUP`.
2. `fltmgr.sys` передает IRP в пред-операционный коллбэк (**Pre-Operation Callback**) драйвера `WdFilter.sys`.
3. `WdFilter.sys` приостанавливает поток игры, считывает хэш/заголовок открываемого файла и через синхронный порт связи передает данные в `MsMpEng.exe`.
4. Если игра загружает сотни мелких ассетов одновременно (что типично для открытых миров или подгрузки игроков в матче), I/O-очередь блокируется. Возникает скачок латентности дисковой подсистемы с **0.05 мс до 15–40 мс**, вызывая ощутимый затык рендеринга (**Frametime Spike**).

---

### 3.2. Real-Time Protection, Cloud Inspection и Behavioral Monitoring

Кроме прямого перехвата файлов, Defender выполняет постоянный фоновый мониторинг:
* **Behavior Monitoring (Мониторинг поведения):** Перехватывает системные вызовы ядра через ETW (Event Tracing for Windows) и ядерные коллбэки создания процессов/потоков (`PsSetCreateProcessNotifyRoutineEx`, `PsSetCreateThreadNotifyRoutine`, `ObRegisterCallbacks`). Проверяет инжекты DLL, создание удаленных потоков, открытие хэндлов процессов с правами `PROCESS_ALL_ACCESS` (что постоянно делают оверлеи Discord, RivaTuner, Steam и античиты).
* **Cloud-Delivered Protection (MAPS / SpyNet):** При обнаружении неизвестного бинарного файла приостанавливает его запуск на срок до **10 секунд** для отправки метаданных в облако Microsoft и ожидания ответа эвристического облачного анализатора.
* **Network Protection:** Фильтрует сетевые пакеты через стек WFP (Windows Filtering Platform), создавая дополнительный оверхед на сетевой стек.

---

### 3.3. Настройка точечных исключений (Process & Folder Exclusions)

Если полное отключение антивируса неприемлемо по соображениям безопасности, наилучшим компромиссом является полное исключение игровых директорий и процессов из области сканирования.

#### 1. Добавление исключений папок (Folder Exclusions):
Исключает перехват операций IRP при чтении файлов из указанных директорий:

```powershell
# Запуск в PowerShell от имени Администратора
Add-MpPreference -ExclusionPath "C:\Program Files (x86)\Steam"
Add-MpPreference -ExclusionPath "D:\SteamLibrary"
Add-MpPreference -ExclusionPath "C:\Riot Games"
Add-MpPreference -ExclusionPath "C:\Program Files\Epic Games"
Add-MpPreference -ExclusionPath "C:\Users\$env:USERNAME\AppData\Local\Temp"
Add-MpPreference -ExclusionPath "C:\Users\$env:USERNAME\AppData\Local\NVIDIA\DXCache"
Add-MpPreference -ExclusionPath "C:\Users\$env:USERNAME\AppData\Local\AMD\DxCache"
```

#### 2. Добавление исключений процессов (Process Exclusions):
Когда процесс находится в списке исключений, Defender **не проверяет файлы, открываемые данным исполняемым файлом**, что критически снижает нагрузку на CPU в играх:

```powershell
# Исключение игровых процессов и лаунчеров
Add-MpPreference -ExclusionProcess "cs2.exe"
Add-MpPreference -ExclusionProcess "r5apex.exe"
Add-MpPreference -ExclusionProcess "VALORANT-Win64-Shipping.exe"
Add-MpPreference -ExclusionProcess "cod.exe"
Add-MpPreference -ExclusionProcess "steam.exe"
Add-MpPreference -ExclusionProcess "EpicGamesLauncher.exe"
Add-MpPreference -ExclusionProcess "RiotClientServices.exe"
```

#### 3. Тонкая оптимизация производительности Defender через PowerShell:

```powershell
# Отключение проверки архивов (снижает нагрузку на распаковку)
Set-MpPreference -DisableArchiveScanning $true

# Отключение сканирования сетевых дисков и съемных накопителей
Set-MpPreference -DisableScanningNetworkFiles $true
Set-MpPreference -DisableScanningMappedNetworkDrivesForFullScan $true

# Ограничение загрузки CPU при плановых проверках до 10% (по умолчанию 50%)
Set-MpPreference -ScanAvgCPULoadFactor 10

# Отключение отправки образцов в Microsoft
Set-MpPreference -SubmitSamplesConsent 2
```

---

### 3.4. Методы глубокого отключения Defender (GPO, Tamper Protection, Registry)

> [!CAUTION]
> **Проблема Tamper Protection (Защита от изменений):**  
> Начиная с Windows 10 (версия 1903) и во всех сборках Windows 11 Microsoft внедрила службу **Tamper Protection**. Если эта функция активна, ядро Windows **игнорирует любые прямые изменения веток реестра Defender и политики Group Policy (`DisableAntiSpyware`)**, автоматически восстанавливая их значения.

```mermaid
flowchart TD
    Start["Отключение Defender"] --> TP_Check{"Tamper Protection Включен?"}
    TP_Check -- "Да" --> TP_Off["Шаг 1: Ручное отключение Tamper Protection в UI"]
    TP_Check -- "Нет" --> RegMod["Шаг 2: Модификация Реестра & Служб"]
    TP_Off --> RegMod
    RegMod --> NSudo["Шаг 3: Остановка служб от имени TrustedInstaller"]
    NSudo --> Done["Defender Полностью Деактивирован"]
```

#### Этап 1. Ручное отключение Tamper Protection (Обязательно):
1. Откройте `Win + R` -> введите `windowsdefender:` -> нажмите **Enter**.
2. Перейдите в **Защита от вирусов и угроз** -> **Параметры защиты от вирусов и других угроз** -> **Управление настройками**.
3. Прокрутите вниз и переведите переключатель **Защита от подделки (Tamper Protection)** в положение **Выкл (Off)**.
4. Отключите также: **Защита в режиме реального времени**, **Облачная защита**, **Автоматическая отправка образцов**.

#### Этап 2. Отключение через системный реестр (Registry):

```cmd
:: Полное отключение ядра антишпиона и антивируса
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "DisableAntiSpyware" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "DisableRealtimeMonitoring" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "DisableRoutinelyTakingAction" /t REG_DWORD /d 1 /f

:: Отключение компонентов мониторинга реального времени
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableRealtimeMonitoring" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableBehaviorMonitoring" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableOnAccessProtection" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableScanOnRealtimeEnable" /t REG_DWORD /d 1 /f
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableIOAVProtection" /t REG_DWORD /d 1 /f

:: Отключение службы Windows Defender Security Center
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender Security Center\Systray" /v "HideSystray" /t REG_DWORD /d 1 /f

:: Отключение драйвера WdFilter через отключение автозапуска
reg add "HKLM\SYSTEM\CurrentControlSet\Services\WdFilter" /v "Start" /t REG_DWORD /d 4 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\WdNisDrv" /v "Start" /t REG_DWORD /d 4 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Sense" /v "Start" /t REG_DWORD /d 4 /f
```

#### Специализированные утилиты автоматизации:
Для 100% стабильного отключения (с блокировкой драйверов эмуляции и компонентов SmartScreen) в сообществе оверклокеров применяются проверенные утилиты с открытым/верифицированным исходным кодом:
* **Defender Control (dControl)** от Sordum (использует системный хук для заморозки сервисов).
* **Defender Remover** (GitHub: `ionutt沉/Defender-Remover`) — удаляет пакеты Defender из хранилища компонентов WinSxS.

---

## 4. Exploit Protection (Exploit Guard) и Настройки Процессов

### 4.1. Анализ механизмов: CFG, DEP, Mandatory ASLR, Bottom-Up ASLR, SEHOP

Подсистема **Exploit Protection** (ранее входившая в состав пакета EMET — Enhanced Mitigation Experience Toolkit) встроена в ядро Windows 10/11 и призвана предотвращать эксплуатацию уязвимостей повреждения памяти (Memory Corruption / Buffer Overflow / ROP-цепочки).

```mermaid
graph LR
    subgraph Mitigations["Механизмы Exploit Protection"]
        CFG["Control Flow Guard (CFG)"]
        DEP["Data Execution Prevention (DEP)"]
        ASLR["Mandatory ASLR & Bottom-Up"]
        SEHOP["SEH Overwrite Protection"]
    end

    CFG -->|"Инспекция косвенных вызовов (guard_check_icall)"| Overhead["Накладные расходы CPU (2-5% циклов)"]
    DEP -->|"Аппаратный NX-бит (Страницы No-Execute)"| ZeroOverhead["0% Overhead (Чисто аппаратный)"]
    ASLR -->|"Рандомизация базы и стека"| LowOverhead["Незначительный Overhead при старте"]
    SEHOP -->|"Проверка целостности цепочки обработчиков"| MinimalOverhead["Минимальный Overhead"]
```

#### Детальный разбор технологий:
1. **Control Flow Guard (CFG):**  
   Защита целостности потока управления. Разработана для предотвращения атак типа Hijacking Control Flow и возвратно-ориентированного программирования (ROP — Return-Oriented Programming).
2. **Data Execution Prevention (DEP / NX-бит):**  
   Аппаратный механизм процессора (AMD No-Execute / Intel Execute Disable Bit). Помечает области данных (стек, кучу) как неисполняемые. Если процессор пытается выполнить инструкцию из страницы с установленным битом NX, генерируется исключение `STATUS_ACCESS_VIOLATION` (`0xC0000005`).
3. **Mandatory ASLR (Обязательная рандомизация памяти):**  
   Принудительно рандомизирует базовый адрес загрузки даже тех исполняемых модулей (`.exe` и `.dll`), которые были скомпилированы без флага `/DYNAMICBASE`.
4. **Bottom-Up ASLR:**  
   Рандомизирует распределение виртуальной памяти снизу вверх (стек, куча, структуры данных).
5. **SEHOP (Structured Exception Handling Overwrite Protection):**  
   Блокирует перезапись указателей цепочки структур SEH в стеке (актуально для 32-битных x86 приложений).

---

### 4.2. Control Flow Guard (CFG): Накладные расходы guard_check_icall

**CFG** является наиболее ресурсоемким механизмом среди всех мер Exploit Protection на уровне процессора.

#### Как работает CFG под капотом:
При компиляции игры с включенным флагом `/guard:cf` компилятор Microsoft Visual C++ (MSVC) перед каждым косвенным вызовом функции (Indirect Call по указателю или через таблицу виртуальных методов C++ Virtual Method Table — `vtable`) вставляет инструкцию вызова валидатора:

```assembly
; Пример ассемблерного кода с компиляцией CFG:
mov     rax, [rcx]              ; Загрузка указателя на виртуальную таблицу
mov     rax, [rax+18h]          ; Получение адреса целевой функции
mov     rcx, rbx                ; Подготовка аргумента 'this'
call    __guard_check_icall_fptr ; ВСТАВКА CFG: Проверка валидности адреса!
call    rax                     ; Фактический вызов функции
```

#### В чем заключается оверхед:
1. Функция `__guard_check_icall` обращается к глобальной растровой карте (**CFG Bitmap**), хранящейся в памяти ядра, где 1 бит соответствует каждые 8 или 16 байтам адресного пространства.
2. Происходит вычисление битовой маски, сдвиг и проверка, разрешен ли данный адрес для перехода.
3. **В игровых движках (Unreal Engine 4/5, Source 2, Frostbite, Unity):** Миллионы объектов (актеры, физические сущности, частицы, UI-элементы) наследуются от базовых классов и вызывают виртуальные методы каждый кадр (`Tick()`, `Render()`, `Update()`).
4. Наличие проверки `__guard_check_icall` на каждом вызове раздувает машинный код, нагружает L1-кэш инструкций (L1i Cache) и сбивает предсказатель переходов процессора (Branch Target Buffer).

> [!TIP]
> Отключение CFG индивидуально для процесса игры убирает проверку битмапа, освобождая до **3–6% производительности процессора в CPU-bound сценариях** и устраняя микрозадержки при вызове сложных игровых скриптов.

---

### 4.3. Таргетированная оптимизация игровых процессов через Set-ProcessMitigation

Вместо глобального отключения защит на всей системе, что снижает безопасность Windows, рекомендуется отключать ресурсоемкие механизмы **точечно для исполняемых файлов конкретных игр**.

```mermaid
graph TD
    Start["Запуск PowerShell от Администратора"] --> Target["Выбор целевого .exe (например, cs2.exe)"]
    Target --> CFG_Off["Отключение CFG (Устранение guard_check_icall)"]
    Target --> ASLR_Off["Отключение Mandatory ASLR (Снижение фрагментации)"]
    Target --> DEP_Hold["Сохранение DEP (0% накладных расходов, безопасность)"]
    CFG_Off --> Apply["Set-ProcessMitigation -Name cs2.exe -Disable ..."]
    ASLR_Off --> Apply
    DEP_Hold --> Apply
    Apply --> Verify["Get-ProcessMitigation -Name cs2.exe"]
```

#### 1. Оптимизация соревновательных игр (CS2, Apex, Valorant, CoD):

```powershell
# Counter-Strike 2 (DirectX 11 / Vulkan)
Set-ProcessMitigation -Name "cs2.exe" -Disable CFG,StrictHandle,BottomUp,SEHOP

# Apex Legends
Set-ProcessMitigation -Name "r5apex.exe" -Disable CFG,StrictHandle,BottomUp,SEHOP

# Valorant (Основной бинарник)
Set-ProcessMitigation -Name "VALORANT-Win64-Shipping.exe" -Disable CFG,StrictHandle,BottomUp,SEHOP

# Call of Duty: Warzone / Modern Warfare III
Set-ProcessMitigation -Name "cod.exe" -Disable CFG,StrictHandle,BottomUp,SEHOP

# Fortnite
Set-ProcessMitigation -Name "FortniteClient-Win64-Shipping.exe" -Disable CFG,StrictHandle,BottomUp,SEHOP

# Cyberpunk 2077
Set-ProcessMitigation -Name "Cyberpunk2077.exe" -Disable CFG,StrictHandle,BottomUp,SEHOP
```

#### 2. Глобальное отключение CFG для экстремального киберспортивного профиля:

```powershell
# Глобальное отключение Control Flow Guard на уровне всей системы
Set-ProcessMitigation -System -Disable CFG
```

#### 3. Сброс настроек процесса к значениям по умолчанию (Rollback):

```powershell
# Сброс кастомных митигаций для конкретного файла
Set-ProcessMitigation -Name "cs2.exe" -Reset

# Включение CFG на системном уровне
Set-ProcessMitigation -System -Enable CFG
```

---

### 4.4. Импорт и экспорт конфигураций Exploit Protection

Windows позволяет сохранить полную матрицу настроек Exploit Protection в структурированный XML-файл и развертывать ее в один клик.

#### Экспорт текущей конфигурации:
```powershell
Get-ProcessMitigation -RegistryConfigFilePath "D:\winvan\KNOWLEDGE_BASE\exploit_protection_backup.xml"
```

#### Импорт оптимизированного профиля:
Создайте файл `GamingMitigations.xml` со следующим содержимым:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<MitigationPolicy>
  <SystemConfig>
    <ControlFlowGuard Enable="false" />
    <DEP Enable="true" EmulateAtlThunks="false" />
    <ASLR ForceRelocateImages="false" RequireInfo="false" BottomUp="true" HighEntropy="true" />
    <StrictHandle Enable="false" />
    <SEHOP Enable="false" TelemetryOnly="false" />
  </SystemConfig>
  <AppConfig Executable="cs2.exe">
    <ControlFlowGuard Enable="false" />
    <DEP Enable="true" />
    <ASLR ForceRelocateImages="false" />
    <StrictHandle Enable="false" />
  </AppConfig>
  <AppConfig Executable="r5apex.exe">
    <ControlFlowGuard Enable="false" />
    <DEP Enable="true" />
    <ASLR ForceRelocateImages="false" />
  </AppConfig>
</MitigationPolicy>
```

Примените XML-конфигурацию командой:
```powershell
Set-ProcessMitigation -PolicyFilePath "GamingMitigations.xml"
```

---

## 5. Аппаратные Заплатки Уязвимостей CPU (Spectre, Meltdown, MDS, Downfall)

### 5.1. Природа уязвимостей спекулятивного исполнения и Branch Prediction

Начиная с 2018 года в индустрии микропроцессоров разразился кризис архитектурной безопасности. Были обнаружены фундаментальные бреши в логике **спекулятивного исполнения (Speculative Execution)** и предсказания ветвлений (**Branch Prediction**).

```mermaid
flowchart TD
    CPU["Конвейер CPU: Спекулятивное Исполнение"] --> Branch{"Предсказатель Ветвлений (Branch Predictor)"}
    Branch -->|"Спекулятивная ветка (Неверный путь)"| Transient["Транзиторное исполнение инструкций"]
    Transient -->|"Чтение закрытой памяти ядра/чужого процесса"| L1D["Загрузка данных в кэш L1 Data"]
    Transient -->|"Откат состояния регистров (Архитектурный сброс)"| Rollback["Регистры очищены, НО данные остались в Кэше!"]
    Rollback --> SideChannel["Side-Channel Атака: Замер времени доступа к кэшу (Flush+Reload)"]
    SideChannel --> Leak["Утечка секретных данных (Ключи, Пароли)"]
```

#### Классификация основных атак:
1. **Spectre Variant 1 (Bounds Check Bypass - CVE-2017-5753):** Эксплуатация спекулятивного выхода за границы массива.
2. **Spectre Variant 2 (Branch Target Injection - CVE-2017-5715):** Отрава буфера целевых адресов ветвлений (BTB / Indirect Branches).
3. **Meltdown (Rogue Data Cache Load - CVE-2017-5754):** Чтение памяти ядра непривилегированным процессором до завершения проверки прав процессором.
4. **MDS (Microarchitectural Data Sampling / Zombieload / RIDL / Fallout):** Утечка данных из внутренних микроархитектурных буферов (Line Fill Buffers, Load/Store Buffers).
5. **Downfall / GDS (Gather Data Sampling - CVE-2022-40982):** Утечка данных при использовании векторных инструкций сборки `AVX2 / AVX-512 Gather` (`vpgatherdd`, `vgatherdp`).

#### Программные механизмы защиты и их цена:
* **KPTI (Kernel Page Table Isolation):** Полное разделение таблиц страниц пользователя и ядра. На каждый системный вызов (`syscall`) процессор вынужден переключать регистр `CR3` и сбрасывать TLB-кэш, что приводило к потере **15–30% производительности дискового I/O**.
* **IBRS (Indirect Branch Restricted Speculation) / Retpoline:** Принудительная сериализация и изоляция предсказаний ветвлений.
* **Downfall Mitigation:** Блокировка и микрокодовая очистка буферов при выполнении векторных инструкций `Gather`, вызывающая падение скорости AVX-вычислений до **50%**.

---

### 5.2. Реестровые ключи FeatureSettingsOverride и битовые маски

Операционная система Windows предоставляет низкоуровневый интерфейс управления программными заплатками процессора через ветку реестра `Session Manager\Memory Management`.

#### Путь в реестре:
`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management`

```mermaid
classDiagram
    class MemoryManagementRegistry {
        +DWORD FeatureSettingsOverride
        +DWORD FeatureSettingsOverrideMask
    }
```

#### Разбор значений `FeatureSettingsOverride` (DWORD):

| Значение (Hex) | Значение (Dec) | Описание конфигурации | Влияние на безопасность | Влияние на производительность |
| :--- | :--- | :--- | :--- | :--- |
| `0x0` | `0` | **Заводской дефолт Windows.** Все аппаратные и программные заплатки включены. | Максимальная безопасность | Потери до 15–20% на старых CPU |
| `0x3` | `3` | **Отключение Spectre v2 (BTI) и Meltdown (KPTI).** | Риск при запуске непроверенного кода | **+5–20% CPU/IO производительности** на старых CPU |
| `0x48` | `72` | Включение полной защиты с учетом Hyper-Threading / SMT. | Максимальная безопасность | Стандартный оверхед |
| `0x2000000` | `33554432` | **Отключение митигации Downfall (Gather Data Sampling).** | Риск атаки на AVX-инструкции | **Восстановление 100% скорости AVX2/AVX-512** |

#### Значение `FeatureSettingsOverrideMask`:
Всегда устанавливается в `3` (`0x00000003`), что указывает ядру Windows применить битовую маску к первым двум управляющим битам (Spectre v2 и Meltdown).

#### Команды управления через CMD:

```cmd
:: 1. ПОЛНОЕ ОТКЛЮЧЕНИЕ МИТИГАЦИЙ SPECTRE/MELTDOWN (Максимальный FPS для старых CPU)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverride" /t REG_DWORD /d 3 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverrideMask" /t REG_DWORD /d 3 /f

:: 2. ОТКЛЮЧЕНИЕ МИТИГАЦИИ DOWNFALL (Для процессоров Intel 10-го, 11-го поколений)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverride" /t REG_DWORD /d 33554432 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverrideMask" /t REG_DWORD /d 3 /f

:: 3. ВОЗВРАТ К ЗАВОДСКИМ НАСТРОЙКАМ (Включение всех защит)
reg delete "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverride" /f
reg delete "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "FeatureSettingsOverrideMask" /f
```

---

### 5.3. Диагностика через InSpectre и SpeculationControl PowerShell

Для глубокого аудита текущего статуса аппаратных заплаток используются два стандартизированных инструмента.

#### 1. Официальный PowerShell-модуль от Microsoft (`SpeculationControl`):

```powershell
# Установка и запуск аудита митигаций процессора
Install-Module -Name SpeculationControl -Force -Scope CurrentUser
Import-Module SpeculationControl
Get-SpeculationControlSettings
```

*Пример вывода на оптимизированной системе:*
```text
Speculation control settings for CVE-2017-5715 [branch target injection]
Hardware support for branch target injection mitigation is present: True
Windows OS support for branch target injection mitigation is present: True
Windows OS support for branch target injection mitigation is enabled: False (Disabled by Override)

Speculation control settings for CVE-2017-5754 [rogue data cache load]
Hardware requires kernel VA shadowing (KPTI): False (or Disabled by Override)
```

#### 2. Портативная утилита InSpectre (Steve Gibson / GRC):
* **InSpectre** предоставляет мгновенную визуальную индикацию статуса уязвимостей Meltdown и Spectre, а также отображает системную оценку производительности процессора (*System performance: GOOD / SLOW*).
* В утилите присутствуют кнопки переключения *Disable Meltdown Protection* и *Disable Spectre Protection*, которые автоматически модифицируют соответствующие ключи реестра.

---

### 5.4. Сравнительный бенчмаркинг: Старые vs Современные CPU (Intel Core vs AMD Zen)

Влияние отключения аппаратных заплаток фундаментально различается в зависимости от аппаратного поколения кремния.

```mermaid
quadrantChart
    title Степень Выигрыша от Отключения Заплаток vs Поколение CPU
    x-axis "Старая Архитектура" --> "Новейшая Архитектура"
    y-axis "Минимальный Прирост" --> "Огромный Прирост FPS/IO"
    quadrant-1 "Intel 11th Gen (Downfall AVX2 Fix)"
    quadrant-2 "Intel 6th-9th Gen / Zen 1 (Spectre/Meltdown Boost)"
    quadrant-3 "Intel 13th/14th Gen / Zen 4/5 (Кремниевая Защита)"
    quadrant-4 "AMD Zen 2 / Zen 3 (Аппаратная Защита)"
    "i7-7700K / i7-8700K": [0.2, 0.85]
    "Ryzen 5 1600 / 2600": [0.25, 0.70]
    "i9-10900K / i7-11700K": [0.65, 0.55]
    "Ryzen 7 5800X3D": [0.75, 0.20]
    "i9-14900K / Ryzen 7 7800X3D": [0.9, 0.10]
```

#### Анализ поколений процессоров:

1. **Intel 6-го – 9-го поколений (Skylake, Kaby Lake, Coffee Lake: i7-6700K, i7-7700K, i7-8700K, i9-9900K):**
   * Данные процессоры аппаратно **не имеют защиты** от Spectre v2 и Meltdown.
   * Они полагаются на тяжелый программный патч KPTI и микрокодовую заплатку IBRS.
   * **Эффект от отключения (`FeatureSettingsOverride = 3`):**  
     Прирост 4K Random Read в SSD на **20–35%**, рост минимального FPS в играх на **8–18%**, исчезновение фризов при компиляции шейдеров.
2. **Intel 10-го – 11-го поколений (Comet Lake, Rocket Lake: i9-10900K, i7-11700K):**
   * Имеют аппаратную защиту от Meltdown на уровне кремния, но подвержены атаке **Downfall (GDS)**.
   * Патч Downfall срезает до 25% скорости в задачах с AVX2/AVX-512 (рендеринг, эмуляторы RPCS3/Yuzu, физические расчеты).
   * **Рекомендация:** Установка `FeatureSettingsOverride = 33554432` для возврата полной скорости AVX.
3. **Intel 12-го – 14-го поколений (Alder Lake, Raptor Lake: i5-13600K, i7-14700K, i9-14900K):**
   * Имеют аппаратную реализацию **eIBRS** (enhanced IBRS), кремниевую изоляцию страниц и аппаратный иммунитет к Meltdown/MDS/Downfall.
   * **Эффект от отключения:** Погрешность измерений (менее 1%). Отключать заплатки Spectre на этих CPU **не имеет практического смысла**.
4. **AMD Ryzen (Zen 1, Zen+, Zen 2, Zen 3, Zen 4, Zen 5):**
   * Архитектура AMD Zen изначально аппаратным образом **не подвержена Meltdown** (KPTI на AMD процессорах по умолчанию не активен в Windows).
   * На Zen 1/Zen+ патчи Spectre v2 дают слабый оверхед (до 3–5%).
   * Начиная с Zen 2 / Zen 3 / Zen 4 / Zen 5 защита от Branch Target Injection реализована на кремниевом уровне без потерь тактов.
   * **Эффект от отключения:** Около 0–1.5%.

---

## 6. Матрица Принятия Решений: Security vs. Performance

### 6.1. Классификация профилей использования

| Профиль | Описание Сценария Использования | Главный Приоритет | Допустимый Уровень Риска |
| :--- | :--- | :--- | :--- |
| **Tier 1: Pure Esports PC** | Выделенный ПК для киберспорта, турниров, LAN-ивентов. Только Steam, Discord, FACEIT/Vanguard, игры. Никаких банковских операций, серфинга по подозрительным сайтам или открытия почтовых вложений. | **Минимальный Input Lag, максимальный 0.1% Low FPS** | **Высокий** (Компенсируется изолированностью среды) |
| **Tier 2: Hybrid Enthusiast PC** | Домашний ПК: игры, повседневный веб-серфинг, просмотр медиа, Discord, базовые рабочие задачи, Steam. | **Баланс: Высокий FPS без риска заражения malware** | **Умеренный** |
| **Tier 3: Workstation & Finance** | Рабочая станция, офисный ПК, программирование, криптокошельки, коммерческая тайна, корпоративный VPN. | **Абсолютная безопасность и целостность данных** | **Нулевой (Zero Risk)** |

---

### 6.2. Сводная таблица параметров, рисков и выигрыша задержки

| Компонент / Настройка | Рекомендация Tier 1 (Esports) | Рекомендация Tier 2 (Hybrid) | Рекомендация Tier 3 (Work) | Выигрыш Задержки / FPS | Потенциальный Риск |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **VBS / HVCI (Целостность памяти)** | **Отключить (OFF)** | **Отключить (OFF)** | Включить (ON) | **+10–25% к 0.1% Low FPS**, -20 μs DPC Latency | Выполнение неподписанных драйверов ядра |
| **Hyper-V Hypervisor Launch** | **`off` (Выгружен)** | `auto` или `off` | `auto` (Включен) | **-5–12 ns к задержке RAM**, отсутствие VM-Exits | Невозможность запуска WSL2 / Sandbox |
| **Microsoft Defender Real-Time** | **Отключить (dControl)** | Оставить + **Исключения** | Включить (ON) | **-15–40 ms I/O спайков**, разгрузка фонового CPU | Риск запуска неизученных вредоносных файлов |
| **Исключения папок/процессов** | Не актуально (Def OFF) | **Настроить для игр** | Настроить для игр | **Устранение фризов** при стриминге ассетов | Минимальный (в пределах папок игр) |
| **Control Flow Guard (CFG)** | **Отключить System/App** | **Отключить Per-App** | Включить (ON) | **+3–6% CPU FPS**, разгрузка vtable/indirect вызовов | Эксплуатация ROP-цепочек в памяти процесса |
| **Data Execution Prevention (DEP)** | **Оставить включенным** | **Оставить включенным** | Оставить включенным | **0% потерь** (Чисто аппаратный NX-бит) | Падение защиты памяти при отключении |
| **Spectre/Meltdown (Старые CPU: Intel 6-9th)** | **Отключить (`Override=3`)** | Оставить дефолт | Оставить дефолт | **+8–18% FPS, +30% NVMe I/O** | Side-channel чтение памяти ядра из браузера |
| **Spectre/Meltdown (Новые CPU: 12-14th, Zen 3-5)** | Оставить дефолт | Оставить дефолт | Оставить дефолт | Погрешность (0–1%) | Нет смысла отключать |
| **Downfall Fix (Intel 10-11th Gen)** | **Отключить патч** | **Отключить патч** | Оставить включенным | **+15–30% скорости AVX2/AVX-512** | Side-channel чтение данных через Gather |

---

## 7. Практическая Реализация: Скрипты Оптимизации и Полного Отката

### 7.1. Скрипт экстремальной оптимизации (Esports Gaming Profile)

Сохраните данный скрипт как `Apply_Esports_Security_Tweaks.ps1` и запустите в **PowerShell от имени Администратора**:

```powershell
<#
================================================================================
  WINDOWS OPTIMIZER: ESPORTS SECURITY PROFILE (TIER 1)
  Внимание: Предназначено для выделенных игровых систем.
================================================================================
#>

Write-Host "[-] Запуск применения киберспортивного профиля безопасности..." -ForegroundColor Cyan

# 1. Отключение VBS и HVCI в реестре
Write-Host "[1/6] Отключение VBS, HVCI (Memory Integrity) и Credential Guard..." -ForegroundColor Yellow
$DGPath = "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard"
$HVCXPath = "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity"
$CGPath = "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\CredentialGuard"

If (!(Test-Path $DGPath)) { New-Item -Path $DGPath -Force | Out-Null }
If (!(Test-Path $HVCXPath)) { New-Item -Path $HVCXPath -Force | Out-Null }
If (!(Test-Path $CGPath)) { New-Item -Path $CGPath -Force | Out-Null }

Set-ItemProperty -Path $DGPath -Name "EnableVirtualizationBasedSecurity" -Value 0 -Type DWord -Force
Set-ItemProperty -Path $DGPath -Name "RequirePlatformSecurityFeatures" -Value 0 -Type DWord -Force
Set-ItemProperty -Path $DGPath -Name "Locked" -Value 0 -Type DWord -Force
Set-ItemProperty -Path $HVCXPath -Name "Enabled" -Value 0 -Type DWord -Force
Set-ItemProperty -Path $HVCXPath -Name "WasEnabledBy" -Value 0 -Type DWord -Force
Set-ItemProperty -Path $CGPath -Name "Enabled" -Value 0 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "LsaCfgFlags" -Value 0 -Type DWord -Force

# 2. Настройка загрузчика BCD (Выгрузка Hyper-V)
Write-Host "[2/6] Конфигурация BCDEdit (hypervisorlaunchtype off)..." -ForegroundColor Yellow
bcdedit /set hypervisorlaunchtype off | Out-Null
bcdedit /set vsmlaunchtype off | Out-Null

# 3. Отключение системного Control Flow Guard (CFG)
Write-Host "[3/6] Отключение Control Flow Guard (CFG)..." -ForegroundColor Yellow
Set-ProcessMitigation -System -Disable CFG

# 4. Точечная оптимизация киберспортивных игр (Exploit Protection)
Write-Host "[4/6] Применение точечных митигаций для игр..." -ForegroundColor Yellow
$Games = @("cs2.exe", "r5apex.exe", "VALORANT-Win64-Shipping.exe", "cod.exe", "FortniteClient-Win64-Shipping.exe")
foreach ($Game in $Games) {
    Set-ProcessMitigation -Name $Game -Disable CFG,StrictHandle,BottomUp,SEHOP -ErrorAction SilentlyContinue
}

# 5. Оптимизация процессора для старых архитектур (Spectre/Meltdown Override)
Write-Host "[5/6] Проверка архитектуры процессора для FeatureSettingsOverride..." -ForegroundColor Yellow
$CPU = Get-CimInstance Win32_Processor
if ($CPU.Manufacturer -like "*Intel*" -and $CPU.Name -match "i[3579]-(6|7|8|9)\d{3}") {
    Write-Host "    [!] Обнаружен процессор Intel 6-9 поколения. Отключение Spectre/Meltdown патчей..." -ForegroundColor Green
    Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "FeatureSettingsOverride" -Value 3 -Type DWord -Force
    Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "FeatureSettingsOverrideMask" -Value 3 -Type DWord -Force
} elseif ($CPU.Manufacturer -like "*Intel*" -and $CPU.Name -match "i[3579]-(10|11)\d{3}") {
    Write-Host "    [!] Обнаружен процессор Intel 10-11 поколения. Отключение заплатки Downfall..." -ForegroundColor Green
    Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "FeatureSettingsOverride" -Value 33554432 -Type DWord -Force
    Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "FeatureSettingsOverrideMask" -Value 3 -Type DWord -Force
} else {
    Write-Host "    [i] Современный процессор (аппаратная кремниевая защита). Дополнительных правок не требуется." -ForegroundColor Gray
}

# 6. Добавление игровых исключений в Defender
Write-Host "[6/6] Добавление папок библиотек в исключения Microsoft Defender..." -ForegroundColor Yellow
$ExclusionPaths = @(
    "C:\Program Files (x86)\Steam",
    "C:\Riot Games",
    "C:\Program Files\Epic Games",
    "$env:LOCALAPPDATA\NVIDIA\DXCache",
    "$env:LOCALAPPDATA\AMD\DxCache",
    "$env:TEMP"
)
foreach ($Path in $ExclusionPaths) {
    if (Test-Path $Path) {
        Add-MpPreference -ExclusionPath $Path -ErrorAction SilentlyContinue
    }
}

Write-Host "`n[✓] Киберспортивный профиль успешно применен! Перезагрузите компьютер." -ForegroundColor Green
```

---

### 7.2. Скрипт сбалансированной оптимизации (Enthusiast Hybrid Profile)

Сохраните данный скрипт как `Apply_Hybrid_Security_Tweaks.ps1`:

```powershell
<#
================================================================================
  WINDOWS OPTIMIZER: HYBRID ENTHUSIAST PROFILE (TIER 2)
  Баланс: Высокая отзывчивость в играх + Надежная безопасность в сети.
================================================================================
#>

Write-Host "[-] Применение сбалансированного профиля безопасности..." -ForegroundColor Cyan

# 1. Отключение только HVCI (Memory Integrity) - VBS оставляем доступным
Write-Host "[1/4] Отключение HVCI (Целостности Памяти)..." -ForegroundColor Yellow
$HVCXPath = "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity"
If (!(Test-Path $HVCXPath)) { New-Item -Path $HVCXPath -Force | Out-Null }
Set-ItemProperty -Path $HVCXPath -Name "Enabled" -Value 0 -Type DWord -Force

# 2. Выгрузка гипервизора (при сохранении работоспособности Defender)
Write-Host "[2/4] Отключение гипервизора в BCD для устранения задержки SLAT..." -ForegroundColor Yellow
bcdedit /set hypervisorlaunchtype off | Out-Null

# 3. Точечное отключение CFG только для игр (Системный CFG остается ВКЛЮЧЕННЫМ)
Write-Host "[3/4] Точечное отключение CFG для игровых процессов..." -ForegroundColor Yellow
Set-ProcessMitigation -System -Enable CFG
$Games = @("cs2.exe", "r5apex.exe", "VALORANT-Win64-Shipping.exe", "cod.exe")
foreach ($Game in $Games) {
    Set-ProcessMitigation -Name $Game -Disable CFG -ErrorAction SilentlyContinue
}

# 4. Настройка исключений Defender для устранения I/O спайков
Write-Host "[4/4] Настройка Defender (Исключения + Снижение фоновой нагрузки)..." -ForegroundColor Yellow
Set-MpPreference -DisableArchiveScanning $true -ErrorAction SilentlyContinue
Set-MpPreference -ScanAvgCPULoadFactor 15 -ErrorAction SilentlyContinue

$Drives = Get-PSDrive -PSProvider FileSystem
foreach ($Drive in $Drives) {
    $SteamPath = Join-Path $Drive.Root "SteamLibrary"
    if (Test-Path $SteamPath) {
        Add-MpPreference -ExclusionPath $SteamPath -ErrorAction SilentlyContinue
    }
}

Write-Host "`n[✓] Сбалансированный профиль применен! Перезагрузите ПК." -ForegroundColor Green
```

---

### 7.3. Скрипт 100% восстановления заводских параметров (Factory Rollback)

Сохраните данный скрипт как `Rollback_Security_To_Default.ps1` для возврата всех компонентов защиты в исходное состояние:

```powershell
<#
================================================================================
  WINDOWS OPTIMIZER: FACTORY SECURITY ROLLBACK (TIER 3 / DEFAULT)
  Возврат всех системных механизмов защиты к заводским значениям Microsoft.
================================================================================
#>

Write-Host "[-] Запуск полного отката настроек безопасности к заводским..." -ForegroundColor Cyan

# 1. Включение VBS и HVCI в реестре
Write-Host "[1/5] Сброс параметров DeviceGuard и HVCI..." -ForegroundColor Yellow
$DGPath = "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard"
$HVCXPath = "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity"

Set-ItemProperty -Path $DGPath -Name "EnableVirtualizationBasedSecurity" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
Set-ItemProperty -Path $HVCXPath -Name "Enabled" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue

# 2. Возврат автозапуска Hyper-V в BCD
Write-Host "[2/5] Восстановление hypervisorlaunchtype auto в BCD..." -ForegroundColor Yellow
bcdedit /set hypervisorlaunchtype auto | Out-Null
bcdedit /deletevalue vsmlaunchtype -ErrorAction SilentlyContinue | Out-Null

# 3. Восстановление всех параметров Exploit Protection к заводским
Write-Host "[3/5] Сброс Exploit Protection (Включение CFG, DEP, ASLR)..." -ForegroundColor Yellow
Set-ProcessMitigation -System -Enable CFG,DEP,BottomUp,SEHOP

$Games = @("cs2.exe", "r5apex.exe", "VALORANT-Win64-Shipping.exe", "cod.exe", "FortniteClient-Win64-Shipping.exe")
foreach ($Game in $Games) {
    Set-ProcessMitigation -Name $Game -Reset -ErrorAction SilentlyContinue
}

# 4. Удаление переопределений CPU Mitigations (Spectre/Meltdown/Downfall)
Write-Host "[4/5] Восстановление заводских заплаток CPU (Удаление FeatureSettingsOverride)..." -ForegroundColor Yellow
Remove-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "FeatureSettingsOverride" -ErrorAction SilentlyContinue
Remove-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" -Name "FeatureSettingsOverrideMask" -ErrorAction SilentlyContinue

# 5. Восстановление политик Microsoft Defender
Write-Host "[5/5] Включение всех компонентов Defender и очистка политик..." -ForegroundColor Yellow
Remove-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender" -Name "DisableAntiSpyware" -ErrorAction SilentlyContinue
Remove-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender" -Name "DisableRealtimeMonitoring" -ErrorAction SilentlyContinue
Remove-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" -Recurse -Force -ErrorAction SilentlyContinue

Set-MpPreference -DisableArchiveScanning $false -ErrorAction SilentlyContinue
Set-MpPreference -ScanAvgCPULoadFactor 50 -ErrorAction SilentlyContinue

Write-Host "`n[✓] Заводские настройки безопасности успешно восстановлены! Перезагрузите ПК." -ForegroundColor Green
```

---

## 8. Совместимость с Античитами (Vanguard, FACEIT, EAC, BattlEye)

Вопрос модификации механизмов безопасности Windows тесно связан с требованиями современных античитов уровня ядра (**Kernel-Level Anti-Cheats / Ring 0 Drivers**).

```mermaid
flowchart LR
    subgraph AntiCheats["Современные Античиты Ядра"]
        VG["Riot Vanguard (Valorant / LoL)"]
        FC["FACEIT AC (CS2)"]
        EAC["Easy Anti-Cheat (Apex / Fortnite)"]
        BE["BattlEye (R6 Siege / DayZ)"]
    end

    subgraph Requirements["Системные Требования на Windows 11"]
        TPM["TPM 2.0 (Аппаратный или fTPM)"]
        SB["Secure Boot (UEFI Безопасная Загрузка)"]
        HVCI["HVCI / Memory Integrity (Целостность Памяти)"]
    end

    VG --> TPM
    VG --> SB
    VG -.->|"Опционально (Требуется на редких турнирах)"| HVCI
    FC --> TPM
    FC --> SB
    EAC --> SB
```

#### Детальный разбор античитов:

1. **Riot Vanguard (VALORANT, League of Legends):**
   * **На Windows 11:** В обязательном порядке требует активный модуль **TPM 2.0** и включенный режим **Secure Boot** в UEFI BIOS (ошибка `VAN9001` / `VAN9003` при их отсутствии).
   * **Отношение к VBS / HVCI:** **HVCI НЕ требуется для обычной игры в Valorant!** Вы можете безопасно отключать VBS и HVCI через реестр и BCD — игра и античит будут работать идеально.
   * *Исключение:* На некоторых официальных киберспортивных турнирах VCT Vanguard может принудительно запрашивать VBS.
2. **FACEIT Anti-Cheat (Counter-Strike 2):**
   * Требует включенный **Secure Boot** и **TPM 2.0** на Windows 11.
   * **HVCI и VBS не требуются** (более того, большинство про-игроков на FACEIT намеренно отключают VBS для стабилизации фреймтайма).
3. **Easy Anti-Cheat (EAC) и BattlEye:**
   * Полностью совместимы с отключенными VBS, HVCI, Defender и модифицированными митигациями CFG/DEP.

> [!IMPORTANT]
> Ни один из популярных античитов не выдает блокировок за отключение VBS/HVCI, снятие оверхеда CFG или очистку реестра `FeatureSettingsOverride`. Это штатные параметры администрирования ОС Windows.

---

## 9. Источники и Справочные Материалы

1. **Microsoft Learn (MSDN):**
   * *Virtualization-based Security (VBS) Architecture:* [learn.microsoft.com/en-us/windows-hardware/design/device-experiences/oem-vbs](https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/oem-vbs)
   * *Hypervisor-Enforced Code Integrity (HVCI):* [learn.microsoft.com/en-us/windows/security/hardware-security/enable-virtualization-based-security-of-code-integrity](https://learn.microsoft.com/en-us/windows/security/hardware-security/enable-virtualization-based-security-of-code-integrity)
   * *Mitigate speculative execution side-channel vulnerabilities (KB4073119):* [support.microsoft.com/en-us/topic/kb4073119](https://support.microsoft.com/en-us/topic/kb4073119)
   * *Process Mitigation Cmdlets (Set-ProcessMitigation):* [learn.microsoft.com/en-us/powershell/module/processmitigations/set-processmitigation](https://learn.microsoft.com/en-us/powershell/module/processmitigations/set-processmitigation)
2. **Микроархитектурные исследования:**
   * *Intel 64 and IA-32 Architectures Software Developer's Manual (Volume 3C: VMX Instructions & EPT).*
   * *AMD64 Architecture Programmer's Manual (Volume 2: System Programming & Nested Paging).*
   * *Downfall (Gather Data Sampling) Research Paper (Daniel Moghimi):* [downfallattack.com](https://downfallattack.com/)
3. **Бенчмарки и оверклокерские лаборатории:**
   * *Tom's Hardware:* «Windows 11 VBS Gaming Performance Investigation».
   * *Blur Busters (Mark Rejhon):* «Input Lag & Frame Pacing Under Hardware Virtualization».
   * *GRC (Gibson Research Corporation):* «InSpectre Utility & Speculative Execution Analysis».
   * *Calypto & Fr33thy Windows Latency Benchmarks (Overclock.net / YouTube).*
