import { useState } from "react";
import { fetchApi } from "../services/api";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async ({ nombreUsuario, contrasenia }) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchApi("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ nombreUsuario, contrasenia }),
      });
      setLoading(false);

      // Guarda el token en localStorage
      if (res.accessToken) {
        localStorage.setItem("token", res.accessToken);
        return {
          success: true,
          user: { nombreUsuario, accessToken: res.accessToken, refreshToken: res.refreshToken },
        };
      }
      setError(res.message || "Credenciales incorrectas.");
      return { success: false };
    } catch (err) {
      setLoading(false);
      setError("No se pudo conectar al servidor.");
      return { success: false };
    }
  };

  return { login, loading, error };
};