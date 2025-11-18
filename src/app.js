import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
import pool from "./config/db.js";

const app = express();

// Body parser
app.use(bodyParser.json());

// =======================================================
// ⭐ CORS INTELIGENTE SEGÚN AMBIENTE ⭐
// =======================================================
if (process.env.NODE_ENV === "development") {
  // 🔥 Desarrollo: permitir cualquier origen
  app.use(cors({ origin: true, credentials: true }));
  console.log("🔧 CORS: modo desarrollo (origen libre)");
} else {
  // 🌍 Producción: usar dominios desde ENV
  const allowed = process.env.ALLOWED_ORIGINS?.split(",") || [];
  
  //permitir conexion desde APK
   allowed.push("capacitor://localhost");

  app.use(
    cors({
      origin: (origin, callback) => {
        // ⚠️ Apps móviles y peticiones internas → origin null
        if (!origin) return callback(null, true);

        if (allowed.includes(origin)) {
          return callback(null, true);
        }

        console.log("❌ CORS bloqueado para:", origin);
        return callback(new Error("CORS blocked"));
      },
      credentials: true,
    })
  );

  console.log("🌍 CORS: modo producción");
  console.log("🌐 Orígenes permitidos:", allowed);
}
// =======================================================


// Log simple de requests
app.use((req, res, next) => {
  console.log("📡", req.method, req.url);
  next();
});

// Rutas principales
app.use("/api", routes);

// Ruta de prueba DB
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS fecha");
    res.json({ ok: true, fecha: rows[0].fecha });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Middleware global de errores
app.use(errorHandler);

export default app;
