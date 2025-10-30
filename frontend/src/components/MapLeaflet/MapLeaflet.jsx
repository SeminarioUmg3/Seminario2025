import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapLeaflet.module.css";

// Función de validación de coordenadas
const esCoordenadaValida = (lat, lng) => {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  return (
    !isNaN(latNum) &&
    !isNaN(lngNum) &&
    latNum >= -90 && latNum <= 90 &&
    lngNum >= -180 && lngNum <= 180
  );
};

export default function MapLeaflet({ puntos = [] }) {
  // 🔎 Filtrar solo puntos válidos
  const puntosValidos = puntos.filter((p) =>
    esCoordenadaValida(p.latitud || p.lat, p.longitud || p.lng)
  );

  // Calcular centro promedio
  let MAP_CENTER = [14.5367, -91.6761]; // Default: Retalhuleu
  if (puntosValidos.length > 0) {
    const latitudes = puntosValidos.map(p => parseFloat(p.latitud || p.lat));
    const longitudes = puntosValidos.map(p => parseFloat(p.longitud || p.lng));
    const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
    MAP_CENTER = [avgLat, avgLng];
  }

  const MAP_ZOOM = 11;

  // Color para la ruta
  const getCssVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name) ||
    undefined;
  const polylineColor = getCssVar("--color-primary-blue") || "#2563eb";

  // Ruta que conecta todos los puntos válidos
  const rutaTodos = puntosValidos.map((p) => [
    parseFloat(p.latitud || p.lat),
    parseFloat(p.longitud || p.lng),
  ]);

  return (
    <div className={styles.compact}>
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className={styles.map}
        scrollWheelZoom={false}
        style={{ pointerEvents: "auto" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Renderizar solo marcadores válidos */}
        {puntosValidos.map((punto) => (
          <Marker
            key={punto.id}
            position={[
              parseFloat(punto.latitud || punto.lat),
              parseFloat(punto.longitud || punto.lng),
            ]}
          >
            <Popup>
              <b>{punto.nombre}</b>
              <br />
              <span>Tipo: {punto.tipo}</span>
              <br />
              <span>Zona: {punto.zona_id}</span>
              <br />
              <span>Horario: {punto.horario}</span>
              <br />
              <span>Dirección: {punto.direccion}</span>
            </Popup>
          </Marker>
        ))}

        {/* Línea que conecta los puntos */}
        {rutaTodos.length > 1 && (
          <Polyline positions={rutaTodos} color={polylineColor} weight={5} />
        )}
      </MapContainer>
    </div>
  );
}
