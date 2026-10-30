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

## Inhaltsverzeichnis

- [1) Globale Regeln für alle JSON-Dateien](#1-globale-regeln-für-alle-json-dateien)
- [2) Datei: `news.json`](#2-datei-newsjson)
- [3) Datei: `events.json`](#3-datei-eventsjson)
  - [3.3 Als ausverkauft markieren](#33-als-ausverkauft-markieren)
- [4) Datei: `vorstand.json`](#4-datei-vorstandjson)
- [5) Datei: `elferrat.json`](#5-datei-elferratjson)
- [6) Datei: `royals.json`](#6-datei-royalsjson)
- [7) Datei: `linktree.json`](#7-datei-linktreejson)
- [8) Datei: `gallerys/{xyz}.json`](#8-datei-gallerysxyzjson)
  - [8.6 Datei: `home-gallery-texts.json`](#86-datei-home-gallery-textsjson)
- [9) Datei: `header-notices.json`](#9-datei-header-noticesjson)
- [10) Datei: `faq.json`](#10-datei-faqjson)
- [11) Checkliste vor dem Speichern](#11-checkliste-vor-dem-speichern)
- [12) Minimale Komplettbeispiele (alle Dateien)](#12-minimale-komplettbeispiele-alle-dateien)
- [Kartenverkauf-FAQ und zeitgesteuerte Termine](#kartenverkauf-faq-und-zeitgesteuerte-termine)
- [Sandersdorfer Narrengipfel](#sandersdorfer-narrengipfel)
  - [Logo einsetzen](#logo-einsetzen)
  - [Betroffene Dateien](#betroffene-dateien)
  - [Bilder und Hochformatvideo](#bilder-und-hochformatvideo)
  - [Ausrichtung der Hauptseite](#ausrichtung-der-hauptseite)
  - [Gastvereinszitate pflegen](#gastvereinszitate-pflegen)
  - [Nächste Ausgabe optional bewerben](#nächste-ausgabe-optional-bewerben)
- [Veranstaltungs-Untermenü im Header](#veranstaltungs-untermenü-im-header)

## 1) Globale Regeln für alle JSON-Dateien

### 1.1 Dateiformat

- Kodierung: UTF-8
- Top-Level ist ein **Array** (`[...]`); Ausnahme: `narrengipfel.json` verwendet ein Objekt (`{...}`).
- Jedes Array-Element ist ein Objekt (`{...}`).
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

Die Bildreferenzen der folgenden älteren Datenformate verwenden ein `image`-Objekt mit `src`, `ki`, `teilweiseKi` und optional `theme`:

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

Die abweichenden Bildfelder des Narrengipfels (`logo`, `media` und Zitatbilder)
sind im Abschnitt „Sandersdorfer Narrengipfel“ beschrieben.

Die gleichen KI-Regeln gelten für `video`-Objekte in der Headergalerie.
Videoformat und Beispiele stehen in Abschnitt 8.

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
| `ausverkauft` | `boolean` | Optional | Nur `true` zeigt die Ausverkauft-Kennzeichnung; Details siehe Abschnitt 3.3. |
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

### 3.3 Als ausverkauft markieren

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

### 3.4 Vorlage

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
| `image`     | `object`                          | Optional | Bildobjekt (siehe globale Bildregeln). Ohne Bild bleibt der Eintrag sichtbar, aber ohne Lightbox. |
| `adultPair` | `array<object>`/`object`/`string` | Ja       | Großes Prinzenpaar.                 |
| `childPair` | `array<object>`/`object`/`string` | Optional | Kinderprinzenpaar.                  |

Zusätzliche Legacy-Felder werden ebenfalls erkannt (`Session`, `jahr`, `grossesPP`, `kleinesPP`, ...), sollten für neue
Daten aber nicht verwendet werden.

`image` darf bei Royals komplett fehlen. Alternativ darf ein `image`-Objekt ohne `src` verwendet werden. In beiden Fällen
wird das Prinzenpaar als Karte ohne Foto dargestellt.

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

### 6.5 Vorlage ohne Bild

```json
[
  {
    "session": "12. Session",
    "year": "1990/1991",
    "adultPair": [
      {
        "prince": "Max I.",
        "princess": "Maria I."
      }
    ],
    "childPair": [
      {
        "prince": "Tom I.",
        "princess": "Julia I."
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

### 8.1 Zweck und Wiedergabe

`gallerys/home-gallery.json` steuert die Headergalerie auf der Startseite.
Die Einträge erscheinen in der Reihenfolge im Array; Bilder und Videos können
beliebig gemischt werden. Nach dem letzten Eintrag beginnt die Galerie von vorn.
`gallerys/sponsors.json` unterstützt weiterhin ausschließlich Bilder.
Die sichtbaren Texte und ihre Layouts werden in `home-gallery-texts.json`
gepflegt und über `textId` den Bildern oder Videos zugeordnet (Abschnitt 8.6).

- Bilder bleiben jeweils zehn Sekunden sichtbar. Ein einzelnes Bild bleibt stehen.
- Videos starten automatisch und stumm, auf Mobilgeräten innerhalb der Seite.
- Erst nach dem Videoende folgt der nächste Eintrag; eine Dauer muss nicht eingetragen werden.
- Bei jedem erneuten Anzeigen startet das Video von vorn. Ein einzelnes Video wird wiederholt.
- Meldet der Browser einen Ladefehler oder lehnt die Wiedergabe ab, folgt nach fünf Sekunden der nächste Eintrag.

### 8.2 Felder pro Eintrag

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `image` | `object` | Für Bilder | Bildobjekt nach Abschnitt 1.5. |
| `video` | `object` | Für Videos | Nur Headergalerie: Videoobjekt nach Abschnitt 8.3. |
| `textId` | `string`  | Optional | Nur Headergalerie: `id` aus `home-gallery-texts.json`. |
| `alt` | `string` | Empfohlen | Kurze Beschreibung des Bild- oder Videoinhalts. Steht neben `image` bzw. `video`, nicht darin. |

Pro Eintrag entweder `image` oder `video` verwenden. Sind versehentlich beide
vorhanden und enthält `video.src` einen Pfad, wird das Video angezeigt.

Bei Bildern wird `alt` als Bildalternativtext verwendet, bei Videos als
`aria-label` und Fallback-Text. Ohne Beschreibung lautet der Ersatztext
`Bild aus der Home-Gallery` bzw. `Video aus der Home-Gallery`.
Der aktive Galerieeintrag ist für Screenreader zugänglich; inaktive Einträge
sind ausgeblendet. Der Alternativtext erscheint nicht als sichtbare Bildunterschrift.

### 8.3 Felder im `video`-Objekt

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `src` | `string` | Ja | Pfad zur Videodatei, z. B. `./src/img/gallerys/home-gallery/video1.mp4`. |
| `poster` | `string` | Optional | Pfad zu einem Vorschaubild, das vor der Wiedergabe angezeigt werden kann. |
| `ki` | `boolean` | Empfohlen | `true` für vollständig KI-generierte Videos, sonst `false`. |
| `teilweiseKi` | `boolean` | Empfohlen | `true` für teilweise KI-generierte Videos, sonst `false`. |
| `theme` | `string` | Bei KI-Label | `white` oder `black` bestimmt die Farbe des Labels. |

Videodateien können direkt unter `src/img/gallerys/home-gallery/` abgelegt werden.
`src` und `poster` sind Pfade relativ zur Startseite. Dateiname und
Groß-/Kleinschreibung müssen mit der abgelegten Datei übereinstimmen.

### 8.4 KI-Labels für Bilder und Videos

Die Kennzeichnung erscheint wie bei Bildern links oben auf dem Video.
Die Felder stehen innerhalb des jeweiligen `image`- oder `video`-Objekts.

| `ki` | `teilweiseKi` | `theme` | Ergebnis |
|------|--------------|---------|----------|
| `false` | `false` | Optional | Kein Label. |
| `true` | `false` | `white` oder `black` | Label „KI-generiert“. |
| `false` | `true` | `white` oder `black` | Label „Teilweise KI-generiert“. |

Beide Kennzeichnungen dürfen nicht gleichzeitig `true` sein. Bei einer solchen
Kombination oder fehlendem bzw. ungültigem `theme` wird kein Label angezeigt.
Die Farbe so wählen, dass das Label auf dem Inhalt gut erkennbar ist.

### 8.5 Vorlage mit Bild und Video

Die KI-Kennzeichnung und den Alternativtext passend zum tatsächlichen Inhalt setzen.
Das folgende Beispiel zeigt ein Bild und ein als teilweise KI-generiert markiertes
Video. `poster` ist optional und kann weggelassen werden.

```json
[
  {
    "alt": "Titelbild",
    "textId": "welcome",
    "image": {
      "src": "./src/img/gallerys/home-gallery/01.JPG",
      "ki": false,
      "teilweiseKi": false
    }
  },
  {
    "alt": "Beschreibung des Videoinhalts",
    "textId": "welcome",
    "video": {
      "src": "./src/img/gallerys/home-gallery/video1.mp4",
      "poster": "./src/img/gallerys/home-gallery/01.JPG",
      "ki": false,
      "teilweiseKi": true,
      "theme": "white"
    }
  }
]
```


### 8.6 Datei: `home-gallery-texts.json`

Pfad: `src/data/home-gallery-texts.json`

Diese Datei enthält ein Array wiederverwendbarer Textblöcke. Alle Formate werden
als reiner weißer Text horizontal und vertikal mittig angezeigt, ohne Kasten.
Topline, Headline bzw. Countdown und Subline unterscheiden sich in Größe und Gewicht.
Die Darstellung passt sich an kleine Bildschirme an.

Die Zuordnung erfolgt über die eindeutige `id`: In `home-gallery.json` steht
beispielsweise `"textId": "welcome"` neben `image` oder `video`.
Mehrere Medien dürfen dieselbe `textId` verwenden.

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `id` | `string` | Ja | Eindeutiger Schlüssel des Textblocks. |
| `format` | `string` | Empfohlen | Eines der sechs Formate aus der folgenden Tabelle. Standard: `headline-subline`. |
| `topline` | `string` | Je nach Format | Kleine Zeile oberhalb des Hauptinhalts, in Großbuchstaben dargestellt. |
| `headline` | `string` | Je nach Format | Große Überschrift. |
| `subline` | `string` | Je nach Format | Kleinere Beschreibung unter dem Hauptinhalt. |
| `countdown` | `string` | Bei Countdownformaten | Zielzeitpunkt ausschließlich im Format `JJJJ-MM-TT-HH:mm`, z. B. `2026-11-11-11:11`. |
| `text_id` | `string` | Bei Countdownformaten | `id` des Textblocks, der nach Ablauf angezeigt wird, z. B. `welcome`. |

#### Die sechs Formate

| Nr. | `format` | Angezeigte Felder in Reihenfolge |
|-----|----------|---------------------------------|
| 1 | `headline-subline` | Headline + Subline |
| 2 | `topline-headline` | Topline + Headline |
| 3 | `topline-headline-subline` | Topline + Headline + Subline |
| 4 | `countdown-subline` | Countdown + Subline |
| 5 | `topline-countdown` | Topline + Countdown |
| 6 | `topline-countdown-subline` | Topline + Countdown + Subline |

Nur die zum Format gehörenden Felder werden angezeigt. Fehlende oder leere
Textfelder werden ausgelassen. Unbekannte Formate verwenden `headline-subline`.
Texte werden als Klartext ausgegeben; HTML wird nicht interpretiert.
`\n` erzeugt einen Zeilenumbruch. `alt` im Galerieeintrag beschreibt weiterhin
unabhängig davon das Medium für Screenreader.

Die früheren Layoutfelder für Position, Breite und Hintergrund entfallen und
werden ignoriert. Bestehende `eyebrow`-, `title`- und `text`-Felder werden noch als
Ersatz für `topline`, `headline` und `subline` gelesen; neue Einträge sollten die
neuen Feldnamen und ein ausdrückliches `format` verwenden.

#### Countdown

- Anzeige: Tage, Stunden, Minuten und Sekunden als reine Zahlen mit Beschriftungen.
- Der sichtbare Countdown aktualisiert sich jede Sekunde und wird beim erneuten Anzeigen sofort neu berechnet.
- Der Zielzeitpunkt hat genau das Format `JJJJ-MM-TT-HH:mm`: Bindestriche zwischen Jahr, Monat, Tag und Stunde, Doppelpunkt vor den Minuten. Beispiel: `2026-11-11-11:11`.
- Die Uhrzeit wird in der lokalen Zeitzone des Browsers interpretiert. Sekunden oder Zeitzonenangaben sind nicht zulässig. Dieses Format gilt für den Galerie-Countdown; das Hinweisband behält sein bisheriges Datumsformat.
- Nach Ablauf wird der über `text_id` referenzierte Textblock angezeigt, einschließlich seines Formats. Der Wechsel erfolgt spätestens beim nächsten Sekundentakt, ohne das Bild oder Video neu zu starten. Ist der Countdown beim Laden bereits abgelaufen, erscheint sofort der Folgetext.
- Fehlt `text_id` oder existiert die angegebene ID nicht, bleibt der Countdown bei null stehen. Verweise auf weitere Countdowns sind möglich; bereits abgelaufene werden ebenfalls aufgelöst. Zirkuläre Verweise werden abgebrochen, der ursprüngliche Countdown bleibt dann bei null stehen.
- Bei fehlendem oder ungültigem Zielzeitpunkt erscheint „Countdown nicht verfügbar“.
- Der Countdown steuert nicht die Anzeigedauer: Bilder wechseln weiterhin nach zehn Sekunden, Videos nach ihrem Ende.

#### Beispiele für alle sechs Formate

Das folgende Array zeigt alle Varianten. Texte und Zielzeitpunkte passend zum
gewünschten Inhalt anpassen. Die Countdownbeispiele werden erst sichtbar, wenn
ihre `id` in `home-gallery.json` als `textId` zugeordnet wird.

```json
[
  {
    "id": "welcome",
    "format": "headline-subline",
    "headline": "Herzlich willkommen beim Sandersdorfer Karnevalsverein e.V.",
    "subline": "Tradition, Gemeinschaft und Stimmung – seit 1979 mitten in Sandersdorf."
  },
  {
    "id": "team",
    "format": "topline-headline",
    "topline": "Sandersdorfer Karnevalsverein e.V.",
    "headline": "Unser Präsident Gerd"
  },
  {
    "id": "strassenkarneval",
    "format": "topline-headline-subline",
    "topline": "Gemeinsam feiern",
    "headline": "Straßenkarneval in Sandersdorf",
    "subline": "Tradition, Gemeinschaft und Stimmung – mitten in Sandersdorf."
  },
  {
    "id": "countdown-subline",
    "format": "countdown-subline",
    "countdown": "2026-11-11-11:11",
    "text_id": "welcome",
    "subline": "Bis zur Sessions-Eröffnung am Rathaus Sandersdorf."
  },
  {
    "id": "topline-countdown",
    "format": "topline-countdown",
    "topline": "Die Session beginnt in",
    "countdown": "2026-11-11-11:11",
    "text_id": "welcome"
  },
  {
    "id": "session",
    "format": "topline-countdown-subline",
    "topline": "Die Session beginnt in",
    "countdown": "2026-11-11-11:11",
    "text_id": "welcome",
    "subline": "Am 11. November um 11:11 Uhr am Rathaus Sandersdorf."
  }
]
```

#### Vorbereitetes Countdownbeispiel

In `home-gallery-texts.json` ist der Textblock `session-countdown` bereits angelegt.
Sein Feld `"text_id": "welcome"` zeigt nach Ablauf den Begrüßungstext. Hier kann
die `id` jedes anderen Textblocks aus derselben Datei eingetragen werden.
`text_id` im Textblock bestimmt den Folgetext; `textId` im Galerieeintrag bestimmt
den ursprünglich zugeordneten Text.
Um ihn bei einem Bild oder Video anzuzeigen, dessen `textId` in `home-gallery.json`
auf `"session-countdown"` setzen. Beispiel für einen Galerieeintrag:

```json
{
  "alt": "Titelbild",
  "textId": "session-countdown",
  "image": {
    "src": "./src/img/gallerys/home-gallery/01.JPG",
    "ki": false,
    "teilweiseKi": false
  }
}
```

#### Wechsel und Ersatztexte

- Folgen Medien mit demselben sichtbaren Text und Format aufeinander, bleibt der Text ohne erneutes Einblenden stehen. Das gilt auch für gleiche Inhalte unter verschiedenen IDs und für identische Folgetexte abgelaufener Countdowns.

- Text und Medium wechseln gemeinsam. Bei Videos bleibt der zugeordnete Text bis zum Videoende sichtbar; läuft sein Countdown vorher ab, wird bereits während des Videos der Folgetext angezeigt.
- `"textId": null` blendet den sichtbaren Text für diesen Eintrag aus.
- Fehlt `textId` oder ist die ID unbekannt, wird der Block `welcome` verwendet.
- Fehlt auch `welcome` oder kann die Textdatei nicht geladen werden, erscheint der bisherige Begrüßungstext aus der Startseite.
- Nur der aktive Textblock ist sichtbar und für Screenreader zugänglich. Der Countdown wird nicht jede Sekunde automatisch vorgelesen.
- Die Galerie berücksichtigt die Höhe aller Textblöcke, damit nachfolgende Inhalte beim Wechsel nicht springen.

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
mit `./src/data/faqs/vorlage_faq.html` eine kopierbare Seitenvorlage bereit.

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
2. Top-Level ist ein Array; bei `narrengipfel.json` ein Objekt.
3. Pflichtfelder pro Dateityp sind befüllt.
4. Datumsformate stimmen (`TT.MM.JJJJ` bzw. `JJJJ-MM-TT-HH:mm`).
5. Alle Bild-, Video- und Vorschaubildpfade/URLs existieren bzw. sind erreichbar.
6. Bei `links`: Jeder Eintrag hat mindestens `url`.
7. `publishAt` liegt zeitlich vor `deleteAt` (wenn beide gesetzt).
8. Headergalerie: pro Eintrag `image` oder `video` verwenden und einen passenden `alt`-Text setzen.
9. KI-Labels: genau eine Kennzeichnung auf `true` setzen und `theme` angeben; ohne Label beide auf `false` setzen.
10. Headertexte: eindeutige IDs in `home-gallery-texts.json` vergeben und `textId` in `home-gallery.json` prüfen; für keinen Text ausdrücklich `null` verwenden.

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
    "alt": "Titelbild",
    "textId": "welcome",
    "image": {
      "src": "./src/img/gallerys/home-gallery/01.JPG",
      "ki": false,
      "teilweiseKi": false
    }
  },
  {
    "alt": "Beschreibung des Videoinhalts",
    "textId": "welcome",
    "video": {
      "src": "./src/img/gallerys/home-gallery/video1.mp4",
      "ki": false,
      "teilweiseKi": false
    }
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

---

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
HTML-Inhalt dient als Rückfall bei Ladefehlern und ohne JavaScript. Bei Änderungen
an Texten, Logo oder Markup die Rückfallansicht in `narrengipfel/index.html`
mit dem JSON und der dynamischen Darstellung abgleichen. Auch diese README bei
Änderungen an Datenpflege, Verhalten oder Darstellung aktualisieren.
Bei einer neuen Ausgabe zusätzlich die statischen Metadaten und Rückfalltexte
in beiden HTML-Dateien, den Termin in `events.json` und die Sitemap prüfen.

Die FAQ-Antworten können zentrale Eckdaten mit `{{date}}`, `{{year}}`,
`{{location}}`
und `{{email}}` übernehmen. Das vorhandene FAQ-Skript löst diese beim Laden auf.

### Logo einsetzen

Das quadratische Bild unter `src/img/` ablegen und in `narrengipfel.json`
`logo.src` (z. B. `/src/img/narrengipfel-logo.png`) und `logo.alt`
(z. B. `Logo des Sandersdorfer Narrengipfels`) ändern. Das Bild wird ohne
Beschnitt dargestellt. Aktuell wird
`/src/img/gallerys/narrengipfel/narrengipfel-logo.png` verwendet.
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
`src/data/events.json`, `src/data/faq.json`,
`src/img/gallerys/narrengipfel/narrengipfel-logo.png`.
Weitere Anpassungen: `src/js/elements/events.js`, `sitemap.xml`, diese Anleitung
und `src/REGRESSION.md`.

### Bilder und Hochformatvideo

Die Bildflächen werden in `narrengipfel.json` unter `media.hero`, `media.stage`
und `media.gallery` gepflegt. Das Hero-Bild verwendet nur `src` und `alt`;
eine Bildunterschrift wird dort nicht ausgegeben. Bühnen- und Galeriebilder
verwenden zusätzlich `caption` als sichtbare Bildunterschrift.
Zum Austausch die jeweils verwendeten Bildpfade und Texte ändern. Auf Wunsch
werden im Entwurf keine Platzhalterhinweise angezeigt. Archivmaterial vor der
Veröffentlichung durch die vorgesehenen Veranstaltungsaufnahmen ersetzen.

Das Video im Rückblick steht unter `review.video`: `provider`, `src` und `title`.
Beim Instagram-Embed wird kein `caption`-Feld verwendet.
Mit `provider: "instagram"` enthält `src` die öffentliche Reel-URL
(`https://www.instagram.com/reel/REEL_ID/`). Vor der Zustimmung wird nur eine lokale, kompakte Vorschau angezeigt. Der kurze
Hinweis nennt die Datenübertragung und mögliche Cookies; aufklappbare
„Details zum Datenschutz“ erläutern Anbieter, mögliche Verarbeitung in den USA,
Freiwilligkeit und Widerruf. Ein direkter Link zum Reel bleibt als Alternative
verfügbar, auch ohne JavaScript.

Erst „Instagram laden“ lädt das offizielle Instagram-Embed-Skript. Danach wird
der ursprüngliche Embed ohne zusätzliche Kartenumrandung angezeigt, maximal
340 Pixel breit; Instagram bestimmt die Höhe, Bedienelemente und Wiedergabe.
Die zusätzliche Beitragsbeschreibung (`data-instgrm-captioned`) wird weggelassen.
Die eigene Videosteuerung und das automatische Pausieren gelten hier nicht.
Bei Ladeproblemen erscheinen ein Hinweis und der direkte Instagram-Link.

Die Zustimmung wird nicht gespeichert und gilt nur für die aktuelle Seitenansicht.
„Einwilligung widerrufen“ entfernt Embed und zugehöriges Skriptelement und stellt
die Vorschau wieder her. Bereits übertragene Daten werden nicht zurückgeholt;
bereits ausgeführter Anbietercode kann durch Entfernen des Skriptelements nicht
rückwirkend ungeschehen gemacht werden.
Ohne `provider` kann weiterhin eine direkte MP4-URL mit dem eigenen Player
verwendet werden. Nur für diesen MP4-Player kann optional `caption` als
sichtbare Videobeschreibung ergänzt werden; ohne das Feld entfällt sie.
Eine leere `src` blendet den Videobereich aus.

### Ausrichtung der Hauptseite

Die Hauptseite stellt das Konzept, die Vereinsgemeinschaft, Bühnenmomente und
den Rückblick mit Bildern und Hochformatvideo vor. Organisatorische Einzelheiten
stehen im bestehenden FAQ. Der nächste Termin erscheint erst nach dem Rückblick
als optionaler, zeitgesteuerter Veranstaltungsbereich. Die Texte stehen unter `idea`, `stage`, `review`,
`next` und `join`; die Veranstaltungsdaten innerhalb von `next` dienen auch den FAQ-Antworten.

Der Hero enthält die Buttons „Teilnahme anfragen“ (E-Mail) und „Fragen zur
Teilnahme“ (FAQ). Der zusätzliche Teilnahmehinweis im Hero wurde entfernt;
ein Feld `participationNote` wird nicht mehr verwendet.

### Gastvereinszitate pflegen

Die Zitate stehen in `review.quotes` als Liste aus `text` und `club`. Optional
sind `logo` (lokaler Bildpfad für Vereinslogo oder Porträt), `initials` und
`colors` (bis zu drei Vereinsfarben) sowie `border` (optionaler Kreisrand).

Beispiel mit Bild:

```json
{
  "text": "Hier steht das freigegebene Zitat.",
  "club": "Name des Gastvereins",
  "logo": "/src/img/gastverein.png",
  "border": true,
  "colors": ["#0047AB"]
}
```

Beispiel nur mit Initialen und Vereinsfarben:

```json
{
  "text": "Hier steht das freigegebene Zitat.",
  "club": "Name des Gastvereins",
  "initials": "GV",
  "colors": ["#0047AB", "#FFFFFF", "#E30613"],
  "border": true
}
```

Pro Eintrag entweder `logo` oder `initials` mit `colors` verwenden.
Ein nicht leeres `logo` wählt ausschließlich die Bildansicht; zusätzlich gesetzte
Initialen werden ignoriert; `colors` wird im Bildmodus nur für den optionalen Rand verwendet. Bei einem Bildfehler erscheint ein neutraler
Strich statt eines automatischen Wechsels zu Initialen. Ohne `logo` werden die
Initialen mit den angegebenen Vereinsfarben dargestellt. Die optionale Liste
`colors` akzeptiert Hexfarben mit drei oder sechs Stellen (`#03A`, `#0047AB`)
und CSS-Farbnamen wie `blue`, `yellow` oder `white`.
Ungültige Werte werden ignoriert; höchstens die ersten drei gültigen Farben
werden verwendet. Eine Farbe ergibt einen einfarbigen Hintergrund, zwei oder
drei Farben einen diagonalen Verlauf (135 Grad). Ohne gültige Farben bleibt der
bisherige hellblaue Hintergrund. Bei Vereinsfarben stehen die Initialen direkt
auf dem Verlauf, weiß mit dezentem Textschatten und ohne schwarze Hinterlegung. Farbverläufe sind bereits im statischen HTML enthalten und funktionieren
auch ohne JavaScript. Tatsächliche Vereinsfarben werden redaktionell gepflegt.

Mit `"border": true` erhält der Kreis einen 2 Pixel breiten Rand in der ersten
gültigen Farbe aus `colors`. Ohne gültige Farbe wird SKV-Blau verwendet.
`false` oder ein fehlendes Feld bedeutet keinen Rand. Dies gilt sowohl für
Initialen als auch für Bilder. Der äußere Durchmesser bleibt 64 Pixel.
Bilder werden ohne Innenabstand kreisrund zugeschnitten (`object-fit: cover`);
nicht quadratische Bilder können dabei an den Rändern beschnitten werden.

Zitate und Bilder vor Veröffentlichung mit den jeweiligen Absendern abstimmen.
Eine separate Beispielzitat-Kennzeichnung und ein `placeholder`-Feld gibt es nicht.

Alle Einträge mit nicht leerem `text` und `club` werden berücksichtigt. Das
Karussell zeigt mit JavaScript jeweils ein Zitat in einer klar abgegrenzten
weißen Karte mit umlaufendem hellblauem Rand, kräftiger blauer Oberkante,
16-Pixel-Ecken und dezentem Schatten. Links steht eine 120 Pixel breite
Absenderspalte: ein 64-Pixel-Kreis mit Logo oder Initialen und direkt darunter
der zentrierte Vereinsname. Rechts daneben steht mit 24 Pixeln Abstand das
vertikal zur Absenderspalte zentrierte Zitat. Unter 600 Pixeln Breite bleiben
Absender und Zitat nebeneinander; die linke Spalte wird 88 Pixel breit und der
Abstand beträgt 12 Pixel. Lange Vereinsnamen werden umgebrochen.
Nur im Initialenmodus erscheinen `initials`; fehlt dieses
Feld, werden die Anfangsbuchstaben der ersten beiden Wörter des Vereinsnamens
verwendet. Logos werden mit Pfaden beginnend mit `/`, `./` oder `../` eingebunden,
auch vollständige HTTPS-Bildadressen werden unterstützt. Externe Bilder werden
beim Anzeigen direkt vom Anbieter geladen, ohne Referrer-Übermittlung; lokale
Pfade mit `/src/` vermeiden diese externe Anfrage. Logo und Initialen sind für
Screenreader dekorativ. Auch ohne JavaScript wird die gewählte Bild- oder
Initialenansicht ausgegeben.
Desktop: Pfeile seitlich, Positionsanzeige darunter. Bis 760 Pixel Breite stehen
beide Pfeile und die Positionsanzeige unterhalb; der Absender bleibt links.
Pfeilbuttons blättern umlaufend und manuell; es gibt keinen automatischen Wechsel.
Die Anzeige „1 / 2“ nennt die aktuelle Position. Buttons lassen sich per Tab und
Eingabe-/Leertaste bedienen, innerhalb des Karussells zusätzlich mit Links- und
Rechtspfeiltaste. Wechsel werden für Screenreader angekündigt; der Fokus bleibt
auf dem bedienten Element.

Bei einem Zitat entfallen Navigation und Positionsanzeige. Bei leerer oder
fehlender Liste entfällt der Bereich. Ohne JavaScript stehen alle Zitate
untereinander; die Steuerelemente bleiben verborgen. Die Höhe passt sich dem
Text an, auch längere Zitate werden vollständig dargestellt. Innenabstände
und Schriftgröße bleiben kompakt. Das dekorative blaue Anführungszeichen steht
rechts im Hintergrund, außerhalb des Textflusses: maximal 240 Pixel breit, unter
600 Pixeln Breite maximal 160 Pixel, jeweils mit 20 Prozent Deckkraft. Das
Anführungszeichen ist ein eingebettetes SVG ohne externe Bildanfrage und passt
sich proportional an die verfügbare Breite und Höhe an. Dadurch bleibt es auch
bei kurzen Zitaten vollständig sichtbar, ohne zusätzliche Leerfläche zu erzeugen.
Es bleibt auf den Zitatbereich begrenzt und für Screenreader ausgeblendet. Die Karte hat keine feste Höhe. Die Pfeilbuttons
behalten eine Bedienfläche von 44 × 44 Pixeln.

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
