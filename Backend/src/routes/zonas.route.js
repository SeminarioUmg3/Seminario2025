import { Router } from "express";
import { verifyToken } from "../middlewares/middleware.js";
import { getZonas, crearZonas, actualizarZonas, eliminarZonas } from "../controllers/zonas.controller.js";
import { body } from "express-validator";
const zonasRouter = Router();


/**
 * @swagger
 * /api/zonas/obtenerZonas:
 *   get:
 *     summary: Obtener zonas
 *     tags:
 *       - Zonas
 *     responses:
 *       200:
 *         description: Zonas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   nombre:
 *                     type: string
 *                   codigo:
 *                     type: string
 *       400:
 *         description: Error al obtener las zonas
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
zonasRouter.get('/obtenerZonas',  getZonas);

const crearZonasValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('codigo').notEmpty().withMessage('El código es requerido'),
]
/**
 * @swagger
 * /api/zonas/crearZona:
 *   post:
 *     summary: Crear zona
 *     tags:
 *       - Zonas
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
 *               codigo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zona creada exitosamente
 *       400:
 *         description: Error al crear la zona
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
zonasRouter.post('/crearZona', verifyToken, crearZonasValidation, crearZonas);

const actualizarZonasValidation = [
  body('id').notEmpty().withMessage('El id es requerido').isNumeric().withMessage('El id debe  ser un número'),
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('codigo').notEmpty().withMessage('El código es requerido'),
]
/**
 * @swagger
 * /api/zonas/actualizarZona:
 *   put:
 *     summary: Actualizar zona
 *     tags:
 *       - Zonas
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
 *               codigo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zona actualizada exitosamente
 *       400:
 *         description: Error al actualizar la zona
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
zonasRouter.put('/actualizarZona', verifyToken, actualizarZonasValidation, actualizarZonas);

const eliminarZonasValidation = [
  body('id').notEmpty().withMessage('El id es requerido').isNumeric().withMessage('El id debe ser un número'),
]
/**
 * @swagger
 * /api/zonas/eliminarZona:
 *   delete:
 *     summary: Eliminar zona
 *     tags:
 *       - Zonas
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
 *     responses:
 *       200:
 *         description: Zona eliminada exitosamente
 *       400:
 *         description: Error al eliminar la zona
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
zonasRouter.delete('/eliminarZona', verifyToken, eliminarZonasValidation, eliminarZonas);


export { zonasRouter };