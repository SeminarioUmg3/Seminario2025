# Endpoints Usuarios

## 1. Obtener todos los usuarios
- **Método:** GET
- **Endpoint:** `/api/usuarios/obtenerUsuarios`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Ninguno
- **Output:**
```json
[
  {
    "id": 1,
    "nombreCompleto": "string",
    "nombreUsuario": "string",
    "rol": "string",
    "estado": "string",
    "zona_id": 1
  }
]
```

## 2. Obtener usuario por ID
- **Método:** GET
- **Endpoint:** `/api/usuarios/obtenerUsuarioId/{id}`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Parámetro `id` en URL
- **Output:** Usuario por ID

## 3. Actualizar usuario
- **Método:** PUT
- **Endpoint:** `/api/usuarios/actualizarUsuario/{id}`
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <token>`
- **Input (body):**
```json
{
  "nombre_completo": "string",
  "nombre_usuario": "string",
  "rol_id": 1,
  "estado": "string",
  "zona_id": 1
}
```
- **Output:** Usuario actualizado

## 4. Eliminar usuario
- **Método:** DELETE
- **Endpoint:** `/api/usuarios/eliminarUsuario/{id}`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Parámetro `id` en URL
- **Output:** Usuario eliminado
