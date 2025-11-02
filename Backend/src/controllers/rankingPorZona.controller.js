import { PrismaClient } from '../generated/prisma/client.js';
import { rankingPorZona } from '../services/rankingPorZona.service.js';
const prisma = new PrismaClient();
const getRankingByZone = async (req, res) => {
    try {
        const ranking = await rankingPorZona();
        res.json({
            message: "Ranking obtenido exitosamente",
            data: ranking
        });
    } catch (err) {
      console.error("Error en /ranking:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  export {
    getRankingByZone
  }
