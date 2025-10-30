// Recibe calendarioHook
export default function CalendarioFilters({ calendarioHook }) {
  const {
    zona,
    setZona,
    diasUnicos = [],
    frecuencias = [],
    setFiltroDia,
    setFiltroFrecuencia,
  } = calendarioHook;

  // Estilos compactos para los selects
  const selectStyle = {
    minWidth: "70px",
    maxWidth: "110px",
    padding: "4px 7px",
    fontSize: "0.85rem",
    borderRadius: "12px",
    margin: "0 2px 4px 0"
  };

  return (
    <div className="mb-3 d-flex flex-row gap-2 flex-nowrap align-items-center">
      <select className="form-select" style={selectStyle} value={zona} onChange={e => setZona(e.target.value)}>
        <option value="">Zona</option>
        <option value="Todas">Todas</option>
        <option value="Norte">Norte</option>
        <option value="Sur">Sur</option>
        {/* Puedes agregar más zonas dinámicamente si lo deseas */}
      </select>
      <select className="form-select" style={selectStyle} onChange={e => setFiltroDia(e.target.value)}>
        <option value="">Día</option>
        {(Array.isArray(diasUnicos) ? diasUnicos : []).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select className="form-select" style={selectStyle} onChange={e => setFiltroFrecuencia(e.target.value)}>
        <option value="">Frecuencia</option>
        {(Array.isArray(frecuencias) ? frecuencias : []).map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
    </div>
  );
}
