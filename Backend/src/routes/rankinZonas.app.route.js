import { getRankingZonas } from '../controllers/rankinZona.controller.js';
import { Router } from 'express';
import { verifyTokenApp } from '../middlewares/middleware.app.js';
const routerRankinZonasApp = Router();
/**
 * @swagger
 * /api/app/ranking-zonas:
 *   get:
 *     summary: Obtener ranking de zonas por puntos
 *     description: Retorna un listado de zonas ordenadas por participación (puntos acumulados).
 *     tags:
 *       - App
 *     responses:
 *       200:
 *         description: Lista de zonas con su puntaje total
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   zona_id:
 *                     type: integer
 *                     example: 1
 *                   zona:
 *                     type: string
 *                     example: Zona Norte
 *                   total_puntos:
 *                     type: integer
 *                     example: 450
 */
routerRankinZonasApp.get('/', verifyTokenApp, getRankingZonas);
export { routerRankinZonasApp };