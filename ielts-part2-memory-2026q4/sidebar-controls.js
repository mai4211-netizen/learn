/* One shared collapsible and resizable sidebar for Part 1, Part 2, Part 3 and Overview. */
(() => {
  const app = document.querySelector('.p2-page .app, .practice-page .layout, .overview-page .overview-app');
  const sidebar = app?.querySelector('aside.sidebar, aside.shared-sidebar');
  if (!app || !sidebar) return;

  // Part 2 already has these controls in its HTML. Reuse them there and
  // create identical controls for the other pages without altering their content.
  if (!sidebar.id) sidebar.id = 'speakingSidebar';
  let collapse = document.getElementById('sidebarCollapse');
  let expand = document.getElementById('sidebarExpand');
  let resizer = document.getElementById('sidebarResizer');
  if (!collapse) {
    collapse = document.createElement('button');
    collapse.id = 'sidebarCollapse';
    collapse.className = 'sidebar-collapse';
    collapse.type = 'button';
    collapse.textContent = '‹';
    collapse.title = '收起左侧题目栏';
    collapse.setAttribute('aria-label', '收起题目列表');
    collapse.setAttribute('aria-controls', sidebar.id);
    sidebar.prepend(collapse);
  }
  if (!resizer) {
    resizer = document.createElement('div');
    resizer.id = 'sidebarResizer';
    resizer.className = 'sidebar-resizer';
    resizer.title = '拖动调整侧栏宽度；也可按左右方向键';
    resizer.tabIndex = 0;
    resizer.setAttribute('role', 'separator');
    resizer.setAttribute('aria-label', '拖动调整题目列表宽度');
    resizer.setAttribute('aria-orientation', 'vertical');
    resizer.setAttribute('aria-controls', sidebar.id);
    resizer.setAttribute('aria-valuemin', '250');
    app.insertBefore(resizer, sidebar.nextSibling);
  }
  if (!expand) {
    expand = document.createElement('button');
    expand.id = 'sidebarExpand';
    expand.className = 'sidebar-expand';
    expand.type = 'button';
    expand.innerHTML = '☰ <span>题目</span>';
    expand.setAttribute('aria-label', '展开题目列表');
    expand.setAttribute('aria-controls', sidebar.id);
    expand.hidden = true;
    app.insertBefore(expand, app.querySelector('main'));
  }

  const WIDTH_KEY = 'p2-2026q4-sidebar-width';
  const COLLAPSED_KEY = 'p2-2026q4-sidebar-collapsed';
  const minWidth = 250;
  const maxWidth = () => Math.max(minWidth, Math.min(560, window.innerWidth - 382));
  const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, String(value)); } catch (_) {} };
  const clamp = width => Math.round(Math.max(minWidth, Math.min(maxWidth(), width)));
  let width = clamp(Number(safeGet(WIDTH_KEY)) || 290);
  let dragging = false;
  let dragStartX = 0;
  let dragStartWidth = width;

  function applyWidth(next, persist = false) {
    width = clamp(next);
    app.style.setProperty('--sidebar-width', width + 'px');
    resizer.setAttribute('aria-valuenow', String(width));
    resizer.setAttribute('aria-valuemax', String(maxWidth()));
    resizer.setAttribute('aria-valuetext', width + ' 像素');
    if (persist) safeSet(WIDTH_KEY, width);
  }
  function setCollapsed(collapsed) {
    app.classList.toggle('sidebar-collapsed', collapsed);
    collapse.setAttribute('aria-expanded', String(!collapsed));
    expand.setAttribute('aria-expanded', String(!collapsed));
    expand.hidden = !collapsed;
    safeSet(COLLAPSED_KEY, collapsed ? '1' : '0');
  }

  applyWidth(width);
  setCollapsed(safeGet(COLLAPSED_KEY) === '1');
  collapse.addEventListener('click', () => setCollapsed(true));
  expand.addEventListener('click', () => setCollapsed(false));

  resizer.addEventListener('pointerdown', event => {
    if (event.button !== 0 || window.matchMedia('(max-width: 850px)').matches || app.classList.contains('sidebar-collapsed')) return;
    dragging = true;
    dragStartX = event.clientX;
    dragStartWidth = width;
    resizer.setPointerCapture(event.pointerId);
    document.documentElement.classList.add('sidebar-is-resizing');
    event.preventDefault();
  });
  resizer.addEventListener('pointermove', event => {
    if (dragging) applyWidth(dragStartWidth + event.clientX - dragStartX);
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    document.documentElement.classList.remove('sidebar-is-resizing');
    applyWidth(width, true);
  };
  resizer.addEventListener('pointerup', endDrag);
  resizer.addEventListener('pointercancel', endDrag);
  resizer.addEventListener('lostpointercapture', endDrag);

  resizer.addEventListener('keydown', event => {
    if (window.matchMedia('(max-width: 850px)').matches) return;
    let next = width;
    if (event.key === 'ArrowLeft') next -= event.shiftKey ? 40 : 10;
    else if (event.key === 'ArrowRight') next += event.shiftKey ? 40 : 10;
    else if (event.key === 'Home') next = minWidth;
    else if (event.key === 'End') next = maxWidth();
    else return;
    event.preventDefault();
    applyWidth(next, true);
  });

  window.addEventListener('resize', () => applyWidth(width));
})();