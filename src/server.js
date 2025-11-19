// server.js
import "../load-env.js"; // ← CARGA LAS VARIABLES ANTES DE TODO

import app from "./app.js";

const PORT = process.env.PORT || 3000;

console.log("🌎 Ambiente:", process.env.NODE_ENV);
console.log("📌 Base de datos:", process.env.DB_NAME);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend escuchando en http://0.0.0.0:${PORT}`);
});
