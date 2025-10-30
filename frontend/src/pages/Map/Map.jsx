import React, { useEffect } from 'react';
import { useAIPresenter } from "../../hooks/useAIPresenter";
import VoiceControl from "../../components/VoiceControl/VoiceControl";

export default function Map() {
  const { presentCurrentPage, stopPresentation } = useAIPresenter();

  useEffect(() => {
    const timer = setTimeout(() => {
      presentCurrentPage('mapa');
    }, 1000);

    return () => {
      clearTimeout(timer);
      stopPresentation();
    };
  }, []);

  return (
    <div>
      <VoiceControl />
      <h1>Puntos de Acopio</h1>
      {/* Contenido del mapa */}
    </div>
  );
}
