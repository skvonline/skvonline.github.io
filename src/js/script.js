async function loadComponent(targetId, path) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const response = await fetch(path);
  if (!response.ok) return;

  target.innerHTML = await response.text();
}

function setupMobileMenu() {
  const button = document.getElementById('menu_button');
  const mobileNav = document.getElementById('mobile-nav');
  const desktopMenu = document.querySelector('.header nav .main-menu');
  if (!button || !mobileNav || !desktopMenu) return;

  mobileNav.innerHTML = `<ul class="main-menu">${desktopMenu.innerHTML}</ul>`;

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    mobileNav.hidden = isExpanded;
  });
}

function setupHeroCarousel() {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  if (slides.length <= 1) return;

  let index = 0;
  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }, 5000);
}

function chunkRender({ items, containerId, buttonId, chunkSize, renderItem }) {
  const container = document.getElementById(containerId);
  const button = document.getElementById(buttonId);
  if (!container || !button) return;

  let renderedCount = 0;

  function renderNextChunk() {
    const nextItems = items.slice(renderedCount, renderedCount + chunkSize);
    nextItems.forEach((item, chunkIndex) => {
      container.insertAdjacentHTML('beforeend', renderItem(item, renderedCount + chunkIndex));
    });
    renderedCount += nextItems.length;
    button.hidden = renderedCount >= items.length;
  }

  renderNextChunk();
  if (items.length > chunkSize) {
    button.hidden = false;
    button.addEventListener('click', renderNextChunk);
  }
}

const NEWS_LINK_ICONS = {
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"></rect><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"></circle><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"></circle></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1z" fill="currentColor"></path></svg>',
  tiktok:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4c.6 1.7 1.7 3 3.7 3.6V11c-1.5-.1-2.7-.6-3.7-1.4v5.7a5.3 5.3 0 1 1-4.2-5.2v3a2.3 2.3 0 1 0 1.2 2.1V4h3z" fill="currentColor"></path></svg>',
  mail:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"></rect><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="2"></path></svg>',
  maps:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" fill="none" stroke="currentColor" stroke-width="2"></path><circle cx="12" cy="10" r="2.8" fill="none" stroke="currentColor" stroke-width="2"></circle></svg>',
};

function getNewsLinksMarkup(entry) {
  const legacyLink = entry.link && entry.link.url ? [entry.link] : [];
  const links = Array.isArray(entry.links) && entry.links.length > 0 ? entry.links : legacyLink;

  if (links.length === 0) {
    return '';
  }

  const markup = links
    .filter((link) => link && link.url)
    .map((link) => {
      const type = (link.type || 'more').toLowerCase();
      const classType = ['more', 'instagram', 'facebook', 'tiktok', 'mail', 'maps'].includes(type) ? type : 'more';
      const isMailto = link.url.startsWith('mailto:');
      const rel = isMailto ? '' : ' rel="noopener noreferrer"';
      const target = isMailto ? '' : ' target="_blank"';

      if (classType === 'more') {
        const label = link.label || 'Mehr erfahren';
        return `<a class="news-link news-link--more" href="${link.url}"${target}${rel}>${label}</a>`;
      }

      const ariaLabel = link.label || classType;
      return `<a class="news-link news-link--icon news-link--${classType}" href="${link.url}"${target}${rel} aria-label="${ariaLabel}">${NEWS_LINK_ICONS[classType]}</a>`;
    })
    .join('');

  return markup ? `<div class="news-links">${markup}</div>` : '';
}

function getNewsDateMarkup(entry) {
  if (!entry.date) {
    return '';
  }

  return `<span class="news-date" aria-label="Datum der News">${entry.date}</span>`;
}

function getEventDetailsMarkup(event) {
  const detailRows = [
    event.date && `<p><strong>Datum:</strong> ${event.date}</p>`,
    event.time && `<p><strong>Uhrzeit:</strong> ${event.time}</p>`,
    event.einlass && `<p><strong>Einlass:</strong> ${event.einlass}</p>`,
    event.preis && `<p><strong>Preis:</strong> ${event.preis}</p>`,
    event.location && `<p><strong>Ort:</strong> ${event.location}</p>`,
    event.description && `<p>${event.description}</p>`,
  ].filter(Boolean);

  if (detailRows.length === 0) {
    return '';
  }

  return `<div class="event-details">${detailRows.join('')}</div>`;
}

function getElferratImagePath(member) {
  if (member.image && member.image !== './src/img/dummy.svg') {
    return member.image;
  }

  const slug = member.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `./src/img/verein/elferrat/${slug}.png`;
}

function createRoyalOverlayText(value, modifierClass) {
  if (!value) {
    return '';
  }
  return `<span class="royal-gallery-overlay royal-gallery-overlay--${modifierClass}">${value || 'Nicht hinterlegt'}</span>`;
}

function getRoyalField(entry, candidates) {
  const key = candidates.find((candidate) => {
    const value = entry[candidate];
    return value !== undefined && value !== null && String(value).trim() !== '';
  });
  return key ? entry[key] : '';
}

function formatPairText(pairValue) {
  if (!pairValue) {
    return '';
  }

  if (typeof pairValue === 'string') {
    return pairValue;
  }

  if (Array.isArray(pairValue)) {
    const normalizedPairs = pairValue
      .map((pair) => formatPairText(pair))
      .filter(Boolean);
    return normalizedPairs.join('<br>');
  }

  if (typeof pairValue === 'object') {
    const prince = pairValue.prince || pairValue.prinz || pairValue.Prinz || '';
    const princess = pairValue.princess || pairValue.prinzessin || pairValue.Prinzessin || '';
    if (prince && princess) {
      return `${prince} und ${princess}`;
    }
    if (prince) {
      return prince;
    }
    if (princess) {
      return princess;
    }
  }

  return '';
}

function normalizeRoyalEntry(entry) {
  const session = getRoyalField(entry, ['session', 'Session']);
  const year = getRoyalField(entry, ['year', 'jahr', 'Jahr']) || session;
  const largePair = getRoyalField(entry, ['adultPair', 'grossesPP', 'großesPP', 'Grosses PP', 'Großes PP', 'text']);
  const smallPair = getRoyalField(entry, ['childPair', 'kleinesPP', 'Kleines PP']);

  return {
    ...entry,
    session,
    year,
    largePair: formatPairText(largePair),
    smallPair: formatPairText(smallPair),
    image: entry.image || '',
    title: entry.title || session || 'Prinzenpaar',
  };
}

function setupRoyalsLightbox(royals) {
  const lightbox = document.getElementById('royals-lightbox');
  const image = document.getElementById('royals-lightbox-image');
  const details = document.getElementById('royals-lightbox-details');
  const closeButton = document.getElementById('royals-lightbox-close');
  const prevButton = document.getElementById('royals-lightbox-prev');
  const nextButton = document.getElementById('royals-lightbox-next');
  const backdrop = lightbox?.querySelector('[data-lightbox-close]');
  const galleryItems = Array.from(document.querySelectorAll('.royal-gallery-item'));

  if (!lightbox || !image || !details || !closeButton || !prevButton || !nextButton || !backdrop || galleryItems.length === 0) {
    return;
  }

  let currentIndex = 0;

  function setLightboxContent(index) {
    const safeIndex = ((index % royals.length) + royals.length) % royals.length;
    const pair = royals[safeIndex];
    currentIndex = safeIndex;

    image.src = pair.image || '';
    image.alt = pair.title || pair.session || 'Prinzenpaar';
    details.innerHTML = `
      <p>${pair.session}</p>
      <p>${pair.year}</p>
      <p>${pair.largePair}</p>
      ${pair.smallPair ? `<p>${pair.smallPair}</p>` : ''}
    `;
  }

  function openLightbox(index) {
    setLightboxContent(index);
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }

  function goNext() {
    setLightboxContent(currentIndex + 1);
  }

  function goPrev() {
    setLightboxContent(currentIndex - 1);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const itemIndex = Number(item.dataset.royalIndex || 0);
      openLightbox(itemIndex);
    });
  });

  nextButton.addEventListener('click', goNext);
  prevButton.addEventListener('click', goPrev);
  closeButton.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') goNext();
    if (event.key === 'ArrowLeft') goPrev();
  });
}

async function loadHomeContent() {
  const [events, news, vorstand, elferrat, royals] = await Promise.all([
    fetch('./src/data/events.json').then((r) => r.json()),
    fetch('./src/data/news.json').then((r) => r.json()),
    fetch('./src/data/vorstand.json').then((r) => r.json()),
    fetch('./src/data/elferrat.json').then((r) => r.json()),
    fetch('./src/data/royals.json').then((r) => r.json()),
  ]);

  chunkRender({
    items: events,
    containerId: 'events-grid',
    buttonId: 'events-more',
    chunkSize: 3,
    renderItem: (event, index) => {
      const hasImage = Boolean(event.image);
      const imageSideClass = hasImage ? (index % 2 === 0 ? 'event-card--image-left' : 'event-card--image-right') : 'event-card--no-image';
      const imageMarkup = hasImage
        ? `<div class="event-card-media"><img class="event-image" src="${event.image}" alt="${event.title || 'Veranstaltung'}" loading="lazy" /></div>`
        : '';

      return `
      <article class="card event-card ${imageSideClass}">
        <div class="event-card-layout">
          ${imageMarkup}
          <div class="event-card-body">
            <h3>${event.title || 'Veranstaltung'}</h3>
            ${getEventDetailsMarkup(event)}
            ${getNewsLinksMarkup(event)}
          </div>
        </div>
      </article>
    `;
    },
  });

  chunkRender({
    items: news,
    containerId: 'news-grid',
    buttonId: 'news-more',
    chunkSize: 3,
    renderItem: (entry) => {
      const dateMarkup = getNewsDateMarkup(entry);
      const imageMarkup = entry.image
        ? `<div class="news-media">
            <img class="news-image" src="${entry.image}" alt="${entry.title}" loading="lazy" />
            ${dateMarkup}
          </div>`
        : '';
      const newsSizeClass = entry.large ? ' news-card--large' : '';
      const headerMarkup = !entry.image && dateMarkup ? `<div class="news-header">${dateMarkup}</div>` : '';

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
    vorstand.forEach((person) => {
      vorstandGrid.insertAdjacentHTML(
        'beforeend',
        `<article class="board-card">
          <div class="board-poster">
            <img src="${person.image}" alt="${person.name}" loading="lazy" />
          </div>
          <div class="board-details">
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
  }

  const elferratGrid = document.getElementById('elferrat-grid');
  if (elferratGrid) {
    elferrat.forEach((member) => {
      const imagePath = getElferratImagePath(member);
      elferratGrid.insertAdjacentHTML(
        'beforeend',
        `<article class="elferrat-card">
          <img class="elferrat-image" src="${imagePath}" alt="${member.name}" loading="lazy" />
          <h3 class="elferrat-name">${member.name}</h3>
          <p class="elferrat-role">${member.role}</p>
        </article>`,
      );
    });
  }

  const royalsGrid = document.getElementById('royals-grid');
  const royalsMoreButton = document.getElementById('royals-more');
  const normalizedRoyals = royals.map(normalizeRoyalEntry);
  if (royalsGrid) {
    royalsGrid.innerHTML = normalizedRoyals
      .map((pair, index) => {
        return `
        <button type="button" class="royal-gallery-item" data-royal-index="${index}" aria-label="${pair.title || pair.session}">
          <img class="royal-gallery-image" src="${pair.image}" alt="${pair.title || pair.session}" loading="lazy" />
          ${createRoyalOverlayText(pair.session, 'top-left')}
          ${createRoyalOverlayText(pair.year, 'top-right')}
          ${createRoyalOverlayText(pair.largePair, 'bottom-left')}
          ${createRoyalOverlayText(pair.smallPair, 'bottom-right')}
        </button>
      `;
      })
      .join('');
  }
  if (royalsMoreButton) {
    royalsMoreButton.hidden = true;
  }
  setupRoyalsLightbox(normalizedRoyals);
}

(async function init() {
  const page = document.body.dataset.page;

  if (page === 'home') {
    await loadComponent('header-component', './components/header.html');
    await loadComponent('footer-component', './components/footer.html');
    setupMobileMenu();
    setupHeroCarousel();
    await loadHomeContent();
    return;
  }

  await loadComponent('header-component', '../components/header.html');
  await loadComponent('footer-component', '../components/footer.html');
  setupMobileMenu();
})();
