import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
const app = express();
import {router} from './src/routes/route.js';
import calendarioRouter from "./src/routes/calendario.route.js";
import { calendarioRouterApp } from "./src/routes/calendario.route.js";
import acopioRouter from "./src/routes/acopio.route.js";
import {routerRankingPorZona } from "./src/routes/rankingPorZona.route.js";
import { routerRankinZonas } from "./src/routes/rankinZonas.route.js";
import { initializeDatabase} from './src/config/db.js';
import { specs, swaggerUi } from './src/config/swagger.config.js';
import { routerAuth, users, roles } from "./src/routes/auth.route.js";
import { routerNotificaciones } from "./src/routes/notificaciones.route.js";

import { routerAuthApp } from "./src/routes/auth.app.route.js";
import { routerRankinZonasApp } from "./src/routes/rankinZonas.app.route.js";
import { routerRankingPorZonaApp } from "./src/routes/rankingPorZona.app.route.js";
import { routerNotificacionesApp } from "./src/routes/notificaciones.app.route.js";
 
import { rutasRouter } from "./src/routes/rutas.route.js";
import { zonasRouter } from "./src/routes/zonas.route.js";
import  dashboardRouter from './src/routes/dashboard.route.js';
import clasificacionRouter from './src/routes/clasificacion.route.js';
import routerPuntosPorUsuario from "./src/routes/puntosPorUsuaro.route.js";
app.use(cors({

  origin: '*',
  methods: ['GET', 'POST','PUT','DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key' , 'authorization']
}));
app.use(express.json());
const port = process.env.PORT || 8000;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', router);
app.use("/api/calendario", calendarioRouter);
app.use("/api/acopio", acopioRouter);
app.use("/api/ranking", routerRankingPorZona);
app.use("/api/auth", routerAuth);
app.use("/api/usuarios", users);
app.use("/api/roles", roles);
app.use("/api/notificaciones", routerNotificaciones);
app.use("/api/ranking-zonas", routerRankinZonas);
app.use("/api/auth/app", routerAuthApp);
app.use("/api/app/ranking-zonas", routerRankinZonasApp);
app.use("/api/app/notificaciones", routerNotificacionesApp);
app.use("/api/app/ranking", routerRankingPorZonaApp);
app.use("/api/app/calendario", calendarioRouterApp);
app.use("/api/rutas", rutasRouter);
app.use("/api/zonas", zonasRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/clasificacion", clasificacionRouter);
app.use("/api/puntos", routerPuntosPorUsuario);
initializeDatabase()
  .then(() => {
    app.listen(port,  () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error inicializando la base de datos:', error);
    app.listen(port,  () => {
      console.log(`Servidor corriendo (sin DB) en http://localhost:${port}`);
    });
  });