import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import pool from "./db.js";
import productosRoutes from "./routes/productos.js";
import ventasRouter from "./routes/ventas.js";


dotenv.config();

const app = express();
app.use(bodyParser.json());

// app.use(cors({
//   origin: "http://localhost:5173",  // tu frontend
//   credentials: true                // permite cookies
// }));

app.use(cors({ origin: "*", credentials: true }));


//Iniciar rutas
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/ventas", ventasRouter);


app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS fecha");
    res.json({ ok: true, fecha: rows[0].fecha });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});



app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Servidor backend en http://localhost:${PORT}`));

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor backend escuchando...");
});



