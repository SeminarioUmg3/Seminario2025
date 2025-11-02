import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

export const obtenerMetricasDashboard = async (fechaInicio, fechaFin) => {
  try {
    const fechaFilter = {
      gte: new Date(fechaInicio),
      lte: new Date(fechaFin),
    };

  // usuarios
    const totalUsuarios = await prisma.usuarios.count({
      where: { fecha_registro: fechaFilter },
    });

    const usuariosActivos = await prisma.usuarios.count({
      where: { estado: "ACTIVO", fecha_registro: fechaFilter },
    });

    // puntos por zona
    const usuariosConPuntos = await prisma.usuarios.findMany({
      where: {
        zona_id: { not: null },
        estado: "ACTIVO",
      },
      include: {
        zonas: { select: { id: true, nombre: true } },
        puntosusuario: {
          where: { fecha_registro: fechaFilter },
          select: { total_puntos: true },
        },
      },
    });

    const puntosPorZonaMap = {};
    for (const usuario of usuariosConPuntos) {
      if (usuario.zonas) {
        const zonaId = usuario.zonas.id;
        const zonaNombre = usuario.zonas.nombre;
        const puntosUsuario = usuario.puntosusuario.reduce(
          (sum, p) => sum + (p.total_puntos || 0),
          0
        );
        if (!puntosPorZonaMap[zonaId]) {
          puntosPorZonaMap[zonaId] = {
            zona_id: zonaId,
            nombre: zonaNombre,
            total_puntos: 0,
          };
        }
        puntosPorZonaMap[zonaId].total_puntos += puntosUsuario;
      }
    }

    const puntosPorZona = Object.values(puntosPorZonaMap).filter(
      (z) => z.total_puntos > 0
    );

    
    // puntos por tipo de residuo
    const CATEGORIAS = {
      RECICLABLE: "RECICLABLE",
      NO_RECICLABLE: "NO_RECICLABLE",
      ORGANICO: "ORGANICO",
      INCIERTO: "INCIERTO",
    };
    const categoriasValidas = Object.values(CATEGORIAS);

    const puntosPorTipo = await prisma.puntosusuario.findMany({
      where: {
        fecha_registro: fechaFilter,
        tiporesiduo: {
          categoria: {
            in: categoriasValidas, 
          },
        },
      },
      select: {
        total_puntos: true,
        tiporesiduo: {
          select: { categoria: true },
        },
      },
    });

    // Agrupamos los puntos por categoría
    const categoriasMap = {};
    for (const punto of puntosPorTipo) {
      const categoria = punto.tiporesiduo?.categoria;
      if (!categoria) continue;
      if (!categoriasMap[categoria]) categoriasMap[categoria] = 0;
      categoriasMap[categoria] += punto.total_puntos || 0;
    }

    // Aseguramos que todas las categorías válidas aparezcan (aunque sea con 0)
    const eventosPorCategoriaArray = categoriasValidas.map((categoria) => ({
      categoria,
      cantidad: categoriasMap[categoria] || 0,
    }));

 
    const totalNotificaciones = await prisma.notificaciones.count({
      where: { fecha_registro: fechaFilter },
    });

    const notificaciones = {
      enviadas: totalNotificaciones || 0,
    };

    
    const centrosAcopio = await prisma.centrosacopio.count({
      where: { fecha_registro: fechaFilter },
    });

    const rutas = await prisma.rutas.count({
      where: { fecha_registro: fechaFilter },
    });

    return {
      usuarios: {
        total: totalUsuarios || 0,
        activos: usuariosActivos || 0,
        inactivos: (totalUsuarios - usuariosActivos) || 0,
      },
      zonas: puntosPorZona || [],
      tipos_residuos: eventosPorCategoriaArray || [],
      notificaciones,
      centros_acopio: centrosAcopio || 0,
      rutas: rutas || 0,
    };
  } catch (error) {
    console.error("Error al obtener métricas del dashboard:", error);
    throw new Error("Error al obtener métricas del dashboard");
  }
};
