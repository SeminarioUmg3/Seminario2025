import { useState, useCallback } from 'react';

export const useNotificacionesSimple = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función simple para obtener notificaciones
  const obtenerNotificaciones = useCallback(async () => {
    console.log('🚀 [SIMPLE] Iniciando obtención de notificaciones...');
    
    setLoading(true);
    setError(null);
    
    try {
      // Verificar token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado. Inicie sesión.');
      }

      console.log('🔑 [SIMPLE] Token encontrado');
      
      // URL directa según la documentación
      const url = 'http://localhost:8000/api/app/notificaciones/obtenerNotificaciones';
      
      console.log('📡 [SIMPLE] Haciendo fetch a:', url);
      
      // Petición directa con fetch nativo
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 [SIMPLE] Status de respuesta:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [SIMPLE] Error en respuesta:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parsear JSON
      const data = await response.json();
      
      console.log('📊 [SIMPLE] Datos recibidos:', data);
      console.log('📊 [SIMPLE] Tipo:', typeof data);
      console.log('📊 [SIMPLE] Es array:', Array.isArray(data));
      console.log('📊 [SIMPLE] Longitud:', Array.isArray(data) ? data.length : 'No es array');

      // Validar que sea array
      if (!Array.isArray(data)) {
        console.warn('⚠️ [SIMPLE] Respuesta no es array:', data);
        throw new Error('La API no devolvió un array de notificaciones');
      }

      // Transformar para la UI
      const notificacionesUI = data.map((notif, index) => ({
        id: notif.id || index + 1,
        titulo: notif.titulo || 'Sin título',
        mensaje: notif.cuerpo || 'Sin contenido',
        tipo: notif.tipo || 'INFORMATIVA',
        fecha: notif.enviada_en ? 
          new Date(notif.enviada_en).toLocaleString() : 
          notif.programada_en ? 
            new Date(notif.programada_en).toLocaleString() : 
            'Sin fecha',
        autor: notif.creado_por?.nombre_completo || 
               notif.creado_por?.nombre_usuario || 
               'Sistema',
        audiencia: notif.audiencia || [],
        programada_en: notif.programada_en,
        enviada_en: notif.enviada_en
      }));

      console.log('✅ [SIMPLE] Notificaciones transformadas:', notificacionesUI);
      
      setNotificaciones(notificacionesUI);
      setError(null);
      
      return notificacionesUI;

    } catch (error) {
      console.error('❌ [SIMPLE] Error:', error);
      
      let mensajeError = 'Error desconocido';
      
      if (error.message?.includes('401')) {
        mensajeError = 'Token inválido o expirado. Inicie sesión nuevamente.';
      } else if (error.message?.includes('404')) {
        mensajeError = 'API de notificaciones no encontrada. Verifique que el servidor esté corriendo.';
      } else if (error.message?.includes('500')) {
        mensajeError = 'Error interno del servidor. Intente más tarde.';
      } else {
        mensajeError = error.message || 'Error obteniendo notificaciones';
      }
      
      setError(mensajeError);
      setNotificaciones([]);
      
      return [];

    } finally {
      setLoading(false);
    }
  }, []);

  // Test directo
  const testAPI = useCallback(async () => {
    console.log('🧪 [SIMPLE] Test directo de la API');
    
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Presente' : 'Ausente');
    
    if (!token) {
      console.error('No hay token para probar');
      return null;
    }

    try {
      const response = await fetch('http://localhost:8000/api/app/notificaciones/obtenerNotificaciones', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Status:', response.status);
      console.log('Headers:', [...response.headers.entries()]);

      if (response.ok) {
        const data = await response.json();
        console.log('Datos:', data);
        return data;
      } else {
        const errorText = await response.text();
        console.error('Error:', errorText);
        return null;
      }

    } catch (error) {
      console.error('Error de red:', error);
      return null;
    }
  }, []);

  return {
    // Estado
    notificaciones,
    loading,
    error,
    
    // Funciones
    obtenerNotificaciones,
    testAPI,
    
    // Utilidades
    limpiarError: () => setError(null)
  };
};

