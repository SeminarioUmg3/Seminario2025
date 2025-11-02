import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();



const rankingPorZona = async ()=>{
    try {
        const ranking = await prisma.eventospuntosporzona.groupBy({
            by: ["zona_id", "tipo_residuo_id"],
            _count: { _all: true },
          });
      
          const zonas = await prisma.zonas.findMany({
            select: { id: true, nombre: true, codigo: true },
          });
          const tipos = await prisma.tiporesiduo.findMany({
            select: { id: true, nombre: true },
          });
      
          const zonaMap = new Map(zonas.map(z => [z.id, z]));
          const tipoMap = new Map(tipos.map(t => [t.id, t]));
          const perZona = new Map();
      
          for (const row of ranking) {
            const z = zonaMap.get(row.zona_id);
            if (!z) continue;
      
            const t = row.tipo_residuo_id ? tipoMap.get(row.tipo_residuo_id) : null;
      
            if (!perZona.has(z.id)) {
              perZona.set(z.id, {
                zonaId: z.id,
                zonaNombre: z.nombre,
                zonaCodigo: z.codigo,
                totalResiduos: 0,
                residuosRecolectados: [],
              });
            }
      
            const bucket = perZona.get(z.id);
            bucket.totalResiduos += row._count._all;
            bucket.residuosRecolectados.push({
              tipoResiduoId: t?.id ?? null,
              tipoNombre: t?.nombre ?? "Sin tipo",
              total: row._count._all,
            });
          }
            const result = Array.from(perZona.values()).sort(
            (a, b) => b.totalResiduos - a.totalResiduos
          );

          if(result.length === 0){
            return [];
          }
      
          return { count: result.length, data: result };
    } catch (error) {
        throw error;
    }
}

export {
    rankingPorZona
}