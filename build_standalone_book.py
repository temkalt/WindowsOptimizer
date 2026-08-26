import os
import json
import re
import html

KNOWLEDGE_BASE_DIR = r"D:\winvan\KNOWLEDGE_BASE"
OUTPUT_HTML_PATH = r"D:\winvan\WINDOWS_OPTIMIZATION_BOOK.html"
OUTPUT_HTML_CHITAT = r"D:\winvan\CHITAT_KNIGU.html"
OUTPUT_HTML_INDEX = r"D:\winvan\INDEX.html"

CHAPTERS_STRUCTURE = [
    {
        "part_num": "I",
        "part_title": "Ядро Windows NT, Диспетчеризация Потоков и Таймеры",
        "part_icon": "⚡",
        "chapters": [
            {
                "id": "chap-01",
                "file": "01_KERNEL_SCHEDULER_CPU.md",
                "title": "Глава 1. Диспетчер Потоков NT, Квантование CPU, Win32PrioritySeparation и MMCSS",
                "short_title": "1. Ядро, Планировщик & MMCSS",
                "read_time": "25 мин",
                "category": "Kernel"
            },
            {
                "id": "chap-02",
                "file": "02_TIMERS_CLOCKS_INTERRUPTS.md",
                "title": "Глава 2. Разрешение Таймеров, HPET, TSC и Тактовые Генераторы",
                "short_title": "2. Таймеры, HPET & TSC",
                "read_time": "22 мин",
                "category": "Timers"
            },
            {
                "id": "chap-03",
                "file": "03_DPC_ISR_MSI_AFFINITY.md",
                "title": "Глава 3. Прерывания, DPC/ISR Задержки, MSI/MSI-X и Core Isolation",
                "short_title": "3. DPC/ISR & MSI-X Affinity",
                "read_time": "24 мин",
                "category": "Interrupts"
            },
            {
                "id": "chap-04",
                "file": "13_POWER_MANAGEMENT_ENERGY_GOVERNORS.md",
                "title": "Глава 4. Управление Электропитанием ACPI, C-States и Core Unparking",
                "short_title": "4. Электропитание & C-States",
                "read_time": "20 мин",
                "category": "Power"
            },
        ]
    },
    {
        "part_num": "II",
        "part_title": "Аппаратная Платформа, UEFI/BIOS и Память",
        "part_icon": "🔧",
        "chapters": [
            {
                "id": "chap-05",
                "file": "04_UEFI_BIOS_OVERCLOCKING_UNDERVOLTING.md",
                "title": "Глава 5. Тюнинг UEFI/BIOS, Разгон, Андервольтинг и Субтайминги DRAM",
                "short_title": "5. BIOS & Субтайминги DRAM",
                "read_time": "26 мин",
                "category": "Hardware"
            },
            {
                "id": "chap-06",
                "file": "09_RAM_MEMORY_PAGEFILE_STORAGE_NVME.md",
                "title": "Глава 6. Архитектура Диспетчера Памяти, Pagefile, Standby и NVMe",
                "short_title": "6. ОЗУ, Pagefile & NVMe",
                "read_time": "24 мин",
                "category": "Memory"
            },
        ]
    },
    {
        "part_num": "III",
        "part_title": "Графический Стек, Конвейер Рендеринга и Дисплеи",
        "part_icon": "🎮",
        "chapters": [
            {
                "id": "chap-07",
                "file": "05_GPU_GRAPHICS_PIPELINE_NVIDIA_AMD.md",
                "title": "Глава 7. Графический Стек WDDM, Рендеринг, Тюнинг NVIDIA/AMD и HAGS",
                "short_title": "7. Графика WDDM & Драйверы",
                "read_time": "28 мин",
                "category": "GPU"
            },
            {
                "id": "chap-08",
                "file": "06_DISPLAYS_MONITORS_REFRESH_RATES_MOTION.md",
                "title": "Глава 8. Мониторы, Частота Обновления, Overdrive и Четкость Движения",
                "short_title": "8. Мониторы & Motion Clarity",
                "read_time": "27 мин",
                "category": "Display"
            },
            {
                "id": "chap-09",
                "file": "16_GAME_ENGINES_DIRECTX_VULKAN_DWM_MPO.md",
                "title": "Глава 9. Игровые Движки, DirectX 11/12, Vulkan, DWM и Multi-Plane Overlay",
                "short_title": "9. DirectX, Vulkan & MPO",
                "read_time": "23 мин",
                "category": "DirectX"
            },
        ]
    },
    {
        "part_num": "IV",
        "part_title": "Периферия и Архитектура Ввода-Вывода",
        "part_icon": "🖱️",
        "chapters": [
            {
                "id": "chap-10",
                "file": "07_MOUSE_INPUT_SENSORS_USB_POLLING.md",
                "title": "Глава 10. Мышиный Ввод, Оптические Сенсоры, DPI и Шина USB 1–8 kHz",
                "short_title": "10. Мышь, Сенсоры & USB 8K",
                "read_time": "27 мин",
                "category": "Input"
            },
            {
                "id": "chap-11",
                "file": "08_KEYBOARD_RAPID_TRIGGER_FILTERKEYS.md",
                "title": "Глава 11. Клавиатурный Ввод, Rapid Trigger, Свитчи Холла и FilterKeys",
                "short_title": "11. Клавиатуры & Rapid Trigger",
                "read_time": "22 мин",
                "category": "Input"
            },
            {
                "id": "chap-12",
                "file": "15_AUDIO_STACK_LATENCY_MMCSS_ASIO.md",
                "title": "Глава 12. Звуковой Стек Core Audio, WASAPI Exclusive, ASIO и MMCSS",
                "short_title": "12. Звук, WASAPI & ASIO",
                "read_time": "23 мин",
                "category": "Audio"
            },
        ]
    },
    {
        "part_num": "V",
        "part_title": "Сетевой Стек и Онлайн-Задержки",
        "part_icon": "🌐",
        "chapters": [
            {
                "id": "chap-13",
                "file": "10_NETWORK_STACK_TCPIP_UDP_LATENCY.md",
                "title": "Глава 13. Сетевой Тракт NDIS, TCP/IP, UDP, Свойства NIC и Bufferbloat",
                "short_title": "13. Сеть, TCP/UDP & Bufferbloat",
                "read_time": "32 мин",
                "category": "Network"
            },
        ]
    },
    {
        "part_num": "VI",
        "part_title": "Службы, Безопасность и Сборки ОС",
        "part_icon": "🛡️",
        "chapters": [
            {
                "id": "chap-14",
                "file": "11_SERVICES_DEBLOATING_TELEMETRY.md",
                "title": "Глава 14. Службы Windows, Системный Деблоатинг, Телеметрия и Задачи",
                "short_title": "14. Службы & Деблоатинг",
                "read_time": "28 мин",
                "category": "Debloat"
            },
            {
                "id": "chap-15",
                "file": "12_CUSTOM_OS_STRIPPED_ISOS_ANALYSIS.md",
                "title": "Глава 15. Архитектурный Анализ Кастомных Сборок Windows, ISO и Playbooks",
                "short_title": "15. Кастомные ISO vs Playbooks",
                "read_time": "24 мин",
                "category": "Custom OS"
            },
            {
                "id": "chap-16",
                "file": "14_SECURITY_VBS_HVCI_DEFENDER_PERFORMANCE.md",
                "title": "Глава 16. Безопасность Windows vs. Производительность (VBS, HVCI, Defender)",
                "short_title": "16. VBS, HVCI & Defender",
                "read_time": "27 мин",
                "category": "Security"
            },
        ]
    },
    {
        "part_num": "VII",
        "part_title": "Диагностика, Мифы и Открытый Софт",
        "part_icon": "📊",
        "chapters": [
            {
                "id": "chap-17",
                "file": "17_DIAGNOSTICS_BENCHMARKING_ETW_WPA.md",
                "title": "Глава 17. Диагностика Задержек, Бенчмаркинг, ETW/WPA и Frame Pacing",
                "short_title": "17. ETW, WPA & Frame Pacing",
                "read_time": "26 мин",
                "category": "Profiling"
            },
            {
                "id": "chap-18",
                "file": "18_COMMUNITY_GUIDES_RESEARCH_EXPERTS.md",
                "title": "Глава 18. Экспертные Сообщества и Руководства (Blur Busters, Calypto, Melody)",
                "short_title": "18. Экспертные Гайды Сообществ",
                "read_time": "28 мин",
                "category": "Community"
            },
            {
                "id": "chap-19",
                "file": "19_MYTHS_PLACEBOS_HARMFUL_TWEAKS.md",
                "title": "Глава 19. Научное Развенчание Мифов, Плацебо и Вредоносных Твиков (Debunked)",
                "short_title": "19. Развенчание Мифов & Плацебо",
                "read_time": "30 мин",
                "category": "Mythbusting"
            },
            {
                "id": "chap-20",
                "file": "20_GITHUB_TOOLS_SCRIPTS_ECOSYSTEM.md",
                "title": "Глава 20. Экосистема Open-Source Утилит, Скриптов и GitHub Репозиториев",
                "short_title": "20. GitHub Софт & Скрипты",
                "read_time": "25 мин",
                "category": "Ecosystem"
            },
        ]
    }
]

def markdown_to_html(md_text, chap_id):
    lines = md_text.splitlines()
    html_lines = []
    
    in_code = False
    code_lang = ""
    code_lines = []
    
    in_table = False
    table_lines = []
    
    in_blockquote = False
    blockquote_lines = []
    
    in_ul = False
    in_ol = False
    
    heading_counter = 0
    toc_headings = []
    
    def flush_list():
        nonlocal in_ul, in_ol
        if in_ul:
            html_lines.append("</ul>")
            in_ul = False
        if in_ol:
            html_lines.append("</ol>")
            in_ol = False
            
    def flush_blockquote():
        nonlocal in_blockquote, blockquote_lines
        if in_blockquote:
            bq_content = " ".join(blockquote_lines)
            alert_class = ""
            alert_prefix = ""
            if bq_content.startswith("[!NOTE]"):
                alert_class = "alert-note"
                alert_prefix = "<strong>ℹ️ Примечание:</strong> "
                bq_content = bq_content[7:].strip()
            elif bq_content.startswith("[!TIP]"):
                alert_class = "alert-tip"
                alert_prefix = "<strong>💡 Совет:</strong> "
                bq_content = bq_content[6:].strip()
            elif bq_content.startswith("[!IMPORTANT]"):
                alert_class = "alert-important"
                alert_prefix = "<strong>⚡ Важно:</strong> "
                bq_content = bq_content[12:].strip()
            elif bq_content.startswith("[!WARNING]"):
                alert_class = "alert-warning"
                alert_prefix = "<strong>⚠️ Предупреждение:</strong> "
                bq_content = bq_content[11:].strip()
            elif bq_content.startswith("[!CAUTION]"):
                alert_class = "alert-caution"
                alert_prefix = "<strong>🛑 Осторожно:</strong> "
                bq_content = bq_content[10:].strip()
                
            html_lines.append(f'<blockquote class="{alert_class}"><p>{alert_prefix}{parse_inline(bq_content)}</p></blockquote>')
            in_blockquote = False
            blockquote_lines = []
            
    def flush_table():
        nonlocal in_table, table_lines
        if in_table:
            t_html = ["<div class='table-responsive'><table>"]
            header_done = False
            for idx, r in enumerate(table_lines):
                cells = [c.strip() for c in r.split('|')]
                if len(cells) > 0 and cells[0] == '':
                    cells = cells[1:]
                if len(cells) > 0 and cells[-1] == '':
                    cells = cells[:-1]
                    
                if not cells:
                    continue
                    
                if all(re.match(r'^:?-+:?$', c) for c in cells):
                    continue
                    
                if not header_done:
                    t_html.append("<thead><tr>")
                    for c in cells:
                        t_html.append(f"<th>{parse_inline(c)}</th>")
                    t_html.append("</tr></thead><tbody>")
                    header_done = True
                else:
                    t_html.append("<tr>")
                    for c in cells:
                        t_html.append(f"<td>{parse_inline(c)}</td>")
                    t_html.append("</tr>")
            t_html.append("</tbody></table></div>")
            html_lines.append("\n".join(t_html))
            in_table = False
            table_lines = []

    def parse_inline(text):
        if not text:
            return ""
        text = html.escape(text)
        text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
        text = re.sub(r'\*\*\*([^\*]+)\*\*\*', r'<strong><em>\1</em></strong>', text)
        text = re.sub(r'\*\*([^\*]+)\*\*', r'<strong>\1</strong>', text)
        text = re.sub(r'__([^_]+)__', r'<strong>\1</strong>', text)
        text = re.sub(r'\*([^\*]+)\*', r'<em>\1</em>', text)
        text = re.sub(r'_([^_]+)_', r'<em>\1</em>', text)
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" target="_blank" rel="noopener">\1</a>', text)
        text = re.sub(r'\$([^\$]+)\$', r'<span class="math-inline">\1</span>', text)
        return text

    i = 0
    while i < len(lines):
        line = lines[i]
        trimmed = line.strip()
        
        if trimmed.startswith("```"):
            if in_code:
                full_code = "\n".join(code_lines)
                escaped_code = html.escape(full_code)
                display_lang = code_lang.upper() if code_lang else "CODE"
                html_lines.append(f"""
<div class="code-block-wrapper">
    <div class="code-block-header">
        <span class="code-lang">{display_lang}</span>
        <button class="copy-code-btn" onclick="copyCode(this)" title="Копировать код">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Копировать</span>
        </button>
    </div>
    <pre><code>{escaped_code}</code></pre>
</div>
""")
                in_code = False
                code_lang = ""
                code_lines = []
            else:
                flush_list()
                flush_blockquote()
                flush_table()
                in_code = True
                code_lang = trimmed[3:].strip()
            i += 1
            continue
            
        if in_code:
            code_lines.append(line)
            i += 1
            continue
            
        if not trimmed:
            flush_list()
            flush_blockquote()
            flush_table()
            i += 1
            continue
            
        if re.match(r'^(---|___|\*\*\*)$', trimmed):
            flush_list()
            flush_blockquote()
            flush_table()
            html_lines.append("<hr>")
            i += 1
            continue
            
        if trimmed.startswith(">"):
            flush_list()
            flush_table()
            in_blockquote = True
            bq_text = trimmed[1:].strip()
            blockquote_lines.append(bq_text)
            i += 1
            continue
        elif in_blockquote:
            flush_blockquote()
            
        if trimmed.startswith("|") and trimmed.endswith("|"):
            flush_list()
            flush_blockquote()
            in_table = True
            table_lines.append(trimmed)
            i += 1
            continue
        elif in_table:
            flush_table()
            
        m_head = re.match(r'^(#{1,6})\s+(.+)$', trimmed)
        if m_head:
            flush_list()
            flush_blockquote()
            flush_table()
            level = len(m_head.group(1))
            h_text = m_head.group(2).strip()
            heading_counter += 1
            anchor_id = f"{chap_id}-h{heading_counter}"
            
            if level in (2, 3):
                toc_headings.append({
                    "id": anchor_id,
                    "level": level,
                    "text": re.sub(r'[\*`_#]', '', h_text)
                })
                
            parsed_title = parse_inline(h_text)
            html_lines.append(f'<h{level} id="{anchor_id}"><a href="#{anchor_id}" class="heading-anchor">#</a> {parsed_title}</h{level}>')
            i += 1
            continue
            
        m_ul = re.match(r'^[\*\-\+]\s+(.+)$', trimmed)
        if m_ul:
            flush_blockquote()
            flush_table()
            if in_ol:
                flush_list()
            if not in_ul:
                html_lines.append("<ul>")
                in_ul = True
            html_lines.append(f"<li>{parse_inline(m_ul.group(1))}</li>")
            i += 1
            continue
            
        m_ol = re.match(r'^\d+\.\s+(.+)$', trimmed)
        if m_ol:
            flush_blockquote()
            flush_table()
            if in_ul:
                flush_list()
            if not in_ol:
                html_lines.append("<ol>")
                in_ol = True
            html_lines.append(f"<li>{parse_inline(m_ol.group(1))}</li>")
            i += 1
            continue
            
        flush_list()
        flush_blockquote()
        flush_table()
        html_lines.append(f"<p>{parse_inline(trimmed)}</p>")
        i += 1

    flush_list()
    flush_blockquote()
    flush_table()
    
    return "\n".join(html_lines), toc_headings

def build_all_chapters():
    compiled_chapters = []
    
    for part in CHAPTERS_STRUCTURE:
        for chap_meta in part["chapters"]:
            file_path = os.path.join(KNOWLEDGE_BASE_DIR, chap_meta["file"])
            raw_text = ""
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    raw_text = f.read()
            else:
                raw_text = f"# {chap_meta['title']}\n\n*Файл {chap_meta['file']} не найден.*"
                
            rendered_html, toc_headings = markdown_to_html(raw_text, chap_meta["id"])
            
            compiled_chapters.append({
                "id": chap_meta["id"],
                "title": chap_meta["title"],
                "short_title": chap_meta["short_title"],
                "read_time": chap_meta["read_time"],
                "category": chap_meta["category"],
                "part_num": part["part_num"],
                "part_title": part["part_title"],
                "part_icon": part["part_icon"],
                "html": rendered_html,
                "toc": toc_headings,
                "text_raw": raw_text[:500]
            })
            
    return compiled_chapters

def generate_standalone_html():
    chapters = build_all_chapters()
    
    chapter_sections_html = []
    for idx, chap in enumerate(chapters):
        prev_btn = ""
        next_btn = ""
        
        if idx > 0:
            prev_chap = chapters[idx - 1]
            prev_btn = f"""
            <div class="nav-card nav-prev" onclick="switchChapter('{prev_chap['id']}')">
                <span class="nav-card-label">← Предыдущая глава</span>
                <span class="nav-card-title">{prev_chap['short_title']}</span>
            </div>
            """
            
        if idx < len(chapters) - 1:
            next_chap = chapters[idx + 1]
            next_btn = f"""
            <div class="nav-card nav-next" onclick="switchChapter('{next_chap['id']}')">
                <span class="nav-card-label">Следующая глава →</span>
                <span class="nav-card-title">{next_chap['short_title']}</span>
            </div>
            """
            
        toc_json_escaped = html.escape(json.dumps(chap['toc'], ensure_ascii=False))
        
        section = f"""
        <section id="section-{chap['id']}" class="chapter-container {'active' if idx == 0 else ''}" data-chap-id="{chap['id']}" data-toc="{toc_json_escaped}">
            <div class="chapter-hero">
                <div class="chapter-meta-tag">
                    <span class="meta-icon">{chap['part_icon']}</span>
                    <span>ЧАСТЬ {chap['part_num']}: {chap['part_title']}</span>
                </div>
                <h1 class="chapter-main-title">{chap['title']}</h1>
                <div class="chapter-stats-bar">
                    <div class="stat-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>Время чтения: <strong>{chap['read_time']}</strong></span>
                    </div>
                    <div class="stat-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        <span>Глава {idx + 1} из {len(chapters)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="badge-cat">{chap['category']}</span>
                    </div>
                </div>
            </div>

            <article class="markdown-body">
                {chap['html']}
            </article>

            <div class="chapter-footer-nav">
                {prev_btn}
                {next_btn}
            </div>
        </section>
        """
        chapter_sections_html.append(section)
        
    all_sections_rendered = "\n".join(chapter_sections_html)
    
    sidebar_parts_html = []
    chap_index = 0
    for part in CHAPTERS_STRUCTURE:
        part_block = [f'<div class="sidebar-part-header"><span>{part["part_icon"]}</span> ЧАСТЬ {part["part_num"]}: {part["part_title"]}</div>']
        for c in part["chapters"]:
            active_class = "active" if chap_index == 0 else ""
            part_block.append(f"""
            <a class="sidebar-chap-item {active_class}" id="nav-item-{c['id']}" onclick="switchChapter('{c['id']}')">
                <span class="chap-title-text">{c['short_title']}</span>
                <span class="chap-time-badge">{c['read_time']}</span>
            </a>
            """)
            chap_index += 1
        sidebar_parts_html.append("\n".join(part_block))
        
    sidebar_rendered = "\n".join(sidebar_parts_html)
    
    search_data_list = []
    for c in chapters:
        search_data_list.append({
            "id": c["id"],
            "title": c["title"],
            "short_title": c["short_title"],
            "category": c["category"],
            "text": re.sub(r'[\r\n]+', ' ', c["text_raw"][:400])
        })
    search_json = json.dumps(search_data_list, ensure_ascii=False)

    full_html = f"""<!DOCTYPE html>
<html lang="ru" class="theme-dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Архитектура и Низкоуровневая Оптимизация Windows NT — Книга</title>

    <style>
        :root {{
            --bg-body: #0a0e17;
            --bg-sidebar: #0f1523;
            --bg-card: #131b2e;
            --bg-card-hover: #1c2740;
            --border-color: rgba(255, 255, 255, 0.08);
            --border-hover: rgba(56, 189, 248, 0.4);
            --text-primary: #f1f5f9;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --accent-primary: #38bdf8;
            --accent-secondary: #818cf8;
            --accent-gradient: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
            --accent-glow: rgba(56, 189, 248, 0.15);
            --code-bg: #06090f;
            --code-border: rgba(255, 255, 255, 0.09);
            --header-h: 64px;
            --sidebar-w: 330px;
            --toc-w: 260px;
            --content-max-w: 860px;
            --font-size-content: 16px;
            --line-height: 1.75;
            --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            --font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --font-mono: 'Consolas', 'Courier New', monospace;
        }}

        html.theme-light {{
            --bg-body: #f8fafc;
            --bg-sidebar: #ffffff;
            --bg-card: #f1f5f9;
            --bg-card-hover: #e2e8f0;
            --border-color: #e2e8f0;
            --border-hover: #0284c7;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-muted: #94a3b8;
            --accent-primary: #0284c7;
            --accent-secondary: #6366f1;
            --accent-gradient: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
            --accent-glow: rgba(2, 132, 199, 0.12);
            --code-bg: #0f172a;
            --code-border: #cbd5e1;
        }}

        html.theme-sepia {{
            --bg-body: #fbf7ee;
            --bg-sidebar: #f4ebd8;
            --bg-card: #ebdcc0;
            --bg-card-hover: #decbb0;
            --border-color: #e3d2b2;
            --border-hover: #b45309;
            --text-primary: #433422;
            --text-secondary: #6e583e;
            --text-muted: #9e8465;
            --accent-primary: #b45309;
            --accent-secondary: #92400e;
            --accent-gradient: linear-gradient(135deg, #b45309 0%, #92400e 100%);
            --accent-glow: rgba(180, 83, 9, 0.12);
            --code-bg: #2b2319;
            --code-border: #d4bf9c;
        }}

        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            background-color: var(--bg-body);
            color: var(--text-primary);
            font-family: var(--font-sans);
            font-size: var(--font-size-content);
            line-height: var(--line-height);
            transition: background-color 0.2s, color 0.2s;
            overflow-x: hidden;
        }}

        /* Scrollbars */
        ::-webkit-scrollbar {{ width: 6px; height: 6px; }}
        ::-webkit-scrollbar-track {{ background: transparent; }}
        ::-webkit-scrollbar-thumb {{ background: rgba(255, 255, 255, 0.15); border-radius: 3px; }}
        ::-webkit-scrollbar-thumb:hover {{ background: var(--accent-primary); }}

        /* Top Navbar */
        #navbar {{
            position: fixed;
            top: 0; left: 0; right: 0;
            height: var(--header-h);
            background: var(--bg-sidebar);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            z-index: 100;
        }}

        .brand-container {{
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
        }}

        .brand-logo {{
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: var(--accent-gradient);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 18px;
            box-shadow: 0 4px 12px var(--accent-glow);
        }}

        .brand-text {{ display: flex; flex-direction: column; }}
        .brand-title {{ font-family: var(--font-heading); font-weight: 700; font-size: 15px; color: var(--text-primary); }}
        .brand-subtitle {{ font-size: 11px; color: var(--text-muted); font-weight: 500; }}

        .header-actions {{ display: flex; align-items: center; gap: 8px; }}

        .search-trigger {{
            display: flex;
            align-items: center;
            gap: 10px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 7px 14px;
            border-radius: 8px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.15s;
        }}
        .search-trigger:hover {{ border-color: var(--border-hover); color: var(--text-primary); }}
        .kbd-badge {{
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid var(--border-color);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            font-family: var(--font-mono);
            color: var(--text-muted);
        }}

        .btn-icon {{
            width: 36px; height: 36px;
            border-radius: 8px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.15s;
        }}
        .btn-icon:hover {{ background: var(--bg-card-hover); color: var(--text-primary); transform: translateY(-1px); }}

        /* Top Progress Bar */
        #read-progress {{
            position: fixed;
            top: var(--header-h);
            left: 0;
            height: 3px;
            background: var(--accent-gradient);
            width: 0%;
            z-index: 101;
            box-shadow: 0 0 10px var(--accent-primary);
            transition: width 0.1s ease;
        }}

        /* Layout */
        #main-layout {{
            display: flex;
            margin-top: var(--header-h);
            min-height: calc(100vh - var(--header-h));
        }}

        /* Left Navigation Sidebar */
        #left-sidebar {{
            width: var(--sidebar-w);
            position: fixed;
            top: var(--header-h);
            bottom: 0;
            left: 0;
            background: var(--bg-sidebar);
            border-right: 1px solid var(--border-color);
            overflow-y: auto;
            padding: 20px 14px;
            z-index: 90;
            transition: transform 0.25s ease;
        }}

        .sidebar-part-header {{
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-muted);
            margin: 18px 8px 8px 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }}

        .sidebar-chap-item {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 9px 12px;
            border-radius: 8px;
            color: var(--text-secondary);
            font-size: 13.5px;
            font-weight: 500;
            margin-bottom: 2px;
            cursor: pointer;
            border: 1px solid transparent;
            text-decoration: none;
            transition: all 0.15s;
        }}
        .sidebar-chap-item:hover {{ background: var(--bg-card); color: var(--text-primary); }}
        .sidebar-chap-item.active {{
            background: var(--accent-glow);
            color: var(--accent-primary);
            border-color: rgba(56, 189, 248, 0.3);
            font-weight: 600;
        }}

        .chap-time-badge {{
            font-size: 10.5px;
            padding: 2px 6px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-muted);
        }}
        .sidebar-chap-item.active .chap-time-badge {{
            background: rgba(56, 189, 248, 0.2);
            color: var(--accent-primary);
        }}

        /* Content Reader Area */
        #content-wrapper {{
            margin-left: var(--sidebar-w);
            margin-right: var(--toc-w);
            flex: 1;
            padding: 40px 48px 120px 48px;
            display: flex;
            justify-content: center;
        }}

        .content-inner {{
            width: 100%;
            max-width: var(--content-max-w);
        }}

        .chapter-container {{
            display: none;
        }}
        .chapter-container.active {{
            display: block;
            animation: fadeIn 0.2s ease;
        }}

        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(6px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}

        /* Chapter Hero */
        .chapter-hero {{
            padding-bottom: 28px;
            margin-bottom: 36px;
            border-bottom: 1px solid var(--border-color);
        }}

        .chapter-meta-tag {{
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 6px;
            background: var(--accent-glow);
            color: var(--accent-primary);
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 14px;
            border: 1px solid rgba(56, 189, 248, 0.2);
        }}

        .chapter-main-title {{
            font-family: var(--font-heading);
            font-size: 30px;
            font-weight: 800;
            line-height: 1.25;
            color: var(--text-primary);
            letter-spacing: -0.02em;
            margin-bottom: 14px;
        }}

        .chapter-stats-bar {{
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 13px;
            color: var(--text-muted);
        }}
        .stat-item {{ display: flex; align-items: center; gap: 5px; }}
        .badge-cat {{
            padding: 2px 8px;
            border-radius: 4px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            color: var(--accent-primary);
            font-size: 11px;
            font-weight: 600;
        }}

        /* Markdown Typography */
        .markdown-body {{
            color: var(--text-primary);
            font-size: var(--font-size-content);
            line-height: var(--line-height);
        }}

        .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {{
            font-family: var(--font-heading);
            color: var(--text-primary);
            font-weight: 700;
            line-height: 1.35;
            margin-top: 1.8em;
            margin-bottom: 0.8em;
            scroll-margin-top: 90px;
        }}
        .markdown-body h1 {{ font-size: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }}
        .markdown-body h2 {{ font-size: 20px; }}
        .markdown-body h3 {{ font-size: 17px; }}
        .markdown-body h4 {{ font-size: 15px; }}

        .heading-anchor {{
            color: var(--text-muted);
            text-decoration: none;
            opacity: 0.3;
            margin-right: 6px;
            transition: opacity 0.15s;
        }}
        .heading-anchor:hover {{ opacity: 1; color: var(--accent-primary); }}

        .markdown-body p {{ margin-bottom: 1.3em; color: var(--text-secondary); }}
        .markdown-body strong {{ color: var(--text-primary); font-weight: 600; }}
        .markdown-body em {{ color: var(--text-secondary); }}

        .markdown-body ul, .markdown-body ol {{
            margin-bottom: 1.4em;
            padding-left: 1.6em;
            color: var(--text-secondary);
        }}
        .markdown-body li {{ margin-bottom: 0.4em; }}

        .markdown-body a {{
            color: var(--accent-primary);
            text-decoration: none;
            border-bottom: 1px solid rgba(56, 189, 248, 0.3);
            transition: border-color 0.15s;
        }}
        .markdown-body a:hover {{ border-bottom-color: var(--accent-primary); }}

        .markdown-body hr {{
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 2.2em 0;
        }}

        /* Blockquotes and Alerts */
        .markdown-body blockquote {{
            margin: 1.6em 0;
            padding: 14px 18px;
            border-left: 4px solid var(--accent-primary);
            background: var(--bg-card);
            border-radius: 0 8px 8px 0;
            color: var(--text-secondary);
            font-size: 0.95em;
        }}
        .markdown-body blockquote p:last-child {{ margin-bottom: 0; }}

        .markdown-body blockquote.alert-note {{ border-left-color: #38bdf8; background: rgba(56, 189, 248, 0.06); }}
        .markdown-body blockquote.alert-tip {{ border-left-color: #34d399; background: rgba(52, 211, 153, 0.06); }}
        .markdown-body blockquote.alert-important {{ border-left-color: #818cf8; background: rgba(129, 140, 248, 0.06); }}
        .markdown-body blockquote.alert-warning {{ border-left-color: #fbbf24; background: rgba(251, 191, 36, 0.06); }}
        .markdown-body blockquote.alert-caution {{ border-left-color: #f87171; background: rgba(248, 113, 113, 0.06); }}

        /* Code Blocks */
        .markdown-body code {{
            font-family: var(--font-mono);
            font-size: 0.88em;
            background: var(--bg-card);
            color: var(--accent-primary);
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid var(--border-color);
        }}

        .code-block-wrapper {{
            margin: 1.6em 0;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--code-border);
            background: var(--code-bg);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }}

        .code-block-header {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 7px 14px;
            background: rgba(255, 255, 255, 0.04);
            border-bottom: 1px solid var(--code-border);
            font-size: 11.5px;
            font-family: var(--font-mono);
            color: var(--text-muted);
        }}

        .copy-code-btn {{
            display: flex;
            align-items: center;
            gap: 5px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.15s;
        }}
        .copy-code-btn:hover {{ background: rgba(255, 255, 255, 0.12); color: #fff; }}

        .code-block-wrapper pre {{
            margin: 0;
            padding: 14px 16px;
            overflow-x: auto;
            background: transparent;
        }}
        .code-block-wrapper pre code {{
            background: transparent;
            padding: 0;
            border: none;
            color: #f1f5f9;
            font-size: 13px;
            line-height: 1.6;
            font-family: var(--font-mono);
            white-space: pre;
        }}

        /* Tables */
        .table-responsive {{
            overflow-x: auto;
            margin: 1.6em 0;
        }}
        .markdown-body table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 13.5px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--border-color);
            background: var(--bg-card);
        }}
        .markdown-body th {{
            background: rgba(255, 255, 255, 0.04);
            color: var(--text-primary);
            font-weight: 600;
            text-align: left;
            padding: 10px 14px;
            border-bottom: 1px solid var(--border-color);
        }}
        .markdown-body td {{
            padding: 9px 14px;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-secondary);
        }}
        .markdown-body tr:nth-child(even) {{ background: rgba(255, 255, 255, 0.015); }}
        .markdown-body tr:hover {{ background: rgba(255, 255, 255, 0.035); }}

        .math-inline {{
            font-family: var(--font-mono);
            background: var(--bg-card);
            padding: 1px 5px;
            border-radius: 4px;
            color: #e2e8f0;
            font-size: 0.9em;
        }}

        /* Chapter Footer Nav */
        .chapter-footer-nav {{
            margin-top: 50px;
            padding-top: 24px;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            gap: 16px;
        }}

        .nav-card {{
            flex: 1;
            padding: 16px 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.15s;
            display: flex;
            flex-direction: column;
        }}
        .nav-card:hover {{
            border-color: var(--accent-primary);
            background: var(--bg-card-hover);
            transform: translateY(-2px);
            box-shadow: 0 4px 14px var(--accent-glow);
        }}
        .nav-card.nav-next {{ text-align: right; }}
        .nav-card-label {{ font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }}
        .nav-card-title {{ font-size: 14.5px; font-weight: 700; color: var(--text-primary); }}

        /* Right Floating Table of Contents */
        #right-toc {{
            width: var(--toc-w);
            position: fixed;
            top: var(--header-h);
            bottom: 0;
            right: 0;
            background: var(--bg-body);
            border-left: 1px solid var(--border-color);
            overflow-y: auto;
            padding: 24px 16px;
            z-index: 80;
        }}

        .toc-title {{
            font-size: 11.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }}

        .toc-item-link {{
            display: block;
            font-size: 12px;
            color: var(--text-secondary);
            text-decoration: none;
            padding: 5px 0 5px 10px;
            border-left: 2px solid transparent;
            margin-bottom: 2px;
            line-height: 1.35;
            transition: all 0.15s;
        }}
        .toc-item-link:hover {{ color: var(--text-primary); border-left-color: var(--text-muted); }}
        .toc-item-link.indent-3 {{ padding-left: 20px; font-size: 11px; }}

        /* Search Modal Backdrop */
        #search-backdrop {{
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            z-index: 200;
            display: none;
            align-items: flex-start;
            justify-content: center;
            padding-top: 90px;
        }}

        #search-modal-box {{
            width: 100%;
            max-width: 600px;
            background: var(--bg-sidebar);
            border: 1px solid var(--border-hover);
            border-radius: 14px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }}

        .search-box-header {{
            display: flex;
            align-items: center;
            padding: 14px 18px;
            border-bottom: 1px solid var(--border-color);
            gap: 10px;
        }}

        #modal-search-input {{
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text-primary);
            font-size: 15px;
            font-family: var(--font-sans);
        }}

        #search-results-list {{
            max-height: 400px;
            overflow-y: auto;
            padding: 10px;
        }}

        .search-hit-item {{
            padding: 10px 14px;
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 4px;
            transition: background 0.15s;
        }}
        .search-hit-item:hover {{ background: var(--bg-card); }}
        .search-hit-title {{ font-weight: 600; font-size: 13.5px; color: var(--text-primary); margin-bottom: 3px; }}
        .search-hit-snippet {{ font-size: 12px; color: var(--text-muted); }}

        /* Responsive */
        @media (max-width: 1180px) {{
            #right-toc {{ display: none; }}
            #content-wrapper {{ margin-right: 0; }}
        }}

        @media (max-width: 860px) {{
            #left-sidebar {{ transform: translateX(-100%); }}
            #left-sidebar.open {{ transform: translateX(0); }}
            #content-wrapper {{ margin-left: 0; padding: 20px 16px 80px 16px; }}
            .btn-mobile-toggle {{ display: flex !important; }}
        }}

        .btn-mobile-toggle {{ display: none; }}

        /* Print formatting */
        @media print {{
            #navbar, #left-sidebar, #right-toc, #read-progress, .chapter-footer-nav, .search-trigger, .header-actions {{
                display: none !important;
            }}
            #content-wrapper {{ margin: 0 !important; padding: 0 !important; max-width: 100% !important; }}
            .chapter-container {{ display: block !important; page-break-after: always; }}
            body {{ background: #fff !important; color: #000 !important; }}
        }}
    </style>
</head>
<body>

    <!-- Header Navigation -->
    <header id="navbar">
        <div class="brand-container" onclick="switchChapter('chap-01')">
            <button class="btn-icon btn-mobile-toggle" onclick="toggleSidebar(event)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div class="brand-logo">W</div>
            <div class="brand-text">
                <div class="brand-title">Windows NT Optimization</div>
                <div class="brand-subtitle">Фундаментальное руководство</div>
            </div>
        </div>

        <div class="header-actions">
            <button class="search-trigger" onclick="openSearch()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Поиск...</span>
                <span class="kbd-badge">Ctrl K</span>
            </button>

            <button class="btn-icon" onclick="toggleTheme()" title="Сменить тему оформления">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>

            <button class="btn-icon" onclick="changeFontSize(1)" title="Увеличить текст">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>

            <button class="btn-icon" onclick="changeFontSize(-1)" title="Уменьшить текст">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>

            <button class="btn-icon" onclick="window.print()" title="Сохранить в PDF / Распечатать">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            </button>
        </div>
    </header>

    <!-- Reading Progress Bar -->
    <div id="read-progress"></div>

    <!-- Main Reader Layout -->
    <div id="main-layout">
        
        <!-- Sidebar Navigation -->
        <nav id="left-sidebar">
            {sidebar_rendered}
        </nav>

        <!-- Center Pre-Rendered Content -->
        <main id="content-wrapper">
            <div class="content-inner">
                {all_sections_rendered}
            </div>
        </main>

        <!-- Right Headings Navigation -->
        <aside id="right-toc">
            <div class="toc-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                <span>В этой главе</span>
            </div>
            <div id="toc-nav-links"></div>
        </aside>
    </div>

    <!-- Search Modal -->
    <div id="search-backdrop" onclick="closeSearch(event)">
        <div id="search-modal-box" onclick="event.stopPropagation()">
            <div class="search-box-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="modal-search-input" placeholder="Поиск по терминам, реестру, BIOS, статьям..." autofocus oninput="doSearch(this.value)">
                <span class="kbd-badge" onclick="closeSearch()" style="cursor:pointer;">ESC</span>
            </div>
            <div id="search-results-list">
                <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">
                    Введите запрос (например: <code>Win32PrioritySeparation</code>, <code>MSI-X</code>, <code>HPET</code>, <code>Overdrive</code>)
                </div>
            </div>
        </div>
    </div>

    <!-- Search Index JSON -->
    <script id="search-index-json" type="application/json">
{search_json}
    </script>

    <!-- Client-Side Controller -->
    <script>
        const searchIndex = JSON.parse(document.getElementById('search-index-json').textContent);
        let activeChapId = 'chap-01';
        let currentTheme = 'dark';
        let fontSize = 16;

        document.addEventListener('DOMContentLoaded', () => {{
            const hash = window.location.hash.replace('#', '');
            if (hash && document.getElementById('section-' + hash)) {{
                switchChapter(hash);
            }} else {{
                switchChapter('chap-01');
            }}

            window.addEventListener('scroll', onScrollProgress);

            window.addEventListener('keydown', (e) => {{
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {{
                    e.preventDefault();
                    openSearch();
                }}
                if (e.key === 'Escape') {{
                    closeSearch();
                }}
            }});
        }});

        function switchChapter(chapId) {{
            activeChapId = chapId;
            window.location.hash = chapId;

            // Show active section
            document.querySelectorAll('.chapter-container').forEach(sec => sec.classList.remove('active'));
            const targetSec = document.getElementById('section-' + chapId);
            if (targetSec) {{
                targetSec.classList.add('active');
            }}

            // Update sidebar nav items
            document.querySelectorAll('.sidebar-chap-item').forEach(item => item.classList.remove('active'));
            const activeNav = document.getElementById('nav-item-' + chapId);
            if (activeNav) {{
                activeNav.classList.add('active');
                activeNav.scrollIntoView({{ block: 'nearest', behavior: 'smooth' }});
            }}

            // Render Right TOC
            renderRightTOC(targetSec);

            // Scroll top
            window.scrollTo({{ top: 0, behavior: 'instant' }});
        }}

        function renderRightTOC(sectionEl) {{
            const tocContainer = document.getElementById('toc-nav-links');
            tocContainer.innerHTML = '';
            if (!sectionEl) return;

            const tocDataAttr = sectionEl.getAttribute('data-toc');
            if (!tocDataAttr) return;

            try {{
                const tocItems = JSON.parse(tocDataAttr);
                tocItems.forEach(item => {{
                    const link = document.createElement('a');
                    link.className = `toc-item-link ${{item.level === 3 ? 'indent-3' : ''}}`;
                    link.href = '#' + item.id;
                    link.textContent = item.text;
                    link.onclick = (e) => {{
                        e.preventDefault();
                        const targetEl = document.getElementById(item.id);
                        if (targetEl) targetEl.scrollIntoView({{ behavior: 'smooth' }});
                    }};
                    tocContainer.appendChild(link);
                }});
            }} catch(e) {{
                console.error("TOC parse error", e);
            }}
        }}

        function onScrollProgress() {{
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            document.getElementById('read-progress').style.width = scrolled + '%';
        }}

        function copyCode(btn) {{
            const preCode = btn.closest('.code-block-wrapper').querySelector('pre code');
            if (preCode) {{
                navigator.clipboard.writeText(preCode.textContent).then(() => {{
                    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> <span style="color:#34d399;">Скопировано!</span>';
                    setTimeout(() => {{
                        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Копировать</span>';
                    }}, 2000);
                }});
            }}
        }}

        function toggleTheme() {{
            const html = document.documentElement;
            if (currentTheme === 'dark') {{
                currentTheme = 'light';
                html.className = 'theme-light';
            }} else if (currentTheme === 'light') {{
                currentTheme = 'sepia';
                html.className = 'theme-sepia';
            }} else {{
                currentTheme = 'dark';
                html.className = 'theme-dark';
            }}
        }}

        function changeFontSize(delta) {{
            fontSize = Math.max(13, Math.min(22, fontSize + delta));
            document.documentElement.style.setProperty('--font-size-content', fontSize + 'px');
        }}

        function toggleSidebar(e) {{
            e.stopPropagation();
            document.getElementById('left-sidebar').classList.toggle('open');
        }}

        function openSearch() {{
            document.getElementById('search-backdrop').style.display = 'flex';
            setTimeout(() => document.getElementById('modal-search-input').focus(), 50);
        }}

        function closeSearch(e) {{
            document.getElementById('search-backdrop').style.display = 'none';
        }}

        function doSearch(q) {{
            const list = document.getElementById('search-results-list');
            if (!q || q.trim().length < 2) {{
                list.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">Введите минимум 2 символа...</div>';
                return;
            }}

            const query = q.toLowerCase();
            const hits = searchIndex.filter(item => {{
                return item.title.toLowerCase().includes(query) || 
                       item.short_title.toLowerCase().includes(query) || 
                       item.category.toLowerCase().includes(query) || 
                       item.text.toLowerCase().includes(query);
            }});

            if (hits.length === 0) {{
                list.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">Ничего не найдено</div>';
                return;
            }}

            list.innerHTML = '';
            hits.slice(0, 8).forEach(hit => {{
                const div = document.createElement('div');
                div.className = 'search-hit-item';
                div.onclick = () => {{
                    closeSearch();
                    switchChapter(hit.id);
                }};
                div.innerHTML = `
                    <div class="search-hit-title">${{hit.title}}</div>
                    <div class="search-hit-snippet">${{hit.category}} • ${{hit.short_title}}</div>
                `;
                list.appendChild(div);
            }});
        }}
    </script>
</body>
</html>
"""

    with open(OUTPUT_HTML_PATH, "w", encoding="utf-8") as f:
        f.write(full_html)
        
    with open(OUTPUT_HTML_CHITAT, "w", encoding="utf-8") as f:
        f.write(full_html)
        
    with open(OUTPUT_HTML_INDEX, "w", encoding="utf-8") as f:
        f.write(full_html)

    print(f"Standalone Pre-Rendered HTML Book successfully created!")
    print(f"File size: {len(full_html) / (1024*1024):.2f} MB")
    print(f"Path 1: {OUTPUT_HTML_PATH}")
    print(f"Path 2: {OUTPUT_HTML_CHITAT}")
    print(f"Path 3: {OUTPUT_HTML_INDEX}")

if __name__ == "__main__":
    generate_standalone_html()
