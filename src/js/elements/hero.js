/*
 * Logik für die Hero-Galerie der Startseite.
 * Lädt Bilder und Videos aus der JSON-Datenquelle und steuert den Medienwechsel.
 */

function setupHeroCarousel() {
  const slides = Array.from(document.querySelectorAll('.hero-slide-wrapper'));
  if (slides.length === 0) return;

  let index = 0;
  let activeTextPanel;
  function showSlide() {
    const slide = slides[index];
    const video = slide.querySelector('video');
    slide.classList.add('active');
    slide.setAttribute('aria-hidden', 'false');
    function refreshText() {
      const panel = slide.getHeroTextPanel();
      panel.updateCountdown?.();
      if (panel === activeTextPanel) return;
      if (activeTextPanel) {
        activeTextPanel.classList.remove('active');
        activeTextPanel.setAttribute('aria-hidden', 'true');
      }
      panel.classList.add('active');
      panel.setAttribute('aria-hidden', 'false');
      activeTextPanel = panel;
    }
    refreshText();
    let finished = false;
    let timer;
    let countdownTimer;
    if (slide.heroHasCountdown) countdownTimer = setInterval(refreshText, 1000);

    function nextSlide() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      clearInterval(countdownTimer);
      if (video) {
        video.removeEventListener('ended', nextSlide);
        video.removeEventListener('error', skipUnavailableVideo);
        video.pause();
      }
      slide.classList.remove('active');
      slide.setAttribute('aria-hidden', 'true');
      index = (index + 1) % slides.length;
      showSlide();
    }

    function skipUnavailableVideo() {
      if (finished) return;
      clearTimeout(timer);
      timer = setTimeout(nextSlide, 5000);
    }

    if (video) {
      video.currentTime = 0;
      video.addEventListener('ended', nextSlide);
      video.addEventListener('error', skipUnavailableVideo);
      if (video.error) {
        skipUnavailableVideo();
      } else {
        video.play().catch(skipUnavailableVideo);
      }
    } else if (slides.length > 1) {
      timer = setTimeout(nextSlide, 5000);
    }
  }

  slides.forEach((slide) => {
    slide.classList.remove('active');
    slide.setAttribute('aria-hidden', 'true');
  });
  showSlide();
}

const HERO_TEXT_FORMATS = {
  'headline-subline': ['headline', 'subline'],
  'topline-headline': ['topline', 'headline'],
  'topline-headline-subline': ['topline', 'headline', 'subline'],
  'countdown-subline': ['countdown', 'subline'],
  'topline-countdown': ['topline', 'countdown'],
  'topline-countdown-subline': ['topline', 'countdown', 'subline'],
};

function getHeroCountdownParts(target, now = Date.now()) {
  const match = typeof target === 'string' && target.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2}):(\d{2})$/);
  if (!match) return null;
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day, hour, minute);
  // Reject impossible dates instead of silently rolling into the next month.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 ||
      date.getDate() !== day || date.getHours() !== hour || date.getMinutes() !== minute) return null;
  const remaining = Math.max(0, Math.ceil((date.getTime() - now) / 1000));
  return [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60, remaining % 60];
}

function createHeroTextPanel(text) {
  const panel = document.createElement('div');
  panel.className = 'hero-text-panel';
  panel.setAttribute('aria-hidden', 'true');
  const box = document.createElement('div');
  box.className = 'hero-text-box';
  const content = {
    topline: text?.topline ?? text?.eyebrow,
    headline: text?.headline ?? text?.title,
    subline: text?.subline ?? text?.text,
  };
  const format = Object.hasOwn(HERO_TEXT_FORMATS, text?.format) ? text.format : 'headline-subline';
  panel.dataset.format = format;
  for (const key of HERO_TEXT_FORMATS[format]) {
    if (key === 'countdown') {
      const countdown = document.createElement('div');
      countdown.className = 'hero-countdown';
      countdown.setAttribute('role', 'timer');
      countdown.setAttribute('aria-live', 'off');
      const labels = ['Tage', 'Stunden', 'Minuten', 'Sekunden'];
      const values = labels.map((label) => {
        const unit = document.createElement('span');
        unit.className = 'hero-countdown-unit';
        unit.setAttribute('aria-hidden', 'true');
        const value = document.createElement('span');
        value.className = 'hero-countdown-value';
        const caption = document.createElement('span');
        caption.className = 'hero-countdown-label';
        caption.textContent = label;
        unit.append(value, caption);
        countdown.append(unit);
        return value;
      });
      panel.updateCountdown = () => {
        const parts = getHeroCountdownParts(text?.countdown);
        if (!parts) {
          countdown.textContent = 'Countdown nicht verfügbar';
          countdown.setAttribute('aria-label', 'Countdown nicht verfügbar');
          return;
        }
        values.forEach((value, index) => { value.textContent = String(parts[index]).padStart(2, '0'); });
        countdown.setAttribute('aria-label', parts.map((value, index) => `${value} ${labels[index]}`).join(', '));
      };
      panel.updateCountdown();
      box.append(countdown);
      continue;
    }
    if (typeof content[key] !== 'string' || !content[key].trim()) continue;
    const element = document.createElement(key === 'headline' ? 'h1' : 'p');
    element.className = `hero-${key}`;
    element.textContent = content[key];
    box.append(element);
  }
  if (box.childElementCount) panel.append(box);
  return panel;
}

function resolveHeroText(text, textById) {
  const visited = new Set();
  let current = text;
  while (current && HERO_TEXT_FORMATS[current.format]?.includes('countdown')) {
    if (visited.has(current)) return text;
    visited.add(current);
    const parts = getHeroCountdownParts(current.countdown);
    if (!parts || parts.some((value) => value > 0)) break;
    const replacement = textById.get(current.text_id);
    if (!replacement) break;
    current = replacement;
  }
  return current;
}

function getHeroTextKey(text) {
  const format = Object.hasOwn(HERO_TEXT_FORMATS, text?.format) ? text.format : 'headline-subline';
  const content = {
    topline: text?.topline ?? text?.eyebrow,
    headline: text?.headline ?? text?.title,
    subline: text?.subline ?? text?.text,
    countdown: text?.countdown,
  };
  return JSON.stringify([format, ...HERO_TEXT_FORMATS[format].map((key) =>
    typeof content[key] === 'string' && content[key].trim() ? content[key] : '')]);
}

async function loadHomeGallery() {
  const galleryContainer = document.getElementById('home-gallery-slides');
  if (!galleryContainer) return;

  const [galleryItems, texts] = await Promise.all([
    fetch('./src/data/gallerys/home-gallery.json').then((response) => response.json()),
    fetch('./src/data/home-gallery-texts.json')
      .then((response) => response.ok ? response.json() : [])
      .catch(() => []),
  ]);
  if (!Array.isArray(galleryItems) || galleryItems.length === 0) {
    return;
  }

  const textById = new Map((Array.isArray(texts) ? texts : [])
    .filter((text) => text && typeof text.id === 'string')
    .map((text) => [text.id, text]));
  const content = document.getElementById('home-gallery-content');
  const fallback = {
    headline: content?.querySelector('h1')?.textContent || '',
    subline: content?.querySelector('.hero-subline')?.textContent || '',
  };
  const panels = new Map();
  function attachText(slide, item) {
    const text = item.textId === null ? null : textById.get(item.textId || 'welcome') || textById.get('welcome') || fallback;
    slide.heroHasCountdown = HERO_TEXT_FORMATS[text?.format]?.includes('countdown');
    slide.getHeroTextPanel = () => {
      const resolved = resolveHeroText(text, textById);
      const key = getHeroTextKey(resolved);
      if (!panels.has(key)) {
        const panel = createHeroTextPanel(resolved);
        panels.set(key, panel);
        content?.append(panel);
      }
      return panels.get(key);
    };
    slide.getHeroTextPanel();
  }

  galleryItems.forEach((item) => {
    if (item?.video?.src) {
      const media = normalizeImage(item.video);
      const altText = item.alt || 'Video aus der Home-Gallery';
      const wrapper = document.createElement('div');
      wrapper.className = `hero-slide-wrapper media-protected${media.ki || media.teilweiseKi ? ' ai-protected-media' : ''}`;
      const video = document.createElement('video');
      video.className = 'hero-slide';
      video.setAttribute('aria-label', altText);
      video.textContent = altText;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.src = item.video.src;
      if (item.video.poster) video.poster = item.video.poster;
      wrapper.append(video);
      wrapper.insertAdjacentHTML('beforeend', createAiLabelMarkup(media));
      galleryContainer.append(wrapper);
      attachText(wrapper, item);
      return;
    }

    const image = normalizeImage(item?.image);
    if (!image.src) {
      return;
    }

    const altText = item.alt || 'Bild aus der Home-Gallery';
    galleryContainer.insertAdjacentHTML(
      'beforeend',
      createImageMarkup(image, altText, 'hero-slide', { wrapperClass: 'hero-slide-wrapper' }),
    );
    attachText(galleryContainer.lastElementChild, item);
  });
  if (content && panels.size) content.replaceChildren(...panels.values());
}
