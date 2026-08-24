# JSON-Spezifikation (`src/data`)

Dieses Dokument beschreibt **alle JSON-Dateien** im Projekt, inklusive:

- erlaubte/erwartete Felder,
- Pflicht- und optionale Felder,
- Formatvorgaben,
- vollständige Formatvorlagen,
- Validierungs- und Pflegehinweise.

> Wichtig: Die Anwendung verarbeitet viele Felder "fehlertolerant". Das heißt: Manche Felder sind technisch optional,
> aber für sinnvolle Darstellung in der Webseite **fachlich Pflicht**.

---

## 1) Globale Regeln für alle JSON-Dateien

### 1.1 Dateiformat

- Kodierung: UTF-8
- Top-Level ist immer ein **Array** (`[...]`)
- Jedes Array-Element ist ein Objekt (`{...}`)
- Keine Kommentare in JSON (also kein `//` oder `/* ... */`)

### 1.2 Datums-/Zeitformate

Es gibt im Projekt zwei unterschiedliche Datumsformate:

1. **Anzeigeformat** (`date`):
    - `TT.MM.JJJJ`
    - Beispiel: `11.04.2026`

2. **Sichtbarkeitsfenster** (`publishAt`, `deleteAt`):
    - `JJJJ-MM-TT-HH:mm`
    - Beispiel: `2026-11-11-12:00`

### 1.3 Sichtbarkeitslogik (`publishAt` / `deleteAt`)

- `publishAt` gesetzt + Zeitpunkt liegt in der Zukunft → Eintrag wird **nicht** angezeigt.
- `deleteAt` gesetzt + Zeitpunkt ist erreicht/überschritten → Eintrag wird **nicht** angezeigt.
- Ungültiges Format wird ignoriert (wird dann behandelt wie „nicht gesetzt“).

### 1.4 Links

Link-Objekte verwenden i. d. R. dieses Muster:

```json
{
  "type": "instagram",
  "label": "Instagram",
  "url": "https://www.instagram.com/..."
}
```

Erlaubte/unterstützte `type`-Werte für News/Event-Buttons:

- `more`
- `instagram`
- `facebook`
- `tiktok`
- `mail`
- `maps`

Unbekannte `type`-Werte werden wie `more` behandelt.

---

### 1.5 Bildobjekte

Alle Bildreferenzen verwenden ein `image`-Objekt mit `src`, `ki`, `teilweiseKi` und optional `theme`:

```json
"image": {
  "src": "./src/img/beispiel.png",
  "ki": true,
  "teilweiseKi": false,
  "theme": "black"
}
```

- `ki` und `teilweiseKi` dürfen niemals gleichzeitig `true` sein; beide dürfen `false` sein.
- Sobald eines der beiden Felder `true` ist, ist `theme` mit `black` oder `white` verpflichtend.
- Wenn beide Felder `false` sind, ist `theme` optional.
- Gekennzeichnete Bilder erhalten links oben das passende Label und werden gegen Kontextmenü und Drag-and-drop geschützt.

## 2) Datei: `news.json`

Pfad: `src/data/news.json`

### 2.1 Zweck

Inhalte für den News-Bereich auf der Startseite.

### 2.2 Felder pro Eintrag

| Feld        | Typ       | Pflicht         | Beschreibung                                                                  |
|-------------|-----------|-----------------|-------------------------------------------------------------------------------|
| `title`     | `string`  | Ja (fachlich)   | Überschrift der News.                                                         |
| `date`      | `string`  | Ja (fachlich)   | Anzeige-Datum (`TT.MM.JJJJ`).                                                 |
| `text`      | `string`  | Ja (fachlich)   | News-Text.                                                                    |
| `image`     | `object`  | Optional        | Bildobjekt (siehe globale Bildregeln).                                        |
| `publishAt` | `string`  | Nicht Empfholen | Start der Sichtbarkeit (`JJJJ-MM-TT-HH:mm`).                                  |
| `deleteAt`  | `string`  | Ja (Fachlich)   | Ende der Sichtbarkeit (`JJJJ-MM-TT-HH:mm`). 365 Tage nach `date`              |
| `links`     | `array`   | Optional        | Liste von Link-Objekten.                                                      |
| `large`     | `boolean` | Optional        | Größere Karten-Darstellung (`true`/`false`). Wenn Bild vorhanden, dann `true` |

### 2.3 `links`-Objekt

| Feld    | Typ      | Pflicht  | Beschreibung                                |
|---------|----------|----------|---------------------------------------------|
| `type`  | `string` | Optional | Linktyp (siehe globale Liste).              |
| `label` | `string` | Optional | Beschriftung/Aria-Label.                    |
| `url`   | `string` | Ja       | Ziel-URL (`https://...` oder `mailto:...`). |

### 2.4 Vorlage

```json
[
  {
    "title": "Auftritt beim Weinfrühling in Sandersdorf",
    "date": "11.04.2026",
    "publishAt": "2026-04-08-08:00",
    "deleteAt": "2026-05-15-23:59",
    "text": "Unsere Tanzgruppen ...",
    "image": {
      "src": "./src/img/veranstaltungenUndNews/weinfruehling.png",
      "ki": false,
      "teilweiseKi": false
    },
    "links": [
      {
        "type": "more",
        "label": "Mehr erfahren",
        "url": "https://example.org"
      },
      {
        "type": "instagram",
        "label": "Instagram",
        "url": "https://instagram.com/..."
      },
      {
        "type": "mail",
        "label": "E-Mail",
        "url": "mailto:info@skvonline.de"
      }
    ],
    "large": true
  }
]
```

---

## 3) Datei: `events.json`

Pfad: `src/data/events.json`

### 3.1 Zweck

Veranstaltungen für den Event-Bereich auf der Startseite.

### 3.2 Felder pro Eintrag

| Feld          | Typ      | Pflicht       | Beschreibung                                                             |
|---------------|----------|---------------|--------------------------------------------------------------------------|
| `title`       | `string` | Ja (fachlich) | Titel der Veranstaltung.                                                 |
| `date`        | `string` | Ja (fachlich) | Datum (`TT.MM.JJJJ`).                                                    |
| `time`        | `string` | Empfohlen     | Uhrzeit (z. B. `19:11 Uhr`).                                             |
| `einlass`     | `string` | Optional      | Einlasszeit.                                                             |
| `preis`       | `string` | Optional      | Preisangabe.                                                             |
| `location`    | `string` | Empfohlen     | Veranstaltungsort.                                                       |
| `description` | `string` | Optional      | Zusatzbeschreibung.                                                      |
| `image`       | `object` | Optional      | Bildobjekt (siehe globale Bildregeln).                               |
| `publishAt`   | `string` | Empfohlen     | Start Sichtbarkeit (`JJJJ-MM-TT-HH:mm`).                                 |
| `deleteAt`    | `string` | Ja (Fachlich) | Ende Sichtbarkeit (`JJJJ-MM-TT-HH:mm`). Tag der Veranstaltung 23:59 Uhr. |
| `links`       | `array`  | Optional      | Links analog zu News.                                                    |

### 3.3 Vorlage

```json
[
  {
    "title": "1. Lumpenball",
    "date": "14.11.2026",
    "publishAt": "2026-09-01-00:00",
    "deleteAt": "2026-11-15-00:00",
    "time": "19:11 Uhr",
    "einlass": "18:11 Uhr",
    "preis": "19,50 €",
    "location": "Mehrzweckhalle Sandersdorf",
    "image": {
      "src": "./src/img/veranstaltungenUndNews/lumpenball.png",
      "ki": false,
      "teilweiseKi": false
    },
    "links": [
      {
        "type": "maps",
        "label": "Maps",
        "url": "https://maps.app.goo.gl/..."
      },
      {
        "type": "mail",
        "label": "E-Mail",
        "url": "mailto:info@skvonline.de"
      }
    ]
  }
]
```

---

## 4) Datei: `vorstand.json`

Pfad: `./src/data/vorstand.json`

### 4.1 Zweck

Darstellung der Vorstandskarten.

### 4.2 Felder pro Eintrag

| Feld          | Typ             | Pflicht | Beschreibung                                      |
|---------------|-----------------|---------|---------------------------------------------------|
| `name`        | `string`        | Ja      | Name der Person.                                  |
| `role`        | `string`        | Ja      | Rolle/Funktion.                                   |
| `image`       | `object`        | Ja      | Bildobjekt (siehe globale Bildregeln).                 |
| `tags`        | `array<string>` | Ja      | Schlagworte (mind. 1 empfohlen).                  |
| `description` | `string`        | Ja      | Kurzbeschreibung.                                 |
| `socials`     | `array<object>` | Ja      | Kontakt-Links.                                    |

### 4.3 `socials`-Objekt

| Feld        | Typ      | Pflicht | Beschreibung                   |
|-------------|----------|---------|--------------------------------|
| `label`     | `string` | Ja      | Name des Kanals.               |
| `href`      | `string` | Ja      | Linkziel (`mailto:` oder URL). |
| `className` | `string` | Ja      | CSS-Klasse (z. B. `liEmail`).  |
| `icon`      | `string` | Ja      | Symboltext (z. B. `@`).        |

### 4.4 Vorlage

```json
[
  {
    "name": "Gerd Ritter",
    "role": "Präsident",
    "image": {
      "src": "./src/img/verein/vorstand/gerd-ritter.png",
      "ki": false,
      "teilweiseKi": false
    },
    "tags": [
      "Repräsentation",
      "Vereinsleitung"
    ],
    "description": "Verantwortet die grundlegende Ausrichtung des Vereins.",
    "socials": [
      {
        "label": "E-Mail",
        "href": "mailto:gerd.ritter@skvonline.de",
        "className": "liEmail",
        "icon": "@"
      }
    ]
  }
]
```

---

## 5) Datei: `elferrat.json`

Pfad: `src/data/elferrat.json`

### 5.1 Zweck

Mitgliederliste des Elferrats.

### 5.2 Felder pro Eintrag

| Feld    | Typ      | Pflicht | Beschreibung                     |
|---------|----------|---------|----------------------------------|
| `name`  | `string` | Ja      | Name des Mitglieds.              |
| `role`  | `string` | Ja      | Funktion/Rolle.                  |
| `image` | `object` | Ja      | Bildobjekt (siehe globale Bildregeln). |

### 5.3 Vorlage

```json
[
  {
    "name": "Stephan Brühl",
    "role": "Umzugsminister",
    "image": {
      "src": "./src/img/verein/elferrat/stephan-bruehl.svg",
      "ki": false,
      "teilweiseKi": false
    }
  }
]
```

---

## 6) Datei: `royals.json`

Pfad: `src/data/royals.json`

### 6.1 Zweck

Prinzenpaare für Galerie + Lightbox.

### 6.2 Felder pro Eintrag

| Feld        | Typ                               | Pflicht  | Beschreibung                        |
|-------------|-----------------------------------|----------|-------------------------------------|
| `session`   | `string`                          | Ja       | Session-Text (z. B. `47. Session`). |
| `year`      | `string`                          | Ja       | Jahrgang (z. B. `2025/2026`).       |
| `image`     | `object`                          | Ja       | Bildobjekt (siehe globale Bildregeln).    |
| `adultPair` | `array<object>`/`object`/`string` | Ja       | Großes Prinzenpaar.                 |
| `childPair` | `array<object>`/`object`/`string` | Optional | Kinderprinzenpaar.                  |

Zusätzliche Legacy-Felder werden ebenfalls erkannt (`Session`, `jahr`, `grossesPP`, `kleinesPP`, ...), sollten für neue
Daten aber nicht verwendet werden.

### 6.3 Paar-Objekt (empfohlen)

```json
{
  "prince": "Dominik I.",
  "princess": "Lisa I."
}
```

### 6.4 Vorlage

```json
[
  {
    "session": "47. Session",
    "year": "2025/2026",
    "image": {
      "src": "./src/img/verein/prinzenpaare/pp2526.JPG",
      "ki": false,
      "teilweiseKi": false
    },
    "adultPair": [
      {
        "prince": "Dominik I.",
        "princess": "Lisa I."
      }
    ],
    "childPair": [
      {
        "prince": "Til I.",
        "princess": "Pauline I."
      }
    ]
  }
]
```

---

## 7) Datei: `linktree.json`

Pfad: `src/data/linktree.json`

### 7.1 Zweck

Links für die Linktree-Seite.

### 7.2 Felder pro Eintrag

| Feld   | Typ      | Pflicht  | Beschreibung                            |
|--------|----------|----------|-----------------------------------------|
| `icon` | `string` | Optional | Icon-Key, Standard: `website`.          |
| `text` | `string` | Ja       | Sichtbarer Linktext.                    |
| `url`  | `string` | Ja       | Ziel-URL oder relativer Pfad (`./...`). |

Unterstützte Icons:

- `website`
- `instagram`
- `facebook`
- `download`

### 7.3 Vorlage

```json
[
  {
    "icon": "website",
    "text": "Webseite",
    "url": "https://www.skvonline.de"
  },
  {
    "icon": "download",
    "text": "Anmeldung Umzug",
    "url": "./src/downloads/AnmeldungUmzugSandersdorf.pdf"
  }
]
```

---

## 8) Datei: `gallerys/{xyz}.json`

Pfad: `src/data/gallerys/{xyz}.json`

### 8.1 Zweck

Bildauflistung für Galerien.

### 8.2 Felder pro Eintrag

| Feld  | Typ      | Pflicht  | Beschreibung                                      |
|-------|----------|----------|---------------------------------------------------|
| `image` | `object` | Ja       | Bildobjekt (siehe globale Bildregeln).              |
| `alt` | `string` | Optional | Alt-Text (Fallback: `Bild aus der Home-Gallery`). |

### 8.3 Vorlage

```json
[
  {
    "image": {
      "src": "./src/img/home-gallery/01.JPG",
      "ki": false,
      "teilweiseKi": false
    },
    "alt": "Titelbild"
  }
]
```

---

## 9) Datei: `header-notices.json`

Pfad: `./src/data/header-notices.json`

### 9.1 Zweck

Wichtige Hinweise für das **rote Hinweisband im Header** (ganz oben auf jeder Seite).

### 9.2 Felder pro Eintrag

| Feld        | Typ      | Pflicht                                                                 | Beschreibung                                                              |
|-------------|----------|-------------------------------------------------------------------------|---------------------------------------------------------------------------|
| `text`      | `string` | Ja                                                                      | Hinweistext, der im Band angezeigt wird.                                  |
| `countdown` | `string` | Optional                                                                | Zielzeitpunkt (`JJJJ-MM-TT-HH:mm`) für einen Live-Countdown hinter `text`. |
| `publishAt` | `string` | Optional                                                                | Start Sichtbarkeit (`JJJJ-MM-TT-HH:mm`).                                  |
| `deleteAt`  | `string` | Wenn `countdown`, dann das Datum vom Countdown, sonst trotzdem Pflicht. | Ende Sichtbarkeit (`JJJJ-MM-TT-HH:mm`).                           |

### 9.3 Countdown-Regeln

- Wenn Restzeit **>= 1 Tag**: Anzeige in `Tage`, `Stunden`, `Minuten`
- Wenn Restzeit **< 1 Tag**: Anzeige in `Stunden`, `Minuten`, `Sekunden`
- Ist `countdown` gesetzt, sollte `deleteAt` identisch oder später als `countdown` sein.
- Läuft der Countdown ab, wird der komplette Hinweis sofort entfernt.
- Hinweise im Band werden visuell durch `+++` getrennt.

### 9.4 Vorlage

```json
[
  {
    "text": "xyz",
    "countdown": "2026-05-09-16:30",
    "publishAt": "2026-04-18-15:00",
    "deleteAt": "2026-05-09-16:30"
  }
]
```

---

## 10) Datei: `faq.json`

Pfad: `./src/data/faq.json`

### 10.1 Zweck

Kategorien, Fragen, Antworten und Stichwörter für das allgemeine FAQ. Die Reihenfolge der Kategorien und Fragen in der
Datei entspricht der Reihenfolge auf der FAQ-Seite. Antworten dürfen HTML für Absätze, Listen, Hervorhebungen und Links
enthalten.

### 10.2 Felder

| Feld            | Typ             | Pflicht | Beschreibung                                      |
|-----------------|-----------------|----------|---------------------------------------------------|
| `kategorie`     | `string`        | Ja       | Sichtbare Überschrift der Kategorie.              |
| `fragen`        | `array<object>` | Ja       | Fragen innerhalb dieser Kategorie.                |
| `frage`         | `string`        | Ja       | Text der Frage.                                   |
| `antwort`       | `string`        | Ja       | Antworttext; einfache HTML-Auszeichnung ist möglich. |
| `stichwoerter`  | `array<string>` | Ja       | Zusätzliche Begriffe für die FAQ-Suche.           |

### 10.3 Vorlage

```json
[
  {
    "kategorie": "Beispielkategorie",
    "fragen": [
      {
        "frage": "Wie lautet die Beispielfrage?",
        "antwort": "<p>Hier steht die Antwort.</p>",
        "stichwoerter": [
          "Beispiel",
          "Suche"
        ]
      }
    ]
  }
]
```

### 10.4 Spezial-FAQs

Spezial-FAQs ohne Kategorien und Stichwörter liegen unter `./src/data/faqs/`. Jeder Eintrag besteht ausschließlich aus
einer Frage und einer Antwort. `kartenverkauf.json` versorgt das FAQ zum Kartenverkauf. Für weitere Spezial-FAQs steht
mit `./src/data/faqs/dummy.html` eine kopierbare Seitenvorlage bereit.

```json
[
  {
    "frage": "Wie lautet die Beispielfrage?",
    "antwort": "<p>Hier steht die Antwort.</p>"
  }
]
```

---

## 11) Checkliste vor dem Speichern

1. JSON ist syntaktisch valide.
2. Top-Level ist ein Array.
3. Pflichtfelder pro Dateityp sind befüllt.
4. Datumsformate stimmen (`TT.MM.JJJJ` bzw. `JJJJ-MM-TT-HH:mm`).
5. Alle Bildpfade/URLs existieren bzw. sind erreichbar.
6. Bei `links`: Jeder Eintrag hat mindestens `url`.
7. `publishAt` liegt zeitlich vor `deleteAt` (wenn beide gesetzt).

---

## 12) Minimale Komplettbeispiele (alle Dateien)

### `news.json`

```json
[
  {
    "title": "Beispielnews",
    "date": "01.01.2027",
    "text": "Text der News",
    "publishAt": "2026-12-01-00:00",
    "deleteAt": "2027-01-31-23:59",
    "links": [
      {
        "type": "more",
        "label": "Mehr",
        "url": "https://example.org"
      }
    ]
  }
]
```

### `events.json`

```json
[
  {
    "title": "Beispielveranstaltung",
    "date": "11.11.2026",
    "time": "11:11 Uhr",
    "location": "Rathaus",
    "publishAt": "2026-10-01-00:00",
    "deleteAt": "2026-11-12-00:00"
  }
]
```

### `vorstand.json`

```json
[
  {
    "name": "Max Mustermann",
    "role": "Präsident",
    "image": {
      "src": "src/img/verein/vorstand/max-mustermann.png",
      "ki": false,
      "teilweiseKi": false
    },
    "tags": [
      "Leitung"
    ],
    "description": "Kurztext",
    "socials": [
      {
        "label": "E-Mail",
        "href": "mailto:max@example.org",
        "className": "liEmail",
        "icon": "@"
      }
    ]
  }
]
```

### `elferrat.json`

```json
[
  {
    "name": "Erika Muster",
    "role": "Programm",
    "image": {
      "src": "./src/img/verein/elferrat/erika-muster.svg",
      "ki": false,
      "teilweiseKi": false
    }
  }
]
```

### `royals.json`

```json
[
  {
    "session": "48. Session",
    "year": "2026/2027",
    "image": {
      "src": "./src/img/verein/prinzenpaare/pp2627.JPG",
      "ki": false,
      "teilweiseKi": false
    },
    "adultPair": [
      {
        "prince": "Max I.",
        "princess": "Mia I."
      }
    ]
  }
]
```

### `linktree.json`

```json
[
  {
    "icon": "website",
    "text": "Webseite",
    "url": "https://example.org"
  }
]
```

### `gallerys/home-gallery.json`

```json
[
  {
    "image": {
      "src": "./src/img/home-gallery/01.JPG",
      "ki": false,
      "teilweiseKi": false
    },
    "alt": "Titelbild"
  }
]
```

### `gallerys/sponsors.json`

```json
[
  {
    "image": {
      "src": "./src/img/sponsors/sponsor.png",
      "ki": false,
      "teilweiseKi": false
    },
    "alt": "Sponsorname"
  }
]
```

### `header-notices.json`

```json
[
   {
      "text": "Vorverkauf endet in:",
      "countdown": "2026-04-19-15:18",
      "publishAt": "2026-01-01-00:00",
      "deleteAt": "2026-04-19-15:18"
   }
]
```
