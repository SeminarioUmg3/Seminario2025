import { Router } from 'express';
import { 
    crearNotificacion, 
    obtenerTodasLasNotificaciones,
    obtenerNotificacionPorId,
    actualizarNotificacion,
    eliminarNotificacion
} from '../controllers/notificaciones.controller.js';
import { body } from 'express-validator';
import { verifyToken } from '../middlewares/middleware.js';

const routerNotificaciones = Router();

// Validaciones para crear/actualizar notificación
const validacionNotificacion = [
    body('titulo').notEmpty().withMessage('El título es requerido'),
    body('cuerpo').notEmpty().withMessage('El cuerpo es requerido'),
    body('tipo').isIn(['ALERTA', 'NOTIFICACION', 'INFORMATIVA', 'PROMOCIONAL']).withMessage('Tipo de notificación inválido')
];

/**
 * @swagger
 * /api/notificaciones:
 *   post:
 *     summary: Crear nueva notificación
 *     description: Crea una nueva notificación pública. Solo administradores pueden crear notificaciones.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - cuerpo
 *               - tipo
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título de la notificación
 *                 example: "Nueva campaña de reciclaje"
 *               cuerpo:
 *                 type: string
 *                 description: Contenido de la notificación
 *                 example: "Se ha lanzado una nueva campaña de reciclaje en todas las zonas"
 *               tipo:
 *                 type: string
 *                 enum: [ALERTA, NOTIFICACION, INFORMATIVA, PROMOCIONAL]
 *                 description: Tipo de notificación
 *                 example: "INFORMATIVA"
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notificación creada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Nueva campaña de reciclaje"
 *                     cuerpo:
 *                       type: string
 *                       example: "Se ha lanzado una nueva campaña de reciclaje en todas las zonas"
 *                     tipo:
 *                       type: string
 *                       example: "INFORMATIVA"
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                     creado_por:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
routerNotificaciones.post('/', verifyToken, validacionNotificacion, crearNotificacion);

/**
 * @swagger
 * /api/notificaciones:
 *   get:
 *     summary: Obtener todas las notificaciones
 *     description: Obtiene todas las notificaciones públicas ordenadas por fecha de creación (más recientes primero)
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notificaciones obtenidas exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "Nueva campaña de reciclaje"
 *                       cuerpo:
 *                         type: string
 *                         example: "Se ha lanzado una nueva campaña de reciclaje en todas las zonas"
 *                       tipo:
 *                         type: string
 *                         example: "INFORMATIVA"
 *                       fecha_registro:
 *                         type: string
 *                         format: date-time
 *                       usuarios:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nombre_completo:
 *                             type: string
 *                             example: "Juan Pérez"
 *                           nombre_usuario:
 *                             type: string
 *                             example: "jperez"
 *       500:
 *         description: Error interno del servidor
 */
routerNotificaciones.get('/', verifyToken, obtenerTodasLasNotificaciones);

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   get:
 *     summary: Obtener notificación por ID
 *     description: Obtiene una notificación específica por su ID
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *         example: 1
 *     responses:
 *       200:
 *         description: Notificación obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notificación obtenida exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Nueva campaña de reciclaje"
 *                     cuerpo:
 *                       type: string
 *                       example: "Se ha lanzado una nueva campaña de reciclaje en todas las zonas"
 *                     tipo:
 *                       type: string
 *                       example: "INFORMATIVA"
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                     usuarios:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         nombre_completo:
 *                           type: string
 *                           example: "Juan Pérez"
 *                         nombre_usuario:
 *                           type: string
 *                           example: "jperez"
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
routerNotificaciones.get('/:id', verifyToken, obtenerNotificacionPorId);

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   put:
 *     summary: Actualizar notificación
 *     description: Actualiza una notificación existente. Solo administradores pueden actualizar notificaciones.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - cuerpo
 *               - tipo
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título de la notificación
 *                 example: "Campaña de reciclaje actualizada"
 *               cuerpo:
 *                 type: string
 *                 description: Contenido de la notificación
 *                 example: "La campaña de reciclaje ha sido actualizada con nuevos incentivos"
 *               tipo:
 *                 type: string
 *                 enum: [ALERTA, NOTIFICACION, INFORMATIVA, PROMOCIONAL]
 *                 description: Tipo de notificación
 *                 example: "PROMOCIONAL"
 *     responses:
 *       200:
 *         description: Notificación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notificación actualizada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Campaña de reciclaje actualizada"
 *                     cuerpo:
 *                       type: string
 *                       example: "La campaña de reciclaje ha sido actualizada con nuevos incentivos"
 *                     tipo:
 *                       type: string
 *                       example: "PROMOCIONAL"
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                     usuarios:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         nombre_completo:
 *                           type: string
 *                           example: "Juan Pérez"
 *                         nombre_usuario:
 *                           type: string
 *                           example: "jperez"
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
routerNotificaciones.put('/:id', verifyToken, validacionNotificacion, actualizarNotificacion);

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   delete:
 *     summary: Eliminar notificación
 *     description: Elimina una notificación existente. Solo administradores pueden eliminar notificaciones.
 *     tags:
 *       - Notificaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *         example: 1
 *     responses:
 *       200:
 *         description: Notificación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notificación eliminada exitosamente"
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
routerNotificaciones.delete('/:id', verifyToken, eliminarNotificacion);

export { routerNotificaciones };
