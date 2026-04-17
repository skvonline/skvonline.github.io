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
| `image`     | `string`  | Optional        | Bildpfad. `./src/img/news/{Dateiname}`                                        |
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
    "image": "./src/img/veranstaltungenUndNews/weinfruehling.png",
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
| `image`       | `string` | Optional      | Bildpfad. `./src/img/events/{D-dateiname}`                               |
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
    "image": "./src/img/veranstaltungenUndNews/lumpenball.png",
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

Pfad: `src/data/vorstand.json`

### 4.1 Zweck

Darstellung der Vorstandskarten.

### 4.2 Felder pro Eintrag

| Feld          | Typ             | Pflicht | Beschreibung                                      |
|---------------|-----------------|---------|---------------------------------------------------|
| `name`        | `string`        | Ja      | Name der Person.                                  |
| `role`        | `string`        | Ja      | Rolle/Funktion.                                   |
| `image`       | `string`        | Ja      | Bildpfad. `./src/img/verein/vorstand/{dateiname}` |
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
    "image": "./src/img/verein/vorstand/gerd-ritter.png",
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
| `image` | `string` | Ja      | Bildpfad.`./src/img/{dateiname}` |

### 5.3 Vorlage

```json
[
  {
    "name": "Stephan Brühl",
    "role": "Umzugsminister",
    "image": "./src/img/verein/elferrat/stephan-bruehl.svg"
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
| `image`     | `string`                          | Ja       | Bildpfad.                           |
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
    "image": "./src/img/verein/prinzenpaare/pp2526.JPG",
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
| `src` | `string` | Ja       | Bildpfad. `./src/img/{xyz}/{dateiname}`           |
| `alt` | `string` | Optional | Alt-Text (Fallback: `Bild aus der Home-Gallery`). |

### 8.3 Vorlage

```json
[
  {
    "src": "./src/img/home-gallery/01.JPG",
    "alt": "Titelbild"
  }
]
```

---

## 10) Checkliste vor dem Speichern

1. JSON ist syntaktisch valide.
2. Top-Level ist ein Array.
3. Pflichtfelder pro Dateityp sind befüllt.
4. Datumsformate stimmen (`TT.MM.JJJJ` bzw. `JJJJ-MM-TT-HH:mm`).
5. Alle Bildpfade/URLs existieren bzw. sind erreichbar.
6. Bei `links`: Jeder Eintrag hat mindestens `url`.
7. `publishAt` liegt zeitlich vor `deleteAt` (wenn beide gesetzt).

---

## 11) Minimale Komplettbeispiele (alle Dateien)

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
    "image": "src/img/verein/vorstand/max-mustermann.png",
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
    "image": "./src/img/verein/elferrat/erika-muster.svg"
  }
]
```

### `royals.json`

```json
[
  {
    "session": "48. Session",
    "year": "2026/2027",
    "image": "./src/img/verein/prinzenpaare/pp2627.JPG",
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
    "src": "./src/img/home-gallery/01.JPG",
    "alt": "Titelbild"
  }
]
```

### `gallerys/sponsors.json`

```json
[
  {
    "src": "./src/img/sponsors/sponsor.png",
    "alt": "Sponsorname"
  }
]
```
