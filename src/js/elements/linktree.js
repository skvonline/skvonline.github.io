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

function setupLinktreeHeaderMode() {
  const header = document.querySelector('.header');
  if (!header) {
    return;
  }

  header.classList.add('header--notice-only');

  const headerInner = header.querySelector('.header-inner');
  if (headerInner) {
    headerInner.remove();
  }

  const noticeBar = header.querySelector('#header-notice-bar');
  if (!noticeBar) {
    header.hidden = true;
    return;
  }

  const syncHeaderVisibility = () => {
    header.hidden = noticeBar.hidden;
  };

  syncHeaderVisibility();

  const observer = new MutationObserver(syncHeaderVisibility);
  observer.observe(noticeBar, {
    attributes: true,
    attributeFilter: ['hidden'],
  });
}


