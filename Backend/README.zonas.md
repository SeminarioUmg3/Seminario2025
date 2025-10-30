# Endpoints Zonas

## 1. Obtener todas las zonas
- **Método:** GET
- **Endpoint:** `/api/zonas/obtenerZonas`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Ninguno
- **Output:**
```json
[
  {
    "id": 1,
    "nombre": "Zona Norte",
    "codigo": "ZN"
  }
]
```

## 2. Crear una zona
- **Método:** POST
- **Endpoint:** `/api/zonas/crearZona`
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <token>`
- **Input (body):**
```json
{
  "nombre": "Zona Norte",
  "codigo": "ZN"
}
```
- **Output:**
```json
{
  "id": 1,
  "nombre": "Zona Norte",
  "codigo": "ZN"
}
```

## 3. Actualizar una zona
- **Método:** PUT
- **Endpoint:** `/api/zonas/actualizarZona`
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <token>`
- **Input (body):**
```json
{
  "id": 1,
  "nombre": "Zona Sur",
  "codigo": "ZS"
}
```
- **Output:**
```json
{
  "id": 1,
  "nombre": "Zona Sur",
  "codigo": "ZS"
}
```

## 4. Eliminar una zona
- **Método:** DELETE
- **Endpoint:** `/api/zonas/eliminarZona`
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <token>`
- **Input (body):**
```json
{
  "id": 1
}
```
- **Output:**
Mensaje de éxito o zona eliminada.

> **Nota:** El campo `id` se genera automáticamente por la base de datos. No debes enviarlo al crear una zona, solo se usa para identificar, consultar, actualizar o eliminar zonas existentes.
