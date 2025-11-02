import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();

export async function rankingZonas(userId = null, fechaInicio = null, fechaFin = null) {
    try {
        // Si no se proporcionan fechas, usar el mes actual por defecto
        let filtroFecha = {};
        if (!fechaInicio && !fechaFin) {
            const ahora = new Date();
            const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
            const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);
            
            filtroFecha = {
                fecha_registro: {
                    gte: inicioMes,
                    lte: finMes
                }
            };
        } else if (fechaInicio || fechaFin) {
            filtroFecha = {
                fecha_registro: {}
            };
            if (fechaInicio) {
                filtroFecha.fecha_registro.gte = new Date(fechaInicio);
            }
            if (fechaFin) {
                filtroFecha.fecha_registro.lte = new Date(fechaFin);
            }
        }

        // Primero obtenemos TODAS las zonas
        const todasLasZonas = await prisma.zonas.findMany({
            select: {
                id: true,
                nombre: true
            },
            orderBy: {
                nombre: 'asc'
            }
        });

        // Obtenemos todos los usuarios con sus zonas y puntos (filtrados por fecha)
        const usuariosConPuntos = await prisma.usuarios.findMany({
            where: {
                zona_id: { not: null }, // Solo usuarios con zona asignada
                estado: 'ACTIVO' // Solo usuarios activos
            },
            include: {
                zonas: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                puntosusuario: {
                    where: filtroFecha, // Aplicar filtro de fecha
                    select: {
                        total_puntos: true,
                        fecha_registro: true
                    }
                }
            }
        });

        // Agrupamos por zona y sumamos los puntos de todos los usuarios
        const puntosPorZona = {};
        
        usuariosConPuntos.forEach(usuario => {
            if (usuario.zonas) {
                const zonaId = usuario.zonas.id;
                const zonaNombre = usuario.zonas.nombre;
                
                // Sumamos todos los puntos del usuario
                const puntosUsuario = usuario.puntosusuario.reduce((sum, punto) => {
                    return sum + (punto.total_puntos || 0);
                }, 0);
                
                if (!puntosPorZona[zonaId]) {
                    puntosPorZona[zonaId] = {
                        zona_id: zonaId,
                        zona: zonaNombre,
                        total_puntos: 0,
                        cantidad_usuarios: 0
                    };
                }
                
                puntosPorZona[zonaId].total_puntos += puntosUsuario;
                puntosPorZona[zonaId].cantidad_usuarios += 1;
            }
        });

        // Si se proporciona userId, marcamos la zona del usuario
        let userZonaId = null;
        if (userId) {
            const user = await prisma.usuarios.findUnique({
                where: { id: userId },
                select: { zona_id: true }
            });
            userZonaId = user?.zona_id || null;
        }

        // Creamos el ranking incluyendo TODAS las zonas
        const ranking = todasLasZonas.map(zona => {
            const zonaConPuntos = puntosPorZona[zona.id];
            return {
                zona_id: zona.id,
                zona: zona.nombre,
                total_puntos: zonaConPuntos ? zonaConPuntos.total_puntos : 0,
                cantidad_usuarios: zonaConPuntos ? zonaConPuntos.cantidad_usuarios : 0,
                is_user_zona: userId ? zona.id === userZonaId : false
            };
        });

        // Ordenamos por puntos descendente (las zonas sin puntos aparecerán al final)
        return ranking.sort((a, b) => b.total_puntos - a.total_puntos);

    } catch (error) {
        console.error('Error en rankingZonas:', error);
        throw error;
    }
}