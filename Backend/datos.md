# Endpoints Zonas

## 1. Obtener todas las zonas
- **Método:** GET
- **Endpoint:** `/api/zonas/obtenerZonas`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Ninguno (solo el token)
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

---

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

---

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

---

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

---

## Ejemplo de consumo desde el frontend (fetch)

```js
// Obtener zonas
fetch('http://localhost:8000/api/zonas/obtenerZonas', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(res => res.json());

// Crear zona
fetch('http://localhost:8000/api/zonas/crearZona', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ nombre: 'Zona Norte', codigo: 'ZN' })
}).then(res => res.json());

// Actualizar zona
fetch('http://localhost:8000/api/zonas/actualizarZona', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ id: 1, nombre: 'Zona Sur', codigo: 'ZS' })
}).then(res => res.json());

// Eliminar zona
fetch('http://localhost:8000/api/zonas/eliminarZona', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ id: 1 })
}).then(res => res.json());
```
