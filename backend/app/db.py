"""
SQLite database setup (SQLAlchemy).

Used for local development only. The database lives at
backend/data/dermaai.db and is never exposed to the API client.
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app import config

# Ensure the data directory exists before the engine connects.
config.DATA_DIR.mkdir(parents=True, exist_ok=True)

# check_same_thread=False allows the SQLite connection to be shared
# across FastAPI's async/threadpool usage during development. The
# busy timeout avoids "database is locked" errors under light
# concurrent writes.
engine = create_engine(
    config.DATABASE_URL,
    connect_args={
        "check_same_thread": False,
        "timeout": 30,
    },
)


@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    """
    Apply safe SQLite pragmas on every new connection.

    foreign_keys=ON enforces referential integrity (Scan.user_id ->
    users.id). WAL journaling allows concurrent reads during writes.
    """
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA journal_mode=WAL")
    finally:
        cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    class_=Session,
)


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""


def init_db() -> None:
    """
    Create all tables if they do not exist yet.

    Safe to call on every startup: existing tables are left intact,
    so data survives a backend restart.

    Also runs an idempotent lightweight migration that adds the
    user_id column to a pre-existing Phase 16 "scans" table (legacy
    scans keep user_id NULL and are treated as unowned records).
    """
    from app import models  # noqa: F401  (registers models)

    Base.metadata.create_all(bind=engine)

    _migrate_scan_user_id()


def _migrate_scan_user_id() -> None:
    """
    Add the user_id column + index to an existing "scans" table if it
    is missing. Legacy rows remain untouched (user_id stays NULL).
    """
    with engine.begin() as connection:
        columns = [
            row[1]
            for row in connection.exec_driver_sql(
                "PRAGMA table_info(scans)"
            )
        ]

        if "user_id" not in columns:
            connection.exec_driver_sql(
                "ALTER TABLE scans ADD COLUMN user_id INTEGER"
            )

        connection.exec_driver_sql(
            "CREATE INDEX IF NOT EXISTS ix_scans_user_id "
            "ON scans (user_id)"
        )


def get_db():
    """
    FastAPI dependency: yield a session and always close it.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()