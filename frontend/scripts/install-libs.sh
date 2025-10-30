#!/usr/bin/env bash
set -e

echo "Instalando dependencias: react-leaflet y leaflet..."
if [ -f package-lock.json ] || [ -d node_modules ]; then
  echo "Usando npm"
  npm install react-leaflet leaflet
else
  echo "Usando npm por defecto"
  npm install react-leaflet leaflet
fi

echo
echo "Instalación completada."
echo
echo "PASOS ADICIONALES (necesarios):"
echo "1) Importa el CSS de Leaflet en tu entrypoint (src/main.jsx, src/index.jsx o similar):"
echo "   Añade esta línea al inicio del archivo JS principal:"
echo "     import 'leaflet/dist/leaflet.css';"
echo
echo "2) Reinicia el servidor de desarrollo (npm start o tu comando habitual)."
echo
echo "Si quieres aplicar la importación automáticamente (Linux/macOS), puedes ejecutar:"
echo "  ENTRY=src/main.jsx"
echo "  if [ -f \"$ENTRY\" ]; then echo \"import 'leaflet/dist/leaflet.css';\" | cat - \"$ENTRY\" > /tmp/$$ && mv /tmp/$$ \"$ENTRY\" && echo \"Importada en $ENTRY\"; else echo \"No se encontró $ENTRY - añade la importación manualmente en tu entrypoint.\"; fi"
