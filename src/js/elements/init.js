/*
 * Seiteninitialisierung nach dem Laden aller JavaScript-Teildateien.
 * Wählt anhand von body[data-page] die benötigten Komponenten und Element-Loader aus.
 */

window.SKV = window.SKV || {};
window.SKV.init = async function init() {
  const page = document.body.dataset.page;
  setupProtectedImages();

  if (page === 'home') {
    await loadComponent('header-component', './components/header.html');
    await loadComponent('footer-component', './components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    await setupHeaderNavigation(page);
    await loadHomeGallery();
    setupHeroCarousel();
    await loadHomeContent();
    return;
  }

  if (page === 'linktree') {
    await loadComponent('header-component', '../components/header.html');
    await loadComponent('footer-component', '../components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    setupLinktreeHeaderMode();
    await loadLinktreeContent();
    return;
  }

  if (page === 'narrengipfel') {
    await loadComponent('header-component', '../components/header.html');
    await loadComponent('footer-component', '../components/footer.html');
    normalizeComponentLinks(page);
    document.querySelector('.header .logo a')?.setAttribute('href', '../');
    await setupHeaderNoticeBar(page);
    await setupHeaderNavigation(page);
    await loadNarrengipfelContent();
    return;
  }

  if (page === 'legal') {
    await loadComponent('header-component', '../../components/header.html');
    await loadComponent('footer-component', '../../components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    await setupHeaderNavigation(page);
    setupTicketDatesVisibility();
    await loadFaqContent();
    setupFaqSearch();
    return;
  }

  if (page === 'downloads') {
    await loadComponent('header-component', '../components/header.html');
    await loadComponent('footer-component', '../components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    await setupHeaderNavigation(page);
    await loadDownloadsContent();
    return;
  }

  if (page === 'events-detail') {
    await loadComponent('header-component', '../components/header.html');
    await loadComponent('footer-component', '../components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    await setupHeaderNavigation(page);
    await loadEventDetailContent();
    return;
  }

  await loadComponent('header-component', '../components/header.html');
  await loadComponent('footer-component', '../components/footer.html');
  normalizeComponentLinks(page);
  await setupHeaderNoticeBar(page);
  await setupHeaderNavigation(page);
};
