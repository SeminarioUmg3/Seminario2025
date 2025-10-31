import { useEffect, useState } from "react";
import { obtenerRutas, crearRuta, actualizarRuta, eliminarRuta, obtenerZonas } from "../../services/api";
import { Button, Table, Modal, Form, Toast, ToastContainer } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Importar CSS de Leaflet
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import DataTable from "react-data-table-component";
import { FaRoute, FaEdit, FaTrashAlt, FaUsers } from "react-icons/fa";
import rolesStyles from "../Roles/Roles.module.css";
import usuariosStyles from "../Zonas/Usuarios.module.css";

// Nuevo hook: obtiene rutas y acopios, asocia acopios a cada ruta por zona_id
function useRutasConAcopios() {
  const [rutas, setRutas] = useState([]);
  const [acopios, setAcopios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Obtener rutas
        const rutasRes = await obtenerRutas();
        let rutasArray = [];
        if (Array.isArray(rutasRes)) {
          rutasArray = rutasRes.flatMap(zona =>
            Array.isArray(zona.rutas)
              ? zona.rutas.map(r => ({
                  ...r,
                  zona_id: zona.id,
                  zona_nombre: zona.nombre
                }))
              : []
          );
        } else if (Array.isArray(rutasRes.rutas)) {
          rutasArray = rutasRes.rutas.flatMap(zona =>
            Array.isArray(zona.rutas)
              ? zona.rutas.map(r => ({
                  ...r,
                  zona_id: zona.id,
                  zona_nombre: zona.nombre
                }))
              : []
          );
        }

        // Obtener acopios
        const token = localStorage.getItem('token');
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/acopio/listarAcopios`;
        const acopiosRes = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const acopiosJson = await acopiosRes.json();
        const acopiosArray = Array.isArray(acopiosJson.data) ? acopiosJson.data : [];

        // Asocia acopios a cada ruta por zona_id
        const rutasConAcopios = rutasArray.map(ruta => ({
          ...ruta,
          acopios: acopiosArray.filter(a => String(a.zona_id) === String(ruta.zona_id))
        }));

        setRutas(rutasConAcopios);
        setAcopios(acopiosArray);
      } catch (err) {
        setRutas([]);
        setAcopios([]);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  return { rutas, acopios, loading };
}

export default function RutaPanel() {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  // Añadir points_chain al estado del form (secuencia completa de puntos clicados)
  const [form, setForm] = useState({
    nombre: "",
    zona_id: "",
    id: null,
    activo: true,
    inicio_latitud: "",
    inicio_longitud: "",
    fin_latitud: "",
    fin_longitud: "",
    puntos_intermedios_text: "",
    puntos_intermedios: [], // antiguos intermediarios
    points_chain: [] // nuevo: array de puntos en orden [{lat,lng}, ...]
  });

  // Centro por defecto: Departamento de Retalhuleu, Guatemala (aprox.)
  const RETALHULEU_CENTER = [14.536, -91.676];
  const RETALHULEU_ZOOM = 10;

  // Nuevo: centro y zoom del mapa (por defecto Retalhuleu)
  const [mapCenter, setMapCenter] = useState(RETALHULEU_CENTER);
  const [mapZoom, setMapZoom] = useState(RETALHULEU_ZOOM);
  const [mapInstance, setMapInstance] = useState(null); // Referencia al mapa

  // Lista de acopios con coordenadas (obtenidas del backend)
  const [acopiosCoords, setAcopiosCoords] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState(null); // Nueva: ruta seleccionada para mostrar en el mapa principal

  // Reemplaza rutas y acopios por el hook integrado
  const { rutas, acopios, loading: loadingRutas } = useRutasConAcopios();

  const refreshZonas = async () => {
    try {
      const res = await obtenerZonas();
      const zonasArray = Array.isArray(res) ? res : (Array.isArray(res.zonas) ? res.zonas : []);
      setZonas(zonasArray);

      // Cargar coordenadas de acopios para usar como referencia de zona
      await fetchAcopiosCoords();

      // Si no hay centro definido, usar el centro de la primera zona si existe
      if (zonasArray.length) {
        const firstCenter = getZoneCenter(zonasArray[0]);
        if (firstCenter) {
          setMapCenter(firstCenter);
          setMapZoom(13);
        } else {
          setMapCenter(RETALHULEU_CENTER);
          setMapZoom(RETALHULEU_ZOOM);
        }
      } else {
        setMapCenter(RETALHULEU_CENTER);
        setMapZoom(RETALHULEU_ZOOM);
      }
    } catch (err) {
      // Opcional: manejar error de zonas
      // asegurar fallback
      setMapCenter(RETALHULEU_CENTER);
      setMapZoom(RETALHULEU_ZOOM);
    }
  };

  // Fetch de coordenadas de centros de acopio desde el backend
  const fetchAcopiosCoords = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/acopio/listarAcopiosCoordenadas`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) {
        // 404 o sin acopios -> limpiar array
        setAcopiosCoords([]);
        return;
      }
      const data = await res.json();
      // Normalizar posibles formas: data.acopio || data.data
      const list = Array.isArray(data.acopio) ? data.acopio : (Array.isArray(data.data) ? data.data : []);
      // Guardar con lat/lng numéricos
      const normalized = list.map(a => ({
        id: a.id,
        nombre: a.nombre,
        latitud: typeof a.latitud === 'string' ? parseFloat(a.latitud) : a.latitud,
        longitud: typeof a.longitud === 'string' ? parseFloat(a.longitud) : a.longitud,
        zona_id: a.zona_id ?? (a.zonas?.id ?? null),
        raw: a
      })).filter(a => a.latitud !== undefined && a.longitud !== undefined && !Number.isNaN(a.latitud) && !Number.isNaN(a.longitud));
      setAcopiosCoords(normalized);
    } catch (err) {
      console.warn('Error fetchAcopiosCoords', err);
      setAcopiosCoords([]);
    }
  };

  // Utilidad: extraer centro de una zona (soporta varias claves comunes)
  const getZoneCenter = (z) => {
    if (!z) return null;
    const possibleLatKeys = ['lat', 'latitude', 'latitud', 'centro_latitud', 'center_lat'];
    const possibleLngKeys = ['lng', 'longitude', 'longitud', 'centro_longitud', 'center_lng'];
    let lat = null, lng = null;
    for (const k of possibleLatKeys) {
      if (z[k] !== undefined && z[k] !== null) { lat = parseFloat(z[k]); break; }
    }
    for (const k of possibleLngKeys) {
      if (z[k] !== undefined && z[k] !== null) { lng = parseFloat(z[k]); break; }
    }
    if (lat !== null && lng !== null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      return [lat, lng];
    }

    // Si la zona no tiene coordenadas, intentar obtenerlas desde un acopio asociado
    if (acopiosCoords && acopiosCoords.length && z.id !== undefined && z.id !== null) {
      const match = acopiosCoords.find(a => String(a.zona_id) === String(z.id) || (a.raw?.zonas && String(a.raw.zonas.id) === String(z.id)));
      if (match) return [match.latitud, match.longitud];
    }

    return null;
  };

  // Geocode simple usando Nominatim (busca "zona.direccion || zona.nombre, Retalhuleu Guatemala")
  const geocodeZone = async (zone) => {
    if (!zone) return null;
    // si ya guardamos centro en la zona, devolverlo
    const existing = getZoneCenter(zone);
    if (existing) return existing;

    const queryBase = zone.direccion || zone.nombre || "";
    const query = `${queryBase}, Retalhuleu, Guatemala`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        const lat = parseFloat(json[0].lat);
        const lon = parseFloat(json[0].lon);
        if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
          // actualizar zonas en memoria para evitar futuras consultas
          setZonas(prev => prev.map(z => z.id === zone.id ? { ...z, centro_latitud: lat, centro_longitud: lon } : z));
          return [lat, lon];
        }
      }
    } catch (err) {
      // no bloquear la UI por fallos en geocoding
      console.warn('Geocoding failed for zone', zone, err);
    }
    return null;
  };

  // Maneja cambio de zona en el select: actualiza form.zona_id y centra el mapa si la zona tiene coordenadas
  const handleZonaChange = async (e) => {
    const zonaId = e.target.value;
    setForm(f => ({ ...f, zona_id: zonaId }));
    const zone = zonas.find(z => String(z.id) === String(zonaId));
    let center = getZoneCenter(zone);
    if (!center) {
      // intentar geocoding si no hay coordenadas explícitas
      const geocoded = await geocodeZone(zone);
      if (geocoded) center = geocoded;
    }
    center = center || RETALHULEU_CENTER;
    setMapCenter(center);
    setMapZoom(center === RETALHULEU_CENTER ? RETALHULEU_ZOOM : 15);

    // Si el mapa ya existe, moverlo inmediatamente (flyTo / setView)
    if (mapInstance) {
      try {
        if (typeof mapInstance.flyTo === "function") {
          mapInstance.flyTo(center, center === RETALHULEU_CENTER ? RETALHULEU_ZOOM : 15, { animate: true, duration: 0.6 });
        } else {
          mapInstance.setView(center, center === RETALHULEU_CENTER ? RETALHULEU_ZOOM : 15);
        }
        // invalida tamaño por si acaso
        if (typeof mapInstance.invalidateSize === "function") mapInstance.invalidateSize();
      } catch (err) {
        try { mapInstance.setView(center, center === RETALHULEU_CENTER ? RETALHULEU_ZOOM : 15); } catch (_) { /* ignore */ }
      }
    }
  };

  useEffect(() => {
    // refreshRutas();
    refreshZonas();
  }, []);

  // Cuando el modal se abra, forzar re-dimensionado del mapa
  useEffect(() => {
    if (showModal && mapInstance) {
      const t = setTimeout(() => {
        try { mapInstance.invalidateSize(); } catch (e) { /* no bloquear */ }
      }, 200);
      return () => clearTimeout(t);
    }
  }, [showModal, mapInstance]);

  // Aplicar centro/zoom al mapa cuando cambien (soporta selección de zona)
  useEffect(() => {
    if (!mapInstance || !Array.isArray(mapCenter)) return;
    try {
      // usar flyTo para transición suave; fallback a setView si falla
      if (typeof mapInstance.flyTo === "function") {
        mapInstance.flyTo(mapCenter, mapZoom, { animate: true, duration: 0.6 });
      } else {
        mapInstance.setView(mapCenter, mapZoom);
      }
    } catch (err) {
      try { mapInstance.setView(mapCenter, mapZoom); } catch (e) { /* ignore */ }
    }
  }, [mapInstance, mapCenter, mapZoom]);

  const handleAdd = () => {
    setForm({
      nombre: "",
      zona_id: "",
      id: null,
      activo: true,
      inicio_latitud: "",
      inicio_longitud: "",
      fin_latitud: "",
      fin_longitud: "",
      puntos_intermedios_text: "",
      puntos_intermedios: [],
      points_chain: []
    });
    // Centrar por defecto en Retalhuleu o en la primera zona si tiene centro
    if (zonas.length) {
      const center = getZoneCenter(zonas[0]) || RETALHULEU_CENTER;
      setMapCenter(center);
      setMapZoom(13);
    } else {
      setMapCenter(RETALHULEU_CENTER);
      setMapZoom(RETALHULEU_ZOOM);
    }
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = async (ruta) => {
    // construir points_chain desde datos existentes: inicio + intermediarios + fin
    const chain = [];
    if (ruta.inicio_latitud && ruta.inicio_longitud) {
      chain.push({ lat: parseFloat(ruta.inicio_latitud), lng: parseFloat(ruta.inicio_longitud) });
    }
    if (Array.isArray(ruta.puntos_intermedios) && ruta.puntos_intermedios.length) {
      for (const p of ruta.puntos_intermedios) {
        chain.push({ lat: parseFloat(p.lat), lng: parseFloat(p.lng) });
      }
    }
    if (ruta.fin_latitud && ruta.fin_longitud) {
      // si fin no coincide con último elemento, añadirlo
      const last = chain[chain.length - 1];
      const finLat = parseFloat(ruta.fin_latitud);
      const finLng = parseFloat(ruta.fin_longitud);
      if (!last || last.lat !== finLat || last.lng !== finLng) {
        chain.push({ lat: finLat, lng: finLng });
      }
    }
    setForm({
      nombre: ruta.nombre,
      zona_id: ruta.zona_id,
      id: ruta.id,
      activo: ruta.activo ?? true,
      inicio_latitud: ruta.inicio_latitud ?? "",
      inicio_longitud: ruta.inicio_longitud ?? "",
      fin_latitud: ruta.fin_latitud ?? "",
      fin_longitud: ruta.fin_longitud ?? "",
      puntos_intermedios_text: Array.isArray(ruta.puntos_intermedios)
        ? ruta.puntos_intermedios.map(p => `${p.lat},${p.lng}`).join(";")
        : "",
      puntos_intermedios: Array.isArray(ruta.puntos_intermedios) ? ruta.puntos_intermedios : [],
      points_chain: chain
    });

    // Centrar mapa: preferir inicio, sino centro de la zona, sino geocode, sino Retalhuleu
    let center = null;
    if (ruta.inicio_latitud && ruta.inicio_longitud) {
      center = [parseFloat(ruta.inicio_latitud), parseFloat(ruta.inicio_longitud)];
      setMapCenter(center);
      setMapZoom(15);
    } else {
      const zone = zonas.find(z => String(z.id) === String(ruta.zona_id));
      center = getZoneCenter(zone);
      if (!center) {
        const geocoded = await geocodeZone(zone);
        if (geocoded) center = geocoded;
      }
      center = center || RETALHULEU_CENTER;
      setMapCenter(center);
      setMapZoom(center === RETALHULEU_CENTER ? RETALHULEU_ZOOM : 15);
    }

    // Mover mapa inmediatamente si existe instancia
    if (mapInstance && center) {
      try {
        if (typeof mapInstance.flyTo === "function") {
          mapInstance.flyTo(center, mapZoom || 15, { animate: true, duration: 0.6 });
        } else {
          mapInstance.setView(center, mapZoom || 15);
        }
        if (typeof mapInstance.invalidateSize === "function") mapInstance.invalidateSize();
      } catch (err) {
        try { mapInstance.setView(center, mapZoom || 15); } catch (_) {}
      }
    }

    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await eliminarRuta(id);
      setToastMsg("Ruta eliminada correctamente");
      setShowToast(true);
    } catch (err) {
      setToastMsg("Error al eliminar la ruta");
      setShowToast(true);
    }
    // refreshRutas();
  };

  // Componente interno para capturar clicks del mapa
  function ClickMap() {
    useMapEvents({
      click(e) {
        setForm(prev => {
          const lat = parseFloat(e.latlng.lat.toFixed(6));
          const lng = parseFloat(e.latlng.lng.toFixed(6));
          // nueva cadena: añadir siempre al final
          const chain = [...(prev.points_chain || []), { lat, lng }];

          // establecer inicio como primer punto, fin como último, y puntos_intermedios como el resto (sin extremos)
          const inicio = chain[0] ? chain[0] : null;
          const fin = chain.length > 0 ? chain[chain.length - 1] : null;
          const intermediarios = chain.length > 2 ? chain.slice(1, -1).map(p => ({ lat: p.lat, lng: p.lng })) : [];

          return {
            ...prev,
            points_chain: chain,
            inicio_latitud: inicio ? inicio.lat : "",
            inicio_longitud: inicio ? inicio.lng : "",
            fin_latitud: fin ? fin.lat : "",
            fin_longitud: fin ? fin.lng : "",
            puntos_intermedios: intermediarios,
            puntos_intermedios_text: intermediarios.map(p => `${p.lat},${p.lng}`).join("; ")
          };
        });
      }
    });
    return null;
  }

  // Helper para limpiar puntos en el modal
  const clearMapPoints = () => {
    setForm(f => ({
      ...f,
      inicio_latitud: "",
      inicio_longitud: "",
      fin_latitud: "",
      fin_longitud: "",
      puntos_intermedios: [],
      puntos_intermedios_text: "",
      points_chain: []
    }));
    if (mapInstance && typeof mapInstance.invalidateSize === "function") {
      try { mapInstance.invalidateSize(); } catch (_) {}
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.zona_id) return;

    // Construir payload a partir de points_chain si existe
    const payload = { nombre: form.nombre, zona_id: Number(form.zona_id) };
    const chain = Array.isArray(form.points_chain) && form.points_chain.length ? form.points_chain : null;

    if (chain && chain.length >= 1) {
      // inicio = primer punto
      payload.inicio_latitud = chain[0].lat;
      payload.inicio_longitud = chain[0].lng;
    }
    if (chain && chain.length >= 2) {
      // fin = último punto
      const last = chain[chain.length - 1];
      payload.fin_latitud = last.lat;
      payload.fin_longitud = last.lng;
    }
    if (chain && chain.length > 2) {
      // intermediarios = puntos entre 1..n-2
      payload.puntos_intermedios = chain.slice(1, -1).map(p => ({ lat: p.lat, lng: p.lng }));
    } else if (!chain || chain.length === 0) {
      // fallback a campos individuales si user los llenó manualmente
      if (form.inicio_latitud !== "" && form.inicio_longitud !== "") {
        payload.inicio_latitud = parseFloat(form.inicio_latitud);
        payload.inicio_longitud = parseFloat(form.inicio_longitud);
      }
      if (form.fin_latitud !== "" && form.fin_longitud !== "") {
        payload.fin_latitud = parseFloat(form.fin_latitud);
        payload.fin_longitud = parseFloat(form.fin_longitud);
      }
      if (form.puntos_intermedios && form.puntos_intermedios.length) {
        payload.puntos_intermedios = form.puntos_intermedios;
      }
    }

    try {
      if (editMode && form.id) {
        await actualizarRuta({
          id: form.id,
          ...payload,
          activo: !!form.activo
        });
        setToastMsg("Ruta actualizada correctamente");
      } else {
        await crearRuta(payload);
        setToastMsg("Ruta creada correctamente");
      }
      setShowToast(true);
    } catch (err) {
      setToastMsg("Error al guardar la ruta");
      setShowToast(true);
    }
    setShowModal(false);
    // refreshRutas();
  };

  // Helper para obtener puntos de la ruta seleccionada (inicio, intermediarios, fin)
  const getRutaPointsChain = (ruta) => {
    if (!ruta) return [];
    const chain = [];
    if (ruta.inicio_latitud && ruta.inicio_longitud) {
      chain.push({ lat: parseFloat(ruta.inicio_latitud), lng: parseFloat(ruta.inicio_longitud) });
    }
    if (Array.isArray(ruta.puntos_intermedios) && ruta.puntos_intermedios.length) {
      for (const p of ruta.puntos_intermedios) {
        chain.push({ lat: parseFloat(p.lat), lng: parseFloat(p.lng) });
      }
    }
    if (ruta.fin_latitud && ruta.fin_longitud) {
      const last = chain[chain.length - 1];
      const finLat = parseFloat(ruta.fin_latitud);
      const finLng = parseFloat(ruta.fin_longitud);
      if (!last || last.lat !== finLat || last.lng !== finLng) {
        chain.push({ lat: finLat, lng: finLng });
      }
    }
    return chain;
  };

  // Helper para obtener acopios de la ruta seleccionada
  const getAcopiosDeRuta = (ruta) => {
    if (!ruta || !Array.isArray(ruta.acopios)) return [];
    return ruta.acopios.filter(a =>
      a.latitud !== undefined && a.longitud !== undefined && !Number.isNaN(a.latitud) && !Number.isNaN(a.longitud)
    );
  };

  // Marker icon fix (opcional para que se vean los marcadores correctamente)
  const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25,41],
    iconAnchor: [12,41]
  });

  // Helper para obtener centro y zoom óptimo de una ruta
  function getRutaMapView(ruta) {
    const points = getRutaPointsChain(ruta);
    if (!points.length) return { center: [14.536, -91.676], zoom: 10 };
    if (points.length === 1) return { center: [points[0].lat, points[0].lng], zoom: 15 };
    // Calcular bounds
    const lats = points.map(p => p.lat);
    const lngs = points.map(p => p.lng);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const center = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
    // Zoom fijo (puedes calcularlo con leaflet fitBounds si quieres más precisión)
    return { center, zoom: 14 };
  }

  // Componente para centrar el mapa principal al seleccionar ruta
  function RutaMapAutoCenter({ ruta }) {
    const map = useMap();
    useEffect(() => {
      if (!ruta) return;
      const { center, zoom } = getRutaMapView(ruta);
      if (center && zoom) {
        map.setView(center, zoom, { animate: true });
      }
    }, [ruta, map]);
    return null;
  }

  return (
    <div className={`${rolesStyles.pageBg} container-fluid`} style={{ position: "relative" }}>
      <div className={`w-100 px-3`}>
        <LoadingOverlay loading={loadingRutas || loading} error={!!error} />

        <div className={rolesStyles.usuariosHeader}>
          <div className="d-flex align-items-center flex-wrap gap-3">
            <FaRoute className={rolesStyles.usuariosHeaderIcon} />
            <div className="flex-grow-1">
              <h1 className={rolesStyles.panelTitle}>Panel de Administración</h1>
              <p className="mb-0 text-muted" style={{ fontSize: "var(--font-size-small)", opacity: 0.8 }}>
                Gestión de rutas
              </p>
            </div>
          </div>
        </div>

        {/* Layout vertical: tabla arriba, mapa abajo */}
        <div style={{ width: "100%" }}>
          {/* Tabla de rutas (encabezado y acciones) */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <Button size="sm" onClick={handleAdd} className={`${usuariosStyles.usuariosBtn} ${usuariosStyles.usuariosBtnEdit}`}>
                  Agregar ruta
                </Button>
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className={rolesStyles.usuariosTableBg} style={{ width: '100%', overflowX: 'auto' }}>
              {/* DataTable styled like Zonas (wrapper allows horizontal scroll) */}
              <DataTable
                columns={
                  [
                    {
                      name: 'Nombre',
                      selector: row => row.nombre,
                      sortable: true,
                      grow: 2,
                      cell: row => (
                        <div className="d-flex align-items-center" style={{ padding: '8px 0' }}>
                          <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-bin-green), #16a34a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                            color: 'var(--color-text-white)',
                            fontSize: 12,
                            fontWeight: 'bold'
                          }}>{row.nombre?.charAt(0)?.toUpperCase() || 'R'}</div>
                          <div>
                            <div style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-p)', color: 'var(--color-text-dark)' }}>{row.nombre}</div>
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>{row.zona_nombre || ''}</div>
                          </div>
                        </div>
                      )
                    },
                    {
                      name: 'ID',
                      selector: row => row.id,
                      sortable: true,
                      width: '80px'
                    },
                    {
                      name: 'Activo',
                      selector: row => row.activo,
                      sortable: true,
                      width: '100px',
                      cell: row => (row.activo ? <span className="badge bg-success">Sí</span> : <span className="badge bg-secondary">No</span>)
                    },
                    {
                      name: 'Acciones',
                      width: '200px',
                      center: true,
                      cell: row => (
                        <div className="d-flex gap-1 justify-content-center">
                          <Button size="sm" variant="outline-primary" className={`${usuariosStyles.usuariosBtn} ${usuariosStyles.btnEdit} me-1`} onClick={() => handleEdit(row)} title="Editar ruta">
                            <FaEdit />
                          </Button>
                          <Button size="sm" variant="outline-danger" className={`${usuariosStyles.usuariosBtn} ${usuariosStyles.btnDelete}`} onClick={() => handleDelete(row.id)} title="Eliminar ruta">
                            <FaTrashAlt />
                          </Button>
                        </div>
                      )
                    }
                  ]
                }
                data={rutas}
                noHeader
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5,10,15,20,50]}
                highlightOnHover
                pointerOnHover
                onRowClicked={row => setSelectedRuta(row)}
                noDataComponent={
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ padding: '60px 20px' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(27, 185, 52, 0.1), rgba(20, 100, 255, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 32, color: 'var(--color-text-gray)' }}>
                      <FaUsers />
                    </div>
                    <h4 style={{ color: 'var(--color-text-gray)', marginBottom: 8, fontSize: 'var(--font-size-h3)' }}>No se encontraron rutas</h4>
                    <p style={{ color: 'var(--color-text-gray)', fontSize: 'var(--font-size-small)', textAlign: 'center' }}>Crea una nueva ruta para comenzar.</p>
                  </div>
                }
                customStyles={{
                  header: { style: { backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold', fontSize: '14px', padding: '16px', borderBottom: '2px solid #16a34a', borderRadius: 'var(--border-radius) var(--border-radius) 0 0', minHeight: '56px' } },
                  headRow: { style: { backgroundColor: '#dcfce7', borderBottomColor: '#16a34a', borderBottomStyle: 'solid', borderBottomWidth: '2px', minHeight: '48px' } },
                  headCells: { style: { color: '#166534', fontWeight: 'bold', textAlign: 'left', fontSize: '13px', borderRight: '1px solid #bbf7d0', padding: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' } },
                  cells: { style: { borderRight: '1px solid #f1f5f9', padding: '12px', backgroundColor: '#ffffff' } },
                  rows: { style: { backgroundColor: '#ffffff', color: '#000000', minHeight: '56px', borderBottomColor: '#f1f5f9', borderBottomStyle: 'solid', borderBottomWidth: '1px', transition: 'all var(--transition-fast) ease' }, highlightOnHoverStyle: { backgroundColor: 'rgba(27, 185, 52, 0.05)', transition: '0.2s ease-in-out' } },
                  pagination: { style: { backgroundColor: '#ffffff', color: '#000000', fontWeight: 'normal', borderTop: '1px solid #f1f5f9', padding: '16px' }, pageButtonsStyle: { borderRadius: '4px', height: '32px', width: '32px', padding: '4px', margin: '2px', cursor: 'pointer', color: '#000000' } },
                  table: { style: { borderRadius: 'var(--border-radius)', overflow: 'visible', boxShadow: 'var(--box-shadow-card)', minWidth: '900px', width: '100%' } },
                  tableWrapper: { style: { borderRadius: 'var(--border-radius)', overflow: 'visible', minWidth: '900px' } }
                }}
              />
            </div>
          </div>

          {/* Mapa (debajo de la tabla, este mapa queda preparado para mostrar la ruta seleccionada)
          <div>
            <div className="mb-2">
              <strong>
                {selectedRuta
                  ? `Ruta: ${selectedRuta.nombre} (${selectedRuta.zona_nombre || ""})`
                  : "Seleccione una ruta para ver el mapa"}
              </strong>
            </div>
            <div style={{ height: 400, width: "100%", border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
              <MapContainer
                center={selectedRuta ? getRutaMapView(selectedRuta).center : RETALHULEU_CENTER}
                zoom={selectedRuta ? getRutaMapView(selectedRuta).zoom : RETALHULEU_ZOOM}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                <RutaMapAutoCenter ruta={selectedRuta} />

                {selectedRuta && getRutaPointsChain(selectedRuta).length > 0 && (
                  <>
                    <Polyline positions={getRutaPointsChain(selectedRuta).map(p => [p.lat, p.lng])} color="cyan" />
                    {getRutaPointsChain(selectedRuta).map((p, idx) => (
                      <Marker key={`sel-${idx}`} position={[p.lat, p.lng]} icon={L.icon({
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                        iconSize: [25,41],
                        iconAnchor: [12,41]
                      })} />
                    ))}
                    {getAcopiosDeRuta(selectedRuta).map((a, idx) => (
                      <Marker key={`acopio-${a.id}`} position={[parseFloat(a.latitud), parseFloat(a.longitud)]} icon={L.icon({
                        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                        iconSize: [32,32],
                        iconAnchor: [16,32]
                      })} />
                    ))}
                  </>
                )}
              </MapContainer>
            </div>
          </div>  */}
        </div>

      {/* Modal de agregar/editar ruta */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className={usuariosStyles.usuariosHeader}>
          <Modal.Title className={rolesStyles.panelTitle}>{editMode ? "Editar ruta" : "Agregar ruta"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className={usuariosStyles.usuariosTableBg}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  required
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Zona</Form.Label>
                <Form.Select
                  name="zona_id"
                  value={form.zona_id}
                  onChange={handleZonaChange}
                  required
                  className="py-2"
                >
                  <option value="">Seleccione una zona...</option>
                  {zonas.map(z => (
                    <option key={z.id} value={z.id}>
                      {z.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="mb-3">
                <small className="text-muted">Haz clic en el mapa: 1) Inicio, 2) Fin, siguientes → puntos intermedios</small>
                <div style={{ height: 300, width: "100%", marginTop: 8 }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: "100%", width: "100%" }}
                    whenCreated={setMapInstance} /* guarda la instancia para invalidateSize */
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <ClickMap />

                    {Array.isArray(form.points_chain) && form.points_chain.length > 0 ? (
                      <>
                        {form.points_chain.map((p, idx) => (
                          <Marker key={`chain-${idx}`} position={[p.lat, p.lng]} icon={defaultIcon} />
                        ))}
                        <Polyline positions={form.points_chain.map(p => [p.lat, p.lng])} color="cyan" />
                      </>
                    ) : (
                      <>
                        {form.inicio_latitud && form.inicio_longitud && (
                          <Marker position={[parseFloat(form.inicio_latitud), parseFloat(form.inicio_longitud)]} icon={defaultIcon} />
                        )}
                        {Array.isArray(form.puntos_intermedios) && form.puntos_intermedios.map((p, idx) => (
                          <Marker key={`int-${idx}`} position={[p.lat, p.lng]} icon={defaultIcon} />
                        ))}
                        {form.fin_latitud && form.fin_longitud && (
                          <Marker position={[parseFloat(form.fin_latitud), parseFloat(form.fin_longitud)]} icon={defaultIcon} />
                        )}

                        <Polyline positions={[
                          ...(form.inicio_latitud && form.inicio_longitud ? [[parseFloat(form.inicio_latitud), parseFloat(form.inicio_longitud)]] : []),
                          ...(Array.isArray(form.puntos_intermedios) ? form.puntos_intermedios.map(p => [p.lat, p.lng]) : []),
                          ...(form.fin_latitud && form.fin_longitud ? [[parseFloat(form.fin_latitud), parseFloat(form.fin_longitud)]] : [])
                        ]} color="cyan" />
                      </>
                    )}
                  </MapContainer>
                </div>

                <div className="d-flex gap-2 mt-2">
                  <Button size="sm" variant="outline-secondary" onClick={clearMapPoints}>Limpiar puntos</Button>
                  <Form.Text className="text-muted ms-auto">Puedes editar puntos manualmente en el campo "Puntos intermedios".</Form.Text>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Puntos intermedios (lat,lng; separador ';')</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="12.345,-76.543; 12.346,-76.544"
                  value={form.puntos_intermedios_text}
                  onChange={e => setForm(f => ({ ...f, puntos_intermedios_text: e.target.value }))}
                />
                <Form.Text className="text-muted">
                  Formato simple: cada punto "lat,lng" separado por punto y coma.
                </Form.Text>
              </Form.Group>

              {editMode && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Activo</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Activo"
                    checked={form.activo}
                    onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))}
                  />
                </Form.Group>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className={`${usuariosStyles.usuariosBtn} ${usuariosStyles.usuariosBtnEdit}`}>
              {editMode ? "Actualizar" : "Agregar"}
            </Button>
            <Button className={`${usuariosStyles.usuariosBtn} ms-2`} variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Toast de notificación */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          bg="success"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2500}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notificación</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
      </div>
    </div>
  );
}
