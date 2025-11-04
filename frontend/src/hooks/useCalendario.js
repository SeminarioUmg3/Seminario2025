import { useState, useCallback } from 'react';
import axios from 'axios';

// Leer la URL base desde variables de entorno (Vite): VITE_API_URL
const BASE_URL = import.meta?.env?.VITE_API_URL || 'https://reciclajeseminario.onrender.com';

// Cliente para Admin (con token dinámico)
const apiAdmin = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token dinámicamente en cada request
apiAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Cliente público (sin token)
const apiPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function useCalendario() {
  const [calendario, setCalendario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rutas, setRutas] = useState([]); // Agregar estado para rutas
  const [form, setForm] = useState({
    ruta_id: "",
    dia_semana: "",
    hora_inicio: "",
    hora_fin: "",
    frecuencia: "",
    notas: "",
    id: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [zona, setZona] = useState("");
  const [diasUnicos, setDiasUnicos] = useState([]);
  const [frecuencias, setFrecuencias] = useState([]);
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroFrecuencia, setFiltroFrecuencia] = useState("");

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  // Obtener rutas disponibles
  const obtenerRutas = useCallback(async () => {
    try {
      // Asumiendo que existe un endpoint para obtener rutas
      const response = await apiPublic.get('/api/rutas/obtenerRutas');
      //Validar si la respuesta tiene la estructura esperada
    const zonas = Array.isArray(response.data?.rutas) ? response.data.rutas : [];

    // Si no hay rutas, simplemente limpiamos el estado
    if (zonas.length === 0) {
      setRutas([]);
      console.log("⚠️ No se encontraron rutas en la API.");
      return [];
    }

    // Aplanar la estructura: zona → rutas[]
    const rutasPlanas = zonas.flatMap(zona =>
      (zona.rutas || []).map(r => ({
        id: r.id,
        nombre: r.nombre,
        zona_id: zona.id,
        zona_nombre: zona.nombre,
      }))
    );

    // Si no hay rutas dentro de las zonas, también manejarlo
    if (rutasPlanas.length === 0) {
      console.log("Zonas encontradas, pero sin rutas registradas.");
    } else {
      console.log("Rutas cargadas:", rutasPlanas);
    }

    setRutas(rutasPlanas);
    return rutasPlanas;

    } catch (err) {
      console.error('Error obteniendo rutas:', err);
      // Si no hay endpoint específico, extraer rutas del calendario
      if (calendario.length > 0) {
        const rutasUnicas = calendario
          .filter(item => item.rutas)
          .map(item => ({
            id: item.ruta_id,
            nombre: item.rutas.nombre,
            descripcion: item.rutas.descripcion,
            zona: item.rutas.zonas?.nombre
          }))
          .filter((ruta, index, self) => 
            index === self.findIndex(r => r.id === ruta.id)
          );
        setRutas(rutasUnicas);
      }
      return { data: rutas };
    }
  }, []);

  // Carga todos los datos y extrae filtros únicos
  const refreshCalendario = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await obtenerCalendarioCompleto();
      const data = Array.isArray(res?.data) ? res.data : [];
      setCalendario(data);

      // Extrae días y frecuencias únicos
      setDiasUnicos(Array.from(new Set(data.map(c => diasSemana[c.dia_semana])).values()));
      setFrecuencias(Array.from(new Set(data.map(c => c.frecuencia)).values()));
      
      // Obtener rutas después de cargar calendario
      await obtenerRutas();
      
      setLoading(false);
    } catch (err) {
      setError("Error al obtener calendario completo");
      setCalendario([]);
      setLoading(false);
    }
  };

  // Obtener calendario completo (público)
  const obtenerCalendarioCompleto = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiPublic.get('/api/calendario/obtenerCalendario');
      setCalendario(response.data.data || []);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener el calendario';
      setError(errorMessage);
      console.error('Error obteniendo calendario:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCalendarioHook = async (zona, fecha) => {
    setLoading(true);
    setError("");
    try {
      const res = await getCalendario(zona, fecha);
      setLoading(false);
      return res;
    } catch (err) {
      setError("Error al obtener calendario");
      setLoading(false);
      return [];
    }
  };

  const crearHorario = useCallback(async (horarioData) => {
    setLoading(true);
    setError(null);
    try {
      // Validar datos requeridos
      if (!horarioData.ruta_id || (!horarioData.dia_semana && horarioData.dia_semana !== 0) || !horarioData.hora_inicio || !horarioData.hora_fin) {
        throw new Error('Todos los campos obligatorios deben ser completados');
      }

      // Validar formato de hora
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(horarioData.hora_inicio) || !timeRegex.test(horarioData.hora_fin)) {
        throw new Error('Las horas deben estar en formato HH:mm');
      }

      // Validar día de la semana
      if (horarioData.dia_semana < 0 || horarioData.dia_semana > 6) {
        throw new Error('El día de la semana debe estar entre 0 (Domingo) y 6 (Sábado)');
      }

      // Validar que no exista cruce de horario en la misma ruta y día
      const cruza = calendario.some(h =>
        h.ruta_id === parseInt(horarioData.ruta_id) &&
        h.dia_semana === parseInt(horarioData.dia_semana) &&
        (
          // Cruce de horas: inicio o fin dentro del rango existente
          (horarioData.hora_inicio >= h.hora_inicio && horarioData.hora_inicio < h.hora_fin) ||
          (horarioData.hora_fin > h.hora_inicio && horarioData.hora_fin <= h.hora_fin) ||
          // O el horario existente está dentro del nuevo
          (horarioData.hora_inicio <= h.hora_inicio && horarioData.hora_fin >= h.hora_fin)
        )
      );
      if (cruza) {
        throw new Error('Ya existe un horario para esa ruta y día que cruza con el rango ingresado.');
      }

      const response = await apiAdmin.post('/api/calendario/insert', horarioData);
      // Refrescar la lista después de crear
      await obtenerCalendarioCompleto();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 
                          err.response?.data?.message || 
                          err.message || 
                          'Error al crear el horario';
      setError(errorMessage);
      console.error('Error creando horario:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [obtenerCalendarioCompleto, calendario]);

  const getCalendarioCompleto = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await obtenerCalendarioCompleto();
      setLoading(false);
      return res;
    } catch (err) {
      setError("Error al obtener calendario completo");
      setLoading(false);
      return [];
    }
  };

  const actualizarHorario = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Hook actualizarHorario - Datos recibidos:', { id, updateData });
      
      // Validar datos requeridos
      if (!updateData.ruta_id || (!updateData.dia_semana && updateData.dia_semana !== 0) || !updateData.hora_inicio || !updateData.hora_fin) {
        throw new Error('Todos los campos obligatorios deben ser completados');
      }

      // Validar formato de hora
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(updateData.hora_inicio) || !timeRegex.test(updateData.hora_fin)) {
        throw new Error('Las horas deben estar en formato HH:mm');
      }

      // Validar día de la semana
      if (updateData.dia_semana < 0 || updateData.dia_semana > 6) {
        throw new Error('El día de la semana debe estar entre 0 (Domingo) y 6 (Sábado)');
      }

      // Validar que no exista cruce de horario en la misma ruta y día (excluyendo el horario actual)
      const cruza = calendario.some(h =>
        h.id !== parseInt(id) && // Excluir el horario que se está editando
        h.ruta_id === parseInt(updateData.ruta_id) &&
        h.dia_semana === parseInt(updateData.dia_semana) &&
        (
          // Cruce de horas: inicio o fin dentro del rango existente
          (updateData.hora_inicio >= h.hora_inicio && updateData.hora_inicio < h.hora_fin) ||
          (updateData.hora_fin > h.hora_inicio && updateData.hora_fin <= h.hora_fin) ||
          // O el horario existente está dentro del nuevo
          (updateData.hora_inicio <= h.hora_inicio && updateData.hora_fin >= h.hora_fin)
        )
      );
      if (cruza) {
        throw new Error('Ya existe un horario para esa ruta y día que cruza con el rango ingresado.');
      }

      console.log('Hook actualizarHorario - Enviando al backend:', updateData);
      const response = await apiAdmin.put(`/api/calendario/update/${id}`, updateData);
      console.log('Hook actualizarHorario - Respuesta del backend:', response.data);
      
      // Refrescar la lista después de actualizar
      await obtenerCalendarioCompleto();
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 
                          err.response?.data?.message || 
                          err.message || 
                          'Error al actualizar el horario';
      setError(errorMessage);
      console.error('Error actualizando horario:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [obtenerCalendarioCompleto, calendario]);

  const eliminarHorario = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiAdmin.delete(`/api/calendario/delete/${id}`);
      
      // Refrescar la lista después de eliminar
      await obtenerCalendarioCompleto();
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el horario';
      setError(errorMessage);
      console.error('Error eliminando horario:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [obtenerCalendarioCompleto]);

  // Editar y eliminar desde la tabla
  const handleEdit = (horario) => {
    setForm({
      ruta_id: horario.ruta_id,
      dia_semana: horario.dia_semana,
      hora_inicio: typeof horario.hora_inicio === "string"
        ? horario.hora_inicio.slice(0, 5)
        : horario.hora_inicio, // Asegura formato HH:mm
      hora_fin: typeof horario.hora_fin === "string"
        ? horario.hora_fin.slice(0, 5)
        : horario.hora_fin,
      frecuencia: horario.frecuencia,
      notas: horario.notas,
      id: horario.id,
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    await eliminarHorario(id);
    await refreshCalendario();
  };

  // Filtrado local
  const getFiltrado = () => {
    let filtrados = calendario;
    if (zona) {
      filtrados = filtrados.filter(c =>
        zona === "Todas" || (c.rutas?.zonas?.nombre?.toLowerCase() === zona.toLowerCase())
      );
    }
    if (filtroDia) {
      const idx = diasSemana.indexOf(filtroDia);
      filtrados = filtrados.filter(c => c.dia_semana === idx);
    }
    if (filtroFrecuencia) {
      filtrados = filtrados.filter(c => c.frecuencia === filtroFrecuencia);
    }
    return filtrados;
  };

  // Utilidades para manejo de días
  const getDiaSemanaNombre = useCallback((diaSemana) => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[diaSemana] || 'Día inválido';
  }, []);

  const getDiaSemanaFromFecha = useCallback((fecha) => {
    return new Date(fecha).getDay();
  }, []);

  return {
    calendario: getFiltrado(),
    rutas, // Agregar rutas al return
    form,
    setForm,
    editMode,
    setEditMode,
    handleEdit,
    handleDelete,
    crearHorario,
    actualizarHorario,
    eliminarHorario,
    refreshCalendario,
    obtenerRutas, // Agregar función al return
    loading,
    error,
    zona,
    setZona,
    diasUnicos,
    frecuencias,
    filtroDia,
    setFiltroDia,
    filtroFrecuencia,
    setFiltroFrecuencia,
    diasSemana,
    // Utilidades
    getDiaSemanaNombre,
    getDiaSemanaFromFecha
  };
}