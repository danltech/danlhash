# DanlTech BrowserHasher

**Stabiler Browser-Fingerprint (Hash) – rein clientseitig, keine externen Libraries**

🌐 Demo / Live: [brwsrhash.danltech.xyz](https://brwsrhash.danltech.xyz)  
📦 Repository für die Seite: dieses Repo (GitHub Pages)

---

## Was macht es?

Der **BrowserHasher** sammelt eine Reihe relativ stabiler Browser- und Geräte-Eigenschaften und berechnet daraus einen **SHA-256-Hash**.  

Bei gleichem Browser + gleichem Gerät (gleiche Hardware, gleiche Einstellungen) entsteht in der Regel derselbe Hash erneut.

### Ausgelesene Signale (u. a.)

| Kategorie       | Signale                                                                 |
|-----------------|-------------------------------------------------------------------------|
| User-Agent      | Vollständiger UA, geparster Browser + Version, OS                       |
| System          | Platform, Vendor, Language(s), Timezone, Timezone-Offset                |
| Bildschirm      | Breite/Höhe, Color Depth, Device Pixel Ratio                            |
| Hardware        | `hardwareConcurrency`, `deviceMemory`, `maxTouchPoints`                 |
| Canvas          | Deterministischer Canvas-Fingerprint (Text + Formen)                    |
| WebGL           | Vendor + Renderer (inkl. `WEBGL_debug_renderer_info` falls verfügbar)   |
| Audio           | OfflineAudioContext-Fingerprint                                         |

Alle Rohwerte werden auf der Seite sichtbar angezeigt.

---

## ⚠️ DSGVO / GDPR

Dieses Projekt dient **ausschließlich** zu Bildungs-, Demo- und Testzwecken.

Die automatisierte Identifikation von Nutzern **ohne ausdrückliche Einwilligung** ist nach DSGVO (und vergleichbaren Gesetzen) unzulässig.

Das embeddbare Script (`browserhasher.js`) gibt beim Laden **immer** eine deutliche Warnung in die Browser-Konsole aus.

**Verwende den Hash nicht 1:1 für Tracking, Profiling oder Werbung ohne Consent-Management und Rechtsprüfung.**

---

## Nutzung auf der eigenen Webseite

```html
<script src="https://brwsrhash.danltech.xyz/browserhasher.js"></script>
<script>
  DanlTechBrowserHasher.getHash().then(function (result) {
    console.log("Hash:", result.hash);
    // result.signals  → alle Rohdaten
    // result.payload  → der String, der gehasht wurde
  });
</script>
```

Oder lokal einbinden:

```html
<script src="./browserhasher.js"></script>
```

### API

```js
DanlTechBrowserHasher.getHash()
// → Promise<{
//     hash: string,      // SHA-256 Hex
//     signals: object,   // alle gesammelten Werte
//     payload: string    // deterministischer Input-String
//   }>
```

---

## HashDB (separates Repository – Idee)

Für eine öffentliche Sammlung von Hashes kannst du ein **zweites Repo** anlegen, z. B.:

`danltech/browserhasher-hashdb`

Vorschlag für die Struktur:

```
hashdb/
  ├── hashes.json          # oder einzelne Dateien pro Hash
  └── README.md
```

Beispiel-Eintrag:

```json
{
  "hash": "a1b2c3...",
  "comment": "Chrome 131 / Windows 11 / RTX 4070",
  "submittedAt": "2026-11-20",
  "optional": {
    "browser": "Chrome",
    "os": "Windows"
  }
}
```

Nutzer können per Pull-Request ihren Hash einreichen.  
Die Demo-Seite selbst speichert **nichts** serverseitig.

---

## GitHub Pages Setup

1. Dieses Repository als GitHub-Repo anlegen.
2. Unter **Settings → Pages** die Branch `main` (oder `gh-pages`) und den Ordner `/` (root) auswählen.
3. Optional Custom Domain: `brwsrhash.danltech.xyz`  
   → DNS CNAME auf `dein-username.github.io` zeigen lassen + in Repo die Datei `CNAME` anlegen.

Inhalt der Datei `CNAME`:

```
brwsrhash.danltech.xyz
```

---

## Technik

- **Reine Vanilla JavaScript** – keine npm-Pakete, keine CDNs, keine externen Scripts
- Hash: `crypto.subtle.digest("SHA-256", …)`
- Deterministischer Payload: sortierte Keys + `key=value|key=value|…`
- Funktioniert in allen modernen Browsern (Chrome, Firefox, Edge, Safari)

---

## Lizenz

MIT License – frei nutzbar, solange der DSGVO-Hinweis beachtet wird.

```
MIT License

Copyright (c) 2026 DanlTech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

Made with ❤️ by DanlTech
