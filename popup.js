const btn = document.getElementById('toggle');
function render(on) {
  btn.textContent = on ? 'Deactivate' : 'Activate';
  btn.classList.toggle('off', !on);
}
chrome.storage.local.get('attrInspEnabled', (r) => render(!!r.attrInspEnabled));
btn.addEventListener('click', () => {
  chrome.storage.local.get('attrInspEnabled', (r) => {
    const next = !r.attrInspEnabled;
    chrome.storage.local.set({ attrInspEnabled: next });
    render(next);
  });
});
