# 🐾 wooof

Ein gemütliches Hunde-Sammelspiel für den Browser – eine Mischung aus *Animal Crossing* und *Pokémon*. Du läufst durch eine kleine Welt (3/4-Ansicht), findest Hunde und freundest dich mit ihnen an.

## Lokal spielen / entwickeln

Voraussetzung: [Node.js](https://nodejs.org) installiert.

```bash
npm install   # einmalig: Bausteine herunterladen
npm run dev   # Entwicklungs-Server starten -> http://localhost:5173
```

## Bauen (für das Hosting)

```bash
npm run build     # erzeugt den fertigen Ordner "dist/"
npm run preview   # den fertigen Build lokal testen
```

## Technik

- [Phaser 3](https://phaser.io) – 2D-Spiel-Framework
- [Vite](https://vitejs.dev) – Entwicklungs-Server & Bundler
- Spielstände werden aktuell **lokal im Browser** gespeichert (localStorage).
  Echtes Cloud-Speichern mit Login folgt in einem späteren Schritt.

## Projektaufbau

```
public/assets/dogs/   Hunde-Bilder (z. B. dog1.png)
src/
  main.js             Startpunkt: Login -> Spiel starten
  login.js            Login-/Registrierungs-Bildschirm
  save.js             Konten & Spielstände (lokal)
  WorldScene.js       Die Spielwelt
  art.js              Platzhalter-Grafiken (im Code erzeugt)
```
