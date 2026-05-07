(function () {
  const gallery = document.getElementById('gallery-grid');
  const sourceMeta = document.querySelector('meta[name="gallery-source"]');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImage = document.getElementById('gallery-lightbox-image');
  const lightboxCaption = document.getElementById('gallery-lightbox-caption');
  const closeButton = document.getElementById('gallery-lightbox-close');
  const backdrop = document.getElementById('gallery-lightbox-backdrop');
  const prevButton = document.getElementById('gallery-lightbox-prev');
  const nextButton = document.getElementById('gallery-lightbox-next');

  if (!gallery || !sourceMeta || !lightbox || !lightboxImage || !lightboxCaption || !closeButton || !backdrop || !prevButton || !nextButton) return;

  const jsonPath = sourceMeta.content;
  let images = [];
  let activeIndex = 0;

  function renderLightbox(index) {
    if (!images[index]) return;
    activeIndex = index;
    lightboxImage.src = images[index].src;
    lightboxImage.alt = images[index].alt || 'Galeriebild';
    lightboxCaption.textContent = images[index].alt || 'Keine Bildbeschreibung vorhanden';
  }

  function openLightbox(index) {
    renderLightbox(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function move(delta) {
    const nextIndex = (activeIndex + delta + images.length) % images.length;
    renderLightbox(nextIndex);
  }

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'Escape') closeLightbox();
  });

  closeButton.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  prevButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));

  fetch(jsonPath)
    .then((response) => (response.ok ? response.json() : []))
    .then((data) => {
      images = Array.isArray(data) ? data : [];

      if (images.length === 0) {
        gallery.innerHTML = '<p>Zurzeit sind keine Bilder verfügbar.</p>';
        return;
      }

      images.forEach((image, index) => {
        if (!image?.src) return;
        const altText = image.alt || 'Galeriebild';
        gallery.insertAdjacentHTML('beforeend', `<article class="gallery-card"><button type="button" class="gallery-button" data-index="${index}" aria-label="Vorschau öffnen: ${altText}"><img class="gallery-image" src="${image.src}" alt="${altText}" loading="lazy"></button></article>`);
      });

      gallery.addEventListener('click', (event) => {
        const button = event.target.closest('.gallery-button');
        if (!button) return;
        const index = Number(button.dataset.index);
        if (Number.isNaN(index)) return;
        openLightbox(index);
      });
    })
    .catch(() => {
      gallery.innerHTML = '<p>Die Galerie konnte nicht geladen werden.</p>';
    });
})();
