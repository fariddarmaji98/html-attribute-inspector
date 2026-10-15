// Attribute Inspector — content script
(() => {
  if (window.__attrInspector) return;
  window.__attrInspector = true;

  let enabled = false;
  let highlightEl = null;
  let popupEl = null;
  let lockedEl = null;
  let rafPending = false;
  let lastClientX = 0;
  let lastClientY = 0;

  const style = document.createElement('style');
  style.textContent = `
    .attr-insp-highlight { outline: 2px solid #ff6a00 !important; outline-offset: -2px; }
    .attr-insp-popup {
      position: fixed; bottom: 0; right: 0; z-index: 2147483647;
      max-width: 380px; max-height: 50vh; overflow: auto;
      background: #1e1e1e; color: #d4d4d4;
      font: 12px/1.5 Consolas, "Courier New", monospace;
      padding: 10px 12px; border-top-left-radius: 6px;
      box-shadow: 0 0 14px rgba(0,0,0,.7);
      pointer-events: none;
    }
    .attr-insp-popup.locked { pointer-events: auto; }
    .attr-insp-popup h3 { margin: 0 0 8px; color: #ff6a00; font-size: 13px; word-break: break-all; }
    .attr-insp-popup table { border-collapse: collapse; width: 100%; }
    .attr-insp-popup td { border-bottom: 1px solid #333; padding: 3px 8px 3px 0; vertical-align: top; word-break: break-all; }
    .attr-insp-popup .k { color: #9cdcfe; white-space: nowrap; }
    .attr-insp-popup .v { color: #ce9178; }
    .attr-insp-popup .close { position: absolute; top: 4px; right: 8px; cursor: pointer; color: #888; font-size: 14px; }
    .attr-insp-popup .close:hover { color: #fff; }
    .attr-insp-lock { outline-color: #ffd700 !important; }
  `;
  (document.head || document.documentElement).appendChild(style);

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function removePopup() {
    if (popupEl) { popupEl.remove(); popupEl = null; }
  }

  function describe(el) {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? '#' + el.id : '';
    let cls = '';
    if (typeof el.className === 'string' && el.className.trim()) {
      cls = '.' + el.className.trim().split(/\s+/).join('.');
    }
    return `<${tag}${id}${cls}>`;
  }

  function buildPopup(el, isLocked) {
    removePopup();
    const attrs = [];
    for (const a of el.attributes) attrs.push([a.name, a.value]);
    popupEl = document.createElement('div');
    popupEl.className = 'attr-insp-popup' + (isLocked ? ' locked' : '');
    let rows;
    if (!attrs.length) rows = '<tr><td>(no attributes)</td></tr>';
    else rows = attrs.map(([k, v]) => `<tr><td class="k">${esc(k)}</td><td class="v">${esc(v)}</td></tr>`).join('');
    const lockedBadge = isLocked ? ' <span style="color:#ffd700">[locked]</span>' : '';
    popupEl.innerHTML = `<h3>${esc(describe(el))}${lockedBadge}</h3>${isLocked ? '<span class="close" title="close (Esc)">✕</span>' : ''}<table>${rows}</table>`;
    document.body.appendChild(popupEl);
    if (isLocked) {
      popupEl.querySelector('.close').addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (lockedEl) { lockedEl.classList.remove('attr-insp-highlight', 'attr-insp-lock'); lockedEl = null; }
        removePopup();
      });
    }
  }

  function elementAtPoint(x, y) {
    if (popupEl) popupEl.style.visibility = 'hidden';
    const el = document.elementFromPoint(x, y);
    if (popupEl) popupEl.style.visibility = '';
    return el;
  }

  function processHover() {
    rafPending = false;
    if (!enabled || lockedEl) return;
    const el = elementAtPoint(lastClientX, lastClientY);
    if (!el || el === document.body || el === document.documentElement) return;
    if (el === highlightEl) return;
    if (highlightEl) highlightEl.classList.remove('attr-insp-highlight');
    highlightEl = el;
    el.classList.add('attr-insp-highlight');
    buildPopup(el, false);
  }

  function onMouseMove(e) {
    if (!enabled || lockedEl) return;
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(processHover);
    }
  }

  // Ctrl + right-click toggles lock on element under cursor
  function onContextMenu(e) {
    if (!enabled) return;
    if (!e.ctrlKey) return; // normal right-click passes through
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    const el = elementAtPoint(e.clientX, e.clientY) || e.target;
    if (!el || el === document.body || el === document.documentElement) return;
    if (lockedEl === el) {
      // unlock same element
      el.classList.remove('attr-insp-lock', 'attr-insp-highlight');
      lockedEl = null;
      if (highlightEl) { highlightEl.classList.remove('attr-insp-highlight'); highlightEl = null; }
      removePopup();
    } else {
      if (lockedEl) lockedEl.classList.remove('attr-insp-lock');
      if (highlightEl && highlightEl !== el) highlightEl.classList.remove('attr-insp-highlight');
      lockedEl = el;
      el.classList.add('attr-insp-lock');
      highlightEl = el;
      buildPopup(el, true);
    }
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      if (lockedEl) {
        lockedEl.classList.remove('attr-insp-lock', 'attr-insp-highlight');
        lockedEl = null;
        removePopup();
      } else {
        disable();
      }
    }
  }

  function enable() {
    if (enabled) return;
    enabled = true;
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('contextmenu', onContextMenu, true);
    document.addEventListener('keydown', onKey, true);
  }

  function disable() {
    if (!enabled) return;
    enabled = false;
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('contextmenu', onContextMenu, true);
    document.removeEventListener('keydown', onKey, true);
    if (highlightEl) { highlightEl.classList.remove('attr-insp-highlight'); highlightEl = null; }
    if (lockedEl) { lockedEl.classList.remove('attr-insp-lock'); lockedEl = null; }
    removePopup();
  }

  chrome.storage.local.get('attrInspEnabled', (r) => { if (r.attrInspEnabled) enable(); });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.attrInspEnabled) {
      changes.attrInspEnabled.newValue ? enable() : disable();
    }
  });
})();
