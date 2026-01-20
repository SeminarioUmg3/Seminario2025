import { api } from '../api';

export const userService = {
  // Obtener estadísticas del usuario
  getUserStats: async (userId) => {
    try {
      const response = await api.get(`/api/app/ranking/usuario/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas del usuario:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar estadísticas',
        fallback: {
          ranking: Math.floor(Math.random() * 50) + 1,
          puntos: Math.floor(Math.random() * 5000) + 1000,
          diasConsecutivos: Math.floor(Math.random() * 30) + 1,
          kgClasificados: (Math.random() * 100 + 10).toFixed(1)
        }
      };
    }
  },

  // Obtener ranking de la zona del usuario
  getZoneRanking: async (zoneId) => {
    try {
      const response = await api.get(`/api/app/ranking/zona/${zoneId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo ranking de zona:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar ranking de zona'
      };
    }
  },

  // Obtener notificaciones del usuario
  getUserNotifications: async (userId) => {
    try {
      const response = await api.get(`/api/app/notificaciones/usuario/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar notificaciones',
        fallback: [
          {
            id: 1,
            mensaje: "¡Recolección de orgánicos mañana a las 8:00 AM!",
            fecha: "Hoy",
            tipo: "recordatorio"
          }
        ]
      };
    }
  },

  // Obtener calendario de recolección
  getCollectionCalendar: async () => {
    try {
      const response = await api.get('/api/calendario/obtenerCalendario');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo calendario:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar calendario',
        fallback: {
          fecha: "Mañana",
          hora: "08:00 AM",
          tipo: "Orgánico"
        }
      };
    }
  },

  // Obtener información de la zona del usuario
  getUserZone: async (zoneId) => {
    try {
      const response = await api.get(`/api/zonas/obtenerZonas`);
      const userZone = response.data.find(zona => zona.id == zoneId);
      
      return {
        success: true,
        data: userZone
      };
    } catch (error) {
      console.error('Error obteniendo zona del usuario:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar información de zona',
        fallback: {
          nombre: "Zona Norte",
          codigo: "ZN-01",
          totalUsuarios: 145,
          rankingZona: 3
        }
      };
    }
  }
};
