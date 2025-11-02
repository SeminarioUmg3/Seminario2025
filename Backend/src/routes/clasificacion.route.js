import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import clasificacionController from "../controllers/clasificacion.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configurar multer para almacenamiento temporal
const upload = multer({
  dest: path.join(__dirname, "../../uploads"),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Validar que sea una imagen
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"));
    }
  },
});

/**
 * @swagger
 * /api/clasificacion/imagen:
 *   post:
 *     summary: Clasifica una imagen de residuo usando IA
 *     description: Analiza una imagen y determina si es reciclable, el tipo de material, contenedor sugerido e instrucciones de preparación
 *     tags:
 *       - Clasificación IA
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del residuo a clasificar (JPG, PNG, etc.)
 *               idUsuario:
 *                 type: integer
 *                 description: ID del usuario que realiza la clasificación
 *                 example: 123
 *     responses:
 *       200:
 *         description: Clasificación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     categoria:
 *                       type: string
 *                       enum: [RECICLABLE, NO RECICLABLE, INCIERTO]
 *                       example: RECICLABLE
 *                     material_probable:
 *                       type: string
 *                       example: Plástico PET
 *                     nivel_confianza:
 *                       type: number
 *                       format: float
 *                       example: 0.95
 *                     bote_sugerido:
 *                       type: string
 *                       example: plástico
 *                     instrucciones_preparacion:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Enjuagar el envase", "Retirar la tapa", "Aplastar para ahorrar espacio"]
 *                     advertencias:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     notas:
 *                       type: string
 *                       example: "Botella de agua reutilizable"
 *                 debug:
 *                   type: object
 *                   properties:
 *                     raw:
 *                       type: string
 *       400:
 *         description: No se envió ninguna imagen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: No se ha enviado ninguna imagen
 *       500:
 *         description: Error al clasificar la imagen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Error al clasificar la imagen
 *                 details:
 *                   type: string
 */
router.post(
  "/imagen",
  upload.single("file"),
  clasificacionController.clasificarImagen
);

export default router;
