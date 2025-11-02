## API Dashboard: Ejemplo para Postman y Frontend

### Endpoint
`GET /api/dashboard/?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD`

### Headers
```json
{
  "Authorization": "Bearer <tu_token>",
  "Content-Type": "application/json"
}
```

### Parámetros de consulta
- `fechaInicio`: Fecha de inicio del rango (formato `YYYY-MM-DD`)
- `fechaFin`: Fecha de fin del rango (formato `YYYY-MM-DD`)

### Ejemplo de respuesta JSON
```json
{
  "usuarios": {
    "total": 100,
    "activos": 80,
    "inactivos": 20,
    "porRol": [
      { "rol_id": 1, "_count": { "rol_id": 60 } },
      { "rol_id": 2, "_count": { "rol_id": 40 } }
    ]
  },
  "notificaciones": {
    "enviadas": 50,
    "pendientes": 10
  },
  "zonas": [
    { "zonas": { "nombre": "Zona 1" }, "puntos": 20 },
    { "zonas": { "nombre": "Zona 2" }, "puntos": 15 }
  ],
  "tipos_residuos": [
    { "categoria": "Plástico", "cantidad": 200 },
    { "categoria": "Vidrio", "cantidad": 150 }
  ],
  "centros_acopio": 5,
  "rutas": 3
}
```

### Indicaciones para Frontend
- Espera los campos: `usuarios`, `notificaciones`, `zonas`, `tipos_residuos`, `centros_acopio`, `rutas`.
- Si algún campo falta, mostrar 0 o "No hay datos".
- El token debe ser válido y tener rol `ADMIN` y estado `ACTIVO`.

### Indicaciones para Backend
- Si no hay datos, devolver los campos con valores vacíos o 0, nunca omitirlos.
- Validar formato de fechas y existencia de parámetros.
- Si ocurre error, devolver mensaje claro en el campo `error`.

### Ejemplo de petición en Postman
```
GET http://localhost:8000/api/dashboard/?fechaInicio=2025-09-01&fechaFin=2025-09-30
Headers:
  Authorization: Bearer <tu_token>
  Content-Type: application/json
```

### Ejemplo de respuesta sin datos
```json
{
  "usuarios": { "total": 0, "activos": 0, "inactivos": 0, "porRol": [] },
  "notificaciones": { "enviadas": 0, "pendientes": 0 },
  "zonas": [],
  "tipos_residuos": [],
  "centros_acopio": 0,
  "rutas": 0
}
```
