# PR Portfolio

Statische Portfolio-Website ohne Framework, Build-Schritt oder externe Dienste.
Gehostet auf GitHub Pages.

## Lokal ansehen

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` im Browser öffnen. Ein Doppelklick auf `index.html`
genügt nicht, weil die Inhalte per JavaScript geladen werden.

## Inhalte ändern

Alle Texte, Projekte und Kundennamen stehen in `content/content.js`,
der Lebenslauf in `content/cv.js`. Beide Dateien sind einfache Tabellen –
Block kopieren, Werte zwischen den Anführungszeichen ersetzen, speichern.

### Akzentfarbe

Ganz oben in `content/content.js` bei `accentColor` den HEX-Wert ändern.

### Neue Arbeit hinzufügen

Einen kompletten `{...}`-Block in `PROJECTS` kopieren und anpassen. Pflichtfelder:

| Feld | Bedeutung |
| --- | --- |
| `id` | eindeutig, nur Kleinbuchstaben und Bindestriche |
| `name` | Titel in der Übersicht |
| `client` | Marke oder Auftraggeber |
| `category` | Disziplin, erscheint als Metazeile |
| `year`, `month` | steuern die Sortierung (neueste zuerst) |
| `description` | Fließtext in der Detailansicht |
| `services` | Liste der Leistungen |

Ohne freigegebenes Foto erzeugt die Seite automatisch ein gestaltetes Cover.
Dessen Aussehen steuern `coverTheme` und `coverVariant`.

### Projekte vorübergehend ausblenden

`hidden: true` in einem Projektblock nimmt ihn aus Übersicht, Zähler und
Detail-Navigation, lässt die Daten aber vollständig erhalten. Zum Reaktivieren
einfach die Zeile `hidden: true` entfernen.

### Freigegebenes Projektfoto einsetzen

Nur mit geklärten Rechten. Bild nach `assets/images/` legen und im Projektblock
ergänzen:

```js
image: "assets/images/mein-projekt.jpg",
imageAlt: "Kurze Bildbeschreibung",
imageRights: "cleared",        // oder "licensed" / "editorial"
imageCredit: "Fotograf:in / Rechteinhaber",
imageSource: "https://…",      // bei "editorial" verpflichtend
```

Die Angaben aus `imageCredit`, `imageSource` und `rightsNote` werden in der
Detailansicht mit ausgegeben – sie sind der auf der Seite sichtbare Rechtenachweis.

### Eigene Foto- und Video-Serien

Mehrere freigegebene Fotos und Videos werden über `media` eingebunden. Das
erste Element ist das große Leitmotiv in der Übersicht; deshalb dort immer das
Titelbild eintragen. Die ersten sechs Elemente bilden außerdem die bewegte
Dreier-Collage der Projektkarte. In der Detailansicht erscheinen alle Einträge
als Collage am Seitenanfang.

```js
mediaAutoplay: 1500,
media: [
  {
    type: "image",
    src: "assets/images/project-media/mein-projekt/cover.jpg",
    alt: "Kurze Bildbeschreibung",
    hero: true,
    size: "lg",
  },
  {
    type: "video",
    src: "assets/videos/project-media/mein-projekt/video-01.mp4",
    poster: "assets/images/project-media/mein-projekt/video-01-poster.jpg",
    alt: "Kurze Beschreibung des Videos",
    hero: true,
  },
],
```

Videos müssen als webtaugliche MP4-Dateien vorliegen; ein lokales Posterbild
verhindert leere Flächen, bevor das Video in den sichtbaren Bereich kommt.

### Clients und Lebenslauf

Kundennamen und Logos stehen in `CLIENTS` in `content/content.js`. Logos nur für
tatsächlich betreute Kund:innen und mit den nötigen Nutzungsrechten verwenden.

CV-Stationen in `content/cv.js`: `sortYear` steuert die Reihenfolge, die Punkte
unter `details` öffnen sich über den Pfeil.

Liegt ein PDF-Lebenslauf in `assets/`, bei `cvUrl` den Pfad eintragen – der
Download-Link erscheint dann automatisch.

## Persönliche Daten

Adresse und E-Mail stehen **nicht** im Repository. Sie liegen als
GitHub Secrets und werden beim Deploy direkt in die HTML-Dateien geschrieben
(`scripts/inject-legal.py`). Im Repository stehen nur Platzhalter.

Die Werte landen bewusst im Markup und nicht erst per JavaScript: § 5 DDG
verlangt, dass das Impressum „ständig verfügbar" ist – mit deaktiviertem
JavaScript stünden sonst nur Platzhalter dort. Die E-Mail-Adresse wird dabei als
HTML-Zeichenreferenzen (`&#103;&#101;…`) eingesetzt. Sie wird normal angezeigt,
bleibt klickbar und funktioniert ohne JavaScript, taucht aber nirgends im
Quelltext als Klartext auf – das stoppt einfache Adress-Sammler. Der Build
bricht ab, falls die Adresse doch im Klartext landet.

Das hält die Daten aus dem Quellcode und der Git-Historie heraus – auf der
veröffentlichten Seite sind sie weiterhin sichtbar, wie es § 5 DDG für das
Impressum verlangt.

Secrets unter **Settings → Secrets and variables → Actions**:

| Secret | Inhalt |
| --- | --- |
| `SITE_EMAIL` | Kontakt-E-Mail |
| `LEGAL_STREET` | Straße und Hausnummer |
| `LEGAL_POSTAL_CITY` | PLZ und Ort |
| `LEGAL_VAT_ID` | USt-IdNr. (optional) |
| `LEGAL_FULL_NAME` | Name im Impressum (optional) |
| `LEGAL_EDITORIAL_RESPONSIBLE` | Verantwortlich nach § 18 MStV (optional) |

Fehlt ein Secret, bleibt der Platzhalter stehen und die Rechtsseiten zeigen einen
roten Hinweis. Der Deploy schlägt deshalb nicht fehl.

## Veröffentlichen

Jeder Push auf `main` startet den Workflow `.github/workflows/deploy.yml`:
Dateien zusammenstellen → Secrets einsetzen → auf GitHub Pages veröffentlichen.

Einmalig nötig: **Settings → Pages → Source: GitHub Actions**.

Für kleine Textänderungen genügt es, die Datei direkt auf GitHub zu bearbeiten
und **Commit changes** zu klicken.

## Impressum und Datenschutz

Maßgeblich sind `impressum-de.html` und `datenschutz-de.html`; ein
deutschsprachiges Impressum ist für ein deutsches Unternehmen Pflicht, auch wenn
die Website englisch ist. `impressum.html` und `datenschutz.html` sind die
englischen Übersetzungen und verweisen auf die deutsche Fassung. Alle vier sind
im Footer verlinkt. Die Texte sind
auf die aktuelle Variante zugeschnitten: keine Analytics, keine Cookies, keine
Formulare, keine externen Schriften und keine eingebetteten Inhalte Dritter.

Die Vorlagen ersetzen keine Rechtsberatung. Sobald sich Hosting, Analytics,
Videos, Karten, Kontaktformulare oder Social-Media-Einbettungen ändern, müssen
beide Seiten erneut geprüft werden.

## Schriftart

Gestaltet mit „Neue Haas Grotesk Display Pro“. Die Schrift ist kommerziell und
darf nicht von einer fremden Website kopiert oder hotgelinkt werden. Bis eine
eigene Webfont-Lizenz vorliegt, greift automatisch der Font-Stack

```css
"Neue Haas Grotesk Display Pro", "Helvetica Neue", Helvetica, Arial, sans-serif
```

und damit die sehr ähnliche Systemschrift Helvetica Neue bzw. Helvetica. Nach
dem Erwerb einer Lizenz die WOFF2-Dateien unter `assets/fonts/` ablegen und am
Anfang von `styles.css` per `@font-face` einbinden. Es werden keine Schriften
von Drittanbietern geladen.

## Struktur

```text
.
├── .github/workflows/
│   └── deploy.yml          # Build und Deploy auf GitHub Pages
├── assets/
│   ├── images/             # Profilfoto und freigegebene Projektbilder
│   ├── logos/              # Kundenlogos
│   └── videos/             # Projektvideos
├── content/
│   ├── content.js          # Website- und Projekt-Tabelle
│   └── cv.js               # Lebenslauf-Tabelle
├── scripts/
│   └── inject-legal.py     # setzt die Impressumsdaten aus den Secrets ein
├── index.html
├── impressum.html
├── datenschutz.html
├── styles.css
└── script.js
```

## Hinweise

- Die Seite lädt keine externen Schriften, Skripte oder Einbettungen – beim
  Aufruf entsteht keine Verbindung zu Dritten.
- Projektansicht, Navigation und Animationen funktionieren mit Tastatur und
  respektieren „Bewegung reduzieren“.
- Bilder ohne geklärte Rechte gehören nicht ins Repository.
