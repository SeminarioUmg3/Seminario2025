import { 
    crearNotificacionServicio, 
    obtenerTodasLasNotificacionesServicio,
    obtenerNotificacionPorIdServicio,
    actualizarNotificacionServicio,
    eliminarNotificacionServicio
} from '../services/notificaiones.service.js';
import { validationResult } from 'express-validator';

// Crear notificación
const crearNotificacion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { titulo, cuerpo, tipo } = req.body;
        const creado_por = req.userId; // Obtener del token
        
        const resultado = await crearNotificacionServicio({
            titulo,
            cuerpo,
            tipo,
            creado_por
        });
        
        res.status(201).json(resultado);
    } catch (error) {
        console.error('Error en controlador crearNotificacion:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las notificaciones
const obtenerTodasLasNotificaciones = async (req, res) => {
    try {
        const resultado = await obtenerTodasLasNotificacionesServicio();
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error en controlador obtenerTodasLasNotificaciones:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener notificación por ID
const obtenerNotificacionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await obtenerNotificacionPorIdServicio(id);
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error en controlador obtenerNotificacionPorId:', error);
        if (error.message === 'Notificación no encontrada') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Actualizar notificación
const actualizarNotificacion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { id } = req.params;
        const { titulo, cuerpo, tipo } = req.body;
        
        const resultado = await actualizarNotificacionServicio(id, {
            titulo,
            cuerpo,
            tipo
        });
        
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error en controlador actualizarNotificacion:', error);
        if (error.message === 'Notificación no encontrada') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Eliminar notificación
const eliminarNotificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await eliminarNotificacionServicio(id);
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error en controlador eliminarNotificacion:', error);
        if (error.message === 'Notificación no encontrada') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

export {
    crearNotificacion,
    obtenerTodasLasNotificaciones,
    obtenerNotificacionPorId,
    actualizarNotificacion,
    eliminarNotificacion
}