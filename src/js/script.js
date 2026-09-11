/*
 * Zentraler JavaScript-Einstiegspunkt der Webseite.
 * Lädt die fachlichen Skriptdateien aus src/js/elements und startet danach die Seiteninitialisierung.
 */

(function () {
  const elementScripts = [
    'core.js',
    'header.js',
    'hero.js',
    'links.js',
    'events.js',
    'elferrat.js',
    'royals.js',
    'vorstand.js',
    'sponsors.js',
    'home.js',
    'downloads.js',
    'linktree.js',
    'faq.js',
    'init.js',
  ];

  const currentScript = document.currentScript;
  const baseUrl = currentScript ? new URL('./elements/', currentScript.src) : new URL('./elements/', window.location.href);

  async function loadScriptSource(fileName) {
    const url = new URL(fileName, baseUrl);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Skript konnte nicht geladen werden: ${fileName}`);
    }

    return `\n/* ${fileName} */\n${await response.text()}`;
  }

  Promise.all(elementScripts.map(loadScriptSource))
    .then((sources) => {
      Function(`${sources.join('\n')}\n//# sourceURL=${new URL('skv-elements.bundle.js', baseUrl).href}`)();

      if (window.SKV && typeof window.SKV.init === 'function') {
        return window.SKV.init();
      }
      throw new Error('SKV Initialisierung wurde nicht gefunden.');
    })
    .catch((error) => {
      console.error(error);
    });
})();

