(function () {
  function setupHeroCarousel() {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    if (slides.length <= 1) return;
    let index = 0;
    setInterval(() => {
      slides[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
    }, 5000);
  }
  async function loadHomeGallery() {
    const galleryContainer = document.getElementById('home-gallery-slides');
    if (!galleryContainer) return;
    const galleryItems = await fetch('./src/data/gallerys/home-gallery.json').then((response) => response.json());
    if (!Array.isArray(galleryItems) || galleryItems.length === 0) return;
    galleryItems.forEach((item, index) => {
      if (!item?.src) return;
      galleryContainer.insertAdjacentHTML('beforeend', `<img class="hero-slide${index === 0 ? ' active' : ''}" src="${item.src}" alt="${item.alt || 'Bild aus der Home-Gallery'}" loading="lazy" />`);
    });
  }
  function setupSponsorsMarquee() {
    const track = document.getElementById('sponsors-track');
    if (!track) return;
    const slides = Array.from(track.querySelectorAll('.sponsor-slide'));
    if (slides.length <= 1) return;
    track.insertAdjacentHTML('beforeend', slides.map((slide) => slide.outerHTML).join(''));
    track.setAttribute('aria-hidden', 'false');
    track.style.setProperty('--sponsors-marquee-duration', `${Math.max(16, slides.length * 3.2)}s`);
  }
  window.SKV = window.SKV || {};
  window.SKV.gallerys = { setupHeroCarousel, loadHomeGallery, setupSponsorsMarquee };
})();
