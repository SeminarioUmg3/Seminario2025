import { useState, useEffect } from "react";
import { obtenerRutas, crearRuta, actualizarRuta, eliminarRuta } from "../services/api";

const useRutas = () => {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarRutas = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await obtenerRutas();
      setRutas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar rutas.");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarRutas();
  }, []);

  const crear = async (data) => {
    setLoading(true);
    setError("");
    try {
      await crearRuta(data);
      await cargarRutas();
    } catch (err) {
      setError("Error al crear ruta.");
    }
    setLoading(false);
  };

  const editar = async (data) => {
    setLoading(true);
    setError("");
    try {
      await actualizarRuta(data);
      await cargarRutas();
    } catch (err) {
      setError("Error al editar ruta.");
    }
    setLoading(false);
  };

  const eliminar = async (id) => {
    setLoading(true);
    setError("");
    try {
      await eliminarRuta(id);
      await cargarRutas();
    } catch (err) {
      setError("Error al eliminar ruta.");
    }
    setLoading(false);
  };

  return {
    rutas,
    loading,
    error,
    cargarRutas,
    crear,
    editar,
    eliminar,
  };
};

export default useRutas;
