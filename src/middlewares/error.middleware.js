export default (err, req, res, next) => {
  console.error("❌ Error global:", err);

  const status = err.status || 500;

  res.status(status).json({
    message: err.message || "Error interno en el servidor",
  });
};
