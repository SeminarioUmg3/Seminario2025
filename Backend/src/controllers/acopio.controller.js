import { obtenerAcopio, obtenerListadoAcopioCoordenadas,insertarAcopio, editarAcopio,eliminarAcopio  } from '../services/acopio.service.js';
import { validationResult } from 'express-validator';

export const getAcopio = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const acopio = await obtenerAcopio();
        res.json({
            message: "Acopio obtenido exitosamente",
            data: acopio
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el acopio",
            error: error.message
        });
    }
};

export const getAcopioCoordenadas = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const acopio = await obtenerListadoAcopioCoordenadas();
        res.json({
            acopio
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el acopio",
            error: error.message
        });
    }
};


// Crear un nuevo acopio
export const createAcopio = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevoAcopio = await insertarAcopio(req.body);
        res.status(201).json({
            message: "Acopio creado exitosamente",
            data: nuevoAcopio
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el acopio",
            error: error.message
        });
    }
};

// Editar un acopio existente
export const updateAcopio = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
        const acopioActualizado = await editarAcopio(Number(id), req.body);
        res.json({
            message: "Acopio actualizado exitosamente",
            data: acopioActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el acopio",
            error: error.message
        });
    }
};

// Eliminar un acopio existente
export const deleteAcopio = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
        await eliminarAcopio(Number(id));
        res.json({
            message: "Acopio eliminado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el acopio",
            error: error.message
        });
    }
};