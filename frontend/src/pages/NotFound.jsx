import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          padding: "40px 32px",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", color: "#222", marginBottom: "0.5em" }}>
          404
        </h1>
        <h3 style={{ fontSize: "1.3rem", color: "#222", marginBottom: "0.5em" }}>
          Look like you're lost
        </h3>
        <p style={{ color: "#555", marginBottom: "1.5em" }}>
          The page you are looking for is not available!
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 24px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(34,197,94,0.12)",
            transition: "background 0.2s",
          }}
        >
          Go to Home
        </button>
      </div>
    </section>
  );
}
