#!/bin/bash

# Faitness Development Environment Script

case "$1" in
    "start")
        echo "🚀 Starting Faitness development environment..."
        docker compose -f docker-compose.dev.yml up --build
        ;;
    "stop")
        echo "🛑 Stopping Faitness development environment..."
        docker compose -f docker-compose.dev.yml down
        ;;
    "restart")
        echo "🔄 Restarting Faitness development environment..."
        docker compose -f docker-compose.dev.yml down
        docker compose -f docker-compose.dev.yml up --build
        ;;
    "logs")
        echo "📋 Showing logs for all services..."
        docker compose -f docker-compose.dev.yml logs -f
        ;;
    "backend")
        echo "📋 Showing backend logs..."
        docker compose -f docker-compose.dev.yml logs -f backend
        ;;
    "frontend")
        echo "📋 Showing frontend logs..."
        docker compose -f docker-compose.dev.yml logs -f frontend
        ;;
    "db")
        echo "📋 Showing database logs..."
        docker compose -f docker-compose.dev.yml logs -f database
        ;;
    "clean")
        echo "🧹 Cleaning up development environment..."
        docker compose -f docker-compose.dev.yml down -v
        docker system prune -f
        ;;
    "shell-backend")
        echo "🐚 Opening shell in backend container..."
        docker compose -f docker-compose.dev.yml exec backend sh
        ;;
    "shell-frontend")
        echo "🐚 Opening shell in frontend container..."
        docker compose -f docker-compose.dev.yml exec frontend sh
        ;;
    "shell-db")
        echo "🐚 Opening shell in database container..."
        docker compose -f docker-compose.dev.yml exec database psql -U postgres -d faitness
        ;;
    *)
        echo "🔧 Faitness Development Environment"
        echo "Usage: $0 {start|stop|restart|logs|backend|frontend|db|clean|shell-backend|shell-frontend|shell-db}"
        echo ""
        echo "Commands:"
        echo "  start          - Start all services in development mode"
        echo "  stop           - Stop all services"
        echo "  restart        - Restart all services"
        echo "  logs           - Show logs for all services"
        echo "  backend        - Show backend logs"
        echo "  frontend       - Show frontend logs"
        echo "  db             - Show database logs"
        echo "  clean          - Clean up containers and volumes"
        echo "  shell-backend  - Open shell in backend container"
        echo "  shell-frontend - Open shell in frontend container"
        echo "  shell-db       - Open PostgreSQL shell"
        echo ""
        echo "Development URLs:"
        echo "  Frontend: http://localhost:5173"
        echo "  Backend:  http://localhost:3001"
        echo "  API Docs: http://localhost:3001/docs"
        echo "  Database: localhost:5432"
        ;;
esac