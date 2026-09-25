'use strict';

(function () {
  var KEY = 'ayt_school_sdg4_v1';
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function fmt(n, d) {
    if (n == null || !isFinite(n)) return '—';
    return n.toLocaleString('th-TH', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function num(v) {
    if (v === '' || v == null) return null;
    var n = Number(v);
    return isFinite(n) ? n : null;
  }

  var LEVELS = [
    { id: 'ece', label: 'ปฐมวัย / ศูนย์เด็กเล็ก' },
    { id: 'p', label: 'ประถมศึกษา (ป.3 / ป.6)' },
    { id: 'ls', label: 'มัธยมศึกษาตอนต้น' },
    { id: 'us', label: 'มัธยมปลายสายสามัญ' },
    { id: 'voc', label: 'อาชีวศึกษา / ปวช.' },
    { id: 'nfe', label: 'กศน. / การเรียนรู้ผู้ใหญ่' }
  ];

  var INDICATORS = [
    { id: '4111m', code: '4.1.1.1', name: 'สัดส่วนนักเรียนชั้น ป.3 ที่มีความสามารถในการคำนวณขั้นพื้นฐาน', formula: 'ผู้ที่ได้คะแนน NT คณิตศาสตร์ระดับดีขึ้นไป ÷ ผู้เข้าสอบ NT คณิตศาสตร์ ชั้น ป.3 × 100', source: 'NT · สพฐ.', kind: 'pct', levels: ['p'], num: 'ผู้เข้าเกณฑ์ระดับดีขึ้นไป (คน)', den: 'ผู้เข้าสอบ NT คณิตศาสตร์ ป.3 (คน)', note: 'ใช้ผลของสถานศึกษานี้ ไม่ใช่ค่าจังหวัด และเกณฑ์ «ดีขึ้นไป» ต้องตรงกับฉบับสอบนั้น' },
    { id: '4111r', code: '4.1.1.1', name: 'สัดส่วนนักเรียนชั้น ป.3 ที่มีความสามารถในการอ่านขั้นพื้นฐาน', formula: 'ผู้ที่ได้คะแนน NT ภาษาไทย สาระการอ่าน ระดับดีขึ้นไป ÷ ผู้เข้าสอบ NT ภาษาไทย ชั้น ป.3 × 100', source: 'NT · สพฐ.', kind: 'pct', levels: ['p'], num: 'ผู้เข้าเกณฑ์ระดับดีขึ้นไป (คน)', den: 'ผู้เข้าสอบ NT ภาษาไทย ป.3 (คน)', note: 'ใช้ผลของสถานศึกษานี้ ไม่ใช่ค่าจังหวัด' },
    { id: '4112m', code: '4.1.1.2', name: 'สัดส่วนนักเรียนระดับประถมที่มีความสามารถในการคำนวณขั้นพื้นฐาน', formula: 'ผู้ที่ได้ O-NET คณิตศาสตร์ตั้งแต่ 50 คะแนนขึ้นไป ÷ ผู้เข้าสอบ O-NET คณิตศาสตร์ระดับประถม × 100', source: 'O-NET · สทศ.', kind: 'pct', levels: ['p'], num: 'ผู้ได้ตั้งแต่ 50 คะแนนขึ้นไป (คน)', den: 'ผู้เข้าสอบ O-NET คณิตศาสตร์ (คน)', note: 'เกณฑ์ 50 คะแนนมาจากตารางประเทศ ไม่ใช่เป้าที่เว็บนี้ตั้งให้จังหวัด' },
    { id: '4112r', code: '4.1.1.2', name: 'สัดส่วนนักเรียนระดับประถมที่มีความสามารถในการอ่านขั้นพื้นฐาน', formula: 'ผู้ที่ได้ O-NET ภาษาไทยตั้งแต่ 50 คะแนนขึ้นไป ÷ ผู้เข้าสอบ O-NET ภาษาไทยระดับประถม × 100', source: 'O-NET · สทศ.', kind: 'pct', levels: ['p'], num: 'ผู้ได้ตั้งแต่ 50 คะแนนขึ้นไป (คน)', den: 'ผู้เข้าสอบ O-NET ภาษาไทย (คน)', note: 'เกณฑ์ 50 คะแนนมาจากตารางประเทศ' },
    { id: '4113m', code: '4.1.1.3', name: 'สัดส่วนนักเรียน ม.ต้น ที่มีความสามารถในการคำนวณขั้นพื้นฐาน', formula: 'ผู้ที่ได้ O-NET คณิตศาสตร์ตั้งแต่ 50 คะแนนขึ้นไป ÷ ผู้เข้าสอบ O-NET คณิตศาสตร์ ม.ต้น × 100', source: 'O-NET · สทศ.', kind: 'pct', levels: ['ls'], num: 'ผู้ได้ตั้งแต่ 50 คะแนนขึ้นไป (คน)', den: 'ผู้เข้าสอบ O-NET คณิตศาสตร์ ม.ต้น (คน)', note: 'เกณฑ์ 50 คะแนนมาจากตารางประเทศ' },
    { id: '4113r', code: '4.1.1.3', name: 'สัดส่วนนักเรียน ม.ต้น ที่มีความสามารถในการอ่านขั้นพื้นฐาน', formula: 'ผู้ที่ได้ O-NET ภาษาไทยตั้งแต่ 50 คะแนนขึ้นไป ÷ ผู้เข้าสอบ O-NET ภาษาไทย ม.ต้น × 100', source: 'O-NET · สทศ.', kind: 'pct', levels: ['ls'], num: 'ผู้ได้ตั้งแต่ 50 คะแนนขึ้นไป (คน)', den: 'ผู้เข้าสอบ O-NET ภาษาไทย ม.ต้น (คน)', note: 'เกณฑ์ 50 คะแนนมาจากตารางประเทศ' },
    { id: '4121p', code: '4.1.2.1', name: 'อัตราการสำเร็จระดับประถมศึกษา', formula: 'จำนวนนักเรียนชั้น ป.6 ÷ ประชากรอายุ 11 ปี × 100', source: 'สกศ.', kind: 'pct-pop', levels: ['p'], num: 'นักเรียนชั้น ป.6 ของสถานศึกษานี้ (คน)', den: 'ประชากรอายุ 11 ปีในเขตบริการ (คน) — ถ้ามี', note: 'ตัวหารตามนิยามประเทศเป็นประชากรวัย ไม่ใช่จำนวนนักเรียนในโรงเรียน หากไม่มีตัวหาร จะคำนวณอัตราสำเร็จตามสูตรนี้ไม่ได้' },
    { id: '4121l', code: '4.1.2.1', name: 'อัตราการสำเร็จระดับมัธยมศึกษาตอนต้น', formula: 'จำนวนนักเรียนชั้น ม.3 ÷ ประชากรอายุ 14 ปี × 100', source: 'สกศ.', kind: 'pct-pop', levels: ['ls'], num: 'นักเรียนชั้น ม.3 ของสถานศึกษานี้ (คน)', den: 'ประชากรอายุ 14 ปีในเขตบริการ (คน) — ถ้ามี', note: 'คนละนิยามกับจำนวนออกกลางคัน หากไม่มีตัวหารประชากรวัย จะคำนวณอัตราสำเร็จตามสูตรประเทศไม่ได้' },
    { id: '4121u', code: '4.1.2.1', name: 'อัตราการสำเร็จระดับมัธยมศึกษาตอนปลาย', formula: 'จำนวนนักเรียนชั้น ม.6 / ปวช.3 ÷ ประชากรอายุ 17 ปี × 100', source: 'สกศ.', kind: 'pct-pop', levels: ['us', 'voc'], num: 'นักเรียนชั้น ม.6 หรือ ปวช.3 ของสถานศึกษานี้ (คน)', den: 'ประชากรอายุ 17 ปีในเขตบริการ (คน) — ถ้ามี', note: 'หากไม่มีตัวหารประชากรวัย จะคำนวณอัตราสำเร็จตามสูตรประเทศไม่ได้' },
    { id: '4211', code: '4.2.1.1', name: 'ร้อยละของเด็ก 0–5 ปีที่มีพัฒนาการสมวัย', formula: 'เด็ก 0–5 ปีที่มีพัฒนาการสมวัย ÷ เด็ก 0–5 ปีที่ประเมิน × 100', source: 'จปฐ.', kind: 'pct', levels: ['ece'], num: 'เด็ก 0–5 ปีที่มีพัฒนาการสมวัย (คน)', den: 'เด็ก 0–5 ปีที่สถานศึกษานี้ประเมิน (คน)', note: 'ค่านี้เป็นการประเมินในสถานศึกษา/ศูนย์ หากไม่ได้ใช้ชุด จปฐ. ให้ระบุในหมายเหตุว่าคนละแหล่ง' },
    { id: '4221', code: '4.2.2.1', name: 'อัตราการเตรียมความพร้อมอย่างน้อย 1 ปีก่อนประถม', formula: 'เด็ก 5 ปีที่เรียนก่อนประถมหรือสูงกว่า ÷ เด็กอายุ 5 ปี × 100', source: 'สกศ.', kind: 'pct-pop', levels: ['ece'], num: 'เด็ก 5 ปีที่เรียนในสถานศึกษานี้ (คน)', den: 'เด็กอายุ 5 ปีในเขตบริการ (คน) — ถ้ามี', note: 'ตัวหารตามนิยามประเทศเป็นเด็กอายุ 5 ปีทั้งพื้นที่ ไม่ใช่เฉพาะเด็กในศูนย์นี้' },
    { id: '4311', code: '4.3.1.1', name: 'สัดส่วนนักเรียนมัธยมปลายสายอาชีวศึกษา', formula: 'นักเรียน ม.ปลายสายอาชีวะ ÷ นักเรียน ม.ปลายทั้งหมด × 100', source: 'สกศ.', kind: 'pct', levels: ['us', 'voc'], num: 'นักเรียนสายอาชีวะ / ปวช. ในสถานศึกษานี้ (คน)', den: 'นักเรียนระดับ ม.ปลายทั้งหมดในสถานศึกษานี้ (คน)', note: 'ค่านี้เป็นสัดส่วนในสถานศึกษานี้ ไม่ใช่สัดส่วนทั้งจังหวัด หากเป็นโรงเรียนสามัญล้วน ค่าจะเป็น 0 หากเป็นอาชีวะล้วน ค่าจะเป็น 100' },
    { id: '4511', code: '4.5.1.1', name: 'ดัชนีความเท่าเทียมทางเพศของการเข้าเรียนระดับประถม', formula: 'อัตราส่วนจำนวนเข้าเรียนระหว่างชายและหญิง', source: 'สกศ.', kind: 'gpi', levels: ['p'], num: 'นักเรียนชายระดับประถม (คน)', den: 'นักเรียนหญิงระดับประถม (คน)', note: 'คำนวณจากหัวในสถานศึกษานี้ ไม่ใช่อัตราเข้าเรียนสุทธิ (NER) ซึ่งใช้ประชากรวัยเป็นตัวหาร' },
    { id: '4512', code: '4.5.1.2', name: 'ดัชนีความเท่าเทียมทางเพศของการเข้าเรียน ม.ต้น', formula: 'อัตราส่วนจำนวนเข้าเรียนระหว่างชายและหญิง', source: 'สกศ.', kind: 'gpi', levels: ['ls'], num: 'นักเรียนชาย ม.ต้น (คน)', den: 'นักเรียนหญิง ม.ต้น (คน)', note: 'คำนวณจากหัวในสถานศึกษานี้ ไม่ใช่ NER' },
    { id: '4513', code: '4.5.1.3', name: 'ดัชนีความเท่าเทียมทางเพศของการเข้าเรียน ม.ปลาย', formula: 'อัตราส่วนจำนวนเข้าเรียนระหว่างชายและหญิง', source: 'สกศ.', kind: 'gpi', levels: ['us', 'voc'], num: 'นักเรียนชาย ม.ปลาย / ปวช. (คน)', den: 'นักเรียนหญิง ม.ปลาย / ปวช. (คน)', note: 'คำนวณจากหัวในสถานศึกษานี้ ไม่ใช่ NER' },
    { id: '4611', code: '4.6.1.1', name: 'ร้อยละคนอายุ 15–59 ปีที่อ่าน เขียน และคิดเลขอย่างง่ายได้', formula: 'ผู้ที่อ่านเขียนคิดเลขได้ ÷ คนอายุ 15–59 ปีที่สำรวจ × 100', source: 'จปฐ.', kind: 'pct', levels: ['nfe'], num: 'ผู้ที่อ่าน เขียน และคิดเลขอย่างง่ายได้ (คน)', den: 'ผู้รับการสำรวจอายุ 15–59 ปีในสถานศึกษานี้ (คน)', note: 'ใช้ได้กับ กศน./ศูนย์การเรียนรู้ หากไม่ได้ใช้ชุด จปฐ. ให้ระบุว่าคนละแหล่ง' },
    { id: '4711', code: '4.7.1.1', name: 'ร้อยละนักเรียน ม.ต้น ที่ได้เรียนหลักสูตรสิ่งแวดล้อมและธรณีวิทยา', formula: 'นักเรียน ม.ต้นที่ได้เรียนเนื้อหานี้ ÷ นักเรียน ม.ต้นทั้งหมด × 100', source: 'สพฐ.', kind: 'pct', levels: ['ls'], num: 'นักเรียน ม.ต้นที่ได้เรียนเนื้อหาสิ่งแวดล้อม/ธรณีวิทยา (คน)', den: 'นักเรียน ม.ต้นทั้งหมด (คน)', note: 'สูตรในตารางประเทศวัดการได้เรียนเนื้อหา ไม่ใช่คะแนนความเข้าใจ' },
    { id: '4712', code: '4.7.1.2', name: 'ร้อยละนักเรียน ม.ต้น ที่ได้เรียนหลักสูตรความเป็นพลเมือง', formula: 'นักเรียน ม.ต้นที่ได้เรียนเนื้อหาความเป็นพลเมือง ÷ นักเรียน ม.ต้นทั้งหมด × 100', source: 'สพฐ.', kind: 'pct', levels: ['ls'], num: 'นักเรียน ม.ต้นที่ได้เรียนเนื้อหาความเป็นพลเมือง (คน)', den: 'นักเรียน ม.ต้นทั้งหมด (คน)', note: 'สูตรวัดการได้เรียนเนื้อหา ไม่ใช่ดัชนีความภาคภูมิใจหรือจำนวนทริปมรดก' },
    { id: '4a11', code: '4.a.1.1', name: 'ร้อยละของโรงเรียนที่มีคอมพิวเตอร์ที่ใช้ในการเรียนการสอน', formula: 'มี / ไม่มี ในสถานศึกษานี้ (นิยามประเทศนับร้อยละของโรงเรียนในชุดข้อมูล)', source: 'ศทก.สป.', kind: 'yn', levels: ['ece', 'p', 'ls', 'us', 'voc', 'nfe'], note: 'สถานศึกษาแห่งหนึ่งมีค่าเป็น 100 หรือ 0 ไม่ใช่ร้อยละทั้งจังหวัด' },
    { id: '4a12', code: '4.a.1.2', name: 'ร้อยละของโรงเรียนที่ใช้ไฟฟ้าในการเรียนการสอน', formula: 'มี / ไม่มี ในสถานศึกษานี้', source: 'ศทก.สป.', kind: 'yn', levels: ['ece', 'p', 'ls', 'us', 'voc', 'nfe'], note: 'สถานศึกษาแห่งหนึ่งมีค่าเป็น 100 หรือ 0' },
    { id: '4a13', code: '4.a.1.3', name: 'ร้อยละของโรงเรียนที่เข้าถึงอินเทอร์เน็ตสำหรับเรียนการสอน', formula: 'มี / ไม่มี ในสถานศึกษานี้', source: 'ศทก.สป.', kind: 'yn', levels: ['ece', 'p', 'ls', 'us', 'voc', 'nfe'], note: 'สถานศึกษาแห่งหนึ่งมีค่าเป็น 100 หรือ 0' },
    { id: '4a14', code: '4.a.1.4', name: 'ร้อยละของโรงเรียนที่มีบริการน้ำดื่มสะอาด', formula: 'มี / ไม่มี ในสถานศึกษานี้', source: 'ศทก.สป.', kind: 'yn', levels: ['ece', 'p', 'ls', 'us', 'voc', 'nfe'], note: 'สถานศึกษาแห่งหนึ่งมีค่าเป็น 100 หรือ 0' },
    { id: '4a15', code: '4.a.1.5', name: 'ร้อยละของโรงเรียนที่มีสิ่งอำนวยความสะดวกในการล้างมือ', formula: 'มี / ไม่มี ในสถานศึกษานี้', source: 'ศทก.สป.', kind: 'yn', levels: ['ece', 'p', 'ls', 'us', 'voc', 'nfe'], note: 'สถานศึกษาแห่งหนึ่งมีค่าเป็น 100 หรือ 0' },
    { id: '4a21', code: '4.a.2.1', name: 'ร้อยละของนักเรียนที่ถูกรังแกภายในปีการศึกษาที่ผ่านมา', formula: 'นักเรียนที่ถูกรังแก ÷ นักเรียนที่สำรวจ × 100', source: 'ศธจ. · ศธภ.', kind: 'pct', levels: ['p', 'ls', 'us', 'voc'], sensitive: true, num: 'นักเรียนที่ถูกรังแกตามนิยามที่ใช้อ้างอิง (คน)', den: 'นักเรียนที่สำรวจ (คน)', note: 'ห้ามกรอกชื่อ ถ้าตัวหารน้อยกว่า 10 คน ใบพิมพ์จะไม่แสดงจำนวนคน นิยามต้องตรงกับเครื่องมือที่ใช้อ้างอิง' },
    { id: '4c11', code: '4.c.1.1', name: 'สัดส่วนครูประถมที่มีใบประกอบวิชาชีพครู / ใบประกอบการสอน', formula: 'ครูประถมที่สอนและมีใบประกอบ ÷ ครูประถมที่ปฏิบัติการสอน × 100', source: 'ศทก.สป.', kind: 'pct', levels: ['p'], num: 'ครูประถมที่มีใบประกอบ (คน)', den: 'ครูประถมที่ปฏิบัติการสอน (คน)', note: 'ไม่ใช่เกณฑ์อัตรากำลัง และไม่แทน I04 ซึ่งวัดการนำไปใช้ในชั้นเรียน' },
    { id: '4c12', code: '4.c.1.2', name: 'สัดส่วนครู ม.ต้น ที่มีใบประกอบวิชาชีพครู / ใบประกอบการสอน', formula: 'ครู ม.ต้น ที่สอนและมีใบประกอบ ÷ ครู ม.ต้น ที่ปฏิบัติการสอน × 100', source: 'ศทก.สป.', kind: 'pct', levels: ['ls'], num: 'ครู ม.ต้น ที่มีใบประกอบ (คน)', den: 'ครู ม.ต้น ที่ปฏิบัติการสอน (คน)', note: 'ไม่ใช่เกณฑ์อัตรากำลัง และไม่แทน I04' },
    { id: '4c13', code: '4.c.1.3', name: 'สัดส่วนครู ม.ปลาย ที่มีใบประกอบวิชาชีพครู / ใบประกอบการสอน', formula: 'ครู ม.ปลาย ที่สอนและมีใบประกอบ ÷ ครู ม.ปลาย ที่ปฏิบัติการสอน × 100', source: 'ศทก.สป.', kind: 'pct', levels: ['us', 'voc'], num: 'ครู ม.ปลาย ที่มีใบประกอบ (คน)', den: 'ครู ม.ปลาย ที่ปฏิบัติการสอน (คน)', note: 'ไม่ใช่เกณฑ์อัตรากำลัง และไม่แทน I04' },
    { id: '4c21', code: '4.c.2.1', name: 'สัดส่วนครูประถมที่ได้รับการอบรมหรือพัฒนาการจัดการเรียนรู้', formula: 'ครูประถมที่ได้รับการอบรม ÷ ครูประถมที่ปฏิบัติการสอน × 100', source: 'ศทก.สป.', kind: 'pct', levels: ['p'], num: 'ครูประถมที่ได้รับการอบรมตามนิยามปีนี้ (คน)', den: 'ครูประถมที่ปฏิบัติการสอน (คน)', note: 'การเข้าอบรมไม่เท่ากับการนำไปใช้ในชั้นเรียน' },
    { id: '4c22', code: '4.c.2.2', name: 'สัดส่วนครู ม.ต้น ที่ได้รับการอบรมหรือพัฒนาการจัดการเรียนรู้', formula: 'ครู ม.ต้น ที่ได้รับการอบรม ÷ ครู ม.ต้น ที่ปฏิบัติการสอน × 100', source: 'ศทก.สป.', kind: 'pct', levels: ['ls'], num: 'ครู ม.ต้น ที่ได้รับการอบรมตามนิยามปีนี้ (คน)', den: 'ครู ม.ต้น ที่ปฏิบัติการสอน (คน)', note: 'การเข้าอบรมไม่เท่ากับการนำไปใช้ในชั้นเรียน' },
    { id: '4c23', code: '4.c.2.3', name: 'สัดส่วนครู ม.ปลาย ที่ได้รับการอบรมหรือพัฒนาการจัดการเรียนรู้', formula: 'ครู ม.ปลาย ที่ได้รับการอบรม ÷ ครู ม.ปลาย ที่ปฏิบัติการสอน × 100', source: 'ศทก.สป.', kind: 'pct', levels: ['us', 'voc'], num: 'ครู ม.ปลาย ที่ได้รับการอบรมตามนิยามปีนี้ (คน)', den: 'ครู ม.ปลาย ที่ปฏิบัติการสอน (คน)', note: 'การเข้าอบรมไม่เท่ากับการนำไปใช้ในชั้นเรียน' }
  ];

  var NOT_SCHOOL = [
    { code: '4.3.2.1', name: 'อัตราการเรียนต่อหรือสำเร็จอุดมศึกษาของประชากรอายุ 25–34 ปี', why: 'ตัวหารเป็นประชากรวัยในพื้นที่ ไม่ใช่ผู้เรียนในสถานศึกษา' },
    { code: '4.4.1.1', name: 'ร้อยละประชากรอายุ 15 ปีขึ้นไปที่ใช้อินเทอร์เน็ต', why: 'สถิติประชากรของสำนักงานสถิติแห่งชาติ ไม่ใช่ทักษะ ICT ของนักเรียนในโรงเรียน' },
    { code: '4.5.2.1', name: 'ดัชนีความเท่าเทียมทางเพศของอัตราสำเร็จอุดมศึกษาอายุ 25–34 ปี', why: 'เป็นสถิติประชากรระดับพื้นที่/ประเทศ' },
    { code: '4.b.1.1', name: 'จำนวนทุนการศึกษาหรือความช่วยเหลือ ODA ที่ให้ประเทศไทย', why: 'ตัวตั้งเป็นทุนระดับประเทศ ปีสิ้นสุดในตารางคือ พ.ศ. 2563 ไม่ใช่จำนวนทุนที่นักเรียนในโรงเรียนได้รับ' }
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  function current() {
    var o = load();
    ['f_school', 'f_area', 'f_year', 'f_who', 'f_role', 'f_remark'].forEach(function (id) {
      var el = $(id);
      if (el) o[id] = el.value;
    });
    LEVELS.forEach(function (lv) {
      var el = $('lv_' + lv.id);
      if (el) o['lv_' + lv.id] = !!el.checked;
    });
    INDICATORS.forEach(function (ind) {
      if (ind.kind === 'yn') {
        var s = $('yn_' + ind.id);
        if (s) o['yn_' + ind.id] = s.value;
      } else {
        var n = $('n_' + ind.id);
        var d = $('d_' + ind.id);
        if (n) o['n_' + ind.id] = n.value;
        if (d) o['d_' + ind.id] = d.value;
      }
    });
    return o;
  }

  function selectedLevels() {
    var on = LEVELS.filter(function (lv) { return $('lv_' + lv.id) && $('lv_' + lv.id).checked; }).map(function (lv) { return lv.id; });
    return on;
  }

  function visible(ind) {
    var on = selectedLevels();
    if (!on.length) return true;
    return ind.levels.some(function (lv) { return on.indexOf(lv) !== -1; });
  }

  function pct(n, d, opt) {
    opt = opt || {};
    if (n == null && d == null) return { status: 'empty', text: 'ยังไม่กรอก', detail: '—', note: opt.empty || 'กรอกตัวตั้งและตัวหาร' };
    if (opt.needDen && (d == null || d <= 0) && n != null) {
      return { status: 'need', text: 'ยังไม่มีตัวหาร', detail: 'ตัวตั้ง ' + fmt(n, 0) + ' คน', note: opt.needNote || 'ยังคำนวณตามสูตรประเทศไม่ได้' };
    }
    if (n == null || d == null) return { status: 'empty', text: 'ยังไม่กรอกครบ', detail: '—', note: 'ต้องมีทั้งตัวตั้งและตัวหาร' };
    if (d <= 0) return { status: 'bad', text: 'คำนวณไม่ได้', detail: '—', note: 'ตัวหารต้องมากกว่า 0' };
    if (n < 0) return { status: 'bad', text: 'คำนวณไม่ได้', detail: '—', note: 'ตัวตั้งต้องไม่ติดลบ' };
    var p = n / d * 100;
    var note = n > d ? 'ตัวตั้งมากกว่าตัวหาร ตรวจนิยามก่อนใช้' : '';
    if (opt.sensitive && d < 10) note = (note ? note + ' · ' : '') + 'กลุ่มเล็กกว่า 10 คน ใบพิมพ์จะไม่แสดงจำนวนคน';
    return {
      status: n > d ? 'warn' : 'ok',
      text: fmt(p, 1) + '%',
      value: p,
      detail: fmt(n, 0) + ' / ' + fmt(d, 0),
      n: n,
      d: d,
      note: note,
      hideCounts: !!(opt.sensitive && d < 10)
    };
  }

  function gpi(male, female) {
    if (male == null && female == null) return { status: 'empty', text: 'ยังไม่กรอก', detail: '—', note: 'กรอกจำนวนชายและหญิง' };
    if (male == null || female == null) return { status: 'empty', text: 'ยังไม่กรอกครบ', detail: '—', note: 'ต้องมีทั้งชายและหญิง' };
    if (male < 0 || female < 0) return { status: 'bad', text: 'คำนวณไม่ได้', detail: '—', note: 'จำนวนต้องไม่ติดลบ' };
    if (male === 0 && female === 0) return { status: 'empty', text: 'ยังไม่มีผู้เรียน', detail: '0 / 0', note: 'ไม่มีตัวหาร' };
    var parts = [];
    if (male > 0) parts.push('ชาย/หญิง = ' + fmt(male / Math.max(female, 0.0001), 2));
    if (female > 0 && male > 0) parts.push('หญิง/ชาย = ' + fmt(female / male, 2));
    else if (male === 0) parts.push('ชายเป็น 0 คำนวณชาย/หญิงไม่ได้');
    else if (female === 0) parts.push('หญิงเป็น 0 คำนวณหญิง/ชายไม่ได้');
    var main = male > 0 && female > 0 ? fmt(male / female, 2) : '—';
    return {
      status: male > 0 && female > 0 ? 'ok' : 'warn',
      text: main,
      detail: 'ชาย ' + fmt(male, 0) + ' · หญิง ' + fmt(female, 0),
      note: parts.join(' · ') + ' · ค่าหลักที่แสดงคืออัตราส่วนชาย/หญิงตามชื่อในเอกสาร ไม่ใช่ NER'
    };
  }

  function yn(v) {
    if (v === 'yes') return { status: 'ok', text: 'มี · 100%', detail: 'สถานศึกษานี้มี', note: 'ค่าร้อยละโรงเรียนในชุดข้อมูลประเทศจะรวมหลายแห่ง' };
    if (v === 'no') return { status: 'warn', text: 'ไม่มี · 0%', detail: 'สถานศึกษานี้ไม่มี', note: 'ค่าร้อยละโรงเรียนในชุดข้อมูลประเทศจะรวมหลายแห่ง' };
    return { status: 'empty', text: 'ยังไม่ระบุ', detail: '—', note: 'เลือกมีหรือไม่มี' };
  }

  function resultOf(ind, data) {
    data = data || current();
    if (ind.kind === 'yn') return yn(data['yn_' + ind.id]);
    var n = num(data['n_' + ind.id]);
    var d = num(data['d_' + ind.id]);
    if (ind.kind === 'gpi') return gpi(n, d);
    return pct(n, d, {
      needDen: ind.kind === 'pct-pop',
      needNote: ind.note,
      empty: 'กรอกตัวตั้งและตัวหาร',
      sensitive: ind.sensitive
    });
  }

  function pillClass(st) {
    if (st === 'ok') return 'ok';
    if (st === 'warn' || st === 'need') return 'warn';
    if (st === 'bad') return 'bad';
    return '';
  }

  function renderLevels(data) {
    var host = $('levelPicks');
    if (!host) return;
    var known = LEVELS.some(function (lv) { return Object.prototype.hasOwnProperty.call(data, 'lv_' + lv.id); });
    host.innerHTML = LEVELS.map(function (lv) {
      var checked = known ? !!data['lv_' + lv.id] : true;
      return '<label class="lv-chip"><input type="checkbox" id="lv_' + lv.id + '"' + (checked ? ' checked' : '') + '> ' + esc(lv.label) + '</label>';
    }).join('');
  }

  function cardHTML(ind, data) {
    var r = resultOf(ind, data);
    var fields = '';
    if (ind.kind === 'yn') {
      var v = data['yn_' + ind.id] || '';
      fields = '<div class="t-field"><label for="yn_' + ind.id + '">สถานะของสถานศึกษานี้</label>' +
        '<select id="yn_' + ind.id + '">' +
        '<option value=""' + (v === '' ? ' selected' : '') + '>ยังไม่ระบุ</option>' +
        '<option value="yes"' + (v === 'yes' ? ' selected' : '') + '>มี</option>' +
        '<option value="no"' + (v === 'no' ? ' selected' : '') + '>ไม่มี</option>' +
        '</select></div>';
    } else {
      fields = '<div class="t-field"><label for="n_' + ind.id + '">' + esc(ind.num) + '</label>' +
        '<input id="n_' + ind.id + '" type="number" min="0" step="1" inputmode="numeric" value="' + esc(data['n_' + ind.id] || '') + '"></div>' +
        '<div class="t-field"><label for="d_' + ind.id + '">' + esc(ind.den) + '</label>' +
        '<input id="d_' + ind.id + '" type="number" min="0" step="1" inputmode="numeric" value="' + esc(data['d_' + ind.id] || '') + '"></div>';
    }
    return '<article class="ind-card' + (visible(ind) ? '' : ' is-hidden') + '" data-id="' + ind.id + '">' +
      '<div class="ind-top"><span class="badge">' + esc(ind.code) + '</span><span class="src">' + esc(ind.source) + '</span></div>' +
      '<h3>' + esc(ind.name) + '</h3>' +
      '<p class="formula">' + esc(ind.formula) + '</p>' +
      '<div class="t-form">' + fields + '</div>' +
      '<div class="ind-out ' + pillClass(r.status) + '"><b>' + esc(r.text) + '</b><span>' + esc(r.detail) + '</span></div>' +
      '<p class="hint">' + esc(r.note || ind.note) + '</p></article>';
  }

  function renderCards() {
    var data = current();
    var host = $('indMount');
    if (!host) return;
    var html = '';
    var groups = [
      { title: '4.1 ผลเรียนและการสำเร็จ', ids: ['4111m', '4111r', '4112m', '4112r', '4113m', '4113r', '4121p', '4121l', '4121u'] },
      { title: '4.2 ปฐมวัย', ids: ['4211', '4221'] },
      { title: '4.3 สายอาชีวะใน ม.ปลาย', ids: ['4311'] },
      { title: '4.5 ความเท่าเทียมทางเพศของการเข้าเรียน', ids: ['4511', '4512', '4513'] },
      { title: '4.6 การอ่านเขียนคิดเลขของผู้ใหญ่', ids: ['4611'] },
      { title: '4.7 หลักสูตรสิ่งแวดล้อมและพลเมือง', ids: ['4711', '4712'] },
      { title: '4.a สภาพแวดล้อมและการรังแก', ids: ['4a11', '4a12', '4a13', '4a14', '4a15', '4a21'] },
      { title: '4.c ใบประกอบวิชาชีพและการอบรมครู', ids: ['4c11', '4c12', '4c13', '4c21', '4c22', '4c23'] }
    ];
    var byId = {};
    INDICATORS.forEach(function (ind) { byId[ind.id] = ind; });
    groups.forEach(function (g) {
      var cards = g.ids.map(function (id) { return byId[id]; }).filter(Boolean);
      var any = cards.some(visible);
      html += '<section class="ind-group' + (any ? '' : ' is-hidden') + '"><h2>' + esc(g.title) + '</h2><div class="ind-grid">';
      html += cards.map(function (ind) { return cardHTML(ind, data); }).join('');
      html += '</div></section>';
    });
    host.innerHTML = html;
    bindInputs();
    renderPrint(data);
    renderCount();
  }

  function renderInfo() {
    var host = $('infoMount');
    if (!host) return;
    host.innerHTML = NOT_SCHOOL.map(function (x) {
      return '<li><strong>' + esc(x.code) + ' · ' + esc(x.name) + '</strong><br>' + esc(x.why) + '</li>';
    }).join('');
  }

  function stats(data) {
    var vis = INDICATORS.filter(visible);
    var filled = 0, ok = 0;
    vis.forEach(function (ind) {
      var r = resultOf(ind, data);
      if (r.status !== 'empty') filled++;
      if (r.status === 'ok') ok++;
    });
    return { vis: vis.length, filled: filled, ok: ok };
  }

  function renderCount() {
    var el = $('fillCount');
    if (!el) return;
    var s = stats(current());
    el.textContent = 'กรอกแล้ว ' + s.filled + ' จาก ' + s.vis + ' รายการที่แสดง · คำนวณครบตามสูตร ' + s.ok + ' รายการ';
  }

  function renderPrint(data) {
    data = data || current();
    var school = (data.f_school || '').trim() || 'ยังไม่ระบุชื่อสถานศึกษา';
    var area = data.f_area || '—';
    var year = data.f_year || '—';
    var who = (data.f_who || '').trim() || '—';
    var role = (data.f_role || '').trim() || '—';
    var remark = (data.f_remark || '').trim();
    var d = new Date();
    var when = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
    var rows = INDICATORS.filter(visible).map(function (ind) {
      var r = resultOf(ind, data);
      var counts = r.hideCounts ? 'ไม่แสดง (กลุ่มเล็ก)' : (r.detail || '—');
      return '<tr><th scope="row">' + esc(ind.code) + '</th><td>' + esc(ind.name) + '</td><td>' + esc(counts) + '</td><td>' + esc(r.text) + '</td><td>' + esc(r.note || ind.note) + '</td></tr>';
    }).join('');
    $('printSheet').innerHTML =
      '<div class="sheet-head"><div><strong>อยุธยาเรียนรู้ · SDG 4</strong><h3>ใบสรุปตัวชี้วัดระดับสถานศึกษา</h3>' +
      '<p>คำนวณจากข้อมูลที่สถานศึกษากรอก ตามสูตรในเอกสารกรอบประเทศที่ได้รับจาก ศธจ. ไม่ใช่แบบฟอร์มราชการ และไม่ใช่การยื่นเรื่องผ่านเว็บนี้</p></div>' +
      '<div class="sheet-meta">พิมพ์เมื่อ ' + esc(when) + '</div></div>' +
      '<div class="sheet-id"><p><strong>สถานศึกษา</strong> ' + esc(school) + '</p><p><strong>สังกัด</strong> ' + esc(area) + '</p>' +
      '<p><strong>ปีการศึกษา</strong> ' + esc(year) + '</p><p><strong>ผู้กรอก</strong> ' + esc(who) + ' · ' + esc(role) + '</p></div>' +
      '<table class="sheet-table"><thead><tr><th>รหัส</th><th>ชื่อตัวชี้วัด</th><th>ตัวตั้ง / ตัวหาร</th><th>ค่าที่คำนวณ</th><th>หมายเหตุ</th></tr></thead><tbody>' +
      rows + '</tbody></table>' +
      (remark ? '<p class="sheet-note"><strong>หมายเหตุของสถานศึกษา</strong> ' + esc(remark) + '</p>' : '') +
      '<p class="sheet-note">ค่า NT/O-NET เป็นผลของสถานศึกษานี้ ไม่ใช่คะแนนจังหวัด ค่า 4.a เป็นสถานะของแห่งนี้ (100 หรือ 0) ไม่ใช่ร้อยละทั้งจังหวัด สัดส่วนใบประกอบและการอบรมไม่ใช่เกณฑ์อัตรากำลัง และไม่แทน I04 ค่าที่ยังไม่กรอกไม่ใช่ศูนย์</p>' +
      '<div class="sheet-sign"><div><p>ลงชื่อผู้กรอก</p><p>........................................</p><p>(' + esc(who === '—' ? '                    ' : who) + ')</p></div>' +
      '<div><p>ลงชื่อผู้อำนวยการ / ผู้รับรอง</p><p>........................................</p><p>(                    )</p></div></div>';
  }

  function bindInputs() {
    document.querySelectorAll('#indMount input, #indMount select').forEach(function (el) {
      el.addEventListener('input', onChange);
      el.addEventListener('change', onChange);
    });
  }

  function onChange() {
    save(current());
    INDICATORS.forEach(function (ind) {
      var card = document.querySelector('.ind-card[data-id="' + ind.id + '"]');
      if (!card) return;
      var r = resultOf(ind);
      var out = card.querySelector('.ind-out');
      var hint = card.querySelector('.hint');
      if (out) {
        out.className = 'ind-out ' + pillClass(r.status);
        out.innerHTML = '<b>' + esc(r.text) + '</b><span>' + esc(r.detail) + '</span>';
      }
      if (hint) hint.textContent = r.note || ind.note;
    });
    renderPrint();
    renderCount();
  }

  function bindMeta() {
    ['f_school', 'f_area', 'f_year', 'f_who', 'f_role', 'f_remark'].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener('input', function () { save(current()); renderPrint(); });
      el.addEventListener('change', function () { save(current()); renderPrint(); });
    });
    LEVELS.forEach(function (lv) {
      var el = $('lv_' + lv.id);
      if (!el) return;
      el.addEventListener('change', function () { save(current()); renderCards(); });
    });
  }

  function fillMeta(data) {
    ['f_school', 'f_area', 'f_year', 'f_who', 'f_role', 'f_remark'].forEach(function (id) {
      var el = $(id);
      if (el && data[id] != null) el.value = data[id];
    });
  }

  function copySummary() {
    var data = current();
    var school = (data.f_school || 'สถานศึกษา').trim();
    var lines = ['ใบสรุปตัวชี้วัด SDG 4 ระดับสถานศึกษา — ' + school, 'สังกัด ' + (data.f_area || '—') + ' · ปีการศึกษา ' + (data.f_year || '—'), '', 'คำนวณบนเว็บไซต์อยุธยาเรียนรู้ ไม่ใช่แบบฟอร์มราชการ', ''];
    INDICATORS.filter(visible).forEach(function (ind) {
      var r = resultOf(ind, data);
      lines.push(ind.code + ' ' + ind.name);
      lines.push('  ค่า: ' + r.text + (r.hideCounts ? '' : ' (' + r.detail + ')'));
      if (r.note) lines.push('  ' + r.note);
    });
    lines.push('', 'ห้ามกรอกชื่อผู้เรียนรายคน · ค่าที่ยังไม่กรอกไม่ใช่ศูนย์');
    var text = lines.join('\n');
    var btn = $('btnCopy');
    function done() {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = 'คัดลอกแล้ว';
      setTimeout(function () { btn.textContent = old; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { window.alert('คัดลอกไม่สำเร็จ กรุณาเลือกข้อความในใบสรุปแล้วคัดลอกเอง'); }
      document.body.removeChild(ta);
    }
  }

  var data = load();
  renderLevels(data);
  fillMeta(data);
  renderInfo();
  renderCards();
  bindMeta();

  $('btnSave').addEventListener('click', function () {
    save(current());
    var old = this.textContent;
    this.textContent = 'บันทึกแล้ว';
    var self = this;
    setTimeout(function () { self.textContent = old; }, 1600);
  });
  $('btnPrint').addEventListener('click', function () {
    document.body.classList.add('print-sheet-only');
    var done = function () {
      document.body.classList.remove('print-sheet-only');
      window.removeEventListener('afterprint', done);
    };
    window.addEventListener('afterprint', done);
    window.print();
  });
  $('btnPrintAll').addEventListener('click', function () { window.print(); });
  $('btnCopy').addEventListener('click', copySummary);
  $('btnClear').addEventListener('click', function () {
    if (!window.confirm('ล้างข้อมูลที่บันทึกในเครื่องนี้ทั้งหมดหรือไม่\n(ใบที่พิมพ์เก็บไว้แล้วจะไม่หาย)')) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  });
})();
