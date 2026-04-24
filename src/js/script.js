async function loadComponent(targetId, path) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const response = await fetch(path);
  if (!response.ok) return;

  target.innerHTML = await response.text();
}

function getRootPrefix(page) {
  if (page === 'home') return './';
  if (page === 'linktree') return '../';
  if (page === 'legal') return '../../';
  return '../';
}

function normalizeComponentLinks(page) {
  const rootPrefix = getRootPrefix(page);
  const internalAnchors = document.querySelectorAll('#header-component a[href^="/"], #footer-component a[href^="/"]');
  internalAnchors.forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href) return;
    anchor.setAttribute('href', `${rootPrefix}${href.slice(1)}`);
  });

  const internalImages = document.querySelectorAll('#header-component img[src^="/"], #footer-component img[src^="/"]');
  internalImages.forEach((image) => {
    const src = image.getAttribute('src');
    if (!src) return;
    image.setAttribute('src', `${rootPrefix}${src.slice(1)}`);
  });
}

function setupMobileMenu() {
  const button = document.getElementById('menu_button');
  const mobileNav = document.getElementById('mobile-nav');
  const desktopMenu = document.querySelector('.header nav .main-menu');
  if (!button || !mobileNav || !desktopMenu) return;

  mobileNav.innerHTML = `<ul class="main-menu">${desktopMenu.innerHTML}</ul>`;

  const mobileSubmenuParents = mobileNav.querySelectorAll('.has-submenu');
  mobileSubmenuParents.forEach((parent, index) => {
    const toggle = parent.querySelector(':scope > a');
    const submenu = parent.querySelector(':scope > .submenu');
    if (!toggle || !submenu) return;

    const submenuId = `mobile-submenu-${index + 1}`;
    submenu.id = submenuId;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', submenuId);

    parent.classList.remove('is-open');

    toggle.addEventListener('click', (event) => {
      if (window.innerWidth > 960) return;
      event.preventDefault();

      const isOpen = parent.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      submenu.style.maxHeight = isOpen ? `${submenu.scrollHeight}px` : '0px';
    });
  });

  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    mobileNav.hidden = isExpanded;
  });
}

function setupHeaderSmoothScroll() {
  const header = document.querySelector('.header');
  const mobileNav = document.getElementById('mobile-nav');
  const menuButton = document.getElementById('menu_button');
  const headerLinks = document.querySelectorAll('#header-component a[href*="#"]');

  if (!header || headerLinks.length === 0) {
    return;
  }

  headerLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetUrl = new URL(link.href, window.location.href);
      const isSamePage = targetUrl.pathname === window.location.pathname;
      const targetId = targetUrl.hash ? targetUrl.hash.slice(1) : '';
      if (!isSamePage || !targetId) {
        return;
      }

      const targetElement = document.getElementById(targetId);
      if (!targetElement) {
        return;
      }

      event.preventDefault();
      const headerHeight = header.getBoundingClientRect().height;
      const scrollPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

      window.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth',
      });

      if (mobileNav && !mobileNav.hidden) {
        mobileNav.hidden = true;
      }
      if (menuButton) {
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
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

async function loadHomeGallery() {
  const galleryContainer = document.getElementById('home-gallery-slides');
  if (!galleryContainer) return;

  const galleryItems = await fetch('./src/data/gallerys/home-gallery.json').then((response) => response.json());
  if (!Array.isArray(galleryItems) || galleryItems.length === 0) {
    return;
  }

  galleryItems.forEach((item, index) => {
    if (!item?.src) {
      return;
    }

    const isActiveClass = index === 0 ? ' active' : '';
    const altText = item.alt || 'Bild aus der Home-Gallery';
    galleryContainer.insertAdjacentHTML(
      'beforeend',
      `<img class="hero-slide${isActiveClass}" src="${item.src}" alt="${altText}" loading="lazy" />`,
    );
  });
}

function setupSponsorsMarquee() {
  const track = document.getElementById('sponsors-track');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.sponsor-slide'));
  if (slides.length <= 1) return;

  const cloneMarkup = slides.map((slide) => slide.outerHTML).join('');
  track.insertAdjacentHTML('beforeend', cloneMarkup);
  track.setAttribute('aria-hidden', 'false');

  const durationInSeconds = Math.max(16, slides.length * 3.2);
  track.style.setProperty('--sponsors-marquee-duration', `${durationInSeconds}s`);
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

function parseVisibilityTimestamp(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute] = match;
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
}

function formatNoticeCountdown(targetDate, now = new Date()) {
  const diffMs = targetDate.getTime() - now.getTime();
  if (diffMs <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, '0');

  if (days >= 1) {
    return `${days} T ${pad(hours)} Std ${pad(minutes)} Min`;
  }

  return `${pad(totalHours)} Std ${pad(minutes)} Min ${pad(seconds)} Sek`;
}

function getFirstDefinedValue(entry, keys) {
  return keys.find((key) => entry?.[key] !== undefined && entry?.[key] !== null && String(entry[key]).trim() !== '');
}

function isVisibleByWindow(entry, now = new Date()) {
  const publishKey = getFirstDefinedValue(entry, ['publishAt', 'publicationAt', 'releaseAt', 'veroeffentlichungAb']);
  const deleteKey = getFirstDefinedValue(entry, ['deleteAt', 'deleteDate', 'removeAt', 'loeschzeitpunkt']);
  const publishAt = parseVisibilityTimestamp(publishKey ? entry[publishKey] : null);
  const deleteAt = parseVisibilityTimestamp(deleteKey ? entry[deleteKey] : null);

  if (publishAt && now < publishAt) {
    return false;
  }

  if (deleteAt && now >= deleteAt) {
    return false;
  }

  return true;
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
  share:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3" fill="none" stroke="currentColor" stroke-width="2"></circle><circle cx="6" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"></circle><circle cx="18" cy="19" r="3" fill="none" stroke="currentColor" stroke-width="2"></circle><path d="M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>',
};

const LINKTREE_ICONS = {
  website:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" fill="none" stroke="currentColor" stroke-width="2"></path></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"></rect><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"></circle><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"></circle></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1z" fill="currentColor"></path></svg>',
  download:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m0 0l-4-4m4 4l4-4M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
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
  ].filter(Boolean);

  if (detailRows.length === 0) {
    return '';
  }

  return `<div class="event-details">${detailRows.join('')}</div>`;
}

function getEventDescriptionMarkup(event) {
  if (!event?.description || String(event.description).trim() === '') {
    return '';
  }

  return `<p class="event-detail-description">${event.description}</p>`;
}

function parseEventDateForShare(dateValue) {
  if (!dateValue || typeof dateValue !== 'string') {
    return null;
  }

  const normalized = dateValue.trim();
  const match = normalized.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function parseEventTimeForShare(timeValue) {
  if (!timeValue || typeof timeValue !== 'string') {
    return null;
  }

  const match = timeValue.match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    return null;
  }

  const [, hour, minute] = match;
  return `${hour.padStart(2, '0')}.${minute}`;
}

function buildEventShareUrl(event) {
  const eventToken = getEventDetailToken(event);
  if (!eventToken) {
    return '';
  }

  const detailPath = `/veranstaltungen/?${eventToken}`;
  return new URL(detailPath, window.location.origin).href;
}

function getEventDetailToken(event) {
  const datePart = parseEventDateForShare(event?.date);
  const timePart = parseEventTimeForShare(event?.time);
  if (!datePart || !timePart) {
    return '';
  }

  return `${datePart}-${timePart}`;
}

function getEventImagePath(event) {
  if (!event || typeof event !== 'object') {
    return '';
  }

  if (event.image && String(event.image).trim() !== '') {
    return event.image;
  }

  return '';
}

function getEventShareButtonMarkup(event) {
  const shareUrl = buildEventShareUrl(event);
  if (!shareUrl) {
    return '';
  }

  return `<button type="button" class="news-link news-link--icon news-link--share event-share-button" data-event-share-url="${shareUrl}" aria-label="Veranstaltung teilen">${NEWS_LINK_ICONS.share}</button>`;
}

async function writeTextToClipboard(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const helperField = document.createElement('textarea');
  helperField.value = value;
  helperField.setAttribute('readonly', '');
  helperField.style.position = 'absolute';
  helperField.style.left = '-9999px';
  document.body.append(helperField);
  helperField.select();
  document.execCommand('copy');
  helperField.remove();
}

function showShareToast(message, type = 'success') {
  const toast = document.getElementById('share-toast') || document.createElement('div');
  if (!toast.id) {
    toast.id = 'share-toast';
    toast.className = 'share-toast';
    document.body.append(toast);
  }

  toast.textContent = message;
  toast.classList.toggle('share-toast--error', type === 'error');
  toast.classList.add('is-visible');

  if (showShareToast.hideTimerId) {
    window.clearTimeout(showShareToast.hideTimerId);
  }
  showShareToast.hideTimerId = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 5000);
}

function setupEventShareButtons() {
  if (setupEventShareButtons.isBound) {
    return;
  }

  setupEventShareButtons.isBound = true;
  document.addEventListener('click', async (event) => {
    const shareButton = event.target.closest('[data-event-share-url]');
    if (!shareButton) {
      return;
    }

    const shareUrl = shareButton.dataset.eventShareUrl;
    if (!shareUrl) {
      return;
    }

    try {
      await writeTextToClipboard(shareUrl);
      showShareToast('Link wurde in die Zwischenablage kopiert.');
    } catch (error) {
      showShareToast('Der Link konnte nicht kopiert werden.', 'error');
    }
  });
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
      return `${prince}<br>${princess}`;
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

function formatLightboxInlineText(value) {
  if (!value) {
    return '';
  }

  return String(value)
    .replace(/<br\s*\/?>/gi, ' und ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatTitledPairText(value, princeLabel, princessLabel) {
  if (!value) {
    return '';
  }

  const normalizedText = formatLightboxInlineText(value);
  if (!normalizedText) {
    return '';
  }

  if (/prinz/i.test(normalizedText)) {
    return normalizedText;
  }

  const pairParts = String(value)
    .split(/<br\s*\/?>/gi)
    .map((part) => part.trim())
    .filter(Boolean);

  if (pairParts.length >= 2) {
    return `${princeLabel} ${pairParts[0]} und ${princessLabel} ${pairParts[1]}`;
  }

  return normalizedText;
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
  const gallery = document.getElementById('royals-grid');

  if (!lightbox || !image || !details || !closeButton || !prevButton || !nextButton || !backdrop || !gallery) {
    return;
  }

  let currentIndex = 0;

  function setLightboxContent(index) {
    const safeIndex = ((index % royals.length) + royals.length) % royals.length;
    const pair = royals[safeIndex];
    currentIndex = safeIndex;

    image.src = pair.image || '';
    image.alt = pair.title || pair.session || 'Prinzenpaar';
    const sessionText = formatLightboxInlineText(pair.session);
    const yearText = formatLightboxInlineText(pair.year);
    const largePairText = formatTitledPairText(pair.largePair, 'Prinz', 'Prinzessin');
    const smallPairText = formatTitledPairText(pair.smallPair, 'Kinderprinz', 'Kinderprinzessin');

    const headingText = sessionText && yearText ? `${sessionText} (${yearText})` : sessionText || yearText;
    const detailParts = [headingText, largePairText, smallPairText].filter(Boolean);
    details.textContent = detailParts.join(' - ');
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

  gallery.addEventListener('click', (event) => {
    const item = event.target.closest('.royal-gallery-item');
    if (!item || !gallery.contains(item)) {
      return;
    }

    const itemIndex = Number(item.dataset.royalIndex || 0);
    openLightbox(itemIndex);
  });

  gallery.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const item = event.target.closest('.royal-gallery-item');
    if (!item || !gallery.contains(item)) {
      return;
    }

    event.preventDefault();
    const itemIndex = Number(item.dataset.royalIndex || 0);
    openLightbox(itemIndex);
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

function setupBoardCards() {
  const boardCards = Array.from(document.querySelectorAll('.board-card'));
  if (boardCards.length === 0) {
    return;
  }

  const isMobileViewport = () => window.matchMedia('(max-width: 960px)').matches;

  function closeAllBoardCards() {
    boardCards.forEach((card) => {
      card.classList.remove('is-open');
      const trigger = card.querySelector('.board-poster');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  boardCards.forEach((card) => {
    const trigger = card.querySelector('.board-poster');
    if (!trigger) return;

    trigger.addEventListener('click', (event) => {
      if (!isMobileViewport()) {
        return;
      }

      event.preventDefault();
      const isOpen = card.classList.contains('is-open');
      closeAllBoardCards();
      card.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  document.addEventListener('click', (event) => {
    if (!isMobileViewport()) {
      return;
    }
    if (event.target.closest('.board-card')) {
      return;
    }
    closeAllBoardCards();
  });

  window.addEventListener('resize', () => {
    if (!isMobileViewport()) {
      closeAllBoardCards();
    }
  });
}

function normalizeImagePathForSubpage(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') {
    return '';
  }

  if (imagePath.startsWith('./')) {
    return `../.${imagePath.slice(1)}`;
  }

  return imagePath;
}

function getNoticeDataPath(page) {
  const rootPrefix = getRootPrefix(page);
  return `${rootPrefix}src/data/header-notices.json`;
}

function normalizeNotices(rawEntries) {
  if (!Array.isArray(rawEntries)) {
    return [];
  }

  return rawEntries
    .filter((entry) => entry && typeof entry.text === 'string' && entry.text.trim() !== '' && isVisibleByWindow(entry))
    .map((entry) => {
      const countdownTarget = parseVisibilityTimestamp(entry.countdown);
      const deleteAt = parseVisibilityTimestamp(entry.deleteAt);
      const hasValidCountdown = Boolean(countdownTarget);
      if (hasValidCountdown && !deleteAt) {
        return null;
      }

      return {
        text: entry.text.trim(),
        countdownTarget: hasValidCountdown ? countdownTarget : null,
        deleteAt,
      };
    })
    .filter(Boolean);
}

function setNoticeTrackDuration(track, noticeCount) {
  const durationInSeconds = Math.max(18, noticeCount * 8);
  track.style.setProperty('--notice-duration', `${durationInSeconds}s`);
}

function renderNoticeEntry(entry) {
  const noticeEl = document.createElement('span');
  noticeEl.className = 'header-notice-entry';

  const textEl = document.createElement('span');
  textEl.className = 'header-notice-text';
  textEl.textContent = entry.text;
  noticeEl.append(textEl);

  if (entry.countdownTarget) {
    const countdownEl = document.createElement('span');
    countdownEl.className = 'header-notice-countdown';
    noticeEl.append(countdownEl);
    if (!Array.isArray(entry.countdownElements)) {
      entry.countdownElements = [];
    }
    entry.countdownElements.push(countdownEl);
  }

  return noticeEl;
}

async function setupHeaderNoticeBar(page) {
  const noticeBar = document.getElementById('header-notice-bar');
  const noticeTrack = document.getElementById('header-notice-track');
  if (!noticeBar || !noticeTrack) {
    return;
  }

  let rawEntries = [];
  try {
    rawEntries = await fetch(getNoticeDataPath(page)).then((response) => (response.ok ? response.json() : []));
  } catch (error) {
    rawEntries = [];
  }

  const notices = normalizeNotices(rawEntries);
  if (notices.length === 0) {
    noticeBar.hidden = true;
    return;
  }

  let activeNotices = notices;
  let countdownIntervalId = null;

  function renderNoticeTrack() {
    noticeTrack.innerHTML = '';
    if (activeNotices.length === 0) {
      noticeBar.hidden = true;
      return;
    }

    const viewport = noticeBar.querySelector('.header-notice-bar__viewport');
    const viewportWidth = viewport ? viewport.clientWidth : window.innerWidth;
    const minHalfWidth = viewportWidth + 60;
    let repeatsPerHalf = 1;
    const maxRepeatsPerHalf = 12;

    function renderHalf() {
      for (let repeatIndex = 0; repeatIndex < repeatsPerHalf; repeatIndex += 1) {
        activeNotices.forEach((entry) => {
          noticeTrack.append(renderNoticeEntry(entry));
        });
      }
    }

    activeNotices.forEach((entry) => {
      entry.countdownElements = [];
    });

    do {
      noticeTrack.innerHTML = '';
      activeNotices.forEach((entry) => {
        entry.countdownElements = [];
      });
      renderHalf();

      if (noticeTrack.scrollWidth >= minHalfWidth) {
        break;
      }
      repeatsPerHalf += 1;
    } while (repeatsPerHalf <= maxRepeatsPerHalf);

    renderHalf();

    const renderedEntriesCount = activeNotices.length * repeatsPerHalf * 2;
    setNoticeTrackDuration(noticeTrack, renderedEntriesCount);
    noticeBar.hidden = false;
  }

  function bindResizeHandler() {
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }
      resizeTimer = window.setTimeout(() => {
        renderNoticeTrack();
        refreshCountdownsAndPruneExpired();
      }, 120);
    });
  }

  function refreshCountdownsAndPruneExpired() {
    const now = new Date();

    const remainingNotices = activeNotices.filter((entry) => {
      if (entry.countdownTarget && now >= entry.countdownTarget) {
        return false;
      }
      return !entry.deleteAt || now < entry.deleteAt;
    });

    if (remainingNotices.length !== activeNotices.length) {
      activeNotices = remainingNotices;
      renderNoticeTrack();
    }

    activeNotices.forEach((entry) => {
      if (!entry.countdownTarget || !Array.isArray(entry.countdownElements)) {
        return;
      }
      const formatted = formatNoticeCountdown(entry.countdownTarget, now);
      entry.countdownElements.forEach((countdownElement) => {
        countdownElement.textContent = formatted ? `${formatted}` : '';
      });
    });

    if (activeNotices.length === 0 && countdownIntervalId) {
      window.clearInterval(countdownIntervalId);
      countdownIntervalId = null;
    }
  }

  renderNoticeTrack();
  refreshCountdownsAndPruneExpired();
  bindResizeHandler();
  if (activeNotices.some((entry) => entry.countdownTarget)) {
    countdownIntervalId = window.setInterval(refreshCountdownsAndPruneExpired, 1000);
  }
}

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
        ? `<div class="event-card-media"><img class="event-image" src="${imagePath}" alt="${event.title || 'Veranstaltung'}" loading="lazy" /></div>`
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
    vorstand.forEach((person, index) => {
      vorstandGrid.insertAdjacentHTML(
        'beforeend',
        `<article class="board-card">
          <button type="button" class="board-poster" aria-expanded="false" aria-controls="board-details-${index}">
            <img src="${person.image}" alt="${person.name}" loading="lazy" />
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
          <img class="elferrat-image" src="${imagePath}" alt="${member.name}" loading="lazy" />
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
      return `
        <article class="royal-gallery-item" aria-label="${pair.title || pair.session}" role="button" tabindex="0" data-royal-index="${index}">
          <img class="royal-gallery-image" src="${pair.image}" alt="${pair.title || pair.session}" loading="lazy" />
          ${createRoyalOverlayText(pair.session, 'top-left')}
          ${createRoyalOverlayText(pair.year, 'top-right')}
          ${createRoyalOverlayText(pair.largePair, 'bottom-left')}
          ${createRoyalOverlayText(pair.smallPair, 'bottom-right')}
        </article>
      `;
    },
  });

  setupRoyalsLightbox(normalizedRoyals);

  const sponsorsTrack = document.getElementById('sponsors-track');
  if (sponsorsTrack) {
    sponsors.forEach((sponsor) => {
      if (!sponsor?.src) return;
      sponsorsTrack.insertAdjacentHTML(
        'beforeend',
        `<figure class="sponsor-slide">
          <img class="sponsor-image" src="${sponsor.src}" alt="${sponsor.alt || 'Sponsor'}" loading="lazy" />
        </figure>`,
      );
    });
    setupSponsorsMarquee();
  }
}


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
    const description = entry.description ? `<p>${entry.description}</p>` : '';
    const label = entry.label || 'Download starten';
    downloadsContainer.insertAdjacentHTML(
      'beforeend',
      `<article class="card download-card">
        <h3>${entry.title}</h3>
        ${description}
        <a class="btn" href="${entry.file}" download>${label}</a>
      </article>`,
    );
  });
}

async function loadEventDetailContent() {
  const detailContainer = document.getElementById('event-detail-content');
  if (!detailContainer) {
    return;
  }

  const eventToken = decodeURIComponent(window.location.search.replace(/^\?/, '').trim());
  if (!eventToken) {
    detailContainer.innerHTML = '<p>Es wurde keine Veranstaltung ausgewählt.</p>';
    return;
  }

  let eventsRaw = [];
  try {
    eventsRaw = await fetch('../src/data/events.json').then((response) => (response.ok ? response.json() : []));
  } catch (error) {
    eventsRaw = [];
  }

  const events = Array.isArray(eventsRaw) ? eventsRaw : [];
  const matchingEvent = events.find((event) => getEventDetailToken(event) === eventToken);

  if (!matchingEvent) {
    document.title = 'SKV | Veranstaltungsdetails';
    detailContainer.innerHTML = '<p>Die gewünschte Veranstaltung wurde nicht gefunden.</p>';
    return;
  }

  document.title = `SKV | ${matchingEvent.title || 'Veranstaltungsdetails'}`;

  const detailImagePath = normalizeImagePathForSubpage(matchingEvent.image) || '../src/img/events/default.png';
  const imageMarkup = detailImagePath
    ? `<img class="event-detail-image" src="${detailImagePath}" alt="${matchingEvent.title || 'Veranstaltung'}" loading="lazy" />`
    : '';
  const eventLinksMarkup = getNewsLinksMarkup(matchingEvent);

  detailContainer.innerHTML = `
    <div class="event-detail-shell${imageMarkup ? '' : ' event-detail-shell--no-image'}">
      ${imageMarkup}
      <div class="event-detail-overlay">
        <h2>${matchingEvent.title || 'Veranstaltung'}</h2>
        ${getEventDetailsMarkup(matchingEvent)}
        ${getEventDescriptionMarkup(matchingEvent)}
        <div class="event-card-actions">
          ${eventLinksMarkup}
        </div>
      </div>
    </div>
  `;
  setupEventShareButtons();
}

async function loadLinktreeContent() {
  const linksContainer = document.getElementById('linktree-links');
  if (!linksContainer) {
    return;
  }

  const entries = await fetch('../src/data/linktree.json').then((r) => r.json());
  entries.forEach((entry) => {
    if (!entry?.url || !entry?.text) {
      return;
    }

    const iconKey = String(entry.icon || 'website').toLowerCase();
    const iconMarkup = LINKTREE_ICONS[iconKey] || LINKTREE_ICONS.website;
    const normalizedUrl = entry.url.startsWith('./') ? `../${entry.url.slice(2)}` : entry.url;
    const shouldOpenInNewTab = /^https?:\/\//i.test(normalizedUrl);
    const target = shouldOpenInNewTab ? ' target="_blank"' : '';
    const rel = shouldOpenInNewTab ? ' rel="noopener noreferrer"' : '';

    linksContainer.insertAdjacentHTML(
      'beforeend',
      `<a class="linktree-link" href="${normalizedUrl}"${target}${rel}>
        <span class="linktree-link-icon">${iconMarkup}</span>
        <span class="linktree-link-text">${entry.text}</span>
      </a>`,
    );
  });
}

(async function init() {
  const page = document.body.dataset.page;

  if (page === 'home') {
    await loadComponent('header-component', './components/header.html');
    await loadComponent('footer-component', './components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    setupMobileMenu();
    setupHeaderSmoothScroll();
    await loadHomeGallery();
    setupHeroCarousel();
    await loadHomeContent();
    return;
  }

  if (page === 'linktree') {
    await loadComponent('header-component', '../components/header.html');
    await loadComponent('footer-component', '../components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    setupMobileMenu();
    setupHeaderSmoothScroll();
    await loadLinktreeContent();
    return;
  }

  if (page === 'legal') {
    await loadComponent('header-component', '../../components/header.html');
    await loadComponent('footer-component', '../../components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    setupMobileMenu();
    setupHeaderSmoothScroll();
    return;
  }

  if (page === 'downloads') {
    await loadComponent('header-component', '../components/header.html');
    await loadComponent('footer-component', '../components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    setupMobileMenu();
    setupHeaderSmoothScroll();
    await loadDownloadsContent();
    return;
  }

  if (page === 'events-detail') {
    await loadComponent('header-component', '../components/header.html');
    await loadComponent('footer-component', '../components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    setupMobileMenu();
    setupHeaderSmoothScroll();
    await loadEventDetailContent();
    return;
  }

  await loadComponent('header-component', '../components/header.html');
  await loadComponent('footer-component', '../components/footer.html');
  normalizeComponentLinks(page);
  await setupHeaderNoticeBar(page);
  setupMobileMenu();
  setupHeaderSmoothScroll();
})();
