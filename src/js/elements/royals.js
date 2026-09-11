/*
 * Logik für die Prinzenpaar-Galerie und Lightbox.
 * Normalisiert Prinzenpaar-Daten, rendert Fallbacks und erstellt Downloadbilder mit Beschriftung.
 */

function createRoyalOverlayText(value, modifierClass) {
  if (!value) {
    return '';
  }
  return `<span class="royal-gallery-overlay royal-gallery-overlay--${modifierClass}">${value || 'Nicht hinterlegt'}</span>`;
}

function getRoyalField(entry, candidates) {
  const key = candidates.find((candidate) => {
    const value = entry[candidate];
    return value !== undefined && value !== null && String(value).trim() !== '';
  });
  return key ? entry[key] : '';
}

function formatPairText(pairValue) {
  if (!pairValue) {
    return '';
  }

  if (typeof pairValue === 'string') {
    return pairValue;
  }

  if (Array.isArray(pairValue)) {
    const normalizedPairs = pairValue
      .map((pair) => formatPairText(pair))
      .filter(Boolean);
    return normalizedPairs.join('<br>');
  }

  if (typeof pairValue === 'object') {
    const prince = pairValue.prince || pairValue.prinz || pairValue.Prinz || '';
    const princess = pairValue.princess || pairValue.prinzessin || pairValue.Prinzessin || '';
    if (prince && princess) {
      return `${prince}<br>${princess}`;
    }
    if (prince) {
      return prince;
    }
    if (princess) {
      return princess;
    }
  }

  return '';
}

function formatLightboxInlineText(value) {
  if (!value) {
    return '';
  }

  return String(value)
    .replace(/<br\s*\/?>/gi, ' und ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatTitledPairText(value, princeLabel, princessLabel) {
  if (!value) {
    return '';
  }

  const normalizedText = formatLightboxInlineText(value);
  if (!normalizedText) {
    return '';
  }

  if (/prinz/i.test(normalizedText)) {
    return normalizedText;
  }

  const pairParts = String(value)
    .split(/<br\s*\/?>/gi)
    .map((part) => part.trim())
    .filter(Boolean);

  if (pairParts.length >= 2) {
    return `${princeLabel} ${pairParts[0]} und ${princessLabel} ${pairParts[1]}`;
  }

  return normalizedText;
}

function normalizeRoyalEntry(entry) {
  const session = getRoyalField(entry, ['session', 'Session']);
  const year = getRoyalField(entry, ['year', 'jahr', 'Jahr']) || session;
  const largePair = getRoyalField(entry, ['adultPair', 'grossesPP', 'großesPP', 'Grosses PP', 'Großes PP', 'text']);
  const smallPair = getRoyalField(entry, ['childPair', 'kleinesPP', 'Kleines PP']);
  const image = normalizeImage(entry.image);

  return {
    ...entry,
    session,
    year,
    largePair: formatPairText(largePair),
    smallPair: formatPairText(smallPair),
    image,
    hasImage: Boolean(image.src),
    title: entry.title || session || 'Prinzenpaar',
  };
}

function createRoyalFallbackMarkup(pair, options = {}) {
  const ariaHidden = options.ariaHidden !== false ? ' aria-hidden="true"' : '';
  const hasSmallPair = Boolean(pair.smallPair);
  const smallPairMarkup = hasSmallPair
    ? `
        <section class="royal-gallery-fallback-panel">
          <span class="royal-gallery-fallback-label">Kleines Prinzenpaar</span>
          <p class="royal-gallery-fallback-value">${pair.smallPair}</p>
        </section>`
    : '';

  return `
    <div class="royal-gallery-placeholder${hasSmallPair ? '' : ' royal-gallery-placeholder--large-only'}"${ariaHidden}>
      <div class="royal-gallery-fallback-header">
        <h3 class="royal-gallery-fallback-session">${pair.session || 'Nicht hinterlegt'}</h3>
        <p class="royal-gallery-fallback-year">${pair.year || 'Jahr unbekannt'}</p>
      </div>
      <div class="royal-gallery-fallback-body">
        <section class="royal-gallery-fallback-panel">
          <span class="royal-gallery-fallback-label">Gro&szlig;es Prinzenpaar</span>
          <p class="royal-gallery-fallback-value">${pair.largePair || 'Nicht hinterlegt'}</p>
        </section>
        ${smallPairMarkup}
      </div>
    </div>`;
}

function createRoyalLightboxDetailsMarkup(pair) {
  const headingText = [pair.session, pair.year].filter(Boolean).join(' · ') || 'Prinzenpaar';
  const smallPairMarkup = pair.smallPair
    ? `
        <section class="royals-lightbox-detail-card">
          <span class="royals-lightbox-detail-label">Kleines Prinzenpaar</span>
          <p class="royals-lightbox-detail-value">${pair.smallPair}</p>
        </section>`
    : '';

  return `
    <div class="royals-lightbox-detail-shell">
      <p class="royals-lightbox-detail-heading">${headingText}</p>
      <div class="royals-lightbox-detail-grid">
        <section class="royals-lightbox-detail-card">
          <span class="royals-lightbox-detail-label">Großes Prinzenpaar</span>
          <p class="royals-lightbox-detail-value">${pair.largePair || 'Nicht hinterlegt'}</p>
        </section>
        ${smallPairMarkup}
      </div>
    </div>`;
}

function sanitizeFileNamePart(value) {
  if (!value || typeof value !== 'string') return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function loadImageAsset(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Image could not be loaded: ${src}`));
    image.src = src;
  });
}

function wrapRoyalDownloadText(context, text, maxWidth) {
  const rawLines = String(text || '')
    .split(/<br\s*\/?>/gi)
    .map((line) => line.trim())
    .filter(Boolean);
  const wrappedLines = [];

  rawLines.forEach((rawLine) => {
    const words = rawLine.split(/\s+/).filter(Boolean);
    let currentLine = '';

    words.forEach((word) => {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;
      if (context.measureText(nextLine).width <= maxWidth || !currentLine) {
        currentLine = nextLine;
      } else {
        wrappedLines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) wrappedLines.push(currentLine);
  });

  return wrappedLines.length > 0 ? wrappedLines : ['Nicht hinterlegt'];
}

function drawRoyalDownloadLabel(context, canvasWidth, canvasHeight, options) {
  const { title = '', text = '', position, variant = 'panel' } = options;
  if (!text && !title) return;
  const alignRight = position.includes('right');

  const paddingX = Math.max(16, canvasWidth * 0.016);
  const paddingY = Math.max(12, canvasHeight * 0.013);
  const bodyFontSize = Math.max(20, canvasWidth * 0.019);
  const bodyLineHeight = bodyFontSize * 1.28;
  const titleFontSize = Math.max(13, canvasWidth * 0.0115);
  const titleGap = Math.max(10, canvasHeight * 0.01);
  const maxTextWidth = variant === 'compact'
    ? Math.max(130, canvasWidth * 0.18)
    : Math.max(210, canvasWidth * 0.27);

  context.save();
  context.textBaseline = 'top';

  context.font = `600 ${bodyFontSize}px Poppins, sans-serif`;
  const bodyLines = wrapRoyalDownloadText(context, text, maxTextWidth);
  const textWidth = bodyLines.reduce((max, line) => Math.max(max, context.measureText(line).width), 0);

  let titleHeight = 0;
  let titleWidth = 0;
  if (title) {
    context.font = `700 ${titleFontSize}px Poppins, sans-serif`;
    titleWidth = context.measureText(title).width;
    titleHeight = titleFontSize + titleGap;
  }

  const contentWidth = Math.max(textWidth, titleWidth);
  const finalBoxWidth = contentWidth + paddingX * 2;
  const finalBoxHeight = titleHeight + bodyLines.length * bodyLineHeight + paddingY * 2;
  const margin = Math.max(18, canvasWidth * 0.02);

  let x = margin;
  let y = margin;

  if (position.includes('right')) x = canvasWidth - finalBoxWidth - margin;
  if (position.includes('bottom')) y = canvasHeight - finalBoxHeight - margin;

  context.fillStyle = 'rgba(2, 6, 23, 0.64)';
  context.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  context.lineWidth = Math.max(1.5, canvasWidth * 0.0012);
  context.beginPath();
  context.roundRect(x, y, finalBoxWidth, finalBoxHeight, Math.max(16, canvasWidth * 0.012));
  context.fill();
  context.stroke();

  let cursorY = y + paddingY;
  if (title) {
    context.font = `700 ${titleFontSize}px Poppins, sans-serif`;
    context.fillStyle = '#bfdbfe';
    context.textAlign = alignRight ? 'right' : 'left';
    context.fillText(title, alignRight ? x + finalBoxWidth - paddingX : x + paddingX, cursorY);
    cursorY += titleHeight;
  }

  context.font = `600 ${bodyFontSize}px Poppins, sans-serif`;
  context.fillStyle = '#ffffff';
  context.textAlign = alignRight ? 'right' : 'left';
  bodyLines.forEach((line, index) => {
    context.fillText(line, alignRight ? x + finalBoxWidth - paddingX : x + paddingX, cursorY + index * bodyLineHeight);
  });
  context.restore();
}

async function downloadRoyalImageWithOverlay(pair) {
  if (!pair?.hasImage || !pair.image?.src) return;

  const [baseImage, labelImage] = await Promise.all([
    loadImageAsset(pair.image.src),
    pair.image.ki || pair.image.teilweiseKi
      ? loadImageAsset(`./src/img/ki_labels/${pair.image.ki ? 'ki' : 'teilweise_ki'}_${pair.image.theme}.png`)
      : Promise.resolve(null),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = baseImage.naturalWidth || baseImage.width;
  canvas.height = baseImage.naturalHeight || baseImage.height;

  const context = canvas.getContext('2d');
  if (!context) return;

  context.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  drawRoyalDownloadLabel(context, canvas.width, canvas.height, {
    text: pair.session || 'Nicht hinterlegt',
    position: 'top-left',
    variant: 'compact',
  });
  drawRoyalDownloadLabel(context, canvas.width, canvas.height, {
    text: pair.year || 'Nicht hinterlegt',
    position: 'top-right',
    variant: 'compact',
  });
  drawRoyalDownloadLabel(context, canvas.width, canvas.height, {
    title: 'Grosses Prinzenpaar',
    text: pair.largePair || 'Nicht hinterlegt',
    position: 'bottom-left',
  });
  if (pair.smallPair) {
    drawRoyalDownloadLabel(context, canvas.width, canvas.height, {
      title: 'Kleines Prinzenpaar',
      text: pair.smallPair,
      position: 'bottom-right',
    });
  }

  if (labelImage) {
    const labelWidth = Math.min(canvas.width * 0.29, 340);
    const labelHeight = (labelImage.height / labelImage.width) * labelWidth;
    const margin = Math.max(18, canvas.width * 0.02);
    const sessionOffset = Math.max(54, canvas.height * 0.06);
    context.drawImage(labelImage, margin, margin + sessionOffset, labelWidth, labelHeight);
  }

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return;

  const sessionPart = sanitizeFileNamePart(pair.session);
  const yearPart = sanitizeFileNamePart(pair.year);
  const fileName = `prinzenpaar-${sessionPart || 'unbekannt'}${yearPart ? `-${yearPart}` : ''}.png`;
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
}

function setupRoyalsLightbox(royals) {
  const lightbox = document.getElementById('royals-lightbox');
  const image = document.getElementById('royals-lightbox-image');
  const imageWrapper = image?.closest('.image-with-label');
  const details = document.getElementById('royals-lightbox-details');
  const downloadButton = document.getElementById('royals-lightbox-download');
  const closeButton = document.getElementById('royals-lightbox-close');
  const prevButton = document.getElementById('royals-lightbox-prev');
  const nextButton = document.getElementById('royals-lightbox-next');
  const backdrop = lightbox?.querySelector('[data-lightbox-close]');
  const gallery = document.getElementById('royals-grid');

  if (!lightbox || !image || !imageWrapper || !details || !downloadButton || !closeButton || !prevButton || !nextButton || !backdrop || !gallery) {
    return;
  }

  let currentIndex = 0;

  function setLightboxContent(index) {
    const safeIndex = ((index % royals.length) + royals.length) % royals.length;
    const pair = royals[safeIndex];
    currentIndex = safeIndex;
    imageWrapper.querySelector('.ai-label')?.remove();
    imageWrapper.querySelector('.royals-lightbox-fallback')?.remove();

    if (pair.hasImage) {
      image.hidden = false;
      image.src = pair.image.src || '';
      image.alt = pair.title || pair.session || 'Prinzenpaar';
      image.draggable = false;
      imageWrapper.classList.toggle('ai-protected-media', pair.image.ki || pair.image.teilweiseKi);
      downloadButton.hidden = false;
      downloadButton.disabled = false;
    } else {
      image.hidden = true;
      image.removeAttribute('src');
      image.alt = '';
      image.draggable = false;
      imageWrapper.classList.remove('ai-protected-media');
      imageWrapper.insertAdjacentHTML('beforeend', `<div class="royals-lightbox-fallback">${createRoyalFallbackMarkup(pair, { ariaHidden: false })}</div>`);
      downloadButton.hidden = true;
      downloadButton.disabled = true;
    }

    if (pair.hasImage && (pair.image.ki || pair.image.teilweiseKi)) {
      imageWrapper.insertAdjacentHTML('beforeend', `<img class="ai-label" src="./src/img/ki_labels/${pair.image.ki ? 'ki' : 'teilweise_ki'}_${pair.image.theme}.png" alt="${pair.image.ki ? 'KI-generiert' : 'Teilweise KI-generiert'}" draggable="false" />`);
    }

    if (pair.hasImage) {
      const sessionText = formatLightboxInlineText(pair.session);
      const yearText = formatLightboxInlineText(pair.year);
      const largePairText = formatTitledPairText(pair.largePair, 'Prinz', 'Prinzessin');
      const smallPairText = formatTitledPairText(pair.smallPair, 'Kinderprinz', 'Kinderprinzessin');
      const headingText = sessionText && yearText ? `${sessionText} (${yearText})` : sessionText || yearText;
      const detailParts = [headingText, largePairText, smallPairText].filter(Boolean);
      details.hidden = false;
      details.textContent = detailParts.join(' - ');
    } else {
      details.hidden = true;
      details.textContent = '';
    }
    return true;
  }

  function openLightbox(index) {
    setLightboxContent(index);
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }

  function goNext() {
    setLightboxContent(currentIndex + 1);
  }

  function goPrev() {
    setLightboxContent(currentIndex - 1);
  }

  gallery.addEventListener('click', (event) => {
    const item = event.target.closest('.royal-gallery-item');
    if (!item || !gallery.contains(item)) {
      return;
    }

    const itemIndex = Number(item.dataset.royalIndex || 0);
    openLightbox(itemIndex);
  });

  gallery.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const item = event.target.closest('.royal-gallery-item');
    if (!item || !gallery.contains(item)) {
      return;
    }

    event.preventDefault();
    const itemIndex = Number(item.dataset.royalIndex || 0);
    openLightbox(itemIndex);
  });

  nextButton.addEventListener('click', goNext);
  prevButton.addEventListener('click', goPrev);
  downloadButton.addEventListener('click', async () => {
    const pair = royals[currentIndex];
    if (!pair?.hasImage) return;

    downloadButton.disabled = true;

    try {
      await downloadRoyalImageWithOverlay(pair);
    } catch (error) {
      console.error('Royal download failed', error);
      downloadButton.disabled = false;
      return;
    }

    downloadButton.disabled = false;
  });
  closeButton.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') goNext();
    if (event.key === 'ArrowLeft') goPrev();
  });
}



