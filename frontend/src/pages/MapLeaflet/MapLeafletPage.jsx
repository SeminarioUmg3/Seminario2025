import { useState, useEffect } from "react";
import MapLeaflet from "../../components/MapLeaflet/MapLeaflet";
import styles from "./MapLeafletPage.module.css";
import { isAuthenticated } from "../../services/api";
import { Button, Modal, Pagination } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import AcopioForm from "./AcopioForm";
import useAcopio from "../../hooks/useAcopio";

export default function MapLeafletPage() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const { getAcopio, eliminarAcopio, loading, error } = useAcopio();
  const [puntos, setPuntos] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAcopio, setEditingAcopio] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [acopioToDelete, setAcopioToDelete] = useState(null);
  const [zonaFiltro, setZonaFiltro] = useState(0);
  // Paginación para la tabla de puntos (debe estar dentro del componente)
  const rowsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  // Filtrar puntos por zona (declaración única)
  const puntosFiltrados =
    zonaFiltro === 0
      ? puntos
      : puntos.filter((p) =>
          p.zonas?.id ? p.zonas.id === zonaFiltro : p.zona_id === zonaFiltro
        );
  const totalPages = Math.ceil(puntosFiltrados.length / rowsPerPage);
  const paginatedData = puntosFiltrados.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  // Cargar puntos al montar
  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const data = await getAcopio();
        setPuntos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPuntos();
  }, [getAcopio]);

  // ...existing code...

  // Opciones de zonas para el filtro
  const zonasUnicas = [
    ...new Map(
      puntos
        .map((p) =>
          p.zonas
            ? { id: p.zonas.id, nombre: p.zonas.nombre }
            : { id: p.zona_id, nombre: `Zona ${p.zona_id}` }
        )
        .map((z) => [z.id, z])
    ).values(),
  ];

  const handleAgregar = () => {
    setEditingAcopio(null);
    setShowForm(true);
  };

  const handleEdit = (acopio) => {
    setEditingAcopio(acopio);
    setShowForm(true);
  };

  const handleDelete = (acopio) => {
    setAcopioToDelete(acopio);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (acopioToDelete) {
      try {
        await eliminarAcopio(acopioToDelete.id);
        setPuntos((prev) => prev.filter((p) => p.id !== acopioToDelete.id));
        setShowDeleteModal(false);
        setAcopioToDelete(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAcopioToDelete(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAcopio(null);
  };

  const handleFormSuccess = async () => {
    handleCloseForm();
    try {
      const data = await getAcopio();
      setPuntos(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Estilos verdes holográficos para el modal de confirmación
  const holoBtnStyle = {
    background: "linear-gradient(90deg, #43ea7c 0%, #168126 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "18px",
    boxShadow: "0 0 12px 2px #43ea7c88, 0 0 24px 2px #16812644",
    fontWeight: 600,
    padding: "8px 22px",
    margin: "0 6px 6px 0",
    letterSpacing: "0.5px",
    transition: "transform 0.15s, box-shadow 0.15s",
  };

  const holoModalStyle = {
    background: "linear-gradient(120deg, #e0ffe0 0%, #43ea7c 100%)",
    borderRadius: "22px",
    boxShadow: "0 0 24px 2px #43ea7c44, 0 0 32px 4px #16812622",
  };


  // Estilos empresariales tipo Ranking
  const tableStyles = {
    fontSize: "15px",
    color: "#263238",
    fontFamily: "Segoe UI, Arial, sans-serif",
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    border: "1px solid #e0e0e0",
    textAlign: "left",
  };
  const thStyle = {
    background: '#f0fdf4',
    color: '#16a34a',
    fontWeight: 700,
    fontSize: '15px',
    borderBottom: '2px solid #16a34a',
    textAlign: 'center',
    borderRight: '1px solid #e5e7eb',
    letterSpacing: 0.2,
    verticalAlign: 'middle',
  };
  const tdStyle = {
    borderRight: '1px solid #e5e7eb',
    background: '#fff',
    color: '#263238',
    fontSize: '15px',
    verticalAlign: 'middle',
    textAlign: 'center',
    padding: '8px 6px',
  };
  const actionBtnStyle = {
    borderRadius: 6,
    fontWeight: 600,
    fontSize: '14px',
    padding: '4px 10px',
    boxShadow: '0 1px 4px rgba(56,142,60,0.08)',
    border: 'none',
    transition: 'background 0.2s',
  };

  const columnWidths = {
    id: "30px",
    nombre: "200px",
    tipo: "120px",
    horario: "180px",
    direccion: "250px",
    zona: "150px",
    estado: "50px",
    acciones: "150px",
  };

  const numberStyles = {
    fontWeight: "normal", // Quitar el estilo bold para los números
    textAlign: "center",
    fontSize: "12px", // Ajustar el tamaño de fuente a 12px
  };

  const nameStyles = {
    fontWeight: "normal", // Quitar el estilo bold para los nombres
    textAlign: "center",
    fontSize: "12px", // Ajustar el tamaño de fuente a 12px
  };

  return (
    <div className="container py-4 relative" style={{ background: '#f4f6f8', minHeight: '100vh', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <LoadingOverlay loading={loading} error={error} />
      <div className="mb-4 d-flex gap-3 flex-wrap align-items-center justify-content-between" style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px 20px', border: '1px solid #e0e0e0' }}>
        <h2 className="mb-0" style={{ fontWeight: 700, color: '#263238', fontSize: '1.5rem', letterSpacing: 0.5 }}>Puntos de Acopio</h2>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select"
            value={zonaFiltro}
            onChange={(e) => setZonaFiltro(Number(e.target.value))}
            style={{ fontSize: '15px', borderRadius: 8, minWidth: 180 }}
          >
            <option value={0}>Todas las zonas</option>
            {zonasUnicas.map((z) => (
              <option key={z.id} value={z.id}>{z.nombre}</option>
            ))}
          </select>
          <Button
            style={{ background: '#388e3c', color: '#fff', fontWeight: 600, fontSize: '1.08rem', borderRadius: 8, padding: '10px 28px', boxShadow: '0 1px 4px rgba(56,142,60,0.08)', border: 'none', transition: 'background 0.2s' }}
            onClick={handleAgregar}
          >
            <FaPlus className="me-2" />Agregar
          </Button>
        </div>
      </div>
      <div className="mb-4" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0', padding: '18px 16px' }}>
        {/* Aquí podrías agregar más filtros si lo deseas */}
      </div>
      <div className="row g-4">
        <div className="col-12">
          <div style={{ ...tableStyles, padding: 0 }}>
            <table className="table table-bordered mb-0" style={{ background: '#fff', borderRadius: 14, fontSize: '15px' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: columnWidths.id }}>ID</th>
                  <th style={{ ...thStyle, width: columnWidths.nombre }}>Nombre</th>
                  <th style={{ ...thStyle, width: columnWidths.tipo }}>Tipo</th>
                  <th style={{ ...thStyle, width: columnWidths.horario }}>Horario</th>
                  <th style={{ ...thStyle, width: columnWidths.direccion }}>Dirección</th>
                  <th style={{ ...thStyle, width: columnWidths.zona }}>Zona</th>
                  <th style={{ ...thStyle, width: columnWidths.estado }}>Estado</th>
                  <th style={{ ...thStyle, width: columnWidths.acciones }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {!loading && !error && paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center" style={{ color: '#388e3c', background: '#f0fdf4', border: '1px solid #16a34a', borderRadius: 10 }}>No hay puntos disponibles.</td>
                  </tr>
                ) : (
                  paginatedData.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb', background: '#fff', color: '#263238', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      <td style={tdStyle}>{p.id}</td>
                      <td style={tdStyle}><div>{p.nombre || "N/A"}</div></td>
                      <td style={tdStyle}>{p.tipo || "N/A"}</td>
                      <td style={tdStyle}>{p.horario || "N/A"}</td>
                      <td style={tdStyle}>{p.direccion || "N/A"}</td>
                      <td style={tdStyle}>{p.zonas?.nombre || `Zona ${p.zona_id || "N/A"}`}</td>
                      <td style={tdStyle}><span className={p.estadoClass}>{p.estado || "N/A"}</span></td>
                      <td style={tdStyle}>
                        <div className="d-flex flex-row gap-2 justify-content-center">
                          <Button size="sm" style={{ ...actionBtnStyle, background: '#f0fdf4', color: '#16a34a', border: '1px solid #16a34a' }} onClick={() => handleEdit(p)}>
                            <FaEdit size={15} />
                          </Button>
                          <Button size="sm" style={{ ...actionBtnStyle, background: '#fff0f0', color: '#d42d2d', border: '1px solid #d42d2d' }} onClick={() => handleDelete(p)}>
                            <FaTrashAlt size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Paginación visual */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-3">
                <Pagination>
                  <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                  <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              </div>
            )}
          </div>
        </div>
        {/* Mapa abajo */}
        <div className="col-12">
          <div className={styles.mapaContainer}>
            <MapLeaflet puntos={paginatedData} />
          </div>
        </div>
      </div>
      {/* Modal para el mapa interactivo */}
      <Modal
        show={showMap}
        onHide={() => setShowMap(false)}
        size="xl"
        centered
        dialogClassName={styles.mapaModal}
      >
        <Modal.Header closeButton>
          <Modal.Title style={tableStyles}>
            Mapa Interactivo de Puntos de Acopio
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0, fontSize: "12px" }}>
          <div className={styles.mapaContainer}>
            <MapLeaflet puntos={paginatedData} />
          </div>
          <div className="text-center py-3">
            <Button variant="secondary" onClick={() => setShowMap(false)} style={{ fontSize: "12px" }}>
              Cerrar mapa
            </Button>
            <span className="ms-3 text-muted" style={{ fontSize: "12px" }}>
              Puedes cerrar el mapa con el botón o la X arriba.
            </span>
          </div>
        </Modal.Body>
      </Modal>
      <AcopioForm
        show={showForm}
        onHide={handleCloseForm}
        editingAcopio={editingAcopio}
        onSuccess={handleFormSuccess}
      />
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <div style={holoModalStyle}>
          <Modal.Header closeButton style={{ border: "none", background: "transparent" }}>
            <Modal.Title style={{ color: "#168126", fontWeight: 700, ...tableStyles }}>
              Confirmar eliminación
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center", fontSize: "1.08rem", color: "#168126", background: "transparent", ...tableStyles }}>
            ¿Está seguro de eliminar el centro de acopio <b>{acopioToDelete?.nombre}</b>?
          </Modal.Body>
          <Modal.Footer style={{ border: "none", background: "transparent", justifyContent: "center" }}>
            <Button style={{ ...holoBtnStyle, ...tableStyles }} onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button style={{ ...holoBtnStyle, ...tableStyles }} onClick={confirmDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}