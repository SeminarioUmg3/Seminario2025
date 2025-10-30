# Endpoints Ranking

## 1. Obtener ranking por zona
- **Método:** GET
- **Endpoint:** `/api/ranking`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Ninguno
- **Output:**
```json
[
  {
    "zona": "string",
    "puntaje": 100,
    "posicion": 1
  }
]
```

## 2. Obtener ranking por zona (App)
- **Método:** GET
- **Endpoint:** `/api/app/ranking-zonas`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Input:** Ninguno
- **Output:**
```json
[
  {
    "zona": "string",
    "puntaje": 100,
    "posicion": 1
  }
]
```

> **Nota:** El campo `id` y los datos de ranking se generan automáticamente por el backend. Solo debes enviar el token para obtener el ranking.
