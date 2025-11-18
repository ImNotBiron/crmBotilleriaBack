import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Detectar archivo .env correcto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({
  path: path.join(__dirname, "..", envFile),
});

console.log(`🌎 Ambiente cargado: ${process.env.NODE_ENV}`);
console.log(`📄 Usando archivo: ${envFile}`);

import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend escuchando en http://0.0.0.0:${PORT}`);
});
