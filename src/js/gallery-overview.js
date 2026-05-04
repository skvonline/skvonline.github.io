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

  async function loadGalleryPreview(entry) {
    try {
      const items = await fetch(`../src/data/gallerys/${entry.directory}.json`).then((response) => (response.ok ? response.json() : []));
      if (!Array.isArray(items) || !items[0]?.src) return null;
      return { src: items[0].src, alt: items[0].alt || `Titelbild ${entry.name}` };
    } catch {
      return null;
    }
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

    const entriesWithPreviews = await Promise.all(
      validEntries.map(async (entry) => ({
        entry,
        preview: await loadGalleryPreview(entry),
      })),
    );

    entriesWithPreviews.forEach(({ entry, preview }) => {
      const galleryHref = `../galerie/${entry.directory}/`;
      const mediaMarkup = preview
        ? `<a class="gallery-overview-link" href="${galleryHref}" aria-label="Galerie ${entry.name} öffnen"><div class="gallery-overview-media"><img class="gallery-overview-image" src="${preview.src}" alt="${preview.alt}" loading="lazy" /><h3 class="gallery-overview-title">${entry.name}</h3></div></a>`
        : `<h3 class="gallery-overview-title gallery-overview-title--plain">${entry.name}</h3>`;

      overviewContainer.insertAdjacentHTML(
        'beforeend',
        `<article class="gallery-overview-card">${mediaMarkup}${entry.description ? `<p>${entry.description}</p>` : ''}</article>`,
      );
    });
  }

  window.SKV = window.SKV || {};
  window.SKV.galleryOverview = { loadGalleryOverview };
})();
