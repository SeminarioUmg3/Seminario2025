import { ClipLoader, HashLoader, PuffLoader } from 'react-spinners';

export default function LoadingOverlay({ 
  loading = false, 
  error = false, 
  message = null,
  size = "normal" 
}) {
  if (!loading && !error) return null;

  const spinnerSize = size === "large" ? 60 : 40;

  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(255,255,255,0.6)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 20
    }}>
      {/* Mensaje con globo de pensamiento */}
      <div style={{
        background: "white",
        padding: "15px 20px",
        borderRadius: 20,
        border: `2px solid ${error ? "#dc3545" : "#007bff"}`,
        position: "relative",
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        maxWidth: "300px",
        textAlign: "center"
      }}>
        {/* Triángulo apuntando hacia abajo */}
        <div style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: `12px solid ${error ? "#dc3545" : "#007bff"}`
        }}></div>
        {/* Triángulo interno para crear el borde */}
        <div style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(-2px)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "10px solid white"
        }}></div>
        <h4 style={{ 
          margin: 0, 
          color: error ? "#dc3545" : "#007bff", 
          fontWeight: "600",
          fontSize: "16px"
        }}>
          {error ? "Error" : "Cargando..."}
        </h4>
      </div>
      
      {/* Spinner profesional */}
      <ClipLoader
        color={error ? "#dc3545" : "#007bff"}
        loading={true}
        size={spinnerSize}
        speedMultiplier={0.8}
      />
      
      {message && (
        <div style={{
          background: "white",
          padding: "10px 15px",
          borderRadius: 15,
          border: `2px solid ${error ? "#dc3545" : "#007bff"}`,
          position: "relative",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <span style={{ color: error ? "#dc3545" : "#007bff", fontWeight: "500" }}>
            {message}
          </span>
        </div>
      )}
    </div>
  );
}




















