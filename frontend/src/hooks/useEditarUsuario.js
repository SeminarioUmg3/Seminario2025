import { useState } from "react";
import { fetchApi } from "../services/api";
import Swal from 'sweetalert2';

const useEditarUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("🔵 useEditarUsuario - Estado actual:", { loading, error });

  // Actualizar usuario - PUT /api/usuarios/actualizarUsuario/:id
  const actualizarUsuario = async (data) => {
    console.log("🔵 useEditarUsuario - Actualizando usuario:", data);
    
    // Validar que el ID esté presente
    if (!data.id) {
      throw new Error('ID de usuario es requerido');
    }

    setLoading(true);
    setError("");
    
    try {
      // Preparar el payload según la API
      const payload = {
        nombreCompleto: data.nombre_completo,
        nombreUsuario: data.nombre_usuario,
        rol_id: Number(data.rol_id),
        estado: data.estado?.toUpperCase() || "ACTIVO",
        zona_id: Number(data.zona_id)
      };

      console.log("🔵 useEditarUsuario - Payload enviado:", payload);

      // Llamar a la API
      const response = await fetchApi(`/api/usuarios/actualizarUsuario/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      console.log("🔵 useEditarUsuario - Usuario actualizado exitosamente:", response);
      
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

      return response;
      
    } catch (err) {
      console.error("🔴 useEditarUsuario - Error al actualizar usuario:", err);
      
      // Determinar el mensaje de error apropiado
      let errorMessage = "No se pudo actualizar el usuario. Inténtalo nuevamente.";
      
      if (err.message?.includes('401')) {
        errorMessage = "No tienes permisos para actualizar usuarios.";
      } else if (err.message?.includes('404')) {
        errorMessage = "Usuario no encontrado.";
      } else if (err.message?.includes('400')) {
        errorMessage = "Datos inválidos. Revisa los campos requeridos.";
      }
      
      // Toast de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      setError("Error al actualizar usuario.");
      throw err;
      
    } finally {
      setLoading(false);
      console.log("🔵 useEditarUsuario - Proceso terminado");
    }
  };

  // Validar campos requeridos antes de enviar
  const validarCampos = (data) => {
    const errores = [];
    
    if (!data.nombre_completo?.trim()) {
      errores.push("Nombre completo es requerido");
    }
    
    if (!data.nombre_usuario?.trim()) {
      errores.push("Nombre de usuario es requerido");
    }
    
    if (!data.rol_id) {
      errores.push("Rol es requerido");
    }
    
    if (!data.zona_id) {
      errores.push("Zona es requerida");
    }
    
    if (!data.estado) {
      errores.push("Estado es requerido");
    }
    
    return errores;
  };

  // Función principal que incluye validación
  const editarUsuario = async (data) => {
    console.log("🔵 useEditarUsuario - Iniciando edición de usuario:", data);
    
    // Validar campos
    const errores = validarCampos(data);
    
    if (errores.length > 0) {
      const errorMsg = `Campos requeridos faltantes: ${errores.join(", ")}`;
      console.error("🔴 useEditarUsuario - Errores de validación:", errores);
      
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: errorMsg,
        confirmButtonText: 'Entendido'
      });
      
      throw new Error(errorMsg);
    }
    
    // Si pasa validación, proceder con la actualización
    return await actualizarUsuario(data);
  };

  return {
    loading,
    error,
    editarUsuario,
    actualizarUsuario,
    validarCampos
  };
};

export default useEditarUsuario;
