# Pantalla CRUD de Usuarios y Roles

Esta página permite gestionar usuarios y roles del sistema municipal. Incluye:

- Tabla de usuarios con edición y eliminación.
- Formulario para crear/editar usuarios.
- Gestión de roles (tabla y formulario).
- Integración con la API (servicio).
- Estilos responsivos con Bootstrap y CSS Modules.

## Estructura

- `Usuarios.jsx`: Componente principal, muestra la tabla y el formulario de usuarios.
- `Roles.jsx`: Componente para la gestión de roles.
- `useUsuarios.js`: Hook personalizado para lógica de usuarios.
- `useRoles.js`: Hook personalizado para lógica de roles.
- `usuariosService.js`: Funciones para comunicación con la API.
- `Usuarios.module.css`: Estilos específicos.

## Integración

- Agregar la ruta `/usuarios` en el sistema de rutas.
- Importar y usar el componente `Usuarios.jsx`.

## Modelo de datos

Basado en la base de datos:

- **Usuarios**: id, nombre, contraseña_hash, rol_id, zona_id, fecha_registro
- **Roles**: id, nombre

## Buenas prácticas

- Mantener cada responsabilidad en su archivo.
- Documentar cada componente y hook.
- Usar modales para formularios de edición/creación.
- Validar datos antes de enviar a la API.
