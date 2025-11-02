# Endpoints Autenticación

## 1. Login
- **Método:** POST
- **Endpoint:** `/api/auth/login`
- **Headers:**  
  `Content-Type: application/json`
- **Input (body):**
```json
{
  "nombreUsuario": "string",
  "contrasenia": "string"
}
```
- **Output:**
```json
{
  "token": "JWT",
  "usuario": {
    "id": 1,
    "nombreCompleto": "string",
    "nombreUsuario": "string",
    "rol": "string",
    "estado": "string",
    "zona_id": 1
  }
}
```

## 2. Registro
- **Método:** POST
- **Endpoint:** `/api/auth/register`
- **Headers:**  
  `Content-Type: application/json`
- **Input (body):**
```json
{
  "nombreCompleto": "string",
  "nombreUsuario": "string",
  "contrasenia": "string"
}
```
- **Output:** Usuario creado o error
