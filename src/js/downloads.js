(function () {
  async function loadDownloadsContent() {
    const downloadsContainer = document.getElementById('downloads-list');
    if (!downloadsContainer) return;
    let entries = [];
    try { entries = await fetch('../src/data/downloads.json').then((response) => (response.ok ? response.json() : [])); } catch { entries = []; }
    const validEntries = Array.isArray(entries) ? entries.filter((entry) => entry && entry.title && entry.file) : [];
    if (validEntries.length === 0) { downloadsContainer.innerHTML = '<p>Aktuell sind keine Downloads verfügbar.</p>'; return; }
    validEntries.forEach((entry) => downloadsContainer.insertAdjacentHTML('beforeend', `<article class="card download-card"><h3>${entry.title}</h3>${entry.description ? `<p>${entry.description}</p>` : ''}<a class="btn" href="${entry.file}" download>${entry.label || 'Download starten'}</a></article>`));
  }
  window.SKV = window.SKV || {};
  window.SKV.downloads = { loadDownloadsContent };
})();
