import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

export const listarRutasPorZona = async () => {
    try {
        const zonas = await prisma.zonas.findMany();
        const rutas = await prisma.rutas.findMany({
            where: {
                zona_id: {
                    in: zonas.map(zona => zona.id)
                }, 
                activo: true
            }
        });

        const zonasConRutas = zonas.map(zona => {
            const rutasDeZona = rutas.filter(ruta => ruta.zona_id === zona.id);
            if (rutasDeZona.length > 0) {
                return {
                    ...zona,
                    rutas: rutasDeZona
                };
            }
            return null;
        }).filter(Boolean);

       
        return zonasConRutas;

    } catch (error) {
        if (error.status) {
            throw error;
        }
        throw { status: 500, message: 'Error al obtener las rutas por zona' };
    }

}

export const crearRuta = async ({ nombre, zona_id, inicio_latitud, inicio_longitud, fin_latitud, fin_longitud, puntos_intermedios }) => {
    try {
        const nuevaRuta = await prisma.rutas.create({
            data: { 
                nombre,
                zona_id,
                activo: true,
                inicio_latitud: inicio_latitud ? parseFloat(inicio_latitud) : null,
                inicio_longitud: inicio_longitud ? parseFloat(inicio_longitud) : null,
                fin_latitud: fin_latitud ? parseFloat(fin_latitud) : null,
                fin_longitud: fin_longitud ? parseFloat(fin_longitud) : null,
                puntos_intermedios: puntos_intermedios ? puntos_intermedios : null
            }
        });
        return nuevaRuta;
    } catch (error) {
        console.error("Error al crear la ruta:", error);
        throw error;
    }
}

export const actualizarRuta = async ({ id, nombre, zona_id, activo, inicio_latitud, inicio_longitud, fin_latitud, fin_longitud, puntos_intermedios }) => {
    try {
        if(activo === "false" || activo === false) activo = false;
        else activo = true;

        const ruta = await prisma.rutas.update({
            where: { id: parseInt(id) },
            data: { 
                nombre,
                zona_id: parseInt(zona_id),
                activo: Boolean(activo),
                inicio_latitud: inicio_latitud ? parseFloat(inicio_latitud) : null,
                inicio_longitud: inicio_longitud ? parseFloat(inicio_longitud) : null,
                fin_latitud: fin_latitud ? parseFloat(fin_latitud) : null,
                fin_longitud: fin_longitud ? parseFloat(fin_longitud) : null,
                puntos_intermedios: puntos_intermedios ? puntos_intermedios : null
            }
        });
        return ruta;
    } catch (error) {
        console.error("Error al actualizar la ruta:", error);
        throw error;
    }
}
export const eliminarRuta = async ({ id }) => {
    try {
        const ruta = await prisma.rutas.delete({
            where: { id }
        });
        return ruta;
    } catch (error) {
        console.error("Error al eliminar la ruta:", error);
        throw error;
    }
}
