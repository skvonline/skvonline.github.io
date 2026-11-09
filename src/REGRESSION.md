# Checkliste Regressionsabnahme Webseite

Diese Checkliste wird von oben nach unten abgearbeitet. Ein Punkt gilt erst als erledigt, wenn das erwartete Ergebnis sichtbar geprüft wurde.

## 1. Startseite

- [ ] Startseite lädt ohne Fehlermeldung.
- [ ] Browser-Tab zeigt einen sinnvollen SKV-Titel.
- [ ] Header ist sichtbar.
- [ ] Footer ist sichtbar.
- [ ] Header-Logo wird angezeigt.
- [ ] Keine kaputten Bildsymbole sind sichtbar.
- [ ] Umlaute und Sonderzeichen werden korrekt dargestellt.
- [ ] Browser-Konsole enthält keine relevanten Fehler.

## 2. Desktop-Navigation

- [ ] Klick auf das Header-Logo führt zur Startseite.
- [ ] Klick auf `Start` scrollt zum Hero-Bereich.
- [ ] Klick auf `Veranstaltungen` scrollt zum Veranstaltungsbereich.
- [ ] Klick auf `News` scrollt zum News-Bereich.
- [ ] Menüpunkt `Verein` zeigt ein Untermenü.
- [ ] Klick auf `Vorstand` scrollt zum Vorstand.
- [ ] Klick auf `Elferrat` scrollt zum Elferrat.
- [ ] Klick auf `Prinzenpaare` scrollt zu den Prinzenpaaren.
- [ ] Klick auf `Vereinshymne` öffnet `/hymne/`.
- [ ] Klick auf `Sponsoren` scrollt zum Sponsorenbereich.
- [ ] Klick auf `Downloads` öffnet `/downloads/`.
- [ ] Facebook-Link im Header öffnet Facebook in einem neuen Tab.
- [ ] Instagram-Link im Header öffnet Instagram in einem neuen Tab.

## 3. Header-Hinweisband

- [ ] Prüfen, ob ein rotes Hinweisband im Header sichtbar ist.
- [ ] Hinweistext ist vollständig lesbar.
- [ ] mehrere Hinweise sind sauber getrennt.
- [ ] Countdown zählt weiter.
- [ ] Falls nicht sichtbar: es bleibt kein leerer roter Bereich stehen.

## 4. Hero-Bereich

- [ ] Hero-Bereich ist sichtbar.
- [ ] Hero-Text ist lesbar.
- [ ] Hintergrundbilder werden angezeigt.
- [ ] Falls mehrere Galeriebilder vorhanden sind: Bildwechsel nach einigen Sekunden prüfen.
- [ ] Falls KI-Labels sichtbar sind: Labels sitzen korrekt und verdecken keine wichtigen Inhalte.

## 5. Veranstaltungen auf der Startseite

- [ ] Bereich `Unsere Termine und Veranstaltungen` ist sichtbar.
- [ ] Veranstaltungskarten werden angezeigt oder der Bereich bleibt ohne Layoutfehler leer.
- [ ] Jede sichtbare Veranstaltung hat einen Titel.
- [ ] Datum wird korrekt angezeigt, sofern gepflegt.
- [ ] Uhrzeit wird korrekt angezeigt, sofern gepflegt.
- [ ] Einlass wird korrekt angezeigt, sofern gepflegt.
- [ ] Preis wird korrekt angezeigt, sofern gepflegt.
- [ ] Ort wird korrekt angezeigt, sofern gepflegt.
- [ ] Veranstaltungsbilder werden angezeigt.
- [ ] Es gibt keine kaputten Veranstaltungsbilder.
- [ ] Link-Buttons innerhalb der Veranstaltungskarten funktionieren.
- [ ] Teilen-Button einer Veranstaltung anklicken.
- [ ] Erfolgsmeldung erscheint oder der Link wird in die Zwischenablage kopiert.
- [ ] Falls `Mehr Veranstaltungen laden` sichtbar ist: Button anklicken.
- [ ] Weitere Veranstaltungen werden ergänzt.
- [ ] Es entstehen keine doppelten Veranstaltungskarten.
- [ ] Wenn keine weiteren Veranstaltungen vorhanden sind, ist der Button verborgen.

## 6. Veranstaltungsdetailseite

- [ ] Von einer Veranstaltung die Detail-URL über den Teilen-Link öffnen.
- [ ] Detailseite `/veranstaltungen/?...` lädt ohne Fehler.
- [ ] Veranstaltungstitel wird angezeigt.
- [ ] Browser-Tab-Titel enthält den Veranstaltungstitel.
- [ ] Bild oder Fallback-Bild wird angezeigt.
- [ ] Datum wird korrekt angezeigt.
- [ ] Uhrzeit, Einlass, Preis und Ort werden korrekt angezeigt, sofern gepflegt.
- [ ] Beschreibung wird angezeigt, sofern gepflegt.
- [ ] Link-Buttons funktionieren.
- [ ] Klick auf `Zurück zu den Veranstaltungen` führt zum Veranstaltungsbereich der Startseite.
- [ ] `http://localhost:8000/veranstaltungen/` ohne Query öffnen.
- [ ] Meldung erscheint, dass keine Veranstaltung ausgewählt wurde.
- [ ] `http://localhost:8000/veranstaltungen/?ungueltig` öffnen.
- [ ] Meldung erscheint, dass die Veranstaltung nicht gefunden wurde.
- [ ] Zur Startseite zurückkehren.

## 7. News

- [ ] Zum Bereich `Aktuelles` scrollen.
- [ ] News-Karten werden angezeigt oder der Bereich bleibt ohne Layoutfehler leer.
- [ ] Jede sichtbare News hat einen Titel.
- [ ] Jede sichtbare News hat einen Text.
- [ ] Datum wird angezeigt, sofern gepflegt.
- [ ] News-Bilder werden angezeigt, sofern gepflegt.
- [ ] News ohne Bild sehen layoutstabil aus.
- [ ] Es gibt keine kaputten News-Bilder.
- [ ] Link-Buttons innerhalb der News funktionieren.
- [ ] Icon-Links führen zum richtigen Ziel.
- [ ] Falls `Mehr News laden` sichtbar ist: Button anklicken.
- [ ] Weitere News werden ergänzt.
- [ ] Es entstehen keine doppelten News-Karten.

## 8. Vorstand

- [ ] Zum Bereich `Unser Vorstand` scrollen.
- [ ] Vorstandstext ist sichtbar und lesbar.
- [ ] Alle sichtbaren Vorstandskarten haben ein Bild.
- [ ] Alle sichtbaren Vorstandskarten haben Name und Rolle.
- [ ] Vorstandskarten lassen sich anklicken oder fokussieren, falls interaktiv dargestellt.
- [ ] Details wie Tags, Beschreibung und Kontakt werden angezeigt.
- [ ] Kontaktlinks funktionieren.
- [ ] `mailto:`-Links öffnen ein Mailprogramm oder sind korrekt hinterlegt.
- [ ] Es gibt keine kaputten Vorstands-Bilder.

## 9. Elferrat

- [ ] Zum Bereich `Unser Elferrat` scrollen.
- [ ] Elferratskarten werden angezeigt.
- [ ] Jede sichtbare Karte hat ein Bild.
- [ ] Jede sichtbare Karte hat Name und Rolle.
- [ ] Es gibt keine kaputten Elferrats-Bilder.
- [ ] Kartenraster ist sauber ausgerichtet.

## 10. Prinzenpaare

- [ ] Zum Bereich `Prinzenpaare` scrollen.
- [ ] Prinzenpaar-Karten werden angezeigt.
- [ ] Einträge mit Bild zeigen das Bild korrekt.
- [ ] Einträge ohne Bild werden ohne Bildfehler dargestellt.
- [ ] Falls `Mehr Prinzenpaare laden` sichtbar ist: Button anklicken.
- [ ] Weitere Prinzenpaare werden ergänzt.
- [ ] Es entstehen keine doppelten Karten.
- [ ] Eine Prinzenpaar-Karte mit Bild anklicken.
- [ ] Lightbox öffnet sich.
- [ ] Bild wird groß angezeigt.
- [ ] Session, Jahr und Paarinformationen werden angezeigt.
- [ ] Klick auf `Weiter` zeigt das nächste Bild.
- [ ] Klick auf `Zurück` zeigt das vorherige Bild.
- [ ] Download-Button funktioniert.
- [ ] Lightbox per X schließen.
- [ ] Lightbox erneut öffnen.
- [ ] Lightbox per Escape schließen.
- [ ] Lightbox erneut öffnen.
- [ ] Lightbox per Klick auf den Hintergrund schließen.
- [ ] Nach dem Schließen ist die Seite wieder normal bedienbar.

## 11. Sponsoren

- [ ] Zum Bereich `Unsere Sponsoren` scrollen.
- [ ] Sponsorenlogos werden angezeigt.
- [ ] Es gibt keine kaputten Sponsorenbilder.
- [ ] Laufband bewegt sich sauber.
- [ ] Logos sind nicht verzerrt.
- [ ] Browserfenster leicht verkleinern und vergrößern.
- [ ] Laufband bleibt nach Größenänderung korrekt.

## 12. Footer

- [ ] Footer-Logos werden angezeigt.
- [ ] Link `Impressum` öffnet `/impressum/`.
- [ ] Zurück zur Startseite navigieren.
- [ ] Link `Datenschutz` öffnet `/datenschutz/`.
- [ ] Zurück zur Startseite navigieren.
- [ ] Link `Fotohinweise` öffnet `/fotohinweise/`.
- [ ] Zurück zur Startseite navigieren.
- [ ] Link `FAQ` öffnet `/faq/`.
- [ ] Zurück zur Startseite navigieren.
- [ ] Link `Kontakt` verwendet `mailto:info@skvonline.de`.

## 13. Downloads

- [ ] `/downloads/` öffnen.
- [ ] Seite lädt ohne JavaScript-Fehler.
- [ ] Header ist sichtbar.
- [ ] Footer ist sichtbar.
- [ ] Downloadliste wird angezeigt.
- [ ] Jeder Download hat einen Titel.
- [ ] Jeder Download zeigt einen Dateinamen.
- [ ] Jeder Download zeigt ein Dateityp-Badge.
- [ ] Beschreibung wird angezeigt, sofern gepflegt.
- [ ] Download-Button anklicken.
- [ ] Datei wird heruntergeladen oder im Browser geöffnet.
- [ ] Download-Link führt nicht zu einer 404-Seite.

## 14. Allgemeines FAQ

- [ ] `/faq/` öffnen.
- [ ] Seite lädt ohne JavaScript-Fehler.
- [ ] Header ist sichtbar.
- [ ] Footer ist sichtbar.
- [ ] FAQ-Kategorien werden geladen.
- [ ] Erste Kategorie öffnen.
- [ ] Fragen der Kategorie werden sichtbar.
- [ ] Eine Frage öffnen.
- [ ] Antwort wird sichtbar.
- [ ] Dieselbe Frage wieder schließen.
- [ ] Suchfeld anklicken.
- [ ] Nach `Muttizettel` suchen.
- [ ] Trefferanzahl wird angezeigt.
- [ ] Passende Fragen bleiben sichtbar.
- [ ] Nicht passende Fragen werden ausgeblendet.
- [ ] Mehrere Stichwörter in umgekehrter Reihenfolge liefern dieselben Treffer.
- [ ] `Getränke` und `Getraenke` liefern dieselben Treffer; ebenso `Straße` und `Strasse`.
- [ ] Suche über den X-Button leeren.
- [ ] Kategorien sind wieder nutzbar.
- [ ] Nach einem bewusst falschen Begriff suchen, z. B. `xyzabc`.
- [ ] Meldung für keine Treffer wird angezeigt.
- [ ] Button `Alle Fragen anzeigen` anklicken.
- [ ] Suche ist geleert und Fragen sind wieder verfügbar.
- [ ] `/faq/?Muttizettel` öffnen.
- [ ] Suchbegriff wird übernommen und Ergebnisse werden gefiltert.
- [ ] `/faq/?q=Parken` öffnen.
- [ ] Suchbegriff wird übernommen und Ergebnisse werden gefiltert.

## 15. FAQ Kartenverkauf

- [ ] `/faq/kartenverkauf/` öffnen.
- [ ] Seite lädt ohne JavaScript-Fehler.
- [ ] Header ist sichtbar.
- [ ] Footer ist sichtbar.
- [ ] FAQ-Fragen werden geladen.
- [ ] Eine Frage öffnen.
- [ ] Antwort wird sichtbar.
- [ ] Terminblock `Aktuelle Termine zum Kartenverkauf` prüfen.
- [ ] Falls Terminblock sichtbar ist: Termine sind fachlich aktuell.
- [ ] Falls Terminblock sichtbar ist: Uhrzeiten sind fachlich aktuell.
- [ ] Falls Terminblock sichtbar ist: Ort ist korrekt.
- [ ] Falls Terminblock nicht sichtbar ist: es bleibt kein leerer Bereich.
- [ ] Facebook-Link im Hinweisbereich funktioniert.
- [ ] Instagram-Link im Hinweisbereich funktioniert.

## 16. Vereinshymne

- [ ] `/hymne/` öffnen.
- [ ] Seite lädt ohne JavaScript-Fehler.
- [ ] Header ist sichtbar.
- [ ] Footer ist sichtbar.
- [ ] Inhalt der Hymnen-Seite ist vollständig sichtbar.
- [ ] Eingebundene Bilder, Medien oder Links funktionieren, sofern vorhanden.
- [ ] Zurück zur Startseite über Logo oder Navigation funktioniert.

## 17. Rechtliche Seiten

- [ ] `/impressum/` öffnen.
- [ ] Impressum lädt ohne Fehler.
- [ ] Header und Footer sind sichtbar.
- [ ] Inhalt ist vollständig sichtbar.
- [ ] E-Mail-Links funktionieren.
- [ ] `/datenschutz/` öffnen.
- [ ] Datenschutz lädt ohne Fehler.
- [ ] Header und Footer sind sichtbar.
- [ ] Inhalt ist vollständig sichtbar.
- [ ] `/fotohinweise/` öffnen.
- [ ] Fotohinweise laden ohne Fehler.
- [ ] Header und Footer sind sichtbar.
- [ ] Inhalt ist vollständig sichtbar.

## 18. Linktree

- [ ] `/linktree/` öffnen.
- [ ] Seite lädt ohne JavaScript-Fehler.
- [ ] SKV-Logo wird angezeigt.
- [ ] Linktree-Links werden geladen.
- [ ] Jeder Link hat sichtbaren Text.
- [ ] Jeder Link hat ein Icon.
- [ ] Interne Links funktionieren.
- [ ] Externe Links öffnen korrekt.
- [ ] Download-Links funktionieren, sofern vorhanden.
- [ ] Header zeigt auf der Linktree-Seite kein vollständiges Navigationsmenü.
- [ ] Falls ein Hinweisband aktiv ist: Hinweisband wird angezeigt.
- [ ] Falls kein Hinweisband aktiv ist: kein leerer Headerbereich sichtbar.
- [ ] Footer ist sichtbar.

## 19. Mobile Ansicht

- [ ] Browserbreite auf ca. 390 px stellen.
- [ ] Startseite neu laden.
- [ ] Kein horizontaler Scrollbalken sichtbar.
- [ ] Header bleibt bedienbar.
- [ ] Mobile Menübutton ist sichtbar.
- [ ] Mobile Menü öffnen.
- [ ] Mobile Menü schließen.
- [ ] Mobile Menü erneut öffnen.
- [ ] Untermenü `Verein` im mobilen Menü öffnen.
- [ ] Links im mobilen Menü funktionieren.
- [ ] Nach Klick auf einen Ankerlink schließt das mobile Menü.
- [ ] Hero-Text ist lesbar.
- [ ] Veranstaltungskarten passen in die Breite.
- [ ] News-Karten passen in die Breite.
- [ ] Vorstandskarten passen in die Breite.
- [ ] Elferratskarten passen in die Breite.
- [ ] Prinzenpaar-Lightbox passt in den Viewport.
- [ ] FAQ-Suche ist auf Mobile bedienbar.
- [ ] Downloadkarten sind auf Mobile bedienbar.
- [ ] Footer-Links sind auf Mobile lesbar und klickbar.

## 20. Tablet Ansicht

- [ ] Browserbreite auf ca. 768 px stellen.
- [ ] Startseite neu laden.
- [ ] Kein horizontaler Scrollbalken sichtbar.
- [ ] Header und Navigation sind layoutstabil.
- [ ] Kartenraster bricht sauber um.
- [ ] Texte laufen nicht aus Karten oder Buttons heraus.
- [ ] Lightbox ist bedienbar.
- [ ] FAQ-Seite bei Tabletbreite prüfen.
- [ ] Downloads-Seite bei Tabletbreite prüfen.

## 21. Tastaturbedienung

- [ ] Startseite öffnen.
- [ ] Mit Tab durch die Seite navigieren.
- [ ] Fokus ist sichtbar.
- [ ] Links und Buttons sind per Tastatur erreichbar.
- [ ] Mobile Menübutton ist per Tastatur bedienbar.
- [ ] FAQ-Kategorien sind per Tastatur bedienbar.
- [ ] FAQ-Fragen sind per Tastatur bedienbar.
- [ ] Prinzenpaar-Lightbox ist per Tastatur öffnbar.
- [ ] Lightbox ist per Escape schließbar.

## 22. Bildschutz und KI-Labels

- [ ] Rechtsklick auf ein Inhaltsbild testen.
- [ ] Kontextmenü wird bei geschützten Bildern verhindert.
- [ ] Bild per Drag-and-drop ziehen.
- [ ] Drag-and-drop wird bei geschützten Bildern verhindert.
- [ ] KI-generierte Bilder zeigen das passende KI-Label.
- [ ] Teilweise KI-generierte Bilder zeigen das passende Label.
- [ ] Bilder ohne KI-Markierung zeigen kein KI-Label.
- [ ] KI-Labels verdecken keine wichtigen Bildinformationen.

## 23. Nach Veröffentlichung

- [ ] Produktivseite öffnen: `https://www.skvonline.de/`
- [ ] Startseite lädt.
- [ ] Header und Footer laden.
- [ ] Veranstaltungen werden angezeigt.
- [ ] News werden angezeigt.
- [ ] FAQ öffnet und Suche funktioniert.
- [ ] Downloads öffnen und mindestens ein Download funktioniert.
- [ ] Impressum ist erreichbar.
- [ ] Datenschutz ist erreichbar.
- [ ] Linktree ist erreichbar.
- [ ] Mobile Produktivansicht kurz prüfen.
- [ ] Produktive Browser-Konsole enthält keine relevanten Fehler.

## 24. Sandersdorfer Narrengipfel

- [ ] `/narrengipfel` und `/faq/narrengipfel` sind erreichbar.
- [ ] Smartphone (320/390 px), Tablet (768 px) und Desktop (1440 px): kein
      horizontaler Überlauf; Texte, Datum und Handlungsaufforderungen sind lesbar.
- [ ] Hauptseite erklärt das Konzept; Datum 03. April 2027 erst nach dem Rückblick.
- [ ] Keine Einlasszeiten, Auftrittsplanung oder Ablauf-Timeline auf der Hauptseite; Details im FAQ.
- [ ] Hero bleibt ohne Terminangaben, Buttons und Breadcrumb-Zeile.
- [ ] Gegenseitige Seitenlinks und E-Mail-Kontakt funktionieren.
- [ ] Desktop- und mobiles Menü: Veranstaltungen → Narrengipfel / FAQ Narrengipfel.
- [ ] FAQ-Übersicht verlinkt den Narrengipfel; Veranstaltungsliste enthält den Termin.
- [ ] Sandersdorfer Narrengipfel-FAQ: 39 direkt zugängliche Fragen wie im Kartenverkauf-FAQ.
- [ ] Frage mit Tab fokussieren und mit Enter öffnen/schließen.
- [ ] Keine Suchleiste, Kategorie-Zwischenebene oder Verkaufsdetails.
- [ ] Kontaktbereich mit Social-Icons und Rücklink zur Veranstaltungsseite.
- [ ] Antworten enthalten aufgelöste Eckdaten statt `{{…}}`-Platzhaltern.
- [ ] Beide Seiten enthalten auch ohne JavaScript die vollständigen Inhalte.
- [ ] Individuelle Meta-Descriptions, Canonicals und gültige JSON-LD-Daten prüfen.
- [ ] Die Sitemap enthält die korrekten URLs.
- [ ] Preis, Anmeldestart und Anmeldeschluss bleiben als noch offen gekennzeichnet.
- [ ] Allgemeines FAQ, Kartenverkauf-FAQ, Downloads und Startseite funktionieren weiter.
- [ ] Browserkonsole und lokale Requests bleiben fehlerfrei.

### Prüfung nach Umstellung auf die bestehende JavaScript-Architektur

Beide Seiten unter normalen URLs und einem Projekt-Vorschaupfad getestet.
Bei 320, 390, 768 und 1440 px sind SKV-Header und -Footer gestaltet, das Logo
lädt und es gibt keinen horizontalen Überlauf. FAQ-Suche und Tastaturbedienung
funktionieren; keine Browserfehler oder fehlgeschlagenen Ressourcenanfragen.
Ein im Test geänderter JSON-Einlasswert erschien direkt auf der Seite, ohne
Build-Schritt. Die Prüfwerkzeuge liegen außerhalb des Projekts.

### Bilder und Video im Narrengipfel-Bereich

- [ ] Hero-Bild, Bühnenbild und drei Galeriefotos laden; keine Platzhalterhinweise sichtbar.
- [ ] Rückblick enthält einen nativen Videoplayer im Format 9:16.
- [ ] Video startet mit Ton beim Sichtbarwerden, soweit der Browser dies erlaubt; sonst Startbutton.
- [ ] Eigene Steuerung: Abspielen/Pause, Ton und Fortschritt per Tastatur bedienbar.
- [ ] Keine Standardsteuerung, keine Downloadlinks und kein Video-Kontextmenü.
- [ ] Herausscrollen pausiert; Hineinscrollen setzt die Wiedergabe fort.
- [ ] Video hat kein Poster und lässt sich über `review.video.src` ersetzen.
- [ ] Bildpfade, Alternativtexte und Beschriftungen sind in `media` pflegbar.
- [ ] Layout auch bei 320/390 px ohne horizontalen Überlauf.

Die Platzhalterbilder und Videowiedergabe wurden im lokalen Chromium geprüft,
einschließlich der normalen und projektbezogenen Vorschaupfade bei 320–1440 px.

### Optionale Bewerbung der nächsten Ausgabe

- [ ] Vorhandener `next`-Block innerhalb des Zeitfensters: Veranstaltungskarte mit Datum, Ort und Kontakt.
- [ ] Vor `publishAt` und ab `deleteAt` vollständig ohne leeren Abstand ausgeblendet.
- [ ] Ein fehlender oder auf `null` gesetzter `next`-Block blendet den Bereich aus.
- [ ] Ohne Datumsgrenzen wird ein vorhandener `next`-Block angezeigt.
- [ ] Ohne JavaScript bleibt der ungeprüfte Terminbereich ausgeblendet.
- [ ] Abschluss enthält Einladung, „Teilnahme anfragen“, FAQ-Link und Social-Icons; keine sichtbare E-Mail-Adresse.

Zeitgrenzen vor/ab Veröffentlichung und vor/ab Ausblendung wurden mit fixierter
Uhr geprüft; fehlende und unbegrenzte Konfigurationen ebenfalls.

- [ ] Aktive Veranstaltungsbewerbung: keine allgemeine Einladung zusätzlich sichtbar.
- [ ] Sonst: helle Einladung mit Teilnahme-Button, FAQ-Link und Social-Icons.

### Dynamisches Veranstaltungs-Untermenü

- [ ] Hover und Tastaturfokus auf „Veranstaltungen“ öffnen die Liste.
- [ ] Alle aktuell veröffentlichten Veranstaltungen erscheinen einschließlich Datum.
- [ ] Zukünftige und bereits ausgeblendete Einträge fehlen; ausverkaufte bleiben enthalten.
- [ ] Veranstaltungslinks öffnen die passenden Detailseiten.
- [ ] Mobile Liste lässt sich per Antippen öffnen/schließen und bei vielen Einträgen scrollen.
- [ ] Zugeklappte mobile Untermenüs werden per Tab übersprungen.
- [ ] Leere Liste oder Ladefehler lassen einen funktionierenden Übersichtslink zurück.
