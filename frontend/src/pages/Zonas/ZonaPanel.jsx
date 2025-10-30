import { useEffect, useState, useMemo } from "react";
import { obtenerZonas, crearZona, actualizarZona, eliminarZona } from "../../services/api";
import { Button, Table, Modal, Form, Spinner } from "react-bootstrap";
import styles from "./Zonas.module.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import ZonasFilter from "./ZonasFilter";
import ZonasTable from "./ZonasTable";
import Swal from "sweetalert2";
export default function ZonaPanel() {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nombre: "", codigo: "", id: null });
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [onDelete, setOnDelete] = useState(false);

  const zonasFiltradasCodigo = useMemo(() => {
    return zonas.filter(z =>
      filtroCodigo === "" || z.codigo.toLowerCase().includes(filtroCodigo.toLowerCase())
    );
  }, [zonas, filtroCodigo]);
  
  const refreshZonas = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Solicitando zonas...");
      const res = await obtenerZonas();
      console.log("Respuesta zonas:", res);
      // Ajuste: si res.zonas existe, usar ese array
      const zonasArray = Array.isArray(res) ? res : (Array.isArray(res.zonas) ? res.zonas : []);
      setZonas(zonasArray);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener zonas:", err);
      if (err?.response?.status === 401 || err?.message?.includes("No autorizado")) {
        setError("No autorizado. Por favor inicia sesión.");
      } else {
        setError("Error al obtener zonas: " + (err?.message || err));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshZonas();
  }, []);

  const handleAdd = () => {
    setForm({ nombre: "", codigo: "", id: null });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (zona) => {
    setForm({ nombre: zona.nombre, codigo: zona.codigo, id: zona.id });
    setEditMode(true);
    setShowModal(true);
  };
  const handleDelete = async (zona) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la zona "${zona.nombre}" permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await eliminarZona(zona.id);
      refreshZonas();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Para actualizar, enviar id, nombre y codigo (PUT)
    if (editMode && form.id) {
      await actualizarZona({ id: form.id, nombre: form.nombre, codigo: form.codigo });
    } else {
      // Para crear, solo enviar nombre y codigo (POST)
      if (!form.nombre || !form.codigo) return;
      await crearZona({ nombre: form.nombre, codigo: form.codigo });
    }
    setShowModal(false);
    refreshZonas();
  };

  return (
    <div className={`${styles.pageBg} container-fluid`}>
      {/* Loading/Error overlay */}
      <div className={`${styles.usuariosContainer} mx-auto`}>
        {(loading || error) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            loading
          </div>
        )}

        {/* Header */}
        
        <div className={styles.usuariosHeader}>
          <div className="d-flex align-items-center flex-wrap gap-3">
            <FaUser className={styles.usuariosHeaderIcon} />
            <div className="flex-grow-1">
              <h1 className={styles.panelTitle}>Panel de Administración</h1>
              <p className="mb-0 text-muted" style={{ fontSize: "var(--font-size-small)", opacity: 0.8 }}>
                Gestión de zonas
              </p>
            </div>
          </div>
        </div>

        <ZonasFilter
          filtroCodigo={filtroCodigo}
          setFiltroCodigo={setFiltroCodigo}
          onAddZona={() => {
            setShowModal(true);
            setEditMode(false);
            setForm({ nombre: "", codigo: "", id: null });
          }}
        />
        {error && <div className="alert alert-danger">{error}</div>}

        <ZonasTable
          zonas={zonasFiltradasCodigo}
          onEdit={handleEdit}
          onDelete={handleDelete}
        /> 
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? "Editar zona" : "Agregar zona"}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Código</Form.Label>
                <Form.Control
                  type="text"
                  name="codigo"
                  value={form.codigo}
                  onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant={editMode ? "warning" : "success"} type="submit">
                {editMode ? "Actualizar" : "Agregar"}
              </Button>
              <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

// Los datos recibidos cumplen con lo esperado:
// [
//   {id: 1, nombre: 'Barrio Monterrey', codigo: '11001'},
//   ...
// ]
// La tabla y el frontend ya muestran estos datos.
// La tabla y el frontend ya muestran estos datos.
// La tabla y el frontend ya muestran estos datos.
