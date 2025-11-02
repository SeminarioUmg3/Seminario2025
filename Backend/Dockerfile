FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Solo generar el cliente de Prisma si existe schema.prisma
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

EXPOSE 8000

CMD ["npm", "start"]
