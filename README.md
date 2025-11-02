# Proyecto Reciclaje Inteligente

Estructura inicial del proyecto de seminario.

#pasos para correr este proyecto con docker
# 1. Instalar Docker
# Para instalar Docker, sigue las instrucciones en la [documentación oficial de Docker](https://docs.docker.com/get-docker/).
# 2. Clonar el repositorio en la rama devBackend
git clone -b devBackend https://github.com/tu_usuario/tu_repositorio.git
# 3. Crear un archivo .env en la raíz de la carpeta backend y agregar las variables de entorno necesarias
# 4. Correr con docker-compose
docker-compose up --build
# 5. Si algunos endpoints falla debe correr el comando localmente
dentro de la carpeta
Backend/
#correr el comando 
npx generate
# 6. Acceder a la aplicación
Abre tu navegador web y ve a `http://localhost:3000` para ver la aplicación en funcionamiento.