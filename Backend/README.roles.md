# Endpoints Roles
> **Nota:** El campo `id` se genera automáticamente por la base de datos. No debes enviarlo al crear un rol, solo se usa para identificar, consultar, actualizar o eliminar roles existentes.

## 1. Obtener listado de roles
- **Método:** GET
- **Endpoint:** `/api/roles/obtenerListadoRoles`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Ninguno
- **Output:**
```json
[
  {
    "id": 1,
    "nombre": "string"
  }
]
```

## 2. Crear rol
- **Método:** POST
- **Endpoint:** `/api/roles/crearRol`
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <token>`
- **Input (body):**
```json
{
  "nombre": "string"
}
```
- **Output:** Rol creado

## 3. Actualizar rol
- **Método:** PUT
- **Endpoint:** `/api/roles/actualizarRolId/{id}`
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <token>`
- **Input (body):**
```json
{
  "nombre": "string"
}
```
- **Output:** Rol actualizado

## 4. Eliminar rol
- **Método:** DELETE
- **Endpoint:** `/api/roles/eliminarRolId/{id}`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Parámetro `id` en URL
- **Output:** Rol eliminado
