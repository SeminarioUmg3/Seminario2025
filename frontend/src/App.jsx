import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import PrivateRoute from "./components/Auth/PrivateRoute";
import NotFound from "./pages/NotFound";
import MapLeafletPage from "./pages/MapLeaflet/MapLeafletPage";
import DashboardSidebar from "./pages/Dashboard/DashboardSidebar";
import Calendar from "./pages/Calendar/Calendar";
import Ranking from "./pages/Ranking/Ranking";
import Usuarios from "./pages/Usuarios/Usuarios";
import Configuracion from "./pages/Configuracion/Configuracion";
import Notificaciones from "./pages/Notificaciones/Notificaciones";
import Roles from "./pages/Roles/Roles";
import ZonaPanel from "./pages/Zonas/ZonaPanel";
function App() {
  // Layout que incluye el sidebar/navbar
  const Layout = ({ children }) => (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg, #f3f4f6)",
      }}
    >
      <DashboardSidebar />
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route
          path="/mapa"
          element={
            <PrivateRoute>
              <Layout>
                <MapLeafletPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/calendario"
          element={
            <PrivateRoute>
              <Layout>
                <Calendar />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ranking"
          element={
            <PrivateRoute>
              <Layout>
                <Ranking />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <Layout>
                <Usuarios />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <Layout>
                <Roles />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/zonas" element={
          <PrivateRoute>
            <Layout>
              <ZonaPanel />
            </Layout>
          </PrivateRoute>
      } />
         
      
        <Route
          path="/configuracion"
          element={
            <PrivateRoute>
              <Layout>
                <Configuracion />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notificaciones"
          element={
            <PrivateRoute>
              <Layout>
                <Notificaciones />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
