# MapLeaflet

Componente de mapa interactivo para puntos de acopio de residuos, usando Leaflet y React-Leaflet. Adaptado para Retalhuleu y con diseño ambiental.

## ¿Qué hace?

- Muestra un mapa centrado en Retalhuleu, Guatemala.
- Coloca marcadores en puntos de acopio de Retalhuleu y alrededores.
- Cada marcador tiene un popup con el nombre del punto.
- El mapa es responsivo y se adapta al dashboard municipal.
- El estilo usa CSS Modules y variables CSS para la paleta verde ambiental.

## Ubicaciones incluidas

- Retalhuleu Centro
- Acopio Norte Retalhuleu
- Acopio Sur Retalhuleu
- Acopio Este Retalhuleu
- Acopio Oeste Retalhuleu
- Acopio Central Retalhuleu

## Tecnologías usadas

- React 19
- react-leaflet
- leaflet
- CSS Modules
- Variables CSS centralizadas (`variables.module.css`)

## Personalización

- Para agregar más puntos, edita el array `puntosAcopio` en `MapLeaflet.jsx`.
- Para cambiar el estilo, edita `MapLeaflet.module.css` y usa variables de color desde `variables.module.css`.
- El color de la ruta y los elementos visuales se obtienen dinámicamente desde las variables CSS.

## Uso

Este componente se importa y usa en el dashboard principal y en la página dedicada de mapa. Es modular y puede reutilizarse en otras páginas del sistema municipal.

## Cambios recientes

- Paleta de colores verde y ambiental, gestionada por variables CSS.
- Estructura modular y separación de estilos.
- Sidebar y layout del dashboard también usan variables CSS para coherencia visual.
