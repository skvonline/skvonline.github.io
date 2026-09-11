/*
 * Interaktionslogik für die Vorstandskarten.
 * Steuert das Öffnen, Schließen und Tastaturverhalten der Detailbereiche.
 */

function setupBoardCards() {
  const boardCards = Array.from(document.querySelectorAll('.board-card'));
  if (boardCards.length === 0) {
    return;
  }

  const isMobileViewport = () => window.matchMedia('(max-width: 960px)').matches;

  function closeAllBoardCards() {
    boardCards.forEach((card) => {
      card.classList.remove('is-open');
      const trigger = card.querySelector('.board-poster');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  boardCards.forEach((card) => {
    const trigger = card.querySelector('.board-poster');
    if (!trigger) return;

    trigger.addEventListener('click', (event) => {
      if (!isMobileViewport()) {
        return;
      }

      event.preventDefault();
      const isOpen = card.classList.contains('is-open');
      closeAllBoardCards();
      card.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  document.addEventListener('click', (event) => {
    if (!isMobileViewport()) {
      return;
    }
    if (event.target.closest('.board-card')) {
      return;
    }
    closeAllBoardCards();
  });

  window.addEventListener('resize', () => {
    if (!isMobileViewport()) {
      closeAllBoardCards();
    }
  });
}



