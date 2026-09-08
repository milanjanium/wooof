// WorldScene.js
// -----------------------------------------------------------------------------
// Die Hauptszene: die kleine Welt, durch die du läufst.
// Lädt dein Hundebild (falls vorhanden), merkt sich deine Position und
// Spielzeit und speichert den Fortschritt automatisch.
// -----------------------------------------------------------------------------

import Phaser from "phaser";
import { generateArt, TILE_SIZE } from "./art.js";
import { loadGame, saveGame } from "./save.js";

const WORLD_COLS = 40;
const WORLD_ROWS = 30;

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super("WorldScene");
  }

  preload() {
    // Platzhalter-Grafiken (Gras, Figur, Baum, Ersatz-Hund) im Code erzeugen.
    generateArt(this);

    // Echtes Hundebild versuchen zu laden. Klappt es nicht (Datei fehlt),
    // merken wir uns das und nehmen den Platzhalter.
    this.dogImageOk = true;
    this.load.on("loaderror", (file) => {
      if (file.key === "dog1") this.dogImageOk = false;
    });
    this.load.image("dog1", import.meta.env.BASE_URL + "assets/dogs/dog1.png");
  }

  create() {
    this.save = loadGame();

    const worldWidth = WORLD_COLS * TILE_SIZE;
    const worldHeight = WORLD_ROWS * TILE_SIZE;

    // --- Boden ---
    for (let row = 0; row < WORLD_ROWS; row++) {
      for (let col = 0; col < WORLD_COLS; col++) {
        const key = (row + col) % 2 === 0 ? "grass_a" : "grass_b";
        this.add.image(col * TILE_SIZE, row * TILE_SIZE, key).setOrigin(0, 0);
      }
    }

    // --- Bäume ---
    this.obstacles = this.physics.add.staticGroup();
    const treeSpots = [
      [3, 3], [6, 4], [10, 2], [15, 3], [22, 2], [30, 4], [36, 3],
      [2, 10], [2, 18], [3, 25], [37, 12], [36, 20], [35, 26],
      [12, 27], [20, 26], [28, 27], [18, 12], [25, 16],
    ];
    for (const [col, row] of treeSpots) {
      const tree = this.obstacles.create(col * TILE_SIZE, row * TILE_SIZE, "tree");
      tree.body.setSize(16, 12);
      tree.body.setOffset(12, 38);
      tree.setDepth(tree.y);
    }

    // --- Spielfigur (an gespeicherter Position, sonst in der Mitte) ---
    const startX = this.save.x ?? worldWidth / 2;
    const startY = this.save.y ?? worldHeight / 2;
    this.player = this.physics.add.sprite(startX, startY, "player");
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(16, 10);
    this.player.body.setOffset(4, 20);
    this.physics.add.collider(this.player, this.obstacles);

    // --- Ein erster Hund ---
    const dogKey = this.dogImageOk && this.textures.exists("dog1") ? "dog1" : "dog";
    this.dog = this.physics.add.sprite(startX + 90, startY + 40, dogKey);
    if (dogKey === "dog1") {
      // Das große Bild auf eine hübsche Spielgröße bringen (Seitenverhältnis halten).
      const targetHeight = 54;
      this.dog.setScale(targetHeight / this.dog.height);
    }
    this.dog.setCollideWorldBounds(true);
    this.physics.add.collider(this.dog, this.obstacles);
    this.pickNewDogTarget();

    // --- Kamera ---
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);

    // --- Steuerung ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D");

    // --- Begrüßung ---
    this.addHint("Lauf mit Pfeiltasten / WASD  ·  Sag hallo zum Hund! 🐾");

    // --- Automatisches Speichern ---
    // Spielzeit hochzählen
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.save.playSeconds = (this.save.playSeconds || 0) + 1;
      },
    });
    // alle 5 Sekunden speichern
    this.time.addEvent({ delay: 5000, loop: true, callback: () => this.persist() });
    // beim Schließen des Tabs speichern
    this._onUnload = () => this.persist();
    window.addEventListener("beforeunload", this._onUnload);
    // beim Beenden der Szene aufräumen
    this.events.once("shutdown", () => {
      this.persist();
      window.removeEventListener("beforeunload", this._onUnload);
    });
  }

  // Aktuellen Stand in den Speicher schreiben.
  persist() {
    if (!this.player) return;
    this.save.x = Math.round(this.player.x);
    this.save.y = Math.round(this.player.y);
    saveGame(this.save);
  }

  addHint(text) {
    const label = this.add
      .text(this.scale.width / 2, 24, text, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "13px",
        color: "#ffffff",
        backgroundColor: "rgba(26,28,44,0.75)",
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(10000);
    this.tweens.add({
      targets: label,
      alpha: 0,
      delay: 5000,
      duration: 1200,
      onComplete: () => label.destroy(),
    });
  }

  pickNewDogTarget() {
    const worldWidth = WORLD_COLS * TILE_SIZE;
    const worldHeight = WORLD_ROWS * TILE_SIZE;
    this.dogTarget = new Phaser.Math.Vector2(
      Phaser.Math.Between(80, worldWidth - 80),
      Phaser.Math.Between(80, worldHeight - 80)
    );
    this.time.delayedCall(Phaser.Math.Between(2000, 5000), () =>
      this.pickNewDogTarget()
    );
  }

  update() {
    const speed = 130;
    const body = this.player.body;
    body.setVelocity(0);

    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;

    if (left) body.setVelocityX(-speed);
    else if (right) body.setVelocityX(speed);
    if (up) body.setVelocityY(-speed);
    else if (down) body.setVelocityY(speed);
    body.velocity.normalize().scale(speed);

    if (left) this.player.setFlipX(true);
    else if (right) this.player.setFlipX(false);

    this.player.setDepth(this.player.y);
    this.dog.setDepth(this.dog.y);

    if (this.dogTarget) {
      const d = Phaser.Math.Distance.Between(
        this.dog.x, this.dog.y, this.dogTarget.x, this.dogTarget.y
      );
      if (d > 6) {
        const angle = Phaser.Math.Angle.Between(
          this.dog.x, this.dog.y, this.dogTarget.x, this.dogTarget.y
        );
        this.dog.body.setVelocity(Math.cos(angle) * 55, Math.sin(angle) * 55);
        this.dog.setFlipX(Math.cos(angle) < 0);
      } else {
        this.dog.body.setVelocity(0, 0);
      }
    }
  }
}
