import { useState } from "react";
import { fetchApi } from "../services/api";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async ({ nombreCompleto, nombreUsuario, contrasenia }, userType = 'admin') => {
    setLoading(true);
    setError("");
    
    try {
      // Determinar endpoint según tipo de usuario
      const endpoint = userType === 'admin' 
        ? "/api/auth/register"           // Para admin (requiere token)
        : "/api/auth/app/register";      // Para usuario normal (público)

      console.log('🔵 Enviando registro:', {
        endpoint,
        userType,
        userData: { nombreCompleto, nombreUsuario, contrasenia: '[HIDDEN]' }
      });

      const res = await fetchApi(endpoint, {
        method: "POST",
        body: JSON.stringify({ nombreCompleto, nombreUsuario, contrasenia }),
      });

      console.log('🔵 Respuesta del servidor:', res);

      setLoading(false);
      if (res.success || res.message === "Usuario creado correctamente") {
        return { success: true, user: res.user, data: res };
      }
      
      // Manejar errores específicos
      if (res.message === 'Usuario ya existe') {
        setError('Este nombre de usuario ya está en uso');
      } else if (res.errors && Array.isArray(res.errors)) {
        const errorMessages = res.errors.map(err => err.msg).join(', ');
        setError(errorMessages);
      } else {
        setError(res.message || "Error en el registro.");
      }
      
      return { success: false };
    } catch (err) {
      console.error('🔴 Error de conexión:', err);
      setLoading(false);
      setError("No se pudo conectar al servidor.");
      return { success: false };
    }
  };

  return { register, loading, error };
};