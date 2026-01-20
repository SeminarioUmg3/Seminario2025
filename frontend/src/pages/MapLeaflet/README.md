# Página MapLeaflet

Esta página muestra el mapa interactivo de puntos de acopio usando el componente `MapLeaflet`.

## Estructura

- `MapLeafletPage.jsx`: Página principal que integra el mapa.
- `MapLeaflet`: Componente reutilizable para mostrar el mapa compacto/expandible.
- `MapLeaflet.module.css`: Estilos modulares para el mapa.

## Integración

- La ruta debe definirse en `src/constants/routes.js` (ejemplo: `/mapa`).
- Agrega la página al sistema de rutas de React para que sea accesible desde el dashboard.
- El dashboard puede enlazar a esta página para mostrar el mapa en pantalla completa.

## Personalización

- Puedes agregar más puntos, rutas o lógica interactiva en el componente `MapLeaflet`.
- Los estilos usan variables globales para mantener la coherencia visual.

## Ejemplo de uso

```jsx
import MapLeafletPage from "./pages/MapLeaflet/MapLeafletPage";
// ...en el sistema de rutas
<Route path="/mapa" element={<MapLeafletPage />} />;
```
