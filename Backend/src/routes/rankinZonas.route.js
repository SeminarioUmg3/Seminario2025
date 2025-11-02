import { getRankingZonas } from '../controllers/rankinZona.controller.js';
import { Router } from 'express';
import { verifyToken } from '../middlewares/middleware.js';
const routerRankinZonas = Router();
/**
 * @swagger
 * /api/ranking-zonas:
 *   get:
 *     summary: Obtener ranking de zonas por puntos reales
 *     description: Retorna un listado de TODAS las zonas ordenadas por puntos reales acumulados. Incluye zonas sin usuarios o sin puntos (aparecerán con 0 puntos). Por defecto muestra solo los puntos del mes actual.
 *     tags:
 *       - Ranking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar puntos (YYYY-MM-DD). Si no se proporciona, usa el inicio del mes actual.
 *         example: "2024-01-01"
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar puntos (YYYY-MM-DD). Si no se proporciona, usa el fin del mes actual.
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Lista de zonas con su puntaje total real y cantidad de usuarios
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
 *                     example: 1250
 *                   cantidad_usuarios:
 *                     type: integer
 *                     example: 15
 *                   is_user_zona:
 *                     type: boolean
 *                     example: true
 */
routerRankinZonas.get('/', verifyToken, getRankingZonas);
export { routerRankinZonas };