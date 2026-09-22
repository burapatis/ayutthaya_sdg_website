'use strict';

(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  if (!total) return;

  let current = 0;
  const counter = document.getElementById('slideCounter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const notesDrawer = document.getElementById('notesDrawer');
  const notesToggle = document.getElementById('notesToggle');
  const notesClose = document.getElementById('notesClose');
  const notesText = document.getElementById('notesText');
  const noteSlideNo = document.getElementById('noteSlideNo');
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  const stage = document.getElementById('stage');

  function parseHash() {
    const raw = (location.hash || '').replace(/^#/, '');
    const n = parseInt(raw.replace(/\D/g, ''), 10);
    if (n >= 1 && n <= total) return n - 1;
    return 0;
  }

  function setHash(index) {
    const next = '#slide-' + (index + 1);
    if (location.hash !== next) {
      history.replaceState(null, '', next);
    }
  }

  function update(fromHash) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
    });
    if (counter) {
      counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    }
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;
    const active = slides[current];
    if (notesText) {
      notesText.textContent = active?.dataset.notes || 'ไม่มีบทพูดสำหรับสไลด์นี้';
    }
    if (noteSlideNo) noteSlideNo.textContent = String(current + 1);
    if (!fromHash) setHash(current);
  }

  function goTo(index, fromHash) {
    if (index < 0 || index >= total || index === current) {
      if (fromHash) update(true);
      return;
    }
    current = index;
    update(fromHash);
  }

  function goNext() { goTo(current + 1); }
  function goPrev() { goTo(current - 1); }

  prevBtn?.addEventListener('click', goPrev);
  nextBtn?.addEventListener('click', goNext);

  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key;
    if (key === 'ArrowRight' || key === 'ArrowDown' || key === ' ') {
      event.preventDefault();
      goNext();
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      event.preventDefault();
      goPrev();
    } else if (key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (key === 'End') {
      event.preventDefault();
      goTo(total - 1);
    } else if (key.toLowerCase() === 'n') {
      notesDrawer?.classList.toggle('is-open');
    } else if (key.toLowerCase() === 'f') {
      toggleFullscreen();
    } else if (key === 'Escape' && notesDrawer?.classList.contains('is-open')) {
      notesDrawer.classList.remove('is-open');
    }
  });

  notesToggle?.addEventListener('click', () => notesDrawer?.classList.toggle('is-open'));
  notesClose?.addEventListener('click', () => notesDrawer?.classList.remove('is-open'));

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }
  fullscreenToggle?.addEventListener('click', toggleFullscreen);

  if (stage) {
    let startX = 0;
    stage.addEventListener('touchstart', event => {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });
    stage.addEventListener('touchend', event => {
      const dx = event.changedTouches[0].clientX - startX;
      if (dx < -40) goNext();
      if (dx > 40) goPrev();
    }, { passive: true });
  }

  window.addEventListener('hashchange', () => {
    const index = parseHash();
    if (index !== current) goTo(index, true);
  });

  current = parseHash();
  update(true);
})();
