# Guía para agregar nuevas páginas o componentes

Esta guía explica el flujo de trabajo recomendado para crear y documentar nuevas páginas o componentes en este proyecto. Usa el ejemplo de la página Login para ilustrar el proceso.

## Pasos generales

1. **Crear la carpeta y archivo principal**
   - Ejemplo: `src/pages/Login/Login.jsx` o `src/components/Auth/LoginForm.jsx`

2. **Agregar un README.md en la carpeta**
   - Explica el propósito, estructura y cómo se integra el componente/página.

3. **Crear archivos relacionados según necesidad**
   - **Hook personalizado:** `src/hooks/useLogin.js`
   - **Servicio:** `src/services/authService.js` (agregar funciones específicas si es necesario)
   - **Ruta:** Definir en `src/constants/routes.js` y agregar en el sistema de rutas de React.
   - **Contexto:** Actualizar o crear en `src/context/AuthContext.jsx` si requiere estado global.
   - **Estilos:** Crear archivo CSS/Module CSS si el componente lo necesita.
   - **Test:** Agregar pruebas en la carpeta correspondiente.

4. **Actualizar el sistema de rutas**
   - Modificar el archivo de rutas para incluir la nueva página.

5. **Documentar en el README.md**
   - Explica cómo se conecta cada parte (componente, hook, servicio, ruta, contexto).

---

## Ejemplo: Página Login

### Estructura

- `Login.jsx`: Componente principal de la página.
- `useLogin.js`: Hook personalizado para manejar lógica de login.
- `authService.js`: Funciones para autenticación y comunicación con la API.
- `routes.js`: Definición de la ruta `/login`.
- `AuthContext.jsx`: Manejo de estado global de autenticación.
- `Login.module.css`: Estilos específicos del componente.

### Integración

1. La ruta `/login` está definida en `routes.js` y en el sistema de rutas de React.
2. El componente `Login.jsx` utiliza el hook `useLogin` para manejar el formulario y la lógica.
3. Las funciones de autenticación se encuentran en `authService.js`.
4. El estado de usuario se gestiona con `AuthContext.jsx`.
5. Los estilos se aplican desde `Login.module.css`.

### Buenas prácticas

- Mantener cada responsabilidad en su archivo correspondiente.
- Documentar cada nuevo componente/página en su propio README.md.
- Actualizar el README general del proyecto si se agregan funcionalidades importantes.
- Usar comentarios descriptivos en cada archivo JS/JSX sobre su propósito.

---

Esta estructura ayuda a mantener el proyecto organizado y facilita la colaboración entre el equipo.
