import { useState, useEffect } from "react";
import { fetchApi } from "../services/api";

// Función para obtener fechas según el período seleccionado
const getFechasPorPeriodo = (periodo) => {
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay());
  
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  
  const formatoFecha = (fecha) => fecha.toISOString().split('T')[0];
  
  switch (periodo) {
    case 'hoy':
      return { inicio: formatoFecha(hoy), fin: formatoFecha(hoy) };
    case 'ayer':
      return { inicio: formatoFecha(ayer), fin: formatoFecha(ayer) };
    case 'semana':
      return { inicio: formatoFecha(inicioSemana), fin: formatoFecha(hoy) };
    case 'mes':
      return { inicio: formatoFecha(inicioMes), fin: formatoFecha(finMes) };
    default:
      return { inicio: null, fin: null };
  }
};

const useRanking = () => {
  const [ranking, setRanking] = useState({ data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarRanking = async (fechaInicioParam = null, fechaFinParam = null) => {
    setLoading(true);
    setError("");
    try {
      // Construir URL con parámetros de fecha si están disponibles
      let url = "/api/ranking-zonas";
      const params = new URLSearchParams();
      
      if (fechaInicioParam) {
        params.append("fecha_inicio", fechaInicioParam);
      }
      if (fechaFinParam) {
        params.append("fecha_fin", fechaFinParam);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const data = await fetchApi(url);
      setRanking({ data: Array.isArray(data) ? data : [] });
    } catch (err) {
      setError("Error al cargar ranking.");
    }
    setLoading(false);
  };

  return {
    ranking,
    loading,
    error,
    cargarRanking,
    getFechasPorPeriodo, // Exponer función para obtener fechas por período
  };
};

export default useRanking;