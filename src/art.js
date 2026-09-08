// art.js
// -----------------------------------------------------------------------------
// "Kunst-Werkstatt": Hier erzeugen wir alle Platzhalter-Grafiken direkt im Code,
// damit wir (noch) keine externen Bilddateien brauchen. Später ersetzen wir
// diese Funktionen Stück für Stück durch echte Pixel-Art-Sprites.
//
// Jede Funktion malt etwas auf eine unsichtbare Zeichenfläche und speichert es
// als benannte "Textur" ab, die die Spielszene dann verwenden kann.
// -----------------------------------------------------------------------------

// Unsere gemütliche Farbpalette (retro-freundlich, warm)
export const PALETTE = {
  grass1: 0x6ab04c,
  grass2: 0x78c850,
  grassDetail: 0x5c9c3f,
  path: 0xd9b382,
  water: 0x5aa9e6,
  skin: 0xffcc99,
  hair: 0x6d4c41,
  shirt: 0xe94f64,
  pants: 0x3b5b9a,
  dogBody: 0xc9853f,
  dogBelly: 0xf0d9b5,
  dogNose: 0x2b2b2b,
  shadow: 0x000000,
};

const TILE = 32; // Größe einer Boden-Kachel in Pixeln

// Erzeugt zwei leicht unterschiedliche Gras-Kacheln für etwas Abwechslung.
function makeGrassTiles(scene) {
  for (const [name, base, alt] of [
    ["grass_a", PALETTE.grass1, PALETTE.grass2],
    ["grass_b", PALETTE.grass2, PALETTE.grass1],
  ]) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(base, 1);
    g.fillRect(0, 0, TILE, TILE);
    // ein paar kleine Grashalme als Muster
    g.fillStyle(PALETTE.grassDetail, 1);
    g.fillRect(6, 8, 2, 5);
    g.fillRect(20, 18, 2, 5);
    g.fillRect(13, 24, 2, 4);
    g.fillStyle(alt, 0.5);
    g.fillRect(24, 5, 3, 3);
    g.generateTexture(name, TILE, TILE);
    g.destroy();
  }
}

// Eine kleine Person, aus einfachen Formen zusammengesetzt (3/4-Ansicht).
function makePlayer(scene) {
  const w = 24;
  const h = 32;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  // weicher Schatten am Boden
  g.fillStyle(PALETTE.shadow, 0.18);
  g.fillEllipse(w / 2, h - 3, 18, 6);

  // Beine
  g.fillStyle(PALETTE.pants, 1);
  g.fillRoundedRect(6, 20, 5, 9, 2);
  g.fillRoundedRect(13, 20, 5, 9, 2);

  // Körper / Shirt
  g.fillStyle(PALETTE.shirt, 1);
  g.fillRoundedRect(5, 12, 14, 11, 4);

  // Kopf
  g.fillStyle(PALETTE.skin, 1);
  g.fillCircle(w / 2, 9, 7);

  // Haare
  g.fillStyle(PALETTE.hair, 1);
  g.fillEllipse(w / 2, 6, 15, 9);
  g.fillRect(5, 5, 14, 3);

  g.generateTexture("player", w, h);
  g.destroy();
}

// Ein niedlicher kleiner Hund (Platzhalter), 3/4-Ansicht.
function makeDog(scene) {
  const w = 26;
  const h = 22;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  // Schatten
  g.fillStyle(PALETTE.shadow, 0.18);
  g.fillEllipse(w / 2, h - 3, 20, 5);

  // Körper
  g.fillStyle(PALETTE.dogBody, 1);
  g.fillRoundedRect(4, 8, 16, 10, 5);

  // Kopf
  g.fillCircle(20, 9, 6);

  // Ohren
  g.fillStyle(PALETTE.dogBody, 1);
  g.fillEllipse(17, 4, 4, 6);
  g.fillEllipse(23, 4, 4, 6);

  // Schnauze / Bauch heller
  g.fillStyle(PALETTE.dogBelly, 1);
  g.fillEllipse(22, 11, 6, 5);

  // Nase
  g.fillStyle(PALETTE.dogNose, 1);
  g.fillCircle(24, 10, 1.5);
  // Auge
  g.fillCircle(20, 7, 1.3);

  // Beinchen
  g.fillStyle(PALETTE.dogBody, 1);
  g.fillRect(6, 16, 3, 5);
  g.fillRect(15, 16, 3, 5);

  // Schwanz
  g.fillRect(2, 9, 4, 3);

  g.generateTexture("dog", w, h);
  g.destroy();
}

// Ein kleiner Baum, damit die Welt nicht so leer wirkt.
function makeTree(scene) {
  const w = 40;
  const h = 52;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  g.fillStyle(PALETTE.shadow, 0.18);
  g.fillEllipse(w / 2, h - 4, 30, 8);

  // Stamm
  g.fillStyle(0x7b5133, 1);
  g.fillRoundedRect(w / 2 - 5, 28, 10, 20, 3);

  // Krone (mehrere Kreise für eine buschige Form)
  g.fillStyle(0x4e8c3a, 1);
  g.fillCircle(w / 2, 20, 18);
  g.fillStyle(0x5fa348, 1);
  g.fillCircle(w / 2 - 8, 16, 11);
  g.fillCircle(w / 2 + 9, 18, 12);
  g.fillCircle(w / 2, 10, 12);

  g.generateTexture("tree", w, h);
  g.destroy();
}

// Wird einmal beim Start aufgerufen und erzeugt alle Grafiken.
export function generateArt(scene) {
  makeGrassTiles(scene);
  makePlayer(scene);
  makeDog(scene);
  makeTree(scene);
}

export const TILE_SIZE = TILE;
