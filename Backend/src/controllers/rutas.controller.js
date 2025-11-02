import { validationResult } from 'express-validator';
import { listarRutasPorZona , crearRuta , actualizarRuta , eliminarRuta } from '../services/rutas.service.js';

export const getRutas = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const rutas = await listarRutasPorZona();
        return res.status(200).json({
            rutas
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las rutas",
            error: error.message
        });
    }
}
export const crearRutas = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { nombre, zona_id, inicio_latitud, inicio_longitud, fin_latitud, fin_longitud, puntos_intermedios } = req.body;
        const ruta = await crearRuta({ nombre, zona_id, inicio_latitud, inicio_longitud, fin_latitud, fin_longitud, puntos_intermedios });
        res.status(201).json({ message: "Ruta creada exitosamente", ruta });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la ruta", error: error.message });
    }
}


export const actualizarRutas = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { id, nombre, zona_id, activo, inicio_latitud, inicio_longitud, fin_latitud, fin_longitud, puntos_intermedios } = req.body;
        const ruta = await actualizarRuta({ id, nombre, zona_id, activo, inicio_latitud, inicio_longitud, fin_latitud, fin_longitud, puntos_intermedios });
        res.status(200).json({ message: "Ruta actualizada exitosamente", ruta });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la ruta", error: error.message });
    }
}
export const eliminarRutas = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.body;
        const ruta = await eliminarRuta({ id });
        res.status(200).json({ message: "Ruta eliminada exitosamente", ruta });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la ruta", error: error.message });
    }
}