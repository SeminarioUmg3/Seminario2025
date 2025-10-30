import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import useNotificacionesCRUD from "../../hooks/useNotificacionesCRUD";
import LoadingOverlay from "../../components/Common/LoadingOverlay";

// Estilos copiados del Ranking
const customStyles = {
  header: {
  style: {
  backgroundColor: "#ffffff", 
  color: "#000000", 
  fontWeight: "bold",
  fontSize: "16px",
  padding: "16px",
  borderBottom: "2px solid #16a34a", 
  borderRight: "1px solid rgb(70, 88, 124)",
  },
  },
  headRow: {
  style: {
  backgroundColor: "#f0fdf4", 
  borderBottomColor: "#16a34a", 
  borderBottomStyle: "solid",
  borderBottomWidth: "2px",
  },
  },
  headCells: {
  style: {
  color: "#16a34a", 
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "14px",
  borderRight: "1px solid #e5e7eb", 
  },
  },
  cells: {
    style: {
    borderRight: "1px solid #e5e7eb", 
    },
  },
  rows: {
    style: {
    backgroundColor: "#ffffff", 
    color: "#000000", 
    minHeight: "48px",
    borderBottomColor: "#e5e7eb", 
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    },
    highlightOnHoverStyle: {
    backgroundColor: "#f3f4f6", 
    transition: "0.2s ease-in-out",
    },
  },
  pagination: {
    style: {
    backgroundColor: "#ffffff", 
    color: "#000000", 
    fontWeight: "bold",
    },
      pageButtonsStyle: {
      borderRadius: "4px",
      height: "32px",
      width: "32px",
      padding: "4px",
      margin: "2px",
      cursor: "pointer",
      color: "#000000",
      "&:hover:not(:disabled)": {
      backgroundColor: "#d1fae5", // verde muy suave al hover
      },
  "&:disabled": {
  color: "#9ca3af",
  },
  },
  },
  };

// Componente del formulario modal
const NotificacionForm = ({ 
  show, 
  onHide, 
  onSubmit, 
  notificacion = null, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    titulo: "",
    cuerpo: "",
    tipo: "INFORMATIVA"
  });

  // Cargar datos cuando se abre para editar
  useState(() => {
    if (notificacion) {
      setFormData({
        titulo: notificacion.titulo || "",
        cuerpo: notificacion.cuerpo || "",
        tipo: notificacion.tipo || "INFORMATIVA"
      });
        } else {
      setFormData({
        titulo: "",
        cuerpo: "",
        tipo: "INFORMATIVA"
      });
    }
  }, [notificacion, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {notificacion ? "Editar Notificación" : "Nueva Notificación"}
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="titulo" className="form-label fw-semibold">Título:</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="form-control"
                  required
                  placeholder="Ingrese el título de la notificación"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="tipo" className="form-label fw-semibold">Tipo:</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="ALERTA">🚨 Alerta</option>
                  <option value="NOTIFICACION">📢 Notificación</option>
                  <option value="INFORMATIVA">ℹ️ Informativa</option>
                  <option value="PROMOCIONAL">🎯 Promocional</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="cuerpo" className="form-label fw-semibold">Contenido:</label>
                <textarea
                  id="cuerpo"
                  name="cuerpo"
                  value={formData.cuerpo}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                  required
                  placeholder="Ingrese el contenido de la notificación"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Guardando..." : (notificacion ? "Actualizar" : "Crear")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function Notificaciones() {
  const { 
    notificaciones, 
    loading, 
    error, 
    crearNotificacion, 
    actualizarNotificacion, 
    eliminarNotificacion 
  } = useNotificacionesCRUD();

  const [filterText, setFilterText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingNotificacion, setEditingNotificacion] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificacionToDelete, setNotificacionToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");

  // Filtrado en memoria
  const filteredData = useMemo(() => {
    if (!notificaciones) return [];
    return notificaciones.filter((notificacion) =>
      notificacion.titulo?.toLowerCase().includes(filterText.toLowerCase()) ||
      notificacion.cuerpo?.toLowerCase().includes(filterText.toLowerCase()) ||
      notificacion.tipo?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [notificaciones, filterText]);

  // Función para obtener el color del badge según el tipo
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "ALERTA":
        return "danger"; 
      case "NOTIFICACION":
        return "secondary"; 
      case "INFORMATIVA":
        return "success"; 
      case "PROMOCIONAL":
        return "warning"; 
      default:
        return "secondary";
    }
  };

  // Función para obtener el ícono según el tipo (removida - solo usamos colores)

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para mostrar alerta flotante
  const showFloatingAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Ocultar después de 3 segundos
            setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // Función para mostrar contenido completo
  const showFullContent = (content) => {
    setSelectedContent(content);
    setShowContentModal(true);
  };

  // Manejar creación/edición
  const handleSubmit = async (formData) => {
    try {
      if (editingNotificacion) {
        await actualizarNotificacion(editingNotificacion.id, formData);
        showFloatingAlert("Notificación actualizada exitosamente", "success");
      } else {
        await crearNotificacion(formData);
        showFloatingAlert("Notificación creada exitosamente", "success");
      }
      setShowForm(false);
      setEditingNotificacion(null);
        } catch (err) {
      console.error("Error al guardar notificación:", err);
      showFloatingAlert("Error al guardar la notificación", "danger");
    }
  };

  // Manejar eliminación
  const handleDelete = async () => {
    try {
      await eliminarNotificacion(notificacionToDelete.id);
      showFloatingAlert("Notificación eliminada exitosamente", "success");
      setShowDeleteModal(false);
      setNotificacionToDelete(null);
        } catch (err) {
      console.error("Error al eliminar notificación:", err);
      showFloatingAlert("Error al eliminar la notificación", "danger");
    }
  };

  // Configuración de columnas
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "60px",
      center: true,
    },
    {
      name: "Tipo",
      selector: (row) => row.tipo,
      sortable: true,
      width: "120px",
      center: true,
      cell: (row) => (
        <span className={`badge bg-${getTipoColor(row.tipo)}`}>
          {row.tipo}
        </span>
      ),
    },
    {
      name: "Título",
      selector: (row) => row.titulo,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div style={{ fontWeight: "bold", color: "#16a34a" }}>
          {row.titulo}
        </div>
      ),
    },
    {
      name: "Contenido",
      selector: (row) => row.cuerpo,
      sortable: false,
      grow: 3,
      cell: (row) => (
        <div 
          style={{ 
            maxWidth: "300px", 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer",
            color: "#16a34a",
            //textDecoration: "underline"
          }}
          onClick={() => showFullContent(row.cuerpo)}
          title="Hacer clic para ver contenido completo"
        >
          {row.cuerpo}
        </div>
      ),
    },
    {
      name: "Fecha",
      selector: (row) => row.fecha_registro,
      sortable: true,
      width: "150px",
      center: true,
      cell: (row) => formatearFecha(row.fecha_registro),
    },
    {
      name: "Creado por",
      selector: (row) => row.usuarios?.nombre_completo || "N/A",
      sortable: true,
      width: "120px",
      center: true,
      cell: (row) => {
        const creador = row.usuarios?.nombre_completo || "N/A";
        return (
          <div 
            style={{ 
              cursor: "pointer",
              color: "#16a34a",
              maxWidth: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
            onClick={() => showFullContent(creador)}
            title="Hacer clic para ver nombre completo"
          >
            {creador}
          </div>
        );
      },
    },
    {
      name: "Acciones",
      selector: (row) => row.id,
      sortable: false,
      width: "120px",
      center: true,
      cell: (row) => (
        <div className="d-flex gap-1 justify-content-center">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              setEditingNotificacion(row);
              setShowForm(true);
            }}
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              setNotificacionToDelete(row);
              setShowDeleteModal(true);
            }}
            title="Eliminar"
          >
            <FaTrash />
          </button>
                  </div>
      ),
    },
  ];

  return (
    <div className="container py-4 relative">
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <LoadingOverlay loading={loading} error={error} />
      
      <h2 className="h2 fw-semibold mb-4 text-center text-success">
        Gestión de Notificaciones
      </h2>

      {/* Filtros y acciones */}
      <div className="mb-4">
        <div className="row g-3 align-items-end">
          {/* Búsqueda */}
          <div className="col-md-6">
            <label className="form-label fw-semibold" style={{ fontSize: '14px'}}>
              Buscar Notificación:
            </label>
            <input
                        type="text"
              placeholder="Buscar por título, contenido o tipo..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="form-control"
              style={{ fontSize: '14px'}}
            />
          </div>
          
          {/* Botón Crear */}
          <div className="col-md-3">
            <button
              onClick={() => {
                setEditingNotificacion(null);
                setShowForm(true);
              }}
              className="btn btn-success w-100 btn-lg"
              style={{ backgroundColor: '#2ecc71', borderColor: '#27ae60', fontSize: '14px'}}
            >
              <FaPlus className="me-2" />
              Nueva Notificación
            </button>
          </div>
          

                        </div>
            </div>

      {/* Tabla de notificaciones */}
      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
          selectAllRowsItem: true,
          selectAllRowsItemText: 'Todos',
        }}
        highlightOnHover
        pointerOnHover
        customStyles={customStyles}
        noHeader
      />

      {/* Modal de formulario */}
      <NotificacionForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingNotificacion(null);
        }}
        onSubmit={handleSubmit}
        notificacion={editingNotificacion}
        loading={loading}
      />

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">⚠️ Confirmar Eliminación</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                        </div>
              <div className="modal-body">
                <p>¿Está seguro de que desea eliminar esta notificación?</p>
                <div className="alert alert-warning">
                  <strong>Título:</strong> {notificacionToDelete?.titulo}
                          </div>
                <p className="text-muted small">
                  Esta acción no se puede deshacer.
                </p>
                          </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : "Eliminar"}
                </button>
                                </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mostrar contenido completo */}
      {showContentModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"> Contenido </h5>
                <button type="button" className="btn-close" onClick={() => setShowContentModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="p-3 bg-light rounded">
                  <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0 }}>
                    {selectedContent}
                  </pre>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowContentModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerta flotante */}
      {showAlert && (
        <div 
          className={`alert alert-${alertType} position-fixed`}
          style={{
            top: '20px',
            right: '20px',
            zIndex: 9999,
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              {alertMessage}
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowAlert(false)}
            ></button>
          </div>
        </div>
      )}

      {/* Overlay para modal */}
      {showForm && <div className="modal-backdrop show"></div>}
      {showDeleteModal && <div className="modal-backdrop show"></div>}
      {showContentModal && <div className="modal-backdrop show"></div>}
    </div>
  );
}