import express from "express";
import { body, param, query, validationResult } from "express-validator";
import { obtenerCalendario,
  insertarHorario,
  calendariorecoleccion,
actualizarHorario,
eliminarHorario,
obtenerCalendarioPorDias, obtenerInformacionCalendario
} from "../services/calendario.service.js"; 



// Middleware de validación
const calendarioValidation= [
  query("zona")
    .notEmpty()
    .withMessage("El parámetro 'zona' es obligatorio")
    .isString()
    .withMessage("La zona debe ser texto válido"),

  query("fecha")
   .notEmpty()
   .withMessage("El parámetro 'fecha' es obligatorio")
   .matches(/^\d{4}-\d{2}-\d{2}$/)
   .withMessage("La fecha debe estar en formato válido YYYY-MM-DD"),
];

const calendarioValidationPorDias = [
  param("mes")
    .notEmpty()
    .withMessage("El parámetro 'mes' es obligatorio")
    .isInt({ min: 1, max: 12 })
    .withMessage("El mes debe estar entre 1 y 12"),
  param("anio")
    .notEmpty()
    .withMessage("El parámetro 'anio' es obligatorio")
    .isInt({ min: 1900 })
    .withMessage("El año debe ser mayor o igual a 1900"),
];

export const getCalendario = [
  ...calendarioValidation, // validaciones
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
     
      const { zona, fecha } = req.query;
      const diaSemana = new Date(fecha).getDay();
      console.log("diaSemana:", diaSemana);
      //const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      //const diaSemana = dias[new Date(fecha).getDay()];

      const data = await obtenerCalendario(zona, diaSemana);

      res.json({
        message: "Calendario obtenido exitosamente",
        data,
      });

    } catch (error) {
      console.error("Error al obtener el calendario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
];

export const getCalendarioPorDias = [
  async (req, res) => {
    try {
      const { mes, anio } = req.query;
      if (mes > 12 || mes < 1) {
        return res.status(400).json({ 
          error: "El mes debe estar entre 1 y 12" 
        });
      }
      if (anio < 1900) {
        return res.status(400).json({ 
          error: "El año debe ser mayor o igual a 1900" 
        });
      }
      if (!mes || !anio) {
        return res.status(400).json({ 
          error: "Los parámetros 'mes' y 'anio' son requeridos" 
        });
      }
      const calendario = await obtenerCalendarioPorDias();
      
      const fechasPorDia = calendario.map(cal => {
        let diaSemanaJS;
        if (cal.dia_semana === 7) {
          diaSemanaJS = 0; 
        } else {
          diaSemanaJS = cal.dia_semana; 
        }
        
        const fechas = [];
        const date = new Date(parseInt(anio), parseInt(mes) - 1, 1); 
        
        while (date.getMonth() === parseInt(mes) - 1) {
          if (date.getDay() === diaSemanaJS) {
            fechas.push(new Date(date));
          }
          date.setDate(date.getDate() + 1);
        }
        
        return {
          dia_semana: cal.dia_semana,
          nombre_mes: getNombreMes(parseInt(mes)),
          nombre_dia: getNombreDia(cal.dia_semana),
          fechas: fechas.map(f => f.toISOString().split('T')[0])
        };
      });

      res.json({
        data: fechasPorDia
      });
    } catch (error) {
      console.error("Error al obtener el calendario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
    }
]

const getNombreDia = (diaSemana) => {
  const nombres = {
    1: 'Lunes',
    2: 'Martes', 
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo'
  };
  return nombres[diaSemana] || 'Desconocido';
};

const getNombreMes = (mes) => {
  const nombres = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre'
  };
  return nombres[mes] || 'Desconocido';
};

export const getInformacionCalendario = [
  async (req, res) => {
    try {
      const { fecha } = req.params;
      
      if (!fecha) {
        return res.status(400).json({ 
          error: "El parámetro 'fecha' es obligatorio" 
        });
      }
      
      const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!fechaRegex.test(fecha)) {
        return res.status(400).json({ 
          error: "La fecha debe estar en formato YYYY-MM-DD" 
        });
      }
      
      const [year, month, day] = fecha.split('-');
      const fechaCompleta = `${year}-${month}-${day}`;
      
      const dateObj = new Date(fechaCompleta);
      
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ 
          error: "Fecha inválida" 
        });
      }
      
      let diaSemana = dateObj.getDay();
      if (diaSemana === 0) {
        diaSemana = 7;
      }
      
      const calendario = await obtenerInformacionCalendario(diaSemana);

      if (calendario.length === 0) {
        return res.status(400).json({ 
          error: "No se encontro información para el día de la semana especificado" 
        });
      }

      res.json({
        data: calendario,
        fecha: fechaCompleta,
        diaSemana: diaSemana
      });
    } catch (error) {
      console.error("Error al obtener la información del calendario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
];

const horarioValidation = [
  body("ruta_id")
    .notEmpty().withMessage("El campo 'ruta_id' es obligatorio")
    .isInt().withMessage("ruta_id debe ser un número entero"),
  body("dia_semana")
    .notEmpty().withMessage("El campo 'dia_semana' es obligatorio")
    .isInt({ min: 0, max: 6 }).withMessage("dia_semana debe estar entre 0 (Domingo) y 6 (Sábado)"),
  body("hora_inicio")
    .notEmpty().withMessage("hora_inicio es obligatorio")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("hora_inicio debe estar en formato HH:mm"),
  body("hora_fin")
    .notEmpty().withMessage("hora_fin es obligatorio")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("hora_fin debe estar en formato HH:mm"),
  body("frecuencia").optional().isString(),
  body("notas").optional().isString(),
];

export const crearHorario = [
  ...horarioValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { ruta_id, dia_semana, hora_inicio, hora_fin, frecuencia, notas } = req.body;

      const nuevoHorario = await insertarHorario({
        ruta_id,
        dia_semana,
        hora_inicio,
        hora_fin,
        frecuencia,
        notas
      });

      res.status(201).json({
        message: "Horario creado exitosamente",
        data: nuevoHorario,
      });

    } catch (error) {
      console.error("Error al crear horario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
];

export const obtenerCalendarioRecoleccion= async(req,res)=>{
  try {
      const horarios = await calendariorecoleccion(req, res);
      res.json({
        message: "Calendario obtenido exitosamente",
        data: horarios,
      });

  }catch (error) {
      console.error("Error al obtener el calendario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }

}


// Validación para actualizar
const actualizarHorarioValidation = [
  param("id").isInt().withMessage("El id debe ser un número entero"),
  body("hora_inicio").optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("hora_inicio debe estar en formato HH:mm"),
  body("hora_fin").optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("hora_fin debe estar en formato HH:mm"),
  body("frecuencia").optional().isString(),
  body("notas").optional().isString(),
];

export const updateHorario = [
  ...actualizarHorarioValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { hora_inicio, hora_fin, frecuencia, notas } = req.body;

      const horarioActualizado = await actualizarHorario(parseInt(id), {
        hora_inicio,
        hora_fin,
        frecuencia,
        notas,
      });

      res.json({
        message: "Horario actualizado exitosamente",
        data: horarioActualizado,
      });

    } catch (error) {
      console.error("Error al actualizar horario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
];

// Eliminar un horario
export const deleteHorario = [
  param("id").isInt().withMessage("El id debe ser un número entero"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const horarioEliminado = await eliminarHorario(parseInt(id));

      res.json({
        message: "Horario eliminado exitosamente",
        data: horarioEliminado,
      });

    } catch (error) {
      console.error("Error al eliminar horario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
];
