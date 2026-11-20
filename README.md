# DanlTech BrowserHasher

**Stabiler Browser-Fingerprint · Komponenten-Hashes · HashDB-Vergleich**

🌐 Demo: [brwsrhash.danltech.xyz](https://brwsrhash.danltech.xyz)  
📦 HashDB (separates Repo): [github.com/danltech/hashdb1](https://github.com/danltech/hashdb1)

---

## Features

- Gesamt-Hash (SHA-256) + **5 Komponenten-Hashes** (Canvas, WebGL, Audio, Screen, Navigator)
- **HashDB-Vergleich** gegen die öffentliche DB unter `danltech/hashdb1`
- **PR-Generator** für neue Einträge
- Rein clientseitig, keine externen Libraries, Pure-JS-SHA256-Fallback

---

## HashDB

Liegt in einem **separaten Repository**:

| | |
|--|--|
| Repo | https://github.com/danltech/hashdb1 |
| Pages / API | https://danltech.github.io/hashdb1/index.json |
| Einträge | `entries/<id>.json` |
| Index | `index.json` (wird vom Workflow gebaut) |

### Automatisierung im HashDB-Repo

GitHub Actions Workflow **Process HashDB PRs**:

- **Manuell** triggerbar (Actions → Run workflow)
- **Täglich** um 06:00 UTC
- Merged **höchstens einen** gültigen PR pro Lauf (nur `entries/*.json`, JSON-Validierung)
- Baut danach `index.json` neu

### Eintrag einreichen

1. Auf der BrowserHasher-Seite „PR-Inhalt generieren“
2. Fork von `danltech/hashdb1` → Datei `entries/<id>.json`
3. Pull Request öffnen

---

## Einbindung

```html
<script src="https://brwsrhash.danltech.xyz/browserhasher.js"></script>
<script>
  DanlTechBrowserHasher.getHash().then(r => {
    console.log(r.hash, r.components);
  });
</script>
```

---

## DSGVO

Nur Bildungs-/Demo-Zwecke. Kein Tracking ohne Einwilligung.

## Lizenz

MIT
