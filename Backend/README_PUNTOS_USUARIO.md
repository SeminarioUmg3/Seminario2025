

# 📊 Sistema de Puntos por Usuario

## 🎯 Descripción General

Sistema de gamificación que permite a los usuarios ganar puntos por clasificar residuos correctamente usando inteligencia artificial. El sistema incentiva el reciclaje y la conciencia ambiental a través de un sistema de puntos y recompensas.

## 🚀 Características Principales

- ✅ **Clasificación automática** de residuos usando IA
- ✅ **Sistema de puntos** basado en categorías de residuos
- ✅ **Historial completo** de puntos por usuario
- ✅ **Incentivos diferenciados** según tipo de residuo
- ✅ **API RESTful** con documentación Swagger
- ✅ **Base de datos optimizada** con transacciones

## 📁 Estructura de Archivos

```
Backend/src/
├── services/
│   ├── puntosPorUsuario.service.js     # Lógica de negocio
│   └── clasificacion.service.js        # Integración con IA
├── controllers/
│   ├── puntorPorusuario.controller.js  # Controlador de puntos
│   └── clasificacion.controller.js    # Controlador de clasificación
└── routes/
    ├── puntosPorUsuaro.route.js        # Rutas y documentación
    └── clasificacion.route.js          # Rutas de clasificación
```

## 🎮 Endpoints Disponibles

### 1. Clasificar Imagen (Asignar Puntos)
```http
POST /api/clasificacion/imagen
Content-Type: multipart/form-data

Body:
- file: [archivo de imagen]
- idUsuario: [integer]
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "categoria": "RECICLABLE",
    "material_probable": "Botella de plástico PET",
    "nivel_confianza": 0.95,
    "bote_sugerido": "plástico",
    "instrucciones_preparacion": ["Enjuagar", "Retirar tapa"],
    "advertencias": [],
    "notas": "Botella reutilizable"
  }
}
```

### 2. Obtener Mis Puntos
```http
GET /api/puntos/obtenerMisPuntos/:idUsuario
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": 123,
      "nombre_completo": "Juan Pérez",
      "nombre_usuario": "juan.perez",
      "estado": "activo",
      "zonas": {
        "nombre": "Zona Norte"
      }
    },
    "registros": [
      {
        "id": 1,
        "id_tipo_residuo": 5,
        "total_puntos": 10,
        "tiporesiduo": {
          "nombre": "Botella de plástico PET",
          "categoria": "RECICLABLE",
          "color_contenedor": "AZUL"
        }
      }
    ],
    "totalPuntos": 45,
    "cantidadRegistros": 5
  }
}
```

## 💎 Sistema de Puntos

### Categorías y Puntos
| Categoría | Puntos | Color Contenedor | Incentivo |
|-----------|--------|------------------|-----------|
| 🟢 **RECICLABLE** | 10 | AZUL | Máximo |
| 🟡 **ORGÁNICO** | 5 | VERDE | Medio |
| 🔴 **NO_RECICLABLE** | 2 | NEGRO | Mínimo |
| ⚫ **INCIERTO** | 1 | ROJO | Básico |

### Constantes del Sistema
```javascript
const PUNTOS = {
    RECICLABLE: 10,
    NO_RECICLABLE: 2,
    ORGANICO: 5,
    INCIERTO: 1,
}

const CATEGORIAS = {
    RECICLABLE: 'RECICLABLE',
    NO_RECICLABLE: 'NO_RECICLABLE',
    ORGANICO: 'ORGANICO',
    INCIERTO: 'INCIERTO',
}

const COLORES = {
    RECICLABLE: 'AZUL',
    NO_RECICLABLE: 'NEGRO',
    ORGANICO: 'VERDE',
    INCIERTO: 'ROJO',
}
```

## 🗄️ Base de Datos

### Tablas Principales

#### `puntosusuario`
```sql
CREATE TABLE puntosusuario (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_tipo_residuo INTEGER NOT NULL,
    total_puntos INTEGER,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_tipo_residuo) REFERENCES tiporesiduo(id)
);
```

#### `tiporesiduo`
```sql
CREATE TABLE tiporesiduo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    categoria VARCHAR,
    color_contenedor VARCHAR,
    reciclable BOOLEAN,
    fecha_registro TIMESTAMP DEFAULT NOW()
);
```

## 🔄 Flujo de Trabajo

### 1. Clasificación de Imagen
```
Usuario sube imagen → IA analiza → Clasifica residuo → Asigna puntos automáticamente
```

### 2. Consulta de Puntos
```
Usuario solicita puntos → Consulta BD → Calcula total → Retorna historial
```

