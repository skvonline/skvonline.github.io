/*
 * Logik für Veranstaltungen und Veranstaltungsdetails.
 * Formatiert Eventdaten, erzeugt Detail-URLs und rendert die einzelne Veranstaltungsdetailseite.
 */

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

  return normalizeImage(event.image).src;
}

function getEventShareButtonMarkup(event) {
  const shareUrl = buildEventShareUrl(event);
  if (!shareUrl) {
    return '';
  }

  return `<button type="button" class="news-link news-link--icon news-link--share event-share-button" data-event-share-url="${shareUrl}" aria-label="Veranstaltung teilen">${NEWS_LINK_ICONS.share}</button>`;
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

  const events = Array.isArray(eventsRaw) ? eventsRaw.filter((event) => isVisibleByWindow(event)) : [];
  const matchingEvent = events.find((event) => getEventDetailToken(event) === eventToken);

  if (!matchingEvent) {
    document.title = 'SKV | Veranstaltungsdetails';
    detailContainer.innerHTML = '<p>Die gewünschte Veranstaltung wurde nicht gefunden.</p>';
    return;
  }

  document.title = `SKV | ${matchingEvent.title || 'Veranstaltungsdetails'}`;

  const detailImage = normalizeImage(matchingEvent.image);
  detailImage.src = normalizeImagePathForSubpage(detailImage.src) || '../src/img/events/default.png';
  const detailImagePath = detailImage.src;
  const imageMarkup = detailImagePath
    ? createImageMarkup(detailImage, matchingEvent.title || 'Veranstaltung', 'event-detail-image', { pathPrefix: '../' })
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



