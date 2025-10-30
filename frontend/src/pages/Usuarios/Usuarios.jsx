"use client"

import { useState, useEffect, useMemo } from "react"
import { Modal, Button } from "react-bootstrap"
import { FaUser } from "react-icons/fa"
import useUsuarios from "../../hooks/useUsuarios"
import useRoles from "../../hooks/useRoles"
import useZonasSelector from "../../hooks/useZonasSelector"
import styles from "./Usuarios.module.css"
import { isAuthenticated } from "../../services/api"
import LoadingOverlay from "../../components/Common/LoadingOverlay"
import Swal from "sweetalert2"
import useEditarUsuario from "../../hooks/useEditarUsuario"
import RegisterModal from "../../components/Auth/RegisterModal"
import { getCurrentUserFromToken } from "../../utils/tokenUtils"
import UsuariosFilters from "../../components/Users/UserFilter.jsx"
import UsuariosTable from "../../components/Users/UserTable.jsx"
import EditUsuarioModal from "../../components/Users/EditUserModal.jsx"

export default function Usuarios() {
  const { usuarios, cargarUsuarios, crearUsuario, editarUsuario, eliminarUsuario, error, loading } = useUsuarios()

  const { roles, cargarRoles } = useRoles()
  const { zonas, cargarZonas, loading: zonasLoading, error: zonasError } = useZonasSelector()
  const { editarUsuario: editarUsuarioAPI, loading: editandoUsuario } = useEditarUsuario()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    id: null,
    nombre_completo: "",
    nombre_usuario: "",
    rol_id: "",
    zona_id: "",
    estado: "activo",
  })
  const [editMode, setEditMode] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [detalleUsuario, setDetalleUsuario] = useState(null)

  const [filtroNombre, setFiltroNombre] = useState("")
  const [filtroRol, setFiltroRol] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const matchNombre =
        filtroNombre === "" ||
        u.nombre_completo?.toLowerCase().includes(filtroNombre.toLowerCase()) ||
        u.nombre_usuario?.toLowerCase().includes(filtroNombre.toLowerCase())

      const matchRol = filtroRol === "" || String(u.roles?.id) === filtroRol
      const matchEstado = filtroEstado === "" || u.estado?.toLowerCase() === filtroEstado.toLowerCase()

      return matchNombre && matchRol && matchEstado
    })
  }, [usuarios, filtroNombre, filtroRol, filtroEstado])

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login"
      return
    }

    const userFromToken = getCurrentUserFromToken()
    const userName = userFromToken?.nombreUsuario || localStorage.getItem("currentUser") || "Administrador"

    setCurrentUser(userName)

    cargarUsuarios()
    cargarRoles()
    cargarZonas()
  }, [])

  useEffect(() => {
    const handleRolCreated = () => {
      cargarRoles()
      Swal.fire({
        icon: "success",
        title: "Rol creado",
        text: "El rol ha sido creado exitosamente",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      })
    }

    const handleOpenRegisterModal = () => {
      setShowRegisterModal(true)
    }

    window.addEventListener("rolCreated", handleRolCreated)
    window.addEventListener("rolCreatedSuccess", handleRolCreated)
    window.addEventListener("openRegisterModal", handleOpenRegisterModal)

    return () => {
      window.removeEventListener("rolCreated", handleRolCreated)
      window.removeEventListener("rolCreatedSuccess", handleRolCreated)
      window.removeEventListener("openRegisterModal", handleOpenRegisterModal)
    }
  }, [cargarRoles])

  const handleEdit = (usuario) => {
    setShowModal(true)
    setEditMode(true)
    setForm({
      id: usuario.id,
      nombre_completo: usuario.nombre_completo || usuario.nombre,
      nombre_usuario: usuario.nombre_usuario || "",
      rol_id: usuario.rol_id,
      zona_id: usuario.zona_id,
      estado: usuario.estado || "activo",
    })
  }

  const handleCreate = () => {
    setShowModal(true)
    setEditMode(false)
    setForm({
      id: null,
      nombre_completo: "",
      nombre_usuario: "",
      rol_id: "",
      zona_id: "",
      estado: "activo",
    })
  }

  const handleSave = async () => {
    const camposVacios = []
    if (!form.nombre_completo) camposVacios.push("Nombre completo")
    if (!form.nombre_usuario) camposVacios.push("Nombre de usuario")
    if (!form.rol_id) camposVacios.push("Rol")
    if (!form.zona_id) camposVacios.push("Zona")

    if (camposVacios.length > 0 && editMode) {
      const result = await Swal.fire({
        title: "¿Campos vacíos detectados?",
        text: `Los siguientes campos están vacíos: ${camposVacios.join(", ")}. ¿Estás seguro que quieres guardar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
      })

      if (!result.isConfirmed) {
        return
      }
    }

    try {
      if (editMode) {
        await editarUsuarioAPI(form)
        await cargarUsuarios()
      } else {
        const usuarioPayload = {}
        Object.entries(form).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            usuarioPayload[key] = value
          }
        })
        await crearUsuario(usuarioPayload)
      }
      setShowModal(false)
    } catch (error) {
      console.error("Error al guardar usuario:", error)
    }
  }

  const handleDelete = async (usuario) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará el usuario "${usuario.nombre_completo}" permanentemente`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      eliminarUsuario(usuario.id)
    }
  }

  return (
    <div className={`${styles.pageBg} container-fluid`}>
      <div className={`${styles.usuariosContainer} mx-auto`}>
        <LoadingOverlay loading={loading || editandoUsuario} error={error} />
      
        <div className={styles.usuariosHeader}>
          <div className="d-flex align-items-center flex-wrap gap-3">
            <FaUser className={styles.usuariosHeaderIcon} />
            <div className="flex-grow-1">
              <h1 className={styles.panelTitle}>Panel de Administración</h1>
              <p className="mb-0 text-muted" style={{ fontSize: "var(--font-size-small)", opacity: 0.8 }}>
                Gestión de usuarios - {currentUser}
              </p>
            </div>
          </div>
        </div>

        <UsuariosFilters
          filtroNombre={filtroNombre}
          setFiltroNombre={setFiltroNombre}
          filtroRol={filtroRol}
          setFiltroRol={setFiltroRol}
          roles={roles}
          onAddUser={() => setShowRegisterModal(true)}
          onAddRole={() => window.dispatchEvent(new CustomEvent("openAddRolModal"))}
        />

        <div className={`${styles.mainLayout} w-100`}>
          <div className={styles.userTableSection}>
            <UsuariosTable
              usuarios={usuarios}
              usuariosFiltrados={usuariosFiltrados}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={setDetalleUsuario}
              roles={roles}
            />
          </div>
        </div>
      </div>

      <EditUsuarioModal
        show={showModal}
        onHide={() => setShowModal(false)}
        form={form}
        setForm={setForm}
        roles={roles}
        zonas={zonas}
        editMode={editMode}
        onSave={handleSave}
        loading={editandoUsuario}
      />

      {showRegisterModal && (
        <RegisterModal
          show={showRegisterModal}
          onHide={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false)
            cargarUsuarios()
          }}
        />
      )}

      {/* Modal de Detalle de Usuario */}
      <Modal
        show={!!detalleUsuario}
        onHide={() => setDetalleUsuario(null)}
        centered
        size="md"
        contentClassName="modern-modal"
        style={{
          '--bs-modal-bg': 'var(--color-bg-light)',
          '--bs-modal-border-color': 'rgba(27, 185, 52, 0.2)'
        }}
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="modern-modal-header"
          style={{
            background: 'linear-gradient(135deg, var(--color-bg-light), #f8fafc)',
            borderBottom: '2px solid var(--color-bin-green)',
            padding: '24px',
            borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
          }}
        >
          <Modal.Title
            style={{
              fontSize: 'var(--font-size-h3)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-dark)',
              fontFamily: 'var(--font-family-title)'
            }}
          >
            Detalle de Usuario
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modern-modal-body" style={{ padding: '32px' }}>
          {detalleUsuario ? (
            <table className={styles.detalleTable} style={{ width: '100%', margin: 0, borderCollapse: 'collapse', fontSize: 16 }}>
              <tbody>
                <tr>
                  <th style={{ background: '#f1f5f9', color: 'var(--color-text-dark)', width: 180, fontWeight: 600, borderRight: '1px solid #e2e8f0', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre completo</th>
                  <td style={{ background: 'var(--color-bg-light)', color: 'var(--color-table-text)', padding: '10px 14px' }}>{detalleUsuario.nombre_completo || detalleUsuario.nombre}</td>
                </tr>
                <tr>
                  <th style={{ background: '#f1f5f9', color: 'var(--color-text-dark)', fontWeight: 600, borderRight: '1px solid #e2e8f0', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre de usuario</th>
                  <td style={{ background: 'var(--color-bg-light)', color: 'var(--color-table-text)', padding: '10px 14px' }}>{detalleUsuario.nombre_usuario}</td>
                </tr>
                <tr>
                  <th style={{ background: '#f1f5f9', color: 'var(--color-text-dark)', fontWeight: 600, borderRight: '1px solid #e2e8f0', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rol</th>
                  <td style={{ background: 'var(--color-bg-light)', color: 'var(--color-table-text)', padding: '10px 14px' }}>{detalleUsuario.roles?.nombre || detalleUsuario.rol_id}</td>
                </tr>
                <tr>
                  <th style={{ background: '#f1f5f9', color: 'var(--color-text-dark)', fontWeight: 600, borderRight: '1px solid #e2e8f0', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Zona</th>
                  <td style={{ background: 'var(--color-bg-light)', color: 'var(--color-table-text)', padding: '10px 14px' }}>{detalleUsuario.zonas?.nombre || detalleUsuario.zona_id}</td>
                </tr>
                <tr>
                  <th style={{ background: '#f1f5f9', color: 'var(--color-text-dark)', fontWeight: 600, borderRight: '1px solid #e2e8f0', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estado</th>
                  <td style={{ background: 'var(--color-bg-light)', color: 'var(--color-table-text)', padding: '10px 14px' }}>{detalleUsuario.estado}</td>
                </tr>
                <tr>
                  <th style={{ background: '#f1f5f9', color: 'var(--color-text-dark)', fontWeight: 600, borderRight: '1px solid #e2e8f0', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</th>
                  <td style={{ background: 'var(--color-bg-light)', color: 'var(--color-table-text)', padding: '10px 14px' }}>{detalleUsuario.id}</td>
                </tr>
              </tbody>
            </table>
          ) : null}
        </Modal.Body>
        <Modal.Footer
          className="modern-modal-footer"
          style={{
            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
            borderTop: '1px solid #e2e8f0',
            padding: '20px 32px',
            gap: '12px',
            borderRadius: '0 0 var(--border-radius) var(--border-radius)',
          }}
        >
          <Button
            variant="outline-secondary"
            onClick={() => setDetalleUsuario(null)}
            className="modern-btn-secondary"
            style={{
              background: 'transparent',
              border: '2px solid var(--color-text-gray)',
              color: 'var(--color-text-gray)',
              padding: '12px 24px',
              borderRadius: 'var(--border-radius)',
              fontWeight: 'var(--font-weight-medium)',
              fontSize: 'var(--font-size-p)',
              transition: 'all var(--transition-fast) ease',
            }}
            onMouseEnter={e => {
              e.target.style.background = 'var(--color-text-gray)';
              e.target.style.color = 'var(--color-text-white)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--color-text-gray)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
