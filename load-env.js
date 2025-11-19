// load-env.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Obtener ruta real del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detectar archivo .env según ambiente
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

// Cargar .env ANTES de todo el backend
dotenv.config({
  path: path.join(__dirname, envFile),
});

console.log("🌎 Archivo de entorno cargado:", envFile);
