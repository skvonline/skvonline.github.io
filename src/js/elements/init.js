window.SKV = window.SKV || {};
window.SKV.init = async function init() {
  const page = document.body.dataset.page;
  setupProtectedImages();

  if (page === 'home') {
    await loadComponent('header-component', './components/header.html');
    await loadComponent('footer-component', './components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    setupMobileMenu();
    setupHeaderSmoothScroll();
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

  if (page === 'legal') {
    await loadComponent('header-component', '../../components/header.html');
    await loadComponent('footer-component', '../../components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    setupMobileMenu();
    setupHeaderSmoothScroll();
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
    setupMobileMenu();
    setupHeaderSmoothScroll();
    await loadDownloadsContent();
    return;
  }

  if (page === 'events-detail') {
    await loadComponent('header-component', '../components/header.html');
    await loadComponent('footer-component', '../components/footer.html');
    normalizeComponentLinks(page);
    await setupHeaderNoticeBar(page);
    setupMobileMenu();
    setupHeaderSmoothScroll();
    await loadEventDetailContent();
    return;
  }

  await loadComponent('header-component', '../components/header.html');
  await loadComponent('footer-component', '../components/footer.html');
  normalizeComponentLinks(page);
  await setupHeaderNoticeBar(page);
  setupMobileMenu();
  setupHeaderSmoothScroll();
};
