# pages

Esta carpeta contiene las páginas principales de la aplicación. Cada página representa una vista completa y puede tener su propia carpeta con componentes, estilos y documentación.

- **Home/**: Página de inicio.
- **Dashboard/**: Panel principal con métricas y accesos rápidos.
- **NotFound.jsx**: Página de error 404.
- **Login/**: Página de inicio de sesión.
  - Se realizaron ajustes en el diseño para dividir la pantalla en dos mitades.
  - Se agregó un fondo dinámico verde en el lado izquierdo y una imagen en el lado derecho.
  - Se ajustaron las posiciones de los elementos visuales, como el logo y los fondos, para mejorar la estética y funcionalidad.
  - Se incluyeron imágenes como `medio.png` y `vidrio.jpg` para los fondos dinámicos.
  - Se implementaron mejoras en la autenticación:
    - Protección de rutas mediante `PrivateRoute`.
    - Manejo de sesiones con `localStorage`.
    - Ajustes en el formulario de inicio de sesión para manejar el estado de éxito y redirección al dashboard.

Las páginas se conectan con el sistema de rutas y pueden usar hooks, servicios y componentes según la funcionalidad requerida.
