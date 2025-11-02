# Backend

Documentación de la carpeta backend.


#pasos para correr este proyecto con docker

# 1. Instalar Docker

# Para instalar Docker, sigue las instrucciones en la [documentación oficial de Docker](https://docs.docker.com/get-docker/).

# 2. Clonar el repositorio en la rama devBackend

git clone -b devBackend https://github.com/tu_usuario/tu_repositorio.git

# crear un archivo .env en la raíz de la carpeta backend y agregar las variables de entorno necesarias

# correr con docker-compose
docker-compose up --build

#si algunos endpoints falla debe correr el comando localmente
dentro de la carpeta
Backend/
#correr el comando 
npx generate

#luego correr con docker compose

# Documentacion con Swagger 
- **summary:** Resumen breve de lo que hace el endpoint.  
- **description:** Explicación más detallada (opcional).  
- **tags:** Sirven para agrupar endpoints (ej. "Users", "Auth", "Products").  
- **parameters:** Datos que se envían en la URL o query string.  
- **requestBody:** Estructura del cuerpo que espera el endpoint (usado en POST/PUT).  
- **responses:** Posibles respuestas del servidor con su código de estado.  
### 📑 Ejemplo en formato OpenAPI 
```js
/**
 * @swagger
 * /items:                                #  Dirección de la ruta (endpoint)
 *   get:                                 #  Método HTTP (GET, POST, PUT, DELETE)
 *     summary: Get all items             #  Resumen corto
 *     description: Returns a list of items in the system   # Explicación detallada
 *     tags:                              # Categoría para agrupar endpoints
 *       - Items
 *     parameters:                        #  Parámetros (query, path, header, cookie)
 *       - in: query                      #  Dónde va el parámetro (aquí: query string)
 *         name: limit                    #  Nombre del parámetro
 *         schema:                        #  Tipo de dato esperado
 *           type: integer
 *         required: false                #  Si es obligatorio o no
 *         description: Máximo de ítems a devolver
 *     responses:                         #  Posibles respuestas
 *       200:                             #  Código HTTP de éxito
 *         description: Successful response
 *         content:
 *           application/json:            #  Tipo de contenido
 *             schema:                    #  Estructura de la respuesta
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'   # 🔗 Reutiliza un schema
 *       400:                             #  Otro posible código HTTP
 *         description: Bad Request
 */
router.get("/items", (req, res) => {
  res.json([{ id: 1, name: "Laptop", price: 1000 }]);
});
```

