import { useState, useEffect } from "react";
import { obtenerZonas } from "../services/api";

const useZonasSelector = () => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("🔵 useZonasSelector - Estado actual:", { zonas: zonas.length, loading, error });

  // Obtener todas las zonas para selectors/dropdowns
  const cargarZonas = async () => {
    console.log("🔵 useZonasSelector - Iniciando cargarZonas...");
    setLoading(true);
    setError("");
    try {
      console.log("🔵 useZonasSelector - Llamando obtenerZonas...");
      const data = await obtenerZonas();
      console.log("🔵 useZonasSelector - Datos recibidos:", data);
      
      // La API devuelve { zonas: [] }, extraer el array de zonas
      const zonasArray = data?.zonas ? data.zonas : (Array.isArray(data) ? data : []);
      setZonas(zonasArray);
      console.log("🔵 useZonasSelector - Zonas guardadas:", zonasArray.length);
    } catch (err) {
      console.error("🔴 useZonasSelector - Error:", err);
      setError("Error al cargar zonas.");
    }
    setLoading(false);
    console.log("🔵 useZonasSelector - cargarZonas terminado");
  };

  // Auto-cargar zonas al montar el hook
  useEffect(() => {
    console.log("🔵 useZonasSelector - useEffect ejecutándose, cargando zonas...");
    cargarZonas();
  }, []);

  return {
    zonas,
    loading,
    error,
    cargarZonas
  };
};

export default useZonasSelector;
