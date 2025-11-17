import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import pool from "./db.js";
import productosRoutes from "./routes/productos.js";
import ventasRouter from "./routes/ventas.js";
import usuariosRoutes from "./routes/usuarios.js";


import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(bodyParser.json());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "capacitor://localhost",
  "http://192.168.137.1",
"http://192.168.137.1:3000",
"http://192.168.0.41",
"http://192.168.0.41:3000",


  // 🔥 IP del router actual
  "http://192.168.1.124",
  "http://192.168.1.124:3000",

  // Puedes dejar estas si quieres
  "http://172.20.10.4",
  "http://172.20.10.4:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir llamadas sin origin (APK muchas veces envía null)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS bloqueado para:", origin);
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log("📡", req.method, req.url);
  next();
});



// ------------------------------------
// ⚠️ RUTAS API SIEMPRE VAN PRIMERO
// ------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/ventas", ventasRouter);
app.use("/api/usuarios", usuariosRoutes);

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS fecha");
    res.json({ ok: true, fecha: rows[0].fecha });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
// ------------------------------------
// SERVIR FRONTEND (dist) – CORRECTO
// ------------------------------------

// 1️⃣ Archivos estáticos del frontend (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, "dist")));

// 2️⃣ Servir manifest.json
app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "manifest.json"));
});

// 3️⃣ Servir service worker
app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "dist", "sw.js"));
});

// 4️⃣ Servir iconos de PWA
app.get("/icon-192.png", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "icon-192.png"));
});

app.get("/icon-512.png", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "icon-512.png"));
});

// 5️⃣ Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// 6️⃣ Catch-all SOLO PARA REACT ROUTER (muy importante)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});





// ------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor backend escuchando en http://0.0.0.0:${PORT}`);
});
