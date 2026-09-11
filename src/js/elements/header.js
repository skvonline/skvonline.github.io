function setupMobileMenu() {
  const button = document.getElementById('menu_button');
  const mobileNav = document.getElementById('mobile-nav');
  const desktopMenu = document.querySelector('.header nav .main-menu');
  const desktopSocials = document.querySelector('.header .header-socials');
  if (!button || !mobileNav || !desktopMenu) return;

  mobileNav.innerHTML = `<ul class="main-menu">${desktopMenu.innerHTML}</ul>`;
  if (desktopSocials) {
    mobileNav.insertAdjacentHTML('beforeend', desktopSocials.outerHTML);
  }

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

function setNoticeTrackAnimation(track, noticeCount) {
  const durationInSeconds = Math.max(18, noticeCount * 8);
  track.style.setProperty('--notice-duration', `${durationInSeconds}s`);

  const halfDistance = track.scrollWidth / 2;
  if (Number.isFinite(halfDistance) && halfDistance > 0) {
    track.style.setProperty('--notice-distance', `-${halfDistance}px`);
  }
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
    setNoticeTrackAnimation(noticeTrack, renderedEntriesCount);
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


