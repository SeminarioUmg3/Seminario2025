import React from "react";
import { FaRecycle, FaTrophy, FaBell, FaCalendarAlt, FaChartLine, FaMapMarkerAlt, FaSignOutAlt } from "react-icons/fa";
import styles from './UserDashboard.module.css';
import { isAuthenticated } from "../../services/api";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import useUserDashboard from "../../hooks/user/useUserDashboard";

export default function UserDashboard() {
  console.log("🔵 UserDashboard - Componente iniciado");

  if (!isAuthenticated()) {
    console.log("❌ Usuario no autenticado, redirigiendo a login");
    window.location.href = "/login";
    return null;
  }

  const {
    currentUser,
    userStats,
    zoneInfo,
    proximaRecoleccion,
    notificaciones,
    loading,
    error,
    isOnlineMode
  } = useUserDashboard();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className={styles.dashboard}>
      <LoadingOverlay loading={loading} error={error} />
      
      {/* Indicador de modo */}
      {!loading && (
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          left: '10px', 
          background: isOnlineMode 
            ? 'rgba(40, 167, 69, 0.9)' 
            : 'rgba(255, 193, 7, 0.9)', 
          color: isOnlineMode ? 'white' : 'black', 
          padding: '8px 12px', 
          fontSize: '12px', 
          borderRadius: '20px',
          fontWeight: 'bold',
          zIndex: 9999,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          {isOnlineMode ? '🟢 MODO ONLINE' : '🎭 MODO DEMOSTRACIÓN'}
        </div>
      )}
      
      {/* Debug info - solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'fixed', 
          top: '50px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px', 
          fontSize: '11px', 
          zIndex: 9999,
          borderRadius: '5px',
          maxWidth: '200px'
        }}>
          <div><strong>Debug Info:</strong></div>
          <div>Usuario: {currentUser?.nombreUsuario || 'Cargando...'}</div>
          <div>ID: {currentUser?.id || 'N/A'}</div>
          <div>Zona: {currentUser?.zona_id || 'N/A'}</div>
          <div>Puntos: {userStats.puntos}</div>
          <div>Ranking: #{userStats.ranking}</div>
          <div>Notif: {notificaciones.length}</div>
          <div>Modo: {isOnlineMode ? 'Online' : 'Demo'}</div>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.welcome}>
            <FaRecycle className={styles.headerIcon} />
            <div>
              <h1>¡Hola, {currentUser?.nombreUsuario || 'Usuario'}!</h1>
              <p>Bienvenido a tu dashboard personal</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FaSignOutAlt />
            Salir
          </button>
        </div>
      </header>

      <div className={styles.container}>
        {/* Estadísticas principales */}
        <section className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.rankingCard}`}>
            <div className={styles.statIcon}>
              <FaTrophy />
            </div>
            <div className={styles.statContent}>
              <h3>Mi Posición</h3>
              <div className={styles.statValue}>#{userStats.ranking}</div>
              <p>en {zoneInfo?.nombre || 'Tu Zona'}</p>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.pointsCard}`}>
            <div className={styles.statIcon}>
              <FaChartLine />
            </div>
            <div className={styles.statContent}>
              <h3>Puntos</h3>
              <div className={styles.statValue}>{userStats.puntos}</div>
              <p>puntos acumulados</p>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.streakCard}`}>
            <div className={styles.statIcon}>
              <FaCalendarAlt />
            </div>
            <div className={styles.statContent}>
              <h3>Racha</h3>
              <div className={styles.statValue}>{userStats.diasConsecutivos}</div>
              <p>días consecutivos</p>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.kgCard}`}>
            <div className={styles.statIcon}>
              <FaRecycle />
            </div>
            <div className={styles.statContent}>
              <h3>Clasificados</h3>
              <div className={styles.statValue}>{userStats.kgClasificados} kg</div>
              <p>este mes</p>
            </div>
          </div>
        </section>

        {/* Información de zona y próxima recolección */}
        <section className={styles.infoGrid}>
          <div className={styles.zoneCard}>
            <div className={styles.cardHeader}>
              <FaMapMarkerAlt className={styles.cardIcon} />
              <h3>Mi Zona</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.zoneName}>{zoneInfo?.nombre || 'Cargando...'}</div>
              <div className={styles.zoneDetails}>
                <span>Código: {zoneInfo?.codigo || 'N/A'}</span>
                <span>{zoneInfo?.totalUsuarios || 0} usuarios activos</span>
                <span>Posición de zona: #{zoneInfo?.rankingZona || 0}</span>
              </div>
            </div>
          </div>

          <div className={styles.collectionCard}>
            <div className={styles.cardHeader}>
              <FaCalendarAlt className={styles.cardIcon} />
              <h3>Próxima Recolección</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.collectionTime}>
                <span className={styles.collectionDate}>{proximaRecoleccion?.fecha || 'Cargando...'}</span>
                <span className={styles.collectionHour}>{proximaRecoleccion?.hora || '--:--'}</span>
              </div>
              <div className={styles.collectionType}>
                Tipo: <span className={styles.typeHighlight}>{proximaRecoleccion?.tipo || 'General'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Notificaciones recientes */}
        <section className={styles.notificationsSection}>
          <div className={styles.sectionHeader}>
            <FaBell className={styles.sectionIcon} />
            <h2>Notificaciones Recientes</h2>
          </div>
          <div className={styles.notificationsList}>
            {notificaciones.length > 0 ? (
              notificaciones.map(notif => (
                <div key={notif.id} className={`${styles.notificationItem} ${styles[notif.tipo] || ''}`}>
                  <div className={styles.notificationContent}>
                    <p>{notif.mensaje}</p>
                    <span className={styles.notificationDate}>{notif.fecha}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noNotifications}>
                <p>No hay notificaciones recientes</p>
              </div>
            )}
          </div>
        </section>

        {/* Acciones rápidas */}
        <section className={styles.actionsSection}>
          <h2>Acciones Rápidas</h2>
          <div className={styles.actionsGrid}>
            <button className={styles.actionBtn} onClick={() => window.location.href = '/user/calendar'}>
              <FaCalendarAlt />
              <span>Ver Calendario</span>
            </button>
            <button className={styles.actionBtn} onClick={() => window.location.href = '/user/ranking'}>
              <FaTrophy />
              <span>Ver Rankings</span>
            </button>
            <button className={styles.actionBtn} onClick={() => window.location.href = '/user/profile'}>
              <FaChartLine />
              <span>Mi Progreso</span>
            </button>
            <button className={styles.actionBtn} onClick={() => window.location.href = '/user/notifications'}>
              <FaBell />
              <span>Notificaciones</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
          
        