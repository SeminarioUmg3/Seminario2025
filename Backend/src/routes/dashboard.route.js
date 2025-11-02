import { Router } from "express";
import { verifyToken } from "../middlewares/middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener métricas del dashboard con rango de fecha opcional
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de inicio del rango (YYYY-MM-DD)
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de fin del rango (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Métricas obtenidas exitosamente
 *       400:
 *         description: Error en formato de fecha
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
dashboardRouter.get("/", verifyToken, getDashboard);

export default dashboardRouter;
