"use client"

import { Modal, Button, Form, Row, Col } from "react-bootstrap"
import { FaUserPlus, FaUserEdit, FaTimes, FaSave } from "react-icons/fa"
import styles from "../../styles/variables.module.css"

export default function EditUsuarioModal({ show, onHide, form, setForm, roles, zonas, editMode, onSave, loading }) {
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const getModalTitle = () => {
    return editMode ? (
      <div className="d-flex align-items-center">
        <FaUserEdit className="me-2" style={{ color: "var(--color-bin-blue)" }} />
        Editar Usuario
      </div>
    ) : (
      <div className="d-flex align-items-center">
        <FaUserPlus className="me-2" style={{ color: "var(--color-bin-green)" }} />
        Crear Usuario
      </div>
    )
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      contentClassName="modern-modal"
      style={{
        "--bs-modal-bg": "var(--color-bg-light)",
        "--bs-modal-border-color": "rgba(27, 185, 52, 0.2)",
      }}
    >
      <Modal.Header
        closeButton
        closeVariant="white"
        className="modern-modal-header"
        style={{
          background: "linear-gradient(135deg, var(--color-bg-light), #f8fafc)",
          borderBottom: "2px solid var(--color-bin-green)",
          padding: "24px",
          borderRadius: "var(--border-radius) var(--border-radius) 0 0",
        }}
      >
        <Modal.Title
          style={{
            fontSize: "var(--font-size-h3)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--color-text-dark)",
            fontFamily: "var(--font-family-title)"
          }}
        >
          {getModalTitle()}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modern-modal-body" style={{ padding: "32px" }}>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label
                  style={{
                    fontSize: "var(--font-size-small)",
                    fontWeight: "var(--font-weight-bold)",
                    marginBottom: "8px",
                    color: "var(--color-text-dark)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Nombre Completo *
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el nombre completo"
                  value={form.nombre_completo}
                  onChange={(e) => handleChange("nombre_completo", e.target.value)}
                  className="modern-input"
                  style={{
                    border: "2px solid #e2e8f0",
                    borderRadius: "var(--border-radius)",
                    padding: "12px 16px",
                    fontSize: "var(--font-size-p)",
                    transition: "all var(--transition-fast) ease",
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
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label
                  style={{
                    fontSize: "var(--font-size-small)",
                    fontWeight: "var(--font-weight-bold)",
                    marginBottom: "8px",
                    color: "var(--color-text-dark)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Nombre de Usuario *
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el nombre de usuario"
                  value={form.nombre_usuario}
                  onChange={(e) => handleChange("nombre_usuario", e.target.value)}
                  className="modern-input"
                  style={{
                    border: "2px solid #e2e8f0",
                    borderRadius: "var(--border-radius)",
                    padding: "12px 16px",
                    fontSize: "var(--font-size-p)",
                    transition: "all var(--transition-fast) ease",
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
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label
                  style={{
                    fontSize: "var(--font-size-small)",
                    fontWeight: "var(--font-weight-bold)",
                    marginBottom: "8px",
                    color: "var(--color-text-dark)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Rol *
                </Form.Label>
                <Form.Select
                  value={form.rol_id}
                  onChange={(e) => handleChange("rol_id", e.target.value)}
                  className="modern-select"
                  style={{
                    border: "2px solid #e2e8f0",
                    borderRadius: "var(--border-radius)",
                    padding: "12px 16px",
                    fontSize: "var(--font-size-p)",
                    backgroundColor: "var(--color-bg-light)",
                    transition: "all var(--transition-fast) ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-bin-green)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(27, 185, 52, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label
                  style={{
                    fontSize: "var(--font-size-small)",
                    fontWeight: "var(--font-weight-bold)",
                    marginBottom: "8px",
                    color: "var(--color-text-dark)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Zona *
                </Form.Label>
                <Form.Select
                  value={form.zona_id}
                  onChange={(e) => handleChange("zona_id", e.target.value)}
                  className="modern-select"
                  style={{
                    border: "2px solid #e2e8f0",
                    borderRadius: "var(--border-radius)",
                    padding: "12px 16px",
                    fontSize: "var(--font-size-p)",
                    backgroundColor: "var(--color-bg-light)",
                    transition: "all var(--transition-fast) ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-bin-green)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(27, 185, 52, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">Seleccione una zona</option>
                  {zonas.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label
              style={{
                fontSize: "var(--font-size-small)",
                fontWeight: "var(--font-weight-bold)",
                marginBottom: "8px",
                color: "var(--color-text-dark)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Estado
            </Form.Label>
            <Form.Select
              value={form.estado}
              onChange={(e) => handleChange("estado", e.target.value)}
              className="modern-select"
              style={{
                border: "2px solid #e2e8f0",
                borderRadius: "var(--border-radius)",
                padding: "12px 16px",
                fontSize: "var(--font-size-p)",
                backgroundColor: "var(--color-bg-light)",
                transition: "all var(--transition-fast) ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-bin-green)";
                e.target.style.boxShadow = "0 0 0 3px rgba(27, 185, 52, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer
        className="modern-modal-footer"
        style={{
          background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
          borderTop: "1px solid #e2e8f0",
          padding: "20px 32px",
          gap: "12px",
          borderRadius: "0 0 var(--border-radius) var(--border-radius)",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={onHide}
          disabled={loading}
          className="modern-btn-secondary"
          style={{
            background: "transparent",
            border: "2px solid var(--color-text-gray)",
            color: "var(--color-text-gray)",
            padding: "12px 24px",
            borderRadius: "var(--border-radius)",
            fontWeight: "var(--font-weight-medium)",
            fontSize: "var(--font-size-p)",
            transition: "all var(--transition-fast) ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "var(--color-text-gray)";
            e.target.style.color = "var(--color-text-white)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "var(--color-text-gray)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <FaTimes className="me-2" />
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={onSave}
          disabled={loading}
          className="modern-btn-primary"
          style={{
            background: "linear-gradient(135deg, var(--color-bin-green), #16a34a)",
            border: "none",
            padding: "12px 24px",
            borderRadius: "var(--border-radius)",
            fontWeight: "var(--font-weight-medium)",
            fontSize: "var(--font-size-p)",
            color: "var(--color-text-white)",
            transition: "all var(--transition-fast) ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(27, 185, 52, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          <FaSave className="me-2" />
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>

      <style jsx>{`
        .modern-modal .modal-content {
          border-radius: var(--border-radius);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(27, 185, 52, 0.2);
          overflow: hidden;
        }

        .modern-modal-header .btn-close {
          filter: invert(0.5);
        }

        .modern-input:focus,
        .modern-select:focus {
          border-color: var(--color-bin-green) !important;
          box-shadow: 0 0 0 3px rgba(27, 185, 52, 0.1) !important;
        }
      `}</style>
    </Modal>
  )
}
