import { useState, useEffect } from "react";
import { useLogin } from "../../hooks/useLogin";
import { validateEmail, validateStrongPassword } from "../../utils/validation";
import styles from './LoginForm.module.css';

import RecoverPasswordModal from "./RecoverPasswordModal";
import RegisterModal from "./RegisterModal";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecover, setShowRecover] = useState(false);
  const { login, loading, error } = useLogin();
  const [localError, setLocalError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!validateEmail(email)) {
      setLocalError("Por favor ingresa un correo electrónico válido que termine en .com");
      return;
    }
    if (!password) {
      setLocalError("Por favor ingresa tu contraseña.");
      return;
    }
    if (!validateStrongPassword(password)) {
      setLocalError("La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo.");
      return;
    }
    try {
      const result = await login({ nombreUsuario: email, contrasenia: password });
    //   console.log("Login result:", result);
      if (!result.success) {
        setLocalError("Correo o contraseña incorrectos.");
        return;
      }
      
      // Ya no guardamos aquí - se maneja en useLogin
      
      if (onLogin) {
        onLogin(result.user);
      }
    } catch (err) {
    //   console.error("Error en login:", err);
      setLocalError("Error inesperado al intentar ingresar.");
    }
  };

  useEffect(() => {
    if (!showRegister && !showRecover) {
      setEmail("");
      setPassword("");
      setLocalError("");
      setShowPassword(false);
    }
  }, [showRegister, showRecover]);

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* <div style={{ background: '#f3f4f6', color: '#222', borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 14, textAlign: 'center' }}>
          <strong>Credenciales de prueba:</strong><br />
          Correo: <span style={{ fontFamily: 'monospace' }}>admin@demo.com</span><br />
          Contraseña: <span style={{ fontFamily: 'monospace' }}>Admin123!</span>
        </div> */}
        <h2 className={styles.title}>
          Clasifica tu basura de forma inteligente
        </h2>
        <div className={styles.inputGroup}>
          <div className={styles.label}>
            <strong>Correo electrónico</strong>
          </div>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.input}
            placeholder="Correo electrónico"
            autoComplete="username"
            title="Completa este campo"
            style={{ width: "100%" }}
          />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.label}>
            <strong>Contraseña</strong>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.passwordInput}
              placeholder="Contraseña"
              title="Completa este campo"
              style={{ width: "100%", paddingRight: 80 }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={styles.showPasswordBtn}
              tabIndex={-1}
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <div style={{ textAlign: "right", marginTop: 4 }}>
            {/* <a
              href="#"
              className={styles.registerLinkBtn}
              onClick={e => { e.preventDefault(); setShowRecover(true); }}
              tabIndex={0}
            >
              ¿Olvidaste tu contraseña?
            </a> */}
          </div>
        </div>
        {(localError || error) && (
          <div className={styles.error}>{localError || error}</div>
        )}
        <button
          type="submit"
          className={`${styles.loginButton} ${email && password ? styles.ready : ''} ${loading ? styles.loading : ''}`}
          disabled={loading}
        >
          <span className={styles.loginButtonText}>
            {loading ? 'Accediendo...' : 'Iniciar Sesión'}
          </span>
        </button>
     
        {/* <div style={{ textAlign: "center", marginTop: 8 }}>
          <a
            href="#"
            className={styles.registerLinkBtn}
            onClick={e => { e.preventDefault(); setShowRegister(true); }}
            tabIndex={0}
          >
            ¿No tienes cuenta? <span style={{ textDecoration: 'underline' }}>Regístrate</span>
          </a>
        </div> */}
      </form>
      <RecoverPasswordModal
        open={showRecover}
        onClose={() => setShowRecover(false)}
      />
      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
}