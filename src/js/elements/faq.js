/*
 * Logik für FAQ-Seiten und Kartenverkauf-Terminblock.
 * Lädt FAQ-Daten, rendert Fragen und Antworten und steuert Suche, Filterung und Trefferstatus.
 */

function setupTicketDatesVisibility() {
  const ticketDates = document.querySelector('.ticket-dates[data-publish-at][data-delete-at]');
  if (!ticketDates) return;

  const publishAt = Date.parse(ticketDates.dataset.publishAt);
  const deleteAt = Date.parse(ticketDates.dataset.deleteAt);
  const now = Date.now();

  if (!Number.isFinite(publishAt) || !Number.isFinite(deleteAt) || publishAt >= deleteAt) {
    console.warn('Terminblock ausgeblendet: publishAt und deleteAt müssen gültige Datumsangaben in zeitlich korrekter Reihenfolge sein.');
    return;
  }

  ticketDates.hidden = now < publishAt || now >= deleteAt;
}


async function loadFaqContent() {
  const container = document.getElementById('faq-content');
  if (!container) return;

  try {
    const source = container.dataset.faqSource;
    if (!source) throw new Error('Für das FAQ wurde keine Datenquelle angegeben.');
    const response = await fetch(source);
    if (!response.ok) throw new Error(`FAQ konnte nicht geladen werden (${response.status})`);

    const categories = await response.json();
    if (!Array.isArray(categories)) throw new Error('Das FAQ-JSON muss ein Array enthalten.');

    container.replaceChildren();
    if (categories.every((entry) => entry?.frage && typeof entry.antwort === 'string')) {
      categories.forEach((entry) => {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = entry.frage;
        const answer = document.createElement('div');
        answer.className = 'faq-answer';
        answer.innerHTML = entry.antwort;
        details.append(summary, answer);
        container.append(details);
      });
      return;
    }

    categories.forEach((category, categoryIndex) => {
      if (!category?.kategorie || !Array.isArray(category.fragen)) return;

      const headingId = `faq-category-${categoryIndex + 1}`;
      const section = document.createElement('section');
      section.className = 'faq-section';
      section.setAttribute('aria-labelledby', headingId);

      const heading = document.createElement('h2');
      heading.id = headingId;
      heading.textContent = category.kategorie;

      const list = document.createElement('div');
      list.className = 'faq-list';
      category.fragen.forEach((entry) => {
        if (!entry?.frage || typeof entry.antwort !== 'string') return;

        const details = document.createElement('details');
        details.dataset.tags = Array.isArray(entry.stichwoerter) ? entry.stichwoerter.join(' ') : '';
        const summary = document.createElement('summary');
        summary.textContent = entry.frage;
        const answer = document.createElement('div');
        answer.className = 'faq-answer';
        answer.innerHTML = entry.antwort;
        details.append(summary, answer);
        list.append(details);
      });

      section.append(heading, list);
      container.append(section);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p class="faq-loading">Das FAQ konnte leider nicht geladen werden. Bitte versuche es später erneut.</p>';
  }
}

function setupFaqSearch() {
  const searchInput = document.getElementById('faq-search');
  if (!searchInput) return;

  const sections = Array.from(document.querySelectorAll('.faq-section'));
  const status = document.getElementById('faq-results-status');
  const noResults = document.getElementById('faq-no-results');
  const clearButton = document.querySelector('.faq-search-clear');
  const resetButton = document.querySelector('.faq-reset');
  const keywordRules = [
    ['Muttizettel', /muttizettel|erziehungsbeauftragung|minderjährig|begleitperson/i],
    ['Einlass', /einlass|zutritt|wiedereinlass|kontroll/i],
    ['Jugendschutz', /alter|jugendschutz|minderjährig|alkohol/i],
    ['Tickets', /karte|kartenverkauf|kartenabholung|abendkasse/i],
    ['Programm', /programm|clubnacht|lumpenball|fasching/i],
    ['Kinder & Familie', /kinder|familie|jugendliche/i],
    ['Essen & Trinken', /speisen|essen|getränke|alkohol|ausschank/i],
    ['Anreise & Parken', /anreise|park|adresse|veranstaltungsort/i],
    ['Barrierefreiheit', /barrierefrei|unterstützung|hilfe/i],
    ['Fotos & Videos', /foto|video|aufnahme|fotografiert/i],
    ['Karnevalsumzug', /umzug|umzugsstrecke|straße|süßigkeiten/i],
    ['Verein & Mitgliedschaft', /verein|mitglied|gruppen|mitmachen|unterstützen/i],
    ['Kontakt', /kontakt|informationen|antwort/i],
  ];
  const normalize = (value) => value.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  sections.forEach((section) => {
    const heading = section.querySelector('h2');
    const list = section.querySelector('.faq-list');
    if (!heading || !list) return;
    const category = heading?.textContent.trim() || 'Weitere Fragen';
    const listId = `${heading.id}-questions`;
    list.id = listId;
    list.hidden = true;
    heading.innerHTML = `<button class="faq-section-toggle" type="button" aria-expanded="false" aria-controls="${listId}">
      <span>${category}</span><span class="faq-section-icon" aria-hidden="true"></span>
    </button>`;
    heading.querySelector('button').addEventListener('click', (event) => {
      const button = event.currentTarget;
      const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(shouldOpen));
      list.hidden = !shouldOpen;
    });
    section.querySelectorAll('details:not([data-tags])').forEach((question) => {
      const tags = keywordRules.filter(([, pattern]) => pattern.test(question.textContent)).map(([tag]) => tag).slice(0, 3);
      question.dataset.tags = (tags.length ? tags : [category]).join(' ');
    });
  });

  const applyFilters = () => {
    const term = normalize(searchInput.value.trim());
    let visibleCount = 0;
    sections.forEach((section) => {
      let sectionCount = 0;
      section.querySelectorAll('details').forEach((question) => {
        const searchMatches = !term || normalize(`${question.textContent} ${question.dataset.tags}`).includes(term);
        question.hidden = !searchMatches;
        if (!question.hidden) sectionCount += 1;
      });
      section.hidden = sectionCount === 0;
      const list = section.querySelector('.faq-list');
      const toggle = section.querySelector('.faq-section-toggle');
      list.hidden = !term;
      toggle.setAttribute('aria-expanded', String(Boolean(term)));
      visibleCount += sectionCount;
    });
    clearButton.hidden = !searchInput.value;
    noResults.hidden = visibleCount !== 0;
    status.hidden = !term;
    status.textContent = term ? (visibleCount === 1 ? '1 passende Frage' : `${visibleCount} passende Fragen`) : '';
  };
  searchInput.addEventListener('input', applyFilters);
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    applyFilters();
  });
  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    applyFilters();
    searchInput.focus();
  });

  const rawQuery = window.location.search.slice(1);
  if (rawQuery) {
    const params = new URLSearchParams(rawQuery);
    const initialTerm = params.get('q') || (rawQuery.includes('=') ? '' : decodeURIComponent(rawQuery.replace(/\+/g, ' ')));
    if (initialTerm) searchInput.value = initialTerm;
  }
  applyFilters();
}



