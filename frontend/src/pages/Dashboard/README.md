## Historial de cambios

- **Sidebar modularizado:** El sidebar se separó en `DashboardSidebar.jsx` y `DashboardSidebar.module.css` para facilitar mantenimiento y personalización.
- **Paleta ambiental:** Todos los colores se gestionan ahora por variables CSS en `variables.module.css`, predominando verdes y fondo claro para evocar reciclaje y naturaleza.
- **Dashboard.module.css simplificado:** Los estilos del sidebar y menú se movieron a su propio módulo CSS.
- **Botón de logout:** Se agregó un botón dedicado para cerrar sesión, con funcionalidad y estilo propio.
- **Sidebar ajustable:** El ancho del sidebar se redujo y el tamaño de fuente se ajustó para mejor adaptación visual.
- **MapLeaflet actualizado:** El mapa ahora usa puntos de acopio de Retalhuleu, colores y estilos ambientales, y variables CSS.
- **Documentación actualizada:** README de dashboard y MapLeaflet actualizados para reflejar estructura, modularidad y uso de variables CSS.
- **Responsividad mejorada:** Sidebar se adapta a móvil y el mapa nunca se monta sobre el navbar.
- **Separación de estilos:** Todos los estilos del sidebar y menú están en su propio archivo CSS module.

# Dashboard Municipal

Panel principal del sistema municipal, mostrando métricas clave, gráficos y el mapa de puntos de acopio. Ahora con sidebar modular y paleta ambiental.

## ¿Qué incluye este dashboard?

- **Sidebar modular:** Navegación principal con iconos, acceso rápido a paneles y botón de cierre de sesión. Estilos y estructura separados en `DashboardSidebar.jsx` y `DashboardSidebar.module.css`.
- **Tarjetas de métricas:** Datos relevantes como clasificaciones, participación y residuos comunes.
- **Gráfico de barras:** Visualización de clasificaciones por día usando Chart.js.
- **Mapa interactivo:** Muestra los puntos de acopio de Retalhuleu usando Leaflet y React-Leaflet.
- **Diseño responsivo:** Sidebar se mueve abajo en móvil, el mapa nunca se monta sobre el navbar.
- **Logout:** Botón dedicado para cerrar sesión y regresar al login.
- **Paleta ambiental:** Todos los colores gestionados por variables CSS en `variables.module.css`, con predominancia de verdes y fondo claro.

## Tecnologías utilizadas

- React 19
- Chart.js + react-chartjs-2
- Leaflet + react-leaflet
- CSS Modules
- Variables CSS centralizadas

## Detalles técnicos

- Dashboard principal: `src/pages/Dashboard/Dashboard.jsx`
- Sidebar modular: `DashboardSidebar.jsx` y `DashboardSidebar.module.css`
- Estilos generales: `Dashboard.module.css`
- Mapa: `src/components/MapLeaflet/MapLeaflet.jsx`
- Paleta de colores: `src/styles/variables.module.css`
- Sidebar y layout usan solo variables CSS para colores y responsividad.

## Cómo funciona el logout

Al presionar el botón "Cerrar sesión" en la barra lateral, se elimina el estado de autenticación y se redirige al login.

## Para el equipo

Este dashboard es la base visual y funcional del sistema. Si necesitas agregar nuevas métricas, gráficos o mapas, sigue la estructura modular y los estilos definidos aquí. Para dudas, revisa este README y los comentarios en el código.
