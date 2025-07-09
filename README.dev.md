# Faitness - Development Environment

Este proyecto incluye un entorno de desarrollo completo con Docker que permite hot reload automático para cambios en el código.

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker
- Docker Compose

### Comandos de Desarrollo

```bash
# Iniciar el entorno de desarrollo
./dev.sh start

# Parar el entorno
./dev.sh stop

# Reiniciar el entorno
./dev.sh restart

# Ver logs de todos los servicios
./dev.sh logs

# Ver logs específicos
./dev.sh backend   # Logs del backend
./dev.sh frontend  # Logs del frontend
./dev.sh db        # Logs de la base de datos

# Limpiar el entorno
./dev.sh clean

# Acceder a shells
./dev.sh shell-backend   # Shell del contenedor backend
./dev.sh shell-frontend  # Shell del contenedor frontend
./dev.sh shell-db        # Shell de PostgreSQL
```

## 🌐 URLs de Desarrollo

Una vez iniciado el entorno, puedes acceder a:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Documentación API**: http://localhost:3001/docs
- **Base de datos**: localhost:5432

## 📁 Estructura del Proyecto

```
faitness/
├── backend/                 # API Fastify + TypeScript
│   ├── Dockerfile.dev      # Dockerfile para desarrollo
│   ├── api/
│   │   ├── routes/         # Rutas de la API
│   │   └── schemas/        # Schemas de validación Zod
│   └── database/           # Configuración de base de datos
├── frontend/               # Frontend React + Vite
│   ├── Dockerfile.dev      # Dockerfile para desarrollo
│   └── src/
├── docker-compose.dev.yml  # Configuración de desarrollo
└── dev.sh                 # Script de utilidades
```

## 🔄 Hot Reload

El entorno está configurado para hot reload automático:

### Backend
- Usa `tsx watch` para reiniciar automáticamente el servidor cuando cambias archivos TypeScript
- Los cambios se reflejan inmediatamente sin necesidad de reconstruir el contenedor

### Frontend
- Vite proporciona hot reload nativo
- Los cambios en React se actualizan instantáneamente en el navegador

## 🗄️ Base de Datos

- **PostgreSQL 15** con datos persistentes
- Se inicializa automáticamente con el schema en `backend/database/sql/`
- Acceso directo con: `./dev.sh shell-db`

## 🔧 Configuración

### Variables de Entorno
El entorno de desarrollo usa estas variables por defecto:

```env
# Backend
DATABASE_HOST=database
DATABASE_PORT=5432
DATABASE_NAME=faitness
DATABASE_USER=postgres
DATABASE_PASSWORD=password
PORT=3001
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3001
```

### Puertos
- **Frontend**: 5173
- **Backend**: 3001
- **Base de datos**: 5432

## 🛠️ Desarrollo

### Agregar nuevas dependencias

**Backend:**
```bash
./dev.sh shell-backend
npm install nueva-dependencia
```

**Frontend:**
```bash
./dev.sh shell-frontend
npm install nueva-dependencia
```

### Ejecutar comandos específicos

```bash
# Ejecutar tests en el backend
./dev.sh shell-backend
npm test

# Ejecutar linting en el frontend
./dev.sh shell-frontend
npm run lint
```

## 📋 API Endpoints

Con el entorno corriendo, puedes acceder a la documentación completa de la API en:
**http://localhost:3001/docs**

### Principales endpoints:
- `GET/POST/PUT/DELETE /api/users` - Gestión de usuarios
- `GET/POST/PUT/DELETE /api/workouts` - Gestión de entrenamientos
- `GET/POST/PUT/DELETE /api/exercises` - Gestión de ejercicios
- `GET/POST/PUT/DELETE /api/sets` - Gestión de series
- `GET/POST/PUT/DELETE /api/meals` - Gestión de comidas
- `GET/POST/PUT/DELETE /api/ingredients` - Gestión de ingredientes
- `GET/POST/PUT/DELETE /api/meal-days` - Gestión de días de comida

## 🐛 Troubleshooting

### Problemas comunes:

1. **Puerto ya en uso**: Asegúrate de que los puertos 3001, 5173 y 5432 estén disponibles
2. **Permisos de Docker**: Puede necesitar `sudo` según tu configuración
3. **Cambios no se reflejan**: Verifica que los volúmenes estén montados correctamente

### Reinicio completo:
```bash
./dev.sh clean
./dev.sh start
```

## 🎯 Características del Entorno

✅ **Hot Reload**: Cambios instantáneos en código
✅ **Validación Zod**: Validación robusta de datos
✅ **Documentación automática**: Swagger UI generado
✅ **TypeScript**: Tipado estático en frontend y backend
✅ **Base de datos persistente**: Datos conservados entre reinicios
✅ **Logs centralizados**: Fácil debugging
✅ **Shells de desarrollo**: Acceso directo a contenedores