# Endpoints Notificaciones

## 1. Crear notificación
- **Método:** POST
- **Endpoint:** `/api/notificaciones/crear`
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <token>`
- **Input (body):**
```json
{
  "titulo": "string",
  "cuerpo": "string",
  "tipo": "ALERTA | NOTIFICACION | INFORMATIVA | PROMOCIONAL",
  "creadoPor": 1,
  "programadaEn": "2025-09-19T10:00:00Z",
  "audiencia": [
    {
      "tipo_objetivo": "ZONA | USUARIO | ROL | TODOS",
      "objetivo_id": 1
    }
  ]
}
```
- **Output:** Notificación creada

## 2. Obtener notificaciones
- **Método:** GET
- **Endpoint:** `/api/notificaciones/obtenerNotificaciones`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Ninguno
- **Output:** Array de notificaciones
