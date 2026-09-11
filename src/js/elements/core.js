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


function normalizeImage(image) {
  if (!image || typeof image !== 'object') {
    return { src: '', ki: false, teilweiseKi: false, theme: '' };
  }

  const ki = image.ki === true;
  const teilweiseKi = image.teilweiseKi === true;
  const theme = image.theme === 'black' || image.theme === 'white' ? image.theme : '';
  const hasValidLabel = Boolean(theme) && ki !== teilweiseKi && (ki || teilweiseKi);

  return {
    src: typeof image.src === 'string' ? image.src.trim() : '',
    ki: hasValidLabel && ki,
    teilweiseKi: hasValidLabel && teilweiseKi,
    theme,
  };
}

function createImageMarkup(imageData, alt, imageClass, options = {}) {
  const image = normalizeImage(imageData);
  if (!image.src) return '';

  const { wrapperClass = '', pathPrefix = './' } = options;
  const protectedClass = ` media-protected${image.ki || image.teilweiseKi ? ' ai-protected-media' : ''}`;
  const labelName = image.ki ? 'ki' : image.teilweiseKi ? 'teilweise_ki' : '';
  const labelMarkup = labelName
    ? `<img class="ai-label" src="${pathPrefix}src/img/ki_labels/${labelName}_${image.theme}.png" alt="${image.ki ? 'KI-generiert' : 'Teilweise KI-generiert'}" draggable="false" />`
    : '';

  return `<span class="image-with-label ${wrapperClass}${protectedClass}">
    <img class="${imageClass}" src="${image.src}" alt="${alt}" loading="lazy" draggable="false" />
    ${labelMarkup}
  </span>`;
}

function setupProtectedImages() {
  const protectImageElement = (image) => {
    if (!(image instanceof HTMLImageElement)) return;
    image.setAttribute('draggable', 'false');
    image.classList.add('media-protected-image');
  };

  document.querySelectorAll('img').forEach(protectImageElement);
  document.addEventListener('load', (event) => {
    protectImageElement(event.target);
  }, true);

  document.addEventListener('contextmenu', (event) => {
    if (event.target.closest('img, .media-protected, .ai-label')) event.preventDefault();
  });
  document.addEventListener('dragstart', (event) => {
    if (event.target.closest('img, .media-protected, .ai-label')) event.preventDefault();
  });
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

function normalizeImagePathForSubpage(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') {
    return '';
  }

  if (imagePath.startsWith('./')) {
    return `../.${imagePath.slice(1)}`;
  }

  return imagePath;
}


