import express from 'express';
import { verifyToken } from '../middlewares/middleware.js';
import { createAcopio, updateAcopio,getAcopio, getAcopioCoordenadas,deleteAcopio } from '../controllers/acopio.controller.js';
import { body, param } from 'express-validator';

const acopioRouter = express.Router();

/**
 * @swagger
 * /api/acopio/listarAcopios:
 *   get:
 *     summary: Obtener acopio
 *     description: Obtener informacion de los acopios con sus zonas
 *     tags:
 *       - Acopios
 *     responses:
 *       200:
 *         description: Acopio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipo:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 latitud:
 *                   type: string
 *                 longitud:
 *                   type: string
 *                 direccion:
 *                   type: string
 *                 zona_id:
 *                   type: number
 *                 horario:
 *                   type: string
 *                 zonas:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     nombre:
 *                       type: string
 *                     codigo:
 *                       type: string
 *       400:
 *         description: Error al obtener el acopio
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *       
 * 
 */
acopioRouter.get('/listarAcopios', getAcopio);

/**
 * @swagger
 * /api/acopio/listarAcopiosCoordenadas:
 *   get:
 *     summary: Obtener acopio coordenadas
 *     description: Obtener informacion de los acopios con sus coordenadas
 *     tags:
 *       - Acopios
 *     responses:
 *       200:
 *         description: Acopio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acopio:
 *                   type: array
 *                   description: Lista de acopios
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       nombre:
 *                         type: string
 *                       latitud:
 *                         type: string
 *                       longitud:
 *                         type: string
 * 
 *       400:
 *         description: Error al obtener el acopio
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron acopios
 *       500:
 *         description: Error interno del servidor
 * 
 */
acopioRouter.get('/listarAcopiosCoordenadas', verifyToken, getAcopioCoordenadas);

/**
 * @swagger
 * /api/acopio:
 *   post:
 *     summary: Crear un nuevo acopio
 *     tags:
 *       - Acopios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - tipo
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *               latitud:
 *                 type: number
 *               longitud:
 *                 type: number
 *               direccion:
 *                 type: string
 *               zona_id:
 *                 type: number
 *               horario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Acopio creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
acopioRouter.post(
    '/',
    verifyToken,
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('tipo').notEmpty().withMessage('Tipo es requerido'),
    createAcopio
);

/**
 * @swagger
 * /api/acopio/{id}:
 *   put:
 *     summary: Editar un acopio existente
 *     tags:
 *       - Acopios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del acopio a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *               latitud:
 *                 type: number
 *               longitud:
 *                 type: number
 *               direccion:
 *                 type: string
 *               zona_id:
 *                 type: number
 *               horario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Acopio actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
acopioRouter.put(
    '/:id',
    verifyToken,
    param('id').isInt().withMessage('ID debe ser un número'),
    body('nombre').optional(),
    body('tipo').optional(),
    updateAcopio
);

/**
 * @swagger
 * /api/acopio/{id}:
 *   delete:
 *     summary: Eliminar un acopio
 *     tags:
 *       - Acopios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del acopio a eliminar
 *     responses:
 *       200:
 *         description: Acopio eliminado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
acopioRouter.delete(
    '/:id',
    verifyToken,
    param('id').isInt().withMessage('ID debe ser un número'),
    deleteAcopio
);

export default acopioRouter;