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
        <div class="sng-review-layout"><div class="sng-review-copy">
          <p class="sng-eyebrow">Rückblick auf die Premiere</p><h2 id="review-title">${escape(content.review.title)}</h2>
          <dl class="sng-stats">${content.review.stats.map((stat) => `<div class="card"><dt>${escape(stat.label)}</dt><dd>${escape(stat.value)}</dd></div>`).join('')}</dl>
          <div class="sng-copy">${paragraphs(content.review.paragraphs)}</div>
        </div>
        <figure class="sng-video-figure">
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
        </figure></div>
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
  setupNarrengipfelVideo();
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
