import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/globals.css";
import "./styles/variables.module.css";
// Punto de entrada principal de la aplicación React. Renderiza el componente raíz en el DOM.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
// hoja de estilos de leaflet
import "leaflet/dist/leaflet.css";

// ----- CORRECCIÓN DE ICONOS DE LEAFLET -----
import L from "leaflet";

// 1) forma genérica que suele funcionar con Webpack/CRA o bundlers que resuelven imports de imágenes
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
