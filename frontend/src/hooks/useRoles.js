import { useState, useEffect } from "react";
import { fetchApi } from "../services/api";
import Swal from 'sweetalert2';

const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("🔵 useRoles - Estado actual:", { roles: roles.length, loading, error });

  // Obtener listado de roles
  const cargarRoles = async () => {
    console.log("🔵 useRoles - Iniciando cargarRoles...");
    setLoading(true);
    setError("");
    try {
      console.log("🔵 useRoles - Llamando fetchApi a /api/roles/obtenerListadoRoles...");
      const data = await fetchApi("/api/roles/obtenerListadoRoles");
      console.log("🔵 useRoles - Datos recibidos:", data);
      setRoles(Array.isArray(data) ? data : []);
      console.log("🔵 useRoles - Roles guardados:", data?.length || 0);
    } catch (err) {
      console.error("🔴 useRoles - Error:", err);
      setError("Error al cargar roles.");
    }
    setLoading(false);
    console.log("🔵 useRoles - cargarRoles terminado");
  };

  // Auto-cargar roles al montar el hook
  useEffect(() => {
    console.log("🔵 useRoles - useEffect ejecutándose, cargando roles...");
    cargarRoles();
  }, []);

  // Crear rol (POST /api/roles/crearRol) - CORREGIDO
  const crearRol = async (data) => {
    console.log("🔵 useRoles - Creando rol:", data);
    setLoading(true);
    setError("");
    try {
      await fetchApi("/api/roles/crearRol", {
        method: "POST",
        body: JSON.stringify({ nombre: data.nombre }),
      });
      console.log("🔵 useRoles - Rol creado exitosamente");
      await cargarRoles();
    } catch (err) {
      console.error("🔴 useRoles - Error al crear rol:", err);
      setError("Error al crear rol.");
    }
    setLoading(false);
  };

  // Editar rol (PUT /api/roles/actualizarRolId/{id}) - CORREGIDO
  const editarRol = async (data) => {
    console.log("🔵 useRoles - Editando rol:", data);
    setLoading(true);
    setError("");
    try {
      await fetchApi(`/api/roles/actualizarRolId/${data.id}`, {
        method: "PUT",
        body: JSON.stringify({ nombre: data.nombre }),
      });
      console.log("🔵 useRoles - Rol editado exitosamente");
      await cargarRoles();
    } catch (err) {
      console.error("🔴 useRoles - Error al editar rol:", err);
      setError("Error al editar rol.");
    }
    setLoading(false);
  };

  // Eliminar rol (DELETE /api/roles/eliminarRolId/{id}) - CORREGIDO
  const eliminarRol = async (id) => {
    console.log("🔵 useRoles - Eliminando rol ID:", id);
    setLoading(true);
    setError("");
    try {
      await fetchApi(`/api/roles/eliminarRolId/${id}`, {
        method: "DELETE",
      });
      console.log("🔵 useRoles - Rol eliminado exitosamente");
      
      // Toast profesional de éxito
      Swal.fire({
        icon: 'success',
        title: 'Rol eliminado',
        text: 'El rol ha sido eliminado correctamente',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      await cargarRoles();
    } catch (err) {
      console.error("🔴 useRoles - Error al eliminar rol:", err);
      
      // Toast profesional de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el rol. Inténtalo nuevamente.',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      setError("Error al eliminar rol.");
    }
    setLoading(false);
  };

  // Obtener rol por ID (GET /api/roles/obtenerRolId/{id})
  const obtenerRolPorId = async (id) => {
    console.log("🔵 useRoles - Obteniendo rol por ID:", id);
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi(`/api/roles/obtenerRolId/${id}`);
      console.log("🔵 useRoles - Rol obtenido:", data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error("🔴 useRoles - Error al obtener rol:", err);
      setError("Error al obtener rol.");
      setLoading(false);
      return null;
    }
  };

  return {
    roles,
    loading,
    error,
    cargarRoles,
    crearRol,
    editarRol,
    eliminarRol,
    obtenerRolPorId,
  };
};

export default useRoles;