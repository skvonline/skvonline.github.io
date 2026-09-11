async function loadHomeContent() {
  const [eventsRaw, newsRaw, vorstand, elferrat, royals, sponsors] = await Promise.all([
    fetch('./src/data/events.json').then((r) => r.json()),
    fetch('./src/data/news.json').then((r) => r.json()),
    fetch('./src/data/vorstand.json').then((r) => r.json()),
    fetch('./src/data/elferrat.json').then((r) => r.json()),
    fetch('./src/data/royals.json').then((r) => r.json()),
    fetch('./src/data/gallerys/sponsors.json').then((r) => r.json()),
  ]);
  const events = Array.isArray(eventsRaw) ? eventsRaw.filter((entry) => isVisibleByWindow(entry)) : [];
  const news = Array.isArray(newsRaw) ? newsRaw.filter((entry) => isVisibleByWindow(entry)) : [];

  if (events.length === 0) {
    const eventsContainer = document.getElementById('events-grid');
    const eventsMoreButton = document.getElementById('events-more');
    if (eventsContainer) {
      eventsContainer.innerHTML = `
        <article class="events-empty-state" aria-live="polite">
          <h3>Gerade steht kein Termin bevor</h3>
          <p>Schau gern bald wieder vorbei. Sobald neue Veranstaltungen feststehen, findest du sie hier.</p>
        </article>
      `;
    }
    if (eventsMoreButton) {
      eventsMoreButton.hidden = true;
    }
  } else {
    chunkRender({
      items: events,
      containerId: 'events-grid',
      buttonId: 'events-more',
      chunkSize: 3,
      renderItem: (event, index) => {
        const imagePath = getEventImagePath(event);
        const hasImage = Boolean(imagePath);
        const imageSideClass = hasImage ? (index % 2 === 0 ? 'event-card--image-left' : 'event-card--image-right') : 'event-card--no-image';
        const imageMarkup = hasImage
          ? `<div class="event-card-media">${createImageMarkup(event.image, event.title || 'Veranstaltung', 'event-image')}</div>`
          : '';

      return `
      <article class="card event-card ${imageSideClass}">
        <div class="event-card-layout">
          ${imageMarkup}
          <div class="event-card-body">
            <h3>${event.title || 'Veranstaltung'}</h3>
            ${getEventDetailsMarkup(event)}
            <div class="event-card-actions">
              ${getNewsLinksMarkup(event)}
              ${getEventShareButtonMarkup(event)}
            </div>
          </div>
        </div>
      </article>
    `;
      },
    });
    setupEventShareButtons();
  }

  chunkRender({
    items: news,
    containerId: 'news-grid',
    buttonId: 'news-more',
    chunkSize: 3,
    renderItem: (entry) => {
      const dateMarkup = getNewsDateMarkup(entry);
      const imageMarkup = normalizeImage(entry.image).src
        ? `<div class="news-media">
            ${createImageMarkup(entry.image, entry.title, 'news-image')}
            ${dateMarkup}
          </div>`
        : '';
      const newsSizeClass = entry.large ? ' news-card--large' : '';
      const headerMarkup = !normalizeImage(entry.image).src && dateMarkup ? `<div class="news-header">${dateMarkup}</div>` : '';

      return `
        <article class="card news-card${newsSizeClass}">
          ${headerMarkup}
          ${imageMarkup}
          <h3>${entry.title}</h3>
          <p>${entry.text}</p>
          ${getNewsLinksMarkup(entry)}
        </article>
      `;
    },
  });

  const vorstandGrid = document.getElementById('vorstand-grid');
  if (vorstandGrid) {
    vorstand.forEach((person, index) => {
      vorstandGrid.insertAdjacentHTML(
        'beforeend',
        `<article class="board-card">
          <button type="button" class="board-poster" aria-expanded="false" aria-controls="board-details-${index}">
            ${createImageMarkup(person.image, person.name, 'board-image')}
          </button>
          <div class="board-details" id="board-details-${index}">
            <h3>${person.name}</h3>
            <h4>${person.role}</h4>
            <div class="board-tags">
              ${person.tags.map((tag) => `<span>${tag}</span>`).join('')}
            </div>
            <p class="board-desc">${person.description}</p>
            <div class="board-social">
              <h5>Kontakt</h5>
              <ul>
                ${person.socials
                  .map(
                    (social) => `
                  <li class="${social.className}">
                    <a href="${social.href}" aria-label="${person.name} auf ${social.label}">${social.icon}</a>
                  </li>`,
                  )
                  .join('')}
              </ul>
            </div>
          </div>
        </article>`,
      );
    });
    setupBoardCards();
  }

  const elferratGrid = document.getElementById('elferrat-grid');
  if (elferratGrid) {
    elferrat.forEach((member) => {
      const imagePath = getElferratImagePath(member);
      elferratGrid.insertAdjacentHTML(
        'beforeend',
        `<article class="elferrat-card">
          ${createImageMarkup({ ...member.image, src: imagePath }, member.name, 'elferrat-image')}
          <h3 class="elferrat-name">${member.name}</h3>
          <p class="elferrat-role">${member.role}</p>
        </article>`,
      );
    });
  }

  const normalizedRoyals = royals.map(normalizeRoyalEntry);

  chunkRender({
    items: normalizedRoyals,
    containerId: 'royals-grid',
    buttonId: 'royals-more',
    chunkSize: 3,
    renderItem: (pair, index) => {
      const interactiveAttributes = `aria-label="${pair.title || pair.session || 'Prinzenpaar'}" role="button" tabindex="0"`;
      const imageMarkup = pair.hasImage
        ? createImageMarkup(pair.image, pair.title || pair.session, 'royal-gallery-image')
        : createRoyalFallbackMarkup(pair);
      const detailsMarkup = pair.hasImage
        ? `
          ${createRoyalOverlayText(pair.session, 'top-left')}
          ${createRoyalOverlayText(pair.year, 'top-right')}
          ${createRoyalOverlayText(pair.largePair, 'bottom-left')}
          ${createRoyalOverlayText(pair.smallPair, 'bottom-right')}
        `
        : '';

      return `
        <article class="royal-gallery-item${pair.hasImage ? '' : ' royal-gallery-item--no-image'}" ${interactiveAttributes} data-royal-index="${index}" data-has-image="${pair.hasImage}">
          ${imageMarkup}
          ${detailsMarkup}
        </article>
      `;
    },
  });

  setupRoyalsLightbox(normalizedRoyals);

  const sponsorsTrack = document.getElementById('sponsors-track');
  if (sponsorsTrack) {
    sponsors.forEach((sponsor) => {
      if (!normalizeImage(sponsor?.image).src) return;
      sponsorsTrack.insertAdjacentHTML(
        'beforeend',
        `<figure class="sponsor-slide">
          ${createImageMarkup(sponsor.image, sponsor.alt || 'Sponsor', 'sponsor-image')}
        </figure>`,
      );
    });
    setupSponsorsMarquee();
  }
}



