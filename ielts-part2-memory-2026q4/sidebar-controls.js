/* Collapsible, draggable topic sidebar. Keeps existing answer and bold state untouched. */
(() => {
  const app = document.querySelector('.app');
  const sidebar = document.getElementById('topicSidebar');
  const collapse = document.getElementById('sidebarCollapse');
  const expand = document.getElementById('sidebarExpand');
  const resizer = document.getElementById('sidebarResizer');
  if (!app || !sidebar || !collapse || !expand || !resizer) return;

  const WIDTH_KEY = 'p2-2026q4-sidebar-width';
  const COLLAPSED_KEY = 'p2-2026q4-sidebar-collapsed';
  const minWidth = 250;
  const maxWidth = () => Math.max(minWidth, Math.min(560, window.innerWidth - 382));
  const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, String(value)); } catch (_) {} };
  const clamp = width => Math.round(Math.max(minWidth, Math.min(maxWidth(), width)));
  let width = clamp(Number(safeGet(WIDTH_KEY)) || 290);
  let dragging = false;

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
    resizer.setPointerCapture(event.pointerId);
    document.documentElement.classList.add('sidebar-is-resizing');
    event.preventDefault();
  });
  resizer.addEventListener('pointermove', event => {
    if (!dragging) return;
    applyWidth(event.clientX);
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
