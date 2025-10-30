import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useAcopio from "../../hooks/useAcopio";
import { obtenerZonas } from "../../services/api";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function AcopioForm({ show, onHide, editingAcopio = null, onSuccess }) {
  const { crearAcopio, actualizarAcopio, validarDatosAcopio, loading, error } = useAcopio();
  const [zonas, setZonas] = useState([]);
  const [formData, setFormData] = useState({
    tipo: "",
    nombre: "",
    latitud: "",
    longitud: "",
    direccion: "",
    zona_id: "",
    horario: "",
  });
  const [errors, setErrors] = useState({});
  const [mapCenter, setMapCenter] = useState([14.5367, -91.6761]); // Retalhuleu
  const [markerPosition, setMarkerPosition] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const isEditMode = editingAcopio && editingAcopio.id;

  // Cargar zonas
  useEffect(() => {
    if (show) {
      const fetchZonas = async () => {
        try {
          const res = await obtenerZonas();
          const zonasArray = Array.isArray(res) ? res : (Array.isArray(res.zonas) ? res.zonas : []);
          setZonas(zonasArray);
        } catch (err) {
          console.error("Error al cargar zonas:", err);
          setZonas([]);
        }
      };
      fetchZonas();
    }
  }, [show]);

  useEffect(() => {
    if (!show) setSuccessMessage("");
  }, [show]);

  useEffect(() => {
    if (show) {
      if (isEditMode) {
        const lat = parseFloat(editingAcopio.latitud);
        const lng = parseFloat(editingAcopio.longitud);
        const latLngValid = !isNaN(lat) && !isNaN(lng);

        setFormData({
          tipo: editingAcopio.tipo || "",
          nombre: editingAcopio.nombre || "",
          latitud: latLngValid ? String(lat) : "",
          longitud: latLngValid ? String(lng) : "",
          direccion: editingAcopio.direccion || "",
          zona_id: editingAcopio.zona_id ? String(editingAcopio.zona_id) : "",
          horario: editingAcopio.horario || "",
        });

        if (latLngValid) {
          setMarkerPosition([lat, lng]);
          setMapCenter([lat, lng]);
        } else {
          console.warn("📍 Centro sin coordenadas válidas.");
          setMarkerPosition(null);
          setMapCenter([14.5367, -91.6761]);
        }
      } else {
        setFormData({
          tipo: "",
          nombre: "",
          latitud: "",
          longitud: "",
          direccion: "",
          zona_id: "",
          horario: "",
        });
        setMarkerPosition(null);
        setMapCenter([14.5367, -91.6761]);
      }
      setErrors({});
    }
  }, [editingAcopio, show, isEditMode]);

  // Geolocalización para modo crear
  useEffect(() => {
    if (show && !isEditMode) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
        },
        () => {
          console.warn("No se pudo obtener la ubicación del usuario.");
        }
      );
    }
  }, [show, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const lat = parseFloat(formData.latitud);
    const lng = parseFloat(formData.longitud);
    const zonaId = parseInt(formData.zona_id);

    const validation = validarDatosAcopio({
      ...formData,
      latitud: isNaN(lat) ? null : lat,
      longitud: isNaN(lng) ? null : lng,
      zona_id: isNaN(zonaId) ? null : zonaId,
    });

    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.tipo.trim()) newErrors.tipo = "El tipo es obligatorio.";
    if (isNaN(lat)) newErrors.latitud = "Debe seleccionar la ubicación en el mapa.";
    if (isNaN(lng)) newErrors.longitud = "Debe seleccionar la ubicación en el mapa.";
    if (isNaN(zonaId)) newErrors.zona_id = "Debe seleccionar una zona válida.";

    if (!validation.valido) {
      validation.errores.forEach((error) => {
        if (error.includes("nombre")) newErrors.nombre = error;
        if (error.includes("tipo")) newErrors.tipo = error;
        if (error.includes("latitud")) newErrors.latitud = error;
        if (error.includes("longitud")) newErrors.longitud = error;
        if (error.includes("zona")) newErrors.zona_id = error;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      tipo: formData.tipo,
      nombre: formData.nombre.trim(),
      latitud: parseFloat(formData.latitud),
      longitud: parseFloat(formData.longitud),
      direccion: formData.direccion || null,
      zona_id: parseInt(formData.zona_id),
      horario: formData.horario || null,
    };

    try {
      if (isEditMode) {
        await actualizarAcopio(editingAcopio.id, payload);
      } else {
        await crearAcopio(payload);
        setSuccessMessage("Centro de acopio creado exitosamente.");
        setTimeout(() => setSuccessMessage(""), 5000);
      }
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Error al guardar el centro de acopio:", err);
    }
  };

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setFormData((prev) => ({
          ...prev,
          latitud: lat.toFixed(6),
          longitud: lng.toFixed(6),
        }));
      },
    });
    return null;
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? `Editar Centro: ${editingAcopio?.nombre}` : "Agregar Nuevo Centro de Acopio"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successMessage && (
          <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>
            ✅ {successMessage}
          </Alert>
        )}
        {error && (
          <Alert variant="danger">
            ⚠️ {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Centro *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  isInvalid={!!errors.nombre}
                  placeholder="Ej: Centro Norte de Reciclaje"
                />
                <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Centro *</Form.Label>
                <Form.Control
                  type="text"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  isInvalid={!!errors.tipo}
                  placeholder="Ej: Punto limpio"
                />
                <Form.Control.Feedback type="invalid">{errors.tipo}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Zona *</Form.Label>
                <Form.Select
                  name="zona_id"
                  value={formData.zona_id}
                  onChange={handleChange}
                  isInvalid={!!errors.zona_id}
                >
                  <option value="">Seleccione una zona</option>
                  {zonas.map((zona) => (
                    <option key={zona.id} value={zona.id}>{zona.nombre}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.zona_id}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Seleccionar ubicación en el mapa *</Form.Label>
                <div style={{ height: "300px", width: "100%" }}>
                  <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {markerPosition && <Marker position={markerPosition} icon={markerIcon} />}
                    <MapClickHandler />
                  </MapContainer>
                </div>
                {(errors.latitud || errors.longitud) && (
                  <div className="text-danger mt-1">Debe seleccionar una ubicación en el mapa.</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Latitud</Form.Label>
                <Form.Control
                  type="number"
                  step="0.000001"
                  name="latitud"
                  value={formData.latitud}
                  onChange={handleChange}
                  isInvalid={!!errors.latitud}
                  placeholder="-17.7835"
                />
                <Form.Control.Feedback type="invalid">{errors.latitud}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Longitud</Form.Label>
                <Form.Control
                  type="number"
                  step="0.000001"
                  name="longitud"
                  value={formData.longitud}
                  onChange={handleChange}
                  isInvalid={!!errors.longitud}
                  placeholder="-63.1821"
                />
                <Form.Control.Feedback type="invalid">{errors.longitud}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancelar
            </Button>
            <Button type="submit" variant="success" disabled={loading}>
              {isEditMode ? "Actualizar Centro" : "Crear Centro"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
