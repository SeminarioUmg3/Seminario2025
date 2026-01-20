# Página: Ranking por Colonia

Este componente muestra el **Top 5 de colonias** con más puntos acumulados por reciclaje, incentivando la participación comunitaria y la competitividad.


---

## Objetivo

Visualizar un ranking de las colonias, ordenadas por puntuación, en una tarjeta atractiva que simula medallas para los 3 primeros lugares, y distintivos visuales únicos para los lugares 4 y 5.

---

## Diseño

- Basado en el prototipo proporcionado (medallas de oro, plata, bronce)
- Lugares 4 y 5 usan medallas visuales de  distintos colores
- Estilos aplicados con **CSS Modules**
- Diseño responsive compatible con el layout general del dashboard

---

## Estructura del Componente

- `Ranking.jsx`: Lógica y renderizado del ranking
- `Ranking.module.css`: Estilos locales y clases personalizadas
- Imágenes de medallas (4 y 5) ubicadas en `src/assets/`

---

## Dependencias

- `react-icons` (`FaMedal`)
- `react-router-dom` (`/ranking` es accedido vía routing)
- Archivos de imagen personalizados si se usan (`medal-4.png`, `medal-5.png`)

---

## Cómo se usa

1. La página es accedida desde `/ranking`
2. Se integra al `Layout` general del dashboard
3. Navegable desde el `DashboardSidebar.jsx` (modo escritorio y móvil)
4. Los datos actuales están **mockeados**; puede conectarse fácilmente a una API REST en el futuro

---

## Futuras mejoras

- Integrar con backend para obtener datos reales
- Agregar filtros por zona o periodo de tiempo
- Mostrar evolución histórica de los puntos

---
