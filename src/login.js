// login.js
// -----------------------------------------------------------------------------
// Startbildschirm: nur ein "Spielen"-Knopf. Beim Klick geht's direkt los.
// (Kein Anmelden mehr – der Fortschritt wird in einem einzigen lokalen
// Spielstand automatisch gespeichert.)
// -----------------------------------------------------------------------------

export function setupStart(onStart) {
  const playBtn = document.getElementById("play-btn");
  playBtn.addEventListener("click", () => {
    document.getElementById("login-overlay").style.display = "none";
    onStart();
  });
}
