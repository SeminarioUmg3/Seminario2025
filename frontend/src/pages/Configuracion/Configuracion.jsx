import { Tabs, Tab } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Usuarios from "../Usuarios/Usuarios";
import Roles from "../Roles/Roles";
import ZonaPanel from "../Zonas/ZonaPanel";
import RutaPanel from "../Rutas/RutaPanel";
import styles from "./Configuracion.module.css";

export default function Configuracion() {
  const location = useLocation();
  const requestedTab = location?.state?.tab || null;

  // Map tab keys to components so we can render a single tab's content when requested
  const tabComponents = {
    roles: <Roles />,
    zonas: <ZonaPanel />,
    rutas: <RutaPanel />,
  };

  // If navigation explicitly requested a single tab (via state), render only that tab's content
  if (requestedTab && tabComponents[requestedTab]) {
    return (
      <div className={styles.pageBg}>
        <h1>Configuración</h1>
        <div className="mb-3">{tabComponents[requestedTab]}</div>
      </div>
    );
  }

  // Fallback: show the tabs UI (default active is 'usuarios')
  const defaultTab = "usuarios";
  return (
    <div className={styles.pageBg}>
      <h1>Configuración</h1>
      <Tabs defaultActiveKey={defaultTab} className="mb-3">
        <Tab eventKey="roles" title="Roles">
          <Roles />
        </Tab>
        <Tab eventKey="zonas" title="Zonas">
          <ZonaPanel />
        </Tab>
        <Tab eventKey="rutas" title="Rutas">
          <RutaPanel />
        </Tab>
      </Tabs>
    </div>
  );
}
