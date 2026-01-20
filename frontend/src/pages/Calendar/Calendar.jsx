import { useEffect, useState } from "react";
import CalendarioTable from "./CalendarioTable";
import CalendarioForm from "./CalendarioForm";
import CalendarioFilters from "./CalendarioFilters";
import CalendarioMap from "./CalendarioMap";
import { useCalendario } from "../../hooks/useCalendario";
import { isAuthenticated } from "../../services/api";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import { Modal, Button } from "react-bootstrap";

export default function Calendar() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const calendarioHook = useCalendario();
  const [showForm, setShowForm] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [horarioToDelete, setHorarioToDelete] = useState(null);

  // Carga los datos al montar el componente y cada vez que se agrega/edita/elimina
  useEffect(() => {
    calendarioHook.refreshCalendario && calendarioHook.refreshCalendario();
  }, []);

  // Muestra mensaje si no hay datos
  const isLoading = calendarioHook.loading;
  const hasError = calendarioHook.error;
  const calendario = Array.isArray(calendarioHook.calendario) ? calendarioHook.calendario : [];

  const handleEdit = (horario) => {
    setEditingHorario(horario);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingHorario(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHorario(null);
  };

  // Visual modal para confirmar eliminación
  const handleDelete = (horario) => {
    setHorarioToDelete(horario);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (horarioToDelete) {
      await calendarioHook.handleDelete(horarioToDelete.id);
      setShowDeleteModal(false);
      setHorarioToDelete(null);
      // Puedes agregar aquí una notificación visual si tienes un toast global
      // Ejemplo: toast("Horario eliminado correctamente", { type: "success" });
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setHorarioToDelete(null);
  };

  // Estilos verdes para el modal de confirmación
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
    transition: "transform 0.15s, box-shadow 0.15s"
  };

  const holoModalStyle = {
    background: "linear-gradient(120deg, #e0ffe0 0%, #43ea7c 100%)",
    borderRadius: "22px",
    boxShadow: "0 0 24px 2px #43ea7c44, 0 0 32px 4px #16812622"
  };

  return (
    <div className="container-fluid px-2 px-md-4 py-4" style={{ position: 'relative', background: '#f4f6f8', minHeight: '100vh', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <LoadingOverlay loading={isLoading} error={hasError} />
      <div className="mb-4 d-flex gap-3 flex-wrap align-items-center justify-content-between" style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px 20px', border: '1px solid #e0e0e0' }}>
        <h2 className="mb-0" style={{ fontWeight: 700, color: '#263238', fontSize: '1.5rem', letterSpacing: 0.5 }}>Gestión de Horarios</h2>
        <button className="btn" style={{ background: '#388e3c', color: '#fff', fontWeight: 600, fontSize: '1.08rem', borderRadius: 8, padding: '10px 28px', boxShadow: '0 1px 4px rgba(56,142,60,0.08)', border: 'none', transition: 'background 0.2s' }} onClick={handleAdd}>
          <i className="fas fa-plus me-2"></i>
          Agregar horario
        </button>
      </div>
      <div className="mb-4" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0', padding: '18px 16px' }}>
        <CalendarioFilters calendarioHook={calendarioHook} />
      </div>
      {/* Mapa arriba, tabla abajo, ambos col-12 */}
      <div className="row g-4">
        <div className="col-12">
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0', padding: '18px 16px' }}>
            <CalendarioMap calendarioHook={calendarioHook} />
          </div>
        </div>
        <div className="col-12">
          {!isLoading && !hasError && calendario.length === 0 && (
            <div className="alert alert-info" style={{ fontSize: '1.08rem', color: '#388e3c', background: '#f0fdf4', border: '1px solid #16a34a', borderRadius: 10 }}>
              <i className="fas fa-info-circle me-2"></i>
              No hay horarios registrados. Haga clic en "Agregar horario" para crear el primero.
            </div>
          )}
          <CalendarioTable 
            calendarioHook={{
              ...calendarioHook,
              handleDelete: handleDelete
            }} 
            onEdit={handleEdit}
          />
        </div>
      </div>
      <CalendarioForm
        show={showForm}
        onHide={handleCloseForm}
        calendarioHook={calendarioHook}
        editingHorario={editingHorario}
      />
      {/* Modal de confirmación visual para eliminar */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <div style={holoModalStyle}>
          <Modal.Header closeButton style={{ border: 'none', background: 'transparent' }}>
            <Modal.Title style={{ color: '#168126', fontWeight: 700 }}>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: 'center', fontSize: '1.08rem', color: '#168126', background: 'transparent' }}>
            ¿Está seguro de eliminar este horario?
          </Modal.Body>
          <Modal.Footer style={{ border: 'none', background: 'transparent', justifyContent: 'center' }}>
            <Button style={holoBtnStyle} onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button style={holoBtnStyle} onClick={confirmDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}
// ¡Listo! El diseño holográfico verde ya está aplicado en el modal de confirmación.
