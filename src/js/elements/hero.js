function setupHeroCarousel() {
  const slides = Array.from(document.querySelectorAll('.hero-slide-wrapper'));
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
  if (!Array.isArray(galleryItems) || galleryItems.length === 0) {
    return;
  }

  galleryItems.forEach((item, index) => {
    const image = normalizeImage(item?.image);
    if (!image.src) {
      return;
    }

    const isActiveClass = index === 0 ? ' active' : '';
    const altText = item.alt || 'Bild aus der Home-Gallery';
    galleryContainer.insertAdjacentHTML(
      'beforeend',
      createImageMarkup(image, altText, 'hero-slide', { wrapperClass: `hero-slide-wrapper${isActiveClass}` }),
    );
  });
}


