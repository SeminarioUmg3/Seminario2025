import express from 'express';
import { verifyToken } from '../middlewares/middleware.js';
import { getRutas , crearRutas , actualizarRutas , eliminarRutas } from '../controllers/rutas.controller.js';
import { body } from 'express-validator';
const rutasRouter = express.Router();

/**
 * @swagger
 * /api/rutas/obtenerRutas:
 *   get:
 *     summary: Obtener rutas
 *     description: Obtener listado de zonas con sus respectivas rutas
 *     tags:
 *       - Rutas
 
 *     responses:
 *       200:
 *         description: Rutas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rutas:
 *                   type: array
 *                   description: Lista de rutas
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       nombre:
 *                         type: string
 *                       zona_id:
 *                         type: number
 *                       rutas:
 *                         type: array
 *                         description: Lista de rutas
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: number
 *                             nombre:
 *                               type: string
 *                             zona_id:
 *                               type: number
 *       400:
 *         description: Error al obtener las rutas
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * 
 * 
 */
rutasRouter.get('/obtenerRutas',  getRutas);

const crearRutasValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('zona_id').notEmpty().withMessage('La zona es requerida'),
]
/**
 * @swagger
 * /api/rutas/crearRuta:
 *   post:
 *     summary: Crear ruta
 *     tags:
 *       - Rutas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               zona_id:
 *                 type: number
 *               inicio_latitud:
 *                 type: number
 *                 description: Latitud del punto de inicio
 *               inicio_longitud:
 *                 type: number
 *                 description: Longitud del punto de inicio
 *               fin_latitud:
 *                 type: number
 *                 description: Latitud del punto final
 *               fin_longitud:
 *                 type: number
 *                 description: Longitud del punto final
 *               puntos_intermedios:
 *                 type: array
 *                 description: Lista de puntos intermedios [{lat, lng}]
 *                 items:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *     responses:
 *       201:
 *         description: Ruta creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
rutasRouter.post('/crearRuta', verifyToken, crearRutasValidation, crearRutas);
const actualizarRutasValidation = [
  body('id').notEmpty().withMessage('El id es requerido'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('zona_id').notEmpty().withMessage('La zona es requerida').isInt().withMessage('La zona debe ser un número entero'),
  body('activo').notEmpty().withMessage('El activo debe ser un booleano'),
]
/**
 * @swagger
 * /api/rutas/actualizarRuta:
 *   put:
 *     summary: Actualizar ruta
 *     tags:
 *       - Rutas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               nombre:
 *                 type: string
 *               zona_id:
 *                 type: number
 *               activo:
 *                 type: boolean
 *               inicio_latitud:
 *                 type: number
 *                 description: Latitud del punto de inicio
 *               inicio_longitud:
 *                 type: number
 *                 description: Longitud del punto de inicio
 *               fin_latitud:
 *                 type: number
 *                 description: Latitud del punto final
 *               fin_longitud:
 *                 type: number
 *                 description: Longitud del punto final
 *               puntos_intermedios:
 *                 type: array
 *                 description: Lista de puntos intermedios [{lat, lng}]
 *                 items:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *     responses:
 *       200:
 *         description: Ruta actualizada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
rutasRouter.put('/actualizarRuta', verifyToken, actualizarRutasValidation, actualizarRutas);

const eliminarRutasValidation = [
  body('id').notEmpty().withMessage('El id es requerido').isInt().withMessage('El id debe ser un número entero'),
]
/**
 * @swagger
 * /api/rutas/eliminarRuta:
 *   delete:
 *     summary: Eliminar ruta
 *     tags:
 *       - Rutas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ruta eliminada exitosamente
 *       500:
 *         description: Error interno del servidor
 */
rutasRouter.delete('/eliminarRuta', verifyToken, eliminarRutasValidation, eliminarRutas);

export { rutasRouter };