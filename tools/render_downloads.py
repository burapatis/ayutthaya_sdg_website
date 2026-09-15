#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SHELL = '''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>{title} | อยุธยาเรียนรู้ · SDG 4</title>
<link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>
<main class="doc-page">
<p class="eyebrow">ต้นแบบเพื่อปรับใช้ · ไม่ใช่แบบราชการ</p>
<h1>{title}</h1>
<p class="doc-note">อยุธยาเรียนรู้ SDG 4 · 15 กันยายน 2569 · กรอกในหน้านี้แล้วใช้คำสั่งพิมพ์ของเบราว์เซอร์เพื่อบันทึกเป็น PDF ข้อมูลไม่ถูกส่งออกจากเครื่อง</p>
<div class="doc-toolbar">
<button class="button" type="button" onclick="window.print()">พิมพ์ / บันทึกเป็น PDF</button>
<a class="button secondary" href="{md}" download>ดาวน์โหลด Markdown</a>
<a class="button secondary" href="../evaluation.html">กลับหน้าวัดและประเมินผล</a>
</div>
{body}
<p class="doc-note">กรอบวิธีประเมินประกอบ: OECD (2021), Applying Evaluation Criteria Thoughtfully และข้อค้นพบคุณภาพข้อมูลใน Projects แบบฟอร์มนี้ยังไม่ผ่านการตรวจคุณภาพเครื่องมือภาคสนาม</p>
</main>
</body>
</html>
'''

def field(label, name, rows=2):
    return f'<div class="field"><label for="{name}">{label}</label><textarea id="{name}" name="{name}" rows="{rows}"></textarea></div>'

def inp(label, name):
    return f'<div class="field"><label for="{name}">{label}</label><input id="{name}" name="{name}" type="text"></div>'

docs = {}

docs["indicator-spec.html"] = (
    "แบบจัดทำรายละเอียดตัวชี้วัด",
    "indicator-spec.md",
    "<p>ใช้หนึ่งฉบับต่อตัวชี้วัด หารือกับเจ้าของข้อมูลและผู้ใช้ผลก่อนกำหนดค่าเป้าหมาย ห้ามใส่ 0 แทนค่าฐานที่ยังไม่มี</p>"
    + "<form>"
    + inp("รหัส / ชื่อตัวชี้วัด", "code")
    + field("คำถามและการตัดสินใจที่จะใช้ผล", "q")
    + field("SDG / เป้าหมายแผน / โครงการ", "sdg")
    + field("ประชากร ขอบเขตพื้นที่ และวันนับ", "pop")
    + field("นิยามสิ่งที่วัดและเงื่อนไขเข้าเกณฑ์", "def")
    + field("ตัวตั้ง / ตัวหาร / สูตร / หน่วย", "formula")
    + field("วิธีไม่นับคนซ้ำ", "dedup")
    + field("ค่าฐาน ปี และหลักฐานรับรอง", "base")
    + field("ค่าเป้าหมาย ปี และเหตุผล", "target")
    + field("เครื่องมือ แหล่งข้อมูล และความถี่", "tool")
    + field("ผู้เก็บ ผู้ตรวจ และผู้รับรอง", "owner")
    + field("การจำแนกและข้อจำกัดการเปิดเผย", "disagg")
    + field("วิธีจัดการข้อมูลขาดและผู้ไม่ตอบ", "missing")
    + field("เกณฑ์แปลผล เงื่อนไขใช้ ข้อจำกัด และรุ่นเครื่องมือ", "limit")
    + "</form>"
    + "<h2>ตรวจตัวอย่างก่อนใช้</h2><p>สร้างกรณีที่เข้าเกณฑ์ ไม่เข้าเกณฑ์ ซ้ำ ขาดข้อมูล และข้ามรอบเวลา ให้ผู้เก็บข้อมูลอย่างน้อยสองคนลองจัดประเภทแล้วปรับนิยามจุดที่เห็นต่าง</p>"
)

docs["evaluation-plan.html"] = (
    "แผนติดตามและประเมินผลโครงการ",
    "evaluation-plan.md",
    "<p>กำหนดก่อนเริ่มกิจกรรม ปรับตามปฏิทินการศึกษาและทรัพยากร</p><form>"
    + field("ชื่อโครงการ / เจ้าภาพ / ระยะเวลา", "name")
    + field("ปัญหาและหลักฐานตั้งต้น", "problem")
    + field("ผู้ใช้ผลและการตัดสินใจที่จะใช้", "users")
    + field("กลุ่มเป้าหมาย / ขอบเขต / ผู้ที่อาจถูกตกหล่น", "scope")
    + field("เส้นทางจากกิจกรรมสู่ผลลัพธ์และสมมติฐาน", "path")
    + "</form>"
    + "<h2>ตารางแผนประเมิน</h2><div class='table-scroll'><table><thead><tr>"
    + "".join(f"<th>{h}</th>" for h in ["คำถามประเมิน","ตัวชี้วัด / เกณฑ์","ข้อมูลฐาน","วิธี / เครื่องมือ","ประชากรหรือวิธีเลือกตัวอย่าง","เวลา","ผู้รับผิดชอบ","การนำผลไปใช้"])
    + "</tr></thead><tbody>"
    + "".join("<tr>" + "".join("<td><textarea rows='2'></textarea></td>" for _ in range(8)) + "</tr>" for _ in range(4))
    + "</tbody></table></div>"
    + "<h2>แผนประกันคุณภาพ</h2><form>"
    + field("การทดลองภาษาและการเข้าถึงเครื่องมือ", "lang")
    + field("การฝึกและตรวจความสอดคล้องผู้เก็บข้อมูล", "train")
    + field("วิธีจัดการผู้ไม่ตอบและข้อมูลขาด", "nr")
    + field("การคุ้มครองข้อมูลและสิทธิผู้ให้ข้อมูล", "privacy")
    + field("วิธีตรวจคำอธิบายอื่นก่อนอ้างสาเหตุ", "alt")
    + field("ผู้ทบทวนข้อค้นพบและวันประชุมปรับปรุง", "review")
    + "</form>"
)

status_opts = "".join(f"<option>{x}</option>" for x in ["ผ่าน","ต้องแก้","ยังตรวจไม่ได้","ไม่เกี่ยวข้อง"])
checks = [
    "มีนิยาม ประชากร และวันนับตรงกัน",
    "ตัวตั้งเป็นส่วนหนึ่งของตัวหารในอัตราที่ต้องการวัด",
    "ไม่รวมร้อยละรายกลุ่มเพื่อหาอัตรารวม",
    "ตรวจคนซ้ำหรือหน่วยซ้ำข้ามสังกัดแล้ว",
    "แยกปีงบประมาณ ปีการศึกษา และปีปฏิทิน",
    "แยกข้อมูลขาดจากค่า 0",
    "ระบุความครอบคลุมและผู้ติดตามไม่ครบ",
    "ตรวจค่าผิดช่วงและค่าที่เปลี่ยนผิดปกติ",
    "สุ่มเทียบเอกสารต้นทางและบันทึกผลตรวจ",
    "เจ้าของข้อมูลรับรองภายในขอบเขตของตน",
    "ตรวจความเสี่ยงเปิดเผยข้อมูลบุคคล/กลุ่มเล็ก",
    "มีบันทึกรุ่นและเหตุผลเมื่อแก้ข้อมูล",
]
rows = "".join(
    f"<tr><th scope='row'>{c}</th><td><select>{status_opts}</select></td><td><textarea rows='2'></textarea></td><td><textarea rows='2'></textarea></td></tr>"
    for c in checks
)
docs["data-quality.html"] = (
    "แบบตรวจสอบคุณภาพข้อมูล",
    "data-quality.md",
    "<p>เลือกสถานะพร้อมหลักฐานและเหตุผล ไม่รวมคะแนนเป็นใบรับรองคุณภาพโดยอัตโนมัติ</p>"
    + "<div class='table-scroll'><table><thead><tr><th>ประเด็นตรวจ</th><th>สถานะ</th><th>หลักฐาน</th><th>สิ่งที่ต้องแก้ / เจ้าภาพ / กำหนด</th></tr></thead><tbody>"
    + rows + "</tbody></table></div>"
    + "<h2>ข้อสรุปการใช้</h2><form>"
    + field("ใช้ตอบคำถามใดได้", "ok")
    + field("คำถามใดยังตอบไม่ได้", "notok")
    + field("รายการที่ต้องพักการตีความ", "hold")
    + field("ผู้ตรวจ / วันที่ / รอบติดตามใหม่", "who")
    + "</form>"
)

docs["learner-voice.html"] = (
    "แนวคำถามรับฟังเสียงผู้เรียน",
    "learner-voice.md",
    "<p>ผู้ให้ข้อมูลเลือกไม่ตอบหรือหยุดได้ ไม่มีผลต่อการได้รับบริการ ห้ามเผยแพร่กรณีที่ระบุตัวบุคคลได้</p><form>"
    + field("1. กิจกรรมหรือบริการนี้ช่วยให้คุณทำอะไรได้ดีขึ้น ยกตัวอย่างได้ไหม", "q1", 3)
    + field("2. ช่วงใดที่เข้าร่วมได้ยาก และอะไรเป็นอุปสรรค", "q2", 3)
    + field("3. สื่อ ภาษา เวลา สถานที่ หรือวิธีเรียนเหมาะกับคุณเพียงใด", "q3", 3)
    + field("4. เมื่อขอความช่วยเหลือ เกิดอะไรขึ้นต่อ และได้รับสิ่งที่ต้องการหรือไม่", "q4", 3)
    + field("5. คุณมีส่วนเลือกวิธีเรียนหรือบอกความคิดเห็นอย่างไร", "q5", 3)
    + field("6. มีผลที่ไม่คาดคิดหรือความไม่สบายใจอะไรที่อยากให้ปรับ", "q6", 3)
    + field("7. ถ้าเปลี่ยนได้หนึ่งอย่าง คุณอยากให้เปลี่ยนอะไร เพราะเหตุใด", "q7", 3)
    + "</form>"
    + "<h2>บันทึกการวิเคราะห์โดยไม่ระบุตัวตน</h2>"
    + "<div class='table-scroll'><table><thead><tr><th>ประเด็น</th><th>สิ่งที่ผู้ให้ข้อมูลสะท้อน</th><th>หลักฐานสนับสนุน / ข้อยกเว้น</th><th>ข้อเสนอปรับปรุง</th></tr></thead><tbody>"
    + "".join("<tr>" + "".join("<td><textarea rows='2'></textarea></td>" for _ in range(4)) + "</tr>" for _ in range(4))
    + "</tbody></table></div>"
)

docs["referral-rubric.html"] = (
    "เกณฑ์บรรยายคุณภาพการส่งต่อ",
    "referral-rubric.md",
    "<p>ให้ผู้เกี่ยวข้องตกลงนิยามบริการ ทันเวลา และหลักฐานก่อนทดลอง ผู้ประเมินสองคนตรวจกรณีเดียวกันอย่างอิสระ</p>"
    + "<div class='table-scroll'><table><thead><tr><th>ระดับ</th><th>คำบรรยายหลักฐาน</th></tr></thead><tbody>"
    + "<tr><th>ยังประเมินไม่ได้</th><td>หลักฐานขาดจนไม่ทราบสถานะ ต้องติดตามเพิ่ม ไม่ให้เป็นศูนย์</td></tr>"
    + "<tr><th>เริ่มดำเนินการ</th><td>มีคำขอส่งต่อ แต่ยังไม่ยืนยันปลายทางรับช่วง</td></tr>"
    + "<tr><th>รับช่วงแล้ว</th><td>ปลายทางรับเรื่องและมีผู้รับผิดชอบ แต่ยังไม่ยืนยันบริการ</td></tr>"
    + "<tr><th>ได้รับบริการ</th><td>ยืนยันว่าผู้เรียนได้รับบริการตามความจำเป็นและเวลาที่ตกลง</td></tr>"
    + "<tr><th>ติดตามและปรับบริการ</th><td>ตรวจผลหลังบริการ รับฟังผู้เรียน และปรับเมื่อมีอุปสรรค</td></tr>"
    + "</tbody></table></div>"
    + "<h2>บันทึกการทดลองเทียบผู้ประเมิน</h2>"
    + "<div class='table-scroll'><table><thead><tr><th>รหัสกรณีที่ไม่ระบุตัวตน</th><th>ระดับผู้ประเมิน ก</th><th>ระดับผู้ประเมิน ข</th><th>หลักฐาน / จุดต่าง</th><th>ข้อสรุปและเหตุผล</th></tr></thead><tbody>"
    + "".join("<tr>" + "".join("<td><textarea rows='2'></textarea></td>" for _ in range(5)) + "</tr>" for _ in range(4))
    + "</tbody></table></div><form>"
    + field("จุดที่ต้องแก้คำบรรยาย", "fix")
    + field("ตัวอย่างหลักฐานที่ต้องเพิ่ม", "ex")
    + field("ความสอดคล้องผู้ประเมินที่ตรวจพบและข้อจำกัด", "agree")
    + field("รุ่นเครื่องมือ / วันทดลองใหม่", "ver")
    + "</form>"
)

docs["improvement-log.html"] = (
    "แบบสรุปผลและแผนปรับปรุง",
    "improvement-log.md",
    "<form>"
    + field("โครงการ / รอบข้อมูล / ผู้จัดทำ", "round")
    + field("คำถามที่ประเมิน", "q")
    + field("ค่าฐาน / เป้าหมาย / เกณฑ์และหลักฐานรับรอง", "base")
    + field("ผลที่พบ / ตัวตั้ง / ตัวหาร / ความครบถ้วน", "result")
    + field("ข้อจำกัดและสิ่งที่ยังสรุปไม่ได้", "limit")
    + field("มุมมองผู้เรียนและภาคี", "voice")
    + field("ผลที่ไม่คาดคิดและกลุ่มที่ยังเข้าไม่ถึง", "unexpected")
    + "</form>"
    + "<h2>แผนปรับปรุง</h2>"
    + "<p class='doc-note'>สถานะควรแยก รอข้อมูล / อยู่ระหว่างทำ / ทำแล้วรอตรวจผล / ตรวจผลแล้ว การส่งเอกสารไม่เท่ากับการแก้ปัญหาสำเร็จ</p>"
    + "<div class='table-scroll'><table><thead><tr>"
    + "".join(f"<th>{h}</th>" for h in ["ข้อค้นพบ","การเปลี่ยนแปลงที่ตกลง","ผู้รับผิดชอบ","ทรัพยากรที่ยืนยัน","วันครบกำหนด","หลักฐานผลหลังปรับ","สถานะ"])
    + "</tr></thead><tbody>"
    + "".join("<tr>" + "".join("<td><textarea rows='2'></textarea></td>" for _ in range(7)) + "</tr>" for _ in range(4))
    + "</tbody></table></div>"
)

for name, (title, md, body) in docs.items():
    html = SHELL.format(title=title, md=md, body=body)
    (ROOT / "downloads" / name).write_text(html, encoding="utf-8")
    print("wrote", name)
print("done")
