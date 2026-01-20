import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/globals.css";
import "./styles/variables.module.css";
// Punto de entrada principal de la aplicación React. Renderiza el componente raíz en el DOM.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
