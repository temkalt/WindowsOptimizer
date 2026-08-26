# Глава 11: Архитектура служб Windows, системный деблоатинг, вырезка телеметрии и оптимизация планировщика задач

---

## 1. Архитектура подсистемы служб Windows

### 1.1. Service Control Manager (SCM) и svchost.exe Mechanics

Службы Windows (Windows Services) — это долгоживущие исполняемые процессы, работающие в собственных сессиях Windows (преимущественно в изолированной Session 0) без обязательного наличия интерактивного графического интерфейса пользователя. Архитектурным ядром управления жизненным циклом служб является **Service Control Manager (SCM)**, исполняемый в рамках процесса `%SystemRoot%\System32\services.exe`.

```
+-------------------------------------------------------------------------+
|                              Session 0                                  |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |             Service Control Manager (services.exe)                |  |
|  +-------------------------------------------------------------------+  |
|         |                     |                     |                   |
|         v (RPC / LPC)         v (RPC / LPC)         v (RPC / LPC)       |
|  +--------------+     +-------------------+     +--------------------+  |
|  | Standalone   |     |    svchost.exe    |     |    svchost.exe     |  |
|  | Service EXE  |     |  (Group / Single) |     |  (Group / Single)  |  |
|  | (lsass.exe,  |     | +---------------+ |     | +----------------+ |  |
|  | spoolsv.exe) |     | | Service DLL A | |     | | Service DLL B  | |  |
|  +--------------+     | +---------------+ |     | +----------------+ |  |
|                       +-------------------+     +--------------------+  |
+-------------------------------------------------------------------------+
```

SCM выполняет следующие низкоуровневые функции:
1. Поддержание базы данных установленных служб и драйверов (считываемой из ветки реестра `HKLM\SYSTEM\CurrentControlSet\Services`).
2. Запуск сервисных процессов на этапе инициализации операционной системы в соответствии с их фазами загрузки (`ServiceGroupOrder`, `List` в `HKLM\SYSTEM\CurrentControlSet\Control\ServiceGroupOrder`).
3. Передачу управляющих команд (Start, Stop, Pause, Continue, Interrogate, Custom Control Codes) через RPC/LPC каналы в зарегистрированные Service Dispatch Table процессов.
4. Отслеживание сбоев служб и выполнение действий восстановления (Service Recovery Actions: перезапуск службы, запуск программы, перезагрузка хоста).
5. Разрешение графа межсервисных зависимостей (`DependOnService`, `DependOnGroup`).

#### Механизм хостинга svchost.exe и порог разделения памяти (SvcHostSplitThresholdInKB)
Исторически (начиная с Windows 2000 до Windows 10 версии 1607) службы, скомпилированные в виде DLL-библиотек, объединялись в общие процессы `svchost.exe` по функциональным группам (например, `netsvcs`, `LocalService`, `NetworkService`, `LocalSystemNetworkRestricted`). Это делалось для экономии оперативной памяти на системах с объемом ОЗУ от 64 МБ до 2 ГБ, снижая накладные расходы на создание отдельных виртуальных адресных пространств и структур PEB/TEB.

Начиная с **Windows 10 Version 1703 (Creators Update)**, Microsoft кардинально изменила архитектуру группировки:
- Если объем установленной физической оперативной памяти превышает **3.5 ГБ (3500 МБ)**, SCM автоматически переключается в режим **Per-Service Process Isolation** (изоляция каждой службы в собственный экземпляр `svchost.exe`).
- Системный параметр, управляющий этим порогом:
  ```text
  Key: HKLM\SYSTEM\CurrentControlSet\Control
  Value: SvcHostSplitThresholdInKB
  Type: REG_DWORD
  Default: 0x00380000 (3670016 KB ≈ 3.5 GB)
  ```

**Влияние разделения svchost на задержки и производительность:**
- **Изоляция сбоев:** Падение одной DLL (например, утечка памяти в сетевой телеметрии) не крашит критические службы, находящиеся в той же группе.
- **Безопасность и контроль привилегий:** Каждый процесс `svchost.exe` получает свой уникальный Process Token, Integrity Level и AppContainer/Capability SID.
- **Процессорный оверхед (Context Switches & TLB Invalidation):** Увеличение количества активных процессов со 15–20 до 70–100 приводит к возрастанию накладных расходов на переключение контекстов процессора (Thread Context Switches) и частой инвалидации Translation Lookaside Buffer (TLB Shootdowns / Flush), если множество фоновых потоков регулярно просыпаются по таймерам.
- **Память:** Расход памяти увеличивается на 150–300 МБ из-за дублирования дескрипторов кучи (Heap), таблиц дескрипторов (Handle Tables) и загруженных модулей CRT/Win32 базовых библиотек.

---

### 1.2. Типы запуска служб и триггерные события (Trigger-Started Services)

В реестре тип запуска службы кодируется значением DWORD `Start` в подразделе `HKLM\SYSTEM\CurrentControlSet\Services\<ServiceName>`:

| Значение `Start` | Символическое имя | Описание и фаза загрузки |
| :--- | :--- | :--- |
| `0x00000000` (`0`) | `SERVICE_BOOT_START` | Загружается загрузчиком ОС (`winload.efi`). Применяется исключительно для критических драйверов ядра (дисковые контроллеры, фильтры NVMe/SATA, ACPI). |
| `0x00000001` (`1`) | `SERVICE_SYSTEM_START` | Загружается ядром NT (`ntoskrnl.exe`) во время инициализации подсистем ввода-вывода. Драйверы устройств и базовые фильтры. |
| `0x00000002` (`2`) | `SERVICE_AUTO_START` | Запускается SCM на этапе загрузки операционной системы до интерактивного входа пользователя в систему. |
| `0x00000003` (`3`) | `SERVICE_DEMAND_START` | Ручной запуск (Manual). Служба запускается только при явном запросе приложения, другой службы или по наступлению аппаратного/программного триггера. |
| `0x00000004` (`4`) | `SERVICE_DISABLED` | Служба полностью отключена. SCM возвращает ошибку `ERROR_SERVICE_DISABLED` (1058) при попытке запуска. |

#### Delayed Auto-Start
Для служб с типом запуска `Automatic (2)` может быть установлен дополнительный параметр:
- `DelayedAutoStart` (`REG_DWORD` = `1`) в ветке службы.
- SCM помещает такие службы в отдельную очередь с низким приоритетом ввода-вывода и запускает их только спустя фиксированный таймаут (по умолчанию 120 секунд, настраивается через `AutoStartDelay` в `HKLM\SYSTEM\CurrentControlSet\Control`) после завершения начальной инициализации автозагрузки, чтобы сгладить пиковую нагрузку на накопитель и процессор.

#### Trigger-Started Services (Триггерный запуск)
Начиная с Windows 7, внедрен механизм триггеров (`Service Trigger Events`), исключающий необходимость постоянного нахождения службы в оперативной памяти. Служба регистрируется с типом `Manual (3)`, но SCM связывает ее запуск с системными событиями:
1. Появление устройства с заданным Device Interface Class GUID (например, подключение USB-устройства, Bluetooth адаптера).
2. Подключение к сети или смена сетевого профиля (Domain / Private / Public / Captive Portal).
3. Изменение состояния групповой политики (Group Policy Trigger).
4. Регистрация кастомного ETW-события (Event Tracing for Windows) или уведомления Windows Notification Facility (WNF).
5. Открытие первого RPC/LPC порта или именованного пайпа (Named Pipe).

---

### 1.3. Влияние фоновых служб на DPC/ISR, Context Switches и 1% Lows

Любая активная служба Windows, работающая в фоновом режиме, содержит один или несколько потоков выполнения (Threads). Даже если утилизация CPU службой составляет условные "0.1%", ее внутреннее поведение создает измеримый ущерб для игрового рендеринга и систем реального времени:

1. **Context Switches & Cache Pollution:**
   - Когда поток службы просыпается по кванту времени планировщика или сигналу таймера, ядро переключает контекст ядра (`SwapContext`).
   - Данные потока службы вытесняют из кэшей L1 Data (32-48 КБ), L1 Instruction (32-64 КБ) и L2/L3 кэшей процессора горячие данные игрового цикла рендеринга (D3D11/D3D12 Render Threads, Simulation Thread, Physics Engine).
   - При возврате управления игровому потоку процессор сталкивается с серией **L1/L2 Cache Misses**, что приводит к простою вычислительных конвейеров (Pipeline Stalls) на 50–200 наносекунд в ожидании выборки данных из L3 или DRAM.

2. **DPC / ISR Spikes & System Latency:**
   - Некоторые службы (например, сетевые службы, подсистемы диагностики, сборщики журналов ETW) взаимодействуют с драйверами через запросы IRP (I/O Request Packets).
   - Обработка прерываний сетевых карт, дисковых контроллеров и синтетических программных прерываний генерирует вызовы **DPC (Deferred Procedure Calls)**. Если DPC-рутина выполняется дольше 100–500 микросекунд, она блокирует ядро CPU от выполнения пользовательских задач, вызывая микрозадержку обработки ввода мыши и скачки времени кадра (Frame Time Spikes).

3. **Disk I/O Interference & Lock Contention:**
   - Службы вроде `DiagTrack`, `WSearch`, `SysMain` и `WerSvc` выполняют непрерывные или периодические дисковые операции ввода-вывода (сброс логов `.etl`, индексация метаданных NTFS, сжатие страниц памяти).
   - Даже на высокоскоростных NVMe SSD фоновые операции I/O вызывают конкуренцию за системные спинлоки ядра NTFS/Storage Stack (`ntfs.sys`, `fltmgr.sys`), приводя к просадкам метрик **0.1% Low FPS** и **1% Low FPS** в момент подгрузки игровых ассетов (Asset Streaming Stutters).

---

## 2. Классификация служб: Category A (Критические / Do Not Touch)

Категорически запрещено отключать или переводить в некорректный режим следующие службы. Их модификация гарантированно приводит к BSOD, потере сетевого стека, невозможности входа в учетную запись или отказу античит-систем.

```
+-------------------------------------------------------------------------------+
|                      CATEGORY A: CRITICAL SERVICES MATRIX                     |
+---------------------+-------------------+-------------------------------------+
| Service Name        | Display Name      | Critical Function / Fatal Outcome   |
+---------------------+-------------------+-------------------------------------+
| RpcSs / RpcEptMapper| Remote Procedure  | Core Windows IPC Bus. Disabling     |
|                     | Call              | causes immediate unbootable system. |
+---------------------+-------------------+-------------------------------------+
| PlugPlay            | Plug and Play     | Hardware enumeration & PCIe routing.|
+---------------------+-------------------+-------------------------------------+
| DcomLaunch          | DCOM Server       | COM/OLE object activation engine.   |
|                     | Process Launcher  | System crashes on startup.          |
+---------------------+-------------------+-------------------------------------+
| AudioSrv            | Windows Audio     | Core WASAPI/Audio engine. Total loss|
| AudioEndpointBuilder| Endpoint Builder  | of sound, DirectSound/WASAPI crash. |
+---------------------+-------------------+-------------------------------------+
| SamSs               | Security Accounts | User authorization, credential store|
|                     | Manager           | LSASS crash, unable to log in.      |
+---------------------+-------------------+-------------------------------------+
| CryptSvc            | Cryptographic     | PE/Driver signature verification.   |
|                     | Services          | EasyAntiCheat, BattlEye & GPU fail. |
+---------------------+-------------------+-------------------------------------+
| EventLog            | Windows Event Log | Kernel event routing & ETW engine.  |
|                     |                   | Disabling breaks D3D, DWM, AntiCheat|
+---------------------+-------------------+-------------------------------------+
| Schedule            | Task Scheduler    | Kernel timers, RPC maintenance.     |
|                     |                   | Breaking update & servicing stack.  |
+---------------------+-------------------+-------------------------------------+
| ProfSvc             | User Profile      | Loading registry hives & user state.|
|                     | Service           | System boots into temporary profile.|
+---------------------+-------------------+-------------------------------------+
| CoreMessaging...    | CoreMessaging     | System XAML, Modern App UI & DWM.   |
|                     | Registrar         | Complete shell freeze on Win 10/11. |
+---------------------+-------------------+-------------------------------------+
```

### Детальный технический анализ критических служб:

1. **`RpcSs` / `RpcEptMapper` / `DcomLaunch` (Remote Procedure Call & DCOM Launcher)**
   - **Реестр:** `HKLM\SYSTEM\CurrentControlSet\Services\RpcSs`
   - **Защита:** Защищены драйвером безопасности ядра. Отключение приводит к полной остановке взаимодействия между процессами Windows. При загрузке ОС зависает на этапе `winlogon.exe`, выдавая BSOD `0xC000021A` (STATUS_SYSTEM_PROCESS_TERMINATED).

2. **`PlugPlay` (Plug and Play)**
   - **Реестр:** `HKLM\SYSTEM\CurrentControlSet\Services\PlugPlay`
   - **Архитектура:** Отвечает за опрос шин PCIe, USB, Thunderbolt, загрузку драйверов `ACPI.sys`, обнаружение дисплеев и перераспределение прерываний MSI/MSI-X. Отключение блокирует инициализацию графического процессора и периферии.

3. **`AudioSrv` и `AudioEndpointBuilder` (Windows Audio Service)**
   - **Реестр:** `HKLM\SYSTEM\CurrentControlSet\Services\AudioSrv`
   - **Архитектура:** Управляет Windows Audio Session API (WASAPI), Spatial Sound, маршрутизацией аудиопотоков в реальном времени. Без `AudioEndpointBuilder` драйверы звуковых карт (Realtek, Focusrite, Creative) не могут построить граф конечных точек; игры падают при инициализации FMOD/Wwise/XAudio2.

4. **`SamSs` (Security Accounts Manager) и `lsass.exe`**
   - **Реестр:** `HKLM\SYSTEM\CurrentControlSet\Services\SamSs`
   - **Архитектура:** Обеспечивает проверку дескрипторов безопасности (Security Identifiers / SID), списков контроля доступа (ACL) и хэшей учетных записей. Отключение вызывает немедленный крах подсистемы безопасности LSA с перезагрузкой системы.

5. **`CryptSvc` (Cryptographic Services)**
   - **Реестр:** `HKLM\SYSTEM\CurrentControlSet\Services\CryptSvc`
   - **Архитектура:** Обеспечивает базу данных каталогов подписанных файлов (`CatDB`), проверку цифровых подписей WHQL для драйверов и сертификатов TLS.
   - **Античиты:** Современные античиты на уровне ядра (**Easy Anti-Cheat, BattlEye, Riot Vanguard, Ricochet**) выполняют валидацию целостности системных DLL и игровых бинарников через CryptSvc API (`WinVerifyTrust`). При отключении службы запуск игр блокируется с ошибками `Untrusted system file` или `Signature check failed`.

6. **`EventLog` (Windows Event Log)**
   - **Реестр:** `HKLM\SYSTEM\CurrentControlSet\Services\EventLog`
   - **Архитектура:** Является не просто "сборщиком текстовых логов", а диспетчером глобальной шины ETW (Event Tracing for Windows).
   - **Миф о "бусте от отключения EventLog":** Отключение службы `EventLog` в Windows 10/11 нарушает работу DWM (Desktop Window Manager), выключает системные механизмы синхронизации графических драйверов, ломает установку драйверов NVIDIA/AMD и гарантированно блокирует работу большинства античитов.

7. **`Schedule` (Task Scheduler)**
   - **Реестр:** `HKLM\SYSTEM\CurrentControlSet\Services\Schedule`
   - **Архитектура:** Планировщик задач тесно интегрирован в ядро NT (`ntoskrnl.exe`). Он управляет выравниванием фоновых таймеров, триггерным вызовом драйверов и поддержкой подсистемы COM+. Попытка его удаления или полного отключения в реестре разрушает работу WinGet, Windows Store, подсистемы активации и многих фоновых игровых лаунчеров (Steam, Battle.net).

---

## 3. Классификация служб: Category B (Безопасное отключение для Gaming PC)

Службы категории B не участвуют в базовом функционировании ядра, драйверов и игрового пайплайна. Их отключение снижает фоновую активность дисковой подсистемы, устраняет ненужные засыпания/просыпания потоков (Timer Resolution wake-ups) и освобождает ресурсы процессора.

```
+---------------------------------------------------------------------------------------------------------+
|                                 CATEGORY B: SAFE TO DISABLE (GAMING PC)                                 |
+--------------------+----------------------------+---------------+---------------+-----------------------+
| Service Name       | Registry Key Name          | Default Start | Optimal Start | Primary Target / Loss |
+--------------------+----------------------------+---------------+---------------+-----------------------+
| DiagTrack          | DiagTrack                  | 2 (Auto)      | 4 (Disabled)  | Windows Telemetry/UTC |
| dmwappushservice   | dmwappushservice           | 3 (Manual)    | 4 (Disabled)  | WAP Push Telemetry    |
| WSearch            | WSearch                    | 2 (Auto)      | 4 (Disabled)  | Disk Indexer / Search |
| Spooler            | Spooler                    | 2 (Auto)      | 4 (Disabled)  | Print Spooler         |
| Fax                | Fax                        | 3 (Manual)    | 4 (Disabled)  | Fax Machine Engine    |
| RemoteRegistry     | RemoteRegistry             | 4 (Disabled)  | 4 (Disabled)  | Remote Reg Access     |
| SCardSvr           | SCardSvr                   | 3 (Manual)    | 4 (Disabled)  | Smart Cards           |
| CertPropSvc        | CertPropSvc                | 3 (Manual)    | 4 (Disabled)  | Smart Card Certs      |
| SensorService      | SensorService              | 3 (Manual)    | 4 (Disabled)  | Desktop Ambient Light |
| SensorsDataService | SensorsDataService         | 3 (Manual)    | 4 (Disabled)  | Sensor Data Broker    |
| SensorDataService  | SensorDataService          | 3 (Manual)    | 4 (Disabled)  | Sensor Data Channel   |
| lfsvc              | lfsvc                      | 3 (Manual)    | 4 (Disabled)  | Geolocation Framework |
| WerSvc             | WerSvc                     | 3 (Manual)    | 4 (Disabled)  | Error Reporting / Dump|
| PcaSvc             | PcaSvc                     | 2 (Auto)      | 4 (Disabled)  | Compatibility Engine  |
| TrkWks             | TrkWks                     | 2 (Auto)      | 4 (Disabled)  | NTFS Link Tracking    |
| RetailDemo         | RetailDemo                 | 3 (Manual)    | 4 (Disabled)  | Store Kiosk Demo      |
| SysMain            | SysMain                    | 2 (Auto)      | 4 (Disabled)* | Superfetch / Prefetch |
| DPS                | DPS                        | 2 (Auto)      | 4 (Disabled)  | Diagnostic Policy     |
| WdiServiceHost     | WdiServiceHost             | 3 (Manual)    | 4 (Disabled)  | Diagnostic Host       |
| WdiSystemHost      | WdiSystemHost              | 3 (Manual)    | 4 (Disabled)  | Diagnostic Sys Host   |
| MapsBroker         | MapsBroker                 | 2 (Auto/Del)  | 4 (Disabled)  | Offline Maps Broker   |
+--------------------+----------------------------+---------------+---------------+-----------------------+
* Примечание по SysMain: см. детальный анализ ниже.
```

### Техническое обоснование отключения ключевых служб Category B:

1. **`DiagTrack` (Connected User Experiences and Telemetry / UTC)**
   - **DLL:** `diagtrack.dll`
   - **Функция:** Сбор метрик производительности, телеметрии использования приложений, дампов трассировок ETW и отправка их на серверы Microsoft Data Management.
   - **Влияние на задержку:** Вызывает спорадические всплески активности процессора и диска при записи файлов `.etl` в каталог `%ProgramData%\Microsoft\Diagnosis`. Отключение абсолютно безопасно для локального ПК.

2. **`dmwappushservice` (Device Management Wireless Application Protocol Push)**
   - **DLL:** `dmwappushsvc.dll`
   - **Функция:** Маршрутизация WAP push-сообщений и передача телеметрии корпоративного управления MDM. Полностью бесполезна на домашнем/игровом компьютере.

3. **`WSearch` (Windows Search)**
   - **EXE:** `SearchIndexer.exe`
   - **Функция:** Непрерывный мониторинг файловой системы NTFS через USN Journal и построение индексов содержимого файлов для мгновенного поиска.
   - **Влияние на задержку:** Основной источник непредвиденных дисковых задержек. В моменты записи новых файлов или фонового обновления индекса `SearchIndexer.exe` потребляет вычислительные ресурсы и конкурирует с играми за доступ к SSD.
   - **Компромисс:** Отключение делает невозможным быстрый поиск содержимого внутри документов и замедляет поиск в меню Пуск. Для чисто игровых сборок рекомендуется полное отключение (`Disabled`).

4. **`WerSvc` (Windows Error Reporting Service)**
   - **DLL:** `wersvc.dll`
   - **Функция:** Перехват аварийных завершений процессов (Uncaught Exceptions), генерация минидампов (`.dmp`) и отправка отчетов в Microsoft Watson.
   - **Влияние:** При вылете или зависании игры `WerSvc` подвешивает процесс на 5–15 секунд для создания полного снимка памяти, что мешает мгновенному перезапуску игры.

5. **`PcaSvc` (Program Compatibility Assistant Service)**
   - **DLL:** `pcasvc.dll`
   - **Функция:** Мониторинг запуска старых или нестандартных исполняемых файлов, инжектирование shims (библиотек совместимости) через `apphelp.dll` и вывод диалогов "Эта программа, возможно, установлена неправильно".
   - **Влияние:** Добавляет задержку при запуске любых новых `.exe` файлов за счет проверки базы данных совместимости `sysmain.sdb`.

6. **`SysMain` (ранее SuperFetch)**
   - **DLL:** `sysmain.dll`
   - **Функция:** Анализ паттернов использования памяти, упреждающая загрузка часто используемых приложений в ОЗУ (Prefetch/Superfetch) и сжатие страниц памяти (Memory Compression).
   - **Глубокий анализ для NVMe SSD:**
     - На современных NVMe накопителях со скоростью линейного чтения 3500–7500 МБ/с и случайного чтения 4K в 500k–1000k IOPS упреждающее кэширование теряет свой изначальный смысл (ускорение медленных HDD).
     - При объеме оперативной памяти **16 ГБ и выше** `SysMain` может вызывать нежелательные фоновые сжатия страниц (Memory Compression), нагружая ядро процессора во время интенсивных игровых сессий.
     - **Вердикт:** Для систем с высокоскоростными NVMe SSD и >= 16 GB RAM службу `SysMain` рекомендуется отключать (`Disabled`) для стабилизации фреймтайма. Для систем с HDD или медленными SATA SSD и <= 8 GB RAM — оставлять в `Automatic`.

7. **`DPS`, `WdiServiceHost`, `WdiSystemHost` (Диагностическая инфраструктура)**
   - **Функция:** Сбор данных о неполадках сети, накопителей и энергопотребления, генерация сценариев устранения ошибок (Troubleshooters).
   - **Влияние:** Регулярные циклические проверки состояния системы нагружают шину WMI/ETW.

---

## 4. Классификация служб: Category C (Условно-отключаемые)

Службы категории C зависят исключительно от пользовательских сценариев (периферия, сервисы Microsoft, виртуализация). Их конфигурация должна быть строго индивидуальной.

```
+---------------------------------------------------------------------------------------------------------+
|                                CATEGORY C: CONDITIONAL / FEATURE SERVICES                               |
+---------------------+----------------------------+-----------------+------------------------------------+
| Service Name        | Registry Key Name          | Recommended     | Dependency / Condition             |
+---------------------+----------------------------+-----------------+------------------------------------+
| XblAuthManager      | XblAuthManager             | 3 (Manual) / 4  | Xbox App, MS Store Games, GamePass |
| XblGameSave         | XblGameSave                | 3 (Manual) / 4  | Xbox Cloud Saves sync              |
| XboxNetApiSvc       | XboxNetApiSvc              | 3 (Manual) / 4  | Xbox Live Networking / Teredo      |
| XboxGipSvc          | XboxGipSvc                 | 3 (Manual) / 4  | Xbox Wireless Controller Adapter   |
| wuauserv            | wuauserv                   | 3 (Manual)      | Windows Update / Security Patches  |
| UsoSvc              | UsoSvc                     | 3 (Manual)      | Update Session Orchestrator        |
| WaaSMedicSvc        | WaaSMedicSvc               | 3 (Manual) / 4  | Windows Update Medic Service       |
| DoSvc               | DoSvc                      | 4 (Disabled)    | Delivery Optimization (P2P Update) |
| bthserv             | bthserv                    | 3 (Manual) / 4  | Bluetooth Devices (Headsets, Game) |
| BTAGService         | BTAGService                | 3 (Manual) / 4  | Bluetooth Audio Gateway            |
| wisvc               | wisvc                      | 4 (Disabled)    | Windows Insider Preview Program    |
| WbioSrvc            | WbioSrvc                   | 3 (Manual) / 4  | Windows Hello (Fingerprint, Face)  |
| vmms                | vmms                       | 4 (Disabled)    | Hyper-V Virtual Machines           |
| HvHost              | HvHost                     | 4 (Disabled)    | Hyper-V Host Service (WSL2/WSA)    |
+---------------------+----------------------------+-----------------+------------------------------------+
```

### Сценарии настройки Category C:

1. **Экосистема Xbox и Microsoft Store:**
   - Если вы играете в **Forza Horizon, Sea of Thieves, Microsoft Flight Simulator**, игры из **Xbox Game Pass** или используете авторизацию Xbox Live в Minecraft: службы `XblAuthManager`, `XblGameSave`, `XboxNetApiSvc` **должны оставаться в режиме `Manual (3)`**.
   - Если вы играете только в Steam / Epic Games / GOG / Battle.net и не используете сервисы Microsoft: эти службы можно безопасно перевести в `Disabled (4)`.
   - **`XboxGipSvc` (Xbox Accessory Management Service):** Необходима для подключения фирменных беспроводных геймпадов Xbox через специализированный USB-адаптер (Xbox Wireless Adapter). При подключении геймпада по кабелю или стандартному Bluetooth служба не требуется.

2. **Windows Update (`wuauserv`, `UsoSvc`) & Delivery Optimization (`DoSvc`):**
   - Полное отключение `wuauserv` (`Start=4`) ломает установку компонентов DirectX Runtime, библиотек Visual C++ Redistributable, языковых пакетов и драйверов из каталога Windows.
   - **Рекомендуемая оптимизация:** Перевод `wuauserv` и `UsoSvc` в режим `Manual (3)` в сочетании с блокировкой автоматической перезагрузки и фонового скачивания через Group Policy (`AUOptions = 2`).
   - **`DoSvc` (Delivery Optimization):** Служба P2P-раздачи обновлений по локальной сети и интернету. Является источником неконтролируемой фоновой загрузки сетевого канала. Рекомендуется перевести в `Disabled (4)`.

3. **Bluetooth Services (`bthserv`, `BTAGService`):**
   - На настольных ПК без встроенного или внешнего Bluetooth-адаптера службы бесполезно опрашивают шину USB/PCIe. Их можно отключить (`Disabled`). При наличии Bluetooth-наушников или контроллеров DualSense/Xbox — оставить в `Manual (3)`.

4. **Виртуализация и Hyper-V (`vmms`, `hvhost`):**
   - Включение Hyper-V и VBS (Virtualization-Based Security / Целостность памяти HVCI) активирует гипервизор первого типа (Type-1 Hypervisor). Вся основная операционная система Windows становится виртуальной машиной (Root Partition).
   - Это накладывает пенальти на задержки обращений к памяти (SLAT/EPT translation overhead), увеличивает межъядерные задержки (Inter-Core Latency) на 5–12% и снижает 0.1% Low FPS в процессорозависимых играх (CS2, Valorant, Warzone).
   - Если вы не используете WSL2, Docker или эмуляторы Android, службы Hyper-V должны быть отключены.

---

## 5. Глубокая вырезка телеметрии и защита приватности (Telemetry & Privacy Stripping)

### 5.1. Уровни диагностических данных в Windows 10 и 11

В архитектуре Windows подсистема сбора телеметрии **UTC (Universal Telemetry Client)** классифицирует сбор данных по четырем уровням (`AllowTelemetry`):

| Значение `AllowTelemetry` | Уровень | Описание собираемых данных |
| :--- | :--- | :--- |
| `0` | **Security (0)** | Только критические данные безопасности (Windows Defender, параметры телеметрии ядра). Официально поддерживается **только в редакциях Enterprise, Education, IoT Enterprise и Server**. В Home/Pro принудительно повышается системой до уровня 1. |
| `1` | **Basic / Required (1)** | Базовая информация об устройстве, конфигурация оборудования, отчеты о фатальных ошибках ядра и совместимости драйверов. |
| `2` | **Enhanced (2)** | (Устарело в Win 10 1909+) Расширенная телеметрия использования подсистем и памяти. |
| `3` | **Full / Optional (3)** | Полная телеметрия: посещенные веб-сайты в Edge/IE, дампы оперативной памяти при сбоях приложений, рукописный ввод, голосовые паттерны, расширенная диагностика использования приложений. |

---

### 5.2. Реестр и групповые политики для полной нейтрализации телеметрии

Для гарантированного отключения всех каналов утечки диагностических данных необходимо применить следующий набор ключей реестра:

```powershell
# ==============================================================================
# РЕЕСТР: ПОЛНАЯ БЛОКИРОВКА ТЕЛЕМЕТРИИ, ДИАГНОСТИКИ И СБОРА ДАННЫХ
# ==============================================================================

# 1. Отключение передачи диагностических данных (Data Collection)
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "AllowTelemetry" -Type DWord -Value 0
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "DisableDiagnosticDataCollection" -Type DWord -Value 1
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "DoNotShowFeedbackNotifications" -Type DWord -Value 1
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "MaxTelemetryAllowed" -Type DWord -Value 0

# 2. Отключение программы улучшения качества ПО (CEIP / SQM Client)
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\SQMClient\Windows" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\SQMClient\Windows" -Name "CEIPEnable" -Type DWord -Value 0
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\SQMClient\Windows" -Name "StudyId" -Type DWord -Value 0

# 3. Отключение телеметрии совместимости приложений (Application Experience / AppCompat)
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "AITEnable" -Type DWord -Value 0
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "DisableInventory" -Type DWord -Value 1
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "DisableUAR" -Type DWord -Value 1
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "DisableEngine" -Type DWord -Value 1
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat" -Name "DisablePCA" -Type DWord -Value 1

# 4. Отключение рекламного идентификатора (Advertising ID)
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo" -Name "DisabledByGroupPolicy" -Type DWord -Value 1
New-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo" -Force | Out-Null
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo" -Name "Enabled" -Type DWord -Value 0

# 5. Отключение опросов и запросов обратной связи (SIUF - System Initiated User Feedback)
New-Item -Path "HKCU:\Software\Microsoft\Siuf\Rules" -Force | Out-Null
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Siuf\Rules" -Name "NumberOfSIUFInPeriod" -Type DWord -Value 0
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Siuf\Rules" -Name "PeriodInNanoSeconds" -Type DWord -Value 0

# 6. Отключение сбора рукописного ввода и телеметрии клавиатуры (Input Personalization)
New-Item -Path "HKCU:\Software\Microsoft\InputPersonalization" -Force | Out-Null
Set-ItemProperty -Path "HKCU:\Software\Microsoft\InputPersonalization" -Name "RestrictImplicitInkCollection" -Type DWord -Value 1
Set-ItemProperty -Path "HKCU:\Software\Microsoft\InputPersonalization" -Name "RestrictImplicitTextCollection" -Type DWord -Value 1
New-Item -Path "HKCU:\Software\Microsoft\InputPersonalization\TrainedDataStore" -Force | Out-Null
Set-ItemProperty -Path "HKCU:\Software\Microsoft\InputPersonalization\TrainedDataStore" -Name "HarvestContacts" -Type DWord -Value 0

# 7. Отключение истории активности (Windows Timeline & User Activities)
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "EnableActivityFeed" -Type DWord -Value 0
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "PublishUserActivities" -Type DWord -Value 0
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System" -Name "UploadUserActivities" -Type DWord -Value 0

# 8. Отключение веб-поиска Bing и рекламы в меню Пуск
New-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Force | Out-Null
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "BingSearchEnabled" -Type DWord -Value 0
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "CortanaConsent" -Type DWord -Value 0
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search" -Name "DisableWebSearch" -Type DWord -Value 1
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search" -Name "ConnectedSearchUseWeb" -Type DWord -Value 0

# 9. Отключение Windows 11 Copilot, Recall (24H2) и виджетов (Windows Widgets)
New-Item -Path "HKCU:\Software\Policies\Microsoft\Windows\WindowsCopilot" -Force | Out-Null
Set-ItemProperty -Path "HKCU:\Software\Policies\Microsoft\Windows\WindowsCopilot" -Name "TurnOffWindowsCopilot" -Type DWord -Value 1
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot" -Name "TurnOffWindowsCopilot" -Type DWord -Value 1

# Windows Recall (Photoholic AI Snapshots)
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Name "DisableAIDataAnalysis" -Type DWord -Value 1
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsAI" -Name "AllowRecallPolicy" -Type DWord -Value 0

# Windows Widgets
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Dsh" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Dsh" -Name "AllowNewsAndInterests" -Type DWord -Value 0
```

---

### 5.3. Сетевой уровень: Блокировка телеметрических доменов (Hosts & Firewall)

Даже при отключении через реестр некоторые системные бинарники совершают прямые HTTP/HTTPS запросы к инфраструктуре сбора данных. Для абсолютной изоляции применяется блокировка на уровне локального DNS-резолвера (`%SystemRoot%\System32\drivers\etc\hosts`) или аппаратного фаервола / Pi-hole.

#### Список ключевых телеметрических эндпоинтов:
```text
0.0.0.0 v10.events.data.microsoft.com
0.0.0.0 v20.events.data.microsoft.com
0.0.0.0 telemetry.microsoft.com
0.0.0.0 watson.telemetry.microsoft.com
0.0.0.0 diagnostics.support.microsoft.com
0.0.0.0 feedback.windows.com
0.0.0.0 vortex.data.microsoft.com
0.0.0.0 vortex-win.data.microsoft.com
0.0.0.0 settings-win.data.microsoft.com
0.0.0.0 activity.windows.com
0.0.0.0 mobile.events.data.microsoft.com
0.0.0.0 sqm.telemetry.microsoft.com
```

#### Скрипт PowerShell для безопасного добавления записей в hosts:
```powershell
$HostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$BlockedDomains = @(
    "v10.events.data.microsoft.com",
    "v20.events.data.microsoft.com",
    "telemetry.microsoft.com",
    "watson.telemetry.microsoft.com",
    "diagnostics.support.microsoft.com",
    "feedback.windows.com",
    "vortex.data.microsoft.com",
    "vortex-win.data.microsoft.com",
    "settings-win.data.microsoft.com",
    "activity.windows.com",
    "mobile.events.data.microsoft.com",
    "sqm.telemetry.microsoft.com"
)

$CurrentHosts = Get-Content -Path $HostsPath -Raw -ErrorAction SilentlyContinue
$NewEntries = "`n# [Windows Telemetry Blocklist]`n"

foreach ($Domain in $BlockedDomains) {
    if ($CurrentHosts -notmatch [regex]::Escape($Domain)) {
        $NewEntries += "0.0.0.0 $Domain`n"
    }
}

if ($NewEntries.Trim().Length -gt 35) {
    Add-Content -Path $HostsPath -Value $NewEntries -Force
    Write-Host "[+] Телеметрические домены успешно заблокированы в hosts." -ForegroundColor Green
}
```

---

## 6. Очистка планировщика задач (Scheduled Tasks Deep Clean)

Планировщик задач Windows (`Task Scheduler`) содержит сотни встроенных задач. Большинство телеметрических задач сконфигурированы с триггерами типа "При простое системы" (On Idle), "При входе любого пользователя" (At LogOn) или с суточными интервалами. 

Когда запускается задача вроде `Microsoft Compatibility Appraiser`, она инициирует полное сканирование реестра, проверку всех установленных исполняемых файлов на диске и замер совместимости с новыми сборками Windows, создавая мощные всплески дисковой нагрузки (100% Active Time на накопителе) и вызывая тяжелые фризы.

```
+---------------------------------------------------------------------------------------------------------+
|                                TELEMETRY SCHEDULED TASKS DESTRUCTION LIST                               |
+-------------------------------------------------------------+-------------------------------------------+
| Task Path & Name                                            | Function / Impact                         |
+-------------------------------------------------------------+-------------------------------------------+
| \Microsoft\Windows\Application Experience\                  |                                           |
|   Microsoft Compatibility Appraiser                         | Scans entire drive for app compatibility  |
|   ProgramDataUpdater                                        | Gathers inventory of installed programs   |
|   StartupAppTask                                            | Scans startup applications and times      |
|   MareBackup                                                | Backup compatibility data collector       |
|                                                             |                                           |
| \Microsoft\Windows\Customer Experience Improvement Program\ |                                           |
|   Consolidator                                              | Aggregates CEIP usage metrics to MS       |
|   UsbCeip                                                   | Collects USB hardware & bus telemetry     |
|   KernelCeipTask                                            | Collects kernel-level performance data    |
|                                                             |                                           |
| \Microsoft\Windows\Autochk\                                 |                                           |
|   Proxy                                                     | Uploads disk check SQM data               |
|                                                             |                                           |
| \Microsoft\Windows\DiskDiagnostic\                          |                                           |
|   Microsoft-Windows-DiskDiagnosticDataCollector             | Collects SMART disk telemetry to MS       |
|   Microsoft-Windows-DiskDiagnosticResolver                  | Triggers SMART diagnostic alerts          |
|                                                             |                                           |
| \Microsoft\Windows\Feedback\Siuf\                           |                                           |
|   DmClient                                                  | Sends periodic feedback polling queries   |
|   DmClientOnScenarioDownload                                | Triggers feedback scenario downloads      |
|                                                             |                                           |
| \Microsoft\Windows\Maps\                                    |                                           |
|   MapsUpdateTask                                            | Offline maps automatic update checks      |
|   MapsToastTask                                             | Toast notifications for map downloads     |
|                                                             |                                           |
| \Microsoft\Windows\MemoryDiagnostic\                        |                                           |
|   ProcessMemoryDiagnosticEvents                             | Uploads RAM error telemetry               |
|   RunFullMemoryDiagnostic                                   | Background RAM diagnostics                |
|                                                             |                                           |
| \Microsoft\Windows\Power Efficiency Diagnostics\            |                                           |
|   AnalyzeSystem                                             | Heavy energy/power usage trace generation |
|                                                             |                                           |
| \Microsoft\Windows\Windows Error Reporting\                 |                                           |
|   QueueReporting                                            | Sends queued crash reports to Watson      |
+-------------------------------------------------------------+-------------------------------------------+
```

### Комплексный PowerShell скрипт деактивации телеметрических задач:

```powershell
<#
.SYNOPSIS
    Безопасное отключение встроенных телеметрических и диагностических задач Windows.
.DESCRIPTION
    Скрипт проверяет наличие каждой задачи перед попыткой изменения состояния,
    предотвращая появление ошибок в консоли.
#>

$TelemetryTasks = @(
    "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser",
    "\Microsoft\Windows\Application Experience\ProgramDataUpdater",
    "\Microsoft\Windows\Application Experience\StartupAppTask",
    "\Microsoft\Windows\Application Experience\MareBackup",
    "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator",
    "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip",
    "\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask",
    "\Microsoft\Windows\Autochk\Proxy",
    "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector",
    "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticResolver",
    "\Microsoft\Windows\Feedback\Siuf\DmClient",
    "\Microsoft\Windows\Feedback\Siuf\DmClientOnScenarioDownload",
    "\Microsoft\Windows\Maps\MapsUpdateTask",
    "\Microsoft\Windows\Maps\MapsToastTask",
    "\Microsoft\Windows\MemoryDiagnostic\ProcessMemoryDiagnosticEvents",
    "\Microsoft\Windows\MemoryDiagnostic\RunFullMemoryDiagnostic",
    "\Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem",
    "\Microsoft\Windows\Windows Error Reporting\QueueReporting",
    "\Microsoft\Windows\CloudExperienceHost\CreateObjectTask",
    "\Microsoft\Windows\DiskFootprint\Diagnostics"
)

Write-Host "`n[*] Деактивация фоновых задач телеметрии и сбора данных..." -ForegroundColor Cyan

foreach ($Task in $TelemetryTasks) {
    $TaskPath = Split-Path -Path $Task -Parent
    $TaskName = Split-Path -Path $Task -Leaf

    $Exists = Get-ScheduledTask -TaskPath "$TaskPath\" -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($Exists) {
        Disable-ScheduledTask -TaskPath "$TaskPath\" -TaskName $TaskName -ErrorAction SilentlyContinue | Out-Null
        Write-Host "  [-] Отключена задача: $Task" -ForegroundColor Gray
    }
}

Write-Host "[+] Все запланированные задачи телеметрии успешно деактивированы.`n" -ForegroundColor Green
```

---

## 7. Удаление AppX / UWP Bloatware

### 7.1. Архитектура пакетов AppX: Installed vs Provisioned

В подсистеме Windows Universal Platform (UWP) существует принципиальное различие между двумя типами регистрации пакетов:

1. **`AppxPackage` (Установленный пакет пользователя):**
   - Пакет, зарегистрированный в профиле текущего пользователя (`HKCU\Software\Classes\Local Settings\Software\Microsoft\Windows\CurrentVersion\AppModel\Repository\Packages`).
   - Удаление через `Remove-AppxPackage` удаляет приложение **только для текущей учетной записи**.

2. **`AppxProvisionedPackage` (Предустановленный системный образ):**
   - Пакет, вшитый в системный образ Windows (`%ProgramFiles%\WindowsApps`) и зарегистрированный в `HKLM`.
   - Если удалить пакет только через `Remove-AppxPackage`, при создании нового пользователя в системе или после установки крупного функционального обновления Windows (Feature Update) операционная система автоматически повторно развернет все предустановленные приложения из Provisioned-образа!
   - **Правильный алгоритм деблоатинга:** Удаление должно выполняться **одновременно** из `AppxPackage` (для текущей сессии) и из `AppxProvisionedPackage` (через DISM / PowerShell), чтобы исключить их повторное самовосстановление.

---

### 7.2. Белый список (Whitelisting): Что категорически нельзя удалять

Неосторожное выполнение скриптов вроде `Get-AppxPackage * | Remove-AppxPackage` приводит к фатальному повреждению графической оболочки Windows:

```
+-------------------------------------------------------------------------------+
|                       CRITICAL APPX PACKAGES (DO NOT REMOVE)                  |
+------------------------------------+------------------------------------------+
| Package Name                       | Reason / Dependent Functionality         |
+------------------------------------+------------------------------------------+
| Microsoft.VCLibs*                  | C++ Runtime for all modern applications. |
| Microsoft.UI.Xaml*                 | Core XAML UI Framework for WinUI/Shell.  |
| Microsoft.NET.Native.Framework*    | .NET Native execution runtime.           |
| Microsoft.NET.Native.Runtime*      | Core .NET execution engine for UWP.      |
| Microsoft.DesktopAppInstaller      | Required for winget command-line tool.   |
| Microsoft.WindowsStore             | Windows Store (App updates, codecs).     |
| Microsoft.WindowsTerminal          | Modern Windows Terminal console.         |
| Microsoft.ScreenSketch             | Snipping Tool (Ножницы) - скриншоты.     |
| Microsoft.WindowsCalculator        | Калькулятор Windows.                     |
| Microsoft.SecHealthUI              | Графический интерфейс Windows Defender.  |
+------------------------------------+------------------------------------------+
```

---

### 7.3. Production-Ready PowerShell скрипт удаления UWP мусора

```powershell
<#
.SYNOPSIS
    Безопасный деблоатинг предустановленных UWP/AppX приложений.
.DESCRIPTION
    Использует строгий алгоритм сопоставления с черным списком (Blacklist),
    полностью защищая критические компоненты системы, WinGet и Windows Store.
#>

# Список нежелательных пакетов (регулярные выражения)
$BloatwarePatterns = @(
    "Microsoft.BingNews",
    "Microsoft.BingWeather",
    "Microsoft.BingSearch",
    "Microsoft.GetHelp",
    "Microsoft.Getstarted",
    "Microsoft.MicrosoftOfficeHub",
    "Microsoft.MicrosoftSolitaireCollection",
    "Microsoft.MicrosoftStickyNotes",
    "Microsoft.People",
    "Microsoft.Todos",
    "Microsoft.PowerAutomateDesktop",
    "Microsoft.YourPhone",
    "Microsoft.ZuneMusic",
    "Microsoft.ZuneVideo",
    "Microsoft.549981C3F5F10", # Cortana
    "Clipchamp.Clipchamp",
    "Microsoft.GamingApp",      # Удалять только если не нужен Xbox App
    "Microsoft.XboxFeedback",
    "Microsoft.XboxGamingOverlay", # Xbox Game Bar (удалять, если не используется)
    "Microsoft.XboxSpeechToTextOverlay",
    "King.com.CandyCrush*",
    "SpotifyAB.SpotifyMusic",
    "Facebook",
    "Disney",
    "TikTok",
    "Instagram",
    "ByteDance"
)

Write-Host "`n[*] Запуск процедуры очистки предустановленного UWP Bloatware..." -ForegroundColor Cyan

# 1. Удаление из установленных пакетов текущего пользователя
foreach ($Pattern in $BloatwarePatterns) {
    $Packages = Get-AppxPackage -Name $Pattern -ErrorAction SilentlyContinue
    foreach ($Pkg in $Packages) {
        try {
            Write-Host "  [-] Удаление AppxPackage: $($Pkg.Name)" -ForegroundColor Yellow
            Remove-AppxPackage -Package $Pkg.PackageFullName -ErrorAction Stop
        } catch {
            Write-Host "  [!] Ошибка при удалении $($Pkg.Name): $_" -ForegroundColor Red
        }
    }
}

# 2. Удаление из системного Provisioned-образа (для предотвращения возврата новым пользователям)
$Provisioned = Get-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue
foreach ($ProvPkg in $Provisioned) {
    foreach ($Pattern in $BloatwarePatterns) {
        if ($ProvPkg.DisplayName -like $Pattern) {
            try {
                Write-Host "  [-] Удаление ProvisionedPackage: $($ProvPkg.DisplayName)" -ForegroundColor Magenta
                Remove-AppxProvisionedPackage -Online -PackageName $ProvPkg.PackageName -ErrorAction Stop | Out-Null
            } catch {
                Write-Host "  [!] Ошибка при удалении Provisioned $($ProvPkg.DisplayName): $_" -ForegroundColor Red
            }
        }
    }
}

Write-Host "[+] Процесс очистки UWP Bloatware успешно завершен.`n" -ForegroundColor Green
```

---

## 8. Сравнительный анализ Open Source Debloat Ecosystem

В сообществе системных инженеров и энтузиастов оптимизации Windows сформировался пул популярных утилит для деблоатинга. Ниже представлен их глубокий архитектурный и сравнительный анализ.

```
+-------------------------------------------------------------------------------------------------------------+
|                                    DEBLOAT TOOLS COMPARATIVE MATRIX                                         |
+----------------------+--------------------+-------------------+---------------------+-----------------------+
| Параметр             | Sophia Script      | CTT WinUtil       | O&O ShutUp10++      | Privacy.sexy          |
+----------------------+--------------------+-------------------+---------------------+-----------------------+
| **Разработчик**      | Farag2 (Dmitry)    | Chris Titus Tech  | O&O Software GmbH   | Underprotection       |
| **Тип интерфейса**   | PowerShell Core/UI | PowerShell WPF    | Win32 GUI           | Web-App / Batch / PS1 |
| **Архитектура кода** | Модульный PS1/PSD1 | Монолитный PS1/WPF| Проприетарный C++   | Шаблонизатор YAML     |
| **Безопасность**     | Максимальная       | Средняя/Высокая   | Очень высокая       | Высокая (кастомизация)|
| **Уровень риска**    | Минимальный        | Низкий            | Нулевой             | Настраиваемый         |
| **Поддержка 24H2**   | Полная (быстрые)   | Полная            | Полная              | Полная                |
| **Создание Backup**  | Автоматическое     | Опционально       | Авто (Restore Point)| Встроенные Undo       |
+----------------------+--------------------+-------------------+---------------------+-----------------------+
```

### 8.1. Sophia Script for Windows (Farag2)
- **Архитектура:** Является эталоном технической грамотности в сообществе. Написан на чистом PowerShell без использования сомнительных хаков или внешних бинарников. Содержит более 150 тонко настраиваемых функций.
- **Преимущества:**
  - Глубокое понимание Windows API: не использует "грубые" методы удаления служб, а корректно настраивает параметры прав доступа и конфигурации через официальные интерфейсы.
  - Поддержка UI-оболочки (**SophiApp**) на WPF/C# с отображением подробного описания каждого действия.
  - Наличие встроенных проверок версии Windows (вплоть до конкретного номера билда) для предотвращения применения несовместимых твиков.
- **Недостатки:** Требует определенной квалификации при редактировании файла конфигурации `Sophia.psd1` в консольном режиме.

### 8.2. Chris Titus Tech WinUtil (CTT)
- **Архитектура:** Запускается через однострочник `irm https://christitus.com/win | iex`. Представляет собой интерактивную панель управления на базе PowerShell WPF GUI.
- **Преимущества:**
  - Интеграция установки ПО через Winget/Chocolatey.
  - Простые предустановленные профили ("Desktop Tweaks", "Laptop Tweaks").
  - Удобство быстрого развертывания системы после чистой установки.
- **Недостатки:**
  - Кнопка "Standard Tweaks" объединяет множество разнородных изменений в один клик без детального информирования пользователя о каждом шаге.
  - Некоторые сетевые и сервисные твики могут быть избыточными для пользователей специфического софта.

### 8.3. O&O ShutUp10++
- **Архитектура:** Автономный исполняемый Win32-файл от немецкой компании O&O Software, не требующий установки.
- **Преимущества:**
  - Градация настроек по уровню безопасности: зеленый (рекомендовано / безопасно), желтый (условно безопасно), красный (только для экспертов).
  - Идеален для корпоративных сред и консервативных пользователей, которым требуется быстро отключить передачу данных без риска сломать компоненты системы.
- **Недостатки:** Не удаляет встроенные UWP приложения и не выполняет глубокую оптимизацию системных служб.

### 8.4. Privacy.sexy
- **Архитектура:** Веб-генератор сценариев с открытым исходным кодом. Позволяет интерактивно собрать кастомный `.bat` или `.ps1` скрипт.
- **Преимущества:**
  - Предельная прозрачность: перед скачиванием можно просмотреть каждую строчку кода и сопутствующую документацию.
  - Наличие обратных скриптов отката (Revert Script) для каждого выбранного твика.
- **Недостатки:** Требует ручного аудита выбранных чекбоксов.

---

## 9. Мифы, плацебо и опасные твики (Myths & Destructive Tweaks)

```
+---------------------------------------------------------------------------------------------------------+
|                                    MYTHS VS REALITY IN WINDOWS DEBLOAT                                  |
+---------------------------------------+-----------------------------------------------------------------+
| Опасный миф / Snake-Oil Tweak        | Физическая реальность и последствия                             |
+---------------------------------------+-----------------------------------------------------------------+
| "Удаление всех служб дает +50 FPS"    | Экономия 150 МБ RAM на системе с 16-32 ГБ дает 0.0 FPS прироста.|
|                                       | Вызывает RPC тайм-ауты и микрофризы из-за ошибок опроса.        |
|                                       |                                                                 |
| Полное удаление Windows Defender      | Ломает Security Center, античиты и вызывает краш проводника     |
| через удаление папок TrustedInstaller | при открытии контекстных меню. Огромная уязвимость безопасности.|
|                                       |                                                                 |
| Удаление Microsoft Edge и WebView2    | Ломает интерфейсы Steam, Discord, Xbox App, MSFS 2024 и         |
| через сторонние батники               | встроенные диалоги входа OAuth2.                                 |
|                                       |                                                                 |
| "Nagle Algorithm Disable" для всего   | Ломает пропускную способность гигабитного интернета при скачке. |
|                                       |                                                                 |
| Отключение службы `Themes`            | Ломает тему Windows Aero/DWM, переключая рендеринг шрифтов      |
|                                       | в устаревший режим GDI без субпиксельного сглаживания.          |
+---------------------------------------+-----------------------------------------------------------------+
```

### Разбор фатальных ошибок:

1. **Удаление системных служб "под корень" (`sc delete`):**
   - Удаление службы из реестра вместо перевода в `Start=4 (Disabled)` лишает систему возможности корректного отката.
   - Если другая служба или приложение пытается вызвать удаленную службу через RPC-интерфейс, SCM не может вернуть предсказуемый статус `SERVICE_DISABLED`, что приводит к бесконечному ожиданию (RPC Timeout = 30 секунд), порождая тяжелые системные зависания.

2. **Вандальное вырезание Microsoft Edge WebView2:**
   - Многие неопытные пользователи путают браузер Microsoft Edge и системный runtime-компонент **Edge WebView2**.
   - WebView2 используется практически всем современным ПО (лаунчеры игр, клиенты авторизации, современные панели управления аппаратным обеспечением). Его удаление приводит к появлению белых пустых окон при запуске приложений.

3. **Слом прав доступа реестра (Taking Ownership of TrustedInstaller keys):**
   - Насильственная смена владельца системных веток реестра с `NT SERVICE\TrustedInstaller` на `Administrators` для удаления ключей безопасности нарушает механизм защиты целостности Windows Resource Protection (WRP).
   - После этого любая проверка целостности `sfc /scannow` либо завершается с ошибкой, либо восстанавливает все обратно, вызывая повреждение манифестов CBS (Component-Based Servicing).

---

## 10. Безопасность, откат (Rollback) и автоматизация

Перед внесением любых изменений в реестр, службы или планировщик задач обязательным требованием является создание точки восстановления и экспорт текущего состояния служб.

### 10.1. Скрипт создания точки восстановления (System Restore Point)

```powershell
# Включение защиты системы для системного диска и создание точки восстановления
try {
    Enable-ComputerRestore -Drive "$env:SystemDrive" -ErrorAction SilentlyContinue
    Checkpoint-Computer -Description "Before_Deep_Debloat_Optimization" -RestorePointType "MODIFY_SETTINGS"
    Write-Host "[+] Точка восстановления успешно создана." -ForegroundColor Green
} catch {
    Write-Host "[!] Не удалось создать точку восстановления: $_" -ForegroundColor Red
}
```

---

### 10.2. Скрипт резервного копирования и экспорта состояния служб

```powershell
<#
.SYNOPSIS
    Экспорт текущего типа запуска всех служб Windows в JSON-файл для возможности отката.
#>

$BackupPath = "$PSScriptRoot\Services_Backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"

Write-Host "[*] Создание резервной копии конфигурации служб..." -ForegroundColor Cyan

$ServicesState = Get-Service | ForEach-Object {
    $StartType = (Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\$($_.Name)" -Name "Start" -ErrorAction SilentlyContinue).Start
    [PSCustomObject]@{
        Name        = $_.Name
        DisplayName = $_.DisplayName
        Status      = $_.Status.ToString()
        StartType   = $StartType
    }
}

$ServicesState | ConvertTo-Json -Depth 3 | Set-Content -Path $BackupPath -Encoding UTF8
Write-Host "[+] Конфигурация сохранена в: $BackupPath" -ForegroundColor Green
```

---

### 10.3. Скрипт восстановления служб по умолчанию (Windows 10 / 11 Default State)

Если в результате агрессивной оптимизации возникли проблемы, данный скрипт возвращает критические и оптимизированные службы в их стандартные заводские типы запуска:

```powershell
<#
.SYNOPSIS
    Восстановление стандартных типов запуска служб Windows (Default Factory State).
#>

$DefaultServices = @{
    "DiagTrack"          = 2 # Automatic
    "dmwappushservice"   = 3 # Manual
    "WSearch"            = 2 # Automatic
    "Spooler"            = 2 # Automatic
    "Fax"                = 3 # Manual
    "RemoteRegistry"     = 4 # Disabled
    "SCardSvr"           = 3 # Manual
    "CertPropSvc"        = 3 # Manual
    "SensorService"      = 3 # Manual
    "SensorsDataService" = 3 # Manual
    "SensorDataService"  = 3 # Manual
    "lfsvc"              = 3 # Manual
    "WerSvc"             = 3 # Manual
    "PcaSvc"             = 2 # Automatic
    "TrkWks"             = 2 # Automatic
    "SysMain"            = 2 # Automatic
    "DPS"                = 2 # Automatic
    "WdiServiceHost"     = 3 # Manual
    "WdiSystemHost"      = 3 # Manual
    "MapsBroker"         = 2 # Automatic (Delayed)
    "XblAuthManager"     = 3 # Manual
    "XblGameSave"        = 3 # Manual
    "XboxNetApiSvc"      = 3 # Manual
    "XboxGipSvc"         = 3 # Manual
    "wuauserv"           = 3 # Manual
    "UsoSvc"             = 3 # Manual
    "DoSvc"              = 2 # Automatic
    "bthserv"            = 3 # Manual
    "BTAGService"        = 3 # Manual
}

Write-Host "[*] Восстановление заводских типов запуска служб..." -ForegroundColor Cyan

foreach ($Svc in $DefaultServices.GetEnumerator()) {
    $KeyPath = "HKLM:\SYSTEM\CurrentControlSet\Services\$($Svc.Key)"
    if (Test-Path $KeyPath) {
        Set-ItemProperty -Path $KeyPath -Name "Start" -Type DWord -Value $Svc.Value
        Write-Host "  [+] Служба $($Svc.Key) восстановлена на Start=$($Svc.Value)" -ForegroundColor Green
    }
}

Write-Host "`n[+] Восстановление завершено. Перезагрузите компьютер для применения изменений." -ForegroundColor Green
```

---

### 10.4. Итоговый Unified Master-Скрипт оптимизации служб и приватности

Данный скрипт объединяет безопасную настройку служб Category B, отключение телеметрии и задач планировщика в единый высокопроизводительный пайплайн:

```powershell
# ==============================================================================
# WINDOWS LOW-LATENCY MASTER OPTIMIZATION SCRIPT
# Режим: Безопасный деблоатинг для игровых и высокопроизводительных ПК
# ==============================================================================

# Проверка прав Администратора
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "Скрипт должен быть запущен с правами Администратора!"
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "      НАЧАЛО ПРОЦЕДУРЫ ОПТИМИЗАЦИИ СИСТЕМЫ WINDOWS        " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Безопасная оптимизация служб (Category B)
$ServicesToDisable = @(
    "DiagTrack",
    "dmwappushservice",
    "Fax",
    "RemoteRegistry",
    "SCardSvr",
    "CertPropSvc",
    "SensorService",
    "SensorsDataService",
    "SensorDataService",
    "lfsvc",
    "WerSvc",
    "PcaSvc",
    "TrkWks",
    "RetailDemo",
    "DPS",
    "WdiServiceHost",
    "WdiSystemHost",
    "MapsBroker",
    "DoSvc"
)

Write-Host "`n[1/4] Настройка и отключение нежелательных служб..." -ForegroundColor Yellow
foreach ($ServiceName in $ServicesToDisable) {
    $Path = "HKLM:\SYSTEM\CurrentControlSet\Services\$ServiceName"
    if (Test-Path $Path) {
        Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $Path -Name "Start" -Type DWord -Value 4
        Write-Host "  [-] Служба $ServiceName переведена в режим Disabled (4)" -ForegroundColor Gray
    }
}

# 2. Применение политик приватности и отключения телеметрии в реестре
Write-Host "`n[2/4] Применение групповых политик блокировки телеметрии..." -ForegroundColor Yellow

$RegistryTweaks = @(
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection"; Name = "AllowTelemetry"; Type = "DWord"; Value = 0 },
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection"; Name = "DisableDiagnosticDataCollection"; Type = "DWord"; Value = 1 },
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection"; Name = "DoNotShowFeedbackNotifications"; Type = "DWord"; Value = 1 },
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\SQMClient\Windows"; Name = "CEIPEnable"; Type = "DWord"; Value = 0 },
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat"; Name = "AITEnable"; Type = "DWord"; Value = 0 },
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppCompat"; Name = "DisableInventory"; Type = "DWord"; Value = 1 },
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo"; Name = "DisabledByGroupPolicy"; Type = "DWord"; Value = 1 },
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System"; Name = "EnableActivityFeed"; Type = "DWord"; Value = 0 },
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System"; Name = "PublishUserActivities"; Type = "DWord"; Value = 0 },
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System"; Name = "UploadUserActivities"; Type = "DWord"; Value = 0 },
    @{ Path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Windows Search"; Name = "DisableWebSearch"; Type = "DWord"; Value = 1 }
)

foreach ($Tweak in $RegistryTweaks) {
    if (-not (Test-Path $Tweak.Path)) {
        New-Item -Path $Tweak.Path -Force | Out-Null
    }
    Set-ItemProperty -Path $Tweak.Path -Name $Tweak.Name -Type $Tweak.Type -Value $Tweak.Value
}
Write-Host "  [+] Ключи реестра успешно записаны." -ForegroundColor Gray

# 3. Деактивация задач планировщика
Write-Host "`n[3/4] Деактивация телеметрических задач планировщика..." -ForegroundColor Yellow
$Tasks = @(
    "\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser",
    "\Microsoft\Windows\Application Experience\ProgramDataUpdater",
    "\Microsoft\Windows\Customer Experience Improvement Program\Consolidator",
    "\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip",
    "\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector",
    "\Microsoft\Windows\Feedback\Siuf\DmClient",
    "\Microsoft\Windows\Windows Error Reporting\QueueReporting"
)

foreach ($Task in $Tasks) {
    $TPath = Split-Path -Path $Task -Parent
    $TName = Split-Path -Path $Task -Leaf
    if (Get-ScheduledTask -TaskPath "$TPath\" -TaskName $TName -ErrorAction SilentlyContinue) {
        Disable-ScheduledTask -TaskPath "$TPath\" -TaskName $TName -ErrorAction SilentlyContinue | Out-Null
        Write-Host "  [-] Задача $TName отключена." -ForegroundColor Gray
    }
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "   ОПТИМИЗАЦИЯ УСПЕШНО ЗАВЕРШЕНА (РЕКОМЕНДУЕТСЯ REBOOT)   " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
```

---

## 11. Ссылки на официальную документацию и репозитории

1. **Microsoft Learn / MSDN:**
   - [Service Control Manager Architecture](https://learn.microsoft.com/en-us/windows/win32/services/service-control-manager)
   - [Services and svchost Process Isolation (Changes in Windows 10)](https://learn.microsoft.com/en-us/windows/application-management/svchost-service-refactoring)
   - [Configure Windows diagnostic data in your organization](https://learn.microsoft.com/en-us/windows/privacy/configure-windows-diagnostic-data-in-your-organization)
   - [Windows Notification Facility (WNF) & Service Triggers](https://learn.microsoft.com/en-us/windows/win32/services/service-trigger-events)
   - [AppX Package Management Technical Overview](https://learn.microsoft.com/en-us/windows/msix/overview)

2. **Open Source Repositories & Community Research:**
   - **Sophia Script for Windows:** [GitHub - farag2/Sophia-Script-for-Windows](https://github.com/farag2/Sophia-Script-for-Windows)
   - **Chris Titus Tech Windows Utility (WinUtil):** [GitHub - ChrisTitusTech/winutil](https://github.com/ChrisTitusTech/winutil)
   - **Privacy.sexy:** [GitHub - underprotection/privacy.sexy](https://github.com/underprotection/privacy.sexy)
   - **O&O ShutUp10++ Official Documentation:** [O&O Software Official Portal](https://www.oo-software.com/en/shutup10)
   - **Blur Busters / Low Latency Forums:** [Blur Busters System Latency Discussions](https://forums.blurbusters.com/)
