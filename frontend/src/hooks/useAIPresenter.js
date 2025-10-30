export const useAIPresenter = () => {
  const speak = (text, options = {}) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1.1;
      utterance.volume = options.volume || 0.8;
      
      // Seleccionar voz femenina profesional para presentación
      const voices = speechSynthesis.getVoices();
      const spanishVoices = voices.filter(voice => voice.lang.includes('es'));
      const femaleVoice = spanishVoices.find(voice => 
        voice.name.includes('Maria') || 
        voice.name.includes('Paloma') ||
        voice.name.includes('Female')
      ) || spanishVoices[0];
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const presentApplication = () => {
    const presentation = [
      {
        text: "¡Bienvenidos a nuestra presentación! Soy la asistente virtual del Sistema Inteligente de Clasificación de Basura para la Municipalidad de Retalhuleu.",
        duration: 6000
      },
      {
        text: "Este innovador proyecto de seminario fue desarrollado por estudiantes comprometidos con el medio ambiente y la tecnología sostenible.",
        duration: 5000
      },
      {
        text: "Nuestro sistema permite a los ciudadanos gestionar eficientemente la clasificación y recolección de residuos mediante una plataforma web intuitiva.",
        duration: 6000
      },
      {
        text: "Los usuarios pueden consultar rutas de recolección, puntos de acopio, obtener puntos por reciclar correctamente, y participar en un ranking de colonias más ecológicas.",
        duration: 7000
      },
      {
        text: "Para los administradores municipales, ofrecemos un dashboard completo con métricas en tiempo real, gestión de usuarios, notificaciones, y herramientas de análisis.",
        duration: 7000
      },
      {
        text: "La aplicación incluye mapas interactivos, calendario de rutas, sistema de gamificación, y notificaciones automáticas para mantener informados a los ciudadanos.",
        duration: 7000
      },
      {
        text: "Este proyecto demuestra cómo la tecnología puede transformar la gestión de residuos urbanos, promoviendo una ciudad más limpia y sostenible.",
        duration: 6000
      },
      {
        text: "Gracias por su atención. Esperamos que este proyecto inspire más iniciativas tecnológicas para el cuidado del medio ambiente.",
        duration: 5000
      }
    ];

    let currentIndex = 0;
    
    const presentNext = () => {
      if (currentIndex < presentation.length) {
        const current = presentation[currentIndex];
        speak(current.text, { rate: 0.85, pitch: 1.2 });
        
        setTimeout(() => {
          currentIndex++;
          presentNext();
        }, current.duration);
      }
    };

    presentNext();
  };

  const presentCurrentPage = (pageName) => {
    const pageDescriptions = {
      login: "Bienvenidos a la página de inicio de sesión. Aquí los usuarios pueden acceder al sistema ingresando su correo electrónico y contraseña.",
      
      dashboard: "Estamos en el panel principal del sistema. Aquí pueden observar las métricas más importantes: número total de usuarios, notificaciones enviadas, centros de acopio disponibles y rutas activas. Los filtros de fecha permiten analizar datos de períodos específicos, y los gráficos muestran la clasificación de residuos y puntos por zona.",
      
      calendario: "Esta es la sección de calendario y rutas de recolección. Los ciudadanos pueden consultar aquí los días y horarios de recolección para su colonia, ver rutas programadas, y recibir recordatorios automáticos. Los administradores pueden planificar y modificar las rutas según las necesidades.",
      
      mapa: "Observamos el mapa interactivo de puntos de acopio. Aquí se muestran todos los centros de reciclaje, contenedores especiales y puntos de recolección disponibles en la municipalidad. Los usuarios pueden buscar el punto más cercano a su ubicación y ver qué tipos de residuos acepta cada centro.",
      
      ranking: "Esta es la tabla de ranking por colonias. Muestra las comunidades más participativas en el programa de reciclaje, ordenadas por puntos obtenidos. Este sistema de gamificación motiva a los ciudadanos a reciclar más y crear competencia sana entre vecindarios.",
      
      notificaciones: "En la sección de notificaciones, los administradores pueden crear y enviar alertas importantes a todos los usuarios. Pueden informar sobre cambios en horarios, eventos especiales de reciclaje, nuevos puntos de acopio, o campañas educativas ambientales.",
      
      usuarios: "Este es el panel administrativo de usuarios y roles. Solo los administradores pueden acceder aquí para gestionar cuentas de usuario, asignar permisos específicos, crear nuevos roles, y controlar el acceso a diferentes funcionalidades del sistema.",
      
      configuracion: "En configuración pueden ajustarse los parámetros generales del sistema: tipos de residuos aceptados, puntuaciones por reciclaje, frecuencias de recolección, zonas de cobertura, y otras configuraciones que personalizan el programa según las necesidades municipales."
    };

    const description = pageDescriptions[pageName] || "Esta es una sección importante de nuestra aplicación donde los usuarios pueden realizar diversas acciones relacionadas con el sistema de reciclaje.";
    
    speak(description, { rate: 0.8, pitch: 1.1 });
  };

  const stopPresentation = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  return { 
    presentApplication, 
    presentCurrentPage, 
    stopPresentation, 
    speak 
  };
};
