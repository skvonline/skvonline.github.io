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
