import OpenAI from "openai";
import fs from "fs";
import { asignarPuntosUsuario } from "./puntosPorUsuario.service.js";

/**
 * Servicio para clasificación de residuos usando IA (OpenAI Vision)
 */
class ClasificacionService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  /**
   * Convierte un archivo local a data URL (base64)
   * @param {string} absPath - Ruta absoluta del archivo
   * @param {string} mime - Tipo MIME del archivo
   * @returns {string} Data URL en formato base64
   */
  fileToDataURL(absPath, mime = "image/jpeg") {
    const buf = fs.readFileSync(absPath);
    const b64 = buf.toString("base64");
    return `data:${mime};base64,${b64}`;
  }

  /**
   * Clasifica una imagen de residuo usando OpenAI Vision
   * @param {string} filePath - Ruta del archivo de imagen
   * @param {string} mimeType - Tipo MIME de la imagen
   * @returns {Promise<Object>} Resultado de la clasificación
   */
  async clasificarImagen(filePath, mimeType, idUsuario) {
    try {
      const dataUrl = this.fileToDataURL(filePath, mimeType);

      const response = await this.openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "Eres un especialista en reciclaje y gestión de residuos. " +
                  "Tu tarea es analizar imágenes de objetos domésticos y clasificarlos en una de estas categorías:\n" +
                  "- RECICLABLE: Materiales que pueden ser reciclados (plásticos reciclables, papel, cartón, vidrio, metales)\n" +
                  "- NO_RECICLABLE: Materiales que no pueden reciclarse (plásticos no reciclables, materiales contaminados, compuestos)\n" +
                  "- ORGANICO: Residuos biodegradables de origen vegetal o animal (restos de comida, cáscaras, hojas, residuos de jardín)\n" +
                  "- INCIERTO: Cuando no puedes determinar con seguridad la categoría\n\n" +
                  "Debes identificar el material probable, el contenedor/bote apropiado, " +
                  "y los pasos de preparación (p.ej., enjuagar, retirar tapas, secar, aplastar, separar componentes). " +
                  "Si hay incertidumbre, dilo y ofrece la mejor recomendación. " +
                  "Responde SIEMPRE en español y SOLO con un JSON siguiendo exactamente este esquema:\n" +
                  "{\n" +
                  '  "categoria": "RECICLABLE|NO_RECICLABLE|ORGANICO|INCIERTO",\n' +
                  '  "material_probable": "string",\n' +
                  '  "nivel_confianza": 0.0-1.0,\n' +
                  '  "bote_sugerido": "plástico|papel-cartón|vidrio|metal|orgánico|no reciclable|punto limpio",\n' +
                  '  "instrucciones_preparacion": ["paso 1", "paso 2", "..."],\n' +
                  '  "advertencias": ["opcional"],\n' +
                  '  "notas": "opcional"\n' +
                  "}",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Analiza la imagen y clasifica el objeto en una de estas categorías: RECICLABLE, NO_RECICLABLE, ORGANICO, o INCIERTO. " +
                  "Si es un residuo orgánico (comida, cáscaras, restos vegetales), usa la categoría ORGANICO. " +
                  "Devuelve SOLO el JSON solicitado, sin texto adicional.",
              },
              {
                type: "input_image",
                image_url: dataUrl,
              },
            ],
          },
        ],
      });

      const output = response.output_text?.trim() || "";
      let parsed;

      try {
        parsed = JSON.parse(output);
      } catch (e) {
        // Intenta limpiar trailing text si viniera algo extra
        const firstBrace = output.indexOf("{");
        const lastBrace = output.lastIndexOf("}");
        if (firstBrace >= 0 && lastBrace > firstBrace) {
          parsed = JSON.parse(output.slice(firstBrace, lastBrace + 1));
        } else {
          throw new Error("No se pudo parsear el JSON de la respuesta");
        }
      }

      if (idUsuario) {
        await asignarPuntosUsuario(idUsuario, parsed);
      }

      return {
        success: true,
        result: parsed,
        raw: output,
      };
    } catch (error) {
      console.error("Error en clasificación:", error);
      throw new Error(`Error al clasificar imagen: ${error.message}`);
    }
  }

  /**
   * Elimina un archivo temporal
   * @param {string} filePath - Ruta del archivo a eliminar
   */
  async eliminarArchivo(filePath) {
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
    }
  }
}

export default new ClasificacionService();
