import { obtenerZonas, crearZona, actualizarZona, eliminarZona } from "../services/zona.service.js";
import { validationResult } from "express-validator";

export const getZonas = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const zonas = await obtenerZonas();
        res.status(200).json({ zonas });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las zonas", error: error.message });
    }
}

export const crearZonas = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { nombre, codigo } = req.body;
        const zona = await crearZona({ nombre, codigo });
        res.status(201).json({ message: "Zona creada exitosamente", zona });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la zona", error: error.message });
    }
}

export const actualizarZonas = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id, nombre, codigo } = req.body;
        const zona = await actualizarZona({ id, nombre, codigo });
        res.status(200).json({ message: "Zona actualizada exitosamente", zona });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la zona", error: error.message });
    }
}

export const eliminarZonas = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }   
    try {
        const { id } = req.body;
        const zona = await eliminarZona({ id });
        res.status(200).json({ message: "Zona eliminada exitosamente", zona });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la zona", error: error.message });
    }
}