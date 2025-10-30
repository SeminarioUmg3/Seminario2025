# Endpoints Calendario

## 1. Actualizar horario
- **Método:** PUT
- **Endpoint:** `/api/calendario/update/{id}`
- **Headers:**  
  `Content-Type: application/json`  
  `Authorization: Bearer <token>`
- **Input (body):**
```json
{
  "hora_inicio": "09:00",
  "hora_fin": "13:00",
  "frecuencia": "Quincenal",
  "notas": "string"
}
```
- **Output:** Horario actualizado

## 2. Eliminar horario
- **Método:** DELETE
- **Endpoint:** `/api/calendario/delete/{id}`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Parámetro `id` en URL
- **Output:** Horario eliminado
