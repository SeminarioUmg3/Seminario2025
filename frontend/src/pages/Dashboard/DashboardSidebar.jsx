import styles from "./DashboardSidebar.module.css";
import {
  FaRecycle,
  FaHome,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaBars,
  FaTimes,
  FaUser,
  FaBell,
  FaRoute,
  FaUserCog
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const [menuOpen, setMenuOpen] = useState(false);

  // Check if the logged-in user is an admin
  const user = JSON.parse(localStorage.getItem("user"));
  // Validación robusta para admin (rol en token o en roles)
  const token = localStorage.getItem("token");
  let isAdmin = false;
  if (token && token.includes('.') && token.split('.').length === 3) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rolToken = (payload.rol || payload.role || "").toUpperCase();
      if (rolToken === "ADMIN" || rolToken === "ADMINISTRADOR") {
        isAdmin = true;
      }
    } catch {}
  }
  if (user?.esAdmin === true || user?.esAdmin === "true") {
    isAdmin = true;
  }
  if (user?.roles?.some(r => r.nombre?.toUpperCase() === "ADMIN" || r.nombre?.toUpperCase() === "ADMINISTRADOR")) {
    isAdmin = true;
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Opciones del panel (sidebar) - Orden estándar
  const panelPages = [
    { path: "/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/calendario", icon: <FaCalendarAlt />, label: "Calendario y Rutas" },
    { path: "/mapa", icon: <FaMapMarkerAlt />, label: "Puntos de Acopio" },
    { path: "/ranking", icon: <FaChartBar />, label: "Ranking por Colonia" },
    { path: "/notificaciones", icon: <FaBell />, label: "Notificaciones" },
    { path: "/usuarios", icon: <FaUser />, label: "Usuarios" },
    { path: "/roles", icon: <FaUserCog />, label: "Roles" },
  ];

  const adminOptions = [
    { path: "/configuracion", icon: <FaCog />, label: "Configuración" },
  ];
  const adminOptionModule = [
    { path: "/roles", icon: <FaUser />, label: "Roles" },
    { path: "/zonas", icon: <FaMapMarkerAlt />, label: "Zonas" },
    { path: "/rutas", icon: <FaRoute />, label: "Rutas" },
  ]

  const logoutOption = {
    path: "/login",
    icon: <FaRecycle />,
    label: "Cerrar sesión",
    onClick: () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      handleNavigation("/login");
    },
  };

  // Dropdown for admin configurations
  const AdminDropdown = () => {
    return (
      <Dropdown >
        <Dropdown.Toggle
          id="admin-dropdown"
          className={`${styles.menuItem} w-100 `}

        >
          <span > <FaCog /> Configuración</span>
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ width: "100%" }}>
          {adminOptionModule.map((item, index) => (
            <Dropdown.Item 
              key={index} 
              onClick={() => handleNavigation(item.path)}
              style={{ textAlign: "left", padding: "10px 20px" }}
            >
              {item.icon} <span>{item.label}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  if (isMobile) {
    return (
      <>
        {/* Floating hamburger button */}
        <button
          className="btn btn-success rounded-circle shadow-lg"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 300,
            width: 56,
            height: 56,
            display: menuOpen ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <FaBars />
        </button>
        {/* Expandable bottom menu */}
        {menuOpen && (
          <nav
            className="d-flex flex-row align-items-center justify-content-between w-100 px-2 py-2 bg-success animate__animated animate__slideInUp"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: 72,
              zIndex: 400,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              boxShadow: "0 -2px 12px #0002",
              transition: "all 0.3s",
            }}
          >
            {[...panelPages, logoutOption].map((item, index) => (
              <button
                key={index}
                className="btn btn-link text-white d-flex flex-column align-items-center"
                title={item.label}
                onClick={() => {
                  setMenuOpen(false);
                  item.onClick ? item.onClick() : handleNavigation(item.path);
                }}
              >
                {item.icon}
                <span style={{ fontSize: 10 }}> {item.label}</span>
              </button>
            ))}
            <button
              className="btn btn-link text-white"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <FaTimes size={28} />
            </button>
          </nav>
        )}
      </>
    );
  }

  // Sidebar vertical en escritorio
  return (
    <aside
      className={`${styles.sidebar} d-flex flex-column align-items-center py-3 px-2 animate__animated animate__fadeInLeft`}
      style={{
        minHeight: "100vh",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
        background: "#fff",
      }}
    >
      <div className="w-100 mb-2">
        <div className="d-flex justify-content-center">
          <img src={logo} alt="Logo Municipalidad" className={styles.logoImg} />
        </div>
      </div>
      <span className={`${styles.logoText} mb-3 text-center w-100`}>Panel Municipal</span>
      <nav className={`${styles.menu} w-100`}>
        {panelPages.map((item, index) => (
          <button
            key={index}
            className={`${styles.menuItem} w-100 mb-2`}
            title={item.label}
            onClick={() => (item.onClick ? item.onClick() : handleNavigation(item.path))}
          >
            {item.icon} <span>{item.label}</span>
          </button>
        ))}
         
        {/* New dropdown for admin modules */}
        {isAdmin && <AdminDropdown />}
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title={logoutOption.label}
          onClick={logoutOption.onClick}
        >
          {logoutOption.icon} <span>{logoutOption.label}</span>
        </button>
     
      </nav>
    </aside>
  );
}