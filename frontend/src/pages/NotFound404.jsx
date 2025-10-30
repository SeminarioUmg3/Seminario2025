import { Link } from "react-router-dom";
import styles from "./NotFound404.module.css";

export default function NotFound404() {
  return (
    <div className={styles.notFoundBg}>
      <div className={styles.notFoundContainer}>
        <h2 className={styles.notFoundTitle}>404 - Página no encontrada</h2>
        <p className={styles.notFoundText}>
          Ups, no pudimos encontrar la página que buscas.
        </p>
        <Link to="/" className={styles.notFoundBtn}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

