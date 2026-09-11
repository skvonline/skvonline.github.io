/*
 * Gemeinsame Link- und Icon-Helfer für News und Veranstaltungen.
 * Erzeugt Link-Buttons, Share-Buttons und Rückmeldungen beim Teilen von Veranstaltungslinks.
 */

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



