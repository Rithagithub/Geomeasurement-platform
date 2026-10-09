from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings
from app.core.logging import logger

db_url = settings.sqlalchemy_database_url
engine_args = {}

if db_url.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}
    engine = create_engine(db_url, pool_pre_ping=True, **engine_args)
else:
    try:
        engine = create_engine(db_url, pool_pre_ping=True)
        # Test database connectivity
        with engine.connect() as conn:
            pass
    except Exception:
        logger.warning(
            "Local PostgreSQL server is not reachable on port 5432. "
            "Automatically falling back to local SQLite database (geomeasurement.db) for seamless local execution."
        )
        sqlite_url = "sqlite:///./geomeasurement.db"
        engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency for providing a SQLAlchemy database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
