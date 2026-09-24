#!/usr/bin/env python3
"""Generate public HTML pages from a shared chrome/meta pattern."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://sdg.thamdee.com"

def head(title, description, path, extra=""):
    url = ORIGIN + ("/" if path in ("", "index.html") else "/" + path)
    og = ORIGIN + "/assets/og-image.png"
    return f"""<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="{description}">
<meta name="theme-color" content="#8c402a">
<meta name="author" content="บูรพาทิศ พลอยสุวรรณ์">
<title>{title} | อยุธยาเรียนรู้ · SDG 4</title>
<link rel="canonical" href="{url}">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="256x256" href="assets/logo.png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:locale" content="th_TH">
<meta property="og:site_name" content="อยุธยาเรียนรู้ · SDG 4">
<meta property="og:title" content="{title} | อยุธยาเรียนรู้ · SDG 4">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title} | อยุธยาเรียนรู้ · SDG 4">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{og}">
<link rel="stylesheet" href="css/style.css">
{extra}
</head>
"""

def wrap(page, title, description, path, main, extra_head=""):
    noscript = """<noscript><p class="notice">เว็บไซต์ใช้ JavaScript เพื่อโหลดข้อมูล เมนู และบทความ โปรดเปิดใช้งาน หรือเปิดไฟล์ในโฟลเดอร์ content และ data</p>
<nav aria-label="เมนูสำรอง"><a href="index.html">ภาพรวม</a> · <a href="knowledge.html">คลังความรู้</a> · <a href="slides.html">สไลด์นำเสนอ</a> · <a href="about.html">ผู้จัดทำ</a></nav>
<a href="content/source-notes.md">บันทึกแหล่งข้อมูล</a></noscript>"""
    scripts = extra_head
    return head(title, description, path, scripts) + f"""<body data-page="{page}">
<a class="skip" href="#main">ข้ามไปยังเนื้อหา</a>
<header class="site-header" data-chrome="header"></header>
<div class="layout">
<aside class="sidebar" id="sidebar" data-chrome="sidebar"></aside>
<main id="main">
{noscript}
{main}
</main>
</div>
<footer class="site-footer" data-chrome="footer"></footer>
<script src="js/site.js"></script>
<script defer src="js/main.js"></script>
</body>
</html>
"""

MD = '''<script defer src="vendor/marked.min.js" integrity="sha384-948ahk4ZmxYVYOc+rxN1H2gM1EJ2Duhp7uHtZ4WSLkV4Vtx5MUqnV+l7u9B+jFv+" crossorigin="anonymous"></script>
<script defer src="vendor/purify.min.js" integrity="sha384-80VlBZnyAwkkqtSfg5NhPyZff6nU4K/qniLBL8Jnm4KDv6jZhLiYtJbhglg/i9ww" crossorigin="anonymous"></script>'''
INDEX_LIBS = '''<script defer src="vendor/chart.umd.min.js" integrity="sha384-T/4KgSWuZEPozpPz7rnnp/5lDSnpY1VPJCojf1S81uTHS1E38qgLfMgVsAeRCWc4" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"อยุธยาเรียนรู้ · SDG 4","url":"https://sdg.thamdee.com/","inLanguage":"th","description":"พื้นที่ความรู้สาธารณะด้าน SDG 4 จังหวัดพระนครศรีอยุธยา","author":{"@type":"Person","name":"บูรพาทิศ พลอยสุวรรณ์","email":"mailto:burapatis@gmail.com"}}</script>'''

pages = {}

pages["index.html"] = wrap(
    "index",
    "ภาพรวม",
    "เรื่องเล่า ข้อมูล และทางเข้าตามบทบาท สำหรับการพัฒนาการศึกษาที่ยั่งยืนในจังหวัดพระนครศรีอยุธยา — SDG 4",
    "index.html",
    """<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / ภาพรวม</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>เมื่อผู้เรียนย้ายบ้าน การเรียนรู้ไม่ควรหลุดจากระบบ</h1>
<p>เว็บไซต์นี้ช่วยให้เห็นภาพการศึกษาจังหวัดพระนครศรีอยุธยา แยกข้อมูลอ้างอิงจากข้อเสนอ และเลือกทางที่ตรงกับงานของตนเอง</p>
</header>
<section class="story-panel" aria-labelledby="story-title">
<div>
<h2 id="story-title">เรื่องที่ควรเริ่มจากผู้เรียน ไม่ใช่จากตาราง</h2>
<p>ในรายงานสาเหตุการออกกลางคัน มีทั้งการย้ายตามครอบครัว ปัญหาครอบครัว และการปรับตัว การส่งหนังสือข้ามโรงเรียนจึงยังไม่พอ ถ้าไม่มีคนยืนยันว่าผู้เรียนได้เรียนต่อและได้รับความช่วยเหลือที่ปลายทาง</p>
<p>หน้านี้แสดงขนาดระบบการศึกษาและแนวโน้มออกกลางคันตามเอกสารที่ตรวจแล้ว จากนั้นชวนไปดูแนวทางส่งต่อ (E1) วิธีวัดผล และบทบาทหน่วยงาน โดยไม่ใช้ตัวเลขจำลองปนกับข้อมูลอ้างอิง</p>
<p><a class="button" href="projects.html#E1">ดูแนวทางความต่อเนื่องของผู้เรียน</a> <a class="button secondary" href="knowledge.html?article=source-notes">อ่านที่มาของข้อมูล</a></p>
</div>
<aside class="story-aside">
<p class="eyebrow">สิ่งที่หน้านี้ทำ</p>
<p><strong>แยกสถานะข้อมูลชัดเจน</strong> ชุดอ้างอิงมาจากเอกสารจังหวัด ชุดจำลองใช้ทดสอบรูปแบบเว็บเท่านั้น</p>
<p><strong>ไม่ใช่เว็บราชการ</strong> ข้อเสนอโครงการและตัวชี้วัดยังไม่ใช่มติอนุมัติ</p>
<p><a href="#data">ข้ามไปยังตัวเลขและแผนที่ →</a></p>
</aside>
</section>
<div class="section-title"><h2>เริ่มจากบทบาทของคุณ</h2></div>
<div class="role-grid">
<a class="role-card" href="ayutthaya-teacher-toolkit.html">
<span class="eyebrow">01 · ครูและผู้สอน</span>
<h2>เปิดชุดเครื่องมือครู</h2>
<p>คำนวณช่องว่างครูต่อห้อง แบบสำรวจ แผ่นสรุป และร่างข้อความ — ไม่ใช่เกณฑ์ราชการ</p>
</a>
<a class="role-card" href="community.html">
<span class="eyebrow">02 · ครอบครัวและชุมชน</span>
<h2>อ่านฉบับชาวบ้าน</h2>
<p>เล่า SDG 4 เป็นภาษาคนทั่วไป มีรายการเริ่มทำได้เลย และแผ่นพับพิมพ์แจกหมู่บ้าน</p>
</a>
<a class="role-card" href="ayutthaya-sdg4-students.html">
<span class="eyebrow">03 · นักเรียนและผู้เรียน</span>
<h2>อ่านฉบับผู้เรียน</h2>
<p>รู้สิทธิ์ เส้นทางเรียน โครงงานที่เริ่มได้สัปดาห์นี้ และบันไดเมื่อเจอปัญหา</p>
</a>
<a class="role-card" href="agencies.html">
<span class="eyebrow">04 · ผู้ประสานงาน</span>
<h2>ตรวจบทบาทและอำนาจ</h2>
<p>เชื่อมหน่วยงาน ความสอดคล้องของแผน คณะทำงานตามคำสั่ง และกลไก 90 วันที่เป็นข้อเสนอ</p>
</a>
<a class="role-card" href="evaluation.html">
<span class="eyebrow">05 · ผู้ใช้ข้อมูล</span>
<h2>ใช้ตัวเลขอย่างระวัง</h2>
<p>ดูนิยามตัวชี้วัด แบบฟอร์มพิมพ์ได้ และข้อจำกัดก่อนตั้งเป้าหรือสรุปผล</p>
</a>
</div>
<div id="data" class="toolbar">
<div><span class="badge green">SDG 4 · การศึกษาที่มีคุณภาพ</span></div>
<div class="field">
<label for="dataset">ชุดข้อมูลที่แสดง</label>
<select id="dataset">
<option value="reference">ข้อมูลอ้างอิงจากเอกสาร</option>
<option value="demo">ข้อมูลจำลองเพื่อสาธิต</option>
</select>
</div>
</div>
<div id="data-notice" class="notice" role="status">กำลังโหลดข้อมูล…</div>
<div id="stats-cards" class="stats-grid" aria-live="polite"></div>
<div class="section-title"><h2>สถานะข้อมูลตามเป้าหมาย SDG 4</h2></div>
<p class="small muted">แผงนี้บอกว่าเว็บไซต์มีหลักฐานชนิดใด ไม่เปลี่ยนตามชุดข้อมูลจำลอง และไม่ใช่คะแนนผลงานจังหวัด</p>
<div id="sdg-coverage" class="coverage-grid"></div>
<section class="panel watch-panel" aria-labelledby="watch-title">
<h2 id="watch-title">รายการรอตรวจตารางต้นฉบับ</h2>
<p class="sub">ยังไม่เติมลงกราฟหลัก จนกว่าจะเปิดตารางต้นฉบับและยืนยันนิยามปี</p>
<div id="watchlist"></div>
</section>
<div class="grid-two">
<section class="panel">
<h2 id="chart-title">แนวโน้มการศึกษา</h2>
<p id="chart-subtitle" class="sub"></p>
<div class="chart-wrap"><canvas id="trend-chart" role="img" aria-label="กราฟจำนวนออกกลางคัน มีตารางข้อมูลถัดลงไป"></canvas></div>
<p id="chart-fallback" class="small" hidden>ไม่สามารถแสดงกราฟได้ โปรดอ่านตารางด้านล่าง</p>
<details><summary>ดูตารางข้อมูลและข้อจำกัด</summary>
<div id="trend-table" class="table-scroll"></div>
<p id="trend-limit" class="small muted"></p>
</details>
</section>
<section class="panel">
<h2>แยกจำนวนออกจากอัตรา</h2>
<p class="sub">กราฟซ้ายเป็นจำนวนคน ไม่ใช่ร้อยละ และไม่ใช่เด็กนอกระบบทุกกลุ่ม</p>
<ul>
<li>ตัวเลขปี 2562–2566 ใช้ได้เฉพาะขอบเขตตารางต้นทาง</li>
<li>ปี 2567 อยู่ในรายการรอตรวจด้านบน</li>
<li>การย้ายตามครอบครัวไม่เท่ากับการไม่มีที่เรียนปลายทาง</li>
</ul>
<p><a href="knowledge.html?article=source-notes">อ่านบันทึกที่มาและข้อจำกัด →</a></p>
</section>
</div>
<p id="data-source" class="data-status"></p>
<section class="panel map-panel" style="margin-top:22px">
<h2>พื้นที่แห่งการเรียนรู้ทั้ง 16 อำเภอ</h2>
<p class="sub">เลือกชั้นประเด็นเพื่อกรองสี ขอบเขต 16 อำเภอต่อกันเป็นรูปร่างจังหวัดเต็มกรอบ ไม่ใช่ที่ตั้งสถานศึกษา</p>
<p class="small"><a href="#map-list">ข้ามแผนที่ไปใช้รายชื่ออำเภอ</a> หากใช้แป้นพิมพ์หรือโปรแกรมอ่านหน้าจอ</p>
<div id="map-legend" class="map-legend" role="group" aria-label="ชั้นข้อมูลแผนที่"></div>
<div id="map" class="province-map" role="region" aria-label="แผนที่แสดง 16 อำเภอจังหวัดพระนครศรีอยุธยา" aria-describedby="map-note"></div>
<p id="map-detail" class="map-detail" hidden></p>
<p class="map-note" id="map-note"></p>
<details open><summary>รายชื่ออำเภอตามชั้นที่เลือก</summary><ul id="map-list"></ul></details>
</section>
<a href="knowledge.html?article=source-notes" class="small">อ่านบันทึกตรวจสอบและข้อจำกัดของข้อมูล →</a>
<div class="section-title"><h2>จากข้อมูล สู่การลงมือทำ</h2></div>
<div class="link-grid">
<a class="link-card" href="ecosystem.html"><span class="card-number">01 / เข้าใจภาพรวม</span><b>เชื่อมระบบนิเวศการเรียนรู้ →</b><p>สำรวจองค์ประกอบที่ช่วยให้ผู้เรียนก้าวต่อได้</p></a>
<a class="link-card" href="projects.html"><span class="card-number">02 / ออกแบบการทำงาน</span><b>เลือกแนวทางโครงการ →</b><p>ตัวอย่างกิจกรรม เจ้าภาพ และผลลัพธ์ที่คาดหวัง</p></a>
<a class="link-card" href="evaluation.html"><span class="card-number">03 / เรียนรู้จากผลลัพธ์</span><b>วัดผลเพื่อพัฒนา →</b><p>ตัวชี้วัด กระบวนการ และเครื่องมือพร้อมปรับใช้</p></a>
<a class="link-card" href="slides.html"><span class="card-number">04 / เล่าให้ผู้อื่นฟัง</span><b>เปิดสไลด์นำเสนอ →</b><p>ชุดแนะนำเว็บไซต์ SDG 4 ในอยุธยา และข้อเสนอตามหน้าที่คณะทำงาน</p></a>
<a class="link-card" href="community.html"><span class="card-number">05 / อ่านง่าย</span><b>เปิดฉบับอ่านง่าย →</b><p>ภาษาชาวบ้าน ฉบับผู้เรียน ชุดเครื่องมือครู และแผ่นพับพิมพ์แจก</p></a>
</div>
<section class="related-sites" aria-label="เว็บไซต์เรียนรู้ที่เกี่ยวข้อง">
<div class="section-title"><h2>เรียนรู้ต่อจากเว็บไซต์ที่เกี่ยวข้อง</h2></div>
<div class="related-grid" data-related-sites><p class="loading">กำลังโหลดเว็บไซต์ที่เกี่ยวข้อง…</p></div>
<p class="small muted">แหล่งเรียนรู้และข้อเสนอประกอบการพิจารณา · <a href="knowledge.html?article=related-planning">อ่านแนวทางใช้ร่วมกันและข้อจำกัดของข้อมูล →</a></p>
</section>""",
    INDEX_LIBS,
)

pages["knowledge.html"] = wrap(
    "knowledge",
    "คลังความรู้",
    "บทความ นโยบาย และแหล่งอ้างอิงสำหรับการพัฒนาการศึกษาที่ยั่งยืนในอยุธยา — SDG 4",
    "knowledge.html",
    """<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / คลังความรู้</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>นโยบายและคลังความรู้</h1>
<p>เลือกบทความจากบัตรสรุป ค้นด้วยคำสำคัญ หรือเปิดอ่านฉบับเต็มด้านล่าง</p>
</header>
<div class="search-bar">
<div class="field">
<label for="article-q">ค้นหาบทความ</label>
<input id="article-q" type="search" placeholder="เช่น น้ำท่วม, อาชีวะ, คณะทำงาน" autocomplete="off" aria-controls="article-cards">
</div>
</div>
<div id="article-tags" class="tag-row" role="group" aria-label="กรองตามแท็ก"></div>
<p id="article-count" class="small muted" aria-live="polite">กำลังโหลดรายการบทความ…</p>
<div id="article-cards" class="article-grid"></div>
<section class="panel" id="glossary-panel" aria-labelledby="glossary-title">
<h2 id="glossary-title">อภิธานศัพท์สั้น</h2>
<p class="sub">คำที่ใช้ซ้ำบนเว็บนี้ ค้นได้ทันที หรือเปิด<a href="knowledge.html?article=glossary">บทความฉบับเต็ม</a></p>
<label class="sr-only" for="glossary-q">ค้นอภิธานศัพท์</label>
<input id="glossary-q" type="search" placeholder="เช่น ตัวตั้ง, ออกกลางคัน, UDL" autocomplete="off">
<dl id="glossary-list" class="glossary-list"></dl>
</section>
<section id="article-reader" hidden>
<div class="article-tools">
<a class="button secondary" href="knowledge.html" id="article-back">← กลับไปรายการ</a>
<a class="button secondary" id="article-download" href="content/learning-act-2566.md" download>ดาวน์โหลดบทความ .md</a>
<button class="print-button" type="button" data-print>พิมพ์บทความ</button>
</div>
<article id="knowledge-body" class="prose"></article>
</section>
<section class="panel" style="margin-top:24px">
<details><summary>แหล่งข้อมูลและเอกสารอ้างอิงของเว็บไซต์</summary>
<ol id="source-registry" class="source-list"></ol>
</details>
</section>
<section class="related-sites" aria-label="เว็บไซต์เรียนรู้ที่เกี่ยวข้อง">
<div class="section-title"><h2>เรียนรู้ต่อจากเว็บไซต์ที่เกี่ยวข้อง</h2></div>
<div class="related-grid" data-related-sites><p class="loading">กำลังโหลดเว็บไซต์ที่เกี่ยวข้อง…</p></div>
<p class="small muted">แหล่งเรียนรู้และข้อเสนอประกอบการพิจารณา · <a href="knowledge.html?article=related-planning">อ่านแนวทางใช้ร่วมกันและข้อจำกัดของข้อมูล →</a></p>
</section>""",
    MD,
)

def md_page(page, title, description, path, crumb, h1, lede, md_file, extra=""):
    return wrap(page, title, description, path, f"""<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / {crumb}</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>{h1}</h1>
<p>{lede}</p>
</header>
{extra}
<div class="article-tools">
<a class="button secondary" href="{md_file}" download>ดาวน์โหลดเนื้อหา .md</a>
<button class="print-button" type="button" data-print>พิมพ์เนื้อหา</button>
</div>
<article class="prose" data-markdown="{md_file}"><p class="loading">กำลังโหลดเนื้อหา…</p></article>""", MD)

pages["ecosystem.html"] = wrap(
    "ecosystem",
    "ระบบนิเวศ",
    "ผู้เรียนทุกช่วงวัยเป็นศูนย์กลางของความร่วมมือ — SDG 4 จังหวัดพระนครศรีอยุธยา",
    "ecosystem.html",
    """<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / ระบบนิเวศ</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>ระบบนิเวศการพัฒนาการศึกษาที่ยั่งยืน</h1>
<p>ผู้เรียนทุกช่วงวัยเป็นศูนย์กลางของความร่วมมือ</p>
</header>
<p class="notice">กรอบแนวคิดที่เสนอสำหรับจังหวัดพระนครศรีอยุธยา ไม่ใช่โครงสร้างทางการที่ประกาศใช้</p>
<div class="eco-layout">
<div class="eco-hub">
<div class="eco-center">ผู้เรียนทุกช่วงวัย<br><small>เข้าถึง · เรียนรู้ · เติบโต</small></div>
<button class="eco-button" data-eco="0" aria-pressed="true">ครอบครัวและชุมชน</button>
<button class="eco-button" data-eco="1" aria-pressed="false">สถานศึกษาและแหล่งเรียนรู้</button>
<button class="eco-button" data-eco="2" aria-pressed="false">ภาคีและหน่วยงาน</button>
<button class="eco-button" data-eco="3" aria-pressed="false">ทรัพยากรและข้อมูล</button>
</div>
<section id="eco-detail" class="panel" aria-live="polite"></section>
</div>
<div class="article-tools">
<a class="button secondary" href="content/ecosystem.md" download>ดาวน์โหลดเนื้อหา .md</a>
<button class="print-button" type="button" data-print>พิมพ์เนื้อหา</button>
</div>
<article class="prose" data-markdown="content/ecosystem.md"><p class="loading">กำลังโหลดเนื้อหา…</p></article>""",
    MD,
)

pages["agencies.html"] = md_page(
    "agencies", "หน่วยงาน",
    "รู้บทบาท เข้าใจขอบเขต และประสานงานได้ตรงจุด — SDG 4 จังหวัดพระนครศรีอยุธยา",
    "agencies.html", "หน่วยงาน", "บทบาทหน้าที่ของหน่วยงานที่เกี่ยวข้อง",
    "รู้บทบาท เข้าใจขอบเขต และประสานงานได้ตรงจุด", "content/agencies.md",
)

pages["alignment.html"] = wrap(
    "alignment",
    "ความเชื่อมโยง",
    "จากเป้าหมาย SDG 4 สู่ภารกิจ กิจกรรม และความร่วมมือ — SDG 4 จังหวัดพระนครศรีอยุธยา",
    "alignment.html",
    """<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / ความเชื่อมโยง</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>ความเชื่อมโยงนโยบายและความร่วมมือระหว่างพื้นที่</h1>
<p>จากเป้าหมาย SDG 4 สู่ภารกิจ กิจกรรม และความร่วมมือ</p>
</header>
<div class="flow" aria-label="ห่วงโซ่ความเชื่อมโยง">
<span>SDG 4</span><i aria-hidden="true">→</i><span>เป้าหมายนโยบาย</span><i aria-hidden="true">→</i>
<a href="agencies.html">ภารกิจหน่วยงาน</a><i aria-hidden="true">→</i>
<a href="projects.html">กิจกรรม</a><i aria-hidden="true">→</i>
<a href="evaluation.html">ผลลัพธ์</a>
</div>
<section class="panel" aria-labelledby="align-map-title">
<h2 id="align-map-title">แผนภาพระดับนโยบาย</h2>
<p class="sub">กดระดับเพื่อกรองตารางด้านล่าง ลูกศรแสดงทิศทางประสาน ไม่ใช่สายบังคับบัญชาเดียว</p>
<div class="align-diagram">
<button type="button" data-align-level="all" aria-pressed="true">ทุกระดับ</button>
<span class="align-arrow" aria-hidden="true">↓</span>
<button type="button" data-align-level="กระทรวง / ต้นสังกัด">กระทรวง / ต้นสังกัด</button>
<span class="align-arrow" aria-hidden="true">↓</span>
<button type="button" data-align-level="ระดับภาค">สำนักงานศึกษาธิการภาค 1</button>
<span class="align-arrow" aria-hidden="true">↓</span>
<button type="button" data-align-level="ระหว่างจังหวัด">ความร่วมมือระหว่างจังหวัด</button>
<span class="align-arrow" aria-hidden="true">↓</span>
<button type="button" data-align-level="ระดับจังหวัด">จังหวัดและพื้นที่</button>
</div>
</section>
<div class="toolbar">
<div class="field"><label for="alignment-level">ระดับความเชื่อมโยง</label><select id="alignment-level"><option value="all">ทุกระดับ</option></select></div>
<div class="field"><label for="alignment-province">พื้นที่ที่เกี่ยวข้อง</label><select id="alignment-province"><option value="all">ทุกพื้นที่</option></select></div>
<div class="field"><label for="alignment-agency">หน่วยงานที่เกี่ยวข้อง</label><select id="alignment-agency"><option value="all">ทุกหน่วยงาน</option></select></div>
</div>
<p id="alignment-status" role="status"></p>
<div id="alignment-list"></div>
<div class="article-tools">
<a class="button secondary" href="content/alignment.md" download>ดาวน์โหลดเนื้อหา .md</a>
<button class="print-button" type="button" data-print>พิมพ์เนื้อหา</button>
</div>
<article class="prose" data-markdown="content/alignment.md"><p class="loading">กำลังโหลดเนื้อหา…</p></article>""",
    MD,
)

pages["projects.html"] = wrap(
    "projects",
    "โครงการ",
    "หกแนวทางสำหรับนำไปปรับใช้กับบริบทของพื้นที่ — SDG 4 จังหวัดพระนครศรีอยุธยา",
    "projects.html",
    """<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / โครงการ</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>ตัวอย่างโครงการและกิจกรรมสำคัญ</h1>
<p>เลือกปัญหาที่เผชิญ แล้วดูแนวทางตัวอย่างที่จะนำไปปรับใช้ ไม่ใช่โครงการที่อนุมัติแล้ว</p>
</header>
<p class="small muted">ปัญหาของคุณคืออะไร</p>
<div id="project-pathways" class="tag-row" role="group" aria-label="เลือกปัญหาเพื่อกรองโครงการ"></div>
<p id="project-path-status" class="small muted" role="status"></p>
<div id="project-list" class="project-list"></div>
<div class="article-tools">
<a class="button secondary" href="content/projects.md" download>ดาวน์โหลดเนื้อหา .md</a>
<button class="print-button" type="button" data-print>พิมพ์เนื้อหา</button>
</div>
<article class="prose" data-markdown="content/projects.md"><p class="loading">กำลังโหลดเนื้อหา…</p></article>""",
    MD,
)

pages["implementation.html"] = md_page(
    "implementation", "กลไกขับเคลื่อน",
    "หน้าที่คณะทำงาน SDG ด้านการศึกษาตามคำสั่งที่ 32/2568 และข้อเสนอกระบวนการทำงาน — SDG 4 จังหวัดพระนครศรีอยุธยา",
    "implementation.html", "กลไกขับเคลื่อน", "กลไกขับเคลื่อนและเงื่อนไขความสำเร็จ",
    "แสดงหน้าที่ตามคำสั่งแต่งตั้งคณะทำงานระดับจังหวัด และข้อเสนอวงจรทำงานสำหรับพัฒนาต่อ",
    "content/implementation.md",
    """<div class="flow">
<span>คณะกรรมการฯ ระดับกระทรวง</span><i aria-hidden="true">→</i>
<span>คณะทำงานระดับจังหวัด</span><i aria-hidden="true">→</i>
<span>หน้าที่ 2.1–2.7</span><i aria-hidden="true">→</i>
<span>ข้อเสนอกระบวนการบนเว็บนี้</span>
</div>
<p class="notice">หน้าที่ตามคำสั่งเป็นกลไกที่มีอยู่แล้ว วงจร 90 วันในหน้านี้เป็นข้อเสนอ ไม่ใช่ปฏิทินบังคับ และเว็บไซต์นี้ไม่ใช่ระบบรายงานของคณะกรรมการ</p>
<p><a class="button" href="documents/order-sdg4-working-group-ayutthaya-32-2568.docx" download>ดาวน์โหลดสำเนาคำสั่ง .docx</a></p>
""",
)

pages["evaluation.html"] = wrap(
    "evaluation",
    "วัดและประเมินผล",
    "วัดสิ่งที่มีความหมาย และนำหลักฐานกลับไปปรับปรุงงาน — SDG 4 จังหวัดพระนครศรีอยุธยา",
    "evaluation.html",
    """<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / วัดและประเมินผล</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>การติดตาม วัดผล และประเมินผลเพื่อพัฒนา</h1>
<p>วัดสิ่งที่มีความหมาย และนำหลักฐานกลับไปปรับปรุงงาน</p>
</header>
<div class="flow">
<span>กำหนดคำถาม</span><i aria-hidden="true">→</i><span>เก็บหลักฐาน</span><i aria-hidden="true">→</i>
<span>ตีความร่วมกัน</span><i aria-hidden="true">→</i><span>ปรับปรุงและติดตามซ้ำ</span>
</div>
<div class="article-tools">
<a class="button secondary" href="content/evaluation.md" download>ดาวน์โหลดเนื้อหา .md</a>
<button class="print-button" type="button" data-print>พิมพ์เนื้อหา</button>
</div>
<article class="prose" data-markdown="content/evaluation.md"><p class="loading">กำลังโหลดเนื้อหา…</p></article>
<section aria-labelledby="indicators-title">
<div class="section-title"><h2 id="indicators-title">ทะเบียนตัวชี้วัดเสนอสำหรับพื้นที่</h2></div>
<p class="small muted">สถานะอ่านจากค่าฐานและเป้าหมายในข้อมูลเดียวกัน ยังไม่มีการตัดสินผ่าน/ไม่ผ่านอัตโนมัติ อ่าน<a href="knowledge.html?article=glossary">อภิธานศัพท์ตัวตั้ง ตัวหาร และค่าฐาน</a></p>
<label for="indicator-filter">เลือกประเด็น</label>
<select id="indicator-filter"><option value="all">ทุกประเด็น</option></select>
<div id="indicator-board" class="indicator-board"></div>
<div id="indicator-list" class="indicator-list"></div>
</section>
<section class="panel">
<h2>ทดลองคำนวณร้อยละ</h2>
<p class="sub">เครื่องมือช่วยตรวจสูตร ไม่บันทึกหรือส่งข้อมูลที่กรอก และไม่ตัดสินผ่าน/ไม่ผ่าน</p>
<form id="ratio-form" class="calculator">
<div class="field"><label for="numerator">จำนวนที่เข้าเกณฑ์ (ตัวตั้ง)</label><input id="numerator" type="number" min="0" step="1" required placeholder="เช่น 80"></div>
<div class="field"><label for="denominator">จำนวนทั้งหมดในกลุ่มเดียวกัน (ตัวหาร)</label><input id="denominator" type="number" min="1" step="1" required placeholder="เช่น 100"></div>
<button class="button" type="submit">คำนวณร้อยละ</button>
<output id="ratio-result" class="wide" aria-live="polite">กรอกจำนวนเพื่อคำนวณ</output>
</form>
</section>
<div class="section-title"><h2>เครื่องมือตัวอย่างสำหรับพิมพ์และดาวน์โหลด</h2></div>
<p class="small muted">เปิดแบบฟอร์มแล้วใช้คำสั่งพิมพ์ของเบราว์เซอร์เพื่อบันทึกเป็น PDF ไม่มีการส่งข้อมูลออกจากเครื่อง</p>
<div id="download-list" class="download-grid"></div>""",
    MD,
)

pages["forum.html"] = wrap(
    "forum",
    "ร่วมแลกเปลี่ยน",
    "แลกเปลี่ยนประสบการณ์และข้อเสนอเพื่อสังคมแห่งการเรียนรู้ — SDG 4 จังหวัดพระนครศรีอยุธยา",
    "forum.html",
    """<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / ร่วมแลกเปลี่ยน</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>พื้นที่มีส่วนร่วมสาธารณะ</h1>
<p>แลกเปลี่ยนประสบการณ์และข้อเสนอเพื่อสังคมแห่งการเรียนรู้</p>
</header>
<div class="article-tools">
<a class="button secondary" href="content/forum.md" download>ดาวน์โหลดเนื้อหา .md</a>
<button class="print-button" type="button" data-print>พิมพ์เนื้อหา</button>
</div>
<article class="prose" data-markdown="content/forum.md"><p class="loading">กำลังโหลดเนื้อหา…</p></article>
<section class="panel" style="margin-top:24px">
<h2>ส่งข้อเสนอหรือแจ้งข้อมูลคลาดเคลื่อน</h2>
<p class="sub">เปิดโปรแกรมอีเมลบนเครื่องคุณ ไม่มีการเก็บแบบฟอร์มบนเซิร์ฟเวอร์ และไม่ต้องมีบัญชี GitHub อ่าน<a href="about.html#privacy">แนวทางความเป็นส่วนตัว</a></p>
<form id="contribute-form" class="contribute-form">
<div class="field"><label for="contribute-kind">ประเภท</label>
<select id="contribute-kind" name="kind">
<option value="suggestion">ข้อเสนอหรือประสบการณ์</option>
<option value="data-error">แจ้งข้อมูลคลาดเคลื่อน</option>
<option value="question">คำถาม</option>
</select></div>
<div class="field"><label for="contribute-name">ชื่อ (ไม่บังคับ)</label><input id="contribute-name" name="name" type="text" autocomplete="name"></div>
<div class="field"><label for="contribute-email">อีเมลติดต่อกลับ (ไม่บังคับ)</label><input id="contribute-email" name="email" type="email" autocomplete="email"></div>
<div class="field"><label for="contribute-page">หน้าที่เกี่ยวข้อง</label>
<select id="contribute-page" name="page">
<option value="ภาพรวม">ภาพรวม</option>
<option value="คลังความรู้">คลังความรู้</option>
<option value="ระบบนิเวศ">ระบบนิเวศ</option>
<option value="หน่วยงาน">หน่วยงาน</option>
<option value="ความเชื่อมโยง">ความเชื่อมโยง</option>
<option value="โครงการ">โครงการ</option>
<option value="กลไกขับเคลื่อน">กลไกขับเคลื่อน</option>
<option value="วัดและประเมินผล">วัดและประเมินผล</option>
<option value="ร่วมแลกเปลี่ยน">ร่วมแลกเปลี่ยน</option>
<option value="สไลด์นำเสนอ">สไลด์นำเสนอ</option>
<option value="ผู้จัดทำ">ผู้จัดทำ</option>
</select></div>
<div id="error-fields" hidden>
<div class="field"><label for="contribute-item">รายการข้อมูลที่พบว่าคลาดเคลื่อน</label><input id="contribute-item" name="item" type="text" placeholder="เช่น จำนวนออกกลางคันปี 2566"></div>
<div class="field"><label for="contribute-source">แหล่งที่ควรใช้ประกอบการแก้</label><input id="contribute-source" name="source" type="text" placeholder="ชื่อเอกสาร ปี หน้าหรือตาราง"></div>
</div>
<div class="field"><label for="contribute-message">ข้อความ</label><textarea id="contribute-message" name="message" rows="6" required></textarea></div>
<label class="consent"><input id="contribute-consent" type="checkbox" required> ยืนยันว่าจะไม่ส่งชื่อ ภาพ เลขประจำตัว หรือรายละเอียดที่ระบุตัวผู้เรียน</label>
<div class="contribute-actions">
<button class="button" type="submit">เปิดอีเมลถึงผู้จัดทำ</button>
<button class="button secondary" id="copy-contribute" type="button">คัดลอกข้อความ</button>
</div>
<p id="contribute-result" class="small muted" role="status"></p>
</form>
</section>
<section class="panel" style="margin-top:24px">
<h2>กระดานสาธารณะ (ทางเลือก)</h2>
<p id="forum-status" role="status">กำลังตรวจสอบพื้นที่สนทนา…</p>
<button id="load-discussion" class="button" type="button" hidden>เปิดพื้นที่สนทนา Giscus</button>
<div class="giscus" id="giscus-container"></div>
</section>""",
    MD,
)

pages["slides.html"] = wrap(
    "slides",
    "สไลด์นำเสนอ",
    "ชุดสไลด์แนะนำเว็บไซต์อยุธยาเรียนรู้ สาระ SDG 4 และข้อเสนอตามหน้าที่คณะทำงาน — ไม่ใช่เว็บราชการและไม่ใช่มติอนุมัติ",
    "slides.html",
    """<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / สไลด์นำเสนอ</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>สไลด์นำเสนอเนื้อหาเว็บไซต์</h1>
<p>เปิดนำเสนอเต็มจอได้ทันที ทั้งชุดเล่าวิธีใช้เว็บไซต์ ชุดเล่าสาระ SDG 4 ในจังหวัด และชุดข้อเสนอตามหน้าที่คณะทำงาน</p>
</header>
<p class="notice">ชุดสไลด์ใช้เล่าเรื่องตามหน้าเว็บนี้ ไม่ใช่เว็บราชการ ข้อเสนอโครงการ ตัวชี้วัด และวิธีดำเนินงานตามหน้าที่ยังไม่ใช่มติอนุมัติ ตัวเลขบนสไลด์เป็นชุดอ้างอิงเดียวกับหน้าแรก ไม่ปนกับข้อมูลจำลอง</p>
<div class="deck-pick">
<a class="deck-pick-card" href="sdg-thamdee-slides.html">
<span class="eyebrow">01 · แนะนำเว็บไซต์</span>
<h2>sdg.thamdee.com</h2>
<p>10 สไลด์ เล่าสาระของเว็บไซต์ตามหน้าจริง แยกข้อมูลอ้างอิงจากข้อเสนอ และชวนกลับไปดูหน้าใช้งาน</p>
<p class="small muted">ไม่ขยายเกินสิ่งที่เว็บเปิดใช้ และไม่ใช้ตัวเลขจำลองปนกับข้อมูลอ้างอิงจังหวัด</p>
<span class="deck-pick-action">เปิดนำเสนอ →</span>
</a>
<a class="deck-pick-card" href="sdg4-slides.html">
<span class="eyebrow">02 · SDG 4 ในอยุธยา</span>
<h2>จากเป้าหมายโลกสู่งานในจังหวัด</h2>
<p>10 สไลด์ เชื่อม SDG 4 กับความต่อเนื่องของผู้เรียน หลักฐานที่มีบนเว็บ ข้อเสนอ E1–E6 และการวัดผลที่ยังไม่มีค่าฐาน</p>
<p class="small muted">เป็นกรอบแลกเปลี่ยนตามหน้าเว็บนี้ ไม่ใช่สูตรจัดสรรระดับประเทศ และไม่ใช่มติอนุมัติ</p>
<span class="deck-pick-action">เปิดนำเสนอ →</span>
</a>
<a class="deck-pick-card" href="sdg4-duty-slides.html">
<span class="eyebrow">03 · หน้าที่คณะทำงาน</span>
<h2>ข้อเสนอการดำเนินงานรายข้อ 2.1–2.7</h2>
<p>12 สไลด์ แปลหน้าที่ตามคำสั่งที่ 32/2568 เป็นวิธีทำงาน ตัวอย่างผลงาน และสิ่งที่ไม่นับว่าทำครบ สำหรับคณะกรรมการฯ และผู้สนใจทั่วไป</p>
<p class="small muted">เป็นกรณีศึกษาเพื่อแลกเปลี่ยน ไม่ใช่รายงานขององค์คณะ และเว็บนี้ไม่ใช่ช่องทางยื่นรายงาน</p>
<span class="deck-pick-action">เปิดนำเสนอ →</span>
</a>
</div>
<section class="panel" style="margin-top:24px">
<h2>วิธีใช้ตอนนำเสนอ</h2>
<ul>
<li>ปุ่มลูกศรซ้าย–ขวา หรือปุ่มก่อนหน้า/ถัดไป เพื่อเลื่อนสไลด์</li>
<li>กด <kbd>N</kbd> เพื่อเปิดบทพูดของผู้บรรยาย กด <kbd>F</kbd> เพื่อขยายเต็มจอ</li>
<li>บนมือถือปัดซ้าย–ขวาได้ ลิงก์มุมบนกลับไปหน้านี้หรือหน้าแรกได้ตลอด</li>
<li>พิมพ์จากเบราว์เซอร์จะได้สไลด์ครบชุดต่อหน้า หากต้องการไฟล์ PDF</li>
</ul>
<p>ต้องการดูตัวเลขจังหวัด โครงการตัวอย่าง หน้าที่ตามคำสั่ง หรือที่มาของข้อมูล ให้กลับไป<a href="index.html">หน้าภาพรวม</a> <a href="projects.html">หน้าโครงการ</a> <a href="implementation.html">หน้ากลไกขับเคลื่อน</a> <a href="knowledge.html?article=sdg4-duty-proposals">บทความข้อเสนอรายข้อ</a> และ<a href="knowledge.html?article=source-notes">บันทึกที่มา</a></p>
</section>""",
)

pages["community.html"] = wrap(
    "community",
    "ฉบับอ่านง่าย",
    "ฉบับภาษาชาวบ้าน ฉบับผู้เรียน ชุดเครื่องมือครู และแผ่นพับพิมพ์แจก เรื่อง SDG 4 จังหวัดพระนครศรีอยุธยา — ไม่ใช่เว็บราชการและไม่ใช่มติอนุมัติ",
    "community.html",
    """<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / ฉบับอ่านง่าย</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>ฉบับอ่านง่าย: ตามบทบาท</h1>
<p>หน้าเหล่านี้เล่า SDG 4 เป็นภาษาที่ใช้ลงมือได้ สำหรับพ่อแม่ คนในหมู่บ้าน นักเรียน ผู้เรียน ครู และผู้บริหาร โดยไม่ต้องรอศัพท์ราชการ</p>
</header>
<p class="notice">ไม่ใช่เว็บราชการ และไม่ใช่เอกสารแจกของหน่วยงาน ตัวเลขที่ใช้เป็นชุดอ้างอิงเดียวกับหน้าแรก โครงงาน เรื่องสมมติ และเครื่องคำนวณใช้ให้เห็นภาพ ไม่ใช่เกณฑ์อัตรากำลังหรือรายงานโรงเรียนใดโรงเรียนหนึ่ง</p>
<div class="deck-pick">
<a class="deck-pick-card" href="ayutthaya-sdg4.html">
<span class="eyebrow">01 · ชาวบ้าน</span>
<h2>โรงเรียนบ้านเรา</h2>
<p>เล่าว่า SDG 4 คืออะไร ที่อยุธยาบ้านเราเป็นยังไง และคนธรรมดาช่วยอะไรได้บ้าง มีรายการ 10 ข้อให้ติ๊กบนเครื่องท่าน</p>
<p class="small muted">ตัวหนังสือใหญ่ได้ พิมพ์แจกได้ และไม่เก็บรายการติ๊กไว้บนเซิร์ฟเวอร์</p>
<span class="deck-pick-action">เปิดฉบับชาวบ้าน →</span>
</a>
<a class="deck-pick-card" href="ayutthaya-sdg4-students.html">
<span class="eyebrow">02 · ผู้เรียน</span>
<h2>สิทธิ์ที่จะได้เรียนดี</h2>
<p>สำหรับนักเรียน นักศึกษา และผู้เรียนทุกเส้นทาง รู้สิทธิ์ รู้ว่าคุยกับใคร และมีโครงงานที่เริ่มได้สัปดาห์นี้</p>
<p class="small muted">รายการติ๊กจำบนเครื่องท่าน มีสายด่วน 1300 สำหรับเรื่องฉุกเฉิน ไม่ใช่คำปรึกษากฎหมาย</p>
<span class="deck-pick-action">เปิดฉบับผู้เรียน →</span>
</a>
<a class="deck-pick-card" href="ayutthaya-teacher-toolkit.html">
<span class="eyebrow">03 · ครูและผู้บริหาร</span>
<h2>ชุดเครื่องมือ 7 ชิ้น</h2>
<p>คำนวณช่องว่างครูต่อห้อง แบบสำรวจ แผ่นสรุปโรงเรียน สคริปต์คุยชุมชน และร่างข้อความ จำค่าไว้บนเครื่องท่าน</p>
<p class="small muted">ไม่ใช่เกณฑ์อัตรากำลังราชการ และไม่ใช่ช่องทางส่งเรื่องไปยังเขตพื้นที่</p>
<span class="deck-pick-action">เปิดชุดเครื่องมือครู →</span>
</a>
<a class="deck-pick-card" href="ayutthaya-flyer.html">
<span class="eyebrow">04 · พิมพ์แจก</span>
<h2>แผ่นพับพับสามตอน</h2>
<p>กระดาษ A4 แนวนอน พับสามตอน สรุปปัญหาตัวอย่าง และสิ่งที่ชุมชนเริ่มได้ทันที</p>
<p class="small muted">สั่งพิมพ์จากเบราว์เซอร์ ซ่อนแถบเครื่องมือตอนพิมพ์ ไม่ใส่เบอร์ที่ยังไม่ตรวจ</p>
<span class="deck-pick-action">เปิดแผ่นพับ →</span>
</a>
</div>
<section class="panel" style="margin-top:24px">
<h2>วิธีใช้ให้เหมาะกับแต่ละบทบาท</h2>
<ul>
<li>อ่านฉบับชาวบ้านหรือฉบับผู้เรียนบนมือถือได้เลย กดตัวหนังสือใหญ่ถ้าตัวเล็กไป</li>
<li>ครูและผู้บริหารใช้ชุดเครื่องมือเพื่อช่วยคิดและร่างข้อความ แล้วคัดลอกไปจัดรูปแบบตามระเบียบหน่วยงานเอง</li>
<li>พิมพ์แผ่นพับแล้วพับตามเส้นประ แจกในที่ประชุมผู้ปกครอง ศาลาวัด หรือร้านน้ำชา</li>
<li>อย่าเติมตัวเลขเอง ถ้าจะพูดต่อให้ใช้ชุดอ้างอิงหน้าแรกและบอกปีที่มา</li>
<li>อย่ากรอกชื่อผู้เรียนรายคนในช่องของเว็บนี้</li>
<li>อยากดูระบบนิเวศ หน่วยงาน คลังความรู้ หรือตัวเลขเต็ม ให้กลับไป<a href="ecosystem.html">หน้าระบบนิเวศ</a> <a href="agencies.html">หน้าหน่วยงาน</a> <a href="knowledge.html">คลังความรู้</a> และ<a href="knowledge.html?article=source-notes">บันทึกที่มา</a></li>
</ul>
</section>""",
)

pages["about.html"] = wrap(
    "about", "ผู้จัดทำ",
    "พื้นที่ความรู้เพื่อประโยชน์สาธารณะของชาวอยุธยาและผู้สนใจทั่วไป — SDG 4 จังหวัดพระนครศรีอยุธยา",
    "about.html",
    """<div class="breadcrumb">พระนครศรีอยุธยา / SDG 4 / ผู้จัดทำ</div>
<header class="page-head">
<p class="eyebrow">EDUCATION FOR EVERYONE</p>
<h1>เกี่ยวกับผู้จัดทำ</h1>
<p>พื้นที่ความรู้เพื่อประโยชน์สาธารณะของชาวอยุธยาและผู้สนใจทั่วไป</p>
</header>
<div class="article-tools">
<a class="button secondary" href="content/about.md" download>ดาวน์โหลดเนื้อหา .md</a>
<button class="print-button" type="button" data-print>พิมพ์เนื้อหา</button>
</div>
<div class="author-layout">
<figure class="author-portrait">
<img src="assets/author.jpg" alt="บูรพาทิศ พลอยสุวรรณ์ ผู้วิจัยอิสระ ผู้จัดทำเว็บไซต์อยุธยาเรียนรู้ SDG 4" width="320" height="320">
<figcaption>บูรพาทิศ พลอยสุวรรณ์<br>ผู้วิจัยอิสระ</figcaption>
</figure>
<article class="prose" data-markdown="content/about.md"><p class="loading">กำลังโหลดเนื้อหา…</p></article>
</div>""",
    MD,
)

pages["404.html"] = f"""<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="ไม่พบหน้าที่ต้องการบนเว็บไซต์อยุธยาเรียนรู้ SDG 4">
<meta name="theme-color" content="#8c402a">
<meta name="robots" content="noindex">
<title>ไม่พบหน้า | อยุธยาเรียนรู้ · SDG 4</title>
<link rel="canonical" href="{ORIGIN}/404.html">
<base href="/">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="256x256" href="assets/logo.png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="stylesheet" href="css/style.css">
</head>
<body data-page="error">
<a class="skip" href="#main">ข้ามไปยังเนื้อหา</a>
<header class="site-header" data-chrome="header"></header>
<div class="layout">
<aside class="sidebar" id="sidebar" data-chrome="sidebar"></aside>
<main id="main">
<div class="error-page">
<p class="eyebrow">404</p>
<h1>ไม่พบหน้าที่ต้องการ</h1>
<p>ลิงก์นี้อาจเปลี่ยนหรือพิมพ์ไม่ครบ กลับไปหน้าแรกเพื่อเลือกบทบาท คลังความรู้ หรือข้อมูลจังหวัด</p>
<p><a class="button" href="index.html">ไปหน้าแรก sdg.thamdee.com</a></p>
</div>
</main>
</div>
<footer class="site-footer" data-chrome="footer"></footer>
<script src="js/site.js"></script>
</body>
</html>
"""

for name, html in pages.items():
    (ROOT / name).write_text(html, encoding="utf-8")
    print("wrote", name)
print("done")
