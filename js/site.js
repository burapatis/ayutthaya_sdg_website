'use strict';

const SITE = {
  origin: 'https://sdg.thamdee.com',
  name: 'อยุธยาเรียนรู้',
  short: 'AYUTTHAYA · SDG 4',
  label: 'พื้นที่ความรู้สาธารณะ เพื่อการศึกษาที่ยั่งยืน',
  author: 'บูรพาทิศ พลอยสุวรรณ์',
  role: 'ผู้วิจัยอิสระ',
  email: 'burapatis@gmail.com',
  reviewed: '24 กันยายน 2569',
  navHeading: 'สำรวจและร่วมพัฒนา',
  nav: [
    {id: 'index', href: 'index.html', n: '01', label: 'ภาพรวม'},
    {id: 'knowledge', href: 'knowledge.html', n: '02', label: 'คลังความรู้'},
    {id: 'ecosystem', href: 'ecosystem.html', n: '03', label: 'ระบบนิเวศ'},
    {id: 'agencies', href: 'agencies.html', n: '04', label: 'หน่วยงาน'},
    {id: 'alignment', href: 'alignment.html', n: '05', label: 'ความเชื่อมโยง'},
    {id: 'projects', href: 'projects.html', n: '06', label: 'โครงการ'},
    {id: 'implementation', href: 'implementation.html', n: '07', label: 'กลไกขับเคลื่อน'},
    {id: 'evaluation', href: 'evaluation.html', n: '08', label: 'วัดและประเมินผล'},
    {id: 'forum', href: 'forum.html', n: '09', label: 'ร่วมแลกเปลี่ยน'},
    {id: 'slides', href: 'slides.html', n: '10', label: 'สไลด์นำเสนอ'},
    {id: 'community', href: 'community.html', n: '11', label: 'ฉบับอ่านง่าย'},
    {id: 'about', href: 'about.html', n: '12', label: 'ผู้จัดทำ'}
  ],
  related: [
    {href: 'https://ayeduplan1.thamdee.com/', label: 'ayeduplan1.thamdee.com'},
    {href: 'https://ayeduplan2.thamdee.com/', label: 'ayeduplan2.thamdee.com'}
  ]
};

function siteEscape(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function renderChrome() {
  const page = document.body?.dataset.page || '';
  const header = document.querySelector('[data-chrome="header"]');
  const sidebar = document.querySelector('[data-chrome="sidebar"]');
  const footer = document.querySelector('[data-chrome="footer"]');
  if (header) {
    header.innerHTML =
      '<div class="topbar">' +
        '<a href="index.html" class="brand">' +
          '<img class="brand-logo" src="assets/logo.png" alt="" width="48" height="48">' +
          '<span><strong>' + siteEscape(SITE.name) + '</strong><small>' + siteEscape(SITE.short) + '</small></span>' +
        '</a>' +
        '<span class="public-label">' + siteEscape(SITE.label) + '</span>' +
        '<button class="menu-toggle" aria-controls="sidebar" aria-expanded="false" type="button">เมนู</button>' +
      '</div>';
  }
  if (sidebar) {
    sidebar.innerHTML =
      '<p class="nav-heading">' + siteEscape(SITE.navHeading) + '</p>' +
      '<nav aria-label="เมนูหลัก">' +
        SITE.nav.map(item => {
          const current = item.id === page ? ' aria-current="page"' : '';
          return '<a class="nav-link" href="' + siteEscape(item.href) + '"' + current + '>' +
            '<span aria-hidden="true">' + siteEscape(item.n) + '</span>' + siteEscape(item.label) + '</a>';
        }).join('') +
      '</nav>' +
      '<div class="sidebar-note"><strong>การศึกษาที่มีคุณภาพ</strong>' +
        '<p>ทั่วถึง เท่าเทียม<br>เรียนรู้ได้ตลอดชีวิต</p>' +
        '<a href="forum.html">ร่วมแบ่งปันมุมมอง →</a></div>';
  }
  if (footer) {
    footer.innerHTML =
      '<div class="footer-identity">' +
        '<img class="footer-logo" src="assets/logo.png" alt="" width="36" height="36">' +
        '<div><strong>' + siteEscape(SITE.name) + ' · SDG 4</strong>' +
        '<p>จัดทำโดย ' + siteEscape(SITE.author) + ' · ' + siteEscape(SITE.role) + '<br>' +
        'เว็บไซต์เพื่อประโยชน์สาธารณะ ไม่ใช่เว็บไซต์ทางราชการ</p></div></div>' +
      '<div>' +
        '<a href="slides.html">สไลด์นำเสนอ</a>' +
        '<a href="community.html">ฉบับอ่านง่าย</a>' +
        '<a href="about.html">เกี่ยวกับผู้จัดทำ</a>' +
        '<a href="knowledge.html?article=source-notes">ที่มาของข้อมูล</a>' +
        '<a href="knowledge.html?article=updates">อะไรเปลี่ยนในรอบนี้</a>' +
        '<a href="about.html#cite">การอ้างอิง APA 7</a>' +
        '<a href="about.html#privacy">ความเป็นส่วนตัว</a>' +
        '<a href="mailto:' + siteEscape(SITE.email) + '">ติดต่อ</a>' +
        '<p class="footer-related">เว็บไซต์ที่เกี่ยวข้อง: ' +
          SITE.related.map(r =>
            '<a href="' + siteEscape(r.href) + '" target="_blank" rel="noopener noreferrer">' +
            siteEscape(r.label) + ' ↗</a>'
          ).join('') +
        '</p>' +
        '<p>ตรวจเนื้อหาเว็บไซต์ ' + siteEscape(SITE.reviewed) + ' · ปีข้อมูลระบุในแต่ละรายการ · ' +
        '<a href="' + siteEscape(SITE.origin) + '/">' + siteEscape(SITE.origin.replace('https://', '')) + '</a></p>' +
      '</div>';
  }
  const toggle = document.querySelector('.menu-toggle');
  const side = document.getElementById('sidebar');
  if (toggle && side && !toggle.dataset.bound) {
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', () => {
      const open = side.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && side.classList.contains('open')) {
        side.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }
}

if (document.body) renderChrome();
else document.addEventListener('DOMContentLoaded', renderChrome);
