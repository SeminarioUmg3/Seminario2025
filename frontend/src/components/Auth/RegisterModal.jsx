import { useState, useEffect } from "react";
import styles from "./LoginForm.module.css";
import { validateEmail, validateStrongPassword, validateRequired } from "../../utils/validation";
import { useRegister } from "../../hooks/useRegister";

export default function RegisterModal({ show, onHide, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, loading, error: backendError } = useRegister();

  useEffect(() => {
    if (!show) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess(false);
      setShowPassword(false);
      setShowConfirm(false);
    }
  }, [show]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateRequired(name) || !validateRequired(email) || !validateRequired(password) || !validateRequired(confirmPassword)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido que termine en .com");
      return;
    }
    if (name.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!validateStrongPassword(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Enviar al backend - especificar que es registro administrativo
    const result = await register({
      nombreCompleto: name,
      nombreUsuario: email,
      contrasenia: password,
    }, 'admin');

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) {
          onSuccess();
        }
        onHide();
      }, 1500);
    } else {
      setError(backendError || "Error en el registro.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Registro</h2>
        {success ? (
          <div className={styles.successMsg}>¡Registro exitoso!</div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                title="Completa este campo"
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                title="Completa este campo"
              />
            </div>
            <div className={styles.inputGroup} style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.passwordInput}
                style={{ width: "100%" }}
                title="Completa este campo"
              />
              <button
                type="button"
                className={styles.confirmShowPasswordBtn}
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div className={styles.inputGroup} style={{ position: "relative" }}>
              <input
                placeholder="Confirmar contraseña"
                className={styles.input}
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                title="Completa este campo"
                style={{ width: "100%", paddingRight: 80 }}
              />
              <button
                type="button"
                className={styles.confirmShowPasswordBtn}
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {(error || backendError) && <div className={styles.error}>{error || backendError}</div>}
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <a
                href="#"
                onClick={e => { e.preventDefault(); onHide(); }}
                className={styles.registerLinkBtn}
                style={{ marginTop: 18, display: 'inline-block' }}
              >
                Cancelar
              </a>
            </div>
          </form>
        )}
          </div>
    </div>
  );
}