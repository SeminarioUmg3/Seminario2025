    # Endpoints Rutas

    ## 1. Obtener rutas
    - **Método:** GET
    - **Endpoint:** `/api/rutas/obtenerRutas`
    - **Headers:**  
    `Authorization: Bearer <token>`
    - **Input:** Ninguno
    - **Output:**
    ```json
    [
    {
        "id": 1,
        "nombre": "string",
        "zona_id": 1
    }
    ]
    ```

    ## 2. Crear ruta
    - **Método:** POST
    - **Endpoint:** `/api/rutas/crearRuta`
    - **Headers:**  
    `Content-Type: application/json`  
    `Authorization: Bearer <token>`
    - **Input (body):**
    ```json
    {
    "nombre": "string",
    "zona_id": 1
    }
    ```
    - **Output:** Ruta creada

    ## 3. Actualizar ruta
    - **Método:** PUT
    - **Endpoint:** `/api/rutas/actualizarRuta`
    - **Headers:**  
    `Content-Type: application/json`  
    `Authorization: Bearer <token>`
    - **Input (body):**
    ```json
    {
    "id": 1,
    "nombre": "string",
    "zona_id": 1,
    "activo": true
    }
    ```
    - **Output:** Ruta actualizada

    ## 4. Eliminar ruta
    - **Método:** DELETE
    - **Endpoint:** `/api/rutas/eliminarRuta`
    - **Headers:**  
    `Content-Type: application/json`  
    `Authorization: Bearer <token>`
    - **Input (body):**
    ```json
    {
    "id": 1
    }
    ```
    - **Output:** Ruta eliminada
