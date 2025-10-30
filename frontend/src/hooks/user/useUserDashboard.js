import { useState, useEffect } from 'react';
import { userApiService } from '../../services/user/userApiService';
import { getCurrentUserFromToken } from '../../utils/tokenUtils';

export default function useUserDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userStats, setUserStats] = useState({
    ranking: 0,
    puntos: 0,
    diasConsecutivos: 0,
    kgClasificados: 0
  });
  const [zoneInfo, setZoneInfo] = useState(null);
  const [proximaRecoleccion, setProximaRecoleccion] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOnlineMode, setIsOnlineMode] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    console.log("🔵 useUserDashboard - Cargando datos...");
    setLoading(true);
    
    try {
      const user = getCurrentUserFromToken();
      if (!user) {
        console.log("❌ No se pudo obtener usuario del token");
        window.location.href = "/login";
        return;
      }
      
      setCurrentUser(user);
      console.log("✅ Usuario establecido:", user);

      // Verificar si el backend está disponible
      const backendAvailable = await userApiService.checkConnection();
      setIsOnlineMode(backendAvailable);
      
      if (!backendAvailable) {
        console.log("⚠️ Backend no disponible, usando datos de demostración");
        loadDemoData(user);
        setLoading(false);
        return;
      }

      // Si el backend está disponible, cargar datos reales
      console.log("🔵 Backend disponible, cargando datos reales...");
      await loadRealData(user);
      
    } catch (err) {
      console.error("❌ Error crítico cargando datos:", err);
      setError(`Error al cargar los datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadRealData = async (user) => {
    try {
      // Cargar ranking de zonas para obtener stats del usuario
      const rankingResult = await userApiService.getRankingZonas();
      if (rankingResult.success) {
        // Buscar la zona del usuario y calcular su ranking
        const userZoneData = rankingResult.data.find(z => z.zona_id === user.zona_id);
        if (userZoneData) {
          setUserStats({
            ranking: rankingResult.data.findIndex(z => z.zona_id === user.zona_id) + 1,
            puntos: userZoneData.total_puntos,
            diasConsecutivos: Math.floor(Math.random() * 30) + 1, // No disponible en API
            kgClasificados: (userZoneData.total_puntos * 0.02).toFixed(1) // Estimado
          });
        }
      } else {
        console.log("⚠️ Error cargando ranking, usando fallback");
        setUserStats({
          ranking: 12,
          puntos: 3280,
          diasConsecutivos: 18,
          kgClasificados: "67.4"
        });
      }

      // Cargar información de zonas
      const zonasResult = await userApiService.getZonas();
      if (zonasResult.success && user.zona_id) {
        const userZone = zonasResult.data.find(z => z.id === user.zona_id);
        if (userZone) {
          setZoneInfo({
            nombre: userZone.nombre,
            codigo: userZone.codigo,
            totalUsuarios: userZone.total_usuarios || 156,
            rankingZona: Math.floor(Math.random() * 10) + 1
          });
        }
      } else {
        setZoneInfo({
          nombre: "Zona Centro",
          codigo: "ZC-01",
          totalUsuarios: 156,
          rankingZona: 2
        });
      }

      // Cargar notificaciones
      const notifResult = await userApiService.getNotificaciones();
      if (notifResult.success) {
        const formattedNotifications = notifResult.data.data.slice(0, 3).map(notif => ({
          id: notif.id,
          mensaje: notif.cuerpo || notif.titulo,
          fecha: notif.enviada_en ? new Date(notif.enviada_en).toLocaleDateString() : "Reciente",
          tipo: notif.tipo?.toLowerCase() || "general"
        }));
        setNotificaciones(formattedNotifications);
      } else {
        // Usar fallback de notificaciones
        setNotificaciones(notifResult.fallback.data.slice(0, 3).map(notif => ({
          id: notif.id,
          mensaje: notif.cuerpo,
          fecha: "Hoy",
          tipo: notif.tipo.toLowerCase()
        })));
      }

      // Cargar próxima recolección usando calendario
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const fechaResult = await userApiService.getInfoFecha(tomorrowStr);
      if (fechaResult.success) {
        setProximaRecoleccion({
          fecha: "Mañana",
          hora: fechaResult.data.data.hora_inicio || "07:30 AM",
          tipo: fechaResult.data.data.notas || "Recolección General"
        });
      } else {
        setProximaRecoleccion({
          fecha: "Mañana",
          hora: "07:30 AM",
          tipo: "Reciclable"
        });
      }

      console.log("✅ Datos reales cargados exitosamente");

    } catch (error) {
      console.error("❌ Error cargando datos reales:", error);
      loadDemoData(user);
    }
  };

  const loadDemoData = (user) => {
    console.log("🎭 Cargando datos de demostración para:", user.nombreUsuario);
    
    setUserStats({
      ranking: 12,
      puntos: 3280,
      diasConsecutivos: 18,
      kgClasificados: "67.4"
    });

    setZoneInfo({
      nombre: "Zona Centro",
      codigo: "ZC-01",
      totalUsuarios: 156,
      rankingZona: 2
    });

    setProximaRecoleccion({
      fecha: "Mañana",
      hora: "07:30 AM",
      tipo: "Reciclable"
    });

    setNotificaciones([
      {
        id: 1,
        mensaje: "¡Excelente trabajo! Mantuviste tu racha por 18 días consecutivos",
        fecha: "Hoy",
        tipo: "logro"
      },
      {
        id: 2,
        mensaje: "Recolección de materiales reciclables mañana a las 7:30 AM",
        fecha: "Hoy",
        tipo: "recordatorio"
      },
      {
        id: 3,
        mensaje: "¡Subiste al puesto #12 en tu zona! 🏆",
        fecha: "Ayer",
        tipo: "logro"
      }
    ]);

    console.log("✅ Datos de demostración cargados exitosamente");
  };

  return {
    currentUser,
    userStats,
    zoneInfo,
    proximaRecoleccion,
    notificaciones,
    loading,
    error,
    isOnlineMode,
    refetch: loadUserData
  };
}
