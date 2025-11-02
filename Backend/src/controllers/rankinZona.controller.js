import { rankingZonas } from '../services/rankinZonas.service.js';
export async function getRankingZonas(req, res) {
    try {
         // si el usuario esta autenticado, pasamos su id para marcar su zona
        const userId =  req.userId;
        
        // Obtener parámetros de fecha de la query string
        const { fecha_inicio, fecha_fin } = req.query;
        
        const ranking = await rankingZonas(userId, fecha_inicio, fecha_fin);
        res.status(200).json(ranking);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el ranking de zonas' });
    }
}