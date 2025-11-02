import { obtenerMetricasDashboard } from "../services/dashboard.service.js";

export const getDashboard = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que ambos parámetros existan
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: "Se requieren 'fechaInicio' y 'fechaFin' en el formato YYYY-MM-DD",
      });
    }

    // Validar formato de fecha
    if (isNaN(Date.parse(fechaInicio)) || isNaN(Date.parse(fechaFin))) {
      return res.status(400).json({ message: "Formato de fecha inválido" });
    }

    const metricas = await obtenerMetricasDashboard(fechaInicio, fechaFin);
    res.status(200).json(metricas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener métricas del dashboard",
      error: error.message,
    });
  }
};
