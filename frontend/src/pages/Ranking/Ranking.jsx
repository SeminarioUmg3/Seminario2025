import { useState, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaMedal } from "react-icons/fa";
import useRanking from "../../hooks/useRanking";
import LoadingOverlay from "../../components/Common/LoadingOverlay";

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32", "#d42d2dff", "#d42d2dff"];

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
      backgroundColor: "#d1fae5", 
      },
  "&:disabled": {
  color: "#9ca3af",
  },
  },
  },
  };
  

export default function Ranking() {
const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mes");
const [fechaInicio, setFechaInicio] = useState("");
const [fechaFin, setFechaFin] = useState("");
const { ranking, loading, error, cargarRanking, getFechasPorPeriodo } = useRanking();
const [filterText, setFilterText] = useState("");

// Función para sincronizar fechas con período seleccionado
const sincronizarFechasConPeriodo = (periodo) => {
  if (periodo !== "personalizado") {
    const fechas = getFechasPorPeriodo(periodo);
    setFechaInicio(fechas.inicio);
    setFechaFin(fechas.fin);
  }
};

// Función para aplicar filtro
const aplicarFiltro = () => {
  cargarRanking(fechaInicio, fechaFin);
};

// Cargar datos del mes actual al inicio
useEffect(() => {
  const fechas = getFechasPorPeriodo("mes");
  setFechaInicio(fechas.inicio);
  setFechaFin(fechas.fin);
  cargarRanking(fechas.inicio, fechas.fin);
}, []);

// Filtrado en memoria
const filteredData = useMemo(() => {
if (!ranking?.data) return [];
return ranking.data.filter((zona) =>
zona.zona?.toLowerCase().includes(filterText.toLowerCase())
);
}, [ranking, filterText]);

const columns = [
{
name: "#",
selector: (row, index) => index + 1,
sortable: true,
width: "80px",
cell: (row, index) => (
<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
<FaMedal color={medalColors[index] || "#ffffff"} />
{index + 1} </div>
),
},
{
name: "Zona",
selector: (row) => row.zona,
sortable: true,
grow: 2,
},
{
name: "Puntos",
selector: (row) => row.total_puntos,
width: "100px",
sortable: true,
center: true,

},
];

// Exportar a Excel
const exportToExcel = () => {
const dataToExport = filteredData.map((zona, index) => ({
"#": index + 1,
"Zona": zona.zona,
"Puntos": zona.total_puntos ?? "-",
}));


const worksheet = XLSX.utils.json_to_sheet(dataToExport);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Ranking");

const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
const data = new Blob([excelBuffer], { type: "application/octet-stream" });
saveAs(data, "ranking_zonas.xlsx");


};

return ( <div className="container py-4 relative"> <LoadingOverlay loading={loading} error={error} />
 <h2 className="h2 fw-semibold mb-4 text-center text-success">
🏅 Ranking por Zona </h2>


  {/* Filtros y búsqueda */}
  <div className="mb-4">
    <div className="row g-3 align-items-end">
      {/* Búsqueda */}
      <div className="col-md-3">
        <label className="form-label fw-semibold"
        style={{ fontSize: '14px'}}>Buscar Zona:</label>
        <input
          type="text"
          placeholder="Buscar zona..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="form-control"
          style={{ fontSize: '14px'}}
        />
      </div>
      
      {/* Fecha Inicio */}
      <div className="col-md-2">
        <label htmlFor="fechaInicio" className="form-label fw-semibold"
        style={{ fontSize: '14px'}}>Fecha Inicio:</label>
        <input
          type="date"
          id="fechaInicio"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="form-control"
          style={{ fontSize: '14px'}}
        />
      </div>
      
      {/* Fecha Fin */}
      <div className="col-md-2">
        <label htmlFor="fechaFin" className="form-label fw-semibold"
        style={{ fontSize: '14px'}}> Fecha Fin:</label>
        <input
          type="date"
          id="fechaFin"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="form-control"
          style={{ fontSize: '14px'}}
        />
      </div>
      
      {/* Período Predefinido */}
      <div className="col-md-2">
        <label className="form-label fw-semibold"
        style={{ fontSize: '14px'}}>Período:</label>
        <select
          value={periodoSeleccionado}
          onChange={(e) => {
            setPeriodoSeleccionado(e.target.value);
            sincronizarFechasConPeriodo(e.target.value);
          }}
          className="form-select"
        >
          <option value="hoy">Hoy</option>
          <option value="ayer">Ayer</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mes</option>
          <option value="personalizado">Personalizado</option>
        </select>
      </div>
      
      {/* Botón Filtrar */}
      <div className="col-md-1">
        <button
          onClick={aplicarFiltro}
          className="btn btn-success w-100 btn-lg"
          style={{ backgroundColor: '#2ecc71', borderColor: '#27ae60', fontSize: '14px'}}
        >
          Filtrar
        </button>
      </div>
      
      {/* Botón Exportar */}
      <div className="col-md-2">
        <button
          onClick={exportToExcel}
          className="btn btn-lg text-white w-100"
          style={{ backgroundColor: '#2ecc71', borderColor: '#27ae60', fontSize: '14px'}}
        >
          Exportar Excel
        </button>
      </div>
    </div>
  </div>

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
</div>


);
}
