// save.js
// -----------------------------------------------------------------------------
// Spielstand – vorerst LOKAL im Browser gespeichert (localStorage).
// Ein einziger Spielstand, kein Konto/Login nötig. Beim Online-Schritt
// (später) tauschen wir das gegen echtes Cloud-Speichern aus.
// -----------------------------------------------------------------------------

const SAVE_KEY = "wooof.save";

// Ein frischer, leerer Spielstand für den ersten Start.
function freshSave() {
  return {
    x: null, // null = noch nie gespielt -> Startposition wählen
    y: null,
    dogsMet: [], // Namen/IDs der Hunde, die man schon getroffen hat
    playSeconds: 0,
    createdAt: Date.now(),
  };
}

// Spielstand laden.
export function loadGame() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || freshSave();
  } catch {
    return freshSave();
  }
}

// Spielstand speichern.
export function saveGame(save) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}
