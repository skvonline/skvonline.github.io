# Veranstaltungen pflegen

Die Veranstaltungen werden in `events.json` gepflegt.

Mit `"ausverkauft": true` wird eine Veranstaltung auf der Startseite und ihrer
Detailseite als **Ausverkauft** gekennzeichnet. Mit `false` oder ohne das Feld
wird keine Kennzeichnung angezeigt. Die Veranstaltung und ihre Links bleiben
sichtbar.

Beispiel (Ausschnitt eines Eintrags):

```json
{
  "title": "1. Lumpenball",
  "ausverkauft": true,
  "date": "14.11.2026"
}
```

## Kartenverkauf-FAQ und zeitgesteuerte Termine

Die Fragen und Antworten stehen in `faqs/kartenverkauf.json`. Der Block
**Aktuelle Termine zum Kartenverkauf** wird dagegen direkt in
[`faq/kartenverkauf/index.html`](../../faq/kartenverkauf/index.html) gepflegt.
Seine Sichtbarkeit lässt sich über die Attribute der Section `.ticket-dates`
zeitlich steuern. Vollständige Vorlage mit Beispielterminen (vor jeder
Verkaufsrunde aktualisieren):

```html
<section
    class="ticket-dates"
    aria-labelledby="ticket-dates-title"
    data-publish-at="2026-09-04T00:00:00+02:00"
    data-delete-at="2026-11-24T00:00:00+01:00"
    hidden
>
    <h2 id="ticket-dates-title">Aktuelle Termine zum Kartenverkauf</h2>
    <div class="ticket-dates-list">
        <article class="ticket-date">
            <span class="ticket-date-step" aria-hidden="true">1</span>
            <h3>Beginn der Kartenvorbestellung</h3>
            <p data-todo="Datum und Uhrzeit aktualisieren">
                <time datetime="2026-09-23T18:00">23.09.2026 ab 18 Uhr</time>
            </p>
        </article>
        <article class="ticket-date">
            <span class="ticket-date-step" aria-hidden="true">2</span>
            <h3>Termine zur Abholung</h3>
            <ul data-todo="Abholtermine aktualisieren; weitere Termine als Listeneintrag ergänzen">
                <li>
                    <time datetime="2026-10-14T15:00">14.10.2026 von 15 bis 20 Uhr</time>
                </li>
                <li>
                    <time datetime="2026-10-15T15:00">15.10.2026 von 15 bis 20 Uhr</time>
                </li>
            </ul>
        </article>
        <article class="ticket-date">
            <span class="ticket-date-step" aria-hidden="true">3</span>
            <h3>Beginn des freien Verkaufs</h3>
            <p data-todo="Datum und Uhrzeit aktualisieren">
                <time datetime="2026-10-15T20:00">15.10.2026 ab 20 Uhr</time>
            </p>
        </article>
    </div>
    <p class="ticket-dates-location">Alle Termine finden im Sportis Sandersdorf statt.</p>
</section>
```

- `data-publish-at`: Ab diesem Zeitpunkt wird der gesamte Terminblock angezeigt.
- `data-delete-at`: Ab diesem Zeitpunkt wird der Block ausgeblendet. Inhalte
  werden dabei nicht gelöscht.
- Beide Angaben müssen gültig sein; der Veröffentlichungszeitpunkt muss vor
  dem Ausblendzeitpunkt liegen. Bei ungültigen Angaben bleibt der mit `hidden`
  versehene Block ausgeblendet. Das Attribut `hidden` daher beibehalten.
- Format: `JJJJ-MM-TTTHH:MM:SS±HH:MM`. Den Zeitzonenversatz für jeden Zeitpunkt
  passend setzen: in Deutschland `+02:00` während der Sommerzeit und `+01:00`
  während der Winterzeit. Ein Zeitraum kann beide Zeitzonenversätze enthalten,
  wie im Beispiel oben.

Im selben HTML-Block werden die Termine für Vorbestellung, Abholung und freien
Verkauf sowie der Veranstaltungsort geändert. Bei jedem `<time>`-Element sowohl
das `datetime`-Attribut als auch den sichtbaren Text aktualisieren; zusätzliche
Abholtermine können als weitere `<li>`-Einträge ergänzt werden.

Vor jeder Verkaufsrunde anpassen:

1. Anzeigezeitraum: `data-publish-at` und `data-delete-at`, jeweils mit passendem
   Zeitzonenversatz.
2. Beginn der Kartenvorbestellung: Datum und Uhrzeit in `datetime` und im Text.
3. Alle Abholtermine: Datum und Beginn in `datetime`, Datum sowie Beginn und Ende
   im sichtbaren Text. Nicht mehr benötigte Termine entfernen.
4. Beginn des freien Verkaufs: Datum und Uhrzeit in `datetime` und im Text.
5. Ort: Den Text in `.ticket-dates-location` prüfen und bei Bedarf ändern.

Die `data-todo`-Attribute sind nur Pflegehinweise. Sie steuern weder die Termine
noch deren Anzeige. Änderungen werden in der HTML-Datei vorgenommen; die Vorlage
in dieser README wird nicht von der Webseite geladen.

Die Zeitsteuerung betrifft den gesamten Terminblock, nicht einzelne Termine
oder die Fragen und Antworten aus der JSON. Sie wird beim Laden der Seite anhand
der Uhrzeit des Besuchergeräts geprüft; eine bereits geöffnete Seite muss für
einen Statuswechsel neu geladen werden.

## Sandersdorfer Narrengipfel

Die Seiten `/narrengipfel` und `/faq/narrengipfel` verwenden wie die übrige
Webseite HTML, CSS und JavaScript mit JSON-Inhalten. Es gibt keinen zusätzlichen
Build-Schritt und keine neuen Abhängigkeiten.

- `src/data/narrengipfel.json`: Texte der Hauptseite, Datum (`JJJJ-MM-TT`), Veranstaltungsort, Kontakt und Logo.
- `src/data/faqs/narrengipfel.json`: flache Liste aus `frage` und `antwort`,
  im gleichen Format wie das Kartenverkauf-FAQ. Antworten dürfen HTML enthalten.
- `src/js/elements/narrengipfel.js`: lädt die Inhalte über den bestehenden
  Skripteinstieg und die Seiteninitialisierung.
- `src/css/elements/narrengipfel.css`: Ergänzungen zum bestehenden SKV-Design,
  eingebunden über `style.css`, einschließlich der vorhandenen Header- und
  Footer-Styles.

Änderungen an der JSON-Datei werden beim Neuladen übernommen. Der statische
HTML-Inhalt dient als Rückfall bei Ladefehlern und kann direkt bearbeitet werden.
Bei einer neuen Ausgabe zusätzlich die statischen Metadaten und Rückfalltexte
in beiden HTML-Dateien, den Termin in `events.json` und die Sitemap prüfen.

Die FAQ-Antworten können zentrale Eckdaten mit `{{date}}`, `{{year}}`,
`{{location}}`
und `{{email}}` übernehmen. Das vorhandene FAQ-Skript löst diese beim Laden auf.

### Logo einsetzen

Das quadratische Bild unter `src/img/` ablegen und in `narrengipfel.json`
`logo.src` (z. B. `/src/img/narrengipfel-logo.png`) und `logo.alt`
(z. B. `Logo des Sandersdorfer Narrengipfels`) ändern. Das Bild wird ohne
Beschnitt dargestellt. Derzeit ist ein gekennzeichneter SVG-Platzhalter enthalten.
Für die Ansicht ohne JavaScript auch das Bild in `narrengipfel/index.html` ändern.

Ein ContentManager ist im vorliegenden Repository nicht enthalten. Die JSON-Dateien
bleiben die bestehende redaktionelle Schnittstelle. Eintrittspreis, Anmeldestart
und Anmeldeschluss sind noch offen. Die aktuellen Archivbilder und das Video
sind Entwurfsmaterial und werden vor Veröffentlichung ersetzt.

### Betroffene Dateien

Seiten: `narrengipfel/index.html`, `faq/narrengipfel/index.html`.
Integration: `src/js/script.js`, `src/js/elements/init.js`,
`src/js/elements/narrengipfel.js`, `src/js/elements/faq.js`, `src/css/style.css`
und `src/css/elements/narrengipfel.css`.
Inhalte: `src/data/narrengipfel.json`, `src/data/faqs/narrengipfel.json`,
`src/data/events.json`, `src/data/faq.json`, `src/img/narrengipfel-logo.svg`.
Weitere Anpassungen: `src/js/elements/events.js`, `sitemap.xml`, diese Anleitung
und `src/REGRESSION.md`.

### Bilder und Hochformatvideo

Die Bildflächen werden in `narrengipfel.json` unter `media.hero`, `media.stage`
und `media.gallery` gepflegt. Pro Bild: `src`, `alt` und `caption`.
Zum Austausch Bildpfad, Alternativtext und Bildunterschrift ändern. Auf Wunsch
werden im Entwurf keine Platzhalterhinweise angezeigt. Archivmaterial vor der
Veröffentlichung durch die vorgesehenen Veranstaltungsaufnahmen ersetzen.

Das 9:16-Video im Rückblick steht unter `review.video`: `src`, `title`,
`caption`. Aktuell dient das vorhandene SKV-Video als abspielbarer Platzhalter.
Das echte Hochformatvideo später unter `src` eintragen.
Eine leere `caption` blendet die Videobeschriftung aus.
Der Player hat kein Poster. Er versucht mit Ton zu starten, sobald er im sichtbaren Bereich
erscheint, und läuft dort in Endlosschleife. Blockiert der Browser Autoplay
mit Ton, startet das Video automatisch stumm. Der Ton lässt sich über die
eigene Steuerung einschalten. Nur wenn auch stummes Autoplay blockiert wird,
erscheint ein Startbutton. Außerhalb des Bildschirms oder bei
ausgeblendetem Tab pausiert er. Eigene Bedienelemente bieten Abspielen/Pause, Ton und eine Fortschrittsleiste.
Eine manuelle Pause bleibt bis zum erneuten Hineinscrollen bestehen.
Das Video füllt die 9:16-Fläche aus; abweichende Formate werden mittig beschnitten.
Es werden keine externen Bild- oder Videodienste verwendet.

### Ausrichtung der Hauptseite

Die Hauptseite stellt das Konzept, die Vereinsgemeinschaft, Bühnenmomente und
den Rückblick mit Bildern und Hochformatvideo vor. Organisatorische Einzelheiten
stehen im bestehenden FAQ. Der nächste Termin erscheint erst nach dem Rückblick
als optionaler, zeitgesteuerter Veranstaltungsbereich. Die Texte stehen unter `idea`, `stage`, `review`,
`next` und `join`; die Veranstaltungsdaten innerhalb von `next` dienen auch den FAQ-Antworten.

### Nächste Ausgabe optional bewerben

In `narrengipfel.json` steuert `next` den größeren Veranstaltungsbereich:

```json
"next": {
  "publishAt": "2026-10-21-00:00",
  "deleteAt": "2027-04-04-00:00",
  "eyebrow": "Das nächste Wiedersehen",
  "text": "Seid mit eurem Verein dabei!",
  "edition": "2. Sandersdorfer Narrengipfel",
  "date": "2027-04-03",
  "location": "Narrhalla zu Sandersdorf – Mehrzweckhalle Sandersdorf",
  "detailsUrl": "/veranstaltungen/?2027-04-03-18.30"
}
```

Ein fehlender oder auf `null` gesetzter `next`-Block blendet den Bereich vollständig
aus. `publishAt` und `deleteAt` verwenden dieselbe Zeitsteuerung wie vorhandene
Veranstaltungen: `JJJJ-MM-TT-HH:MM`, lokale Gerätezeit. Der Bereich erscheint ab
`publishAt` und verschwindet ab `deleteAt`. Leere oder weggelassene Datumsfelder
setzen keine Zeitgrenze. Die Prüfung erfolgt beim Laden/Neuladen der Seite.
Datum, Veranstaltungsnummer, Ort und der optionale Link `detailsUrl` stehen direkt in `next`.
Ohne `detailsUrl` entfällt nur der Link zu den Veranstaltungsdetails. Die Uhrzeiten
für die FAQ stehen in `src/data/faqs/narrengipfel.json`; die Veranstaltungsdetailseite
verwendet weiterhin `src/data/events.json`.
Der HTML-Rückfall enthält nur die allgemeine Einladung. Nach erfolgreicher
Zeitprüfung ersetzt die Bewerbung der nächsten Ausgabe diese Einladung.
Beide Bereiche werden nie gleichzeitig ausgegeben. Ohne JavaScript bleibt
die allgemeine Kontaktmöglichkeit erhalten.

Der Abschluss `join` verwendet nur noch `title` und `text`. Der Button „Teilnahme anfragen“ öffnet eine E-Mail an die zentrale Kontaktadresse.
FAQ-Link sowie Instagram- und Facebook-Icons werden automatisch ergänzt.

„Euer Verein gehört dazu“ erscheint ausschließlich, wenn die nächste Ausgabe
nicht beworben wird (vor Veröffentlichung, ab Ausblendung oder
fehlender `next`-Block). Die Einladung verwendet einen hellen Hintergrund mit
blauem Kontaktbutton und Social-Media-Icons.

Der Videoplayer bietet keine Downloadlinks oder Standard-Videosteuerung.
Kontextmenü, Picture-in-Picture und Remote Playback sind deaktiviert, soweit der
Browser dies unterstützt. Öffentlich ausgelieferte Videodateien sind technisch
weiterhin abrufbar; diese Maßnahmen stellen keinen Kopierschutz dar.

Das Narrengipfel-FAQ entspricht im Aufbau dem Kartenverkauf-FAQ: Einleitung,
direkt zugängliche Frage-Accordions und abschließender Kontaktbereich mit
Social-Icons. Es hat keine Suchleiste, keine Kategorie-Zwischenebene und keinen
Verkaufs-/Terminblock. Veranstaltungsplatzhalter in Antworten bleiben unterstützt.

## Veranstaltungs-Untermenü im Header

Das Untermenü unter „Veranstaltungen“ lädt dieselbe `events.json` wie die Startseite.
Es enthält alle aktuell über `publishAt` und `deleteAt` veröffentlichten Einträge,
auch ausverkaufte Veranstaltungen, sowie einen Link zur Veranstaltungsübersicht.
Die Reihenfolge entspricht der JSON-Datei. Datum und Uhrzeit bilden wie bei den
bestehenden Veranstaltungsdetails den Link `/veranstaltungen/?JJJJ-MM-TT-HH.MM`.
Ohne vollständige Detaildaten führt der Eintrag zur Veranstaltungsübersicht.
Bei leerer Liste oder Ladefehler bleibt der bisherige Veranstaltungslink erhalten.

Desktop: Untermenü per Hover oder Tastaturfokus. Mobil: per Antippen öffnen und
schließen; lange Listen sind scrollbar. Die Liste wird beim Seitenaufruf neu geladen
und anhand der vorhandenen Zeitsteuerung gefiltert.
