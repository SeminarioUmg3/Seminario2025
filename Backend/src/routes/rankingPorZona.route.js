import { getRankingByZone } from '../controllers/rankingPorZona.controller.js';
import { verifyToken } from '../middlewares/middleware.js';
import express from 'express';
const routerRankingPorZona = express.Router();

/**
 * @swagger
 * /api/ranking:
 *   get:
 *     summary: Obtener ranking por zona (más residuos)
 *     description: Retorna el ranking de zonas (colonias) ordenado por la mayor cantidad de residuos registrados, con desglose por tipo de residuo.
 *     tags:
 *       - Ranking
 *     responses:
 *       200:
 *         description: Ranking obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Número de zonas en el ranking
 *                 data:
 *                   type: array
 *                   description: Lista de zonas con su información de ranking
 *                   items:
 *                     type: object
 *                     properties:
 *                       zonaId:
 *                         type: integer
 *                       zonaNombre:
 *                         type: string
 *                       zonaCodigo:
 *                         type: string
 *                       totalResiduos:
 *                         type: integer
 *                         description: Total de residuos (conteo de eventos) en la zona
 *                       residuosRecolectados:
 *                         type: array
 *                         description: Detalle por tipo de residuo en la zona
 *                         items:
 *                           type: object
 *                           properties:
 *                             tipoResiduoId:
 *                               type: integer
 *                               nullable: true
 *                               description: Puede ser null si el evento no especifica tipo
 *                             tipoNombre:
 *                               type: string
 *                             total:
 *                               type: integer
 *       500:
 *         description: Error interno del servidor
 * 
 * 
 */
routerRankingPorZona.get('/', verifyToken, getRankingByZone);

export {
    routerRankingPorZona
}