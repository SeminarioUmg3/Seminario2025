"use client"

import DataTable from "react-data-table-component";
import { Badge } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaInfoCircle, FaUser } from "react-icons/fa";
import styles from "./Usuarios.module.css";
import { Button } from "react-bootstrap";

export default function UsuariosTable({
  usuarios,
  usuariosFiltrados,
  onEdit,
  onDelete,
  onViewDetails,
  roles = []
}) {
  // Usar usuariosFiltrados si están disponibles, sino usar usuarios
  const dataToUse = usuariosFiltrados || usuarios;

  // Si no hay datos, mostrar vacío
  const filteredData = dataToUse || [];
  const getStatusBadge = (estado) => {
    const status = estado || "Desconocido";
    console.log("status", status);
    return (
      <Badge
        className={`${styles.statusBadge} ${status === "ACTIVO" ? styles.statusActive : styles.statusInactive}`}
        style={{
          fontSize: "11px",
          fontWeight: "var(--font-weight-medium)",
          padding: "6px 12px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          borderRadius: "20px",
        }}
      >
        {status === "ACTIVO" ? "● ACTIVO" : "● INACTIVO"}
      </Badge>
    );
  };

  const getActionButton = (icon, tooltip, onClick, className = "", variant = "outline-primary") => (
    <Button
      size="sm"
      variant={variant}
      className={`${styles.usuariosBtn} ${className}`}
      onClick={onClick}
      style={{
        padding: "6px 10px",
        borderRadius: "var(--border-radius)",
        fontSize: "12px",
        transition: "all var(--transition-fast) ease",
        border: "1px solid transparent",
        margin: "0 2px",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.05)";
        e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.boxShadow = "none";
      }}
      title={tooltip}
    >
      {icon}
    </Button>
  );

  const customStyles = {
    header: {
      style: {
        backgroundColor: "#dcfce7",
        color: "#166534",
        fontWeight: "bold",
        fontSize: "14px",
        padding: "16px",
        borderBottom: "2px solid #16a34a",
        borderRadius: "var(--border-radius) var(--border-radius) 0 0",
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#dcfce7",
        borderBottomColor: "#16a34a",
        borderBottomStyle: "solid",
        borderBottomWidth: "2px",
        minHeight: "48px",
      },
    },
    headCells: {
      style: {
        color: "#166534",
        fontWeight: "bold",
        textAlign: "left",
        fontSize: "13px",
        borderRight: "1px solid #bbf7d0",
        padding: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #f1f5f9",
        padding: "12px",
        backgroundColor: "#ffffff",
      },
    },
    rows: {
      style: {
        backgroundColor: "#ffffff",
        color: "#000000",
        minHeight: "56px",
        borderBottomColor: "#f1f5f9",
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
        transition: "all var(--transition-fast) ease",
      },
      highlightOnHoverStyle: {
        backgroundColor: "rgba(27, 185, 52, 0.05)",
        transition: "0.2s ease-in-out",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#ffffff",
        color: "#000000",
        fontWeight: "normal",
        borderTop: "1px solid #f1f5f9",
        padding: "16px",
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
          backgroundColor: "#dcfce7",
        },
        "&:disabled": {
          color: "#9ca3af",
        },
      },
    },
    table: {
      style: {
        borderRadius: "var(--border-radius)",
        overflow: "hidden",
        boxShadow: "var(--box-shadow-card)",
      },
    },
    tableWrapper: {
      style: {
        borderRadius: "var(--border-radius)",
        overflow: "hidden",
      },
    },
  };

  const columns = [
    {
      name: "Usuario",
      selector: (row) => row.nombre_completo,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div className="d-flex align-items-center" style={{ padding: "8px 0" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-bin-green), #16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              color: "var(--color-text-white)",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {row.nombre_completo?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-p)", color: "var(--color-text-dark)" }}>
              {row.nombre_completo}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Nombre de Usuario",
      selector: (row) => row.nombre_usuario,
      sortable: true,
      grow: 1,
      cell: (row) => (
        <div style={{ color: "var(--color-text-dark)", fontSize: "var(--font-size-small)" }}>
          @{row.nombre_usuario}
        </div>
      ),
    },
    {
      name: "Rol",
      selector: (row) => row.roles?.nombre,
      sortable: true,
      grow: 1,
      cell: (row) => (
        <div style={{ color: "var(--color-text-dark)", fontSize: "var(--font-size-small)" }}>
          {row.roles?.nombre}
        </div>
      ),
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      width: "120px",
      center: true,
      cell: (row) => getStatusBadge(row.estado),
    },
    {
      name: "Acciones",
      width: "180px",
      center: true,
      cell: (row) => (
        <div className="d-flex gap-1 justify-content-center">
          {getActionButton(
            <FaInfoCircle />,
            "Ver detalles",
            () => onViewDetails(row),
            styles.btnView,
            "outline-info"
          )}
          {getActionButton(
            <FaEdit />,
            "Editar usuario",
            () => onEdit(row),
            styles.btnEdit,
            "outline-primary"
          )}
          {getActionButton(
            <FaTrashAlt />,
            "Eliminar usuario",
            () => onDelete(row),
            styles.btnDelete,
            "outline-danger"
          )}
        </div>
      ),
    },
  ];

  const EmptyState = () => (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ padding: "60px 20px" }}>
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(27, 185, 52, 0.1), rgba(20, 100, 255, 0.1))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          fontSize: "32px",
          color: "var(--color-text-gray)"
        }}
      >
        <FaUser />
      </div>
      <h4 style={{ color: "var(--color-text-gray)", marginBottom: "8px", fontSize: "var(--font-size-h3)" }}>
        No se encontraron usuarios
      </h4>
      <p style={{ color: "var(--color-text-gray)", fontSize: "var(--font-size-small)", textAlign: "center" }}>
        Intenta ajustar los filtros de búsqueda o crea un nuevo usuario.
      </p>
    </div>
  );

  return (
    <div className={styles.tableContainer}>
      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={customStyles}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
        paginationComponentOptions={{
          rowsPerPageText: 'Usuarios por página:',
          rangeSeparatorText: 'de',
          selectAllRowsItem: true,
          selectAllRowsItemText: 'Todos',
        }}
        highlightOnHover
        pointerOnHover
        noHeader
        noDataComponent={<EmptyState />}
        defaultSortFieldId={1}
        defaultSortAsc={true}
      />
    </div>
  );
}
