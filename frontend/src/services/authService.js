import { fetchApi } from "./api";

// Servicio de autenticación: login, registro y manejo de tokens de usuario.

export const login = async ({ nombreUsuario, contrasenia }) => {
  // Llamada real a la API
  const response = await fetchApi("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ nombreUsuario, contrasenia }),
  });
  return response;
};

export const register = async ({ nombreCompleto, nombreUsuario, contrasenia }) => {
  // Llamada real a la API
  const response = await fetchApi("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ nombreCompleto, nombreUsuario, contrasenia }),
  });
  return response;
};