/* Narrengipfel-Inhalte: JSON laden wie bei Veranstaltungen und Vereinsbereichen. */
async function loadNarrengipfelContent() {
  const main = document.querySelector('.sng-page');
  if (!main) return;
  const root = '../';
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
  const paragraphs = (values) => values.map((value) => `<p>${escape(value)}</p>`).join('');
  const asset = (path) => path.startsWith('/') ? `${root}${path.slice(1)}` : path;
  try {
    const response = await fetch(`${root}src/data/narrengipfel.json`);
    if (!response.ok) throw new Error('Narrengipfel-Inhalte konnten nicht geladen werden.');
    const content = await response.json();
    const imageFigure = (image, className = '') => `<figure class="sng-photo ${className}">
      <img src="${escape(asset(image.src))}" alt="${escape(image.alt)}" loading="lazy" decoding="async" width="1200" height="900">
      <figcaption>${escape(image.caption)}</figcaption>
    </figure>`;
    const video = content.review.video;
    const reel = video?.provider === 'instagram' && video.src?.match(/^https:\/\/(?:www\.)?instagram\.com\/reel\/([A-Za-z0-9_-]+)\/?(?:\?.*)?$/);
    const instagramVideo = reel ? createNarrengipfelInstagramMarkup(video, escape) : '';
    const quotes = (Array.isArray(content.review.quotes) ? content.review.quotes : [])
      .filter((quote) => typeof quote?.text === 'string' && quote.text.trim() && typeof quote?.club === 'string' && quote.club.trim());
    const quoteMarkup = quotes.length ? `<section class="sng-guest-quotes" aria-labelledby="guest-quotes-title">
      <h3 id="guest-quotes-title">Stimmen unserer Gastvereine</h3>
      <div id="guest-quotes-slides" class="sng-quotes-grid">${quotes.map((quote) => `<figure class="sng-quote">
        ${createNarrengipfelQuoteAvatar(quote, escape, asset)}
        <blockquote><span class="sng-quote-mark" aria-hidden="true"><svg viewBox="0 0 100 80" preserveAspectRatio="xMaxYMid" focusable="false"><path d="M5 8h35v34c0 20-10 30-28 34L7 64c12-4 18-10 19-20H5Zm50 0h35v34c0 20-10 30-28 34l-5-12c12-4 18-10 19-20H55Z"/></svg></span><p>${escape(quote.text)}</p></blockquote>
        <figcaption>${escape(quote.club)}</figcaption>
      </figure>`).join('')}</div>
      <div class="sng-quote-controls" hidden>
        <button type="button" class="sng-quote-prev" aria-label="Vorheriges Zitat" aria-controls="guest-quotes-slides"><span aria-hidden="true">←</span></button>
        <span class="sng-quote-position" aria-hidden="true"></span>
        <button type="button" class="sng-quote-next" aria-label="Nächstes Zitat" aria-controls="guest-quotes-slides"><span aria-hidden="true">→</span></button>
      </div>
      <p class="sng-sr-only sng-quote-status" role="status" aria-live="polite" aria-atomic="true"></p>
    </section>` : '';
    const next = content.next;
    const date = next?.date ? new Date(`${next.date}T12:00:00`) : null;
    const dateLabel = date?.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }) || '';
    const weekday = date?.toLocaleDateString('de-DE', { weekday: 'long' }) || '';
    const showNext = Boolean(next) && isVisibleByWindow(next);
    const monthLabel = date?.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }) || '';
    const faq = `${root}faq/narrengipfel/`;
    const mail = `mailto:${content.email}?subject=Teilnahme%20am%20Sandersdorfer%20Narrengipfel`;
    main.innerHTML = `
      <section class="section section-blue sng-hero">
        <img class="sng-hero-image" src="${escape(asset(content.media.hero.src))}" alt="${escape(content.media.hero.alt)}" width="1824" height="1368" fetchpriority="high">
        <div class="container">
          <div class="sng-hero-layout">
            <div class="sng-hero-copy">
              <div class="sng-brand"><div class="sng-logo-panel"><img class="sng-logo" src="${escape(asset(content.logo.src))}" alt="${escape(content.logo.alt)}" width="96" height="96" fetchpriority="high"></div><p class="sng-eyebrow">Karneval verbindet<br>Seit 2026</p></div>
              <h1 class="hero-headline">${escape(content.title)}</h1>
              <p class="sng-motto">${escape(content.motto)}</p>
              <p class="sng-lead">${escape(content.intro)}</p>
              <div class="sng-actions"><a class="btn" href="${escape(mail)}">Teilnahme anfragen</a>
                <a class="btn sng-secondary" href="${faq}">Fragen zur Teilnahme</a></div>
            </div>
          </div>
        </div>
      </section>
      <section id="idee" class="section sng-section" aria-labelledby="idea-title">
        <div class="container"><p class="sng-eyebrow">Was uns zusammenbringt</p>
          <h2 id="idea-title">${escape(content.idea.title)}</h2>
          <div class="sng-copy">${paragraphs(content.idea.paragraphs)}</div>
          <div class="grid cards-3 sng-values">${content.idea.values.map((value) => `<article class="card sng-value"><h3>${escape(value.title)}</h3><p>${escape(value.text)}</p></article>`).join('')}</div>
        </div>
      </section>
      <section class="section section-blue sng-section sng-stage" aria-labelledby="stage-title"><div class="container">
        <div class="sng-stage-grid">${imageFigure(content.media.stage, 'sng-stage-photo')}<div class="sng-stage-copy">
          <p class="sng-eyebrow">Bühnenmomente, die verbinden</p><h2 id="stage-title">${escape(content.stage.title)}</h2>
          <p>${escape(content.stage.text)}</p><p class="sng-stage-spirit">${escape(content.stage.spirit)}</p>
          <h3>Mitfeiern geht auch ohne Bühne.</h3><p>${escape(content.stage.notice)}</p>
        </div></div>
      </div></section>
      <section class="section sng-section" aria-labelledby="review-title"><div class="container">
        <div class="sng-review-layout${video?.src ? '' : ' sng-review-without-video'}"><div class="sng-review-copy">
          <p class="sng-eyebrow">Rückblick auf die Premiere</p><h2 id="review-title">${escape(content.review.title)}</h2>
          <dl class="sng-stats">${content.review.stats.map((stat) => `<div class="card"><dt>${escape(stat.label)}</dt><dd>${escape(stat.value)}</dd></div>`).join('')}</dl>
          <div class="sng-copy">${paragraphs(content.review.paragraphs)}</div>
        </div>
        ${instagramVideo || (video?.src ? `<figure class="sng-video-figure">
          <div class="sng-video-frame"><video id="sng-review-video" class="sng-review-video" loop playsinline preload="none" controlslist="nodownload noplaybackrate noremoteplayback" disablepictureinpicture disableremoteplayback draggable="false" aria-label="${escape(video.title)}"${video.caption ? ' aria-describedby="sng-video-caption"' : ''}>
            <source src="${escape(asset(video.src))}" type="video/mp4">
            Euer Browser unterstützt dieses Video nicht.
          </video>
          <button class="sng-video-start" type="button" aria-controls="sng-review-video"><span aria-hidden="true">▶</span><span class="sng-video-start-label">Mit Ton abspielen</span></button>
          <div class="sng-video-controls" role="group" aria-label="Videosteuerung">
            <button class="sng-video-toggle" type="button" aria-label="Video abspielen" aria-controls="sng-review-video"><span aria-hidden="true">▶</span></button>
            <div class="sng-video-timeline"><label class="sng-sr-only" for="sng-video-progress">Videoposition</label><input id="sng-video-progress" type="range" min="0" max="100" value="0" step="0.1" disabled><span class="sng-video-time" aria-hidden="true">0:00 / 0:00</span></div>
            <button class="sng-video-sound" type="button" aria-label="Ton ausschalten" aria-pressed="false" aria-controls="sng-review-video"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path class="sng-sound-waves" d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="sng-sound-off" d="m16 9 6 6m0-6-6 6" hidden/></svg></button>
          </div><p class="sng-video-status" role="status" aria-live="polite"></p>
          </div>
          ${video.caption ? `<figcaption id="sng-video-caption">${escape(video.caption)}</figcaption>` : ''}
        </figure>` : '')}</div>
        ${quoteMarkup}
        <div class="sng-gallery" aria-label="Bilder aus dem Vereinsleben">${content.media.gallery.map((image) => imageFigure(image)).join('')}</div>
      </div></section>
      ${showNext ? `<section class="section sng-section sng-next-promo" aria-labelledby="next-title"><div class="container">
        <div class="sng-promo-card">
          <div class="sng-promo-copy"><p class="sng-eyebrow">${escape(next.eyebrow)}</p>
            <h2 id="next-title">${escape(next.edition)}</h2><p class="sng-lead">${escape(next.text)}</p>
            <p class="sng-promo-location">${escape(next.location)}</p>
            <div class="sng-actions"><a class="btn" href="${escape(mail)}">Teilnahme anfragen</a>
              ${next.detailsUrl ? `<a class="sng-text-link" href="${escape(asset(next.detailsUrl))}">Veranstaltungsdetails →</a>` : ''}
              <a class="sng-text-link" href="${faq}">Fragen zur Teilnahme →</a></div>
          </div>
          <time class="sng-promo-date" datetime="${escape(next.date)}" aria-label="${weekday}, ${dateLabel}">
            <span>${weekday}</span><strong>${date.getDate().toString().padStart(2, '0')}</strong><span>${monthLabel}</span>
          </time>
        </div>
      </div></section>` : ''}
      ${!showNext ? `<section class="section sng-section sng-join" aria-labelledby="join-title"><div class="container">
        <h2 id="join-title">${escape(content.join.title)}</h2>
        <p class="sng-lead">${escape(content.join.text)}</p>
        <div class="sng-join-contact"><a class="btn" href="${escape(mail)}">Teilnahme anfragen</a>
          <a class="sng-text-link" href="${faq}">Fragen zur Teilnahme →</a></div>
        <div class="sng-social-links" role="group" aria-label="SKV auf Social Media">
          <a class="social-link social-link--instagram" href="https://www.instagram.com/skv_sandoria" target="_blank" rel="noopener noreferrer" aria-label="SKV auf Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1.1"/></svg>
          </a>
          <a class="social-link social-link--facebook" href="https://www.facebook.com/skvonline" target="_blank" rel="noopener noreferrer" aria-label="SKV auf Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3v2.4H8v3.2h2.7V22h2.8Z"/></svg>
          </a>
        </div>
      </div></section>` : ''}`;
    document.title = `${content.title} | SKV`;
    const description = 'Von Vereinen, für Vereine: Beim Sandersdorfer Narrengipfel treffen Karnevalsvereine aufeinander, teilen ihre Bühnenmomente und feiern gemeinsam.';
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:description"]').content = description;
  } catch (error) {
    console.error(error);
    // Der bereits enthaltene HTML-Inhalt bleibt bei einem Ladefehler erhalten.
  }
  setupNarrengipfelQuotes();
  setupNarrengipfelInstagram();
  setupNarrengipfelVideo();
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
    return `<span class="sng-quote-avatar sng-quote-avatar--logo${borderClass}"${borderStyle ? ` style="${borderStyle}"` : ''} aria-hidden="true">${valid ? `<img src="${escape(asset(logo))}" alt="" width="64" height="64" loading="lazy" referrerpolicy="no-referrer">` : '<span title="Bildpfad ungültig">–</span>'}</span>`;
  }
  const background = getNarrengipfelQuoteBackground(quote);
  const style = `${borderStyle}${background ? `--sng-quote-background: ${background};` : ''}`;
  return `<span class="sng-quote-avatar${background ? ' sng-quote-avatar--colors' : ''}${borderClass}"${style ? ` style="${style}"` : ''} aria-hidden="true"><span class="sng-quote-initials">${escape(getNarrengipfelQuoteInitials(quote))}</span></span>`;
}

function getNarrengipfelQuoteInitials(quote) {
  if (typeof quote.initials === 'string' && quote.initials.trim()) return quote.initials.trim();
  return quote.club.trim().split(/\s+/).slice(0, 2).map((word) => Array.from(word)[0]).join('').toLocaleUpperCase('de-DE');
}

// Ohne JavaScript bleiben alle Zitate sichtbar; die Navigation wird erst hier aktiviert.
function setupNarrengipfelQuotes() {
  const section = document.querySelector('.sng-guest-quotes');
  if (!section || section.dataset.carouselReady) return;
  section.querySelectorAll('.sng-quote-avatar img').forEach((image) => {
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

// Die Vorschau besteht nur aus lokalen Inhalten. Keine Anbieteranfrage vor Zustimmung.
function createNarrengipfelInstagramMarkup(video, escape) {
  return `<figure class="sng-instagram-figure" aria-label="${escape(video.title)}" data-instagram-url="${escape(video.src)}">
    <div class="sng-instagram-consent">
      <span class="sng-instagram-play" aria-hidden="true">▶</span>
      <p class="sng-instagram-heading">Rückblick 2026</p>
      <p class="sng-instagram-summary">Mit dem Laden stimmt ihr der Datenübertragung an Instagram zu. Dabei können Cookies eingesetzt werden.</p>
      <button class="btn sng-instagram-load" type="button" hidden>Instagram laden</button>
      <details class="sng-instagram-details"><summary>Details zum Datenschutz</summary>
        <p>Der Inhalt stammt von Instagram (Meta Platforms Ireland Limited). Beim Laden werden eure IP-Adresse und Browserinformationen an Instagram übermittelt. Cookies oder ähnliche Technologien können eingesetzt und Daten auch in den USA verarbeitet werden.</p>
        <p>Die Einwilligung ist freiwillig und gilt nur für diese Seitenansicht. Ihr könnt sie unter dem Video widerrufen. Bereits übertragene Daten werden dadurch nicht zurückgeholt.</p>
        <a href="https://privacycenter.instagram.com/policy/" target="_blank" rel="noopener noreferrer">Datenschutzhinweise von Instagram ↗</a>
      </details>
    </div>
    <div class="sng-instagram-embed" hidden></div>
    <button class="sng-instagram-remove" type="button" hidden>Einwilligung widerrufen</button>
    <p class="sng-instagram-status" role="status" aria-live="polite"></p>
    <a href="${escape(video.src)}" target="_blank" rel="noopener noreferrer">Video direkt auf Instagram ansehen ↗</a>
  </figure>`;
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
