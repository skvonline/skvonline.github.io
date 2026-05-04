(function () {
  function createRoyalOverlayText(value, modifierClass) { return value ? `<span class="royal-gallery-overlay royal-gallery-overlay--${modifierClass}">${value || 'Nicht hinterlegt'}</span>` : ''; }
  function getRoyalField(entry, candidates) { const key = candidates.find((c) => entry[c] !== undefined && entry[c] !== null && String(entry[c]).trim() !== ''); return key ? entry[key] : ''; }
  function formatPairText(pairValue) {
    if (!pairValue) return '';
    if (typeof pairValue === 'string') return pairValue;
    if (Array.isArray(pairValue)) return pairValue.map((pair) => formatPairText(pair)).filter(Boolean).join('<br>');
    if (typeof pairValue === 'object') {
      const prince = pairValue.prince || pairValue.prinz || pairValue.Prinz || '';
      const princess = pairValue.princess || pairValue.prinzessin || pairValue.Prinzessin || '';
      if (prince && princess) return `${prince}<br>${princess}`;
      return prince || princess || '';
    }
    return '';
  }
  function normalizeRoyalEntry(entry) {
    const session = getRoyalField(entry, ['session', 'Session']);
    const year = getRoyalField(entry, ['year', 'jahr', 'Jahr']) || session;
    const largePair = getRoyalField(entry, ['adultPair', 'grossesPP', 'großesPP', 'Grosses PP', 'Großes PP', 'text']);
    const smallPair = getRoyalField(entry, ['childPair', 'kleinesPP', 'Kleines PP']);
    return { ...entry, session, year, largePair: formatPairText(largePair), smallPair: formatPairText(smallPair), image: entry.image || '', title: entry.title || session || 'Prinzenpaar' };
  }
  window.SKV = window.SKV || {};
  window.SKV.royals = { createRoyalOverlayText, normalizeRoyalEntry };
})();
