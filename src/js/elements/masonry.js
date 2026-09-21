/* Packt Karten mit unterschiedlichen Höhen in ein lückenarmes Raster. */
function setupMasonryGrid(gridId, cardSelector, { centerLastCard = false } = {}) {
  const grid = document.getElementById(gridId);
  if (!grid || !window.ResizeObserver) return;

  let frame = 0;
  const scheduleLayout = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const gridStyle = getComputedStyle(grid);
      const gap = parseFloat(gridStyle.columnGap) || 0;
      const cards = [...grid.querySelectorAll(cardSelector)];
      if (centerLastCard) {
        const columns = gridStyle.gridTemplateColumns.split(/\s+/).map(parseFloat).filter((width) => width > 0);
        const hasSingleLastCard = columns.length > 1 && cards.length % columns.length === 1;
        cards.forEach((card, index) => {
          const centered = hasSingleLastCard && index === cards.length - 1;
          card.classList.toggle('event-card--centered-last', centered);
          if (centered) {
            card.style.setProperty('--masonry-card-width', `${columns[0]}px`);
          } else {
            card.style.removeProperty('--masonry-card-width');
          }
        });
      }
      // Erst alle Höhen lesen, dann schreiben, um wiederholte Layouts zu vermeiden.
      const spans = cards.map((card) => Math.ceil(card.getBoundingClientRect().height + gap));
      cards.forEach((card, index) => {
        card.style.gridRowEnd = `span ${spans[index]}`;
      });
      grid.classList.add('grid--masonry');
    });
  };

  const resizeObserver = new ResizeObserver(scheduleLayout);
  resizeObserver.observe(grid);
  const observeCard = (node) => {
    if (node.nodeType === 1 && node.matches(cardSelector)) {
      resizeObserver.observe(node);
    }
  };
  [...grid.children].forEach(observeCard);

  new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach(observeCard);
      record.removedNodes.forEach((node) => {
        if (node.nodeType === 1) resizeObserver.unobserve(node);
      });
    });
    scheduleLayout();
  }).observe(grid, { childList: true });

  scheduleLayout();
}
