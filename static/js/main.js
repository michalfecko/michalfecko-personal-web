(function () {
  'use strict';

  // ----- Theme toggle -----
  function applyTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
    markActive('[data-theme-set]', 'data-theme-set', currentTheme());
  }
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }
  function markActive(selector, attr, value) {
    document.querySelectorAll(selector).forEach(function (btn) {
      var isActive = btn.getAttribute(attr) === value;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-theme-set]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(btn.getAttribute('data-theme-set'));
    });
  });
  applyTheme(currentTheme());

  // ----- View toggle (grid / list) -----
  var home = document.querySelector('.home');
  var projects = document.querySelector('.projects');

  function applyView(view) {
    if (!home || !projects) return;
    home.setAttribute('data-view', view);
    projects.classList.remove('projects--grid', 'projects--list');
    projects.classList.add('projects--' + view);
    markActive('[data-view-set]', 'data-view-set', view);
    try { localStorage.setItem('view', view); } catch (e) {}
  }
  document.querySelectorAll('[data-view-set]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyView(btn.getAttribute('data-view-set'));
    });
  });
  var storedView = null;
  try { storedView = localStorage.getItem('view'); } catch (e) {}
  applyView(storedView === 'grid' || storedView === 'list' ? storedView : 'list');

  // ----- Filter (all / graphic / art / interior) -----
  function applyFilter(cat) {
    document.querySelectorAll('.project').forEach(function (item) {
      var cats = (item.getAttribute('data-categories') || '').split(/\s+/);
      var show = cat === 'all' || cats.indexOf(cat) !== -1;
      item.style.display = show ? '' : 'none';
    });
    markActive('[data-filter-set]', 'data-filter-set', cat);
  }
  document.querySelectorAll('[data-filter-set]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyFilter(btn.getAttribute('data-filter-set'));
    });
  });
  applyFilter('all');

  // ----- Lightbox (project page gallery) -----
  (function () {
    var gallery = document.querySelector('.project-page__gallery');
    if (!gallery) return;
    var imgs = Array.from(gallery.querySelectorAll('img'));
    if (imgs.length === 0) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('hidden', '');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = ''
      + '<button class="lightbox__btn lightbox__close" aria-label="Close">×</button>'
      + '<button class="lightbox__btn lightbox__prev"  aria-label="Previous">←</button>'
      + '<img class="lightbox__img" alt="">'
      + '<button class="lightbox__btn lightbox__next"  aria-label="Next">→</button>'
      + '<div class="lightbox__counter" aria-live="polite"></div>';
    document.body.appendChild(box);

    var lbImg = box.querySelector('.lightbox__img');
    var counter = box.querySelector('.lightbox__counter');
    var index = 0;
    var lastFocus = null;

    function show(i) {
      index = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[index].currentSrc || imgs[index].src;
      lbImg.alt = imgs[index].alt || '';
      counter.textContent = (index + 1) + ' / ' + imgs.length;
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      box.querySelector('.lightbox__close').focus();
    }
    function close() {
      box.setAttribute('hidden', '');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    imgs.forEach(function (img, i) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () { open(i); });
    });

    box.querySelector('.lightbox__close').addEventListener('click', close);
    box.querySelector('.lightbox__next').addEventListener('click', next);
    box.querySelector('.lightbox__prev').addEventListener('click', prev);
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target === lbImg) close();
    });

    document.addEventListener('keydown', function (e) {
      if (box.hasAttribute('hidden')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    });
  })();

  // ----- Local time -----
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function updateClocks() {
    document.querySelectorAll('[data-local-time]').forEach(function (el) {
      var tz = el.getAttribute('data-tz') || undefined;
      var now = new Date();
      try {
        var parts = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: tz
        }).formatToParts(now);
        var h = '', m = '', period = '';
        parts.forEach(function (p) {
          if (p.type === 'hour') h = p.value;
          else if (p.type === 'minute') m = p.value;
          else if (p.type === 'dayPeriod') period = p.value.toUpperCase();
        });
        el.textContent = h + ':' + m + ' ' + period;
      } catch (e) {
        el.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
      }
    });
  }
  updateClocks();
  setInterval(updateClocks, 30000);
})();
