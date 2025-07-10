FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (solo producción)
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto (aunque MCP usa stdio, lo exponemos por si necesitamos debug)
EXPOSE 3002

# Comando para producción
CMD ["npm", "start"]