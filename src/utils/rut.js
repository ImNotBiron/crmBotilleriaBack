// Normalizar RUT (para guardar en BD)
export const normalizarRut = (rut = "") =>
  rut.replace(/[^\dkK]/g, "").toUpperCase();

// Limpiar formato (para comparar sin puntos ni guión)
export const limpiarRutFormato = (rut = "") =>
  rut.replace(/\./g, "").replace("-", "").trim();
