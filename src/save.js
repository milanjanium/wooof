// save.js
// -----------------------------------------------------------------------------
// Konten & Spielstände – vorerst LOKAL im Browser gespeichert (localStorage).
// Das funktioniert sofort und ohne Server. Beim Online-Schritt (später)
// tauschen wir diese Funktionen gegen echtes, sicheres Cloud-Speichern aus.
//
// Passwörter werden NICHT im Klartext gespeichert, sondern als "Hash"
// (eine Einweg-Verschlüsselung). Hinweis: lokal ist das kein echter
// Sicherheitsersatz – richtige Sicherheit kommt mit dem Server.
// -----------------------------------------------------------------------------

const ACCOUNTS_KEY = "wooof.accounts";

// Liest alle Konten aus dem Browser-Speicher.
function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {};
  } catch {
    return {};
  }
}

function writeAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// Verwandelt ein Passwort in einen nicht rückführbaren Hash.
async function hashPassword(password) {
  const data = new TextEncoder().encode("wooof-salt::" + password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Ein frischer, leerer Spielstand für neue Spieler.
function freshSave() {
  return {
    x: null, // null = noch nie gespielt -> Startposition wählen
    y: null,
    dogsMet: [], // Namen/IDs der Hunde, die man schon getroffen hat
    playSeconds: 0,
    createdAt: Date.now(),
  };
}

// Neues Konto anlegen. Gibt {ok, error} zurück.
export async function register(username, password) {
  username = username.trim().toLowerCase();
  if (username.length < 2) return { ok: false, error: "Name zu kurz." };
  if (password.length < 3) return { ok: false, error: "Passwort zu kurz." };

  const accounts = readAccounts();
  if (accounts[username]) return { ok: false, error: "Name ist schon vergeben." };

  accounts[username] = {
    passHash: await hashPassword(password),
    save: freshSave(),
  };
  writeAccounts(accounts);
  return { ok: true };
}

// Anmelden. Gibt {ok, error} zurück.
export async function login(username, password) {
  username = username.trim().toLowerCase();
  const accounts = readAccounts();
  const account = accounts[username];
  if (!account) return { ok: false, error: "Kein Konto mit diesem Namen." };

  const hash = await hashPassword(password);
  if (hash !== account.passHash) return { ok: false, error: "Falsches Passwort." };

  return { ok: true };
}

// Spielstand laden.
export function loadGame(username) {
  username = username.trim().toLowerCase();
  const accounts = readAccounts();
  return accounts[username]?.save || freshSave();
}

// Spielstand speichern.
export function saveGame(username, save) {
  username = username.trim().toLowerCase();
  const accounts = readAccounts();
  if (!accounts[username]) return;
  accounts[username].save = save;
  writeAccounts(accounts);
}
