/*
 * Rendering der Downloadseite.
 * Lädt Download-Einträge aus JSON und erzeugt Karten mit Dateiname, Beschreibung und Downloadlink.
 */

async function loadDownloadsContent() {
  const downloadsContainer = document.getElementById('downloads-list');
  if (!downloadsContainer) {
    return;
  }

  let entries = [];
  try {
    entries = await fetch('../src/data/downloads.json').then((response) => (response.ok ? response.json() : []));
  } catch (error) {
    entries = [];
  }

  const validEntries = Array.isArray(entries)
    ? entries.filter((entry) => entry && entry.title && entry.file)
    : [];

  if (validEntries.length === 0) {
    downloadsContainer.innerHTML = '<p>Aktuell sind keine Downloads verfügbar.</p>';
    return;
  }

  validEntries.forEach((entry) => {
    const fileName = entry.file.split('/').pop() || '';
    const fileExtension = fileName.includes('.') ? fileName.split('.').pop().toUpperCase() : 'DATEI';
    const description = entry.description ? `<p>${entry.description}</p>` : '';
    const label = entry.label || 'Download starten';
    downloadsContainer.insertAdjacentHTML(
      'beforeend',
      `<article class="card download-card">
        <div class="download-card__top">
          <h3>${entry.title}</h3>
          <span class="download-card__badge">${fileExtension}</span>
        </div>
        <div class="download-card__body">
          ${description}
        </div>
        <div class="download-card__footer">
          <p class="download-card__filename">${fileName}</p>
          <a class="btn download-card__action" href="${entry.file}" download>
            <span>${label}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 3.75a.75.75 0 0 1 .75.75v9.69l2.72-2.72a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06l2.72 2.72V4.5a.75.75 0 0 1 .75-.75ZM5.5 18.25a.75.75 0 0 1 .75.75v.25c0 .14.11.25.25.25h11a.25.25 0 0 0 .25-.25V19a.75.75 0 0 1 1.5 0v.25A1.75 1.75 0 0 1 17.5 21h-11A1.75 1.75 0 0 1 4.75 19.25V19a.75.75 0 0 1 .75-.75Z"/>
            </svg>
          </a>
        </div>
      </article>`,
    );
  });
}



