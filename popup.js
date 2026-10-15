const btn = document.getElementById('toggle');
const reloadBtn = document.getElementById('reload');
const statusEl = document.getElementById('status');

function render(on) {
  btn.textContent = on ? 'Deactivate' : 'Activate';
  btn.classList.toggle('off', !on);
}

function onAlive() {
  statusEl.textContent = 'Active on this tab.';
  statusEl.style.color = '#4caf50';
  btn.style.display = '';
  reloadBtn.style.display = 'none';
  chrome.storage.local.get('attrInspEnabled', (r) => render(!!r.attrInspEnabled));
}

function onDead(tabId) {
  statusEl.textContent = 'Not active. Reload tab to enable.';
  statusEl.style.color = '#ff6a00';
  btn.style.display = 'none';
  reloadBtn.style.display = '';
  reloadBtn.onclick = () => {
    chrome.tabs.reload(tabId);
    window.close();
  };
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs[0] || tabs[0].id == null) { statusEl.textContent = 'No active tab.'; return; }
  const tabId = tabs[0].id;
  const done = { v: false };
  const timeout = setTimeout(() => {
    if (done.v) return;
    done.v = true;
    onDead(tabId);
  }, 400);
  chrome.tabs.sendMessage(tabId, { type: 'ping' }, (resp) => {
    clearTimeout(timeout);
    if (done.v) return;
    done.v = true;
    if (chrome.runtime.lastError || !resp || resp.type !== 'pong') onDead(tabId);
    else onAlive();
  });
});

btn.addEventListener('click', () => {
  chrome.storage.local.get('attrInspEnabled', (r) => {
    const next = !r.attrInspEnabled;
    chrome.storage.local.set({ attrInspEnabled: next });
    render(next);
  });
});
