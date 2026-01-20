import { useState, useEffect } from "react";
import { fetchApi } from "../services/api";

const useNotificacionesCRUD = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener todas las notificaciones
  const obtenerNotificaciones = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchApi("/api/notificaciones");
      // Manejar diferentes formatos de respuesta
      let data = response;
      if (response && response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response && response.message && response.data) {
        data = response.data;
      }
      setNotificaciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
      let errorMessage = "Error al cargar notificaciones";
      
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        errorMessage = "Sesión expirada. Por favor, inicie sesión nuevamente.";
      } else if (err.message?.includes('403')) {
        errorMessage = "No tiene permisos para ver las notificaciones.";
      } else if (err.message?.includes('404')) {
        errorMessage = "Servicio no disponible. Intente más tarde.";
      } else if (err.message?.includes('500')) {
        errorMessage = "Error interno del servidor. Contacte al administrador.";
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    }
    setLoading(false);
  };

  // Crear nueva notificación
  const crearNotificacion = async (notificacionData) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi("/api/notificaciones", {
        method: "POST",
        body: JSON.stringify(notificacionData),
      });
      await obtenerNotificaciones(); // Recargar lista
      return data;
    } catch (err) {
      setError("Error al crear notificación.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar notificación
  const actualizarNotificacion = async (id, notificacionData) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi(`/api/notificaciones/${id}`, {
        method: "PUT",
        body: JSON.stringify(notificacionData),
      });
      await obtenerNotificaciones(); // Recargar lista
      return data;
    } catch (err) {
      setError("Error al actualizar notificación.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar notificación
  const eliminarNotificacion = async (id) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi(`/api/notificaciones/${id}`, {
        method: "DELETE",
      });
      await obtenerNotificaciones(); // Recargar lista
      return data;
    } catch (err) {
      setError("Error al eliminar notificación.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener notificación por ID
  const obtenerNotificacionPorId = async (id) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi(`/api/notificaciones/${id}`);
      return data;
    } catch (err) {
      setError("Error al obtener notificación.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerNotificaciones();
  }, []);

  return {
    notificaciones,
    loading,
    error,
    obtenerNotificaciones,
    crearNotificacion,
    actualizarNotificacion,
    eliminarNotificacion,
    obtenerNotificacionPorId,
  };
};

export default useNotificacionesCRUD;
