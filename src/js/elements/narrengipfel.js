/* Die Seitenstruktur und Elementvorlagen stehen in narrengipfel/index.html. */
async function loadNarrengipfelContent() {
  const main = document.querySelector('.sng-page');
  if (!main) return;
  const asset = path => path.startsWith('/') ? `..${path}` : path;
  const valueAt = (data, path) => path === '.' ? data : path.split('.').reduce((value, key) => value?.[key], data);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
  const fill = (scope, data) => {
    scope.querySelectorAll('[data-text]').forEach(element => {
      element.textContent = valueAt(data, element.dataset.text) ?? '';
    });
    scope.querySelectorAll('[data-image]').forEach(element => {
      const image = element.dataset.image ? valueAt(data, element.dataset.image) : data;
      element.src = asset(image.src);
      element.alt = image.alt;
    });
    scope.querySelectorAll('template[data-repeat]').forEach(template => {
      const items = valueAt(data, template.dataset.repeat) || [];
      const fragments = items.map(item => {
        const fragment = template.content.cloneNode(true);
        fill(fragment, item);
        return fragment;
      });
      template.replaceWith(...fragments);
    });
  };
  const clone = id => main.querySelector(`#${id}`).content.cloneNode(true);
  try {
    const response = await fetch('../src/data/narrengipfel.json');
    if (!response.ok) throw new Error('Narrengipfel-Inhalte konnten nicht geladen werden.');
    const content = await response.json();
    const next = content.next;
    const showNext = Boolean(next) && isVisibleByWindow(next);
    const date = next?.date ? new Date(`${next.date}T12:00:00`) : null;
    fill(main, {
      ...content,
      weekday: date?.toLocaleDateString('de-DE', { weekday: 'long' }),
      day: date?.getDate().toString().padStart(2, '0'),
      month: date?.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }),
    });
    const subject = typeof content.emailSubject === 'string' ? content.emailSubject.trim() : '';
    main.querySelectorAll('[data-mail]').forEach(link => {
      link.href = `mailto:${content.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
    });
    main.querySelector('[data-next]').hidden = !showNext;
    main.querySelector('[data-join]').hidden = showNext;
    const details = main.querySelector('[data-details]');
    details.hidden = !next?.detailsUrl;
    if (next?.detailsUrl) details.href = asset(next.detailsUrl);
    if (date) {
      const time = main.querySelector('[data-date]');
      time.dateTime = next.date;
      time.setAttribute('aria-label', date.toLocaleDateString('de-DE', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      }));
    }
    const quotes = (Array.isArray(content.review.quotes) ? content.review.quotes : [])
      .filter(quote => typeof quote?.text === 'string' && quote.text.trim() && typeof quote?.club === 'string' && quote.club.trim());
    main.querySelector('.sng-guest-quotes').hidden = !quotes.length;
    quotes.forEach(quote => {
      const fragment = clone('sng-quote-template');
      fill(fragment, quote);
      const avatar = fragment.querySelector('[data-quote-avatar]');
      avatar.outerHTML = createNarrengipfelQuoteAvatar(quote, escape, asset);
      main.querySelector('#guest-quotes-slides').append(fragment);
    });
    const video = content.review.video;
    main.querySelector('.sng-review-layout').classList.toggle('sng-review-without-video', !video?.src);
    if (video?.src) {
      const instagram = video.provider === 'instagram' && /^https:\/\/(?:www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/.test(video.src);
      const fragment = clone(instagram ? 'sng-instagram-template' : 'sng-video-template');
      fill(fragment, video);
      if (instagram) {
        const figure = fragment.querySelector('figure');
        figure.setAttribute('aria-label', video.title);
        figure.dataset.instagramUrl = video.src;
        figure.querySelector(':scope > a').href = video.src;
      } else {
        const player = fragment.querySelector('video');
        player.setAttribute('aria-label', video.title);
        fragment.querySelector('[data-video-source]').src = asset(video.src);
        fragment.querySelector('figcaption').hidden = !video.caption;
        if (video.caption) player.setAttribute('aria-describedby', 'sng-video-caption');
      }
      main.querySelector('[data-video-slot]').replaceWith(fragment);
    }
    applyNarrengipfelImageLabels(content);
    document.title = `${content.title} | SKV`;
    setupNarrengipfelQuotes();
    setupNarrengipfelInstagram();
    setupNarrengipfelVideo();
  } catch (error) {
    console.error(error);
    const message = document.createElement('p');
    message.className = 'container';
    message.setAttribute('role', 'alert');
    message.textContent = 'Die Inhalte konnten nicht geladen werden. Bitte versucht es später erneut.';
    main.replaceChildren(message);
  }
}

// Geschlossene Farbliste: Farbnamen und Hexwerte, keine beliebigen CSS-Ausdrücke.
const NARRENGIPFEL_COLOR_NAMES = new Set(('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgrey darkgreen darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgrey lightgreen lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' '));

function getNarrengipfelQuoteColors(quote) {
  return (Array.isArray(quote.colors) ? quote.colors : [])
    .filter((color) => typeof color === 'string')
    .map((color) => color.trim())
    .filter((color) => /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) || NARRENGIPFEL_COLOR_NAMES.has(color.toLowerCase()))
    .slice(0, 3);
}

function getNarrengipfelQuoteBackground(quote) {
  const colors = getNarrengipfelQuoteColors(quote);
  if (colors.length === 0) return '';
  return colors.length === 1 ? colors[0] : `linear-gradient(135deg, ${colors.join(', ')})`;
}

function createNarrengipfelQuoteAvatar(quote, escape, asset) {
  const logo = typeof quote.logo === 'string' ? quote.logo.trim() : '';
  const border = quote.border === true;
  const borderClass = border ? ' sng-quote-avatar--border' : '';
  const borderStyle = border ? `--sng-quote-border: ${getNarrengipfelQuoteColors(quote)[0] || 'var(--skv-primary)'};` : '';
  // Im Bildmodus dienen die Farben nur dem optionalen Rand, nicht dem Hintergrund.
  if (logo) {
    const valid = /^(?:\/(?!\/)|\.\.?\/)/.test(logo) || /^https:\/\//i.test(logo);
    return `<span class="sng-quote-avatar sng-quote-avatar--logo${borderClass}"${borderStyle ? ` style="${borderStyle}"` : ''} ${createAiLabelMarkup(quote, '../') ? '' : 'aria-hidden="true"'}>${valid ? `<img src="${escape(asset(logo))}" alt="" width="64" height="64" loading="lazy" referrerpolicy="no-referrer">${createAiLabelMarkup(quote, '../')}` : '<span title="Bildpfad ungültig">–</span>'}</span>`;
  }
  const background = getNarrengipfelQuoteBackground(quote);
  const style = `${borderStyle}${background ? `--sng-quote-background: ${background};` : ''}`;
  return `<span class="sng-quote-avatar${background ? ' sng-quote-avatar--colors' : ''}${borderClass}"${style ? ` style="${style}"` : ''} aria-hidden="true"><span class="sng-quote-initials">${escape(getNarrengipfelQuoteInitials(quote))}</span></span>`;
}

function getNarrengipfelQuoteInitials(quote) {
  if (typeof quote.initials === 'string' && quote.initials.trim()) return quote.initials.trim();
  return quote.club.trim().split(/\s+/).slice(0, 2).map((word) => Array.from(word)[0]).join('').toLocaleUpperCase('de-DE');
}

// Die Navigation wird nach dem Rendern der Zitate aktiviert.
function setupNarrengipfelQuotes() {
  const section = document.querySelector('.sng-guest-quotes');
  if (!section || section.dataset.carouselReady) return;
  section.querySelectorAll('.sng-quote-avatar img:not(.ai-label)').forEach((image) => {
    if (image.dataset.fallbackReady) return;
    image.dataset.fallbackReady = 'true';
    const update = () => {
      const failed = image.complete && image.naturalWidth === 0;
      image.hidden = failed;
      image.parentElement.classList.toggle('sng-quote-avatar--unavailable', failed);
      if (failed) image.parentElement.title = 'Bild nicht verfügbar';
      else image.parentElement.removeAttribute('title');
    };
    image.addEventListener('load', update);
    image.addEventListener('error', () => {
      image.hidden = true;
      image.parentElement.classList.add('sng-quote-avatar--unavailable');
      image.parentElement.title = 'Bild nicht verfügbar';
    });
    if (image.complete) update();
  });
  const quotes = Array.from(section.querySelectorAll('.sng-quote'));
  if (quotes.length < 2) return;
  const controls = section.querySelector('.sng-quote-controls');
  const position = section.querySelector('.sng-quote-position');
  const status = section.querySelector('.sng-quote-status');
  let index = 0;
  const show = (next, announce = true) => {
    index = (next + quotes.length) % quotes.length;
    quotes.forEach((quote, quoteIndex) => { quote.hidden = quoteIndex !== index; });
    position.textContent = `${index + 1} / ${quotes.length}`;
    if (announce) status.textContent = `Zitat ${index + 1} von ${quotes.length}: ${quotes[index].querySelector('blockquote p').textContent.trim()} — ${quotes[index].querySelector('figcaption').textContent.trim()}`;
  };
  section.querySelector('.sng-quote-prev').addEventListener('click', () => show(index - 1));
  section.querySelector('.sng-quote-next').addEventListener('click', () => show(index + 1));
  section.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(index + (event.key === 'ArrowRight' ? 1 : -1));
  });
  section.dataset.carouselReady = 'true';
  section.setAttribute('aria-roledescription', 'Karussell');
  show(0, false);
  controls.hidden = false;
}

function setupNarrengipfelInstagram() {
  document.querySelectorAll('.sng-instagram-figure[data-instagram-url]').forEach((figure) => {
    if (figure.dataset.consentReady) return;
    const reel = figure.dataset.instagramUrl.match(/^https:\/\/(?:www\.)?instagram\.com\/reel\/([A-Za-z0-9_-]+)\/?(?:\?.*)?$/);
    if (!reel) return;
    const consent = figure.querySelector('.sng-instagram-consent');
    const load = figure.querySelector('.sng-instagram-load');
    const remove = figure.querySelector('.sng-instagram-remove');
    const embed = figure.querySelector('.sng-instagram-embed');
    const status = figure.querySelector('.sng-instagram-status');
    figure.dataset.consentReady = 'true';
    load.hidden = false;
    let timeout;
    let observer;
    let script;
    let active = false;
    let generation = 0;
    const directLink = figure.querySelector(':scope > a');
    load.addEventListener('click', () => {
      if (active) return;
      active = true;
      const currentGeneration = ++generation;
      const isCurrent = () => active && generation === currentGeneration;
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'instagram-media';
      blockquote.dataset.instgrmPermalink = `https://www.instagram.com/reel/${reel[1]}/`;
      blockquote.dataset.instgrmVersion = '14';
      const link = document.createElement('a');
      link.href = figure.dataset.instagramUrl;
      link.textContent = 'Video auf Instagram ansehen ↗';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      blockquote.append(link);
      status.textContent = 'Instagram wird geladen …';
      consent.hidden = true;
      embed.hidden = false;
      remove.hidden = false;
      directLink.hidden = true;
      figure.classList.add('sng-instagram-active');
      embed.replaceChildren(blockquote);
      const failed = () => {
        if (!isCurrent()) return;
        clearTimeout(timeout);
        status.textContent = 'Instagram konnte nicht geladen werden. Nutzt den direkten Link.';
        directLink.hidden = false;
      };
      observer = new MutationObserver(() => {
        const frame = embed.querySelector('iframe');
        if (!isCurrent() || !frame) return;
        observer.disconnect();
        frame.title = figure.getAttribute('aria-label') || 'Instagram-Rückblick';
        frame.addEventListener('load', () => {
          if (!isCurrent()) return;
          clearTimeout(timeout);
          status.textContent = '';
        }, { once: true });
        frame.addEventListener('error', failed, { once: true });
      });
      observer.observe(embed, { childList: true, subtree: true });
      timeout = setTimeout(() => {
        if (!isCurrent()) return;
        status.textContent = 'Instagram braucht länger. Ihr könnt das Video auch direkt ansehen.';
        directLink.hidden = false;
      }, 15000);
      script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.dataset.sngInstagram = '';
      script.addEventListener('load', () => {
        if (!isCurrent()) return;
        if (window.instgrm?.Embeds) window.instgrm.Embeds.process();
        else failed();
      }, { once: true });
      script.addEventListener('error', failed, { once: true });
      document.head.append(script);
      remove.focus();
    });
    remove.addEventListener('click', () => {
      active = false;
      generation += 1;
      clearTimeout(timeout);
      observer?.disconnect();
      script?.remove();
      script = null;
      embed.replaceChildren();
      embed.hidden = true;
      remove.hidden = true;
      consent.hidden = false;
      directLink.hidden = false;
      figure.classList.remove('sng-instagram-active');
      status.textContent = '';
      load.focus();
    });
  });
}

let cleanupNarrengipfelVideo = null;

function setupNarrengipfelVideo() {
  cleanupNarrengipfelVideo?.();
  const video = document.querySelector('.sng-review-video');
  if (!video) return;
  const frame = video.closest('.sng-video-frame');
  const start = frame.querySelector('.sng-video-start');
  const startLabel = frame.querySelector('.sng-video-start-label');
  const toggle = frame.querySelector('.sng-video-toggle');
  const sound = frame.querySelector('.sng-video-sound');
  const progress = frame.querySelector('input[type="range"]');
  const time = frame.querySelector('.sng-video-time');
  const status = frame.querySelector('.sng-video-status');
  const listeners = new AbortController();
  const on = (target, event, handler) => target.addEventListener(event, handler, { signal: listeners.signal });
  video.controls = false;
  video.muted = false;
  video.defaultMuted = false;
  video.loop = true;
  let visible = false;
  let manuallyPaused = false;
  let pendingPlay = false;
  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const syncControls = () => {
    toggle.setAttribute('aria-label', video.paused ? 'Video abspielen' : 'Video pausieren');
    toggle.firstElementChild.textContent = video.paused ? '▶' : 'Ⅱ';
    start.hidden = !video.paused;
    sound.setAttribute('aria-label', video.muted ? 'Ton einschalten' : 'Ton ausschalten');
    sound.setAttribute('aria-pressed', String(video.muted));
    sound.querySelector('.sng-sound-waves').toggleAttribute('hidden', video.muted);
    sound.querySelector('.sng-sound-off').toggleAttribute('hidden', !video.muted);
  };
  const requestPlay = async () => {
    if (pendingPlay || !visible || document.hidden) return;
    pendingPlay = true;
    status.textContent = '';
    try {
      await video.play();
      if (!visible || document.hidden || manuallyPaused) video.pause();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        // Autoplay mit Ton wird häufig blockiert. Dann ohne Klick stumm starten.
        video.muted = true;
        try {
          await video.play();
          if (!visible || document.hidden || manuallyPaused) video.pause();
        } catch (fallbackError) {
          startLabel.textContent = 'Video abspielen';
          if (fallbackError.name !== 'NotAllowedError' && fallbackError.name !== 'AbortError') {
            status.textContent = 'Das Video konnte nicht geladen werden. Bitte versucht es erneut.';
          }
        }
      } else if (error.name !== 'AbortError') {
        status.textContent = 'Das Video konnte nicht geladen werden. Bitte versucht es erneut.';
      }
      syncControls();
    } finally {
      pendingPlay = false;
    }
  };
  const updatePlayback = () => {
    if (visible && !document.hidden && !manuallyPaused) requestPlay();
    else video.pause();
  };
  const playFromButton = () => {
    manuallyPaused = false;
    requestPlay();
  };
  on(start, 'click', playFromButton);
  on(toggle, 'click', () => {
    if (video.paused) playFromButton();
    else { manuallyPaused = true; video.pause(); }
  });
  on(sound, 'click', () => { video.muted = !video.muted; syncControls(); });
  on(video, 'volumechange', syncControls);
  on(video, 'play', () => {
    if (!visible || document.hidden) video.pause();
    syncControls();
  });
  on(video, 'pause', syncControls);
  const syncProgress = () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    progress.disabled = duration <= 0;
    progress.max = String(duration || 100);
    progress.value = String(video.currentTime);
    progress.setAttribute('aria-valuetext', `${formatTime(video.currentTime)} von ${formatTime(duration)}`);
    time.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
  };
  on(video, 'loadedmetadata', syncProgress);
  on(video, 'durationchange', syncProgress);
  on(video, 'timeupdate', syncProgress);
  on(progress, 'input', () => { video.currentTime = Number(progress.value); });
  on(frame, 'contextmenu', (event) => event.preventDefault());
  on(video, 'dragstart', (event) => event.preventDefault());
  on(document, 'visibilitychange', updatePlayback);
  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.01;
      if (!visible) manuallyPaused = false;
      updatePlayback();
    }, { threshold: 0.01 });
    observer.observe(video);
  } else {
    const checkVisibility = () => {
      const rect = video.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!visible) manuallyPaused = false;
      updatePlayback();
    };
    on(window, 'scroll', checkVisibility);
    on(window, 'resize', checkVisibility);
    checkVisibility();
  }
  syncControls();
  syncProgress();
  cleanupNarrengipfelVideo = () => {
    observer?.disconnect();
    listeners.abort();
    video.pause();
  };
}

function applyNarrengipfelImageLabels(content, assetRoot = '../') {
  const media = content.media || {};
  const review = content.review || {};
  const quotes = (Array.isArray(review.quotes) ? review.quotes : []).filter(item => typeof item?.text === 'string' && item.text.trim() && typeof item?.club === 'string' && item.club.trim());
  const items = [
    [document.querySelector('.sng-logo'), content.logo],
    [document.querySelector('.sng-hero-image'), media.hero],
    [document.querySelector('.sng-stage-photo img'), media.stage],
    ...Array.from(document.querySelectorAll('.sng-gallery > figure')).map((figure, index) => [figure.querySelector('img'), media.gallery?.[index]]),
    ...Array.from(document.querySelectorAll('.sng-quote')).map((quote, index) => [quote.querySelector('.sng-quote-avatar img'), quotes[index]]),
  ];
  for (const [image, data] of items) {
    if (!image?.parentElement || !data) continue;
    const parent = image.parentElement;
    parent.querySelector(':scope > .sng-image-ai-label')?.remove();
    const ki = data.ki === true;
    const partial = data.teilweiseKi === true;
    if (ki === partial || !['black', 'white'].includes(data.theme)) continue;
    image.draggable = false;
    image.oncontextmenu = event => event.preventDefault();
    image.ondragstart = event => event.preventDefault();
    // Respect labels supplied by newer versions of the original website.
    if (parent.querySelector(':scope > .ai-label, :scope > .image-ai-label')) continue;
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    const label = document.createElement('img');
    label.className = 'ai-label sng-image-ai-label';
    label.alt = ki ? 'KI-generiert' : 'Teilweise KI-generiert';
    label.src = new URL(`src/img/ki_labels/${ki ? 'ki' : 'teilweise_ki'}_${data.theme}.png`, new URL(assetRoot, document.baseURI)).href;
    label.draggable = false;
    parent.append(label);
  }
}
