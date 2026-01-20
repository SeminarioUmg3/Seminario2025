# Página de Calendario

Esta página muestra una agenda con rutas y puntos de acopio programados, permitiendo visualizar fechas, responsables y ubicaciones. El diseño es completamente responsivo y se adapta automáticamente a escritorio y móvil usando Bootstrap y CSS Modules.

## Estructura

- `Calendar.jsx`: Componente principal de la página, con layout responsivo y lógica de agenda.
- `Calendar.module.css`: Estilos propios, optimizados para responsividad y compatibilidad con Bootstrap.
- `README.md`: Documentación y recomendaciones de uso.

## Tecnologías

- React
- react-bootstrap (layout y tablas responsivas)
- CSS Modules
- Variables CSS ambientales
- Bootstrap 5

## Responsividad

- El layout usa clases Bootstrap (`container-fluid`, `row`, `col-12`, `col-md-6`, etc.) para adaptarse a cualquier dispositivo.
- Los componentes internos (filtros, métricas, rutas) se apilan en móvil y se muestran en fila en escritorio.
- Los estilos CSS no bloquean la responsividad y permiten que Bootstrap controle el ancho y el orden.

## Personalización

- Para agregar más rutas o puntos, edita el array de datos en el componente.
- Los estilos pueden modificarse en `Calendar.module.css` para cambiar colores, tamaños o espaciados.
- Puedes ajustar los breakpoints Bootstrap para modificar el comportamiento en diferentes resoluciones.

## Integración

- La ruta debe agregarse en el sistema de rutas y el botón en el sidebar para acceder a la página.
- Se recomienda probar la visualización en móvil y escritorio para validar la responsividad.
