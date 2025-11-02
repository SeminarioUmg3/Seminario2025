  import  clasificacionService  from "../services/clasificacion.service.js";

  /**
   * Controlador para la clasificación de residuos con IA
   */
  class ClasificacionController {
    /**
     * Clasifica una imagen de residuo
     * @param {Request} req - Request de Express
     * @param {Response} res - Response de Express
     */
    async clasificarImagen(req, res) {
      let filePath = null;

      try {
        // Validar que se haya enviado un archivo
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: "No se ha enviado ninguna imagen",
          });
        }

        filePath = req.file.path;

        // Detectar tipo MIME
        const mime =
          req.file.mimetype && req.file.mimetype.startsWith("image/")
            ? req.file.mimetype
            : "image/jpeg";

        // Extraer idUsuario del body
        const { idUsuario } = req.body;
        
        // if (!idUsuario) {
        //   return res.status(400).json({
        //     success: false,
        //     error: "ID de usuario es requerido",
        //   });
        // }



        // Clasificar la imagen usando el servicio
        const resultado = await clasificacionService.clasificarImagen(
          filePath,
          mime,
          idUsuario
        );

        // Responder con el resultado
        res.json({
          success: true,
          data: resultado.result,
          debug: {
            raw: resultado.raw,
          },
        });
      } catch (error) {
        console.error("Error en clasificarImagen:", error);
        res.status(500).json({
          success: false,
          error: "Error al clasificar la imagen",
          details: error.message,
        });
      } finally {
        // Limpiar archivo temporal
        if (filePath) {
          await clasificacionService.eliminarArchivo(filePath);
        }
      }
    }
  }

  export default new ClasificacionController();
