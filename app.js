/* ============================================================
   AppSistems — lógica do portal
   Menu lateral recolhível + sistemas abertos em abas.
   Tudo é montado a partir de config/sistemas.js.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.PORTAL_CONFIG;
  var STORAGE_KEY = 'appsistems.portal.v1';
  var HOME = 'inicio';
  var mqMobile = window.matchMedia('(max-width: 900px)');

  var ICONS = {
    home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
    box: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
    truck: 'M2 7h12v9H2zM14 10h4l3 3v3h-7zM6 19h.01M17 19h.01',
    users: 'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-2a4 4 0 0 0-3-3.9',
    file: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5',
    chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    chevron: 'M6 9l6 6 6-6',
    close: 'M18 6L6 18M6 6l12 12',
    link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7'
  };

  /* ---------- Índice de sistemas ---------- */
  var SYS = {};          // id -> { sys, group }
  CFG.grupos.forEach(function (g) {
    g.sistemas.forEach(function (s) { SYS[s.id] = { sys: s, group: g }; });
  });

  /* ---------- Estado (salvo no navegador) ---------- */
  var saved = load();
  var state = {
    collapsed: !!saved.collapsed,
    open: saved.open || defaultOpen(),
    tabs: (saved.tabs || []).filter(function (id) { return SYS[id]; }),
    active: HOME
  };
  var initial = idFromHash() || (SYS[saved.active] && state.tabs.indexOf(saved.active) > -1 ? saved.active : HOME);

  function defaultOpen() { var o = {}; if (CFG.grupos[0]) o[CFG.grupos[0].id] = true; return o; }
  function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; } }
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ collapsed: state.collapsed, open: state.open, tabs: state.tabs, active: state.active }));
    } catch (e) { /* navegador sem storage: segue sem salvar */ }
  }

  /* ---------- Helpers de DOM ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var app = $('app'), nav = $('nav'), tabsEl = $('tabs'), frames = $('frames');
  var frameEls = {}; // id -> elemento .frame (mantido vivo enquanto a aba estiver aberta)

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function icon(name, cls) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    if (cls) svg.setAttribute('class', cls);
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', ICONS[name] || ICONS.box);
    svg.appendChild(p);
    return svg;
  }
  function norm(s) { return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function isMobile() { return mqMobile.matches; }

  /* ---------- Menu lateral ---------- */
  function renderNav() {
    nav.textContent = '';
    var collapsed = state.collapsed && !isMobile();

    nav.appendChild(el('button', {
      type: 'button',
      class: 'nav-item' + (state.active === HOME ? ' is-active' : ''),
      title: collapsed ? 'Início' : null,
      'aria-current': state.active === HOME ? 'page' : null,
      onclick: function () { activate(HOME); }
    }, [icon('home'), el('span', { class: 'label', text: 'Início' })]));

    nav.appendChild(el('div', { class: 'nav-section', text: 'MÓDULOS' }));

    CFG.grupos.forEach(function (g) {
      var isOpen = !!state.open[g.id];
      var hasActive = g.sistemas.some(function (s) { return s.id === state.active; });
      var subId = 'sub-' + g.id;

      var head = el('button', {
        type: 'button',
        class: 'nav-item' + (hasActive ? ' has-active' : ''),
        title: collapsed ? g.nome : null,
        'aria-expanded': isOpen && !collapsed ? 'true' : 'false',
        'aria-controls': subId,
        onclick: function () {
          if (state.collapsed && !isMobile()) { state.collapsed = false; state.open[g.id] = true; }
          else state.open[g.id] = !state.open[g.id];
          save(); applyLayout(); renderNav();
        }
      }, [icon(g.icone), el('span', { class: 'label', text: g.nome }), icon('chevron', 'chev')]);

      var sub = el('div', { class: 'sub', id: subId });
      g.sistemas.forEach(function (s) {
        var cls = 'sub-item';
        if (state.tabs.indexOf(s.id) > -1) cls += ' is-open';
        if (s.id === state.active) cls += ' is-active';
        sub.appendChild(el('button', {
          type: 'button', class: cls,
          'aria-current': s.id === state.active ? 'page' : null,
          onclick: function () { openSystem(s.id); }
        }, [el('span', { class: 'label', text: s.nome }), s.emBreve ? el('span', { class: 'badge', text: 'EM BREVE' }) : null]));
      });

      nav.appendChild(el('div', { class: 'nav-group' + (isOpen ? ' is-open' : '') }, [head, sub]));
    });
  }

  /* ---------- Abas ---------- */
  function renderTabs() {
    tabsEl.textContent = '';
    [HOME].concat(state.tabs).forEach(function (id) {
      var isHome = id === HOME;
      var name = isHome ? 'Início' : SYS[id].sys.nome;
      var on = id === state.active;
      var tab = el('div', { class: 'tab' + (on ? ' is-active' : '') }, [
        el('button', {
          type: 'button', role: 'tab', class: 'tab-btn',
          'aria-selected': on ? 'true' : 'false',
          onclick: function () { activate(id); },
          onauxclick: function (e) { if (e.button === 1 && !isHome) { e.preventDefault(); closeTab(id); } }
        }, [isHome ? icon('home') : null, name]),
        isHome ? null : el('button', {
          type: 'button', class: 'tab-close', 'aria-label': 'Fechar ' + name, title: 'Fechar',
          onclick: function () { closeTab(id); }
        }, [icon('close')])
      ]);
      tabsEl.appendChild(tab);
      if (on) setTimeout(function () { tab.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, 0);
    });
  }

  /* ---------- Página inicial ---------- */
  function renderHome(filter) {
    var wrap = $('groupsHome');
    wrap.textContent = '';
    var q = norm(filter);
    var total = 0;

    CFG.grupos.forEach(function (g) {
      var list = g.sistemas.filter(function (s) {
        return !q || norm(s.nome + ' ' + s.descricao + ' ' + g.nome).indexOf(q) > -1;
      });
      if (!list.length) return;
      total += list.length;
      var grid = el('div', { class: 'grid' });
      list.forEach(function (s) {
        var opened = state.tabs.indexOf(s.id) > -1;
        grid.appendChild(el('button', { type: 'button', class: 'card', 'data-id': s.id, onclick: function () { openSystem(s.id); } }, [
          el('div', { class: 'card-top' }, [
            el('span', { class: 'card-name', text: s.nome }),
            s.emBreve ? el('span', { class: 'badge', text: 'EM BREVE' }) : (opened ? el('span', { class: 'open-dot', text: '● aberto' }) : null)
          ]),
          el('span', { class: 'card-desc', text: s.descricao || '' })
        ]));
      });
      wrap.appendChild(el('section', { class: 'home-group' }, [
        el('h2', null, [icon(g.icone), g.nome]), grid
      ]));
    });
    $('emptySearch').hidden = total > 0;
  }

  /* ---------- Frames dos sistemas ---------- */
  function ensureFrame(id) {
    if (frameEls[id]) return frameEls[id];
    var s = SYS[id].sys;
    var box = el('div', { class: 'frame', 'data-id': id });

    if (s.url) {
      var loading = el('div', { class: 'frame-loading' }, [el('div', { class: 'spinner' }), 'Carregando ' + s.nome + '…']);
      var iframe = el('iframe', {
        src: s.url,
        title: s.nome,
        allow: 'clipboard-read; clipboard-write; fullscreen; camera; geolocation',
        referrerpolicy: 'no-referrer-when-downgrade',
        onload: function () { loading.remove(); }
      });
      box.appendChild(iframe);
      box.appendChild(loading);
    } else {
      box.appendChild(el('div', { class: 'frame-empty' }, [
        el('strong', { text: s.emBreve ? s.nome + ' — em breve' : s.nome }),
        el('span', { text: s.emBreve
          ? 'Este sistema ainda está em desenvolvimento.'
          : 'A URL deste sistema ainda não foi configurada em config/sistemas.js.' })
      ]));
    }
    frames.appendChild(box);
    frameEls[id] = box;
    return box;
  }

  function reloadActive() {
    var box = frameEls[state.active];
    var f = box && box.querySelector('iframe');
    if (!f) return;
    var src = f.src; f.src = 'about:blank'; f.src = src;
  }

  /* ---------- Navegação ---------- */
  function openSystem(id) {
    if (!SYS[id]) return activate(HOME);
    if (state.tabs.indexOf(id) < 0) state.tabs.push(id);
    activate(id);
  }

  function closeTab(id) {
    var i = state.tabs.indexOf(id);
    if (i < 0) return;
    state.tabs.splice(i, 1);
    if (frameEls[id]) { frameEls[id].remove(); delete frameEls[id]; }
    if (state.active === id) activate(state.tabs[i] || state.tabs[i - 1] || HOME);
    else { save(); renderTabs(); renderNav(); renderHome($('search').value); }
  }

  function activate(id) {
    state.active = id;
    var isHome = id === HOME;

    $('home').hidden = !isHome;
    $('viewer').hidden = isHome;

    if (!isHome) {
      var entry = SYS[id];
      ensureFrame(id);
      Object.keys(frameEls).forEach(function (k) { frameEls[k].classList.toggle('is-active', k === id); });
      $('crumbGroup').textContent = entry.group.nome;
      $('crumbName').textContent = entry.sys.nome;
      var ext = $('btnExternal');
      if (entry.sys.url) { ext.href = entry.sys.url; ext.removeAttribute('aria-disabled'); }
      else { ext.href = '#'; ext.setAttribute('aria-disabled', 'true'); }
      $('btnReload').disabled = !entry.sys.url;
      document.title = entry.sys.nome + ' · ' + CFG.nome;
    } else {
      renderHome($('search').value);
      document.title = CFG.nome + ' · ' + CFG.empresaCurta;
    }

    var hash = isHome ? '' : '#/' + id;
    if (location.hash !== hash) history.replaceState(null, '', location.pathname + location.search + hash);

    closeDrawer();
    save();
    renderTabs();
    renderNav();
  }

  function idFromHash() {
    var m = location.hash.match(/^#\/([\w-]+)/);
    if (m && SYS[m[1]]) {
      if (state.tabs.indexOf(m[1]) < 0) state.tabs.push(m[1]);
      return m[1];
    }
    return null;
  }

  /* ---------- Layout: recolher / gaveta no celular ---------- */
  function applyLayout() {
    var collapsed = state.collapsed && !isMobile();
    app.classList.toggle('collapsed', collapsed);
    var btn = $('btnToggle');
    btn.setAttribute('aria-label', isMobile() ? 'Fechar menu' : (collapsed ? 'Expandir menu' : 'Recolher menu'));
    btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    btn.title = btn.getAttribute('aria-label');
  }
  function openDrawer() { app.classList.add('drawer-open'); $('backdrop').hidden = false; }
  function closeDrawer() { app.classList.remove('drawer-open'); $('backdrop').hidden = true; }

  $('btnToggle').addEventListener('click', function () {
    if (isMobile()) { closeDrawer(); return; }
    state.collapsed = !state.collapsed;
    save(); applyLayout(); renderNav();
  });
  $('btnMobile').addEventListener('click', openDrawer);
  $('backdrop').addEventListener('click', closeDrawer);
  $('btnReload').addEventListener('click', reloadActive);
  mqMobile.addEventListener('change', function () { closeDrawer(); applyLayout(); renderNav(); });

  /* ---------- Busca ---------- */
  var search = $('search');
  search.addEventListener('input', function () { renderHome(search.value); });
  search.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var first = $('groupsHome').querySelector('.card');
      if (first) openSystem(first.getAttribute('data-id'));
    }
  });

  /* ---------- Atalhos de teclado ---------- */
  document.addEventListener('keydown', function (e) {
    var mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'k') {           // Ctrl+K: buscar
      e.preventDefault(); activate(HOME); search.focus(); search.select();
    } else if (e.key === 'Escape') {
      closeDrawer();
    } else if (e.altKey && e.key.toLowerCase() === 'w' && state.active !== HOME) { // Alt+W: fechar aba
      e.preventDefault(); closeTab(state.active);
    }
  });

  window.addEventListener('hashchange', function () {
    var id = idFromHash();
    activate(id || HOME);
  });

  /* ---------- Início ---------- */
  $('brandName').textContent = CFG.nome;
  $('brandSub').textContent = CFG.empresaCurta;
  $('homeCompany').textContent = CFG.empresa.toUpperCase();
  $('homeFoot').textContent = CFG.rodape;
  $('userName').textContent = CFG.usuario.nome;
  $('userInitials').textContent = CFG.usuario.iniciais;

  applyLayout();
  activate(initial);
})();
