// src/hooks/useAcopio.js
import { useState, useCallback } from "react";

/**
 * useAcopio - Hook para consumir API de centros de acopio.
 * Provee: getAcopio, getCoordenadas, crearAcopio, actualizarAcopio, eliminarAcopio, validarDatosAcopio, loading, error
 */
export function useAcopio() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTokenHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleResponse = async (res) => {
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = json.message || json.error || "Error en la petición";
      throw new Error(msg);
    }
    return json;
  };

  const getAcopio = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/acopio/listarAcopios`, {
        method: "GET",
        headers: { ...getTokenHeaders() },
      });
      const json = await handleResponse(res);
      return json.data || json.acopio || [];
    } catch (err) {
      setError(err.message || "Error al listar acopios");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API]);

  const getCoordenadas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/acopio/listarAcopiosCoordenadas`, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...getTokenHeaders() },
      });
      const json = await handleResponse(res);
      return json.acopio || json.data || [];
    } catch (err) {
      setError(err.message || "Error al obtener coordenadas");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API]);

  const crearAcopio = useCallback(async (payload) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/acopio/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      const json = await handleResponse(res);
      return json;
    } catch (err) {
      setError(err.message || "Error al crear acopio");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API]);

  const actualizarAcopio = useCallback(async (id, payload) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/acopio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      const json = await handleResponse(res);
      return json;
    } catch (err) {
      setError(err.message || "Error al actualizar acopio");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API]);

  const eliminarAcopio = useCallback(async (id) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/acopio/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const json = await handleResponse(res);
      return json;
    } catch (err) {
      setError(err.message || "Error al eliminar acopio");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API]);

  // Validación simple usada por formularios
  const validarDatosAcopio = useCallback((data) => {
    const errores = [];
    if (!data.nombre || !String(data.nombre).trim()) errores.push("El campo 'nombre' es obligatorio");
    if (!data.tipo || !String(data.tipo).trim()) errores.push("El campo 'tipo' es obligatorio");
    if (data.latitud != null) {
      const v = parseFloat(data.latitud);
      if (Number.isNaN(v) || v < -90 || v > 90) errores.push("Latitud debe estar entre -90 y 90");
    }
    if (data.longitud != null) {
      const v = parseFloat(data.longitud);
      if (Number.isNaN(v) || v < -180 || v > 180) errores.push("Longitud debe estar entre -180 y 180");
    }
    return { valido: errores.length === 0, errores };
  }, []);

  // Obtener todas las zonas
  const obtenerZonas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/zonas/obtenerZonas`, {
        method: "GET",
        headers: { ...getTokenHeaders() },
      });
      return await handleResponse(res);
    } catch (err) {
      setError(err.message || "Error al obtener zonas");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API]);

  // Crear una nueva zona
  const crearZona = useCallback(async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/zonas/crearZona`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getTokenHeaders(),
        },
        body: JSON.stringify(data),
      });
      return await handleResponse(res);
    } catch (err) {
      setError(err.message || "Error al crear zona");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API]);

  return {
    getAcopio,
    getCoordenadas,
    crearAcopio,
    actualizarAcopio,
    eliminarAcopio,
    validarDatosAcopio,
    loading,
    error,
    obtenerZonas,
    crearZona,
  };
}

export default useAcopio;