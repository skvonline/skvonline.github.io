/*
 * Logik für das Sponsorenlaufband.
 * Klont Sponsoreneinträge und berechnet Animationstrecke sowie Geschwindigkeit responsiv.
 */

function setupSponsorsMarquee() {
  const track = document.getElementById('sponsors-track');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.sponsor-slide'));
  if (slides.length <= 1) return;

  if (!track.dataset.marqueeCloned) {
    const cloneMarkup = slides.map((slide) => slide.outerHTML).join('');
    track.insertAdjacentHTML('beforeend', cloneMarkup);
    track.dataset.marqueeCloned = 'true';
  }

  const updateMarqueeMetrics = () => {
    const baseDistance = track.scrollWidth / 2;
    if (!Number.isFinite(baseDistance) || baseDistance <= 0) return;

    const speedInPixelsPerSecond = 90;
    const durationInSeconds = Math.max(14, baseDistance / speedInPixelsPerSecond);

    track.style.setProperty('--sponsors-marquee-distance', `-${baseDistance}px`);
    track.style.setProperty('--sponsors-marquee-duration', `${durationInSeconds}s`);
  };

  const sponsorImages = Array.from(track.querySelectorAll('.sponsor-image'));
  const imagePromises = sponsorImages.map((image) => {
    if (image.complete) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  });

  updateMarqueeMetrics();
  Promise.all(imagePromises).then(() => {
    requestAnimationFrame(updateMarqueeMetrics);
  });

  if (!track.dataset.marqueeResizeBound) {
    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateMarqueeMetrics, 120);
    });
    track.dataset.marqueeResizeBound = 'true';
  }
}



