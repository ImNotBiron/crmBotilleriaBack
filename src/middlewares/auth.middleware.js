import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    );

    req.user = decoded; // { id, rut, tipo_usuario }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};
