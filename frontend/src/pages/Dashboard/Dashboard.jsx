import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import DashboardSidebar from "./DashboardSidebar";
import { FaUser, FaBell, FaChartLine, FaMapMarkerAlt, FaRoute, FaWarehouse } from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { isAuthenticated } from "../../services/api";
import { useDashboard } from "../../hooks/useDashboard";
import LoadingOverlay from "../../components/Common/LoadingOverlay";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Función para calcular inicio y fin del mes actual
const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: firstDay.toISOString().split("T")[0],
    end: lastDay.toISOString().split("T")[0],
  };
};

export default function Dashboard() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [fechaInicio, setFechaInicio] = useState(getCurrentMonthRange().start);
  const [fechaFin, setFechaFin] = useState(getCurrentMonthRange().end);

  const { data: dashboardData, loading, error, refresh } = useDashboard(fechaInicio, fechaFin);
 // console.log(dashboardData);


  // Datos de residuos

  
  const colorPorCategoria = {
    NO_RECICLABLE: "#000000", // negro
    RECICLABLE: "#FFFFFF",    // blanco
    ORGANICO: "#008000",      // verde
    INCIERTO: "#9e9e9e",      // gris
  };
  
  const residuosFiltrados = dashboardData?.tipos_residuos?.filter(
    (r) => r.categoria !== "INCIERTO"
  ) || [];
  
  // Etiquetas, datos y colores basados en los filtrados
  const residuosLabels = residuosFiltrados.map(r => r.categoria);
  const residuosData = residuosFiltrados.map(r => r.cantidad);
  const residuosColors = residuosFiltrados.map(
    (r) => colorPorCategoria[r.categoria] || "#ccc"
  );

  // Datos de zonas (ordenados de mayor a menor por puntos)
  let zonasLabels = dashboardData?.zonas?.map(z => z.nombre) || [];
  let zonasData = dashboardData?.zonas?.map(z => z.total_puntos) || [];
  // Ordenar zonas por puntos descendente
  if (zonasLabels.length && zonasData.length) {
    const zonasOrdenadas = zonasLabels.map((label, idx) => ({ label, puntos: zonasData[idx] }))
      .sort((a, b) => b.puntos - a.puntos);
    zonasLabels = zonasOrdenadas.map(z => z.label);
    zonasData = zonasOrdenadas.map(z => z.puntos);
  }

  // Zona con más puntos
  const zonaTop = dashboardData?.zonas?.length
  ? dashboardData.zonas.reduce((prev, curr) => (prev.total_puntos > curr.total_puntos ? prev : curr))
  : null;

  const handleFilter = () => refresh();
  const colores = [
    "#388e3c", // Verde reciclaje
    "#43a047", // Verde naturaleza
    "#cddc39", // Verde claro
    "#8bc34a", // Verde medio
    "#689f38", // Verde oliva
    "#a5d6a7", // Verde suave
    "#81c784", // Verde reciclaje
    "#4caf50", // Verde reciclaje
    "#2e7d32", // Verde oscuro
    "#66bb6a", // Verde vibrante
    "#1b5e20", // Verde profundo
    "#76ff03", // Verde neón
    "#00c853", // Verde intenso
    "#388e3c", // Verde reciclaje
    "#43ea7c"  // Verde claro reciclaje
  ];


  return (
    <div className={styles.dashboardContainer} style={{ background: '#f4f6f8', minHeight: '100vh', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <DashboardSidebar onLogout={handleLogout} />
      <main className={styles.mainContent} style={{ position: 'relative', padding: '32px 24px', maxWidth: 1400, margin: '0 auto' }}>
        <LoadingOverlay loading={loading} error={error} />
        <h1 className={styles.title} style={{ fontSize: '1.6rem', marginBottom: '24px', color: '#263238', fontWeight: 700, letterSpacing: 1 }}>Panel Principal</h1>
        {/* Filtros de fecha */}
        <div className={styles.filterContainer} style={{ marginBottom: '24px', gap: '16px', padding: '12px 16px', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0' }}>
          <label className={styles.dateLabel} style={{ fontSize: '1rem', fontWeight: 500, color: '#388e3c' }}>
            Fecha inicio:
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className={styles.dateInput} style={{ fontSize: '1rem', maxWidth: 140, padding: '4px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginLeft: 8 }} />
          </label>
          <label className={styles.dateLabel} style={{ fontSize: '1rem', fontWeight: 500, color: '#388e3c' }}>
            Fecha fin:
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className={styles.dateInput} style={{ fontSize: '1rem', maxWidth: 140, padding: '4px 10px', borderRadius: 6, border: '1px solid #bdbdbd', marginLeft: 8 }} />
          </label>
          <button onClick={handleFilter} className={styles.filterButton} style={{ fontSize: '1rem', padding: '8px 24px', minWidth: 120, background: '#388e3c', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 600, boxShadow: '0 1px 4px rgba(56,142,60,0.08)', transition: 'background 0.2s' }}>Filtrar</button>
        </div>
        {/* Dashboard en 4 componentes compactos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          alignItems: 'stretch',
          marginBottom: '0',
          minHeight: '220px'
        }}>
          {/* Usuarios Totales */}
          <div
            className={styles.card}
            style={{ minWidth: 0, padding: '24px 12px', fontSize: '1rem', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0', transition: 'box-shadow 0.2s', fontWeight: 500 }}
            onClick={() => navigate('/usuarios')}
            title="Ver usuarios"
          >
            <FaUser size={28} color="#388e3c" style={{ marginBottom: 8 }} />
            <div className={styles.cardValue} style={{ fontSize: '1.3rem', fontWeight: 700, color: '#263238', marginBottom: 2 }}>
              {dashboardData?.usuarios?.total ?? 0}
            </div>
            <div className={styles.cardLabel} style={{ fontSize: '1rem', color: '#757575' }}>Usuarios Totales</div>
          </div>
          {/* Notificaciones Enviadas */}
          <div
            className={styles.card}
            style={{ minWidth: 0, padding: '24px 12px', fontSize: '1rem', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0', transition: 'box-shadow 0.2s', fontWeight: 500 }}
            onClick={() => navigate('/notificaciones')}
            title="Ver notificaciones"
          >
            <FaChartLine size={28} color="#388e3c" style={{ marginBottom: 8 }} />
            <div className={styles.cardValue} style={{ fontSize: '1.3rem', fontWeight: 700, color: '#263238', marginBottom: 2 }}>
              {dashboardData?.notificaciones?.enviadas ?? 0}
            </div>
            <div className={styles.cardLabel} style={{ fontSize: '1rem', color: '#757575' }}>Notificaciones Enviadas</div>
          </div>
          {/* Centros de Acopio */}
          <div
            className={styles.card}
            style={{ minWidth: 0, padding: '24px 12px', fontSize: '1rem', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0', transition: 'box-shadow 0.2s', fontWeight: 500 }}
            onClick={() => navigate('/mapa')}
            title="Ver centros de acopio"
          >
            <FaWarehouse size={28} color="#388e3c" style={{ marginBottom: 8 }} />
            <div className={styles.cardValue} style={{ fontSize: '1.3rem', fontWeight: 700, color: '#263238', marginBottom: 2 }}>
              {dashboardData?.centros_acopio ?? 0}
            </div>
            <div className={styles.cardLabel} style={{ fontSize: '1rem', color: '#757575' }}>Centros de Acopio</div>
          </div>
          {/* Rutas */}
          <div
            className={styles.card}
            style={{ minWidth: 0, padding: '24px 12px', fontSize: '1rem', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0', transition: 'box-shadow 0.2s', fontWeight: 500 }}
            onClick={() => navigate('/calendario')}
            title="Ver rutas"
          >
            <FaRoute size={28} color="#388e3c" style={{ marginBottom: 8 }} />
            <div className={styles.cardValue} style={{ fontSize: '1.3rem', fontWeight: 700, color: '#263238', marginBottom: 2 }}>
              {dashboardData?.rutas ?? 0}
            </div>
            <div className={styles.cardLabel} style={{ fontSize: '1rem', color: '#757575' }}>Rutas</div>
          </div>
        </div>
        {/* Segunda fila: 2 gráficos compactos */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            alignItems: 'stretch',
            marginTop: '32px',
            minHeight: '260px'
          }}
        >
          {/* Clasificación de residuos */}
          <div
            className={styles.chartCard}
            style={{
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              borderRadius: 14,
              padding: '32px 24px',
              minWidth: 0,
              maxWidth: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              border: '1px solid #e0e0e0',
              fontWeight: 500
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.18rem', marginBottom: '18px', fontWeight: 700, color: '#388e3c', letterSpacing: 0.5 }}>
              Clasificación de residuos
            </h3>   
            {residuosLabels.length ? (
              <div style={{ width: '100%', maxWidth: 320, margin: '0 auto' }}>
                <Doughnut
                  data={{
                    labels: residuosLabels,
                    datasets: [{
                      label: 'Cantidad',
                      data: residuosData,
                      backgroundColor: residuosColors,
                      borderColor: '#388e3c',
                      borderWidth: 2,
                    }],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: {
                       position: 'bottom',
                       align: "start", 
                       labels: { color: '#263238',
                         font: { size: 14, weight: 'bold' }
                         } 
                        } 
                      },
                    maintainAspectRatio: false
                  }}
                  style={{ height: 240, width: '100%' }}
                />
              </div>
            ) : (
              <p className={styles.noData} style={{ color: '#757575', fontWeight: 500 }}>No hay datos para mostrar</p>
            )}
          </div>
          {/* Puntos por Zona */}
          <div
            className={styles.chartCard}
            style={{
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              borderRadius: 14,
              padding: '32px 24px',
              minWidth: 0,
              maxWidth: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 320,
              border: '1px solid #e0e0e0',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'box-shadow 0.2s'
            }}
            onClick={() => navigate('/ranking')}
            title="Ver ranking por colonia"
          >
            <h3 style={{ margin: 0, fontSize: '1.18rem', marginBottom: '18px', fontWeight: 700, color: '#388e3c', letterSpacing: 0.5 }}>
              Puntos por Zona
            </h3>
            {zonasLabels.length ? (
              <div style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
                <Bar
                  data={{
                    labels: zonasLabels,
                    datasets: [{
                      label: 'Puntos',
                      data: zonasData,
                      backgroundColor: colores,
                      borderRadius: 8,
                    }],
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: { beginAtZero: true, ticks: { font: { size: 15, weight: 'bold' }, color: '#388e3c' }, grid: { color: '#e0e0e0' } },
                      y: { ticks: { font: { size: 15, weight: 'bold' }, color: '#388e3c' }, grid: { color: '#e0e0e0' } },
                    },
                  }}
                  style={{ height: 260, width: '100%' }}
                />
              </div>
            ) : (
              <p className={styles.noData} style={{ color: '#757575', fontWeight: 500 }}>No hay datos para mostrar</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}