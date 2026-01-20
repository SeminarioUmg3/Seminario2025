import { useState } from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

// Estilos empresariales para la tabla
const customTableStyles = {
  background: '#fff',
  borderRadius: 14,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  border: '1px solid #e0e0e0',
  fontSize: '15px',
  color: '#263238',
  fontFamily: 'Segoe UI, Arial, sans-serif',
};

const thStyle = {
  background: '#f0fdf4',
  color: '#16a34a',
  fontWeight: 700,
  fontSize: '15px',
  borderBottom: '2px solid #16a34a',
  textAlign: 'left',
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

// Recibe calendarioHook y onEdit

export default function CalendarioTable({ calendarioHook, onEdit }) {
  const { calendario = [] } = calendarioHook;
  
  // Array local de días de la semana para mostrar correctamente
  const diasSemanaLocal = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Paginación
  const rowsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(calendario.length / rowsPerPage);
  const paginatedData = calendario.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };




  if (!Array.isArray(calendario) || calendario.length === 0) {
    return (
      <div className="mt-3" style={{ ...customTableStyles }}>
        <div className="alert alert-info" style={{ fontSize: '15px', color: '#388e3c', background: '#f0fdf4', border: '1px solid #16a34a', borderRadius: 10 }}>No hay horarios para mostrar.</div>
      </div>
    );
  }

  return (
    <div className="mt-3" style={{ ...customTableStyles }}>
      <Table bordered hover size="sm" className="mb-0" style={{ background: '#fff', borderRadius: 14, fontSize: '15px' }}>
        <thead>
          <tr>
            <th style={thStyle}>Ruta</th>
            <th style={thStyle}>Día</th>
            <th style={thStyle}>Hora inicio</th>
            <th style={thStyle}>Hora fin</th>
            <th style={thStyle}>Frecuencia</th>
            <th style={thStyle}>Notas</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb', background: '#fff', color: '#263238' }}>
              <td style={tdStyle}>
                {c.rutas ? `${c.rutas.nombre}${c.rutas.zonas ? ` - ${c.rutas.zonas.nombre}` : ''}` : `Ruta ${c.ruta_id}`}
              </td>
              <td style={tdStyle}>{diasSemanaLocal[c.dia_semana] || 'Día inválido'}</td>
              <td style={tdStyle}>
                {c.hora_inicio?.includes('T') ? c.hora_inicio.slice(11, 16) : c.hora_inicio}
              </td>
              <td style={tdStyle}>
                {c.hora_fin?.includes('T') ? c.hora_fin.slice(11, 16) : c.hora_fin}
              </td>
              <td style={tdStyle}>{c.frecuencia}</td>
              <td style={tdStyle}>{c.notas}</td>
              <td style={tdStyle}>
                <div className="d-flex flex-row gap-2 justify-content-center">
                  <Button size="sm" style={{ ...actionBtnStyle, background: '#f0fdf4', color: '#16a34a', border: '1px solid #16a34a' }} onClick={() => onEdit(c)}>
                    <FaEdit size={15} />
                  </Button>
                  <Button size="sm" style={{ ...actionBtnStyle, background: '#fff0f0', color: '#d42d2d', border: '1px solid #d42d2d' }} onClick={() => calendarioHook.handleDelete(c.id)}>
                    <FaTrashAlt size={15} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Paginación */}
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
  );
}
