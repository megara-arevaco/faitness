# MCP Server

Un servidor MCP (Model Context Protocol) que expone las herramientas de la API de Faitness. Soporta dos modos de operación:

1. **Modo stdio**: Protocolo MCP estándar usando stdin/stdout
2. **Modo HTTP**: API REST HTTP para usar las herramientas via web

## Instalación

```bash
cd ai/mcp-server
npm install
npm run build
```

## Uso

### Modo stdio (Predeterminado)

```bash
# Desarrollo
npm run dev:stdio

# Producción
npm run start:stdio
```

### Modo HTTP

```bash
# Desarrollo
npm run dev:http

# Producción
npm run start:http
```

El servidor HTTP estará disponible en `http://localhost:3002`

## Endpoints HTTP

### Información del servidor

- `GET /info` - Información del servidor
- `GET /health` - Health check

### Herramientas

- `GET /tools` - Lista todas las herramientas disponibles
- `POST /tools/{toolName}` - Ejecuta una herramienta específica

### Ejemplo de uso HTTP

```bash
# Listar herramientas
curl http://localhost:3002/tools

# Crear un usuario
curl -X POST http://localhost:3002/tools/create_user \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan", "email": "juan@example.com", "password": "123456"}'

# Obtener usuarios
curl http://localhost:3002/tools/get_users
```

## Docker

### Levantar con Docker Compose

```bash
# Levantar todos los servicios (incluyendo MCP server en modo HTTP)
docker-compose up

# Solo el MCP server
docker-compose up mcp-server
```

### Levantar en modo stdio con Docker

```bash
# Para producción - cambiar el comando en docker-compose.yml a:
command: ["npm", "run", "start:stdio"]

# Para desarrollo - cambiar el comando en Dockerfile.dev a:
CMD ["npm", "run", "dev:stdio"]
```

### Desarrollo con Docker

```bash
# Usar docker-compose.dev.yml para desarrollo (modo HTTP)
docker-compose -f docker-compose.dev.yml up mcp-server
```

### Variables de entorno

- `PORT`: Puerto para el servidor HTTP (default: 3002)
- `API_BASE_URL`: URL base de la API backend (default: http://localhost:3001)
- `NODE_ENV`: Entorno de ejecución

## Herramientas disponibles

El servidor expone las siguientes herramientas:

### Usuarios

- `create_user` - Crear usuario
- `get_users` - Obtener todos los usuarios
- `get_user` - Obtener usuario por ID
- `update_user` - Actualizar usuario
- `delete_user` - Eliminar usuario

### Ejercicios

- `get_exercises` - Obtener ejercicios
- `get_exercise` - Obtener ejercicio por ID
- `create_exercise` - Crear ejercicio
- `update_exercise` - Actualizar ejercicio
- `delete_exercise` - Eliminar ejercicio

### Ingredientes

- `get_ingredients` - Obtener ingredientes
- `get_ingredient` - Obtener ingrediente por ID
- `create_ingredient` - Crear ingrediente
- `update_ingredient` - Actualizar ingrediente
- `delete_ingredient` - Eliminar ingrediente

### Comidas

- `get_meals` - Obtener comidas
- `get_meal` - Obtener comida por ID
- `create_meal` - Crear comida
- `update_meal` - Actualizar comida
- `delete_meal` - Eliminar comida

### Días de comida

- `get_meal_days` - Obtener días de comida
- `get_meal_day` - Obtener día de comida por ID
- `create_meal_day` - Crear día de comida
- `update_meal_day` - Actualizar día de comida
- `delete_meal_day` - Eliminar día de comida

### Sets

- `get_sets` - Obtener sets
- `get_set` - Obtener set por ID
- `create_set` - Crear set
- `update_set` - Actualizar set
- `delete_set` - Eliminar set

### Entrenamientos

- `get_workouts` - Obtener entrenamientos
- `get_workout` - Obtener entrenamiento por ID
- `create_workout` - Crear entrenamiento
- `update_workout` - Actualizar entrenamiento
- `delete_workout` - Eliminar entrenamiento

## Desarrollo

Para desarrollo local:

```bash
# Instalar dependencias
npm install

# Modo desarrollo stdio
npm run dev:stdio

# Modo desarrollo HTTP
npm run dev:http

# Compilar TypeScript
npm run build
```
