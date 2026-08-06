# PR Portfolio

Ein redaktionelles, responsives Portfolio für Public Relations und Kommunikation. Die Website ist
komplett statisch, braucht keine Datenbank und kann kostenlos über GitHub Pages veröffentlicht werden.

## Lokal ansehen

Im Projektordner ein Terminal öffnen und starten:

```bash
python3 -m http.server 8000
```

Danach im Browser öffnen: [http://localhost:8000](http://localhost:8000)

## Inhalte ändern

Die regelmäßig zu ändernden Inhalte sind bewusst auf zwei kleine Dateien verteilt:

- `content/content.js`: Name, E-Mail, Texte, Akzentfarbe, Social-Links, Work und Clients
- `content/cv.js`: Berufserfahrung und Ausbildung

Die Dateien sind wie kleine Tabellen aufgebaut: Ein `{ ... }`-Block entspricht einer Zeile. Direkt
in beiden Dateien stehen Schritt-für-Schritt-Kommentare.

### Akzentfarbe ändern

In `content/content.js` den Wert `accentColor` als sechsstelligen HEX-Wert ändern:

```js
accentColor: "#1438f0",
```

### Neue Arbeit hinzufügen

1. In `content/content.js` einen Work-Block kopieren.
2. `id`, `client`, `name`, `summary`, `description`, `year`, `month`, `location` und die
   weiteren Felder ändern.
3. `coverTheme` und `coverVariant` auswählen. Ohne Foto erzeugt die Website automatisch ein
   eigenständiges, frei skalierbares Case-Cover.
4. Optional unter `instagram` einen verifizierten öffentlichen Post ergänzen. Er ersetzt das Cover
   erst nach der Zustimmung der Besucher:innen; davor bleibt eine lokale Sperrfläche sichtbar.
5. Unter `sources` verlässliche Projektquellen ergänzen. Sie erscheinen in der Detailansicht.
6. Speichern — die Arbeit erscheint automatisch chronologisch auf der Website.

Ein Instagram-Eintrag sieht so aus:

```js
instagram: {
  url: "https://www.instagram.com/p/POSTCODE/",
  // Optional: more separate, verified photo posts for an auto-rotating gallery:
  slides: ["https://www.instagram.com/p/SECOND-POST/"],
  account: "@marke",
  label: "Official campaign gallery",
  autoplayMs: 2000,
  detailAutoplayMs: 5000,
  // Mark a post that contains Instagram's own multi-image carousel:
  nativeCarousel: true,
  // Overview cards always stay 4:3; crop only that preview if needed:
  cardCrop: { scale: 1.425, y: 0 },
  // Native width-to-height ratio used in the detailed view:
  detailAspect: [4, 5],
},
```

Aus Sicherheitsgründen akzeptiert die Website ausschließlich direkte URLs auf öffentliche
`instagram.com/p/...`- oder `instagram.com/reel/...`-Posts. Normale Artikel- oder Bild-URLs werden
nicht eingebettet.

`cardCrop` changes only the non-interactive 4:3 preview in the Work grid. `detailAspect` controls the
uncropped detailed view and is written as `[width, height]`, for example `[4, 5]` for portrait photos
or `[3, 2]` for a landscape image. The dialog clips Instagram’s interface and provides a separate
“View on Instagram” link below the media.

`slides` contains additional, separate Instagram photo-post URLs for the same project. The website
cross-fades between those posts automatically after consent; the detail view also shows its own
previous/next controls below the image. `autoplayMs` sets the overview interval, while
`detailAutoplayMs` sets the slower detailed-view interval; both are limited to 0.8–15 seconds. This does not
control the child images inside one native Instagram carousel: Meta exposes no supported API for
selecting or automatically advancing those child slides. To rotate every individual image, obtain
portfolio permission and add the original files locally instead of downloading or hotlinking them
from Instagram.

Set `nativeCarousel: true` when the embedded post itself contains several images. Instagram’s
embedded interface remains non-interactive to prevent profile popups; visitors can use the separate
“View on Instagram” link to browse the native carousel. Those
controls are part of a cross-origin Instagram iframe: the static portfolio cannot remove, restyle,
count or synchronize them. A completely custom, Instagram-free carousel therefore requires
rights-cleared local image files.

Instagram preserves links such as `?img_index=2`, but its official `/embed/` view still initializes
on the first carousel image. Treating those URLs as separate slides would therefore repeat the same
image and is intentionally not supported here.

### Freigegebenes Projektfoto einsetzen

Ein Pressefoto ist nicht automatisch für eine öffentliche, selbstwerbliche Portfolio-Website
freigegeben. Die recherchierten Kandidaten und benötigten Freigaben stehen in
[`PROJECT_IMAGE_RIGHTS.md`](PROJECT_IMAGE_RIGHTS.md).

Erst nach schriftlicher Freigabe das Bild lokal unter `assets/images/` ablegen und im Work-Block
diese Felder ergänzen:

```js
image: "assets/images/mein-projekt.jpg",
imageRights: "cleared",
imageCredit: "Photo: Name / Rights holder",
imageAlt: "A precise description of what is visible",
```

For a press image whose supplied terms allow editorial reuse only, record that
restriction explicitly and keep the terms linked from the visible credit:

```js
imageRights: "editorial",
imageCredit: "Bildrechte: Rights holder · Foto: Photographer",
imageSource: "https://source-page-with-usage-terms.example",
imageUsage: "Editorial use only under the supplied usage conditions.",
```

For a publicly licensed image, use `licensed` and link both its source page and
the licence. If the overview crops the image, mention that modification in the
credit:

```js
imageRights: "licensed",
imageCredit: "Photo: Name · CC BY-SA 4.0 · responsive crop in overview",
imageSource: "https://source-page.example",
imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
imageLicenseLabel: "CC BY-SA 4.0 licence",
imageUsage: "Reusable under CC BY-SA 4.0 with attribution and modification notice.",
```

Empfohlen sind JPG oder WebP im Querformat 4:3, etwa 1600 × 1200 px und möglichst unter 700 KB.
Fehlen ein unterstützter `imageRights`-Wert, der Credit oder bei redaktionellen Pressebildern die
verlinkte Quelle, zeigt die Website aus Sicherheitsgründen weiter das grafische Case-Cover.

### Clients ändern

Im `CLIENTS`-Abschnitt von `content/content.js` Kundennamen und lokale Logo-Dateien pflegen.
Markenlogos sollten nur für tatsächlich betreute Kund:innen und mit den erforderlichen
Nutzungsrechten veröffentlicht werden.
löschen oder ergänzen. Jeder Name wird automatisch als schwarz-weiße Logo-Kachel dargestellt.

### Neue CV-Station hinzufügen

In `content/cv.js` einen vorhandenen Block kopieren, Werte ändern und speichern. `sortYear` steuert
die Reihenfolge. `period`, `role`, `organization`, `location` und `type` sind immer sichtbar.
Die Einträge in `details` bleiben zunächst verborgen und werden über den blauen Pfeil geöffnet.

## Persönliche Daten einsetzen

Die Beispieldaten sind bewusst Platzhalter. Vor der Veröffentlichung mindestens diese Werte in
`content/content.js` ersetzen:

- Vorname, Nachname und Initialen
- E-Mail und Standort
- About-Texte
- LinkedIn-/Instagram-Links
- Projektdaten und echte Kontaktdaten

Die CV-Stationen in `content/cv.js` basieren auf dem aktuellen Lebenslauf und können dort später
ergänzt oder aktualisiert werden.

Wenn ein PDF-Lebenslauf vorhanden ist, in den Ordner `assets/` legen und bei `cvUrl` zum Beispiel
`"assets/cv.pdf"` eintragen. Dann erscheint der Download-Link automatisch.

## Auf GitHub Pages veröffentlichen

1. Neues GitHub-Repository erstellen.
2. Alle Dateien in den Hauptbranch `main` hochladen.
3. Im Repository **Settings → Pages** öffnen.
4. Bei **Source** „Deploy from a branch“ wählen.
5. Branch `main` und Ordner `/ (root)` auswählen und speichern.

Für spätere Änderungen kann sie Dateien direkt auf GitHub öffnen, mit dem Stift-Symbol bearbeiten
und über **Commit changes** speichern. GitHub Pages aktualisiert die Website danach automatisch.

## Impressum und Datenschutz

Im Footer sind `impressum.html`, `datenschutz.html` und die Datenschutzeinstellungen dauerhaft
erreichbar. Die Texte sind auf die aktuelle statische GitHub-Pages-Variante ohne Analytics,
Formulare oder externe Fonts und mit optionalen Instagram-Einbettungen zugeschnitten.

Instagram ist standardmäßig vollständig gesperrt: Vor einer Zustimmung lädt die Seite weder
Iframe noch Vorschaubild, Script oder sonstige Meta-Ressourcen. Die Auswahl „Keep blocked“ oder
„Allow Instagram“ wird mit Zeitstempel und Richtlinienversion für höchstens 180 Tage im lokalen
Browser-Speicher hinterlegt. Beim Widerruf über „Privacy settings“ werden vorhandene Iframes sofort
entfernt. Die Logik liegt in `consent.js`; die Website verwendet kein allgemeines Cookie-Banner,
weil nur diese eine optionale externe Funktion eine Einwilligung benötigt.

Vor der Veröffentlichung müssen in `content/content.js` unter `legal` unbedingt Straße, Ort und
Telefon sowie die echte E-Mail ergänzt werden. Solange Angaben fehlen, zeigen die Rechtsseiten einen
deutlichen roten Hinweis.

Die Vorlagen ersetzen keine individuelle Rechtsberatung. Die Betreiberangaben müssen vor der
Veröffentlichung vollständig sein; außerdem sollten die Texte und die Instagram-Einbindung vor dem
Livegang fachlich geprüft werden. Bei Änderungen an Hosting, Analytics, Videos, Karten,
Kontaktformularen, Newsletter oder weiteren Social-Media-Einbettungen müssen die Hinweise erneut
geprüft und angepasst werden.

## Schriftart

Die Referenzseite nutzt „Neue Haas Grotesk Display Pro“. Weil es sich um eine kommerzielle Schrift
handelt, verwendet das Portfolio bis zum Erwerb einer Webfont-Lizenz den vorgesehenen Font-Stack mit
Helvetica Neue/Helvetica als lokalem Fallback. Es werden keine Schriften von Google, Wix oder anderen
Drittanbietern geladen. Hinweise zum späteren Einbinden einer lizenzierten Datei stehen in
`assets/fonts/README.md`.

## Mit Playwright prüfen

Playwright liegt in einer lokalen, von Git ignorierten virtuellen Umgebung. Bei laufendem lokalen
Server kann die komplette Prüfung erneut ausgeführt werden:

```bash
.venv/bin/python tests/inspect_site.py
```

Die Prüfung rendert Desktop und Mobil, testet Work-Dialog, Client-Kacheln, mobile Navigation,
Kachelspalten, CV-Daten, beide Rechtsseiten sowie den gesperrten, erlaubten und widerrufenen
Instagram-Zustand. Screenshots landen in `.playwright-artifacts/`.

## Struktur

```text
.
├── assets/
│   ├── fonts/           # Hinweise zur lizenzierten Schrift
│   └── images/          # Profilfoto, Textur und freigegebene Projektbilder
├── content/
│   ├── content.js       # Website- und Projekt-Tabelle
│   └── cv.js            # Lebenslauf-Tabelle
├── tests/
│   └── inspect_site.py  # Playwright-Prüfung
├── impressum.html
├── datenschutz.html
├── index.html
├── consent.js             # Lokale Instagram-Einwilligung und Ablaufdatum
├── PROJECT_IMAGE_RIGHTS.md # Bildrecherche und Freigabe-Checkliste
├── styles.css
└── script.js
```

## Hinweise

- 12 der 21 echten Cases enthalten einen aktuell erreichbaren, verifizierten Instagram-Post. Die übrigen neun nutzen
  weiterhin eigens gestaltete, skalierbare Cover.
- Die Website lädt keine externen Schriften oder JavaScript-Bibliotheken. Instagram-Iframes werden
  ausschließlich nach einer aktiven Zustimmung und erst in der Nähe des sichtbaren Bereichs geladen.
- Die Projektansicht, Filter, Navigation und Animationen sind mit Tastatur und reduzierter Bewegung
  kompatibel.
