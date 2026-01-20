import { useState, useEffect, useCallback } from "react";

// Leer la URL base desde variables de entorno Vite: VITE_API_URL
// Mantener fallback a localhost para desarrollo y añadir la ruta `/api` si no está incluida
const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

export function useDashboard(fechaInicio, fechaFin) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!fechaInicio || !fechaFin) {
      setError("Las fechas de inicio y fin son obligatorias.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró un token de autenticación. Por favor, inicie sesión.");
      }

      if (!token.includes('.') || token.split('.').length !== 3) {
        throw new Error("El token de autenticación no es válido. Inicie sesión nuevamente.");
      }

      // Decodificar el payload para obtener el rol
      let rol = "USER";
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        rol = (payload.rol || payload.role || "USER").toUpperCase();
        // console.log("Payload del token:", payload);
        // console.log("Rol detectado:", rol);
      } catch (decodeError) {
        console.warn("No se pudo decodificar el token JWT:", decodeError);
      }

      // Usando el endpoint:
      // GET http://localhost:8000/api/dashboard/?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD
      // con headers Authorization: Bearer <token> y Content-Type: application/json
      const endpoint = `${API_BASE_URL}/api/dashboard/?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`;
      console.log("Probando endpoint:", endpoint);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Manejo de errores HTTP
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `El endpoint del dashboard no se encontró (404): ${endpoint}.
Verifica que el backend tenga implementado GET /api/dashboard/ y que esté corriendo en el puerto 8000.`
          );
        }
        if (response.status === 401) {
          throw new Error("No autorizado (401). Verifique su token de autenticación.");
        }
        if (response.status === 500) {
          const errorText = await response.text();
          throw new Error(
            `Error interno del servidor (500): ${errorText}
Esto indica que el backend tiene un error en la lógica del endpoint /api/dashboard/.
Revisa los logs del backend y verifica:
- Que los parámetros fechaInicio y fechaFin sean válidos.
- Que el usuario tenga rol ADMIN y estado ACTIVO.
- Que la consulta a la base de datos no falle.
- Que la respuesta siempre incluya todos los campos esperados, aunque estén vacíos.
Corrige el backend y vuelve a probar.`
          );
        }
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      // Validar que la respuesta tenga la estructura esperada y asignar valores por defecto si faltan campos
      const safeResult = {
        usuarios: result.usuarios ?? { total: 0, activos: 0, inactivos: 0, porRol: [] },
        notificaciones: result.notificaciones ?? { enviadas: 0, pendientes: 0 },
        zonas: Array.isArray(result.zonas) ? result.zonas : [],
        tipos_residuos: Array.isArray(result.tipos_residuos) ? result.tipos_residuos : [],
        centros_acopio: typeof result.centros_acopio === "number" ? result.centros_acopio : 0,
        rutas: typeof result.rutas === "number" ? result.rutas : 0,
      };
      setData(safeResult);
    } catch (err) {
      setError(err.message || "Error al cargar los datos del dashboard.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refresh = () => {
    fetchDashboardData();
  };

  return { data, loading, error, refresh };
}