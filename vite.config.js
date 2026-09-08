import { defineConfig } from "vite";

// Beim "bauen" fürs Hosting liegt das Spiel unter .../wooof/ ,
// deshalb setzen wir dort die Basis-Adresse auf "/wooof/".
// Lokal (npm run dev) bleibt alles unter "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/wooof/" : "/",
}));
