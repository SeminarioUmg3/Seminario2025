"use client"

import { Button, OverlayTrigger, Tooltip, Form, InputGroup, Row, Col } from "react-bootstrap"
import { FaSearch, FaUsers } from "react-icons/fa"
import styles from "./Usuarios.module.css"

export default function ZonasFilter({
  filtroCodigo,
  setFiltroCodigo,
  onAddZona,
}) {
  return (
    <div className={`modern-filters-container ${styles.filterContainer}`}>
      <h4 className=" fw-semibold mb-4 text-center text-success">
      Gestión de Zonas </h4>
      <Row className="g-3 align-items-end">
        <Col xs={12} md={8} lg={6}>
          <Form.Group>
            <Form.Label
              className={styles.filterLabel}
              style={{
                fontSize: "var(--font-size-small)",
                fontWeight: "var(--font-weight-bold)",
                marginBottom: "8px",
                color: "var(--color-text-dark)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FaSearch style={{ color: "var(--color-bin-green)" }} />
              Búsqueda de Zonas
            </Form.Label>
            <InputGroup>
              <InputGroup.Text
                className={styles.searchIcon}
                style={{
                  background: "linear-gradient(135deg, var(--color-bin-green), #16a34a)",
                  border: "none",
                  borderRadius: "var(--border-radius) 0 0 var(--border-radius)",
                  color: "var(--color-text-white)",
                }}
              >
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar zona por código..."
                value={filtroCodigo}
                onChange={(e) => setFiltroCodigo(e.target.value)}
                className={styles.searchInput}
                style={{
                  border: "2px solid #e2e8f0",
                  borderLeft: "none",
                  borderRadius: "0 var(--border-radius) var(--border-radius) 0",
                  padding: "10px 12px", 
                  fontSize: "0.9rem", 
                  transition: "all var(--transition-fast) ease",
                  height: "36px", 
                  minWidth: "200px", 
                  maxWidth: "300px" 
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-bin-green)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(27, 185, 52, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </InputGroup>
          </Form.Group>
        </Col>

        <Col xs={12} md={4} lg={6}>
          <div className="d-flex gap-2 justify-content-md-end">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="add-zona-tooltip">Crear nueva zona</Tooltip>}
            >
              <Button
                variant="success"
                className={`${styles.usuariosBtn} ${styles.btnAddUser}`}
                style={{
                  background: "linear-gradient(135deg, var(--color-bin-green), #16a34a)",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "var(--border-radius)",
                  fontWeight: "var(--font-weight-medium)",
                  fontSize: "var(--font-size-p)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all var(--transition-fast) ease",
                }}
                onClick={onAddZona}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(27, 185, 52, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <FaUsers />
                Nueva Zona
              </Button>
            </OverlayTrigger>
          </div>
        </Col>
      </Row>

      <style jsx>{`
        .modern-filters-container {
          background: var(--color-bg-light);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--box-shadow-card);
          border: 1px solid rgba(27, 185, 52, 0.1);
          margin-bottom: 24px;
        }

        .searchInput:focus {
          border-color: var(--color-bin-green) !important;
          box-shadow: 0 0 0 3px rgba(27, 185, 52, 0.1) !important;
        }
      `}</style>
    </div>
  )
}
