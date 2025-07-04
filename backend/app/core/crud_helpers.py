from typing import List, Optional, Type, TypeVar, Any, Callable
from fastapi import Depends, HTTPException
from database.db import get_db_connection
from app.core.exceptions import NotFoundError, ConflictError, DatabaseError
from psycopg2 import OperationalError, IntegrityError
import logging

logger = logging.getLogger(__name__)

T = TypeVar('T')

def safe_db_operation(operation_name: str):
    """Decorador para manejar operaciones de base de datos con manejo de errores"""
    def decorator(func: Callable):
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

def get_all_items(table_name: str, columns: List[str], model_class: Type[T]) -> List[T]:
    """Generic function to get all items from a table"""
    @safe_db_operation(f"get_all_{table_name}")
    def _get_all(db=Depends(get_db_connection)):
        cursor = db.cursor()
        cursor.execute(f"SELECT {', '.join(columns)} FROM {table_name}")
        items = cursor.fetchall()
        cursor.close()
        return [model_class(*item) for item in items]
    
    return _get_all()

def get_item_by_id(table_name: str, columns: List[str], model_class: Type[T], item_id: int) -> T:
    """Generic function to get an item by ID"""
    @safe_db_operation(f"get_{table_name}_by_id")
    def _get_by_id(db=Depends(get_db_connection)):
        cursor = db.cursor()
        cursor.execute(f"SELECT {', '.join(columns)} FROM {table_name} WHERE id = %s", (item_id,))
        item = cursor.fetchone()
        cursor.close()
        
        if item is None:
            raise NotFoundError(table_name.capitalize())
        
        return model_class(*item)
    
    return _get_by_id()

def create_item(table_name: str, insert_columns: List[str], model_class: Type[T], **data) -> T:
    """Generic function to create an item"""
    @safe_db_operation(f"create_{table_name}")
    def _create(db=Depends(get_db_connection)):
        cursor = db.cursor()
        placeholders = ', '.join(['%s'] * len(insert_columns))
        columns_str = ', '.join(insert_columns)
        values = [data[col] for col in insert_columns]
        
        cursor.execute(
            f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders}) RETURNING id",
            values
        )
        item_id = cursor.fetchone()[0]
        db.commit()
        cursor.close()
        
        # Build return object with generated ID
        return model_class(id=item_id, **data)
    
    return _create() 