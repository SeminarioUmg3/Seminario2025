import axios from 'axios';

// Cliente para APIs autenticadas
const apiAuth = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

// Cliente para APIs públicas
const apiPublic = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores de autenticación
apiAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expirado, redirigiendo a login");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const userApiService = {
  // Autenticación
  login: async (nombreUsuario, contrasenia) => {
    try {
      const response = await apiPublic.post('/api/auth/app/login', {
        nombreUsuario,
        contrasenia
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  },

  // Registro
  register: async (nombreCompleto, nombreUsuario, contrasenia) => {
    try {
      const response = await apiPublic.post('/api/auth/app/register', {
        nombreCompleto,
        nombreUsuario,
        contrasenia
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario'
      };
    }
  },

  // Ranking por zonas (puntos)
  getRankingZonas: async () => {
    try {
      const response = await apiAuth.get('/api/app/ranking-zonas');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error obteniendo ranking zonas:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener ranking de zonas',
        fallback: [
          { zona_id: 1, zona: "Zona Centro", total_puntos: 3280 },
          { zona_id: 2, zona: "Zona Norte", total_puntos: 2450 },
          { zona_id: 3, zona: "Zona Sur", total_puntos: 1890 }
        ]
      };
    }
  },

  // Ranking por residuos
  getRankingResiduos: async () => {
    try {
      const response = await apiAuth.get('/api/app/ranking');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error obteniendo ranking residuos:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener ranking de residuos',
        fallback: {
          count: 3,
          data: [
            {
              zonaId: 1,
              zonaNombre: "Zona Centro",
              zonaCodigo: "ZC-01",
              totalResiduos: 450,
              residuosRecolectados: [
                { tipoResiduoId: 1, tipoNombre: "Orgánico", total: 200 },
                { tipoResiduoId: 2, tipoNombre: "Reciclable", total: 250 }
              ]
            }
          ]
        }
      };
    }
  },

  // Notificaciones
  getNotificaciones: async () => {
    try {
      const response = await apiAuth.get('/api/app/notificaciones/obtenerNotificaciones');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener notificaciones',
        fallback: {
          data: [
            {
              id: 1,
              titulo: "Recolección programada",
              cuerpo: "¡Excelente trabajo! Mantuviste tu racha por 18 días consecutivos",
              tipo: "INFORMATIVA",
              programada_en: new Date().toISOString(),
              enviada_en: new Date().toISOString()
            },
            {
              id: 2,
              titulo: "Recordatorio",
              cuerpo: "Recolección de materiales reciclables mañana a las 7:30 AM",
              tipo: "ALERTA",
              programada_en: new Date().toISOString(),
              enviada_en: new Date().toISOString()
            }
          ]
        }
      };
    }
  },

  // Crear notificación
  crearNotificacion: async (data) => {
    try {
      const response = await apiAuth.post('/api/app/notificaciones/crear', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creando notificación:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear notificación'
      };
    }
  },

  // Calendario del mes
  getCalendarioMes: async (mes, anio) => {
    try {
      const response = await apiAuth.get(`/api/app/calendario/dias?mes=${mes}&anio=${anio}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error obteniendo calendario:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener calendario',
        fallback: {
          data: [
            {
              dia_semana: 1,
              nombre_mes: "Septiembre",
              nombre_dia: "Lunes",
              fechas: ["2025-09-01", "2025-09-08", "2025-09-15", "2025-09-22", "2025-09-29"]
            }
          ]
        }
      };
    }
  },

  // Información de fecha específica (público)
  getInfoFecha: async (fecha) => {
    try {
      const response = await apiPublic.get(`/api/app/calendario/informacion/${fecha}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error obteniendo info fecha:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener información de fecha',
        fallback: {
          data: {
            dia_semana: 1,
            hora_inicio: "08:00:00",
            hora_fin: "12:00:00",
            frecuencia: "Semanal",
            notas: "Recolección de residuos orgánicos",
            rutas: { id: 1, nombre: "Ruta Centro" }
          },
          fecha: fecha,
          diaSemana: 2
        }
      };
    }
  },

  // Obtener zonas (requiere auth)
  getZonas: async () => {
    try {
      const response = await apiAuth.get('/api/zonas/obtenerZonas');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error obteniendo zonas:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener zonas',
        fallback: [
          { id: 1, nombre: "Zona Centro", codigo: "ZC-01", total_usuarios: 156 },
          { id: 2, nombre: "Zona Norte", codigo: "ZN-01", total_usuarios: 145 },
          { id: 3, nombre: "Zona Sur", codigo: "ZS-01", total_usuarios: 98 }
        ]
      };
    }
  },

  // Verificar conexión del backend
  checkConnection: async () => {
    try {
      await apiPublic.get('/api/test', { timeout: 2000 });
      return true;
    } catch (error) {
      console.log("Backend no disponible:", error.message);
      return false;
    }
  }
};
