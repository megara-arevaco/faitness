from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from psycopg2 import OperationalError, IntegrityError
import logging

logger = logging.getLogger(__name__)

def setup_error_handlers(app: FastAPI):
    @app.exception_handler(OperationalError)
    async def database_connection_error(request: Request, exc: OperationalError):
        logger.error(f"Database connection error: {exc}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"detail": "Database service unavailable"}
        )

    @app.exception_handler(IntegrityError)
    async def database_integrity_error(request: Request, exc: IntegrityError):
        logger.error(f"Database integrity error: {exc}")
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": "Data integrity constraint violated"}
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"}
        ) 