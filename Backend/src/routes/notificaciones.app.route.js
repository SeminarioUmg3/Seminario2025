import { Router } from 'express';
import { crearNotificacion, obtenerTodasLasNotificaciones } from '../controllers/notificaciones.controller.js';
import { body } from 'express-validator';
import { verifyTokenApp } from '../middlewares/middleware.app.js';
const crearNotificacionValidation = [
    body('titulo').notEmpty().withMessage('El titulo es requerido'),
    body('cuerpo').notEmpty().withMessage('El cuerpo es requerido'),
    body('tipo').notEmpty().withMessage('El tipo es requerido'),
    body('creadoPor').notEmpty().withMessage('El creado por es requerido'),
    body('programadaEn').notEmpty().withMessage('La fecha programada es requerida'),
    body('audiencia').isArray().notEmpty().withMessage('La audiencia es requerida'),
]
const routerNotificacionesApp = Router();
/**
 * @swagger
 * /api/app/notificaciones/crear:
 *   post:
 *     summary: Crear notificacion
 *     tags:
 *       - App
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título de la notificación
 *               cuerpo:
 *                 type: string
 *                 description: Cuerpo o contenido de la notificación
 *               tipo:
 *                 type: string
 *                 enum: [ALERTA, NOTIFICACION, INFORMATIVA, PROMOCIONAL]
 *                 description: Tipo de notificación
 *               creadoPor:
 *                 type: number
 *                 description: ID del usuario que crea la notificación
 *               programadaEn:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora programada para enviar la notificación (opcional)
 *               audiencia:
 *                 type: array
 *                 description: Lista de audiencias objetivo para la notificación
 *                 items:
 *                   type: object
 *                   properties:
 *                     tipo_objetivo:
 *                       type: string
 *                       enum: [ZONA, USUARIO, ROL, TODOS]
 *                       description: Tipo de audiencia objetivo
 *                     objetivo_id:
 *                       type: number
 *                       nullable: true
 *                       description: ID específico del objetivo (opcional para 'TODOS')
 *                 example:
 *                   - tipo_objetivo: "ZONA"
 *                     objetivo_id: 1
 *                   - tipo_objetivo: "ROL"
 *                     objetivo_id: 2
 *              
 *     responses:
 *       200:
 *         description: Notificacion creada exitosamente
 *       400:
 *         description: Error al crear la notificacion
 *       500:
 *         description: Error interno del servidor
 */
routerNotificacionesApp.post('/crear', verifyTokenApp, crearNotificacionValidation, crearNotificacion);
/**
 * @swagger
 * /api/app/notificaciones/obtenerNotificaciones:
 *   get:
 *     summary: Obtener todas las notificaciones
 *     tags:
 *       - App
 *     security:
 *       - bearerAuth: []
 *     responses:
 *      200:
 *       description: Notificaciones obtenidas exitosamente
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID de la notificación
 *                     titulo:
 *                       type: string
 *                       description: Título de la notificación
 *                     cuerpo:
 *                       type: string
 *                       description: Cuerpo de la notificación
 *                     tipo:
 *                       type: string
 *                       description: Tipo de notificación
 *                     programada_en:
 *                       type: string
 *                       format: date-time
 *                       description: Fecha programada para envío
 *                     enviada_en:
 *                       type: string
 *                       format: date-time
 *                       description: Fecha de envío
 *                     creado_por:
 *                       type: object
 *                       description: Información del usuario creador
 *                       properties:
 *                         id:
 *                           type: integer
 *                         nombre_completo:
 *                           type: string
 *                         nombre_usuario:
 *                           type: string
 *                         roles:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               nombre:
 *                                 type: string
 *                     audiencia:
 *                       type: array
 *                       description: Lista de audiencias objetivo
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID del registro de audiencia
 *                           tipo_objetivo:
 *                             type: string
 *                             description: Tipo de audiencia (ZONA, USUARIO, ROL, etc.)
 *                           objetivo_id:
 *                             type: integer
 *                             nullable: true
 *                             description: ID específico del objetivo
 *       400:
 *         description: Error al obtener las notificaciones
 *       500:
 *         description: Error interno del servidor
 */
routerNotificacionesApp.get('/obtenerNotificaciones', verifyTokenApp, obtenerTodasLasNotificaciones);
export { routerNotificacionesApp };