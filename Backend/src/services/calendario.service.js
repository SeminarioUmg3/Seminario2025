import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();
export const obtenerCalendario = async (zonaNombre, diaSemana) => {
  try {
    const calendario = await prisma.zonas.findMany({
  where: { nombre: zonaNombre },
  select: {
    id: true,
    nombre: true,
    rutas: {
      where: {
        calendariorecoleccion: { some: { dia_semana: diaSemana } } // solo rutas con horarios en el día especificado
      },
      select: {
        id: true,
        calendariorecoleccion: {
          where: { dia_semana: diaSemana },
          select: {
            hora_inicio: true,
            hora_fin: true,
            frecuencia: true
          }
        }
      }
    }
  }
});

    return calendario;
  } catch (error) {
    console.error("Error al obtener calendario:", error);
    throw error;
  }
};

export const obtenerCalendarioPorDias = async () => {
  try {
    const calendario = await prisma.calendariorecoleccion.findMany({
      select: {
        dia_semana: true,
      },
      distinct: ['dia_semana'],
      orderBy: {
        dia_semana: 'asc'
      }
    });
    return calendario;
  } catch (error) {
    console.error("Error al obtener los dias de la semana:", error);
    throw error;
  }
};

export const obtenerInformacionCalendario = async (diaSemana) => {
  try {
    const calendario = await prisma.calendariorecoleccion.findMany({
      where: {
        dia_semana: diaSemana, 
      },
      select: {
        dia_semana: true,
        hora_inicio: true,
        hora_fin: true,
        frecuencia: true,
        notas: true,
        rutas: {
          select: {
            id: true,
            nombre: true,
          }
        },
      },
    });

    return calendario;
  } catch (error) {
    console.error("Error al obtener la información del calendario:", error);
    throw error;
  }
};

export const insertarHorario = async ({ ruta_id, dia_semana, hora_inicio, hora_fin, frecuencia, notas }) => {
  try {
    // Convertir las horas a ISO-8601
    const fechaFicticia = "1970-01-01";
    const horaInicioISO = new Date(`${fechaFicticia}T${hora_inicio}:00.000Z`);
    const horaFinISO = new Date(`${fechaFicticia}T${hora_fin}:00.000Z`);
    const nuevoHorario = await prisma.calendariorecoleccion.create({
      data: {
        ruta_id,
        dia_semana,
        hora_inicio: horaInicioISO,
        hora_fin: horaFinISO,
        frecuencia,
        notas,
      },
    });
    return nuevoHorario;
  } catch (error) {
    console.error("Error al insertar horario:", error);
    throw error;
  }
};

export const calendariorecoleccion = async (req, res) => {
  try {
    const calendario = await prisma.calendariorecoleccion.findMany({
      include: {
        rutas: {
          select: {
            nombre: true, 
            zonas: {
              select: {
                nombre: true 
              }
            }
          }
        }
      }
    });

    return calendario;
  } catch (error) {
    console.error("Error al obtener el calendario:", error);
    throw error;
  }
};

// Actualizar un horario existente
export const actualizarHorario = async (id, { hora_inicio, hora_fin, frecuencia, notas }) => {
  try {
    const fechaFicticia = "1970-01-01";
    const horaInicioISO = hora_inicio ? new Date(`${fechaFicticia}T${hora_inicio}:00.000Z`) : undefined;
    const horaFinISO = hora_fin ? new Date(`${fechaFicticia}T${hora_fin}:00.000Z`) : undefined;

    const horarioActualizado = await prisma.calendariorecoleccion.update({
      where: { id },
      data: {
        hora_inicio: horaInicioISO,
        hora_fin: horaFinISO,
        frecuencia,
        notas,
      },
    });

    return horarioActualizado;
  } catch (error) {
    console.error("Error al actualizar horario:", error);
    throw error;
  }
};

// Eliminar un horario existente
export const eliminarHorario = async (id) => {
  try {
    const horarioEliminado = await prisma.calendariorecoleccion.delete({
      where: { id },
    });
    return horarioEliminado;
  } catch (error) {
    console.error("Error al eliminar horario:", error);
    throw error;
  }
};