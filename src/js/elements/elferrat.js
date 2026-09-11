/*
 * Hilfslogik für die Elferrat-Darstellung.
 * Normalisiert Bildpfade aus alten und neuen Datenformaten.
 */

function getElferratImagePath(member) {
  const image = normalizeImage(member.image);
  if (image.src && image.src !== './src/img/dummy.svg') {
    return image.src;
  }

  const slug = member.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `./src/img/verein/elferrat/${slug}.png`;
}



