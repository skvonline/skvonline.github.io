(function () {
  function parseVisibilityTimestamp(value) {
    if (!value || typeof value !== 'string') return null;

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2}):(\d{2})$/);
    if (!match) return null;

    const [, year, month, day, hour, minute] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  }

  function isVisible(entry, now = new Date()) {
    const publishAt = parseVisibilityTimestamp(entry?.publishAt);
    const deleteAt = parseVisibilityTimestamp(entry?.deleteAt);

    if (publishAt && now < publishAt) return false;
    if (deleteAt && now >= deleteAt) return false;
    return true;
  }

  async function loadGalleryOverview() {
    const overviewContainer = document.getElementById('gallery-overview-list');
    if (!overviewContainer) return;

    let entries = [];
    try {
      entries = await fetch('../src/data/gallery-overview.json').then((response) => (response.ok ? response.json() : []));
    } catch {
      entries = [];
    }

    const validEntries = Array.isArray(entries)
      ? entries.filter((entry) => entry && entry.name && entry.directory && isVisible(entry))
      : [];

    if (validEntries.length === 0) {
      overviewContainer.innerHTML = '<p>Aktuell sind keine Galerien verfügbar.</p>';
      return;
    }

    validEntries.forEach((entry) => {
      overviewContainer.insertAdjacentHTML(
        'beforeend',
        `<article class="card gallery-overview-card"><h3>${entry.name}</h3>${entry.description ? `<p>${entry.description}</p>` : ''}<a class="btn" href="../galerie/${entry.directory}/">Zur Galerie</a></article>`,
      );
    });
  }

  window.SKV = window.SKV || {};
  window.SKV.galleryOverview = { loadGalleryOverview };
})();
