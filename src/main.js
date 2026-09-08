// main.js
// -----------------------------------------------------------------------------
// Der Startpunkt: Erst der Login-Bildschirm. Nach erfolgreicher Anmeldung
// wird das eigentliche Phaser-Spiel gestartet – mit dem passenden Konto,
// damit der Fortschritt gespeichert und geladen werden kann.
// -----------------------------------------------------------------------------

import Phaser from "phaser";
import WorldScene from "./WorldScene.js";
import { setupLogin } from "./login.js";

function startGame(username) {
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

  const game = new Phaser.Game(config);
  // Den angemeldeten Benutzer für die Szene hinterlegen.
  game.registry.set("username", username);
}

// Login-Bildschirm aufsetzen; bei Erfolg das Spiel starten.
setupLogin(startGame);
