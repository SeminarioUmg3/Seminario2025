import CalendarWidget from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect } from "react";

// Recibe calendarioHook
export default function CalendarioMap({ calendarioHook }) {
  const { calendario, setFiltroDia, diasSemana } = calendarioHook;

  // Selecciona el día al hacer clic en el calendario
  const handleCalendarChange = (date) => {
    const dia = diasSemana[date.getDay()];
    setFiltroDia(dia);
  };

  // Recordatorio simple: muestra alert si hay horarios en el día seleccionado
  useEffect(() => {
    if (calendario.length > 0) {
      // Puedes mejorar esto con notificaciones nativas si lo deseas
      // Aquí solo es un ejemplo visual
      // alert("Tienes horarios de recolección para este día.");
    }
  }, [calendario]);

  return (
    <div style={{ height: 350, width: "100%", background: "#e6f4ea", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 16 }}>
      <CalendarWidget
        onChange={handleCalendarChange}
        locale="es-ES"
        className="mb-3"
      />
      <div style={{ marginTop: 12, color: "#213547", fontSize: "1rem", textAlign: "center" }}>
        {calendario.length > 0
          ? `Hay ${calendario.length} horarios para el día seleccionado.`
          : "No hay horarios para este día."}
      </div>
    </div>
  );
}
