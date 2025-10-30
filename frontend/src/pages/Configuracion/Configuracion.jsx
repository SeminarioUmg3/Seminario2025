import { Tabs, Tab } from "react-bootstrap";
import Usuarios from "../Usuarios/Usuarios";
import Roles from "../Roles/Roles";
import ZonaPanel from "../Zonas/ZonaPanel";
import RutaPanel from "../Rutas/RutaPanel";
import styles from "./Configuracion.module.css";

export default function Configuracion() {
  return (
    <div className={styles.pageBg}>
      <h1>Configuración</h1>
      <Tabs defaultActiveKey="usuarios" className="mb-3">
        
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
