import { useState, useEffect } from "react";
import { fetchApi } from "../services/api";
import Swal from 'sweetalert2';

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("🔵 useUsuarios - Estado actual:", { usuarios: usuarios.length, loading, error });

  // Obtener todos los usuarios
  const cargarUsuarios = async () => {
    console.log("🔵 useUsuarios - Iniciando cargarUsuarios...");
    setLoading(true);
    setError("");
    try {
      console.log("🔵 useUsuarios - Llamando fetchApi...");
      const data = await fetchApi("/api/usuarios/obtenerUsuarios");
      console.log("🔵 useUsuarios - Datos recibidos:", data);
      setUsuarios(data || []);
      console.log("🔵 useUsuarios - Usuarios guardados:", data?.length || 0);
    } catch (err) {
      console.error("🔴 useUsuarios - Error:", err);
      setError("Error al cargar usuarios.");
    }
    setLoading(false);
    console.log("🔵 useUsuarios - cargarUsuarios terminado");
  };

  // Auto-cargar usuarios al montar el hook
  useEffect(() => {
    console.log("🔵 useUsuarios - useEffect ejecutándose, cargando usuarios...");
    cargarUsuarios();
  }, []);

  // Obtener usuario por ID
  const getById = async (id) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi(`/api/usuarios/obtenerUsuarioId/${id}`);
      setLoading(false);
      return data;
    } catch (err) {
      setError("Error al obtener usuario.");
      setLoading(false);
      return null;
    }
  };

  // Crear usuario
  const crearUsuario = async (data) => {
    setLoading(true);
    setError("");
    try {
      await fetchApi("/api/usuarios/crearUsuario", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await cargarUsuarios();
    } catch (err) {
      setError("Error al crear usuario.");
    }
    setLoading(false);
  };

  // Editar usuario
  const editarUsuario = async (data) => {
    console.log("🔵 useUsuarios - Editando usuario:", data);
    setLoading(true);
    setError("");
    try {
      await fetchApi(`/api/usuarios/actualizarUsuario/${data.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nombreCompleto: data.nombre_completo,
          nombreUsuario: data.nombre_usuario,
          rol_id: Number(data.rol_id),
          estado: data.estado.toUpperCase(),
          zona_id: Number(data.zona_id),
        }),
      });
      console.log("🔵 useUsuarios - Usuario editado exitosamente");
      
      // Toast de éxito
      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        text: 'El usuario ha sido actualizado correctamente',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      await cargarUsuarios();
    } catch (err) {
      console.error("🔴 useUsuarios - Error al editar usuario:", err);
      
      // Toast de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el usuario. Inténtalo nuevamente.',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      setError("Error al editar usuario.");
    }
    setLoading(false);
  };

  // Eliminar usuario
  const eliminarUsuario = async (id) => {
    console.log("🔵 useUsuarios - Eliminando usuario ID:", id);
    setLoading(true);
    setError("");
    try {
      await fetchApi(`/api/usuarios/eliminarUsuario/${id}`, {
        method: "DELETE",
      });
      console.log("🔵 useUsuarios - Usuario eliminado exitosamente");
      
      // Toast profesional de éxito
      Swal.fire({
        icon: 'success',
        title: 'Usuario eliminado',
        text: 'El usuario ha sido eliminado correctamente',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      await cargarUsuarios();
    } catch (err) {
      console.error("🔴 useUsuarios - Error al eliminar usuario:", err);
      
      // Toast profesional de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el usuario. Inténtalo nuevamente.',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      setError("Error al eliminar usuario.");
    }
    setLoading(false);
  };

  return {
    usuarios,
    loading,
    error,
    cargarUsuarios,
    getById,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
  };
};

export default useUsuarios;