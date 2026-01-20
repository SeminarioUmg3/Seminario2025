// Página de login para la plataforma web de reciclaje inteligente
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/Auth/LoginForm";
import styles from "./Login.module.css";
import LoadingOverlay from "../../components/Common/LoadingOverlay";

export default function Login() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Logout automático al acceder a la página de login
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  // Redirigir al dashboard cuando el login es exitoso
  useEffect(() => {
    if (success) {
      navigate("/dashboard");
    }
  }, [success, navigate]);

  const handleLogin = (user) => {
    // console.log('Login result:', user); // Depuración
    setLoading(true);
    setSuccess(true);
    // Guardar token si existe
    if (user.accessToken) {
      localStorage.setItem("token", user.accessToken);
    }
  };

  const handleError = () => {
    setLoading(false);
    setSuccess(false);
  };

  return (
    <div className={styles.loginPage} style={{ position: "relative" }}>
      <LoadingOverlay 
        loading={loading} 
        loadingText="Accediendo al sistema..." 
        errorText="Error de autenticación" 
        size="large" 
      />
      <div className={styles.loginBg}> {/* Fondo de los botes */}
        <img
          src="/logoMuni.png"
          alt="Logo Municipalidad"
          className={styles.loginLogoMuni}
        />
        <img
          src="/LogoUMG.png"
          alt="Logo UMG"
          className={styles.loginLogoUMG}
        />
      </div>
      <div className={styles.loginContainer}> {/* Card del login */}
        {success && (
          <div className={styles.loginSuccess}>¡Inicio de sesión exitoso!</div>
        )}
        <LoginForm onLogin={handleLogin} onError={handleError} />
      </div>
    </div>
  );
}