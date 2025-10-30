Param()
Write-Host "Instalando dependencias: react-leaflet y leaflet..." -ForegroundColor Cyan

# Ejecuta npm install
npm install react-leaflet leaflet

Write-Host "Instalación completada." -ForegroundColor Green
Write-Host ""
Write-Host "PASOS ADICIONALES (necesarios):" -ForegroundColor Yellow
Write-Host "1) Importa el CSS de Leaflet en tu entrypoint (src/main.jsx, src/index.jsx o similar):"
Write-Host "   Añade esta línea al inicio del archivo JS principal:"
Write-Host "     import 'leaflet/dist/leaflet.css';"
Write-Host ""
Write-Host "2) Reinicia el servidor de desarrollo (npm start o tu comando habitual)."
Write-Host ""
Write-Host "Para insertar la importación automáticamente (si src\\main.jsx existe), puede usar:"
Write-Host "  $entry = 'src\\main.jsx'"
Write-Host "  if (Test-Path $entry) { (\"import 'leaflet/dist/leaflet.css';`n\" + (Get-Content $entry -Raw)) | Set-Content $entry; Write-Host 'Importada en' $entry } else { Write-Host 'No se encontró' $entry }" -ForegroundColor Gray
