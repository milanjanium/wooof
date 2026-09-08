// main.js
// -----------------------------------------------------------------------------
// Der Startpunkt: Erst der Login-Bildschirm. Nach erfolgreicher Anmeldung
// wird das eigentliche Phaser-Spiel gestartet – mit dem passenden Konto,
// damit der Fortschritt gespeichert und geladen werden kann.
// -----------------------------------------------------------------------------

import Phaser from "phaser";
import WorldScene from "./WorldScene.js";
import { setupStart } from "./login.js";

function startGame() {
  document.getElementById("game").style.display = "block";
  document.body.classList.add("playing");

  const config = {
    type: Phaser.AUTO,
    parent: "game",
    width: 480,
    height: 320,
    pixelArt: true,
    backgroundColor: "#1a1c2c",
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
    scene: [WorldScene],
  };

  new Phaser.Game(config);
}

// Startbildschirm aufsetzen; beim Klick auf "Spielen" das Spiel starten.
setupStart(startGame);
