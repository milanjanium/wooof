// login.js
// -----------------------------------------------------------------------------
// Startbildschirm: nur ein "Spielen"-Knopf. Beim Klick geht's direkt los.
// Zusätzlich robust: auch Enter/Leertaste oder ein Klick auf die Karte starten
// das Spiel – falls der Knopf mal nicht getroffen wird.
// (Kein Anmelden mehr – der Fortschritt wird in einem einzigen lokalen
// Spielstand automatisch gespeichert.)
// -----------------------------------------------------------------------------

export function setupStart(onStart) {
  const overlay = document.getElementById("login-overlay");
  const playBtn = document.getElementById("play-btn");

  let started = false;
  function start() {
    if (started) return; // nur einmal starten
    started = true;
    if (overlay) overlay.style.display = "none";
    onStart();
  }

  if (playBtn) playBtn.addEventListener("click", start);
  if (overlay) overlay.addEventListener("click", start);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") start();
  });
}
