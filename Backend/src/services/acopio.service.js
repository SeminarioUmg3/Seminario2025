import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

export const obtenerAcopio = async () => {
    try {
        const acopio = await prisma.centrosacopio.findMany({
            select: {
                id: true,
                tipo: true,
                nombre: true,
                latitud: true,
                longitud: true,
                direccion: true,
                zona_id: true,
                horario: true,
                zonas: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true,
                    },
                },
            },
            orderBy: {
                id: 'desc'
            }

        });
        return acopio;
    } catch (error) {
        console.error("Error al obtener el acopio:", error);
        throw error;
    }
};

export const obtenerListadoAcopioCoordenadas = async () => {
    try {
        const acopio = await prisma.centrosacopio.findMany({
            select: {
                id: true,
                nombre: true,
                latitud: true,
                longitud: true,
            }
        });

        if (acopio.length === 0) {
            return {
                status: 404,
                message: "No se encontraron acopios",
            };
        }

        return acopio;
    } catch (error) {
        console.error("Error al obtener el listado de acopio coordenadas:", error);
        throw error;
    }
};



// Insertar un nuevo acopio
export const insertarAcopio = async (data) => {
    try {
        const nuevoAcopio = await prisma.centrosacopio.create({
            data: {
                tipo: data.tipo,
                nombre: data.nombre,
                latitud: data.latitud,
                longitud: data.longitud,
                direccion: data.direccion,
                zona_id: data.zona_id,
                horario: data.horario,
            },
        });
        return nuevoAcopio;
    } catch (error) {
        console.error("Error al insertar acopio:", error);
        throw error;
    }
};

// Editar un acopio existente
export const editarAcopio = async (id, data) => {
    try {
        const acopioActualizado = await prisma.centrosacopio.update({
            where: { id: id },
            data: {
                tipo: data.tipo,
                nombre: data.nombre,
                latitud: data.latitud,
                longitud: data.longitud,
                direccion: data.direccion,
                zona_id: data.zona_id,
                horario: data.horario,
            },
        });
        return acopioActualizado;
    } catch (error) {
        console.error("Error al editar acopio:", error);
        throw error;
    }
};


// Eliminar un acopio
export const eliminarAcopio = async (id) => {
    try {
        await prisma.centrosacopio.delete({
            where: { id: id },
        });
        return true;
    } catch (error) {
        console.error("Error al eliminar acopio:", error);
        throw error;
    }
};