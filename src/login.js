// login.js
// -----------------------------------------------------------------------------
// Steuert den HTML-Login-Bildschirm: zwischen "Anmelden" und "Neu hier"
// umschalten, Eingaben prüfen, und nach Erfolg das Spiel starten.
// -----------------------------------------------------------------------------

import { register, login } from "./save.js";

// mode: "login" oder "register"
let mode = "login";

export function setupLogin(onSuccess) {
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const form = document.getElementById("auth-form");
  const usernameEl = document.getElementById("username");
  const passwordEl = document.getElementById("password");
  const submitBtn = document.getElementById("submit-btn");
  const msg = document.getElementById("msg");

  function setMode(next) {
    mode = next;
    tabLogin.classList.toggle("active", mode === "login");
    tabRegister.classList.toggle("active", mode === "register");
    submitBtn.textContent = mode === "login" ? "Los geht's!" : "Konto erstellen";
    passwordEl.setAttribute(
      "autocomplete",
      mode === "login" ? "current-password" : "new-password"
    );
    msg.textContent = "";
  }

  tabLogin.addEventListener("click", () => setMode("login"));
  tabRegister.addEventListener("click", () => setMode("register"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = usernameEl.value;
    const password = passwordEl.value;
    msg.style.color = "#e0574f";
    msg.textContent = "";

    const result =
      mode === "register"
        ? await register(username, password)
        : await login(username, password);

    if (!result.ok) {
      msg.textContent = result.error;
      return;
    }

    // Erfolg! Login-Bildschirm ausblenden und Spiel starten.
    document.getElementById("login-overlay").style.display = "none";
    onSuccess(username.trim().toLowerCase());
  });
}
