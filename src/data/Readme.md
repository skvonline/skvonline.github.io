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
