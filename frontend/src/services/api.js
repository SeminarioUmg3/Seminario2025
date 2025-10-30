export const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const opts = { ...options, headers };
  const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;
  console.log("fetchApi URL:", fullUrl, "options:", opts); // <-- Depuración
  const res = await fetch(fullUrl, opts);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }
  return res.json();
};

export const getCalendario = async (zona, fecha) => {
  return fetchApi(`/api/calendario?zona=${encodeURIComponent(zona)}&fecha=${encodeURIComponent(fecha)}`);
};

export const crearHorarioCalendario = async (data) => {
  return fetchApi("/api/calendario/insert", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const actualizarHorarioCalendario = async (id, data) => {
  return fetchApi(`/api/calendario/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const eliminarHorarioCalendario = async (id) => {
  return fetchApi(`/api/calendario/delete/${id}`, {
    method: "DELETE",
  });
};

export const obtenerCalendarioCompleto = async () => {
  return fetchApi("/api/calendario/obtenerCalendario");
};

export const obtenerZonas = async () => {
  return fetchApi("/api/zonas/obtenerZonas");
};

export const crearZona = async (data) => {
  return fetchApi("/api/zonas/crearZona", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const actualizarZona = async (data) => {
  return fetchApi("/api/zonas/actualizarZona", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const eliminarZona = async (id) => {
  return fetchApi("/api/zonas/eliminarZona", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
};

export const obtenerRutas = async () => {
  return fetchApi("/api/rutas/obtenerRutas");
};

export const crearRuta = async (data) => {
  return fetchApi("/api/rutas/crearRuta", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const actualizarRuta = async (data) => {
  return fetchApi("/api/rutas/actualizarRuta", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const eliminarRuta = async (id) => {
  return fetchApi("/api/rutas/eliminarRuta", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
};

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token;
}

// El header Authorization: Bearer <token> se incluye correctamente.
// Los endpoints de zonas cumplen con lo que pide el backend.