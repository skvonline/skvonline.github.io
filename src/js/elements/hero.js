/*
 * Logik für die Hero-Galerie der Startseite.
 * Lädt Bilder und Videos aus der JSON-Datenquelle und steuert den Medienwechsel.
 */

function setupHeroCarousel() {
  const slides = Array.from(document.querySelectorAll('.hero-slide-wrapper'));
  if (slides.length === 0) return;

  let index = 0;
  function showSlide() {
    const slide = slides[index];
    const video = slide.querySelector('video');
    slide.classList.add('active');
    slide.setAttribute('aria-hidden', 'false');
    let finished = false;
    let timer;

    function nextSlide() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (video) {
        video.removeEventListener('ended', nextSlide);
        video.removeEventListener('error', skipUnavailableVideo);
        video.pause();
      }
      slide.classList.remove('active');
      slide.setAttribute('aria-hidden', 'true');
      index = (index + 1) % slides.length;
      showSlide();
    }

    function skipUnavailableVideo() {
      if (finished) return;
      clearTimeout(timer);
      timer = setTimeout(nextSlide, 5000);
    }

    if (video) {
      video.currentTime = 0;
      video.addEventListener('ended', nextSlide);
      video.addEventListener('error', skipUnavailableVideo);
      if (video.error) {
        skipUnavailableVideo();
      } else {
        video.play().catch(skipUnavailableVideo);
      }
    } else if (slides.length > 1) {
      timer = setTimeout(nextSlide, 5000);
    }
  }

  slides.forEach((slide) => {
    slide.classList.remove('active');
    slide.setAttribute('aria-hidden', 'true');
  });
  showSlide();
}

async function loadHomeGallery() {
  const galleryContainer = document.getElementById('home-gallery-slides');
  if (!galleryContainer) return;

  const galleryItems = await fetch('./src/data/gallerys/home-gallery.json').then((response) => response.json());
  if (!Array.isArray(galleryItems) || galleryItems.length === 0) {
    return;
  }

  galleryItems.forEach((item) => {
    if (item?.video?.src) {
      const media = normalizeImage(item.video);
      const altText = item.alt || 'Video aus der Home-Gallery';
      const wrapper = document.createElement('div');
      wrapper.className = `hero-slide-wrapper media-protected${media.ki || media.teilweiseKi ? ' ai-protected-media' : ''}`;
      const video = document.createElement('video');
      video.className = 'hero-slide';
      video.setAttribute('aria-label', altText);
      video.textContent = altText;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.src = item.video.src;
      if (item.video.poster) video.poster = item.video.poster;
      wrapper.append(video);
      wrapper.insertAdjacentHTML('beforeend', createAiLabelMarkup(media));
      galleryContainer.append(wrapper);
      return;
    }

    const image = normalizeImage(item?.image);
    if (!image.src) {
      return;
    }

    const altText = item.alt || 'Bild aus der Home-Gallery';
    galleryContainer.insertAdjacentHTML(
      'beforeend',
      createImageMarkup(image, altText, 'hero-slide', { wrapperClass: 'hero-slide-wrapper' }),
    );
  });
}

