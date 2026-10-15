const btn = document.getElementById('toggle');
const statusEl = document.getElementById('status');

function render(on) {
  btn.textContent = on ? 'Deactivate' : 'Activate';
  btn.classList.toggle('off', !on);
}

function fail(msg) {
  statusEl.textContent = msg;
  statusEl.style.color = '#ff6a00';
  btn.disabled = true;
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || tab.id == null || !/^https?:/.test(tab.url || '')) {
    return fail('Cannot inspect this page.');
  }
  try {
    // Injected on demand — activeTab grants access to this tab only.
    // content.js is guarded, so repeat injection is a no-op.
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
  } catch (e) {
    return fail('Cannot inspect this page.');
  }
  statusEl.textContent = 'Ready on this tab.';
  statusEl.style.color = '#4caf50';
  const r = await chrome.storage.local.get('attrInspEnabled');
  render(!!r.attrInspEnabled);
}

btn.addEventListener('click', async () => {
  const r = await chrome.storage.local.get('attrInspEnabled');
  const next = !r.attrInspEnabled;
  await chrome.storage.local.set({ attrInspEnabled: next });
  render(next);
});

init();
