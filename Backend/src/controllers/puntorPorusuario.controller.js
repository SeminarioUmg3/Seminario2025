import { obtenerMisPuntos ,obtenerPuntosPorCategoria} from '../services/puntosPorUsuario.service.js';

const obtenerMisPuntosController = async (req, res) => {
   try {
    const { idUsuario } = req.params;
    
    // Validar que el idUsuario sea un número
    if (!idUsuario || isNaN(parseInt(idUsuario))) {
        return res.status(400).json({ 
            success: false,
            error: 'ID de usuario inválido' 
        });
    }

    const result = await obtenerMisPuntos(idUsuario);
    
    // Verificar si se encontraron puntos
    if (!result || !result.registros || result.registros.length === 0) {
        return res.status(200).json({
            success: true,
            data: {
                usuario: result.usuario,
                registros: [],
                totalPuntos: 0,
                cantidadRegistros: 0
            },
            message: 'No se encontraron puntos para este usuario'
        });
    }

    return res.status(200).json({
        success: true,
        data: result
    });
   } catch (error) {
    console.error('Error en obtenerMisPuntosController:', error);
    return res.status(500).json({ 
        success: false,
        error: 'Error al obtener los puntos del usuario',
        details: error.message 
    });
   }
}

const obtenerPuntosPorCategoriaController = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        
    // Validar que el idUsuario sea un número
    if (!idUsuario || isNaN(parseInt(idUsuario))) {
        return res.status(400).json({ 
            success: false,
            error: 'ID de usuario inválido' 
        });
    }
        
        const result = await obtenerPuntosPorCategoria(idUsuario);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error('Error en obtenerPuntosPorCategoriaController:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Error al obtener los puntos por categoría del usuario',
            details: error.message 
        });
    }
}

export { obtenerMisPuntosController, obtenerPuntosPorCategoriaController };