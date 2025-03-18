import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine.base import Engine

load_dotenv()


def get_conn_string(
    user: str = os.getenv("USER"),
    pwd: str = os.getenv("PASSWORD"),
    dbname: str = os.getenv("DB"),
    host: str = os.getenv("HOST"),
) -> str:
    return f"postgresql+asyncpg://{user}:{pwd}@{host}/{dbname}"


def get_async_db_connection_engine() -> Engine:
    conn_string = get_conn_string()

    engine = create_engine(conn_string)

    return engine
