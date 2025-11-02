import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

export const obtenerZonas = async () => {
    try {
        const zonas = await prisma.zonas.findMany();
        return zonas;
    } catch (error) {
        throw error;
    }
}

export const crearZona = async ({ nombre, codigo }) => {
    try {
        const nuevaZona = await prisma.zonas.create({
            data: { nombre, codigo }
        });
        return nuevaZona;
    } catch (error) {
        throw error;
    }
}

export const actualizarZona = async ({ id, nombre, codigo }) => {
    try {
        const zona = await prisma.zonas.update({
            where: { id: parseInt(id) },
            data: { nombre, codigo }
        });
        return zona;
    } catch (error) {
        throw error;
    }
}

export const eliminarZona = async ({ id }) => {
    try {
        const zona = await prisma.zonas.delete({
            where: { id: parseInt(id) }
        });
        return zona;
    } catch (error) {
        throw error;
    }
}