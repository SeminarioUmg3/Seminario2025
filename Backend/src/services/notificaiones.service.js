import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();

const TIPO_NOTIFICACION = {
    ALERTA: 'ALERTA',
    NOTIFICACION: 'NOTIFICACION',
    INFORMATIVA: 'INFORMATIVA',
    PROMOCIONAL: 'PROMOCIONAL'
}

// Crear notificación
export const crearNotificacionServicio = async (notificacion) => {
    try {
        const notificacionCreada = await prisma.notificaciones.create({
            data: {
                titulo: notificacion.titulo,
                cuerpo: notificacion.cuerpo,
                tipo: notificacion.tipo,
                creado_por: notificacion.creado_por,
                fecha_registro: new Date()
            }
        });

        return {
            message: 'Notificación creada exitosamente',
            data: notificacionCreada
        };
    } catch (error) {
        console.error('Error en crearNotificacionServicio:', error);
        throw error;
    }
};

// Obtener todas las notificaciones
export const obtenerTodasLasNotificacionesServicio = async () => {
    try {
        const notificaciones = await prisma.notificaciones.findMany({
            select: {
                id: true,
                titulo: true,
                cuerpo: true,
                tipo: true,
                fecha_registro: true,
                usuarios: {
                    select: {
                        id: true,
                        nombre_completo: true,
                        nombre_usuario: true
                    }
                }
            },
            orderBy: {
                fecha_registro: 'desc'
            }
        });

        return {
            message: 'Notificaciones obtenidas exitosamente',
            data: notificaciones
        };
    } catch (error) {
        console.error('Error en obtenerTodasLasNotificacionesServicio:', error);
        throw error;
    }
};

// Obtener notificación por ID
export const obtenerNotificacionPorIdServicio = async (id) => {
    try {
        const notificacion = await prisma.notificaciones.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                titulo: true,
                cuerpo: true,
                tipo: true,
                fecha_registro: true,
                usuarios: {
                    select: {
                        id: true,
                        nombre_completo: true,
                        nombre_usuario: true
                    }
                }
            }
        });

        if (!notificacion) {
            throw new Error('Notificación no encontrada');
        }

        return {
            message: 'Notificación obtenida exitosamente',
            data: notificacion
        };
    } catch (error) {
        console.error('Error en obtenerNotificacionPorIdServicio:', error);
        throw error;
    }
};

// Actualizar notificación
export const actualizarNotificacionServicio = async (id, datosActualizacion) => {
    try {
        // Verificar que la notificación existe
        const notificacionExistente = await prisma.notificaciones.findUnique({
            where: { id: parseInt(id) }
        });

        if (!notificacionExistente) {
            throw new Error('Notificación no encontrada');
        }

        const notificacionActualizada = await prisma.notificaciones.update({
            where: { id: parseInt(id) },
            data: {
                titulo: datosActualizacion.titulo,
                cuerpo: datosActualizacion.cuerpo,
                tipo: datosActualizacion.tipo
            },
            select: {
                id: true,
                titulo: true,
                cuerpo: true,
                tipo: true,
                fecha_registro: true,
                usuarios: {
                    select: {
                        id: true,
                        nombre_completo: true,
                        nombre_usuario: true
                    }
                }
            }
        });

        return {
            message: 'Notificación actualizada exitosamente',
            data: notificacionActualizada
        };
    } catch (error) {
        console.error('Error en actualizarNotificacionServicio:', error);
        throw error;
    }
};

// Eliminar notificación
export const eliminarNotificacionServicio = async (id) => {
    try {
        // Verificar que la notificación existe
        const notificacionExistente = await prisma.notificaciones.findUnique({
            where: { id: parseInt(id) }
        });

        if (!notificacionExistente) {
            throw new Error('Notificación no encontrada');
        }

        await prisma.notificaciones.delete({
            where: { id: parseInt(id) }
        });

        return {
            message: 'Notificación eliminada exitosamente'
        };
    } catch (error) {
        console.error('Error en eliminarNotificacionServicio:', error);
        throw error;
    }
};