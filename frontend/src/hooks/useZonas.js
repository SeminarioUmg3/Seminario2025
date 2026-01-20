import { useState, useEffect } from "react";
import { obtenerZonas, crearZona, actualizarZona, eliminarZona } from "../services/api";

const useZonas = () => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener todas las zonas (GET, sin parámetros)
  const cargarZonas = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await obtenerZonas();
      setZonas(data || []);
    } catch (err) {
      setError("Error al cargar zonas.");
    }
    setLoading(false);
  };

  // Crear zona (POST, solo nombre y codigo)
  const crear = async (data) => {
    setLoading(true);
    setError("");
    try {
      // data: { nombre, codigo }
      await crearZona(data);
      await cargarZonas();
    } catch (err) {
      setError("Error al crear zona.");
    }
    setLoading(false);
  };

  // Editar zona (PUT, id, nombre, codigo)
  const editar = async (data) => {
    setLoading(true);
    setError("");
    try {
      // data: { id, nombre, codigo }
      await actualizarZona(data);
      await cargarZonas();
    } catch (err) {
      setError("Error al editar zona.");
    }
    setLoading(false);
  };

  // Eliminar zona (DELETE, body: { id })
  const eliminar = async (id) => {
    setLoading(true);
    setError("");
    try {
      await eliminarZona(id);
      await cargarZonas();
    } catch (err) {
      setError("Error al eliminar zona.");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarZonas();
  }, []);

  return {
    zonas,
    loading,
    error,
    cargarZonas,
    crear,
    editar,
    eliminar,
  };
};

export default useZonas;

// El hook usa correctamente:
// - eliminarZona(id) -> DELETE /api/zonas/eliminarZona con body { id }
// - actualizarZona(data) -> PUT /api/zonas/actualizarZona con body { id, nombre, codigo }
