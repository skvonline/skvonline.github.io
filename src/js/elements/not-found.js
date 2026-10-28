/* Begrenzte Konfettischauer, ohne externe Bibliothek. */
(function () {
  const layer = document.querySelector('.not-found-confetti');
  const button = document.getElementById('more-confetti');
  if (!layer || !button) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateFallDistance() {
    layer.style.setProperty('--fall-distance', `${layer.clientHeight + 60}px`);
  }

  updateFallDistance();
  const resizeObserver = new ResizeObserver(updateFallDistance);
  resizeObserver.observe(layer);

  function shower(amount = 240) {
    const fragment = document.createDocumentFragment();
    // Laufende Animationen bleiben bestehen; nur freie Plätze werden aufgefüllt.
    const count = Math.min(reducedMotion.matches ? 18 : amount, 720 - layer.childElementCount);
    updateFallDistance();
    for (let index = 0; index < count; index += 1) {
      const piece = document.createElement('span');
      const variant = Math.floor(Math.random() * 3);
      piece.className = `not-found-piece not-found-piece--${variant}`;
      const duration = 3000 + Math.random() * 2200;
      const delay = Math.random() * 1400;
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);
      piece.style.setProperty('--spin', `${Math.random() * 720 - 360}deg`);
      piece.style.animationDuration = `${duration}ms`;
      piece.style.animationDelay = `${delay}ms`;
      if (reducedMotion.matches) piece.style.top = `${Math.random() * 100}%`;
      fragment.append(piece);
      const cleanupTimer = window.setTimeout(() => piece.remove(), duration + delay + 250);
      piece.addEventListener('animationend', () => {
        window.clearTimeout(cleanupTimer);
        piece.remove();
      }, {once: true});
    }
    layer.append(fragment);
  }

  button.hidden = false;
  button.addEventListener('click', () => shower(360));
  if (!reducedMotion.matches) shower();
})();
