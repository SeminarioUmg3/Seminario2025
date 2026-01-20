import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import DataTable from 'react-data-table-component'; // Importar la librería

const globalFontStyle = {
  fontSize: "15px",
  fontFamily: "Segoe UI, Arial, sans-serif",
  color: '#263238',
};

const modalContentStyle = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  border: '1px solid #e0e0e0',
  padding: '24px 24px 0 24px',
};

const labelStyle = {
  ...globalFontStyle,
  fontWeight: 600,
  color: '#388e3c',
  fontSize: '1rem',
};

const inputStyle = {
  ...globalFontStyle,
  borderRadius: 8,
  border: '1px solid #bdbdbd',
  padding: '8px 12px',
  fontSize: '1rem',
};

const btnMainStyle = {
  ...globalFontStyle,
  background: '#388e3c',
  color: '#fff',
  fontWeight: 600,
  fontSize: '1.08rem',
  borderRadius: 8,
  padding: '10px 28px',
  boxShadow: '0 1px 4px rgba(56,142,60,0.08)',
  border: 'none',
  transition: 'background 0.2s',
};

const btnSecStyle = {
  ...globalFontStyle,
  background: '#e0e0e0',
  color: '#263238',
  fontWeight: 600,
  fontSize: '1.08rem',
  borderRadius: 8,
  padding: '10px 28px',
  border: 'none',
  marginRight: 8,
};

export default function CalendarioForm({ show, onHide, calendarioHook, editingHorario = null }) {
  const [formData, setFormData] = useState({
    ruta_id: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
    frecuencia: 'Semanal',
    notas: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Opciones para los selects
  const diasSemana = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' }
  ];

  const frecuencias = ['Diario', 'Semanal', 'Quincenal', 'Mensual'];

  // Cargar rutas al abrir el modal
  useEffect(() => {
    if (show && calendarioHook.rutas.length === 0) {
      calendarioHook.obtenerRutas();
    }
  }, [show, calendarioHook]);

  // Cargar datos si está editando
  useEffect(() => {
    if (editingHorario) {
      console.log('Cargando datos para editar:', editingHorario);
      setFormData({
        ruta_id: editingHorario.ruta_id || '',
        dia_semana: editingHorario.dia_semana?.toString() || '',
        hora_inicio: editingHorario.hora_inicio?.substring(0, 5) || '',
        hora_fin: editingHorario.hora_fin?.substring(0, 5) || '',
        frecuencia: editingHorario.frecuencia || 'Semanal',
        notas: editingHorario.notas || ''
      });
    } else {
      setFormData({
        ruta_id: '',
        dia_semana: '',
        hora_inicio: '',
        hora_fin: '',
        frecuencia: 'Semanal',
        notas: ''
      });
    }
    setErrors({});
  }, [editingHorario, show]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.ruta_id) {
      newErrors.ruta_id = 'La ruta es obligatoria';
    }

    if (formData.dia_semana === '') {
      newErrors.dia_semana = 'El día de la semana es obligatorio';
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = 'La hora de inicio es obligatoria';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.hora_inicio)) {
      newErrors.hora_inicio = 'Formato de hora inválido (HH:mm)';
    }

    if (!formData.hora_fin) {
      newErrors.hora_fin = 'La hora de fin es obligatoria';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.hora_fin)) {
      newErrors.hora_fin = 'Formato de hora inválido (HH:mm)';
    }

    // Validar que hora_fin sea mayor a hora_inicio
    if (formData.hora_inicio && formData.hora_fin) {
      const [horaI, minI] = formData.hora_inicio.split(':').map(Number);
      const [horaF, minF] = formData.hora_fin.split(':').map(Number);
      const inicioMinutos = horaI * 60 + minI;
      const finMinutos = horaF * 60 + minF;
      
      if (finMinutos <= inicioMinutos) {
        newErrors.hora_fin = 'La hora de fin debe ser mayor a la hora de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        ruta_id: parseInt(formData.ruta_id),
        dia_semana: parseInt(formData.dia_semana)
      };

      console.log('FormData antes de convertir:', formData);
      console.log('SubmitData después de convertir:', submitData);

      if (editingHorario && editingHorario.id) {
        console.log('Actualizando horario con ID:', editingHorario.id, submitData);
        await calendarioHook.actualizarHorario(editingHorario.id, submitData);
      } else {
        console.log('Creando nuevo horario:', submitData);
        await calendarioHook.crearHorario(submitData);
      }
      
      onHide();
    } catch (error) {
      console.error('Error al guardar horario:', error);
      // Asegurar que el error se muestre al usuario
      setErrors({ submit: error.message || 'Error al guardar el horario' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <div style={modalContentStyle}>
        <Modal.Header closeButton style={{ border: 'none', background: 'transparent', paddingBottom: 0 }}>
          <Modal.Title style={{ ...globalFontStyle, fontWeight: 700, color: '#388e3c', fontSize: '1.25rem' }}>
            {editingHorario ? 'Editar Horario' : 'Agregar Nuevo Horario'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ ...globalFontStyle, paddingTop: 0 }}>
          {calendarioHook.error && (
            <Alert variant="danger" className="mb-3">
              {calendarioHook.error}
            </Alert>
          )}
          {errors.submit && (
            <Alert variant="danger" className="mb-3">
              {errors.submit}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Ruta *</Form.Label>
                  <Form.Select
                    name="ruta_id"
                    value={formData.ruta_id}
                    onChange={handleChange}
                    isInvalid={!!errors.ruta_id}
                    style={inputStyle}
                  >
                    <option value="">Seleccione una ruta</option>
                    {calendarioHook.rutas.map(ruta => (
                      <option key={ruta.id} value={ruta.id}>
                        {ruta.nombre} {ruta.zona && `- ${ruta.zona}`}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.ruta_id}
                  </Form.Control.Feedback>
                  {calendarioHook.rutas.length === 0 && (
                    <Form.Text className="text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      Cargando rutas disponibles...
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Día de la Semana *</Form.Label>
                  <Form.Select
                    name="dia_semana"
                    value={formData.dia_semana}
                    onChange={handleChange}
                    isInvalid={!!errors.dia_semana}
                    style={inputStyle}
                  >
                    <option value="">Seleccione un día</option>
                    {diasSemana.map(dia => (
                      <option key={dia.value} value={dia.value}>
                        {dia.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.dia_semana}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            {/* Mostrar información de la ruta seleccionada */}
            {formData.ruta_id && (
              <div className="row mb-3">
                <div className="col-12">
                  {(() => {
                    const rutaSeleccionada = calendarioHook.rutas.find(r => r.id == formData.ruta_id);
                    return rutaSeleccionada && (
                      <Alert variant="info" className="py-2" style={{ ...globalFontStyle, background: '#e8f5e9', color: '#388e3c', border: '1px solid #388e3c' }}>
                        <small>
                          <strong>Ruta seleccionada:</strong> {rutaSeleccionada.nombre}
                          {rutaSeleccionada.zona && <span> - Zona: {rutaSeleccionada.zona}</span>}
                          {rutaSeleccionada.descripcion && (
                            <><br /><em>{rutaSeleccionada.descripcion}</em></>
                          )}
                        </small>
                      </Alert>
                    );
                  })()}
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Hora de Inicio *</Form.Label>
                  <Form.Control
                    type="time"
                    name="hora_inicio"
                    value={formData.hora_inicio}
                    onChange={handleChange}
                    isInvalid={!!errors.hora_inicio}
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.hora_inicio}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Hora de Fin *</Form.Label>
                  <Form.Control
                    type="time"
                    name="hora_fin"
                    value={formData.hora_fin}
                    onChange={handleChange}
                    isInvalid={!!errors.hora_fin}
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.hora_fin}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Frecuencia</Form.Label>
                  <Form.Select
                    name="frecuencia"
                    value={formData.frecuencia}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    {frecuencias.map(freq => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>Notas</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                placeholder="Notas adicionales sobre este horario..."
                style={{ ...inputStyle, minHeight: 60 }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', background: 'transparent', justifyContent: 'flex-end', padding: '18px 24px' }}>
          <Button onClick={onHide} disabled={submitting} style={btnSecStyle}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={submitting || calendarioHook.loading || calendarioHook.rutas.length === 0}
            style={btnMainStyle}
          >
            {submitting ? 'Guardando...' : editingHorario ? 'Actualizar' : 'Crear Horario'}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}
