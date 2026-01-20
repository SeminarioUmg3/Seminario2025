import { useState, useCallback } from 'react';
import { fetchApi } from '../services/api';

const API_BASE_URL = "http://localhost:8000/api";

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener usuario actual para determinar el rol (solo para UI)
  const getUsuarioActual = () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const tokenRole = (payload.rol || payload.role || "USER").toUpperCase();
          
          console.log('🔍 Rol del token JWT:', tokenRole);
          
          return {
            rol: tokenRole.toLowerCase(),
            esAdmin: tokenRole === "ADMIN" || tokenRole === "ADMINISTRADOR",
            tipoToken: tokenRole === "ADMIN" || tokenRole === "ADMINISTRADOR" ? 'admin' : 'app'
          };
        } catch (tokenError) {
          console.error('Error decodificando token:', tokenError);
        }
      }
      
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const userRole = user.roles?.[0]?.nombre?.toUpperCase() || "USER";
        
        return {
          rol: userRole.toLowerCase(),
          esAdmin: userRole === "ADMINISTRADOR" || userRole === "ADMIN",
          tipoToken: userRole === "ADMINISTRADOR" || userRole === "ADMIN" ? 'admin' : 'app'
        };
      }
    } catch (error) {
      console.error('Error obteniendo rol de usuario:', error);
    }
    return { rol: "user", esAdmin: false, tipoToken: 'app' };
  };

  // Obtener todas las notificaciones - RUTA UNIVERSAL para todos los roles
  const getNotificaciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    console.log('🔄 Iniciando obtención de notificaciones...');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      console.log('🔑 Token encontrado:', token.substring(0, 50) + '...');

      const usuario = getUsuarioActual();
      
      // USAR SIEMPRE LA RUTA UNIVERSAL /api/app/ - funciona con cualquier token
      const endpoint = '/api/app/notificaciones/obtenerNotificaciones';
      
      console.log(`📡 Usando ruta universal: ${endpoint}`);
      console.log(`👤 Usuario: ${usuario.rol}, Token tipo: ${usuario.tipoToken}`);
      console.log('ℹ️ Esta ruta funciona con CUALQUIER token (admin o usuario)');
      
      // Log de la petición completa
      console.log('📤 Enviando petición:', {
        url: endpoint,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.substring(0, 20)}...`,
          'Content-Type': 'application/json'
        }
      });
      
      const response = await fetchApi(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📥 Respuesta RAW completa:', response);
      console.log('📊 Tipo de respuesta:', typeof response);
      console.log('📊 Es array:', Array.isArray(response));
      console.log('📊 Longitud si es array:', Array.isArray(response) ? response.length : 'No es array');
      
      // Debug profundo de la estructura
      if (response) {
        console.log('🔍 Claves de la respuesta:', Object.keys(response));
        console.log('🔍 Primer elemento (si existe):', Array.isArray(response) && response[0] ? response[0] : 'No hay primer elemento');
      }
      
      let data = null;
      
      if (Array.isArray(response)) {
        data = response;
        console.log('✅ Formato correcto: Array directo recibido con', data.length, 'elementos');
      } else if (response && response.data && Array.isArray(response.data)) {
        data = response.data;
        console.log('✅ Formato alternativo: Array dentro de data con', data.length, 'elementos');
      } else if (response && response.id !== undefined) {
        data = [response];
        console.log('✅ Notificación individual convertida a array');
      } else {
        console.error('❌ Estructura de respuesta inesperada:');
        console.error('Tipo:', typeof response);
        console.error('Valor:', response);
        console.error('Claves:', response ? Object.keys(response) : 'null/undefined');
        
        // Intentar otros formatos posibles
        if (response && response.notificaciones && Array.isArray(response.notificaciones)) {
          console.log('🔄 Encontrado formato alternativo: response.notificaciones');
          data = response.notificaciones;
        } else if (response && response.result && Array.isArray(response.result)) {
          console.log('🔄 Encontrado formato alternativo: response.result');
          data = response.result;
        } else {
          throw new Error(`Formato de respuesta inesperado. Se esperaba array directo. Recibido: ${typeof response}`);
        }
      }
      
      if (!Array.isArray(data)) {
        console.error('❌ Data final no es array:', data);
        throw new Error('Error de formato: se esperaba un array de notificaciones');
      }
      
      console.log(`📋 ${data.length} notificaciones obtenidas correctamente`);
      
      if (data.length === 0) {
        console.log('⚠️ El array está vacío - no hay notificaciones en la base de datos');
        console.log('💡 Esto puede ser normal si no se han creado notificaciones aún');
      } else {
        console.log('📋 Notificaciones encontradas:');
        data.forEach((n, i) => {
          console.log(`  ${i + 1}. ID: ${n.id}, Título: "${n.titulo}", Tipo: ${n.tipo}`);
        });
      }
      
      // Transformar datos para compatibilidad con la UI
      const notificacionesTransformadas = data.map((n, index) => {
        try {
          if (!n || typeof n !== 'object') {
            console.warn(`⚠️ Notificación ${index} inválida:`, n);
            throw new Error('Notificación inválida');
          }
          
          const transformada = {
            id: n.id || index + 1,
            titulo: n.titulo || 'Sin título',
            mensaje: n.cuerpo || n.mensaje || 'Sin mensaje',
            cuerpo: n.cuerpo || n.mensaje || 'Sin contenido',
            tipo: n.tipo || 'INFORMATIVA',
            fecha: n.enviada_en ? 
              new Date(n.enviada_en).toLocaleString() : 
              n.programada_en ? 
                new Date(n.programada_en).toLocaleString() : 
                new Date().toLocaleString(),
            autor: n.creado_por?.nombre_completo || 
                   n.creado_por?.nombre_usuario || 
                   'Sistema',
            programada_en: n.programada_en,
            enviada_en: n.enviada_en,
            audiencia: Array.isArray(n.audiencia) ? n.audiencia : [],
            creado_por: n.creado_por || {}
          };
          
          console.log(`✅ Notificación ${index + 1} transformada:`, transformada);
          return transformada;
          
        } catch (transformError) {
          console.error(`❌ Error transformando notificación ${index}:`, n, transformError);
          return {
            id: index + 1,
            titulo: 'Error al cargar',
            mensaje: 'Notificación con formato inválido',
            cuerpo: 'Error en los datos',
            tipo: 'INFORMATIVA',
            fecha: new Date().toLocaleString(),
            autor: 'Sistema',
            audiencia: [],
            creado_por: {}
          };
        }
      });
      
      console.log('🔄 Notificaciones transformadas finales:', notificacionesTransformadas);
      console.log('📊 Cantidad final:', notificacionesTransformadas.length);
      
      setNotificaciones(notificacionesTransformadas);
      return notificacionesTransformadas;
      
    } catch (err) {
      console.error('❌ Error completo obteniendo notificaciones:', err);
      console.error('❌ Stack trace:', err.stack);
      console.error('❌ Mensaje:', err.message);
      
      let errorMessage = 'Error al obtener notificaciones';
      
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        errorMessage = 'Sin autorización para ver notificaciones. Token inválido o expirado.';
        console.log('🔍 Error de autorización - verificar token y permisos');
      } else if (err.message?.includes('403')) {
        errorMessage = 'Acceso denegado: No tiene permisos para ver las notificaciones';
      } else if (err.message?.includes('404')) {
        errorMessage = 'API no encontrada: El servicio de notificaciones no está disponible';
        console.log('🔍 Error 404 - verificar que el backend esté corriendo en localhost:8000');
      } else if (err.message?.includes('500')) {
        errorMessage = 'Error interno del servidor: Problema en el backend';
      } else {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      
      console.log('📝 Error final procesado:', errorMessage);
      setError(errorMessage);
      
      // No fallback - devolver array vacío para que el usuario use el botón de recarga
      console.log('🔄 Sin fallback - devolviendo array vacío');
      const notificacionesVacias = [];
      
      setNotificaciones(notificacionesVacias);
      return notificacionesVacias;
      
    } finally {
      setLoading(false);
      console.log('✅ getNotificaciones finalizado, loading = false');
    }
  }, []);

  // Crear notificación - AMBOS pueden crear usando sus respectivas rutas
  const createNotificacion = useCallback(async (notificacion) => {
    setLoading(true);
    setError(null);
    
    console.log('📝 Iniciando creación de notificación...');
    console.log('📝 Datos a enviar:', notificacion);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      const usuario = getUsuarioActual();
      
      console.log('🔍 Verificando permisos de usuario:', usuario);
      
      // AMBOS pueden crear notificaciones usando sus rutas respectivas
      const endpoint = usuario.esAdmin ? 
        '/api/notificaciones/crear' : 
        '/api/app/notificaciones/crear';

      console.log(`✅ Usuario tipo ${usuario.tipoToken}, usando endpoint: ${endpoint}`);
      
      const response = await fetchApi(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificacion)
      });
      
      console.log('✅ Notificación creada exitosamente:', response);
      
      // Limpiar cualquier error previo
      setError(null);
      
      // Recargar notificaciones inmediatamente usando la ruta universal
      console.log('🔄 Recargando lista de notificaciones...');
      await getNotificaciones();
      
      return response;
      
    } catch (err) {
      console.error('❌ Error creando notificación:', err);
      console.error('❌ Detalles del error:', err.response || err);
      
      let errorMessage = 'Error al crear notificación';
      
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        errorMessage = 'Sin autorización: Token inválido o expirado. Inicie sesión nuevamente.';
      } else if (err.message?.includes('403')) {
        errorMessage = 'Acceso denegado: No tiene permisos para crear notificaciones';
      } else if (err.message?.includes('Foreign key constraint')) {
        errorMessage = 'Error de usuario: El ID de usuario no es válido. Inicie sesión nuevamente.';
      } else if (err.message?.includes('404')) {
        errorMessage = 'API no encontrada: El endpoint de creación no está disponible';
      } else {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  }, [getNotificaciones]);

  // Test directo de la API (solo para debug)
  const testDirectoAPI = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    console.log('🧪 TEST DIRECTO DE LA API');
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
    
    try {
      // Test con fetch nativo
      const url = 'http://localhost:8000/api/app/notificaciones/obtenerNotificaciones';
      console.log('📡 Haciendo fetch directo a:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📥 Status de respuesta:', response.status, response.statusText);
      console.log('📥 Headers de respuesta:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('📊 Datos recibidos (fetch directo):', data);
      console.log('📊 Tipo:', typeof data);
      console.log('📊 Es array:', Array.isArray(data));
      console.log('📊 Longitud:', Array.isArray(data) ? data.length : 'No es array');
      
      return data;
      
    } catch (error) {
      console.error('❌ Error en test directo:', error);
      throw error;
    }
  }, []);

  return {
    // Estado
    notificaciones,
    loading,
    error,
    
    // Operaciones
    getNotificaciones, // UNIVERSAL - funciona con cualquier token
    createNotificacion, // Diferenciado por rol
    
    // Utilidades
    clearError: () => setError(null),
    testDirectoAPI // Para debuggear
  };
};






































































































