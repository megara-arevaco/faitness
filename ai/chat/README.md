# 🦙 Ollama CLI

Una interfaz de línea de comandos (CLI) interactiva para chatear con Ollama, construida con TypeScript y Node.js.

## 📋 Características

- 💬 **Chat interactivo** con modelos de Ollama
- 🔄 **Cambio dinámico de modelos** durante la conversación
- 📝 **Gestión de historial** de conversaciones
- 🎨 **Interfaz colorida** y fácil de usar
- ⚡ **Comandos útiles** para gestionar modelos
- 🔧 **Configuración flexible** de parámetros

## 🚀 Instalación

### Prerrequisitos

1. **Node.js** (versión 18 o superior)
2. **Ollama** instalado y ejecutándose

### Instalar Ollama

```bash
# En macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# En Windows
# Descargar desde https://ollama.com/download
```

### Instalar el CLI

```bash
# Clonar el repositorio (o navegar al directorio)
cd ai/chat

# Instalar dependencias
npm install

# Compilar el proyecto
npm run build

# Instalar globalmente (opcional)
npm link
```

## 🎯 Uso

### Comandos Disponibles

#### 1. Chat Interactivo

```bash
# Chat básico
ollama-cli chat

# Chat con modelo específico
ollama-cli chat -m llama2

# Chat con configuración personalizada
ollama-cli chat -m codellama -t 0.5 -u http://localhost:11434
```

**Opciones para el comando `chat`:**
- `-m, --model <model>`: Modelo a utilizar (por defecto: llama2)
- `-t, --temperature <temp>`: Temperatura para la generación 0.0-1.0 (por defecto: 0.7)
- `-u, --url <url>`: URL base de Ollama (por defecto: http://localhost:11434)

#### 2. Verificar Estado

```bash
# Verificar conexión con Ollama
ollama-cli health

# Con URL personalizada
ollama-cli health -u http://localhost:11434
```

### Comandos del Chat Interactivo

Dentro del chat, puedes usar los siguientes comandos especiales:

- `/help` - Muestra la ayuda
- `/clear` - Limpia el historial de conversación
- `/history` - Muestra el historial completo
- `/model` - Cambiar el modelo actual
- `/exit` - Salir del chat

## 📂 Estructura del Proyecto

```
ai/chat/
├── package.json          # Configuración del proyecto
├── tsconfig.json         # Configuración de TypeScript
├── README.md            # Este archivo
├── src/
│   ├── index.ts         # Punto de entrada principal
│   ├── types/
│   │   └── index.ts     # Definiciones de tipos
│   ├── chat/
│   │   ├── OllamaClient.ts   # Cliente principal de Ollama
│   │   └── ChatManager.ts    # Gestor de chat interactivo
│   └── utils/
│       └── ollama-api.ts     # Utilidades de API REST
└── dist/                # Archivos compilados (generado)
```

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo con recarga automática
npm run dev

# Compilar para producción
npm run build

# Ejecutar versión compilada
npm start

# Ejecutar directamente con ts-node
npx ts-node src/index.ts chat
```

### Modo Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev chat -m llama2

# O directamente con ts-node
npx ts-node src/index.ts chat -m llama2
```

## 📚 Ejemplos de Uso

### Ejemplo 1: Chat Básico

```bash
$ ollama-cli chat
🦙 Bienvenido al CLI de Ollama
Escribe '/help' para ver los comandos disponibles
Escribe '/exit' para salir

✔ Conectado exitosamente. Modelo actual: llama2

? Tú: Hola, ¿cómo estás?
🦙 llama2: ¡Hola! Estoy muy bien, gracias por preguntar. Soy una IA asistente y estoy aquí para ayudarte con cualquier pregunta o tarea que tengas. ¿En qué puedo ayudarte hoy?

? Tú: /model
? Ingresa el nombre del nuevo modelo: codellama
✔ Modelo cambiado exitosamente a: codellama

? Tú: /exit
¡Hasta luego!
```

### Ejemplo 2: Verificar Estado

```bash
$ ollama-cli health
✔ Ollama está funcionando correctamente en http://localhost:11434
✅ El servidor está listo para recibir mensajes
```

## 🛠️ Configuración Avanzada

### Variables de Entorno

Puedes configurar el CLI usando variables de entorno:

```bash
export OLLAMA_HOST=http://localhost:11434
export OLLAMA_DEFAULT_MODEL=llama2
export OLLAMA_TEMPERATURE=0.7
```

### Configuración de Modelos

El CLI soporta todos los modelos disponibles en Ollama:

- **Modelos de propósito general**: llama2, mistral, phi
- **Modelos de código**: codellama, deepseek-coder
- **Modelos matemáticos**: deepseek-math
- **Y muchos más...**

## 🐛 Solución de Problemas

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error: "Cannot connect to Ollama"

```bash
# Verificar que Ollama esté ejecutándose
ollama serve

# Verificar conexión
ollama-cli health
```

### Error: "Model not found"

```bash
# Verificar que el modelo esté disponible en Ollama
ollama list

# Descargar el modelo necesario directamente con Ollama
ollama pull llama2
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🙏 Agradecimientos

- [Ollama](https://ollama.com/) por la plataforma de LLMs
- [Commander.js](https://github.com/tj/commander.js/) por el framework CLI
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) por las prompts interactivas
- [Chalk](https://github.com/chalk/chalk) por los colores en terminal
- [Ora](https://github.com/sindresorhus/ora) por los spinners de carga

---

¡Disfruta chateando con Ollama! 🚀