from typing import Callable
from functools import wraps
from fastapi import HTTPException
from app.core.exceptions import DatabaseError, ConflictError, NotFoundError
from psycopg2 import OperationalError, IntegrityError
import logging

logger = logging.getLogger(__name__)

def handle_db_errors(operation_name: str):
    """Decorator to handle database errors"""
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except OperationalError as e:
                logger.error(f"Database connection error in {operation_name}: {e}")
                raise DatabaseError("Unable to connect to database")
            except IntegrityError as e:
                logger.error(f"Integrity error in {operation_name}: {e}")
                if "foreign key" in str(e).lower():
                    raise ConflictError("Referenced resource does not exist")
                elif "unique constraint" in str(e).lower():
                    raise ConflictError("Resource already exists")
                elif "check constraint" in str(e).lower():
                    raise ConflictError("Invalid data provided")
                raise ConflictError("Data integrity constraint violated")
            except Exception as e:
                logger.error(f"Unexpected error in {operation_name}: {e}")
                raise HTTPException(status_code=500, detail="Internal server error")
        return wrapper
    return decorator

def handle_not_found(resource_name: str):
    """Decorator to handle not found resources"""
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except NotFoundError:
                raise
            except TypeError as e:
                if "NoneType" in str(e):
                    raise NotFoundError(resource_name)
                raise
        return wrapper
    return decorator

def with_transaction_rollback():
    """Decorator to handle transaction rollback on error"""
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except (IntegrityError, OperationalError):
                # Look for DB connection in arguments
                for arg in args:
                    if hasattr(arg, 'rollback'):
                        arg.rollback()
                        break
                for value in kwargs.values():
                    if hasattr(value, 'rollback'):
                        value.rollback()
                        break
                raise
        return wrapper
    return decorator 