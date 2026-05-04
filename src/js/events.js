(function () {
  function parseEventDateForShare(dateValue) {
    if (!dateValue || typeof dateValue !== 'string') return null;
    const match = dateValue.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (!match) return null;
    const [, day, month, year] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  function parseEventTimeForShare(timeValue) {
    if (!timeValue || typeof timeValue !== 'string') return null;
    const match = timeValue.match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    const [, hour, minute] = match;
    return `${hour.padStart(2, '0')}.${minute}`;
  }
  function getEventDetailToken(event) {
    const datePart = parseEventDateForShare(event?.date);
    const timePart = parseEventTimeForShare(event?.time);
    return datePart && timePart ? `${datePart}-${timePart}` : '';
  }
  function buildEventShareUrl(event) {
    const eventToken = getEventDetailToken(event);
    return eventToken ? new URL(`/veranstaltungen/?${eventToken}`, window.location.origin).href : '';
  }
  function getEventImagePath(event) {
    return event && typeof event === 'object' && event.image && String(event.image).trim() !== '' ? event.image : '';
  }
  function getEventDetailsMarkup(event) {
    const detailRows = [event.date && `<p><strong>Datum:</strong> ${event.date}</p>`, event.time && `<p><strong>Uhrzeit:</strong> ${event.time}</p>`, event.einlass && `<p><strong>Einlass:</strong> ${event.einlass}</p>`, event.preis && `<p><strong>Preis:</strong> ${event.preis}</p>`, event.location && `<p><strong>Ort:</strong> ${event.location}</p>`].filter(Boolean);
    return detailRows.length === 0 ? '' : `<div class="event-details">${detailRows.join('')}</div>`;
  }
  function getEventDescriptionMarkup(event) {
    return event?.description && String(event.description).trim() !== '' ? `<p class="event-detail-description">${event.description}</p>` : '';
  }
  function getEventShareButtonMarkup(event) {
    const shareUrl = buildEventShareUrl(event);
    const icon = window.SKV?.news?.NEWS_LINK_ICONS?.share;
    return shareUrl && icon ? `<button type="button" class="news-link news-link--icon news-link--share event-share-button" data-event-share-url="${shareUrl}" aria-label="Veranstaltung teilen">${icon}</button>` : '';
  }
  window.SKV = window.SKV || {};
  window.SKV.events = { getEventDetailToken, getEventImagePath, getEventDetailsMarkup, getEventDescriptionMarkup, getEventShareButtonMarkup };
})();
