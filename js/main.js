'use strict';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const safeURL = v => {
  try {
    const u = new URL(v, location.href);
    return ['http:', 'https:', 'mailto:'].includes(u.protocol) ? u.href : '#';
  } catch {
    return '#';
  }
};

async function get(path, kind = 'json') {
  const r = await fetch(path, {cache: 'no-cache'});
  if (!r.ok) throw new Error('โหลด ' + path + ' ไม่สำเร็จ (' + r.status + ')');
  return kind === 'json' ? r.json() : r.text();
}

function fail(el, e) {
  if (!el) return;
  el.innerHTML = '<div class="error" role="alert">ไม่สามารถโหลดเนื้อหาได้ โปรดลองโหลดหน้าใหม่ หากเปิดไฟล์จากเครื่อง ให้ใช้เว็บเซิร์ฟเวอร์ตามคู่มือ README<br><small>' +
    escapeHTML(e.message) + '</small></div>';
}

async function markdown(el, file) {
  const text = await get(file, 'text');
  if (!window.marked || !window.DOMPurify) {
    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.textContent = text;
    el.replaceChildren(pre);
    return;
  }
  el.style.whiteSpace = '';
  el.innerHTML = DOMPurify.sanitize(marked.parse(text), {USE_PROFILES: {html: true}, ADD_ATTR: ['id', 'class']});
  el.querySelectorAll('table').forEach(t => {
    const w = document.createElement('div');
    w.className = 'table-scroll';
    t.before(w);
    w.append(t);
  });
  el.querySelectorAll('h1').forEach(h => {
    const h2 = document.createElement('h2');
    h2.innerHTML = h.innerHTML;
    h.replaceWith(h2);
  });
  bindCiteCopy(el);
}

$$('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

function bindCiteCopy(root = document) {
  root.querySelectorAll('.cite-block').forEach(pre => {
    if (pre.dataset.copyBound) return;
    pre.dataset.copyBound = '1';
    const tools = document.createElement('div');
    tools.className = 'cite-tools';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button secondary';
    btn.textContent = 'คัดลอกรายการนี้';
    const status = document.createElement('span');
    status.className = 'small muted';
    status.setAttribute('role', 'status');
    tools.append(btn, status);
    pre.after(tools);
    btn.addEventListener('click', async () => {
      const ok = await copyText(pre.textContent.replace(/\s+/g, ' ').trim());
      status.textContent = ok ? 'คัดลอกแล้ว' : 'เลือกข้อความในกรอบแล้วคัดลอกเอง';
    });
  });
}

async function dashboard() {
  const s = await get('data/stats.json');
  let chart;
  function draw() {
    const d = s.datasets[$('#dataset').value];
    $('#data-notice').textContent = d.notice;
    $('#stats-cards').innerHTML = d.metrics.map(m =>
      '<div class="stat"><div class="stat-label">' + escapeHTML(m.label) + '</div>' +
      '<div class="stat-number">' + (m.value === null ? '—' : new Intl.NumberFormat('th-TH').format(m.value)) +
      '<span class="stat-unit">' + escapeHTML(m.unit) + '</span></div>' +
      '<div class="stat-foot">' + escapeHTML(m.year) + '</div></div>'
    ).join('');
    $('#chart-title').textContent = d.trend.title;
    $('#chart-subtitle').textContent = d.trend.subtitle;
    $('#trend-limit').textContent = d.limitation;
    $('#trend-table').innerHTML = '<table><caption>' + escapeHTML(d.trend.title) +
      '</caption><thead><tr><th scope="col">ปีการศึกษา</th><th scope="col">จำนวน (คน)</th></tr></thead><tbody>' +
      d.trend.labels.map((l, i) =>
        '<tr><th scope="row">' + escapeHTML(l) + '</th><td>' + escapeHTML(d.trend.values[i] ?? 'ไม่มีข้อมูล') + '</td></tr>'
      ).join('') + '</tbody></table>';
    $('#data-source').innerHTML = escapeHTML(d.status) + '<br>ที่มา: ' + escapeHTML(d.sourceLabel) +
      (d.sourceUrl ? ' · <a href="' + escapeHTML(safeURL(d.sourceUrl)) + '" target="_blank" rel="noopener">รายงานการศึกษา</a>' : '') +
      (d.trendSourceUrl ? ' · <a href="' + escapeHTML(safeURL(d.trendSourceUrl)) + '" target="_blank" rel="noopener">รายงานสถิติจังหวัด</a>' : '');
    if (window.Chart) {
      if (chart) chart.destroy();
      Chart.defaults.font.family = 'Noto Sans Thai, sans-serif';
      chart = new Chart($('#trend-chart'), {
        type: 'bar',
        data: {
          labels: d.trend.labels,
          datasets: [{
            label: 'จำนวนออกกลางคัน (คน)',
            data: d.trend.values,
            backgroundColor: d.trend.values.map((_, i) => i === d.trend.values.length - 1 ? '#8c402a' : '#d8b788'),
            borderRadius: 5,
            maxBarThickness: 46
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: !matchMedia('(prefers-reduced-motion: reduce)').matches,
          plugins: {legend: {display: false}},
          scales: {
            y: {beginAtZero: true, ticks: {precision: 0}, grid: {color: '#eee9e1'}},
            x: {grid: {display: false}}
          }
        }
      });
    } else {
      $('#chart-fallback').hidden = false;
      $('.chart-wrap').hidden = true;
    }
  }
  const cov = $('#sdg-coverage');
  if (cov && s.coverage) {
    cov.innerHTML = s.coverage.map(c =>
      '<article class="coverage-card status-' + escapeHTML(c.status) + '">' +
      '<span class="badge">' + escapeHTML(c.id) + '</span>' +
      '<h3>' + escapeHTML(c.title) + '</h3>' +
      '<p class="coverage-status">' + escapeHTML(c.statusLabel) + '</p>' +
      '<p>' + escapeHTML(c.detail) + '</p>' +
      '<a href="' + escapeHTML(c.link) + '">' + escapeHTML(c.linkLabel) + ' →</a></article>'
    ).join('');
  }
  const watch = $('#watchlist');
  if (watch && s.watchlist) {
    watch.innerHTML = s.watchlist.map(w =>
      '<div class="watch-item"><span class="badge">' + escapeHTML(w.status) + '</span>' +
      '<p><strong>' + escapeHTML(w.label) + '</strong> · ค่าที่พบ: ' + escapeHTML(w.value) + '</p>' +
      '<p class="small muted">' + escapeHTML(w.note) + '</p>' +
      (w.url ? '<a href="' + escapeHTML(safeURL(w.url)) + '" target="_blank" rel="noopener">' + escapeHTML(w.urlLabel || 'เปิดแหล่ง') + ' ↗</a>' : '') +
      '</div>'
    ).join('');
  }
  $('#dataset').value = s.defaultDataset;
  $('#dataset').addEventListener('change', draw);
  draw();
  initMap(s.map);
}

function initMap(mapData) {
  $('#map-note').textContent = mapData.status;
  const layers = mapData.layers || [];
  const legend = $('#map-legend');
  if (legend) {
    legend.innerHTML = layers.map(l =>
      '<label class="map-legend-item"><input type="checkbox" data-layer="' + escapeHTML(l.id) + '" checked> ' +
      '<span class="map-swatch" style="background:' + escapeHTML(l.color) + '"></span>' + escapeHTML(l.label) + '</label>'
    ).join('');
  }
  const byName = Object.fromEntries((mapData.points || []).map(p => [p.name, p]));
  const active = () => new Set($$('#map-legend [data-layer]:checked').map(i => i.dataset.layer));
  function layerNames(p) {
    return (p.layers || []).map(id => (layers.find(l => l.id === id) || {}).label).filter(Boolean);
  }
  function colorFor(p, on) {
    const first = (p.layers || []).find(id => on.has(id));
    return (layers.find(l => l.id === first) || {color: '#8c402a'}).color;
  }
  function isVisible(p, on) {
    return p && (!(p.layers || []).length || (p.layers || []).some(id => on.has(id)));
  }
  function visiblePoints(on) {
    return (mapData.points || []).filter(p => isVisible(p, on));
  }
  function listHTML(on) {
    const pts = visiblePoints(on);
    return pts.map(p =>
      '<li><strong>' + escapeHTML(p.name) + '</strong> — ' + escapeHTML(layerNames(p).join(' · ') || p.theme || 'ประเด็นพื้นที่') +
      ' <span class="small muted">(' + escapeHTML(p.note || 'ขอบเขตอำเภอเพื่อสำรวจ') + ')</span></li>'
    ).join('') || '<li>ไม่มีอำเภอในชั้นที่เลือก</li>';
  }
  function detailHTML(p) {
    return '<strong>' + escapeHTML(p.name) + '</strong> — ' + escapeHTML(layerNames(p).join(' · ')) +
      '<br>' + escapeHTML((p.note || '') + ' ขอบเขตอำเภอเพื่อแสดงรูปร่างจังหวัด ไม่ใช่ที่ตั้งสถานศึกษา') +
      (p.project ? ' <a href="projects.html#' + encodeURIComponent(p.project) + '">ดูแนวทาง ' + escapeHTML(p.project) + ' →</a>' : '');
  }

  const host = $('#map');
  host.classList.add('province-map');
  host.textContent = 'กำลังโหลดแผนที่…';
  $('#map-list').innerHTML = listHTML(active());
  const svgNS = 'http://www.w3.org/2000/svg';
  const specPath = mapData.svg || 'data/ayutthaya-map.json';

  get(specPath).then(spec => {
    const names = new Set((spec.features || []).map(f => f.name));
    const missing = (mapData.points || []).filter(p => !names.has(p.name)).map(p => p.name);
    if (missing.length) throw new Error('ขอบเขตไม่ครบ: ' + missing.join(', '));
    host.replaceChildren();
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', spec.viewBox);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'แผนที่ขอบเขต 16 อำเภอจังหวัดพระนครศรีอยุธยา');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    const title = document.createElementNS(svgNS, 'title');
    title.textContent = 'จังหวัดพระนครศรีอยุธยา 16 อำเภอ';
    svg.append(title);
    spec.features.forEach(f => {
      const p = byName[f.name];
      if (!p) return;
      const g = document.createElementNS(svgNS, 'g');
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', f.d);
      path.setAttribute('data-name', f.name);
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', f.name);
      const tip = document.createElementNS(svgNS, 'title');
      tip.textContent = f.name;
      path.append(tip);
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', f.label[0]);
      label.setAttribute('y', f.label[1]);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('class', 'map-amphoe-text');
      label.textContent = f.name;
      g.append(path, label);
      svg.append(g);
      function openDetail() {
        svg.querySelectorAll('path[aria-current]').forEach(el => el.removeAttribute('aria-current'));
        path.setAttribute('aria-current', 'true');
        const box = $('#map-detail');
        if (!box) return;
        box.hidden = false;
        box.innerHTML = detailHTML(p);
      }
      path.addEventListener('click', openDetail);
      path.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail();
        }
      });
    });
    host.append(svg);
    function paint() {
      const on = active();
      svg.querySelectorAll('path[data-name]').forEach(path => {
        const p = byName[path.dataset.name];
        const onLayer = isVisible(p, on);
        path.style.fill = onLayer ? colorFor(p, on) : '#e6e0d6';
        path.style.stroke = onLayer ? '#512c23' : '#c4bdb3';
        path.classList.toggle('is-dim', !onLayer);
      });
      $('#map-list').innerHTML = listHTML(on);
    }
    $$('#map-legend [data-layer]').forEach(i => i.addEventListener('change', paint));
    paint();
  }).catch(() => {
    host.textContent = 'โหลดขอบเขตอำเภอไม่สำเร็จ โปรดอ่านรายชื่อพื้นที่ด้านล่าง';
    $('#map-list').innerHTML = listHTML(active());
  });
}

async function knowledge() {
  const list = await get('data/articles.json');
  const cardsEl = $('#article-cards');
  const countEl = $('#article-count');
  const searchEl = $('#article-q');
  const tagsEl = $('#article-tags');
  const reader = $('#article-reader');
  let activeTag = 'all';
  let ticket = 0;
  const allTags = [...new Set(list.flatMap(a => a.tags || []))];

  function matches(item, q, tag) {
    const hay = [item.title, item.abstract, item.audience, ...(item.tags || [])].join(' ').toLowerCase();
    const okQ = !q || hay.includes(q);
    const okT = tag === 'all' || (item.tags || []).includes(tag);
    return okQ && okT;
  }

  function drawCards() {
    const q = (searchEl?.value || '').trim().toLowerCase();
    const shown = list.filter(a => matches(a, q, activeTag));
    const selected = new URLSearchParams(location.search).get('article');
    if (countEl) {
      countEl.textContent = shown.length
        ? 'แสดง ' + shown.length + ' จาก ' + list.length + ' บทความ'
        : 'ไม่พบบทความที่ตรงกับคำค้นหรือแท็กนี้';
    }
    if (!cardsEl) return;
    cardsEl.innerHTML = shown.length ? shown.map(a => {
      const current = a.id === selected ? ' aria-current="true"' : '';
      return '<a class="article-card" href="knowledge.html?article=' + encodeURIComponent(a.id) + '"' + current + '>' +
        '<div class="article-card-meta"><span class="badge">' + escapeHTML(a.audience || 'สาธารณะ') + '</span>' +
        '<span class="small muted">' + escapeHTML(a.updated || '') + '</span></div>' +
        '<h2>' + escapeHTML(a.title) + '</h2>' +
        '<p>' + escapeHTML(a.abstract || '') + '</p>' +
        '<ul class="tag-list">' + (a.tags || []).map(t => '<li>' + escapeHTML(t) + '</li>').join('') + '</ul>' +
      '</a>';
    }).join('') : '<p class="notice">ลองล้างคำค้นหรือเลือกแท็กทั้งหมด</p>';
  }

  function drawTags() {
    if (!tagsEl) return;
    const chips = [{id: 'all', label: 'ทั้งหมด'}, ...allTags.map(t => ({id: t, label: t}))];
    tagsEl.innerHTML = chips.map(c =>
      '<button type="button" class="tag-chip" data-tag="' + escapeHTML(c.id) + '" aria-pressed="' +
      String(c.id === activeTag) + '">' + escapeHTML(c.label) + '</button>'
    ).join('');
    tagsEl.querySelectorAll('[data-tag]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTag = btn.dataset.tag;
        drawTags();
        drawCards();
      });
    });
  }

  async function show(id, push = false) {
    const item = list.find(a => a.id === id);
    if (push) {
      const u = new URL(location.href);
      if (item) u.searchParams.set('article', item.id);
      else u.searchParams.delete('article');
      history.pushState({}, '', u);
    }
    drawCards();
    if (!reader || !item) {
      if (reader) {
        reader.hidden = true;
        reader.setAttribute('aria-hidden', 'true');
      }
      return;
    }
    reader.hidden = false;
    reader.removeAttribute('aria-hidden');
    const download = $('#article-download');
    if (download) download.href = item.file;
    const current = ++ticket;
    $('#knowledge-body').innerHTML = '<p class="loading">กำลังโหลดบทความ…</p>';
    const temp = document.createElement('article');
    try {
      await markdown(temp, item.file);
      if (current === ticket) $('#knowledge-body').replaceChildren(...temp.childNodes);
    } catch (e) {
      if (current === ticket) fail($('#knowledge-body'), e);
    }
    reader.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  }

  if (searchEl) searchEl.addEventListener('input', drawCards);
  $('#article-back')?.addEventListener('click', e => {
    e.preventDefault();
    show(null, true);
    window.scrollTo({top: 0});
  });
  addEventListener('popstate', () => show(new URLSearchParams(location.search).get('article')));
  drawTags();
  await show(new URLSearchParams(location.search).get('article'));
  glossaryPanel();

  const sources = await get('data/sources.json');
  const registry = $('#source-registry');
  if (registry) {
    registry.innerHTML = sources.map(s =>
      '<li><strong>' + escapeHTML(s.id) + ' · ' + escapeHTML(s.title) + '</strong><br>' +
      escapeHTML(s.author) + ' (' + escapeHTML(s.year) + '). ' + escapeHTML(s.note) + '<br>' +
      (s.url ? '<a href="' + escapeHTML(safeURL(s.url)) + '" target="_blank" rel="noopener">เปิดแหล่งข้อมูล</a>' : '') +
      '</li>'
    ).join('');
  }
}

async function glossaryPanel() {
  const listEl = $('#glossary-list');
  if (!listEl) return;
  let terms = [];
  try {
    terms = await get('data/glossary.json');
  } catch (e) {
    fail(listEl, e);
    return;
  }
  const qEl = $('#glossary-q');
  function draw() {
    const q = (qEl?.value || '').trim().toLowerCase();
    const shown = terms.filter(t => !q || [t.term, t.short, t.detail].join(' ').toLowerCase().includes(q));
    listEl.innerHTML = shown.map(t =>
      '<div class="glossary-item">' +
      '<dt>' + escapeHTML(t.term) + '</dt>' +
      '<dd><p>' + escapeHTML(t.short) + '</p>' +
      '<p class="small muted">' + escapeHTML(t.detail) + '</p>' +
      (t.link ? '<a href="' + escapeHTML(t.link) + '">' + escapeHTML(t.linkLabel || 'อ่านต่อ') + '</a>' : '') +
      '</dd></div>'
    ).join('') || '<p class="notice">ไม่พบคำที่ตรงกัน ลองล้างช่องค้น</p>';
  }
  qEl?.addEventListener('input', draw);
  draw();
}

async function projects() {
  const list = await get('data/projects.json');
  const pathways = await get('data/pathways.json').catch(() => []);
  const bar = $('#project-pathways');
  let current = new URLSearchParams(location.search).get('problem') || 'all';
  function render() {
    const hash = location.hash.slice(1);
    const target = hash && list.find(p => p.id === hash);
    if (target && current !== 'all' && current !== target.problemId) current = target.problemId;
    const shown = current === 'all' ? list : list.filter(p => p.problemId === current);
    $('#project-path-status').textContent = current === 'all'
      ? 'แสดงโครงการตัวอย่างทั้ง ' + list.length + ' รายการ'
      : 'แสดงแนวทางที่ตรงกับปัญหาที่เลือก ' + shown.length + ' รายการ';
    $('#project-list').innerHTML = shown.map(p =>
      '<section class="panel project-card" id="' + escapeHTML(p.id) + '">' +
      '<span class="badge">' + escapeHTML(p.id) + ' · ตัวอย่างเพื่อประยุกต์ใช้</span>' +
      '<h2>' + escapeHTML(p.title) + '</h2>' +
      '<p>' + escapeHTML(p.objective) + '</p>' +
      '<p class="small muted"><b>กลุ่มเป้าหมาย:</b> ' + escapeHTML(p.target) + '</p>' +
      '<p class="small"><a href="evaluation.html#' + escapeHTML((p.indicators || [])[0] || '') + '">ตัวชี้วัด ' +
      escapeHTML((p.indicators || []).join(', ')) + '</a></p>' +
      '<details><summary>กิจกรรม ผู้รับผิดชอบ และการติดตาม</summary><ul>' +
      p.activities.map(a => '<li>' + escapeHTML(a) + '</li>').join('') + '</ul>' +
      '<p><b>เจ้าภาพที่เสนอ:</b> ' + escapeHTML(p.owner) + '</p>' +
      '<p><b>ภาคี:</b> ' + escapeHTML(p.partners) + '</p>' +
      '<p><b>ผลผลิต:</b> ' + escapeHTML(p.output) + '</p>' +
      '<p><b>ผลลัพธ์:</b> ' + escapeHTML(p.outcome) + '</p>' +
      '<p><b>ระยะเวลาเสนอ:</b> ' + escapeHTML(p.duration) + '</p>' +
      '<p><b>ทรัพยากร:</b> ' + escapeHTML(p.resources) + '</p>' +
      '<p><b>ตัวชี้วัด:</b> ' + escapeHTML(p.indicators.join(', ')) + ' · SDG ' + escapeHTML(p.sdg) + '</p>' +
      '<a href="evaluation.html#' + escapeHTML((p.indicators || [])[0] || '') + '">ดูนิยามและเครื่องมือประเมิน →</a></details></section>'
    ).join('') || '<p class="notice">ไม่มีโครงการที่ตรงกับปัญหานี้</p>';
    if (bar) {
      $$('#project-pathways [data-path]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.path === current)));
    }
    const card = hash && document.getElementById(hash);
    if (card) {
      card.classList.add('is-target');
      const det = card.querySelector('details');
      if (det) det.open = true;
      card.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  }
  if (bar) {
    bar.innerHTML = '<button type="button" class="tag-chip" data-path="all" aria-pressed="' + String(current === 'all') + '">ดูทั้งหมด</button>' +
      pathways.map(p =>
        '<button type="button" class="tag-chip" data-path="' + escapeHTML(p.id) + '" aria-pressed="' +
        String(current === p.id) + '">' + escapeHTML(p.label) + '</button>'
      ).join('');
    bar.addEventListener('click', e => {
      const btn = e.target.closest('[data-path]');
      if (!btn) return;
      current = btn.dataset.path;
      const u = new URL(location.href);
      if (current === 'all') u.searchParams.delete('problem');
      else u.searchParams.set('problem', current);
      u.hash = '';
      history.replaceState({}, '', u);
      render();
    });
  }
  render();
  addEventListener('hashchange', render);
}

async function alignment() {
  const rows = await get('data/alignment.json');
  const sets = [['#alignment-level', 'level'], ['#alignment-province', 'provinces'], ['#alignment-agency', 'agencies']];
  sets.forEach(([selector, key]) => {
    const items = [...new Set(rows.flatMap(r => r[key]))];
    $(selector).insertAdjacentHTML('beforeend', items.map(x => '<option>' + escapeHTML(x) + '</option>').join(''));
    $(selector).addEventListener('change', draw);
  });
  $$('[data-align-level]').forEach(btn => {
    btn.addEventListener('click', () => {
      const level = btn.dataset.alignLevel;
      const sel = $('#alignment-level');
      if (sel) sel.value = level === 'all' ? 'all' : [...sel.options].some(o => o.value === level) ? level : 'all';
      draw();
      $('#alignment-list')?.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    });
  });
  function draw() {
    const filtered = rows.filter(r => sets.every(([sel, key]) =>
      $(sel).value === 'all' || (Array.isArray(r[key]) ? r[key].includes($(sel).value) : r[key] === $(sel).value)
    ));
    $('#alignment-status').textContent = 'แสดง ' + filtered.length + ' ความเชื่อมโยง';
    const selectedLevel = $('#alignment-level')?.value || 'all';
    $$('[data-align-level]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.alignLevel === selectedLevel || (selectedLevel === 'all' && btn.dataset.alignLevel === 'all')));
    });
    $('#alignment-list').innerHTML = filtered.length
      ? '<div class="table-scroll"><table><caption>ตารางเชื่อมโยงเป้าหมายและภารกิจ</caption><thead><tr><th>เป้าหมาย / ระดับ</th><th>ภารกิจและหน่วยงาน</th><th>กิจกรรม / พื้นที่</th><th>สถานะและหลักฐาน</th></tr></thead><tbody>' +
        filtered.map(r =>
          '<tr><td><strong>' + escapeHTML(r.goal) + '</strong><br>' + escapeHTML(r.level) + '</td>' +
          '<td>' + escapeHTML(r.mission) + '<br><b>' + escapeHTML(r.agencies.join(' · ')) + '</b><br>' +
          '<span class="small">ความสัมพันธ์: ' + escapeHTML(r.relationship) + '</span></td>' +
          '<td><a href="projects.html#' + escapeHTML(r.project) + '">' + escapeHTML(r.activity) + '</a><br>' +
          escapeHTML(r.provinces.join(' · ')) + '<br>ติดตาม: ' + escapeHTML(r.indicators) + '</td>' +
          '<td><span class="badge">' + escapeHTML(r.status) + '</span><p class="small">' + escapeHTML(r.evidence) +
          '</p><a href="' + escapeHTML(safeURL(r.url)) + '">อ่านแหล่งอ้างอิง</a></td></tr>'
        ).join('') + '</tbody></table></div>'
      : '<p class="notice">ไม่มีรายการที่ตรงกับตัวเลือกนี้ ลองเลือกทุกระดับหรือทุกพื้นที่</p>';
  }
  draw();
}

async function ecosystem() {
  const list = await get('data/ecosystem.json');
  function show(i) {
    $$('[data-eco]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.eco === i)));
    const x = list[i];
    $('#eco-detail').innerHTML =
      '<span class="badge">ความเชื่อมโยงที่เสนอ</span>' +
      '<h2 style="margin-top:14px">' + escapeHTML(x.title) + '</h2>' +
      '<p>' + escapeHTML(x.text) + '</p>' +
      '<h3>สิ่งที่ส่งต่อถึงผู้เรียน</h3>' +
      '<p>' + escapeHTML(x.result) + '</p>' +
      '<a class="button secondary" href="' + escapeHTML(x.link) + '">' + escapeHTML(x.linkLabel) + ' →</a>';
  }
  $$('[data-eco]').forEach(b => b.addEventListener('click', () => show(+b.dataset.eco)));
  show(0);
}

function indicatorStatus(x) {
  if (x.baseline != null && x.target != null) return {key: 'ready', label: 'มีค่าฐานและเป้าหมาย'};
  if (x.baseline != null) return {key: 'partial', label: 'มีค่าฐาน ยังไม่มีเป้าหมาย'};
  return {key: 'pending', label: 'ยังไม่มีค่าฐาน'};
}

async function evaluation() {
  const indicators = await get('data/indicators.json');
  const cats = [...new Set(indicators.map(x => x.theme))];
  $('#indicator-filter').insertAdjacentHTML('beforeend', cats.map(x => '<option>' + escapeHTML(x) + '</option>').join(''));
  const board = $('#indicator-board');
  function draw() {
    const list = indicators.filter(x => $('#indicator-filter').value === 'all' || x.theme === $('#indicator-filter').value);
    if (board) {
      board.innerHTML = list.map(x => {
        const st = indicatorStatus(x);
        return '<a class="indicator-chip status-' + st.key + '" href="#' + escapeHTML(x.id) + '">' +
          '<strong>' + escapeHTML(x.id) + '</strong> ' + escapeHTML(x.title) +
          '<span class="badge">' + escapeHTML(st.label) + '</span>' +
          '<small>' + escapeHTML(x.project) + ' · ' + escapeHTML(x.theme) + '</small></a>';
      }).join('');
    }
    $('#indicator-list').innerHTML = list.map(x => {
      const st = indicatorStatus(x);
      return '<details id="' + escapeHTML(x.id) + '"><summary>' + escapeHTML(x.id + ' · ' + x.title) + '</summary>' +
      '<p class="badge status-' + st.key + '">ตัวชี้วัดเสนอ · ' + escapeHTML(st.label) + '</p>' +
      '<p><a href="projects.html#' + escapeHTML(x.project) + '">เปิดโครงการ ' + escapeHTML(x.project) + ' →</a></p><dl>' +
      [
        ['SDG / โครงการ', x.sdg + ' / ' + x.project],
        ['นิยาม', x.definition],
        ['ตัวตั้ง', x.numerator],
        ['ตัวหาร', x.denominator],
        ['สูตร / หน่วย', x.formula],
        ['ค่าฐาน / เป้าหมาย', (x.baseline == null ? 'ยังไม่มีค่าฐานที่รับรอง' : String(x.baseline) + (x.baselineYear ? ' (ปี ' + x.baselineYear + ')' : '')) + ' / ' + (x.target == null ? 'กำหนดหลังตรวจฐาน' : String(x.target) + (x.targetYear ? ' (ปี ' + x.targetYear + ')' : ''))],
        ['แหล่งและเครื่องมือ', x.source],
        ['ความถี่ / ผู้รับผิดชอบ', x.frequency + ' / ' + x.owner],
        ['การจำแนก', x.disaggregation],
        ['เกณฑ์และข้อจำกัด', x.limit]
      ].map(([k, v]) => '<dt>' + escapeHTML(k) + '</dt><dd>' + escapeHTML(v) + '</dd>').join('') +
      '</dl></details>';
    }).join('');
    const hash = location.hash.slice(1);
    const open = hash && document.getElementById(hash);
    if (open && open.tagName === 'DETAILS') {
      open.open = true;
      open.scrollIntoView({block: 'start'});
    }
  }
  $('#indicator-filter').addEventListener('change', draw);
  draw();
  addEventListener('hashchange', draw);
  const downloads = await get('data/downloads.json');
  $('#download-list').innerHTML = downloads.map(d =>
    '<article class="download-card">' +
      '<b>' + escapeHTML(d.title) + '</b>' +
      '<small>' + escapeHTML(d.description) + '</small>' +
      '<p class="download-actions">' +
        '<a class="button" href="' + escapeHTML(d.file) + '">เปิดแบบฟอร์มสำหรับพิมพ์</a>' +
        (d.source ? '<a class="button secondary" href="' + escapeHTML(d.source) + '" download>ไฟล์ Markdown</a>' : '') +
      '</p>' +
    '</article>'
  ).join('');
  $('#ratio-form').addEventListener('submit', e => {
    e.preventDefault();
    const a = $('#numerator').value, b = $('#denominator').value;
    const n = Number(a), d = Number(b);
    $('#ratio-result').textContent =
      a === '' || b === '' ? 'ยังคำนวณไม่ได้: กรุณากรอกทั้งสองช่อง' :
      !Number.isSafeInteger(n) || !Number.isSafeInteger(d) || n < 0 || d <= 0 ? 'ยังคำนวณไม่ได้: ใช้จำนวนเต็มไม่ติดลบ และตัวหารมากกว่า 0' :
      n > d ? 'พบข้อมูลไม่สอดคล้อง: ตัวตั้งมากกว่าตัวหาร โปรดตรวจประชากรและช่วงเวลา' :
      (n / d * 100).toFixed(2) + '% — คำนวณจาก ' + n + ' ÷ ' + d + ' × 100 (ยังไม่ตัดสินผลตามเป้าหมาย)';
  });
}

function bindContributeForm() {
  const form = $('#contribute-form');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';
  const extra = $('#error-fields');
  const kind = $('#contribute-kind');
  function toggleExtra() {
    if (extra) extra.hidden = kind.value !== 'data-error';
  }
  kind?.addEventListener('change', toggleExtra);
  toggleExtra();
  function compose() {
    const data = Object.fromEntries(new FormData(form).entries());
    const lines = [
      'ประเภท: ' + (data.kind || ''),
      'ชื่อ (ไม่บังคับ): ' + (data.name || 'ไม่ระบุ'),
      'อีเมลติดต่อกลับ: ' + (data.email || 'ไม่ระบุ'),
      'หน้าเว็บ: ' + (data.page || ''),
      data.kind === 'data-error' ? 'รายการข้อมูล: ' + (data.item || '') : '',
      data.kind === 'data-error' ? 'แหล่งที่ควรใช้: ' + (data.source || '') : '',
      '',
      data.message || '',
      '',
      'ส่งจากแบบฟอร์ม sdg.thamdee.com/forum.html',
      'ผู้ส่งยืนยันว่าไม่ใส่ชื่อ ภาพ หรือข้อมูลที่ระบุตัวผู้เรียน'
    ].filter(v => v !== '');
    return lines.join('\n');
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!$('#contribute-consent')?.checked) {
      $('#contribute-result').textContent = 'กรุณายืนยันว่าจะไม่ส่งข้อมูลที่ระบุตัวผู้เรียน';
      return;
    }
    if (!$('#contribute-message')?.value.trim()) {
      $('#contribute-result').textContent = 'กรุณากรอกข้อความ';
      return;
    }
    const subject = encodeURIComponent('[SDG 4 อยุธยา] ' + ($('#contribute-kind')?.selectedOptions[0]?.text || 'ข้อเสนอ'));
    const body = encodeURIComponent(compose());
    location.href = 'mailto:burapatis@gmail.com?subject=' + subject + '&body=' + body;
    $('#contribute-result').textContent = 'กำลังเปิดโปรแกรมอีเมล หากไม่เปิดขึ้น ให้ใช้ปุ่มคัดลอกข้อความ';
  });
  $('#copy-contribute')?.addEventListener('click', async () => {
    if (!$('#contribute-consent')?.checked) {
      $('#contribute-result').textContent = 'กรุณายืนยันว่าจะไม่ส่งข้อมูลที่ระบุตัวผู้เรียน';
      return;
    }
    if (!$('#contribute-message')?.value.trim()) {
      $('#contribute-result').textContent = 'กรุณากรอกข้อความ';
      return;
    }
    const text = compose();
    try {
      await navigator.clipboard.writeText(text);
      $('#contribute-result').textContent = 'คัดลอกข้อความแล้ว วางในอีเมลถึง burapatis@gmail.com ได้เลย';
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      $('#contribute-result').textContent = ok
        ? 'คัดลอกข้อความแล้ว วางในอีเมลถึง burapatis@gmail.com ได้เลย'
        : 'คัดลอกอัตโนมัติไม่ได้ โปรดเลือกข้อความในช่องแล้วคัดลอกเอง';
    }
  });
}

async function forum() {
  bindContributeForm();
  const status = $('#forum-status');
  try {
    const {giscus: c} = await get('data/site.json');
    const valid = c.enabled && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(c.repo) && c.repoId && c.category && c.categoryId;
    if (!valid) {
      if (status) status.textContent = 'กระดาน Giscus ยังไม่เปิด ใช้แบบฟอร์มอีเมลด้านบนได้ทันที โดยไม่ต้องมีบัญชี GitHub';
      return;
    }
    if (status) status.textContent = 'การเปิดพื้นที่สนทนาจะเชื่อมต่อบริการ Giscus และ GitHub การแสดงความคิดเห็นต้องเข้าสู่ระบบ GitHub โปรดหลีกเลี่ยงข้อมูลส่วนบุคคลของผู้เรียน';
    const b = $('#load-discussion');
    b.hidden = false;
    b.addEventListener('click', () => {
      b.disabled = true;
      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      const attrs = {
        'data-repo': c.repo,
        'data-repo-id': c.repoId,
        'data-category': c.category,
        'data-category-id': c.categoryId,
        'data-mapping': 'pathname',
        'data-strict': '1',
        'data-reactions-enabled': '1',
        'data-emit-metadata': '0',
        'data-input-position': 'top',
        'data-theme': 'light',
        'data-lang': 'th',
        'crossorigin': 'anonymous'
      };
      Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
      script.async = true;
      script.onerror = () => { status.textContent = 'เชื่อมต่อพื้นที่สนทนาไม่ได้ โปรดใช้แบบฟอร์มอีเมลด้านบน'; };
      script.onload = () => { status.textContent = 'โหลดส่วนสนทนาแล้ว หากช่องสนทนาไม่ปรากฏ โปรดตรวจการเชื่อมต่อและการตั้งค่า Giscus'; };
      $('#giscus-container').append(script);
    }, {once: true});
  } catch (e) {
    if (status) fail(status, e);
  }
}

async function relatedSites() {
  const el = document.querySelector('[data-related-sites]');
  if (!el) return;
  try {
    const sites = await get('data/related-sites.json');
    el.innerHTML = sites.map(s =>
      '<section class="related-card"><span class="badge">' + escapeHTML(s.id) + ' · แหล่งเรียนรู้ภายนอก</span>' +
      '<h3><a href="' + escapeHTML(safeURL(s.url)) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(s.title) + ' ↗</a></h3>' +
      '<p>' + escapeHTML(s.description) + '</p><ul class="resource-links">' +
      s.links.map(l => '<li><a href="' + escapeHTML(safeURL(l.url)) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(l.label) + ' ↗</a></li>').join('') +
      '</ul><p class="small muted">' + escapeHTML(s.status) + '</p></section>'
    ).join('');
  } catch (e) {
    fail(el, e);
  }
}

$$('[data-markdown]').forEach(el => markdown(el, el.dataset.markdown).catch(e => fail(el, e)));
const actions = {index: dashboard, knowledge, projects, alignment, ecosystem, evaluation, forum};
const action = actions[document.body.dataset.page];
if (action) {
  action().catch(e => fail(
    $('#data-notice') || $('#knowledge-body') || $('#article-cards') || $('#project-list') ||
    $('#alignment-list') || $('#eco-detail') || $('#indicator-list') || $('#forum-status'),
    e
  ));
}
relatedSites();
