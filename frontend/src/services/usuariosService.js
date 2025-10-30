// Servicio de ejemplo para usuarios y roles
const usuariosService = {
  getAll: async () => {
    // Aquí iría la llamada real a la API
    return [
      {
        id: 1,
        nombre: "admin",
        rol_id: 1,
        zona_id: 1,
        fecha_registro: "2025-09-01",
      },
      {
        id: 2,
        nombre: "operador",
        rol_id: 2,
        zona_id: 2,
        fecha_registro: "2025-09-02",
      },
    ];
  },
  create: async (data) => {
    // POST a la API
    return true;
  },
  update: async (data) => {
    // PUT a la API
    return true;
  },
  remove: async (id) => {
    // DELETE a la API
    return true;
  },
  getRoles: async () => {
    return [
      { id: 1, nombre: "Administrador" },
      { id: 2, nombre: "Operador" },
    ];
  },
  createRol: async (data) => {
    return true;
  },
  updateRol: async (data) => {
    return true;
  },
  removeRol: async (id) => {
    return true;
  },
};
export default usuariosService;
