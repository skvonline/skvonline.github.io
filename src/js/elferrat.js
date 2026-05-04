(function () {
  function getElferratImagePath(member) {
    if (member.image && member.image !== './src/img/dummy.svg') return member.image;
    const slug = member.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `./src/img/verein/elferrat/${slug}.png`;
  }
  window.SKV = window.SKV || {}; window.SKV.elferrat = { getElferratImagePath };
})();
