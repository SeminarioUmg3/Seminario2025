import express from 'express';

import { verifyToken } from '../middlewares/middleware.js';
import { verifyTokenApp } from '../middlewares/middleware.app.js';

import {
  getCalendario,
  crearHorario,
  obtenerCalendarioRecoleccion,
  updateHorario,
  deleteHorario,
  getCalendarioPorDias,
  getInformacionCalendario
} from '../controllers/calendario.controller.js';

const calendarioRouter = express.Router();
const calendarioRouterApp = express.Router();

/**
 * @swagger
 * tags:
 *   name: Calendario
 *   description: Gestión de calendario de recolección
 */

/**
 * @swagger
 * /api/calendario:
 *   get:
 *     summary: Obtener calendario según zona y fecha || público
 *     description: Devuelve los horarios del calendario para una zona específica y un día de la semana calculado desde la fecha indicada.
 *     tags: [Calendario]
 *     parameters:
 *       - in: query
 *         name: zona
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la zona
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha en formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Calendario obtenido exitosamente
 *       400:
 *         description: Error de validación en los parámetros
 *       500:
 *         description: Error interno del servidor
 */
calendarioRouter.get('/', getCalendario);

/**
 * @swagger
 * /api/calendario/insert:
 *   post:
 *     summary: Crear un nuevo horario || Admin
 *     description: Inserta un nuevo horario en el calendario de recolección asociado a una ruta.
 *     tags: [Calendario]
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ruta_id:
 *                 type: integer
 *                 example: 2
 *               dia_semana:
 *                 type: integer
 *                 example: 1
 *               hora_inicio:
 *                 type: string
 *                 example: "08:00"
 *               hora_fin:
 *                 type: string
 *                 example: "12:00"
 *               frecuencia:
 *                 type: string
 *                 example: "Semanal"
 *               notas:
 *                 type: string
 *                 example: "Horario de recolección de residuos orgánicos"
 *     responses:
 *       201:
 *         description: Horario creado exitosamente
 *       400:
 *         description: Error de validación en los parámetros
 *       500:
 *         description: Error interno del servidor
 */
calendarioRouter.post('/insert', verifyToken, crearHorario);

/**
 * @swagger
 * /api/calendario/obtenerCalendario:
 *   get:
 *     summary: Obtener todo el calendario || público
 *     description: Devuelve todos los horarios registrados en el calendario, con información de rutas y zonas asociadas.
 *     tags: [Calendario]
 *     responses:
 *       200:
 *         description: Calendario obtenido exitosamente
 *       500:
 *         description: Error interno del servidor
 */
calendarioRouter.get('/obtenerCalendario', obtenerCalendarioRecoleccion);

/**
 * @swagger
 * /api/calendario/update/{id}:
 *   put:
 *     summary: Actualizar un horario || Admin
 *     description: Modifica los datos de un horario específico.
 *     tags: [Calendario]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hora_inicio:
 *                 type: string
 *                 example: "09:00"
 *               hora_fin:
 *                 type: string
 *                 example: "13:00"
 *               frecuencia:
 *                 type: string
 *                 example: "Quincenal"
 *               notas:
 *                 type: string
 *                 example: "Actualización de horario por feriado"
 *     responses:
 *       200:
 *         description: Horario actualizado exitosamente
 *       400:
 *         description: Error de validación en los parámetros
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
calendarioRouter.put('/update/:id', verifyToken, updateHorario);

/**
 * @swagger
 * /api/calendario/delete/{id}:
 *   delete:
 *     summary: Eliminar un horario || Admin
 *     description: Elimina un horario en base a su ID.
 *     tags: [Calendario]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario eliminado exitosamente
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
calendarioRouter.delete('/delete/:id', verifyToken, deleteHorario);

/**
 * @swagger
 * /api/app/calendario/dias:
 *   get:
 *     summary: Obtener calendario por días del mes
 *     description: Devuelve todas las fechas de un mes específico organizadas por días de la semana según la configuración del calendario de recolección.
 *     tags: [App]
 *     security:
 *       - bearerAuth: []   # JWT requerido para aplicación móvil
 *     parameters:
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         required: true
 *         description: Mes del año (1-12)
 *         example: 9
 *       - in: query
 *         name: anio
 *         schema:
 *           type: integer
 *           minimum: 1900
 *         required: true
 *         description: Año (mayor o igual a 1900)
 *         example: 2025
 *     responses:
 *       200:
 *         description: Calendario por días obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dia_semana:
 *                         type: integer
 *                         description: Día de la semana (1=Lunes, ..., 7=Domingo)
 *                         example: 1
 *                       nombre_mes:
 *                         type: string
 *                         description: Nombre del mes en español
 *                         example: "Septiembre"
 *                       nombre_dia:
 *                         type: string
 *                         description: Nombre del día de la semana en español
 *                         example: "Lunes"
 *                       fechas:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: date
 *                         description: Fechas del mes que corresponden a ese día de la semana
 *                         example: ["2025-09-01", "2025-09-08", "2025-09-15", "2025-09-22", "2025-09-29"]
 *                 error:
 *                   type: string
 *       400:
 *         description: Error de validación en los parámetros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 parametros_requeridos:
 *                   summary: Parámetros faltantes
 *                   value:
 *                     error: "Los parámetros 'mes' y 'anio' son requeridos"
 *                 mes_invalido:
 *                   summary: Mes fuera de rango
 *                   value:
 *                     error: "El mes debe estar entre 1 y 12"
 *                 anio_invalido:
 *                   summary: Año inválido
 *                   value:
 *                     error: "El año debe ser mayor o igual a 1900"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
calendarioRouterApp.get('/dias', verifyTokenApp, getCalendarioPorDias);

/**
 * @swagger
 * /api/app/calendario/informacion/{fecha}:
 *   get:
 *     summary: Obtener información del calendario por fecha
 *     description: Devuelve la información del calendario para un día específico basado en la fecha proporcionada en formato YYYY-MM-DD.
 *     tags: [App]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         schema:
 *           type: string
 *           pattern: ^\d{4}-\d{2}-\d{2}$
 *         required: true
 *         description: Fecha en formato YYYY-MM-DD (ej. 2025-09-16)
 *         example: "2025-09-16"
 *     responses:
 *       200:
 *         description: Información del calendario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     dia_semana:
 *                       type: integer
 *                       description: Día de la semana (1=Lunes, ..., 7=Domingo)
 *                       example: 1
 *                     hora_inicio:
 *                       type: string
 *                       format: time
 *                       description: Hora de inicio de recolección
 *                       example: "08:00:00"
 *                     hora_fin:
 *                       type: string
 *                       format: time
 *                       description: Hora de fin de recolección
 *                       example: "12:00:00"
 *                     frecuencia:
 *                       type: string
 *                       description: Frecuencia de recolección
 *                       example: "Semanal"
 *                     notas:
 *                       type: string
 *                       description: Notas adicionales
 *                       example: "Recolección de residuos orgánicos"
 *                     rutas:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: ID de la ruta
 *                           example: 1
 *                         nombre:
 *                           type: string
 *                           description: Nombre de la ruta
 *                           example: "Ruta Centro"
 *                 fecha:
 *                   type: string
 *                   format: date
 *                   description: Fecha completa procesada
 *                   example: "2025-09-16"
 *                 diaSemana:
 *                   type: integer
 *                   description: Número del día de la semana calculado
 *                   example: 2
 *       400:
 *         description: Error de validación en la fecha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 fecha_requerida:
 *                   summary: Fecha faltante
 *                   value:
 *                     error: "El parámetro 'fecha' es obligatorio"
 *                 formato_invalido:
 *                   summary: Formato de fecha incorrecto
 *                   value:
 *                     error: "La fecha debe estar en formato YYYY-MM-DD"
 *                 fecha_invalida:
 *                   summary: Fecha no válida
 *                   value:
 *                     error: "Fecha inválida"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
calendarioRouterApp.get('/informacion/:fecha', getInformacionCalendario);

export default calendarioRouter;
export { calendarioRouterApp };
