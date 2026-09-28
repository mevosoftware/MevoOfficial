/* ============================================================
   MEVO SCHOOL — Interaction layer
   ============================================================ */
(function () {
  'use strict';

  var UI = window.MevoUI;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========== 0. Mount all product interfaces ========== */
  $$('[data-ui]').forEach(function (el) {
    var k = el.getAttribute('data-ui');
    if (UI[k]) el.innerHTML = typeof UI[k] === 'function' ? UI[k]() : UI[k];
  });
  $$('[data-svis]').forEach(function (el) { el.innerHTML = UI.svis[el.getAttribute('data-svis')] || ''; });
  var permEl = $('[data-perm]'); if (permEl) permEl.innerHTML = UI.perm();
  var yearEl = $('[data-year]'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ========== 1. Boot sequence ========== */
  var bootOrder = ['nav', 'tag', 'h1', 'lede', 'cta', 'meta'];
  $$('[data-boot]').forEach(function (el) {
    var i = bootOrder.indexOf(el.getAttribute('data-boot'));
    el.style.opacity = '0';
    el.style.transform = el.getAttribute('data-boot') === 'nav' ? 'translateY(-10px)' : 'translateY(14px)';
    el.style.transition = 'opacity .8s cubic-bezier(.22,1,.36,1) ' + (120 + i * 110) + 'ms, transform .9s cubic-bezier(.22,1,.36,1) ' + (120 + i * 110) + 'ms';
  });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      $$('[data-boot]').forEach(function (el) { el.style.opacity = ''; el.style.transform = ''; });
      var h1 = $('[data-boot="h1"]');
      if (h1) setTimeout(function () { $$('.rvt', h1).forEach(function (r) { r.classList.add('is-in'); }); }, 300);
      var st = $('[data-stage]');
      if (st) setTimeout(function () { st.classList.add('is-in'); }, 260);
    });
  });

  /* ========== 2. Reveal + chart/counter activation ========== */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var suf = el.getAttribute('data-suffix') || '';
    var pre = el.getAttribute('data-prefix') || '';
    if (reduced) { el.textContent = pre + target.toFixed(dec) + suf; return; }
    var dur = 1250, t0 = performance.now();
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var v = target * e;
      el.textContent = pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function activate(root) {
    $$('svg .draw', root).forEach(function (p) {
      try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + ''); } catch (e) {}
    });
    root.classList.add('is-drawn');
    $$('[data-count]', root).forEach(countUp);
    if (root.hasAttribute && root.hasAttribute('data-count')) countUp(root);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('is-in');
      $$('.rvt', el).forEach(function (r) { r.classList.add('is-in'); });
      activate(el);
      io.unobserve(el);
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

  $$('[data-rv]').forEach(function (el, i) {
    var d = el.getAttribute('data-rv-delay');
    if (d) el.style.setProperty('--rv-d', d + 'ms');
    io.observe(el);
  });
  // stagger the capability grid
  $$('[data-stagger] > *').forEach(function (el, i) { el.style.setProperty('--rv-d', (i * 55) + 'ms'); });

  // charts/counters that are not themselves reveal targets
  var io2 = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      activate(en.target);
      io2.unobserve(en.target);
    });
  }, { threshold: .18 });
  $$('[data-chart-scope], .chart, .fstep__card').forEach(function (el) { io2.observe(el); });
  $$('[data-count]').forEach(function (el) {
    if (el.closest('[data-chart-scope]') || el.closest('.chart')) return;
    io2.observe(el);
  });

  /* ========== 3. Nav ========== */
  var nav = $('#nav'), burger = $('#burger'), mnav = $('#mnav');
  var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 12); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (mnav) mnav.hidden = false;
  function closeMenu() {
    document.body.classList.remove('is-menu');
    document.body.classList.remove('is-locked');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var open = !document.body.classList.contains('is-menu');
    document.body.classList.toggle('is-menu', open);
    document.body.classList.toggle('is-locked', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#mnav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // active section highlighting
  var sectionIds = ['product', 'features', 'solutions', 'how', 'pricing', 'resources'];
  var navLinks = {};
  $$('.nav__links a').forEach(function (a) { navLinks[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (ents) {
    ents.forEach(function (e) {
      var a = navLinks[e.target.id];
      if (a && e.isIntersecting) {
        Object.keys(navLinks).forEach(function (k) { navLinks[k].classList.remove('is-active'); });
        a.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sectionIds.forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });

  /* ========== 4. Magnetic buttons ========== */
  if (!reduced && window.matchMedia('(hover:hover)').matches) {
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = 'translate(' + (x * 7).toFixed(2) + 'px,' + (y * 5).toFixed(2) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ========== 5. Problem transformation (scroll-driven) ========== */
  var track = $('[data-transform]');
  if (track) {
    var steps = $$('.pstep', track);
    var onT = function () {
      var r = track.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * .85 - r.top) / (r.height * .75 + vh * .25);
      p = Math.max(0, Math.min(1, p));
      var active = Math.min(steps.length, Math.floor(p * (steps.length + .35)));
      steps.forEach(function (s, i) { s.classList.toggle('is-on', i < active); });
    };
    onT();
    window.addEventListener('scroll', onT, { passive: true });
    window.addEventListener('resize', onT);
  }

  /* ========== 6. Workflow rail ========== */
  var flow = $('[data-flow]');
  if (flow) {
    var fsteps = $$('[data-fstep]', flow);
    var fill = $('.flow__line i', flow);
    var onF = function () {
      var r = flow.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.max(0, Math.min(1, (vh * .8 - r.top) / (r.height * .6 + vh * .3)));
      var n = Math.round(p * fsteps.length);
      fsteps.forEach(function (s, i) { s.classList.toggle('is-on', i < n); });
      if (fill) fill.style.width = Math.max(0, Math.min(100, (n - .5) / (fsteps.length - 1) * 100)) + '%';
    };
    onF();
    window.addEventListener('scroll', onF, { passive: true });
    window.addEventListener('resize', onF);
  }

  /* ========== 7. Ecosystem ========== */
  var eco = $('[data-eco]');
  if (eco) {
    var canvas = $('.eco__canvas', eco);
    var wires = $('.wires', canvas);
    var panel = $('[data-eco-panel]', eco);
    var mods = UI.modules.filter(function (m) { return !m.hidden; });
    var all = UI.modules;

    // nodes
    mods.forEach(function (m) {
      var n = document.createElement('button');
      n.className = 'node';
      n.style.left = m.x + '%';
      n.style.top = m.y + '%';
      n.setAttribute('data-node', m.id);
      n.innerHTML = '<svg><use href="#i-' + m.i + '"/></svg>' + m.t;
      canvas.appendChild(n);
    });

    // wires (center 50/50 in a 600x520 viewBox)
    var svgNS = 'http://www.w3.org/2000/svg';
    mods.forEach(function (m) {
      var x = m.x / 100 * 600, y = m.y / 100 * 520;
      var cx = 300, cy = 260;
      var mx = (x + cx) / 2, my = (y + cy) / 2 + (x > cx ? -22 : 22);
      var d = 'M' + cx + ' ' + cy + ' Q ' + mx + ' ' + my + ' ' + x + ' ' + y;
      var p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', d); p.setAttribute('data-wire', m.id);
      wires.appendChild(p);
      var f = document.createElementNS(svgNS, 'path');
      f.setAttribute('d', d); f.setAttribute('class', 'flow'); f.setAttribute('data-flowline', m.id);
      wires.appendChild(f);
    });

    // panels
    panel.innerHTML = all.map(function (m, i) {
      return '<div class="ep' + (i === 0 ? ' is-on' : '') + '" data-ep="' + m.id + '">' +
        '<div class="ep__k">' + m.k + '</div><h4>' + m.h + '</h4><p>' + m.p + '</p>' +
        '<div class="ep__ui">' + (UI.mini[m.id] || '') + '</div>' +
        '<ul class="ep__list">' + m.pts.map(function (t) {
          return '<li><svg><use href="#i-check"/></svg>' + t + '</li>';
        }).join('') + '</ul></div>';
    }).join('');

    var setMod = function (id) {
      $$('.node', canvas).forEach(function (n) { n.classList.toggle('is-hot', n.getAttribute('data-node') === id); });
      $$('[data-wire]', wires).forEach(function (p) { p.classList.toggle('is-hot', p.getAttribute('data-wire') === id); });
      $$('[data-flowline]', wires).forEach(function (p) { p.classList.toggle('is-hot', p.getAttribute('data-flowline') === id); });
      $$('.ep', panel).forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-ep') === id); });
      var on = $('.ep.is-on', panel);
      if (on) activate(on);
      canvas.style.backgroundColor = id ? '#fbfcff' : '';
    };
    $$('.node', canvas).forEach(function (n) {
      var id = n.getAttribute('data-node');
      n.addEventListener('pointerenter', function () { setMod(id); });
      n.addEventListener('focus', function () { setMod(id); });
      n.addEventListener('click', function () { setMod(id); });
    });
    $('.eco__core', canvas).addEventListener('pointerenter', function () { setMod('principal'); });
  }

  /* ========== 8. Product tour tabs ========== */
  var tabsEl = $('[data-tabs]'), stage = $('[data-show-stage]');
  if (tabsEl && stage) {
    var keys = $$('button', tabsEl).map(function (b) { return b.getAttribute('data-tab'); });
    stage.innerHTML = keys.map(function (k, i) {
      return '<div class="show__pane' + (i === 0 ? ' is-on' : '') + '" data-pane="' + k + '">' +
        (UI[k] ? UI[k]() : '') + '</div>';
    }).join('');

    var ink = $('.tabs__ink', tabsEl);
    function moveInk(btn) {
      ink.style.width = btn.offsetWidth + 'px';
      ink.style.transform = 'translateX(' + (btn.offsetLeft - 4) + 'px)';
    }
    var first = $('button.is-on', tabsEl);
    requestAnimationFrame(function () { moveInk(first); });
    window.addEventListener('resize', function () { moveInk($('button.is-on', tabsEl)); });

    $$('button', tabsEl).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', tabsEl).forEach(function (o) { o.classList.remove('is-on'); o.setAttribute('aria-selected', 'false'); });
        b.classList.add('is-on'); b.setAttribute('aria-selected', 'true');
        moveInk(b);
        var k = b.getAttribute('data-tab');
        $$('.show__pane', stage).forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-pane') === k); });
        var pane = $('.show__pane.is-on', stage);
        $$('[data-count]', pane).forEach(function (c) { c.dataset.done = ''; });
        activate(pane);
      });
    });
    io2.observe(stage);
  }

  /* ========== 9. Phones ========== */
  var pa = $('[data-phone="a"]'), pb = $('[data-phone="b"]');
  if (pa) {
    var order = ['dash', 'student', 'att', 'fees', 'notices'];
    function renderPhones(key) {
      var i = order.indexOf(key);
      pa.innerHTML = UI.screens[key]();
      if (pb) pb.innerHTML = UI.screens[order[(i + 1) % order.length]]();
      [pa, pb].forEach(function (p) { if (p) { p.classList.remove('is-drawn'); activate(p); } });
    }
    renderPhones('dash');
    $$('[data-phone-switch] button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-phone-switch] button').forEach(function (o) { o.classList.remove('is-on'); });
        b.classList.add('is-on');
        renderPhones(b.getAttribute('data-screen'));
      });
    });
  }

  /* ========== 10. FAQ accordion ========== */
  var acc = $('[data-acc]');
  if (acc) {
    acc.innerHTML = UI.faq.map(function (f, i) {
      return '<div class="acc__item"><h3 style="margin:0"><button class="acc__q" aria-expanded="false" aria-controls="faq' + i + '">' +
        '<span>' + f[0] + '</span><span class="acc__ico" aria-hidden="true"></span></button></h3>' +
        '<div class="acc__a" id="faq' + i + '"><p>' + f[1] + '</p></div></div>';
    }).join('');

    $$('.acc__q', acc).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.parentNode.parentNode;
        var body = $('.acc__a', item);
        var open = item.classList.contains('is-open');
        $$('.acc__item.is-open', acc).forEach(function (o) {
          o.classList.remove('is-open');
          $('.acc__a', o).style.height = '0px';
          $('.acc__q', o).setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('is-open');
          body.style.height = body.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ========== 11. Pricing toggle ========== */
  var bill = $('[data-billing]');
  if (bill) {
    var bink = $('.toggle__ink', bill);
    function moveB(btn) {
      bink.style.width = btn.offsetWidth + 'px';
      bink.style.transform = 'translateX(' + (btn.offsetLeft - 4) + 'px)';
    }
    requestAnimationFrame(function () { moveB($('button.is-on', bill)); });
    window.addEventListener('resize', function () { moveB($('button.is-on', bill)); });

    $$('button', bill).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', bill).forEach(function (o) { o.classList.remove('is-on'); });
        b.classList.add('is-on');
        moveB(b);
        var y = b.getAttribute('data-bill') === 'y';
        $$('[data-price]').forEach(function (p) {
          p.textContent = '$' + p.getAttribute(y ? 'data-y' : 'data-m');
        });
        $$('[data-note]').forEach(function (n) {
          n.textContent = n.textContent.replace(/Billed (monthly|yearly)/, 'Billed ' + (y ? 'yearly' : 'monthly'));
        });
      });
    });
  }

  /* ========== 12. Smooth anchor scrolling with nav offset ========== */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var t = document.getElementById(id);
    if (!t) return;
    e.preventDefault();
    var top = t.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
  });
})();
